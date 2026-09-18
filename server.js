
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARES
// =====================================================

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(__dirname));

// =====================================================
// MYSQL
// =====================================================

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "sistema_login",
    port: Number(process.env.DB_PORT || 3306),

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testar conexão com o banco
pool.getConnection()
    .then((conn) => {
        console.log("✅ Conexão com o MySQL realizada com sucesso!");
        conn.release();
    })
    .catch((err) => {
        console.error(
            "⚠️ ALERTA: Não foi possível conectar ao MySQL:",
            err.message
        );
    });

// =====================================================
// ROTA PRINCIPAL
// =====================================================

app.get("/", (req, res) => {
    const caminhoIndex = path.join(__dirname, "index.html");

    if (fs.existsSync(caminhoIndex)) {
        res.sendFile(caminhoIndex);
    } else {
        res.status(404).send("index.html não encontrado.");
    }
});

// =====================================================
// ROTA DO PORTFÓLIO
// =====================================================

app.get("/port.html", (req, res) => {
    const caminhoPort = path.join(__dirname, "port.html");

    if (fs.existsSync(caminhoPort)) {
        res.sendFile(caminhoPort);
    } else {
        res.status(404).send("port.html não encontrado.");
    }
});

// =====================================================
// TESTE DA API
// =====================================================

app.get("/api/status", (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "Back-end funcionando!"
    });
});

// =====================================================
// LOGIN
// =====================================================

app.post("/login", async (req, res) => {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "CPF e senha são obrigatórios."
        });
    }

    try {
        const [linhas] = await pool.execute(
            "SELECT * FROM usuarios WHERE cpf = ?",
            [cpf]
        );

        if (linhas.length === 0) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Usuário não encontrado!"
            });
        }

        const usuario = linhas[0];

        let senhaValida = false;

        if (
            typeof usuario.senha === "string" &&
            (
                usuario.senha.startsWith("$2b$") ||
                usuario.senha.startsWith("$2a$")
            )
        ) {
            senhaValida = await bcrypt.compare(
                senha,
                usuario.senha
            );
        } else {
            senhaValida = senha === usuario.senha;
        }

        if (!senhaValida) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Senha incorreta!"
            });
        }

        return res.json({
            sucesso: true,
            mensagem: "Login efetuado com sucesso!"
        });

    } catch (erro) {
        console.error("Erro no login:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno no servidor."
        });
    }
});

// =====================================================
// CADASTRO
// =====================================================

app.post("/cadastro", async (req, res) => {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "CPF e senha são obrigatórios."
        });
    }

    if (!/^\d{11}$/.test(cpf)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "CPF deve ter exatamente 11 números."
        });
    }

    try {
        const [existentes] = await pool.execute(
            "SELECT id FROM usuarios WHERE cpf = ?",
            [cpf]
        );

        if (existentes.length > 0) {
            return res.status(409).json({
                sucesso: false,
                mensagem: "Esse CPF já está cadastrado."
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await pool.execute(
            "INSERT INTO usuarios (cpf, senha) VALUES (?, ?)",
            [cpf, senhaCriptografada]
        );

        return res.json({
            sucesso: true,
            mensagem: "Cadastro realizado com sucesso!"
        });

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno no servidor."
        });
    }
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor ativo na porta ${PORT}`);
});


require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================
// STATUS DO SERVIDOR
// ==========================================

app.get("/api/status", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            ok: true,
            servidor: "online",
            banco: "conectado"
        });

    } catch (erro) {

        console.error("Erro no banco:", erro.message);

        res.status(500).json({
            ok: false,
            servidor: "online",
            banco: "offline"
        });
    }
});

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {

    const arquivo = path.join(__dirname, "index.html");

    if (fs.existsSync(arquivo)) {
        res.sendFile(arquivo);
    } else {
        res.status(404).send("index.html não encontrado.");
    }

});

// ==========================================
// LOGIN
// ==========================================

app.post("/login", async (req, res) => {

    const { cpf, senha } = req.body;

    if (!cpf || !senha) {

        return res.status(400).json({
            sucesso: false,
            mensagem: "CPF e senha são obrigatórios."
        });
    }

    try {

        const [usuarios] = await pool.execute(
            "SELECT * FROM usuarios WHERE cpf = ?",
            [cpf]
        );

        if (usuarios.length === 0) {

            return res.status(401).json({
                sucesso: false,
                mensagem: "Usuário não encontrado!"
            });
        }

        const usuario = usuarios[0];

        let senhaValida = false;

        if (
            usuario.senha.startsWith("$2b$") ||
            usuario.senha.startsWith("$2a$")
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

        console.error("Erro no login:", erro.message);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno no servidor."
        });
    }

});

// ==========================================
// CADASTRO
// ==========================================

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

        const senhaCriptografada =
            await bcrypt.hash(senha, 10);

        await pool.execute(
            "INSERT INTO usuarios (cpf, senha) VALUES (?, ?)",
            [cpf, senhaCriptografada]
        );

        return res.json({
            sucesso: true,
            mensagem: "Cadastro realizado com sucesso!"
        });

    } catch (erro) {

        console.error("Erro no cadastro:", erro.message);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno no servidor."
        });
    }

});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `🚀 Servidor ativo na porta ${PORT}`
    );

});
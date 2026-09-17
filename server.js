require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos da pasta do projeto
app.use(express.static(__dirname));

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'sistema_login',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(conn => {
        console.log('✅ Conexão com o MySQL realizada com sucesso!');
        conn.release();
    })
    .catch(err => {
        console.error('⚠️ ALERTA: Não foi possível conectar ao MySQL.', err.message);
    });

// Rota Principal (Login)
app.get('/', (req, res) => {
    const caminhoIndex = path.join(__dirname, 'index.html');
    if (fs.existsSync(caminhoIndex)) {
        res.sendFile(caminhoIndex);
    } else {
        res.status(404).send(`❌ O arquivo index.html não foi encontrado na pasta: ${__dirname}`);
    }
});

// Rota do Portfólio
app.get('/port.html', (req, res) => {
    const caminhoPort = path.join(__dirname, 'port.html');
    if (fs.existsSync(caminhoPort)) {
        res.sendFile(caminhoPort);
    } else {
        res.status(404).send(`❌ O arquivo port.html não foi encontrado na pasta: ${__dirname}`);
    }
});

// Rota de Autenticação
app.post('/login', async (req, res) => {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: 'CPF e senha são obrigatórios.' });
    }

    try {
        const [linhas] = await pool.execute('SELECT * FROM usuarios WHERE cpf = ?', [cpf]);

        if (linhas.length === 0) {
            return res.status(401).json({ sucesso: false, mensagem: 'Usuário não encontrado!' });
        }

        const usuario = linhas[0];
        let senhaValida = false;

        if (usuario.senha.startsWith('$2b$') || usuario.senha.startsWith('$2a$')) {
            senhaValida = await bcrypt.compare(senha, usuario.senha);
        } else {
            senhaValida = (senha === usuario.senha);
        }

        if (senhaValida) {
            return res.json({ sucesso: true, mensagem: 'Login efetuado com sucesso!' });
        } else {
            return res.status(401).json({ sucesso: false, mensagem: 'Senha incorreta!' });
        }
    } catch (erro) {
        console.error('Erro de requisição:', erro.message);
        return res.status(500).json({ sucesso: false, mensagem: `Erro no MySQL: ${erro.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor ativo em: http://localhost:${PORT}`);
});

# Back-end (API de Login)

Contém `server.js`, `package.json`, `sistema_login.sql`, `.env.example` e `.gitignore`.
Isso precisa rodar num ambiente com **Node.js** — o GitHub Pages NÃO serve para isso.

## Rodar localmente
```bash
npm install
```
1. Crie o banco: rode o arquivo `sistema_login.sql` no seu MySQL.
2. Copie `.env.example` para `.env` e preencha com os dados do seu MySQL.
3. Inicie:
   ```bash
   node server.js
   ```
4. A API sobe em `http://localhost:3000`.

## Publicar de verdade (Render, gratuito)

### Parte 1 — Banco de dados (db4free.net)
1. Crie uma conta grátis em https://www.db4free.net (Sign up) e confirme pelo e-mail.
2. Acesse https://www.db4free.net/phpMyAdmin/, faça login, vá na aba "SQL", cole o
   conteúdo do `sistema_login.sql` e execute.
3. Anote: `DB_HOST=db4free.net`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (os que você
   escolheu no cadastro) e `DB_PORT=3306`.

### Parte 2 — Back-end (Render)
1. Suba esta pasta (`backend/`) como um repositório no GitHub.
2. Em https://render.com, clique em "New +" → "Blueprint" e conecte o repositório —
   o arquivo `render.yaml` que já está aqui preenche a configuração sozinho
   (build/start command, plano free). Se preferir manual, crie um "Web Service" com
   Build command `npm install` e Start command `node server.js`.
3. Quando pedir as variáveis de ambiente, cole os 5 valores que você anotou na Parte 1.
4. Clique em criar/deploy e espere terminar (2–5 min).
5. Ao final, o Render mostra uma URL no topo, tipo
   `https://sistema-login-api.onrender.com`. Copie essa URL.

### Parte 3 — Front-end
Abra `login.js` (na pasta `frontend/`) e troque a linha `API_URL_PRODUCAO` por essa
URL. Depois suba a pasta `frontend/` no GitHub Pages.

> Dica: no plano grátis do Render o serviço "dorme" sem uso e demora ~30-50s pra
> acordar na primeira requisição — é normal, não é erro.

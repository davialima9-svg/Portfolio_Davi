# Sistema de Login

## Por que o login não funciona no GitHub?

O GitHub (e o GitHub Pages) só hospeda arquivos **estáticos** (HTML, CSS, JS de front-end).
Ele **não executa código Node.js**, então o `server.js` nunca roda lá — por isso o site
sempre mostra "Servidor Node.js offline".

Para o login funcionar sem precisar rodar nada na sua máquina, o back-end (`server.js` +
banco MySQL) precisa estar hospedado em outro lugar que execute Node.js.

---

## Opção 1 — Usar apenas localmente (mais simples)

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie o banco de dados: abra o MySQL e rode o arquivo `sistema_login.sql`.
3. Copie `.env.example` para `.env` e ajuste usuário/senha do seu MySQL.
4. Rode o servidor:
   ```bash
   node server.js
   ```
5. Acesse `http://localhost:3000` no navegador.

Esse é o modo que já funcionava antes — continua igual, só que agora usando `.env`
em vez de senha fixa no código.

---

## Opção 2 — Publicar de verdade (front + back no ar, sem precisar rodar nada local)

### Passo 1: Hospedar o back-end (Render, gratuito)
1. Crie uma conta em https://render.com
2. Crie um **Web Service** novo, conectando este repositório do GitHub.
3. Configure:
   - Build command: `npm install`
   - Start command: `node server.js`
4. Em "Environment", adicione as variáveis do `.env.example` (`DB_HOST`, `DB_USER`, etc.)
   apontando para um banco MySQL hospedado (ex: Railway, PlanetScale, Clever Cloud — todos
   têm opção gratuita).
5. Rode o `sistema_login.sql` nesse banco hospedado (pode ser pelo painel do serviço escolhido).
6. Após o deploy, o Render te dará uma URL, algo como:
   `https://sistema-login-xxxx.onrender.com`

### Passo 2: Apontar o front-end para o back-end publicado
Abra o arquivo `login.js` e troque esta linha:
```js
const API_URL_PRODUCAO = "https://SEU-BACKEND.onrender.com";
```
pela URL real que o Render te deu.

### Passo 3: Publicar o front-end
- Suba os arquivos (`index.html`, `login.css`, `login.js`) para o GitHub Pages, **ou**
- Deixe tudo no mesmo serviço (Render também serve os arquivos estáticos, já que
  `server.js` tem `app.use(express.static(__dirname))`) — nesse caso nem precisa do
  GitHub Pages, só acessar a URL do Render mesmo.

---

## O que foi alterado nos arquivos originais
- **login.js**: agora detecta automaticamente se está rodando em `localhost` (usa
  `http://localhost:3000`) ou em produção (usa a URL definida em `API_URL_PRODUCAO`).
- **server.js**: senha e dados do MySQL agora vêm do arquivo `.env` (mais seguro,
  e necessário para hospedar em serviços como Render).
- Adicionado **package.json**, **.env.example** e **.gitignore**.
- `index.html`, `login.css` e `sistema_login.sql` continuam idênticos.

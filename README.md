# Back-end (API de Login)

Contém `server.js`, `package.json` e `sistema_login.sql`.
Precisa de Node.js instalado e um MySQL local rodando na sua máquina
(usuário `root`, senha `12345`, igual está fixo no `server.js`).

## Como rodar
1. Instale as dependências:
   ```
   npm install
   ```
2. Crie o banco: abra seu MySQL e rode o arquivo `sistema_login.sql`.
3. Inicie o servidor:
   ```
   node server.js
   ```
4. Acesse `http://localhost:3000` no navegador (não abra o index.html com duplo clique).

Se seu MySQL usa outro usuário/senha, edite direto no `server.js` (bloco `mysql.createPool`).

# Front-end (Login + Portfólio)

Contém:
- `index.html`, `login.css`, `login.js` → página de login
- `port.html`, `port.css`, `port.js` → página do portfólio (só abre depois do login)

## Como rodar
Isso sozinho não funciona — precisa do back-end (pasta `backend/`) rodando
com `node server.js`. Depois é só acessar `http://localhost:3000` no navegador
(ele serve o front-end e o back-end juntos, já que `server.js` usa
`express.static`).

## Como a conexão entre login e portfólio funciona
1. `login.js` faz login e grava `sessionStorage.setItem("logado", "true")`, depois
   redireciona para `port.html`.
2. `port.js` verifica logo no início se `sessionStorage.getItem("logado") === "true"`.
   Se não estiver logado, manda de volta para `index.html` automaticamente.
3. O botão "Sair" no `port.html` limpa o `sessionStorage` e volta pro login.

## ⚠️ Fique de olho:
- As imagens do portfólio precisam estar numa pasta `img port` (com espaço no nome),
  do lado do `port.html`.
- Os links `linguagens.html`, `humanas.html`, `matemática.html`, `natureza.html`,
  `senai.html`, `sobre mim.html` e `project.html` ainda não existem — crie esses
  arquivos ou remova os links.

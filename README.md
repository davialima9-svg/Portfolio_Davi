# Front-end (Login + Portfólio)

Contém:
- `index.html`, `login.css`, `login.js` → página de login
- `port.html`, `port.css`, `port.js` → página do portfólio (só abre depois do login)

Isso é 100% estático — pode ser publicado direto no **GitHub Pages**.

## Como a conexão entre login e portfólio funciona
1. `login.js` faz login e grava `sessionStorage.setItem("logado", "true")`, depois
   redireciona para `port.html`.
2. `port.js` verifica logo no início se `sessionStorage.getItem("logado") === "true"`.
   Se não estiver logado, manda de volta para `index.html` automaticamente — ou seja,
   ninguém consegue acessar `port.html` direto pela URL sem passar pelo login antes.
3. O botão "Sair" no `port.html` limpa o `sessionStorage` e volta pro login.

## ⚠️ Antes de publicar, verifique:
- As imagens do portfólio ficam dentro de uma pasta chamada **`img port`** (com espaço
  no nome). Crie essa pasta ao lado do `port.html` e coloque as imagens usadas
  (`Captura de tela...png`, `Tropical Weekly...png`, etc). Nomes de pasta/arquivo com
  espaço e acento **funcionam**, mas dão mais chance de erro — se puder, renomeie para
  algo tipo `img-port` sem espaço/acento e ajuste os `src` no `port.html`.
- Os links `linguagens.html`, `humanas.html`, `matemática.html`, `natureza.html`,
  `senai.html`, `sobre mim.html` e `project.html` ainda não existem neste pacote —
  crie esses arquivos (ou remova os links) antes de publicar, senão vão dar página
  não encontrada.

## Antes de publicar
Abra `login.js` e troque esta linha pela URL real do seu back-end (depois de
publicá-lo, veja a pasta `backend/`):

```js
const API_URL_PRODUCAO = "https://SEU-BACKEND.onrender.com";
```

## Testar localmente
Basta rodar o back-end (pasta `backend/`) e abrir este `index.html` no navegador,
ou acessar `http://localhost:3000` enquanto o back-end estiver rodando.

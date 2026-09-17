document.addEventListener("DOMContentLoaded", () => {
    const elementoAno = document.getElementById("ano");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    // === CONFIGURAÇÃO DA API ===
    // Local (seu PC) usa o servidor Node local. Publicado (GitHub Pages) usa o back-end do Render.
    // TROQUE a linha abaixo pela URL real do seu back-end depois de publicá-lo no Render.
    const API_URL_PRODUCAO = "https://SEU-BACKEND.onrender.com";
    const ehLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const API_BASE = ehLocal ? "" : API_URL_PRODUCAO;

    const loginForm = document.getElementById("loginForm");
    const mensagemEl = document.getElementById("mensagem");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const cpf = document.getElementById("cpf").value.replace(/\D/g, '');
            const senha = document.getElementById("senha").value;

            try {
                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cpf, senha })
                });

                const data = await response.json();

                if (response.ok && data.sucesso) {
                    sessionStorage.setItem("logado", "true");
                    sessionStorage.setItem("cpf", cpf);
                    window.location.href = "port.html";
                } else {
                    if (mensagemEl) {
                        mensagemEl.textContent = data.mensagem || "Credenciais inválidas.";
                        mensagemEl.className = "erro";
                    }
                }
            } catch (error) {
                console.error("Erro na comunicação:", error);
                if (mensagemEl) {
                    mensagemEl.textContent = ehLocal
                        ? "Servidor Node.js offline. Rode 'node server.js' no terminal."
                        : "Não foi possível conectar ao servidor. Verifique se o back-end está no ar.";
                    mensagemEl.className = "erro";
                }
            }
        });
    }
});

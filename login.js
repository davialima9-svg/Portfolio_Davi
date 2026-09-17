document.addEventListener("DOMContentLoaded", () => {
    const elementoAno = document.getElementById("ano");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    const loginForm = document.getElementById("loginForm");
    const mensagemEl = document.getElementById("mensagem");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const cpf = document.getElementById("cpf").value.replace(/\D/g, '');
            const senha = document.getElementById("senha").value;

            try {
                const response = await fetch('http://localhost:3000/login', {
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
                    mensagemEl.textContent = "Servidor Node.js offline. Rode 'node server.js' no terminal.";
                    mensagemEl.className = "erro";
                }
            }
        });
    }
});

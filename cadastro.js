document.addEventListener("DOMContentLoaded", () => {
    const elementoAno = document.getElementById("ano");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    const cadastroForm = document.getElementById("cadastroForm");
    const mensagemEl = document.getElementById("mensagem");

    if (cadastroForm) {
        cadastroForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const cpf = document.getElementById("cpf").value.replace(/\D/g, '');
            const senha = document.getElementById("senha").value;
            const confirmarSenha = document.getElementById("confirmarSenha").value;

            if (mensagemEl) {
                mensagemEl.className = "";
                mensagemEl.textContent = "";
            }

            if (cpf.length !== 11) {
                if (mensagemEl) {
                    mensagemEl.textContent = "O CPF deve ter 11 números.";
                    mensagemEl.className = "erro";
                }
                return;
            }

            if (senha !== confirmarSenha) {
                if (mensagemEl) {
                    mensagemEl.textContent = "As senhas não coincidem.";
                    mensagemEl.className = "erro";
                }
                return;
            }

            try {
                const response = await fetch('/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cpf, senha })
                });

                const data = await response.json();

                if (response.ok && data.sucesso) {
                    if (mensagemEl) {
                        mensagemEl.textContent = "Cadastro realizado com sucesso! Redirecionando...";
                        mensagemEl.className = "sucesso";
                    }
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1500);
                } else {
                    if (mensagemEl) {
                        mensagemEl.textContent = data.mensagem || "Não foi possível cadastrar.";
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

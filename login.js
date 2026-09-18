document.addEventListener("DOMContentLoaded", () => {
    // Endereço fixo do servidor Node.js
    const API_BASE = "http://localhost:3000";

    const elementoAno = document.getElementById("ano");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    const loginForm = document.getElementById("loginForm");
    const mensagemEl = document.getElementById("mensagem");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const cpfElemento = document.getElementById("cpf");
        const senhaElemento = document.getElementById("senha");

        if (!cpfElemento || !senhaElemento) return;

        const cpf = cpfElemento.value.replace(/\D/g, "");
        const senha = senhaElemento.value;

        if (!cpf || !senha) {
            mensagemEl.textContent = "Digite seu CPF e sua senha.";
            mensagemEl.className = "erro";
            return;
        }

        try {
            mensagemEl.textContent = "Conectando ao servidor...";
            mensagemEl.className = "";

            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cpf, senha })
            });

            const data = await response.json();

            if (response.ok && data.sucesso) {
                sessionStorage.setItem("logado", "true");
                sessionStorage.setItem("cpf", cpf);
                window.location.href = "port.html";
                return;
            }

            mensagemEl.textContent = data.mensagem || "CPF ou senha incorretos.";
            mensagemEl.className = "erro";

        } catch (erro) {
            console.error("Erro ao conectar:", erro);
            mensagemEl.textContent = "Não foi possível conectar ao servidor.";
            mensagemEl.className = "erro";
        }
    });
});
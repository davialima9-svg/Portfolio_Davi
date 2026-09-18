
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const mensagemEl = document.getElementById("mensagem");

    console.log("JS carregado.");
    console.log("Formulário:", loginForm);
    console.log("Mensagem:", mensagemEl);

    if (!loginForm) {
        console.error("ERRO: #loginForm não foi encontrado.");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        console.log("FORMULÁRIO ENVIADO");

        const cpfInput = document.getElementById("cpf");
        const senhaInput = document.getElementById("senha");

        if (!cpfInput || !senhaInput) {
            mostrarMensagem("Erro: campo CPF ou senha não encontrado.");
            return;
        }

        const cpf = cpfInput.value.replace(/\D/g, "");
        const senha = senhaInput.value;

        console.log("CPF:", cpf);
        console.log("Senha preenchida:", senha.length > 0);

        if (!cpf || !senha) {
            mostrarMensagem("Preencha o CPF e a senha.");
            return;
        }

        mostrarMensagem("Conectando ao servidor...");

        try {
            const url = "http://localhost:3000/login";

            console.log("Enviando para:", url);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cpf: cpf,
                    senha: senha
                })
            });

            console.log("Status:", response.status);

            const texto = await response.text();

            console.log("Resposta:", texto);

            let data;

            try {
                data = JSON.parse(texto);
            } catch {
                mostrarMensagem(
                    "O servidor respondeu, mas não enviou JSON válido."
                );
                return;
            }

            if (response.ok && data.sucesso) {
                sessionStorage.setItem("logado", "true");
                sessionStorage.setItem("cpf", cpf);

                mostrarMensagem("Login realizado! Redirecionando...");

                setTimeout(() => {
                    window.location.href = "port.html";
                }, 500);

                return;
            }

            mostrarMensagem(
                data.mensagem || "CPF ou senha inválidos."
            );

        } catch (error) {
            console.error("ERRO FETCH:", error);

            mostrarMensagem(
                "Erro ao conectar com o servidor: " + error.message
            );
        }
    });

    function mostrarMensagem(texto) {
        if (mensagemEl) {
            mensagemEl.textContent = texto;
            mensagemEl.style.display = "block";
        }

        console.log("MENSAGEM:", texto);
    }
});


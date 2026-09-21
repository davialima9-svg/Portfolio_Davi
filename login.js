document.addEventListener("DOMContentLoaded", () => {
    const elementoAno = document.getElementById("ano");
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    const loginForm = document.getElementById("loginForm");
    const mensagemEl = document.getElementById("mensagem");

    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {
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

        if (cpf.length !== 11) {
            mensagemEl.textContent = "O CPF deve conter 11 dígitos.";
            mensagemEl.className = "erro";
            return;
        }

        // Guarda as informações da sessão no navegador
        sessionStorage.setItem("logado", "true");
        sessionStorage.setItem("cpf", cpf);

        mensagemEl.textContent = "Login efetuado com sucesso! Redirecionando...";
        mensagemEl.className = "sucesso";

        // Redireciona para a página do portfólio
        setTimeout(() => {
            window.location.href = "port.html";
        }, 400);
    });
});
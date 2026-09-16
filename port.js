if (sessionStorage.getItem("logado") !== "true") {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const ano = new Date().getFullYear();
    const elAno = document.querySelector("#ano");
    if (elAno) {
        elAno.innerText = ano;
    }

    const btnSair = document.querySelector("#btnSair");
    if (btnSair) {
        btnSair.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = "index.html";
        });
    }
});
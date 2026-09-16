if (sessionStorage.getItem("logado") !== "true") {
    window.location.href = "index.html";
}

const calcular = document.getElementById('calcular');

function imc() {
    const nome = document.getElementById('nome').value.trim();
    const alturaStr = document.getElementById('altura').value.replace(',', '.');
    const pesoStr = document.getElementById('peso').value.replace(',', '.');
    
    const altura = parseFloat(alturaStr);
    const peso = parseFloat(pesoStr);
    const resultado = document.getElementById('resultado');

    if (nome !== '' && !isNaN(altura) && altura > 0 && !isNaN(peso) && peso > 0) {
        const valorIMC = (peso / (altura * altura)).toFixed(1);

        let classificacao = '';

        if (valorIMC < 18.5) {
            classificacao = "Abaixo do peso";
        } else if (valorIMC < 25) {
            classificacao = "Peso ideal. Parabéns!!!";
        } else if (valorIMC < 30) {
            classificacao = "Levemente acima do peso";
        } else if (valorIMC < 35) {
            classificacao = "Obesidade grau I";
        } else if (valorIMC < 40) {
            classificacao = "Obesidade grau II";
        } else {
            classificacao = "Obesidade grau III. Cuidado!";
        }

        resultado.textContent = `${nome}, seu IMC é ${valorIMC} e você está ${classificacao}.`;
    } else {
        resultado.textContent = 'Preencha todos os campos corretamente!';
    }
}

if (calcular) {
    calcular.addEventListener('click', imc);
}

const elementoAno = document.getElementById("ano");
if (elementoAno) {
    elementoAno.textContent = new Date().getFullYear();
}
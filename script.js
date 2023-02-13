const inputId = document.getElementById('cpfcnpj')
const inputTel = document.getElementById('telefone')
const regexCpf = new RegExp('([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})');
const regexTelefone = new RegExp('^(?:(?:\\+|00)?(55)\\s?)?(?:\\(?([1-9][0-9])\\)?\\s?)?(?:((?:9\\d|[2-9])\\d{3})\\-?(\\d{4}))$', '')
console.log("ok2")

function btnSubmit() {
    if (inputId.value == "") {
        alert("Por favor, digite seu CPF ou CNPJ.")
        return null;
    }
    if (!regexCpf.test(inputId.value)) {
        alert("Por favor, digite um CPF ou CNPJ válido.")
        return null;
    }
    if (inputTel.value == "") {
        alert("Por favor, digite seu número de telefone.")
        return null;
    }
    if (!regexTelefone.test(inputTel.value)) {
        alert("Por favor, digite um número de telefone válido.")
        return null;
    }
    window.location.replace(window.location.href.replaceAll("?", "")+"detalhes.html?id="+inputId.value+"&tel="+inputTel.value)
}


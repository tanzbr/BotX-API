const inputId = document.getElementById('cpfcnpj')
const inputTel = document.getElementById('telefone')
const regexCpf = new RegExp('([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})');
const regexTelefone = new RegExp('^(?:(?:\\+|00)?(55)\\s?)?(?:\\(?([1-9][0-9])\\)?\\s?)?(?:((?:9\\d|[2-9])\\d{3})\\-?(\\d{4}))$', '')
console.log("ok2")


$("#cpfcnpj").on("keydown", (function(){
    try {
        $("#cpfcnpj").unmask();
    } catch (e) {}

    var tamanho = $("#cpfcnpj").val().length;

    /*if (tamanho < 10 || (tamanho > 10 && tamanho < 13) ) {
        $("#cpfcnpj").css({"border":"1px solid red"});
    } else {
        $("#cpfcnpj").css({"border":"1px solid green"});
    }*/
    if(tamanho < 11){
        $("#cpfcnpj").mask("999.999.999-99");
    } else {
        $("#cpfcnpj").mask("99.999.999/9999-99");
    }
    // ajustando foco
    var elem = this;
    setTimeout(function(){
        // mudo a posição do seletor
        elem.selectionStart = elem.selectionEnd = 10000;
    }, 0);
    // reaplico o valor para mudar o foco
    var currentValue = $(this).val();
    $(this).val('');
    $(this).val(currentValue);
}));

$("#telefone").on("keydown", (function(){
    try {
        $("#telefone").unmask();
    } catch (e) {}

    /*if ($("#telefone").val().length < 10) {
        $("#telefone").css({"border":"1px solid red"});
    } else {
        $("#telefone").css({"border":"1px solid green"});
    }*/
    $("#telefone").mask('(00) 0 0000-0000', {translation:  {'Z': {pattern: /[0-9]/, optional: false}}});

    // ajustando foco
    var elem = this;
    setTimeout(function(){
        // mudo a posição do seletor
        elem.selectionStart = elem.selectionEnd = 10000;
    }, 0);
    // reaplico o valor para mudar o foco
    var currentValue = $(this).val();
    $(this).val('');
    $(this).val(currentValue);
}));

function btnSubmit() {
    var id = inputId.value.replaceAll(".", "").replaceAll("/", "").replaceAll("-", "");
    var tel = inputTel.value.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "")

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


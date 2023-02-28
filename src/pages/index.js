const inputId = document.getElementById('cpfcnpj')
const inputTel = document.getElementById('telefone')
const regexCpf = new RegExp('([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})');
const regexTelefone = new RegExp('^(?:(?:\\+|00)?(55)\\s?)?(?:\\(?([1-9][0-9])\\)?\\s?)?(?:((?:9\\d|[2-9])\\d{3})\\-?(\\d{4}))$', '')

var listaTransacoes;
var httpUrl = "http://10.20.20.70:3000/"
var cliente;
var number;

$("#cpfcnpj").inputmask({
    mask: ['999.999.999-99', '99.999.999/9999-99'],
    keepStatic: true
});

$("#telefone").inputmask({
    mask: ['+55 (99) 9999-9999', '+55 (99) 9 9999-9999'], 
    greedy: false
});

function btnSubmit() {
    var id = inputId.value
    id = id.replaceAll(".", "").replaceAll("/", "").replaceAll("-", "");
    var tel = inputTel.value
    tel = tel.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "").replaceAll("+", "")

    if (id == "") {
        alert("Por favor, digite seu CPF ou CNPJ.")
        return null;
    }
    if (!regexCpf.test(id)) {
        alert("Por favor, digite um CPF ou CNPJ válido.")
        return null;
    }
    if (tel == "") {
        alert("Por favor, digite seu número de telefone.")
        return null;
    }
    if (!regexTelefone.test(tel)) {
        alert("Por favor, digite um número de telefone válido.")
        return null;
    }
    if (document.getElementById("checkboxTerms").checked == false) {
        alert("Por favor, concorde com os termos de uso para continuar.")
        return null;
    }
    number = tel;
    carregarLista(id)
    //window.location.replace(window.location.href.replaceAll("?", "")+"detalhes.html?id="+id+"&tel="+tel)
}



// detalhes
function carregarLista(id) {
    console.log("Carregando lista de transações...")

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function logger() {
        if (this.readyState === 4 && this.status === 200) {
            listaTransacoes = JSON.parse(xhttp.responseText);

            if (listaTransacoes.info == null) {
                cliente = listaTransacoes[0].cliente;
                $("#cliente").text("Cliente: " + cliente);
                for (var i = 0; i < listaTransacoes.length; i++) {
                    $(".responsive-table").append($(criarElemento(listaTransacoes, i)))
                };
                $(".detalhes").css("display", "block")
                $(".container-login").css("display", "none")
            } else {
                if (listaTransacoes.info == "No transactions found.") {
                    alert('Não foi encontrado nenhum boleto em aberto para o seu cadastro. Se necessário, entre em contato para mais informações.')
                }
                if (listaTransacoes.info == "User not found.") {
                    alert('Não foi encontrado nenhum cadastro para o CPF/CNPJ informado. Se necessário, entre em contato para mais informações.')
                }
                return;
            }

        }
    };

    xhttp.open("get", httpUrl + "api/transacoes/" + id, false);
    xhttp.send();

}

function criarElemento(listaTransacoes, i) {
    var li = "";
    li += "<li class=\"table-row\" id=\"" + listaTransacoes[i].id + "\" onclick=\"\">";
    li += "            <div class=\"col col-1\" data-label=\"\">";
    li += "              ";
    li += "                      <div class=\"cbx\" onclick=\"select('" + listaTransacoes[i].id + "')\" >";
    li += "        <input class=\"cbx1\" id=\"check_" + listaTransacoes[i].id + "\" type=\"checkbox\"\/>";
    li += "        <label for=\"cbx\"><\/label>";
    li += "        <svg width=\"15\" height=\"14\" viewbox=\"0 0 15 14\" fill=\"none\">";
    li += "          <path d=\"M2 8.36364L6.23077 12L13 2\"><\/path>";
    li += "        <\/svg>";
    li += "      <\/div>";
    li += "      <svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" version=\"1.1\" style=\"width: 24px !important;";
    li += "        height: 24px !important;\">";
    li += "        <defs>";
    li += "          <filter id=\"goo\">";
    li += "            <fegaussianblur in=\"SourceGraphic\" stddeviation=\"4\" result=\"blur\"><\/fegaussianblur>";
    li += "            <fecolormatrix in=\"blur\" mode=\"matrix\" values=\"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7\" result=\"goo\"><\/fecolormatrix>";
    li += "            <feblend in=\"SourceGraphic\" in2=\"goo\"><\/feblend>";
    li += "          <\/filter>";
    li += "        <\/defs>";
    li += "      <\/svg>";
    li += "              ";
    li += "            <\/div>";
    li += "            <div class=\"col col-2\" data-label=\"Vencimento\"> " + listaTransacoes[i].dataVencimento + "<\/div>";
    li += "            <div class=\"col col-3\" data-label=\"Status\">" + listaTransacoes[i].status + "<\/div>";
    li += "            <div class=\"col col-4\" data-label=\" Valor \">";
    li += "              " + listaTransacoes[i].valor;
    li += "            <\/div>";
    li += "          <\/li>";

    li.replaceAll("varVencimento",)
    li.replaceAll("varStatus", listaTransacoes[i].status)
    li.replaceAll("varValor", listaTransacoes[i].valor)
    li.replaceAll("varID", listaTransacoes[i].id)

    return li
}

var selected = [];

function voltar() {
    $(".detalhes").css("display", "none")
    $(".container-login").css("display", "grid")
    $('.responsive-table .table-row').remove()
    selected = []
}

function select(data) {
    if (!selected.includes(data)) {
        selected.push(data)
        $("#check_" + data).prop("checked", true);
    } else {
        selected.splice(selected.indexOf(data), 1)
        $("#check_" + data).prop("checked", false);
    }
    console.log(selected)
}

function sendWpp() {

    $('input').each(function () {
        this.checked = false;
    });

    var data = {
        "number": number,
        "name": cliente.split(" ")[0],
        "data": []
    }
    var boletos = []
    console.log(listaTransacoes)
    for (var i = 0; i < listaTransacoes.length; i++) {
        if (selected.includes(listaTransacoes[i].id)) {
            boletos.push({
                "pdf": listaTransacoes[i].pdf,
                "vencimento": listaTransacoes[i].dataVencimento
            })
        }
    };

    data.data = boletos

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function logger() {
        if (this.readyState === 4 && this.status === 200) {
            alert(JSON.parse(xhttp.responseText).message)
        }
    }
    xhttp.open("POST", httpUrl + "api/sendWpp", true);
    console.log(JSON.stringify(data))
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(data));

    selected = [];
}




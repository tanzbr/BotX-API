const inputId = document.getElementById('cpfcnpj')
const inputTel = document.getElementById('telefone')
const regexCpf = new RegExp('([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})');
const regexTelefone = new RegExp('^(?:(?:\\+|00)?(55)\\s?)?(?:\\(?([1-9][0-9])\\)?\\s?)?(?:((?:9\\d|[2-9])\\d{3})\\-?(\\d{4}))$', '')


var httpUrl = "http://10.20.20.70:8000/"


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
    var id = inputId.value
    id = id.replaceAll(".", "").replaceAll("/", "").replaceAll("-", "");
    var tel = inputTel.value
    tel = tel.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "")
    console.log(tel + " - " + id)

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
    carregarLista(id)
    //window.location.replace(window.location.href.replaceAll("?", "")+"detalhes.html?id="+id+"&tel="+tel)
}



// detalhes
function carregarLista(id) {
    console.log("Carregando Lista...")

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function logger() {
      if (this.readyState === 4 && this.status === 200) {
        let listaTransacoes = JSON.parse(xhttp.responseText);
        if (listaTransacoes.info == null) {
            
            for (var i = 0; i < listaTransacoes.length; i++) {
                //document.getElementById("table").innerHTML += '<div class="row"><div class="cell" data-title="Boleto">#1</div><div class="cell" data-title="Status">Aguardando Pagamento</div><div class="cell" data-title="Valor">R$240</div><div class="cell" data-title="Criada em">22/01/2023</div><div class="cell" data-title="Vencimento">25/02/2023</div><div class="cell" data-title="Baixar">Baixar | WhatsApp</div></div>';
                $(".responsive-table").append($(criarElemento(listaTransacoes, i)))
        
                /*lista.innerHTML += 
                "ID: " + listaTransacoes[i].id + "<br>" 
                + "Data Criada: " + listaTransacoes[i].dataCriada + "<br>"
                + "Valor: " + listaTransacoes[i].valor + "<br>"
                + "Tipo: " + listaTransacoes[i].tipo + "<br>"
                + "Status: " + listaTransacoes[i].status + "<br>"
                + "Data de Vencimento: " + listaTransacoes[i].dataVencimento + "<br>"
                + "Link Download: " + listaTransacoes[i].pdf + "<br>"
                +
                " <a href='#' onclick='enviar("+listaTransacoes[i].id+")'>Enviar no Whatsapp</a> "
                +
                "<br>-----------"
                + "<br>";*/
            };
            $(".detalhes").css("display", "block")
            $(".container-login").css("display", "none")
        } else {
            if (listaTransacoes.info == "No transactions found.") {
                alert('Não foi encontrado nenhum boleto para o seu cadastro. Se necessário, entre em contato para mais informações.')
            }
            if (listaTransacoes.info ==  "User not found.") {
                alert('Não foi encontrado nenhum cadastro para o CPF/CNPJ informado. Se necessário, entre em contato para mais informações.')
            }
            return;
        }
        
        
      }
    };
    
    xhttp.open("get", httpUrl+"api/transacoes/"+id, false);
    xhttp.send();
   
}

function criarElemento(listaTransacoes, i) {
  var li="";
li += "<li class=\"table-row\" id=\""+ listaTransacoes[i].id +"\" onclick=\"select('"+ listaTransacoes[i].id +"')\">";
li += "            <div class=\"col col-1\" data-label=\"\">";
li += "              ";
li += "                      <div class=\"cbx\">";
li += "        <input id=\"cbx\" onclick=\"stopProp(e)\"  type=\"checkbox\"\/>";
li += "        <label for=\"cbx\"><\/label>";
li += "        <svg width=\"15\" height=\"14\" viewbox=\"0 0 15 14\" fill=\"none\">";
li += "          <path d=\"M2 8.36364L6.23077 12L13 2\"><\/path>";
li += "        <\/svg>";
li += "      <\/div>";
li += "      <!-- Gooey-->";
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
li += "            <div class=\"col col-2\" data-label=\"Vencimento\"> " +listaTransacoes[i].dataVencimento +"<\/div>";
li += "            <div class=\"col col-3\" data-label=\"Status\">" +listaTransacoes[i].status+"<\/div>";
li += "            <div class=\"col col-4\" data-label=\" Valor \">";
li += "              R$" +listaTransacoes[i].valor;
li += "            <\/div>";
li += "          <\/li>";

li.replaceAll("varVencimento", )
li.replaceAll("varStatus", listaTransacoes[i].status)
li.replaceAll("varValor", listaTransacoes[i].valor)
li.replaceAll("varID", listaTransacoes[i].id)

return li
}

/*function select(id) {
  var input = document.querySelectorAll('#'+id+' input');
  if (input[0].checked) {
    input[0].checked = false;
  } else {
    input[0].checked = true;
  }
} */


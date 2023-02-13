window.onload = () => {
    console.log("Carregando JavaScript...")
    carregarLista();
}

//Array de parametros 'chave=valor'
var params = window.location.search.substring(1).split('&');

//Criar objeto que vai conter os parametros
var paramArray = {};

//Passar por todos os parametros
for(var i=0; i<params.length; i++) {
    //Dividir os parametros chave e valor
    var param = params[i].split('=');

    //Adicionar ao objeto criado antes
    paramArray[param[0]] = param[1];
}

function carregarLista() {
    console.log("Carregando Lista...")

    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    var id = paramArray['id']
    console.log(id)

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function logger() {
      if (this.readyState === 4 && this.status === 200) {
        let listaTransacoes = JSON.parse(xhttp.responseText);
        console.log(listaTransacoes)
        
        for (var i = 0; i < listaTransacoes.length; i++) {
        //document.getElementById("table").innerHTML += '<div class="row"><div class="cell" data-title="Boleto">#1</div><div class="cell" data-title="Status">Aguardando Pagamento</div><div class="cell" data-title="Valor">R$240</div><div class="cell" data-title="Criada em">22/01/2023</div><div class="cell" data-title="Vencimento">25/02/2023</div><div class="cell" data-title="Baixar">Baixar | WhatsApp</div></div>';
        console.log(criarElemento(listaTransacoes, i))
        $(".responsive-table").append($(criarElemento(listaTransacoes, i)))

        lista.innerHTML += 
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
        + "<br>";
    };
      }
    };

    xhttp.open("get", "http://localhost:8000/api/transacoes/"+id, false);
    xhttp.send();
   
}

function criarElemento(listaTransacoes, i) {
  var li="";
li += "<li class=\"table-row\" id=\""+ listaTransacoes[i].id +"\">";
li += "            <div class=\"col col-1\" data-label=\"\">";
li += "              ";
li += "                      <div class=\"cbx\">";
li += "        <input id=\"cbx\" type=\"checkbox\"\/>";
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

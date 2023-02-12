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
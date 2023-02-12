var XMLHttpRequest = require('xhr2');

function getCustomerId() {
    var id = "22380220824"
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function logger() {
      if (this.readyState === 4 && this.status === 200) {

        var dadosCliente = JSON.parse(this.responseText);
        var idCliente = dadosCliente.data[0].id;
        console.log(idCliente);
        
      }
    };
    xhttp.open('GET', `https://www.asaas.com/api/v3/customers?cpfCnpj=${id}`, true);
    xhttp.setRequestHeader("access-token", "***REMOVED***")
    xhttp.send();
}

getCustomerId();
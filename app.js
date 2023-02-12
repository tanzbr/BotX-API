var express = require("express");
var path = require('path');
var cors = require('cors');
var XMLHttpRequest = require('xhr2');
//var db = require("./database.js")

var app = express();

app.use(cors());

var HTTP_PORT = 8000;

app.listen(HTTP_PORT, () => {
    console.log("Servidor rodando na porta " + HTTP_PORT)
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/style.css', function (req, res) {
    res.sendFile(path.join(__dirname, '/style.css'))
})

app.get('/script.js', function (req, res) {
    res.sendFile(path.join(__dirname, '/script.js'))
})

app.get('/detalhes.js', function (req, res) {
    res.sendFile(path.join(__dirname, '/detalhes.js'))
})

app.get('/detalhes.html', function (req, res) {
    res.sendFile(path.join(__dirname, '/detalhes.html'))
})

app.get("/api/cliente/:id", (req, res, next) => {
    var id = req.params.id;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function logger() {
      if (this.readyState === 4 && this.status === 200) {
        res.json(
            this.responseText
        )
      }
    };
    xhttp.open('GET', `https://www.asaas.com/api/v3/customers?cpfCnpj=${id}`, true);
    xhttp.setRequestHeader("access-token", "***REMOVED***")
    xhttp.send();
});

app.get("/api/transacoes/:id", async (req, res, next) => {
    const xhttp2 = new XMLHttpRequest();
    var id = req.params.id
    var idCliente;

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function logger() {
      if (this.readyState === 4 && this.status === 200) {
        var dadosCliente = JSON.parse(this.responseText);
        idCliente = dadosCliente.data[0].id;
        
        
        xhttp2.onreadystatechange = function logger() {
            if (this.readyState === 4 && this.status === 200) {
                console.log("id2:"+idCliente)

                var dados = JSON.parse(this.responseText).data
                var transacoes = [];

                for (var i = 0; i < dados.length; i++) {
                    var id = dados[i].id
                    var dataCriada = dados[i].dateCreated
                    var valor = dados[i].value
                    var tipo = dados[i].billingType
                    var status = dados[i].status
                    var dataVencimento = dados[i].dueDate
                    var pdf = dados[i].bankSlipUrl

                    var datajson = JSON.parse(`{
                        "id": "${id}",
                        "dataCriada": "${dataCriada}",
                        "valor": "${valor}",
                        "tipo": "${tipo}",
                        "status": "${status}",
                        "dataVencimento": "${dataVencimento}",
                        "pdf": "${pdf}"
                    }`)

                    transacoes.push(datajson)
                }

                res.json(
                    transacoes
                )
            }
        }
        xhttp2.open('GET', `https://www.asaas.com/api/v3/payments?customer=${idCliente}`, true);
        xhttp2.setRequestHeader("access-token", "***REMOVED***")
        xhttp2.send();

      }
    };
    xhttp.open('GET', `https://www.asaas.com/api/v3/customers?cpfCnpj=${id}`, true);
    xhttp.setRequestHeader("access-token", "***REMOVED***")
    xhttp.send();
});
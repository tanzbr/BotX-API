// IMPORTS
var express = require("express");
var path = require("path");
var cors = require("cors");
var XMLHttpRequest = require("xhr2");
var bot = require("./src/whatsapp_bot/whatsappbot.js");
var app = express();
const config = require("./config");
const parser = require("./src/utils/parser.js")

// CONFIG FILE
const HTTP_PORT = config.app.port;
const usingAPI = config.app.using_api;
var apiToken;

if (usingAPI == "asaas") {
    apiToken = config.api_asaas.token;
}

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

app.listen(HTTP_PORT, () => {
    console.log("Servidor rodando na porta: " + HTTP_PORT);
});

app.get("", function (req, res) {
    res.sendFile(path.join(__dirname, "/src/pages/index.html"));
});

app.get("/qrcode", function (req, res) {
    res.send(`<img src="${bot.qrcodeWpp}"></img>`);
    //res.sendFile(path.join(__dirname, '/index.html'))
});

app.get("/index/style.css", function (req, res) {
    res.sendFile(path.join(__dirname, "/src/style/style.css"));
});

app.get("/RecoletaAlt-SemiBold.ttf", function (req, res) {
    res.sendFile(
        path.join(__dirname, "/resources/font/RecoletaAlt-SemiBold.ttf")
    );
});

app.get("/logo.svg", function (req, res) {
    res.sendFile(path.join(__dirname, "/resources/img/logo.svg"));
});

app.get("/image.svg", function (req, res) {
    res.sendFile(path.join(__dirname, "/resources/img/image.svg"));
});

app.get("/jquery.mask.js", function (req, res) {
    res.sendFile(
        path.join(__dirname, "/node_modules/jquery-mask-plugin/src/jquery.mask.js")
    );
});

app.get("/index/script.js", function (req, res) {
    res.sendFile(path.join(__dirname, "/src/pages/index.js"));
});

app.post("/api/sendWpp", async function (req, res) {
    console.log(req.body);
    var status = await bot.sendMsg(req.body);
    res.json({
        message: status,
    });
});

/*
app.get("/api/cliente/:id", (req, res, next) => {
    var id = req.params.id;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function logger() {
        if (this.readyState === 4 && this.status === 200) {
            res.json(this.responseText);
        }
    };
    xhttp.open(
        "GET",
        `https://www.asaas.com/api/v3/customers?cpfCnpj=${id}`,
        true
    );
    xhttp.setRequestHeader("access-token", apiToken);
    xhttp.send();
}); */

app.get("/api/transacoes/:id", async (req, res, next) => {

    // API ASAAS
    if (usingAPI == "asaas") {
        const xhttp2 = new XMLHttpRequest();
        var id = req.params.id;
        var idCliente;

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function logger() {
            if (this.readyState === 4 && this.status === 200) {
                if (parser.parseAsaasClient(this.responseText) == null) {
                    res.json({
                        message: "error",
                        info: "User not found.",
                    });
                    return;
                }
                var dataClient = parser.parseAsaasClient(this.responseText);
                idCliente = dataClient.idCliente;
                nomeCliente = dataClient.nomeCliente;

                xhttp2.onreadystatechange = function logger() {
                    if (this.readyState === 4 && this.status === 200) {

                        var parsed = parser.parseAsaasTransactions(this.responseText)
                        if (parsed == null) {
                            res.json({
                                message: "error",
                                info: "No transactions found.",
                            });
                            return;
                        }
                        if (parsed == "no transactions") {
                            res.json({
                                message: "error",
                                info: "No transactions found.",
                            });
                            return;
                        }
                        res.json(parsed);
                    }
                };
                xhttp2.open(
                    "GET",
                    `https://www.asaas.com/api/v3/payments?customer=${idCliente}`,
                    true
                );
                xhttp2.setRequestHeader("access-token", apiToken);
                xhttp2.send();
            }
        };
        xhttp.open(
            "GET",
            `https://www.asaas.com/api/v3/customers?cpfCnpj=${id}`,
            true
        );
        xhttp.setRequestHeader("access-token", apiToken);
        xhttp.send();
    }

    // SOON: OTHERS API
});



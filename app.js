// IMPORTS
import express, { json, urlencoded } from "express";
import { join } from "path";
import cors from "cors";
import XMLHttpRequest from "xhr2";
import { desconectar, status, sendMsg } from "./src/whatsapp_bot/whatsappbot.js";
var app = express();
import { config } from "./config.js";
import { parseAsaasClient, parseAsaasTransactions } from "./src/utils/parser.js";
import { readFileSync } from "fs";
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import { createServer } from "https";

// CONFIG FILE
const HTTP_PORT = config.app.port;
const usingAPI = config.app.using_api;
const mode = config.app.mode;
const pathToKey = config.app.pathToKey;
const pathToCert = config.app.pathToCert;
const host = config.app.host;
var admin_credential = config.app.admin_credential;
var apiToken;

if (usingAPI == "asaas") {
    apiToken = config.api_asaas.token;
}

app.use(json()); // for parsing application/json
app.use(urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

if (mode == "http") {
    app.listen(HTTP_PORT, () => {console.log("Servidor rodando na porta: " + HTTP_PORT)})
} else {
    createServer({
    key: readFileSync(pathToKey),
    cert: readFileSync(pathToCert),
  },
  app)
  .listen(HTTP_PORT, ()=>{
    console.log("Servidor rodando na porta: " + HTTP_PORT)
  });
}


/*
app.listen(HTTP_PORT, () => {
    console.log("Servidor rodando na porta: " + HTTP_PORT);
});*/

app.get("", function (req, res) {
    res.sendFile(join(__dirname, "/src/pages/index.html"));
});

app.get("/admin", function (req, res) {
    res.sendFile(join(__dirname, '/src/pages/admin.html'))
});

app.get("/index/style.css", function (req, res) {
    res.sendFile(join(__dirname, "/src/style/style.css"));
});
app.get("/admin/admin.css", function (req, res) {
    res.sendFile(join(__dirname, "/src/style/adminTail.css"));
});

app.get("/RecoletaAlt-SemiBold.ttf", function (req, res) {
    res.sendFile(
        join(__dirname, "/resources/font/RecoletaAlt-SemiBold.ttf")
    );
});

app.get("/logo.svg", function (req, res) {
    res.sendFile(join(__dirname, "/resources/img/logo.svg"));
});

app.get("/logobotx.jpg", function (req, res) {
    res.sendFile(join(__dirname, "/resources/img/logobotx.jpg"));
});

app.get("/image.svg", function (req, res) {
    res.sendFile(join(__dirname, "/resources/img/image.svg"));
});

app.get("/jquery.mask.js", function (req, res) {
    res.sendFile(
        join(__dirname, "/node_modules/jquery-mask-plugin/src/jquery.mask.js")
    );
});

app.get("/index/index.js", function (req, res) {
    res.sendFile(join(__dirname, "/src/pages/index.js"));
});
app.get("/admin/admin.js", function (req, res) {
    res.sendFile(join(__dirname, "/src/pages/admin.js"));
});

app.get("/api/statusWpp", function (req, res) {
    if (req.headers.access_token == admin_credential) {
        res.json(status())
    } else {
        res.status(401).json({
            message:"Consulta não autorizada."
        })
    }
    
});

app.get("/api/validar", function (req, res) {
    if (req.headers.access_token == admin_credential) {
        res.status(200).json({
            message:"ok"
        })
    } else {
        res.status(401).json({
            message:"Consulta não autorizada."
        })
    }
    
});

app.post("/api/disconnectWpp", async function (req, res) {

    if (req.headers.access_token == admin_credential) {
        desconectar();
        res.json({
            message:"ok"
        })
    } else {
        res.status(401).json({
            message:"Consulta não autorizada."
        })
    }

    
});

app.post("/api/sendWpp", async function (req, res) {
    console.log(req.body);
    var status = await sendMsg(req.body);
    res.json({
        message: status,
    });
});

app.get("/api/asaas/transacoes/:id", async (req, res, next) => {

    // API ASAAS
    if (usingAPI == "asaas") {
        const xhttp2 = new XMLHttpRequest();
        var id = req.params.id;
        var nomeCliente;

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function logger() {
            if (this.readyState === 4 && this.status === 200) {
                if (parseAsaasClient(this.responseText) == null) {
                    res.json({
                        message: "error",
                        info: "User not found.",
                    });
                    return;
                }
                var idCliente = JSON.parse(this.responseText).data[0].id;
                var dataClient = parseAsaasClient(this.responseText);

                xhttp2.onreadystatechange = function logger() {
                    if (this.readyState === 4 && this.status === 200) {
                        
                        console.log(this.responseText)
                        var parsed = parseAsaasTransactions(this.responseText, dataClient)
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
    } else {
        res.json({
            message: "error",
            info: "A API em uso não é a Asaas..",
        });
    }

});

app.get("/api/bb/transacoes/:id", async (req, res, next) => {

    // API BB
    if (!usingAPI != "bb") {
        res.json({
            message: "error",
            info: "A API em uso não é a Asaas..",
        });
        return;
    }
    
});



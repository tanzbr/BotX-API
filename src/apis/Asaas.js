// not working yet

import { config } from "../../config.js";
var apiToken = config.api_asaas.token;
import XMLHttpRequest from "xhr2";

export function getAsaas(id) {
    const xhttp2 = new XMLHttpRequest();

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function logger() {
            if (this.readyState === 4 && this.status === 200) {
                if (parseAsaasClient(this.responseText) == null) {
                    return JSON.parse({
                        "message": "error",
                        "info": "User not found.",
                    });
                }
                var idCliente = JSON.parse(this.responseText).data[0].id;
                var dataClient = parseAsaasClient(this.responseText);

                xhttp2.onreadystatechange = function logger() {
                    if (this.readyState === 4 && this.status === 200) {
                        
                        var parsed = parseAsaasTransactions(this.responseText, dataClient)
                        if (parsed == null) {
                            return JSON.parse({
                                "message": "error",
                                "info": "No transactions found.",
                            });
                        }
                        if (parsed == "no transactions") {
                            return JSON.parse({
                                "message": "error",
                                "info": "No transactions found.",
                            });
                        }
                        resolve(parsed);
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

// API ASAAS
export function parseAsaasClient(data) {
    var dados = JSON.parse(data);

    if (dados.data[0] == null) {
        return null;
    }
    return {
        "idCliente": dados.data[0].id,
        "nomeCliente": dados.data[0].name
    }
}
export function parseAsaasTransactions(data, dataClient) {
    var dados = JSON.parse(data).data;
    var nomeCliente = dataClient.nomeCliente;

    if (dados[0] == null) {
        return null;
    }

    var transacoes = [];

    for (var i = 0; i < dados.length; i++) {
        var id = dados[i].id;
        var dataCriada = dados[i].dateCreated;
        var valor = dados[i].value;
        var tipo = dados[i].billingType;
        var status = dados[i].status;
        var dataVencimento = formatDate(dados[i].dueDate);
        var pdf = dados[i].bankSlipUrl;

        valor = valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        if (status == "PENDING") {
            status = "À VENCER";
        }
        if (
            status == "RECEIVED" ||
            status == "CONFIRMED" ||
            status == "RECEIVED_IN_CASH"
        ) {
            status = "PAGO";
            continue;
        }
        if (status == "OVERDUE") {
            status = "VENCIDO";
        }
        if (status == "REFUNDED") {
            status = "ESTORNADO";
            continue;
        }

        var datajson = JSON.parse(`{
    "id": "${id}",
    "cliente": "${nomeCliente}",
    "dataCriada": "${dataCriada}",
    "valor": "${valor}",
    "tipo": "${tipo}",
    "status": "${status}",
    "dataVencimento": "${dataVencimento}",
    "pdf": "${pdf}"
}`);
        transacoes.push(datajson);
    }

    if (transacoes == []) {
        return "no transactions";
    }

    return(transacoes.reverse());
}

// UTILS
function formatDate(date) {
    var arrayData = date.split("-");
    arrayData.reverse();
    var vencimento = "";
    for (var i = 0; i < 3; i++) {
        vencimento += arrayData[i] + "/";
    }
    vencimento = vencimento.substring(0, vencimento.length - 1);
    return vencimento;
}
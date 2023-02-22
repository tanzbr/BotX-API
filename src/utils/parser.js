// API ASAAS
const parseAsaasClient = function (data) {
    var dados = JSON.parse(data);

    if (dados.data[0] == null) {
        return null;
    }
    return {
        "idCliente": dados.data[0].id,
        "nomeCliente": dados.data[0].name
    }
}
const parseAsaasTransactions = function (data) {
    var dados = JSON.parse(data).data;

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
        res.json({
            message: "error",
            info: "No transactions found.",
        });
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

// EXPORT FUNCTIONS
module.exports = {
    parseAsaasClient,
    parseAsaasTransactions
}
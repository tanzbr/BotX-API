

// API ASAAS
// FORMATA OS DADOS DA CONSULTA DE CLIENTE DOS ASAAS, RETORNANDO SOMENTE AS INFORMAÇÕES NECESSARIAS
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
//FORMATA OS DADOS DOS BOLETOS PUXADOS DIRETAMENTE DO ASAAS, RETORNANDO SOMENTE AS INFORMAÇÕES NECESSÁRIAS
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

// FORMATAR DATA
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
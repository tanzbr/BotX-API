var url = "http://localhost:8080/api/statusWpp"

window.onload = () => {
    carregarWhatsApp()
}

async function carregarWhatsApp() {

    var dados = await fetch(url)
    .then(data => {
        return data.json();
    })


    if (dados.ready == "false") {
        $("readyStatus").text("Status: Offline")
    } else {
        $("readyStatus").text("Status: Online")
    }

    if (dados.qrcode != "null") {
        $(".qrcode").show();
        $("#qrcode").attr("src", dados.qrcode)
    } else {
        $(".qrcode").hide();
    }

    var logs = dados.logs.split(",")
    console.log(logs)
    for (var i = 0; i < logs.length; i++) {
        $(".log-section").append(document.createElement("p").innerHTML = logs[i] + "<br>")
    }
    

}
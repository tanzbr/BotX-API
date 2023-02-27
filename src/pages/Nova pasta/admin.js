var url = "https://54.160.92.23:3000/"
var token;
const inputToken = document.getElementById('token')

window.onload = () => {
    carregarWhatsApp()
}

window.setInterval(function(){
   carregarWhatsApp();
}, 3000);

async function btnSubmit() {
    var valid;
    if (inputToken.value == "") {
        alert("Por favor, digite um token de acesso.")
    }
    await fetch(url+"validar", {
        headers: {
            'access_token': inputToken.value
          },
    })
    .then(data => {
        if (data.status == 200) {
            valid = true;
        } else {
            valid = false;
        }
    })
    .catch(error => {
        alert("Não foi possível conectar ao servidor.")
        return;
    });
    if (!valid){
        alert("Token de acesso negado. Por favor, tente novamente.")
        return
    }
    $(".login-form").hide()
    $(".whatsapp").show()
    token = inputToken.value
    carregarWhatsApp();
}

async function carregarWhatsApp() {

    if (token == null) {return}

    var dados = await fetch(url+"statusWpp", {
        headers: {
            'access_token': token
          },
    })
    .then(data => {
        return data.json();
    })
    .catch(error => {
        $("#readyStatus").text("Não foi possível conectar ao servidor. Tente novamente mais tarde ou procure ajuda do Suporte.")
        $("#summary-conectar").hide();
        $("#btnDisconnect").hide()
        return;
    });

    if (dados.ready == "false") {
        $("#statusPath").css("fill", "#de3b3b")
        $("#readyStatus").text("WhatsApp não conectado")
        $("#btnDisconnect").hide()
    } else {
        $("#readyStatus").text("WhatsApp conectado!")
        $("#statusPath").css("fill", "#3ede3b") 
        $("#btnDisconnect").show()
    }

    if (dados.qrcode != "null") {
        $("#summary-conectar").show();
        $(".qrcode").show();
        $("#qrcode").attr("src", dados.qrcode)
    } else {
        $(".detailsConectar").removeAttr("open")
        $("#summary-conectar").hide();
        $(".qrcode").hide();
    }

    var logs = dados.logs.split(",")
    $('.log-section').text("")
    for (var i = 0; i < logs.length; i++) {
        $(".log-section").append(document.createElement("p").innerHTML = `${i+1}. ` +logs[i] + "<br>")
    }

}

function desconectar() {
    console.log("Desconectando...")
    fetch(url+"disconnectWpp",
    {
        method: "POST",
        headers: {
            'access_token': token
          },
    })
}
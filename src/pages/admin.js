const inputToken = document.getElementById('token')
var token;
var url = "http://localhost:3000/api/";

function fecharMenu() {
    $("#mobileMenu").hide();
}

function abrirMenu() {
    $("#mobileMenu").show();
}

function menuWhatsapp() {
    if (token == null) {
        return
    }
    $(".containers").hide();
    $("#container-whatsapp").show();
    $("a, .bg-gray-100").removeClass("bg-gray-100")
    $("#btnMenuWhatsapp").addClass("bg-gray-100")
}

function menuInicio() {
    if (token == null) {
        return
    }
    $(".containers").hide();
    $("#container-inicio").show();
    $("a, .bg-gray-100").removeClass("bg-gray-100")
    $("#btnMenuInicio").addClass("bg-gray-100")
}

function menuRelatorios() {
    if (token == null) {
        return
    }
    $(".containers").hide();
    $("#container-relatorios").show();
    $("a, .bg-gray-100").removeClass("bg-gray-100")
    $("#btnMenuRelatorios").addClass("bg-gray-100")
}

function fecharPopQr() {

}

function mostrarLogs() {
    if ($(".div-logs").is(":visible")) {
        $(".div-logs").hide();
        return
    }
    $(".div-logs").show();
}

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
        return
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
    $(".div-login").hide()
    $("#container-inicio").show()
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
        alert("Não foi possível conectar ao servidor. Tente novamente mais tarde ou procure ajuda do Suporte.")
        return;
    });

    if (dados.ready == "false") {
        $(".statusPath").css("fill", "#de3b3b")
        $(".readyStatus").text("Offline")
    } else {
        $(".readyStatus").text("Online")
        $(".statusPath").css("fill", "#3ede3b") 
    }

    if (dados.qrcode != "null") {
        $(".qrcode").show();
        $("#qrcode").attr("src", dados.qrcode)
    } else {
        $(".qrcode").hide();
    }

    // TO DO LOGS
    var logs = dados.logs.split(",")
    $('.log-section').text("")
    for (var i = 0; i < logs.length; i++) {
        $(".log-section").append(document.createElement("p").innerHTML = `${i+1}. ` +logs[i] + "<br>")
    }

}

function conectarWpp() {
    if (!($(".qrcode").is(":visible"))) {
        alert("Não há nenhum qr code pendente para ser escaneado. Se estiver offline, aguarde um pouco e tente novamente.")
        return;
    }
    $("#popQrcode").show();
}

function fecharPopQr() {
    $("#popQrcode").hide();
}
const inputToken = document.getElementById('token')
var token;
var qr;
var url = "http://10.20.20.70:3000/";
var usingAPI = "asaas"

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
    $("#mobileMenu").hide();
    $("#container-whatsapp").show();
    $("a, .bg-gray-100").removeClass("bg-gray-100")
    $("#btnMenuWhatsapp").addClass("bg-gray-100")
}

function menuInicio() {
    if (token == null) {
        return
    }
    $(".containers").hide();
    $("#mobileMenu").hide();
    $("#container-inicio").show();
    $("a, .bg-gray-100").removeClass("bg-gray-100")
    $("#btnMenuInicio").addClass("bg-gray-100")
}

function menuCustomizacao() {
    if (token == null) {
        return
    }
    $(".containers").hide();
    $("#mobileMenu").hide();
    $("#container-customizacao").show();
    $("a, .bg-gray-100").removeClass("bg-gray-100")
    $("#btnMenuCustomizacao").addClass("bg-gray-100")
}

function menuRelatorios() {
    if (token == null) {
        return
    }
    $(".containers").hide();
    $("#mobileMenu").hide();
    $("#container-relatorios").show();
    $("a, .bg-gray-100").removeClass("bg-gray-100")
    $("#btnMenuRelatorios").addClass("bg-gray-100")
}

function mostrarLogs() {
    if ($(".div-logs").is(":visible")) {
        $(".div-logs").hide();
        return
    }
    $('html,body').animate({scrollTop: document.body.scrollHeight},"slow");
    $(".div-logs").show();
}

// PUXAR INFORMACOES DO BOT
window.onload = () => {
    carregarWhatsApp()
}

// RECARREGAR CONSTANTEMENTE AS INFORMACOES DO BOT
window.setInterval(function () {
    carregarWhatsApp();
}, 3000);

// ACÃO DO BOTAO DE LOGAR
async function btnSubmit() {
    var valid;
    if (inputToken.value == "") {
        alert("Por favor, digite um token de acesso.")
        return
    }
    await fetch(url + "api/validar", {
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
    if (!valid) {
        alert("Token de acesso negado. Por favor, tente novamente.")
        return
    }
    $(".div-login").hide()
    $("#container-inicio").show()
    token = inputToken.value
    carregarWhatsApp();
}

// PUXAR E EXIBIR INFORMAÇÕES DO BOT DO WHATSAPP
async function carregarWhatsApp() {

    if (token == null) { return }

    var dados = await fetch(url + "api/statusWpp", {
        headers: {
            'access_token': token
        },
    })
        .then(data => {
            return data.json();
        })
        .catch(error => {
            console.log("Não foi possível conectar ao servidor. Tente novamente mais tarde ou procure ajuda do Suporte.")
            return;
        });

    if (dados.ready == "false") {
        $(".statusPath").css("fill", "#de3b3b")
        $(".readyStatus").text("Offline")
    } else {
        $(".readyStatus").text("Online")
        $(".statusPath").css("fill", "#3ede3b")
    }

    if (dados.number != "null") {
        $("#numberConnected").text(dados.number)
    } else {
        $("#numberConnected").text("Nenhum")
    }

    if (dados.qrcode != "null") {
        qr = true;
        $("#qrcode").show();
        $("#qrcode").attr("src", dados.qrcode)
    } else {
        qr = false;
        $("#qrcode").hide();
    }

    // TO DO LOGS
    var logs = dados.logs.split(",")
    $('li').remove();
    for (var i = 0; i < logs.length; i++) {
        $("#log-section").append($(criarLog(logs[i])))
    }

}

// DESCONECTAR NUMERO CONECTADO AO WHATSAPP (NÃO FUNCIONANDO PERFEITAMENTE)
function desconectarWpp() {
    console.log("Desconectando...")
    fetch(url+"api/disconnectWpp",
    {
        method: "POST",
        headers: {
            'access_token': token
          },
    })
}

// ABRIR POPUP COM O QRCODE PARA ESCANEAR
function conectarWpp() {
    if (qr) {
        $("#popQrcode").show();
    } else {
        alert("Não há nenhum qr code pendente para ser escaneado. Se estiver offline, aguarde um pouco e tente novamente.")
        return;
    }
}
function fecharPopQr() {
    $("#popQrcode").hide();
}

// CRIAR ELEMENTO PARA A LISTA DE LOGS
function criarLog(msg) {

    var tipo = msg.match(/ *\[[^\]]*]/).pop().replaceAll("[", "").replaceAll("]", "").replaceAll(" ", "");
    msg = msg.replace(/ *\[[^\]]*]/, '');
    var svg;

    if (tipo == 'normal') {
        svg = ' <span class="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">' +
        '                              <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">' +
        '                                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />' +
        '                              </svg>'
    } else if (tipo == 'ok') {
        svg = '<span class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">'+
        '                              <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">'+
        '                                <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0114 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 01-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 01-1.341-.317l-2.734-1.366A3 3 0 006.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 012.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388z" />'+
        '                              </svg>';
            
        
    } else if (tipo == 'sucesso') {
        svg = '<span class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">'+
        '                              <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">'+
        '                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />'+
        '                              </svg>';
    } else if (tipo == 'erro') {
        svg = '<span style="background-color: #FF3333;" class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">'+
        '                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 384 512"><path fill="white" d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>';
    }



    var li = '<li>' +
        '                      <div class="relative pb-8">' +
        '                        <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>' +
        '                        <div class="relative flex space-x-3">' +
        '                          <div>' + svg +
        '                            </span>' +
        '                          </div>' +
        '                          <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">' +
        '                            <div>' +
        `                              <p class="text-sm text-gray-500">${msg.replace(/ *\([^)]*\) */g, "")}</p>` +
        '                            </div>' +
        '                            <div class="whitespace-nowrap text-right text-sm text-gray-500">' +
        `                              <time datetime="2020-09-20">${msg.match(/\((.*)\)/).pop()}</time>` +
        '                            </div>' +
        '                          </div>' +
        '                        </div>' +
        '                      </div>' +
        '                    </li>';

    return li
}

const qrcodeTerminal = require('qrcode-terminal');
const qrcode = require('qrcode');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
var qrcodeWpp = null;
var ready = false;
var numberConnected = null;
var statusLogs = ["Iniciando..."];

const client = new Client({
    restartOnAuthFail: true,
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // <- this one doesn't works in Windows
        '--disable-gpu'
      ],
    },
    authStrategy: new LocalAuth()
  });

client.on('qr', async qr => {
    console.log("Escaneie o QR CODE com o aplicativo do WhatsApp para realizar a sincronização.")
    if (!(statusLogs[statusLogs.length - 1] == "Escaneie o QR CODE com o aplicativo do WhatsApp para realizar a sincronização.")) {
        statusLogs.push("Escaneie o QR CODE com o aplicativo do WhatsApp para realizar a sincronização.");
    }
    qrcodeTerminal.generate(qr, {small: true})

    qrcodeWpp = await qrcode.toDataURL(qr)
});
 
client.on('authenticated', () => {
    console.log('Autenticado!');
    statusLogs.push("Autenticado");
    
    //sendMsg(data)
});

client.on('ready', () => {
    console.log('Bot pronto!');
    ready = true;
    qrcodeWpp = null;
    numberConnected = client.info.wid.user
    statusLogs.push("Bot iniciado e online!")
    //sendMsg(data)
});

client.on('auth_failure', () => {
    ready = false;
    statusLogs.push("Falha na autenticação, tentando novamente...")
});

client.on('disconnected', (reason) => {
    ready = false;
    statusLogs.push("O BOT foi desconectado (Motivo: " +reason+ "). Reiniciando...")
    client.destroy();
    client.initialize();
});

client.initialize();

const sendMsg = async function(data) {

    if (!ready) {
        console.log("Uma requisição foi feita mas o BOT de WhatsApp ainda não foi iniciado e/ou vinculado.")
        return "Por favor, aguarde alguns minutos e tente novamente. Se o problema persistir, entre em contato."
    }

    const nome = data.name;
    var id = await client.getNumberId(data.number)
    const boletos = data.data;

    if (id == null) {
        console.log("Não foi possível encontrar o número de WhatsApp. Por favor, confira o número novamente.")
        return "Não foi possível encontrar o número de WhatsApp. Por favor, confira o número novamente."
    }

    id = id._serialized

    if (boletos.length == 1) {
        client.sendMessage(id, "Olá, "+nome+"! Aqui está o seu boleto!")
    } else {
        client.sendMessage(id, "Olá, "+nome+"! Aqui estão os seus boletos!")
    }

    console.log(boletos)
    
    for (var i = 0; i < boletos.length; i++) {
        const media = await MessageMedia.fromUrl(boletos[i].pdf, options = {unsafeMime:true});
        media.mimetype = "application/pdf"
        media.filename = "Boleto de "+nome+" ("+boletos[i].vencimento+")"
        client.sendMessage(id, media)
    }

    if (boletos.length == 1) {
        console.log("O boleto foi enviado ao número informado! Obrigado.")
        return "O boleto foi enviado ao número informado! Obrigado."
    } else {
        console.log("Os boletos foram enviados ao número informado! Obrigado.")
        return "Os boletos foram enviados ao número informado! Obrigado."
    }
   
}

var status = function() {
    return JSON.parse(`{
        "ready": "${ready}",
        "qrcode": "${qrcodeWpp}",
        "number": "${numberConnected}",
        "logs": "${statusLogs}"
    }`)
}

var desconectar = function() {
    if (ready) {
        try {
            client.logout()
        } catch(e) {
            console.log(e)
        }
        client.initialize()
    }
}

module.exports = { 
    sendMsg,
    status,
    desconectar
}


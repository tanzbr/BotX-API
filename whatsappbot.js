const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
var qrcodeWpp;

var qrcode2 = require('qrcode')

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    console.log("Escaneie o QR CODE com o aplicativo do WhatsApp para realizar a sincronização.")
    qrcode.generate(qr, {small: true})

    qrcodeWpp = qrcode2.toDataURL(qr, function (err, url) {
    console.log(url)
    })
    console.log(qrcodeWpp) // FALTA PASSAR PARA PAGINA WEB
});
 
client.on('authenticated', () => {
    console.log('Autenticado!');
    //sendMsg(data)
});

client.on('ready', () => {
    console.log('Bot pronto!');
    //sendMsg(data)
});

client.initialize();

const { MessageMedia } = require('whatsapp-web.js');

const sendMsg = async function(data) {
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

module.exports = { 
    sendMsg,
    qrcodeWpp
}


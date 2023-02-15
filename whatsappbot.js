const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
    console.log("Escaneie o QR CODE com o aplicativo do WhatsApp para realizar a sincronização.")
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    sendMsg(data)
});

client.initialize();

const { MessageMedia } = require('whatsapp-web.js');

const data = {
    "number": "5563981452751",
    "name": "Aliryo",
    "data": [
        {
            "pdf": "https://www.asaas.com/b/pdf/1899013684999443",
            "vencimento": "10/03/2023"
        },
        {
            "pdf": "https://www.asaas.com/b/pdf/5591667588691950",
            "vencimento": "10/05/2023"
        },
        {
            "pdf": "https://www.asaas.com/b/pdf/0348252710267828",
            "vencimento": "10/06/2023"
        },
        {
            "pdf": "https://www.asaas.com/b/pdf/3833623602207924",
            "vencimento": "10/07/2023"
        },
        {
            "pdf": "https://www.asaas.com/b/pdf/9443511635971330",
            "vencimento": "10/08/2023"
        }
    ]
}

async function sendMsg(data) {
    const nome = data.name;
    var id = await client.getNumberId(data.number)
    const boletos = data.data;
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

}


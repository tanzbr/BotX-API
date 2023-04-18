import qrcodeTerminal from 'qrcode-terminal';
import { toDataURL } from 'qrcode';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
var qrcodeWpp = null;
var ready = false;
var numberConnected = null;
var logout = false;
var statusLogs = [`Iniciando... [normal] (${getTime()})`];

// GERAR STRING COM A DATA E HORA ATUAL
function getTime() {
    var today = new Date();
    var date = today.getDate()+'/'+(today.getMonth()+1)+"/"+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime
}

// INICIAR CLIENT DO BOT
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

// AÇÃO AO GERAR O QRCODE
client.on('qr', async qr => {
    console.log("Escaneie o QR CODE com o aplicativo do WhatsApp para realizar a sincronização.")
    if (!(statusLogs[statusLogs.length - 1].startsWith("Escaneie o QR CODE com o aplicativo do WhatsApp para realizar a sincronização."))) {
        statusLogs.push(`Escaneie o QR CODE com o aplicativo do WhatsApp para realizar a sincronização. [normal] (${getTime()})`);
    }
    qrcodeTerminal.generate(qr, {small: true})

    qrcodeWpp = await toDataURL(qr)
});
 
// AÇÃO AO AUTENTICAR O BOT
client.on('authenticated', () => {
    console.log('Autenticado!');
    statusLogs.push(`Autenticado [ok] (${getTime()})`);
    
    //sendMsg(data)
});

// AÇÃO AO BOT ESTAR READY
client.on('ready', () => {
    console.log('Bot pronto!');
    ready = true;
    qrcodeWpp = null;
    numberConnected = client.info.wid.user
    statusLogs.push(`Bot iniciado e online! [sucesso] (${getTime()})`)
    logout = false;
    //sendMsg(data)
});

// AÇÃO EM FALHA DE AUTENTICAÇÃO
client.on('auth_failure', () => {
    ready = false;
    statusLogs.push(`Falha na autenticação, tentando novamente... [erro] (${getTime()})`)
});

// AÇÃO AO DESCONECTAR O BOT
client.on('disconnected', (reason) => {
    ready = false;
    statusLogs.push(`O BOT foi desconectado {Motivo: ` +reason+ `}. Reiniciando... [erro] (${getTime()})`)
    numberConnected = null;
    if (!logout) {
        client.destroy();
        client.initialize();
    }
});

// INICIAR CLIENT
client.initialize();

// ENVIAR BOLETOS PARA O NUMERO DE WHATSAPP
export async function sendMsg(data) {

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
        const media = await MessageMedia.fromUrl(boletos[i].pdf, {unsafeMime:true});
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

// RETORNAR STATUS DO BOT
export function status() {
    return JSON.parse(`{
        "ready": "${ready}",
        "qrcode": "${qrcodeWpp}",
        "number": "${numberConnected}",
        "logs": "${statusLogs}"
    }`)
}

// DESCONECTAR O NUMERO CONECTADO (NÃO FUNCIONANDO 100%)
export function desconectar() {
    if (ready) {
        logout = true;
        try {
            client.logout()
        } catch(e) {
            console.log(e)
        }
        client.initialize()
    }
}


// ARQUIVO DE CONFIGURAÇÃO

export const config = {
  app: {
    port: 3000,
    // HTTPS OR HTTP
    mode: "http",
    // PATH TO SSL .KEY IF USE HTTPS
    pathToKey: "/usr/ssl/cert.key",
    // PATH TO SSL .CRT IF USE HTTPS
    pathToCert: "/usr/ssl/cert.crt",
    // USE API (AVAILABLE: asaas)
    using_api: "asaas",
    // PASSWORD FOR ADMIN PAGE (<url>/admin)
    admin_credential: "12345"
  },
  api_asaas: {
    token: "insert asaas token here for retrieve boletos",
  },
};

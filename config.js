// ARQUIVO DE CONFIGURAÇÃO

export const config = {
  app: {
    port: 3000,
    // HTTPS OR HTTP
    mode: "http",
    // CAMINHO PARA O SSL .KEY CASO USE HTTPS
    pathToKey: "/usr/ssl/cert.key",
    // CAMINHO PARA O SSL .CRT CASO USE HTTPS
    pathToCert: "/usr/ssl/cert.crt",
    // API SENDO USADA ATUALMENTE (DISPONIVEIS: asaas)
    using_api: "asaas",
    // SENHA PARA O LOGIN DO PAINEL /ADMIN
    admin_credential: "12345"
  },
  api_asaas: {
    token: "***REMOVED***",
  },
};

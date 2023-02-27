const config = {
  app: {
    port: 3000,
    // HTTPS OR HTTP
    mode: "http",
    // CAMINHO PARA O SSL .KEY
    pathToKey: "/usr/ssl/cert.key",
    // CAMINHO PARA O SSL .CRT
    pathToCert: "/usr/ssl/cert.crt",
    // API SENDO USADA ATUALMENTE (DISPONIVEIS: asaas)
    using_api: "asaas",
    admin_credential: "12345"
  },
  api_asaas: {
    token: "***REMOVED***",
  },
};

module.exports = config;

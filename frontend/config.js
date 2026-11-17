window.APP_CONFIG = {
  apiBaseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''
    : 'https://proyectoenlanube.onrender.com/api/v1/productos'
};

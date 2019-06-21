export default {
    // the following three lines MUST be updated
    domain: '<YOUR_AUTH0_DOMAIN>',
    audience: 'https://<YOUR_AUTH0_DOMAIN>/userinfo',
    clientID: '<YOUR_AUTH0_CLIENT_ID>',
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'id_token',
    scope: 'openid profile'
  }
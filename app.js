const {Provider} = require('oidc-provider');
const config = require('./lib/config');
const logger = require('./lib/infrastructure/logger');
const Account = require('./lib/domain/models/Account');

function _prepareProviderData() {
  const protocol = config.secureProtocolEnabled ? 'https://' : 'http://';
  const issuer = `${protocol}${config.host}:${config.port}`;
  const configuration = {
    claims: {
      openid: ['sub'],
      profile: ['family_name', 'given_name'],
    },
    clients: [
      {
        client_id: config.oidc.clientId,
        client_secret: config.oidc.clientSecret,
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        redirect_uris: config.oidc.redirectUris,
      }
    ],
    conformIdTokenClaims: false,
    features: {
      devInteractions: { enabled: config.isDevEnvironment }
    },
    findAccount: Account.findAccount,
    pkce: {
      required: () => { return false; }
    },
    renderError: async (ctx, out, error) => {
      console.log(ctx);
      console.log(out);
      console.error(error);
      ctx.type = 'html';
      ctx.body = `<!DOCTYPE html>
    <head>
      <title>oops! something went wrong</title>
      <style>/* css and html classes omitted for brevity, see lib/helpers/defaults.js */</style>
    </head>
    <body>
      <div>
        <h1>oops! something went wrong</h1>
        ${Object.entries(out).map(([key, value]) => `<pre><strong>${key}</strong>: ${value}</pre>`).join('')}
      </div>
    </body>
    </html>`;
    }
  };

  return {configuration, issuer};
}

function _addEventListeners(provider) {
  provider.on('access_token.issued', (token) => {
    logger.info(`Access token issued : ${JSON.stringify(token)}`);
  });
  provider.on('authorization_code.consumed', (code) => {
    logger.info(`Authorization code consumed : ${JSON.stringify(code)}`);
  });
  provider.on('authorization_code.saved', (code) => {
    logger.info(`Authorization code saved : ${JSON.stringify(code)}`);
  });
  provider.on('authorization_code.destroyed', (code) => {
    logger.info(`Authorization code destroyed : ${JSON.stringify(code)}`);
  });
  provider.on('authorization.error', (ctx, error) => {
    logger.warn('An authorization error occurred');
    logger.debug(ctx);
    logger.error(error);
  });
  provider.on('grant.error', (ctx, error) => {
    logger.warn('A grant error occurred');
    logger.debug(ctx);
    logger.error(error);
  });
  provider.on('server_error', (ctx, error) => {
    logger.warn('A server error occurred');
    logger.debug(ctx);
    logger.error(error);
  });
}

const {configuration, issuer} = _prepareProviderData();
const provider = new Provider(issuer, configuration);

_addEventListeners(provider);

if (!config.isDevEnvironment && !config.isTestEnvironment)
  provider.proxy = true;

provider.use(async (ctx, next) => {
  logger.debug(ctx);
  await next();
});

module.exports = {
  start() {
    provider.listen(config.port, () => {
      logger.info(`OIDC server provider listen on port ${config.port}, check ${issuer}/.well-known/openid-configuration`);
    });
  }
};

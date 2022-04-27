function _parseJSONEnv(key) {
  const value = process.env[key]
  return value ? JSON.parse(value) : undefined;
}

function _isFeatureEnabled(environmentVariable) {
  return environmentVariable === 'true';
}

function _isBooleanFeatureEnabledElseDefault(environmentVariable, defaultValue) {
  return environmentVariable === 'true' ? true : defaultValue;
}

function _overrideConfigForDevEnvironment(config) {
  const updatedConfig = {...config};

  updatedConfig.logging.enabled = true;
  updatedConfig.secureProtocolEnabled = false;

  return updatedConfig;
}

function _overrideConfigForTestEnvironment(config) {
  const updatedConfig = {...config};

  updatedConfig.port = 0;
  updatedConfig.secureProtocolEnabled = false;

  return updatedConfig;
}

module.exports = (function() {
  const config = {
    environment: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost',
    logging: {
      enabled: _isBooleanFeatureEnabledElseDefault(process.env.LOG_ENABLED, true),
      logForHumans: _isFeatureEnabled(process.env.LOG_FOR_HUMANS),
      logLevel: process.env.LOG_LEVEL || 'info'
    },
    oidc: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUris: _parseJSONEnv('REDIRECT_URIS')
    },
    port: parseInt(process.env.PORT) || 3010,
    secureProtocolEnabled: _isBooleanFeatureEnabledElseDefault(process.env.HTTPS, true),
    version: process.env.CONTAINER_VERSION || 'development'
  };

  if (config.environment === 'development')
    return _overrideConfigForDevEnvironment(config);

  if (config.environment === 'test')
    return _overrideConfigForTestEnvironment(config);

  return config;
})();

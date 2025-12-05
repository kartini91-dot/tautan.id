/**
 * Sentry Configuration
 * Error tracking dan monitoring untuk production
 */

const Sentry = require("@sentry/node");
const SentryTraceIntegration = require("@sentry/tracing");

const initSentry = (app) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new SentryTraceIntegration()
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    environment: process.env.NODE_ENV,
    maxBreadcrumbs: 50,
    debug: process.env.NODE_ENV !== 'production'
  });

  // Middleware untuk request tracing
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  return Sentry;
};

// Middleware untuk error handling dengan Sentry
const sentryErrorHandler = (app) => {
  app.use(Sentry.Handlers.errorHandler());
};

// Manual error reporting
const captureException = (error, context = {}) => {
  Sentry.withScope((scope) => {
    Object.keys(context).forEach(key => {
      scope.setContext(key, context[key]);
    });
    Sentry.captureException(error);
  });
};

const captureMessage = (message, level = 'info') => {
  Sentry.captureMessage(message, level);
};

module.exports = {
  initSentry,
  sentryErrorHandler,
  captureException,
  captureMessage,
  Sentry
};

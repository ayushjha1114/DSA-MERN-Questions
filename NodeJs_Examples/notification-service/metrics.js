const client = require('prom-client');

const register = new client.Registry();

const emailsSentCounter = new client.Counter({
  name: 'emails_sent_total',
  help: 'Total number of emails successfully sent',
});
register.registerMetric(emailsSentCounter);

const emailsFailedCounter = new client.Counter({
  name: 'emails_failed_total',
  help: 'Total number of emails that failed and went to DLQ',
});
register.registerMetric(emailsFailedCounter);

const deduplicatedCounter = new client.Counter({
  name: 'emails_deduplicated_total',
  help: 'Total number of duplicate emails skipped',
});
register.registerMetric(deduplicatedCounter);

const redisQueueGauge = new client.Gauge({
  name: 'redis_dlq_queue_size',
  help: 'Current size of failed-orders Redis queue',
});
register.registerMetric(redisQueueGauge);

client.collectDefaultMetrics({ register });

module.exports = {
  register,
  emailsSentCounter,
  emailsFailedCounter,
  deduplicatedCounter,
  redisQueueGauge,
};

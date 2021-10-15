const CronJob = require('cron').CronJob;
const notificationsWorker = require('./workers/notificationsWorker');

const scheduler = () => {
    return {
        start: function() {
            new CronJob('00 * * * * *', function() {
                notificationsWorker.run();
            }, null, true, '')
        }
    }
}

module.exports = scheduler();
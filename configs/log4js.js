module.exports = {
    appenders: {
        everything: { 
            type: 'dateFile', 
            filename: 'logs/logs.log', 
            pattern: '.yyyy-MM-dd-hh'
        }
    },
    categories: {
            default: { 
                appenders: ['everything'],
                level: 'all'
            }
    }
}
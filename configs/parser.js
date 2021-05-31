module.exports = {
    url: process.env.url,
    selectors: {
        address: 'table:nth-child(7) > tbody > tr:nth-child(n + 3) > td:nth-child(2) > p:nth-child(1)',
        floor: 'table:nth-child(7) > tbody > tr:nth-child(n + 3) > td:nth-child(3) > p',
        flats: 'table:nth-child(7) > tbody > tr:nth-child(n + 3) > td:nth-child(4) > p',
        area: 'table:nth-child(7) > tbody > tr:nth-child(n + 3) > td:nth-child(5) > p',
        deadLine: 'table:nth-child(7) > tbody > tr:nth-child(n + 3) > td:nth-child(6) > p',
        other: 'table:nth-child(7) > tbody > tr:nth-child(n + 3) > td:nth-child(7)'
    }
}

module.exports = {
    url: 'https://www.mil.by/ru/housing/commerc/',
    selectors: {
        id: 'div:nth-child(7) > table > tbody > tr:nth-child(n + 3) > td:nth-child(1) > p',
        address: 'div:nth-child(7) > table > tbody > tr:nth-child(n + 3) > td:nth-child(2) > p',
        floor: 'div:nth-child(7) > table > tbody > tr:nth-child(n + 3) > td:nth-child(3) > p',
        flats: 'div:nth-child(7) > table > tbody > tr:nth-child(n + 3) > td:nth-child(4) > p',
        area: 'tr:nth-child(n + 3) > td:nth-child(5) > p',
        deadLine: 'tr:nth-child(n + 3) > td:nth-child(6) > p',
        other: 'tr:nth-child(n + 3) > td:nth-child(7) > p'
    }
}
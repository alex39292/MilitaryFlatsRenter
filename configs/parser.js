module.exports = {
    url: process.env.url,
    selectors: {
        address: 'div.table-responsive:nth-child(7) > table > tbody > tr:nth-child(n + 3) > td:nth-child(2)',
        floor: 'div.table-responsive:nth-child(7) > table > tbody > tr:nth-child(n + 3) > td:nth-child(3) > p',
        flats: 'div.table-responsive:nth-child(7) > table > tbody > tr:nth-child(n + 3) > td:nth-child(4) > p',
        area: 'div.table-responsive:nth-child(7) > table > tbody > tr:nth-child(n + 3) > td:nth-child(5) > p',
        deadLine: 'div.table-responsive:nth-child(7) > table > tbody > tr:nth-child(n + 3) > td:nth-child(6) > p',
        other: 'div.table-responsive:nth-child(7) > table > tbody > tr:nth-child(n + 3) > td:nth-child(7)'
    }
}

const parser = require('./services/parser');

parser.getData().then(homes => console.log(homes.length));


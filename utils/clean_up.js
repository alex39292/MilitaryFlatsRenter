'use strict';

const fs = require('fs-extra');
const path = require('path');

const logsLocation = path.resolve(__dirname, '../logs');
fs.emptydirSync(logsLocation);
'use strict';

module.exports.generateSticker = (number) => {
    const charArray = [...number.toString()];
    let result = '';
    for (let c of charArray) {
        switch (c) {
            case '0': result += '\x30\xE2\x83\xA3';
                    break;
            case '1': result += ':one';
                    break;
            case '2': result += ':two:';
                    break;
            case '3': result += ':three:';
                    break;
            case '4': result += ':four:';
                    break;
            case '5': result += ':five:';
                    break;
            case '6': result += ':six:';
                    break;
            case '7': result += ':seven:';
                    break;
            case '8': result += ':eight:';
                    break;
            case '9': result += ':nine:';
                    break;
            default: result += '';
        }
    }
    return result;
}
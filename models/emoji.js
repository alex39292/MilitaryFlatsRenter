'use strict';

class Emoji {
        constructor() {
        }

        generateNumberToSticker(number) {
                const charArray = [...number.toString()];
                let result = '';
                for (let c of charArray) {
                    switch (c) {
                        case '0': result += '0️⃣';
                                break;
                        case '1': result += '1️⃣';
                                break;
                        case '2': result += '2️⃣';
                                break;
                        case '3': result += '3️⃣';
                                break;
                        case '4': result += '4️⃣';
                                break;
                        case '5': result += '5️⃣';
                                break;
                        case '6': result += '6️⃣';
                                break;
                        case '7': result += '7️⃣';
                                break;
                        case '8': result += '8️⃣';
                                break;
                        case '9': result += '9️⃣';
                                break;
                        default: result += '';
                    }
                }
                return result;
            }

        generateDate() {
                return '⏰';
        }

        generateZap() {
                return '📝';
        }
}

module.exports = Emoji;
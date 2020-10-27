const cryptoJS = require('crypto-js');

class Crypto {
    constructor(){
        this.key = cryptoJS.MD5('rooms-security').toString();
    }

    /**
     * 
     * @param {string | object} data 
     */
    encryptData(data){
        const cipher = cryptoJS.AES.encrypt(data, this.key).toString();
        return cipher;

    }
    
    /**
     * 
     * @param {string} data 
     */
    decryptData(data){
        const decipher = cryptoJS.AES.decrypt(data, this.key).toString();
        let originalText = decipher.toString(cryptoJS.enc.Utf8);
        return originalText;
    }
}

module.exports = function(){
    return new Crypto()
}

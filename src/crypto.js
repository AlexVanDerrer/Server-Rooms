class Crypto {
    constructor(){
        this.crypto = require('crypto');
        this.iv = this.crypto.randomBytes(16);  //генерация вектора инициализации
        this.key = this.crypto.scryptSync('secret', 'salt', 32); //генерация ключа
    }

    /**
     * 
     * @param {string} data 
     */
    encryptData(data){
        const cipher = this.crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
        let encryptedData = cipher.update(data, 'utf8', 'hex');
        encryptedData += cipher.final('hex');

        return encryptedData;
    }
    
    /**
     * 
     * @param {string} data 
     */
    decryptData(data){
        const decipher = this.crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
        let decryptedData = decipher.update(data, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');

        return decryptedData;
    }
}

module.exports = function(){
    return new Crypto()
}

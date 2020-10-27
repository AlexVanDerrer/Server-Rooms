const CryptoJS = require("crypto-js");

// var hash = CryptoJS.MD5("Message").toString();
// console.log(hash);

// Encrypt
// var ciphertext = CryptoJS.AES.encrypt('Alex Vanderrer', 'secret key 123').toString();
// console.log(ciphertext);

var ciphertext = 'U2FsdGVkX18693R4chXhuIB/RenKhMJlgQJXSjJLiHEUy1kTFkv4no3uQEAki0bfMCYD5dF3WPLkw/Jgra0CqQ=='


// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, CryptoJS.MD5('rooms-security').toString());
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText); // 'my message'


var sha256 = require('sha256');

var config = {
	restURI: '',
	serverPort: process.env.PORT || 3000,
    dbConnectionString : process.env.DATABASE_URL || '',
    appId: '', 
    appSecret: '',
    imagesAssetsPath: '/images/'
};

config.jsonDigest = function(input){
    return sha256(this.appSecret+JSON.stringify(input));
}
config.jsonDigestValidation = function(input, inputToken){
    var token = sha256(this.appSecret+JSON.stringify(input));

    return (token == inputToken)? true : false;
}
  
module.exports = config;
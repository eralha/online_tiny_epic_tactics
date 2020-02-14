
var sha256 = require('sha256');

var config = {
	restURI: '',
	serverPort: process.env.PORT || 3000,
    dbConnectionString : process.env.DATABASE_URL || 'postgres://fqvomirhmogxda:874bd92177eb61601108c560df2f9c3ce08da118f5cbeef65c1c429aa4e63597@ec2-54-195-241-106.eu-west-1.compute.amazonaws.com:5432/davs4ocl7b1bf2',
    appId: '217535612sdf234453117797', 
	appSecret: '4ad7a29sdfe38975casdsfçld90i4kmsd50882sdfsdff91c66397cbdb',
};

config.jsonDigest = function(input){
    return sha256(this.appSecret+JSON.stringify(input));
}
config.jsonDigestValidation = function(input, inputToken){
    var token = sha256(this.appSecret+JSON.stringify(input));

    return (token == inputToken)? true : false;
}
  
module.exports = config;
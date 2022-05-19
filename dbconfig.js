
const config = {
    user :'brian1234',
    password :'sql@12',
    server:'127.0.0.1',
    database:'ElectionSystem',
    options:{
        trustedconnection: true,
        enableArithAbort : true, 
        instancename :'SQLEXPRESS'
    },
    port : 1433,
}

module.exports = config; 
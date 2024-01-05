var config ={
 configValues : {
    "uname":"asaf",
    "pwd":"asaf"
},

    EMAIL_USERNAME: "c7a9a7ba54ffea",
    EMAIL_PASSWORD:"7a93c3e4b6a145",
    EMAIL_HOST:"sandbox.smtp.mailtrap.io",
    EMAIL_PORT:25,


    dev : 'development',
    test : 'testing',
    prod : 'production',
    port : process.env.PORT || 3000,
    expireTime: 60 * 60 * 1000,
    getDdConnectionString: function(){
        return '';
    },
    secrets: {
        jwt: process.env.JWT || "mysecret"
    },
};

module.exports = config;
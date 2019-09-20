const Client = require('ssh2-sftp-client');
const sftp = new Client();
const configs = require('./configs/sftp-server-configs');

sftp.connect(configs).then(() => {
    return sftp.list('/pathname')
}).then( data => {
    console.log('connection was successful');
    console.log(data);
}).catch(err => {
    console.error(err);
})
var Client = require('ftp');

var c = new Client({
    host: '',
    port: 21,
    user: '',
    password: '',
    connTimeout: 10000
});
c.on('ready', function() {
  c.list(function(err, list) {
    if (err) throw err;
    console.dir(list);
    c.end();
  });
});
// connect to localhost:21 as anonymous
c.connect();
var Client = require('ftp');
const identity_full_organizations = [];
let identity_full_organizationsRegexP = /Identity_full_Organization/g;
let identity_full_organizationsFile = '';
let chargeprofileFile = '';
let chargeProfileRegexP = /Charge Profile.csv/g;
let custBalanceDumpFullRegexP = /CustBalanceDumpFull.csv/g;
let customerBalanceDumpFile = '';
let latest_transactionsRegexP = /latest_transactions.txt/g;
let latest_transactionsFile = '';
let OrgBalanceDump_fullRegexP = /OrgBalanceDump_full.txt/g;
let OrgBalanceDump_fullFile = '';
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
    //console.dir(list);
    //list.forEach(file => {})
    prepareReportingFiles(list).then(() => {
        sortIdentityFullOrganizationFiles().then((cleanFiles) => {
            cleanFiles.sort();
            let latestFile = cleanFiles[cleanFiles.length -1];
            latestFile = latestFile.split('');
            latestFile.splice(8,0,'_');
            latestFile = latestFile.join('');
            identity_full_organizationsFile = 'Identity_full_Organization_' + '' +latestFile + '.xml';
        }, (err) => {
            console.error(err);
        }).then(() => {
            readFilesToLocalDirectory();
        })
    },(err) => {console.error(err);})
    c.end();
  });
});
// connect to localhost:21 as anonymous
c.connect();

async function prepareReportingFiles(list) {
    return (() => {
        list.forEach(file => {
            if(identity_full_organizationsRegexP.test(file.name)) {
                identity_full_organizations.push(file.name);
            }
            else if(chargeProfileRegexP.test(file.name)) {
                chargeprofileFile = file.name;
            }
            else if(custBalanceDumpFullRegexP.test(file.name)) {
                let customerBalanceDumpFile = file.name;
            }
            else if(latest_transactionsRegexP.test(file.name)) {
                latest_transactionsFile = file.name;
            }
            else if(OrgBalanceDump_fullRegexP.test(file.name)) {
                OrgBalanceDump_fullFile = file.name;
            }
            else {}
        })
    });
}

async function sortIdentityFullOrganizationFiles(files) {
    return (() => {
        files.map(file => {
            let fileStructure = file.split('_');
            return fileStructure[3] + '' +fileStructure[4].split('.')[0];
        })
    });
}

async function readFilesToLocalDirectory(client) {
    return (() => {
            client.on('ready', function() {
            client.get('identity_full_organizationsFile', function(err, stream) {
              if (err) throw err;
              stream.once('close', function() { client.end(); });
              stream.pipe(fs.createWriteStream(`./g2/${identity_full_organizationsFile}`));
            });
            client.get('identity_full_organizationsFile', function(err, stream) {
            if (err) throw err;
            stream.once('close', function() { client.end(); });
            stream.pipe(fs.createWriteStream(`./g2/${chargeprofileFile}`));
            });
            client.get('customerBalanceDumpFile', function(err, stream) {
            if (err) throw err;
            stream.once('close', function() { client.end(); });
            stream.pipe(fs.createWriteStream(`./g2/${customerBalanceDumpFile}`));
            });
            client.get('latest_transactionsFile', function(err, stream) {
            if (err) throw err;
            stream.once('close', function() { client.end(); });
            stream.pipe(fs.createWriteStream(`./g2/${latest_transactionsFile}`));
            });
            client.get('OrgBalanceDump_fullFile', function(err, stream) {
            if (err) throw err;
            stream.once('close', function() { client.end(); });
            stream.pipe(fs.createWriteStream(`./g2/${OrgBalanceDump_fullFile}`));
            });
          });
    });
}
var Client = require('ftp');
const fs = require('fs');
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
let testFile = '';
var c = new Client();
async function alex() {
c.on('ready', function() {
  await c.list(function(err, list) {
    if (err) throw err;
    // console.log(list);
    //list.forEach(file => {})
    prepareReportingFiles(list).then(() => { 
        sortIdentityFullOrganizationFiles(identity_full_organizations).then((cleanFiless) => {
           // console.log(cleanFiless);
            let cleanFiles = [];
            cleanFiles = cleanFiless.sort();
            console.log('-------------');
            console.log(cleanFiles);
            let latestFile = cleanFiles[cleanFiles.length -1];
            latestFile = latestFile.split('');
            latestFile.splice(8,0,'_');
            latestFile = latestFile.join('');
            identity_full_organizationsFile = 'Identity_full_Organization_' + '' +latestFile + '.xml';
            console.log(identity_full_organizationsFile);
        }, (err) => {
            console.error(err);
        }).then(() => {
            // readFilesToLocalDirectory(c);
        })
    },(err) => {console.error(err);})
    // c.end();
  });
  c.get(testFile, function(err, stream) {
      console.log(`${identity_full_organizationsFile}`);
    if (err) throw err;
    console.log('done...');
    stream.once('close', function() { c.end() });
    stream.pipe(fs.createWriteStream(`./g2/${identity_full_organizationsFile}`));
  });
});
// connect to localhost:21 as anonymous
c.connect({
    host: '172.29.127.70',
    port: 21,
    user: 'wakalaftp',
    password: 'Safaricom123',
    connTimeout: 10000
});

async function prepareReportingFiles(list) {
     
        list.forEach(file => {
            if(identity_full_organizationsRegexP.test(file.name)) {
                identity_full_organizations.push(file.name);
            }
            else if(chargeProfileRegexP.test(file.name)) {
                chargeprofileFile = file.name;
            }
            else if(custBalanceDumpFullRegexP.test(file.name)) {
                 customerBalanceDumpFile = file.name;
            }
            else if(latest_transactionsRegexP.test(file.name)) {
                latest_transactionsFile = file.name;
            }
            else if(OrgBalanceDump_fullRegexP.test(file.name)) {
                OrgBalanceDump_fullFile = file.name;
            }
            else {}
        });
     return '';
}

async function sortIdentityFullOrganizationFiles(files) {
    // console.log(files);
        let filenames = files.map(file => {
            let fileStructure = file.split('_');
            return fileStructure[3] + '' +fileStructure[4].split('.')[0];
        });
        console.log(filenames);
    return filenames;
}

/* async function readFilesToLocalDirectory(client) {
    console.log('init...');
            client.on('ready', function() {
            client.get('identity_full_organizationsFile', function(err, stream) {
              if (err) throw err;
              stream.once('close', function() { client.end(); });
              stream.pipe(fs.createWriteStream(`./g2/${identity_full_organizationsFile}`));
            });
            client.get('chargeprofileFile', function(err, stream) {
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

          return '';
}
*/
}

alex();
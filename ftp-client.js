var Client = require('ftp');
const fs = require('fs');
const identity_full_organizations = [];
let identity_full_organizationsRegexP = /Identity_full_Organization/g;
let identity_full_organizationsFile = '';
let identity_incremental_organizations = [];
let identity_incrementalRegexP = /Identity_incremental_Organization/g;
let chargeprofileFile = '';
let chargeProfileRegexP = /Charge Profile.csv/g;
let custBalanceDumpFullRegexP = /CustBalanceDumpFull.csv/g;
let customerBalanceDumpFile = '';
let latest_transactionsRegexP = /latest_transactions.csv/g;
let latest_transactionsFile = '';
let OrgBalanceDump_fullRegexP = /OrgBalanceDump_full.txt/g;
let OrgBalanceDump_fullFile = '';
/*====================== Customer files ================*/
let identityIncrementalCustomer = [];
let identityIncrementalCustomerRegexP = /Identity_incremental_Customer/g;
/*=======================Operator files ****************/
let identityIncrementalOperator = [];
let identityIncrementalOperatorRegexP = /Identity_incremental_Operator_/g;
let testFile = 'Identity_full_Organization_20190703_040000.xml';
var c = new Client();
async function alex() {
c.on('ready', function() {
    c.list(function(err, list) {
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
        })
    },(err) => {console.error(err);})
    // c.end();
  });
setTimeout(() =>{
    c.get(`${identity_full_organizationsFile}`, function(err, stream) {
    console.log(`${identity_full_organizationsFile}`);
    if (err) throw err;
    console.log('done...');
    stream.once('close', function() { c.end() });
    stream.pipe(fs.createWriteStream(`./g2/organisations/${identity_full_organizationsFile}`));
    });
    c.get(chargeprofileFile, function(err, stream) {
    if (err) throw err;
    stream.once('close', function() { c.end(); });
    stream.pipe(fs.createWriteStream(`./g2/charges/${chargeprofileFile}`));
    });
    c.get(customerBalanceDumpFile, function(err, stream) {
    if (err) throw err;
    stream.once('close', function() { c.end(); });
    stream.pipe(fs.createWriteStream(`./g2/customers/${customerBalanceDumpFile}`));
    });
    c.get(latest_transactionsFile, function(err, stream) {
    if (err) throw err;
    stream.once('close', function() { c.end(); });
    stream.pipe(fs.createWriteStream(`./g2/transactions/${latest_transactionsFile}`));
    });
    c.get(OrgBalanceDump_fullFile, function(err, stream) {
    if (err) throw err;
    stream.once('close', function() { c.end(); });
    stream.pipe(fs.createWriteStream(`./g2/organisations/${OrgBalanceDump_fullFile}`));
    });
    identityIncrementalCustomer.forEach(file => {
        c.get(file, function(err, stream) {
        if (err) throw err;
        stream.once('close', function() { c.end(); });
        stream.pipe(fs.createWriteStream(`./g2/customers/${file}`));
        });
    });
    identityIncrementalOperator.forEach(file => {
        c.get(file, function(err, stream) {
        if (err) throw err;
        stream.once('close', function() { c.end(); });
        stream.pipe(fs.createWriteStream(`./g2/operators/${file}`));
        }); 
    });
    
    /*identity_incremental_organizations.forEach(file => {
        c.append('Identity_full_Organization_20190703_040000.xml', function(err, stream) {
        if (err) throw err;
        stream.once('close', function() { c.end(); });
        stream.pipe(fs.createWriteStream('./g2/test.xml'));
        });
    })*/
}, 5000);
});
c.connect({
    host: '172.29.127.70',
    port: 21,
    user: 'wakalaftp',
    password: 'Safaricom123',
    connTimeout: 20000
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
                console.log(file.name);
                latest_transactionsFile = file.name;
            }
            else if(OrgBalanceDump_fullRegexP.test(file.name)) {
                OrgBalanceDump_fullFile = file.name;
            }
            else if(identity_incrementalRegexP.test(file.name)) {
                identity_incremental_organizations.push(file.name);
            }
            else if(identityIncrementalCustomerRegexP.test(file.name)) {
                identityIncrementalCustomer.push(file.name);
            }
            else if(identityIncrementalOperatorRegexP.test(file.name)) {
                identityIncrementalOperator.push(file.name);
            }
            else {}
        });
     return '';
}

async function sortIdentityFullOrganizationFiles(files) {
        let filenames = files.map(file => {
            let fileStructure = file.split('_');
            return fileStructure[3] + '' +fileStructure[4].split('.')[0];
        });
        console.log(filenames);
    return filenames;
}
}

alex();
var Seq = require('sequelize-cockroachdb');

// Connect to CockroachDB through Sequelize.
var seq = new Seq('bank', 'maxroach', '', {
    dialect: 'postgres',
    port: 26257,
    logging: false
});

// Define the Account model for the Accounts table.
var accounts = seq.define('accounts', {
  id: { type: Seq.INTEGER, primaryKey: true },
  balance: { type: Seq.INTEGER }
});

// Create the Accounts table.
accounts.sync({force: true}).then(function () {
    // Insert two rows into the Accounts table.
    return accounts.bulkCreate([
        {id: 1, balance: 1000},
        {id: 2, balance: 250},
        {id: 3, balance: -200}
    ]);
}).then(function () {
    // Retrieve Accounts
    return accounts.findAll();
}).then(function (accs) {
    // Print out the balances
    accs.forEach(function(account) {
        console.log(account.id + ': ' + account.balance);
    });
    process.exit(0);
}).catch(function (err) {
    console.error('error: ' + err.message);
    process.exit(1);
});



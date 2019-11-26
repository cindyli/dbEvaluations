var Sequelize = require('sequelize-cockroachdb');
var fluid = require("infusion");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");

// Connect to CockroachDB through Sequelize.
var sequelize = new Sequelize('bank', 'maxroach', '', {
    dialect: 'postgres',
    port: 26257,
    logging: false
});

// Define the Account model for the Accounts table.
gpiiCockroach.accountsModel = sequelize.define('accounts', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
  balance: { type: Sequelize.INTEGER }
});

// Function to create the Accounts table
gpiiCockroach.creatAccounts = function (options) {
    return options.accountsModel.sync({force: true});
};

// Function to insert some data into the Accounts table
gpiiCockroach.insertIntoAccounts = function (options) {
    return options.accountsModel.bulkCreate(
        [
            {id: 1, balance: 1000},
            {id: 2, balance: 250},
            {id: 3, balance: -200}
        ]
    );
};

// Function to retrieve accounts
gpiiCockroach.retrieveAccounts = function (options) {
    // Retrieve Accounts
    options.accounts = options.accountsModel.findAll();
    return options.accounts;
};

// Function to print out balances
gpiiCockroach.printBalances = function (options) {
    // Print out the balances
    var accs = options.accounts.value();
    accs.forEach(function(account) {
        console.log(account.id + ': ' + account.balance);
    });
    return "Done!";
};

// Function to exit cleanly
gpiiCockroach.exitNoErrors = function (result) {
    console.log(result[result.length-1]);
    process.exit(0);
};

// Function to exit with an error
gpiiCockroach.exitError = function (err) {
    console.error('error: ' + err.message);
    process.exit(1);
};

// Overall function
gpiiCockroach.doItAll = function () {
    var options = {};
    options.id = "Here be options";
    options.accountsModel = gpiiCockroach.accountsModel;
    var sequence = [
        gpiiCockroach.creatAccounts,
        gpiiCockroach.insertIntoAccounts,
        gpiiCockroach.retrieveAccounts,
        gpiiCockroach.printBalances
    ];
    fluid.promise.sequence(sequence, options).then(
        gpiiCockroach.exitNoErrors,
        gpiiCockroach.exitError
    );
}();


/*

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
*/

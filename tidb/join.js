var mysql = require("mysql");

require("./utils.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 4000,
  user: "root",
  password: "",
  database: "evaluate_tidb"
});

var statement = `SELECT gpiiKeys.gpiiKey, prefsSafes.preferences as prefs, timestampExpires\
    FROM gpiiAppInstallationAuthorizations, gpiiKeys, prefsSafes\
    WHERE gpiiAppInstallationAuthorizations.timestampExpires > NOW()\
    AND gpiiAppInstallationAuthorizations.gpiiKey = gpiiKeys.gpiiKey\
    AND gpiiKeys.prefsSafeId = prefsSafes.prefsSafeId`;

handleQuery(connection, statement);

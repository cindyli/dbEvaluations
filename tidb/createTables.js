var mysql = require("mysql");

require("./utils.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 4000,
  user: "root",
  password: "",
  database: "evaluate_tidb"
});

var createStatement = `CREATE TABLE gpiiKeys (\
  gpiiKey VARCHAR(36) NOT NULL PRIMARY KEY,\
  schemaVersion VARCHAR(100),\
  prefsSafeId VARCHAR(36),\
  revoked TINYINT,\
  revokedReason VARCHAR(255),\
  timestampCreated TIMESTAMP\
);\
\
CREATE TABLE prefsSafes (\
  prefsSafeId VARCHAR(36) NOT NULL PRIMARY KEY,\
  schemaVersion VARCHAR(100),\
  prefsSafeType VARCHAR(100),\
  name VARCHAR(255),\
  preferences JSON,\
  timestampCreated TIMESTAMP\
);\
\
CREATE TABLE gpiiAppInstallationAuthorizations (\
  accessToken VARCHAR(36) NOT NULL PRIMARY KEY,\
  schemaVersion VARCHAR(100),\
  clientId VARCHAR(36),\
  gpiiKey VARCHAR(36),\
  revoked TINYINT,\
  revokedReason VARCHAR(255),\
  timestampExpires TIMESTAMP\
)`;

handleQuery(connection, createStatement);

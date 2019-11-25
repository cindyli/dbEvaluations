var mysql = require("mysql");
var fs = require("fs");

require("./utils.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 4000,
  user: "root",
  password: "",
  database: "evaluate_tidb"
});

var now = new Date().toJSON();

var insertStatement = `INSERT INTO gpiiKeys VALUES \
("carla", "0.2", "prefsSafe-carla", 0, null, "` + now + `"),\
("alice", "0.2", "prefsSafe-alice", 0, null, "` + now + `"),\
("user1", "0.2", "prefsSafe-user1", 0, null, "` + now + `");\
\
INSERT INTO prefsSafes VALUES \
("prefsSafe-carla", "0.2", "snapset", "carla preferences", '` + JSON.stringify(JSON.parse(fs.readFileSync("./data/carla.json"))) + `', "` + now + `"),\
("prefsSafe-alice", "0.2", "snapset", "alice preferences", '` + JSON.stringify(JSON.parse(fs.readFileSync("./data/alice.json"))) + `', "` + now + `"),\
("prefsSafe-user1", "0.2", "snapset", "user1 preferences", '` + JSON.stringify(JSON.parse(fs.readFileSync("./data/user1.json"))) + `', "` + now + `");\
\
INSERT INTO gpiiAppInstallationAuthorizations VALUES \
("expired", "0.2", "gpiiAppInstallationClient-1", "carla", 0, null, "2019-10-17T14:10:14.096Z"),\
("unexpired", "0.2", "gpiiAppInstallationClient-1", "alice", 0, null, "2021-10-17T14:10:14.096Z");\
`;

handleQuery(connection, insertStatement);

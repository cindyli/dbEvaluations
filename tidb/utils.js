handleQuery = function (connection, statement) {
    connection.connect(function(err) {
        if (err) {
            errorHandling(connection, err);
        } else {
            console.log("Connected!");
            connection.query(statement, function (err, result) {
                if (err) {
                    errorHandling(connection, err);
                } else {
                    console.log("result: ", result);
                    console.log("Done!");
                    connection.end();
                }
            });
        }
    });
};

errorHandling = function (connection, err) {
    console.log("Error: ", err);
    connection.end();
};

/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Sequelize model for the prefsSafes table
// Use sequelize.import() to read in this model.

'use strict'

var Sequelize = require('sequelize-cockroachdb');  // SQL data types
var fluid = require("infusion");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");

module.exports = function () {
    gpiiCockroach.prefsSafesModel = gpiiCockroach.sequelize.define('prefsSafes', {
      prefsSafeId: { type: Sequelize.STRING(36), primaryKey: true },
      schemaVersion: { type: Sequelize.STRING(100) },
      prefsSafeType: { type: Sequelize.STRING(100) },
      name: { type: Sequelize.STRING(255) },
      preferences: { type: Sequelize.JSON },
      timestampCreated: { type: Sequelize.DATE }
    });
    return gpiiCockroach.prefsSafesModel;
};
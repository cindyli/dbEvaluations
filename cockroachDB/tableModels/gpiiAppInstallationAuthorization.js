/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Sequelize model for the gpiiAppInstallationAuthorizations table
// Use sequelize.import() to read in this model.

'use strict'

var Sequelize = require('sequelize-cockroachdb');  // SQL data types
var fluid = require("infusion");

var gpiiCockroach = fluid.registerNamespace("gpii.cockroach");

module.exports = function () {
    gpiiCockroach.gpiiAppInstallationAuthorizationsModel = gpiiCockroach.sequelize.define('gpiiAppInstallationAuthorizations', {
      accessToken: { type: Sequelize.STRING(36), primaryKey: true },
      schemaVersion: { type: Sequelize.STRING(100) },
      clientId: { type: Sequelize.STRING(36) },
      gpiiKey: {type: Sequelize.STRING(36) },
      revoked: { type: Sequelize.BOOLEAN },
      revokedReason: { type: Sequelize.STRING },
      timestampExpires: { type: Sequelize.DATE }
    });
    return gpiiCockroach.gpiiAppInstallationAuthorizationsModel;
};

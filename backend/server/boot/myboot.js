// create the default contractor account

'use strict';

module.exports = function (app) {
    delete app.models.contractor.validations.email;
    const contractor = app.models.contractor;
    contractor.create({ username: 'contractor', password: '12345' }, function (err, res) {
        if (err) throw err;
    })
}
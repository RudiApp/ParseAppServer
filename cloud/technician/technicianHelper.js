(function () {

    var util = require('cloud/utilities/utils.js');
    var md5 = require("cloud/md5/md5.js");

    var technicianHelper = {};

    technicianHelper.isTechnicianExist = function (email) {
        var technician = Parse.Object.extend("technician");
        var technicianQuery = new Parse.Query(technician);
        technicianQuery.equalTo("email", email);

        return technicianQuery.find
         ({
             success: function (results) {
                 if (results.length > 0) {
                     return true;
                 }
                 else {
                     return false;
                 };
             }
         })
    };


    technicianHelper.validateTechnician = function (request, response) {

        var technicianObj = Parse.Object.extend("technician");
        var technicianQuery = new Parse.Query(technicianObj);
        technicianQuery.equalTo("email", request.params.email);
        technicianQuery.equalTo("password", md5.hex_md5(request.params.password));

        return technicianQuery.find
        ({
            success: function (results) {
                if (results != null && results.length > 0) {

                    var existingTechnician = results[0];
                    existingTechnician.set('date_login', new Date());
                    existingTechnician.save(null, {
                        success: function (existingTechnician) {
                            response.success(existingTechnician);
                        },
                        error: function (existingTechnician, error) {
                            response.error(error);
                        }
                    });
                }
                else {
                    response.error('Invalid Email/Password.');
                }
            },
            error: function (technician, error) {
                response.error(error);
            }
        })
    };

    technicianHelper._saveTechnician = function (technician) {
        var technician = util.toTechnician(technician);
        return technician.save(null, {
            success: function (technician) {
                return technician;
            },
            error: function (technician, error) {
                return error;
            }
        });
    };
    technicianHelper.addTechnician = function (request, response) {

        var requiredFeilds = [request.params.first_name, request.params.last_name,
                       request.params.email, request.params.password, request.params.phone, request.params.service_industry];

        if (util.validate(requiredFeilds) == false) {
            response.error("Required fields are missing. Make sure you send FirstName,LastName,Email,Passoword,Phone and Service Industry properly.");
        }

        technicianHelper.isTechnicianExist(request.params.email)
            .then(function (exist) {
                if (exist == false) {

                    technicianHelper._saveTechnician(request.params)
                       .then(function (technician) {
                           response.success(technician);
                       }, function (error) {
                           response.error('Failed to create new technician, with error code: ' + error.message);
                       });
                }
                else {
                    //If technician found in our db then throw exception.
                    response.error('Technician with email ' + request.params.email + ' is already exist in our database');
                }
            });
    };

    module.exports = technicianHelper;
})();
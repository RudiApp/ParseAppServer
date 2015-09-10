(function () {

    var util = require('cloud/utilities/utils.js');
    var md5 = require("cloud/md5/md5.js");

    var customer = {};
  
    customer.isCustomerExist = function (email) {
        var customer = Parse.Object.extend("customer");
        var customerQuery = new Parse.Query(customer);
        customerQuery.equalTo("email", email);

        return customerQuery.find
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

    customer.validateCustomer = function (request, response) {

        var customer = Parse.Object.extend("customer");
        var customerQuery = new Parse.Query(customer);
        customerQuery.equalTo("email", request.params.email);
        customerQuery.equalTo("password", md5.hex_md5(request.params.password));

        return customerQuery.find
        ({
            success: function (results) {
                if (results != null && results.length > 0) {
                    response.success(results[0]);
                }
                else {
                    response.error('Invalid Email/Password.');
                }
            },
            error: function (customer, error) {
                response.error(error);
            }
        })
    };

    customer._saveCustomer = function (customer) {
        var customer = util.toCustomer(customer);
        return customer.save(null, {
            success: function (customer) {
                return customer;
            },
            error: function (customer, error) {
                return error;
            }
        });
    };

    customer.addCustomer = function (request, response) {

        var requiredFeilds = [request.params.first_name, request.params.last_name,
                      request.params.email, request.params.password, request.params.phone];

        if (util.validate(requiredFeilds) == false) {
            response.error("Required fields are missing. Make sure you send FirstName,LastName,Email,Phone and Passoword properly.");
        }

        customer.isCustomerExist(request.params.email)
            .then(function (exist) {
                if (exist == false) {

                    customer._saveCustomer(request.params)
                       .then(function (customer) {
                           response.success(customer);
                       }, function (error) {
                           response.error('Failed to create new customer, with error code: ' + error.message);
                       });
                }
                else {
                    //If customer found in our db then throw exception.
                    response.error('Customer with email ' + request.params.email + ' is already exist in our database');
                }
            });
    };

    module.exports = customer;

}());
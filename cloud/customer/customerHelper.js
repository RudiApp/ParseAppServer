(function () {

    var util = require('cloud/utilities/utils.js');
    var md5 = require("cloud/md5/md5.js");

    var customerHerlper = {};
  
    customerHerlper.isCustomerExist = function (email) {
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

    customerHerlper.validateCustomer = function (request, response) {

        var customerObj = Parse.Object.extend("customer");
        var customerQuery = new Parse.Query(customerObj);
        customerQuery.equalTo("email", request.params.email);
        customerQuery.equalTo("password", md5.hex_md5(request.params.password));

        return customerQuery.find
        ({
            success: function (results) {
                if (results != null && results.length > 0) {

                    var existingCustomer = results[0];
                    existingCustomer.set('date_login', new Date());
                    existingCustomer.save(null, {
                        success: function (existingCustomer) {
                            response.success(existingCustomer);
                        },
                        error: function (existingCustomer, error) {
                            response.error(error);
                        }
                    });                                       
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

    customerHerlper._saveCustomer = function (customer) {
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

    customerHerlper.addCustomer = function (request, response) {

        var requiredFeilds = [request.params.first_name, request.params.last_name,
                      request.params.email, request.params.password, request.params.phone];

        if (util.validate(requiredFeilds) == false) {
            response.error("Required fields are missing. Make sure you send FirstName,LastName,Email,Phone and Passoword properly.");
        }

        customerHerlper.isCustomerExist(request.params.email)
            .then(function (exist) {
                if (exist == false) {

                    customerHerlper._saveCustomer(request.params)
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

    module.exports = customerHerlper;

}());

var customer = require('cloud/customer/customer.js');

Parse.Cloud.define("addCustomer", customer.addCustomer);
Parse.Cloud.define("customerLogin", customer.validateCustomer);
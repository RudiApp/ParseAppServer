
var customerHelper = require('cloud/customer/customerHelper.js');
var technicianHelper = require('cloud/technician/technicianHelper.js')

Parse.Cloud.define("addCustomer", customerHelper.addCustomer);
Parse.Cloud.define("customerLogin", customerHelper.validateCustomer);
Parse.Cloud.define("addTechnician", technicianHelper.addTechnician);
Parse.Cloud.define("technicianLogin",technicianHelper.validateTechnician)
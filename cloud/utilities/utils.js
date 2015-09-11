(function () {

    module.exports = {
        /**
         * Get the version of the module.
         * @return {String}
         */
        version: '1.0.0',

        initialize: function () {
            return this;
        },

        //Accept array of values and check for blank.
        validate: function (values) {
            var valid = true;
            for (var index = 0; index <= values.length - 1; index++)
            {
                var valueToValidate = values[index];
                if (valueToValidate === "")
                {
                    valid = false;
                    break;
                }
            } 
            return valid;
        },

        toCustomer: function (requestBody) {
            var md5 = require("cloud/md5/md5.js");

            var Customer = Parse.Object.extend("customer");
            var customer = new Customer();

            customer.set("first_name", requestBody.first_name);
            customer.set("last_name", requestBody.last_name);
            customer.set("email", requestBody.email);
            customer.set("password", md5.hex_md5(requestBody.password));
            customer.set("phone", requestBody.phone);
            return customer;
        },

        toTechnician: function (requestBody) {
            var md5 = require("cloud/md5/md5.js");

            var Technician = Parse.Object.extend("technician");
            var technician = new Technician();

            technician.set("first_name", requestBody.first_name);
            technician.set("last_name", requestBody.last_name);
            technician.set("email", requestBody.email);
            technician.set("password", md5.hex_md5(requestBody.password));
            technician.set("phone", requestBody.phone);
            technician.set("service_industry", requestBody.service_industry);
            return technician;
        }

    }
}());
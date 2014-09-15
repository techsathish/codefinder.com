app.factory('MyUtil', function () {
    var service = {};

    service.validateEmail = function (email) {
        var re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
        return re.test(email);
    };

  
    return service;
});
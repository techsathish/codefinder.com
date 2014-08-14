app.factory('SignUpModels', function () {
    var model = {};

    model.UserDetail = {
        UserId: 0,
        FirstName: '',
        EmailId: '',
        Password: '',
        RetypePassword: '',
        SignUpFrom: '',
    };

    return model;
});
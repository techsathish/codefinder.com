app.factory('SignInModels', function () {
    var model = {};

    model.LoginType = {
        FaceBook: 0,
        Google: 1,
        CodeFinder: 2
    };

    model.SignInDetail = {
        UserName: '',
        Password: '',
        UserId: '',
        AccessToken: '',
        LoginType:''
    };

    return model;
});
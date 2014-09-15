app.factory('ProjectService', ['Restangular', function (Restangular) {

    var restAngular =
      Restangular.withConfig(function (Configurer) {
          Configurer.setBaseUrl('/api/userstories');
      });

    var _projectService = restAngular.all('project');

   

    return {
        getProjects: function () {
            return _projectService.getList();
        },

        createProject: function (newProject) {
           return _projectService.post(newProject);
        }        
    }

}]);
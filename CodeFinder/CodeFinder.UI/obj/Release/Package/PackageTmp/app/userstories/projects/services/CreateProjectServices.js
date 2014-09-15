app.factory('CreateProjectService', ['Restangular', function (Restangular) {

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
        },

        getProjectAndMemebers: function (projectId) {
            return _projectService.getList(projectId);
        }
    }

}]);
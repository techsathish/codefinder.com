app.factory('UpdateProjectService', ['Restangular', function (Restangular) {

    var restAngular =
      Restangular.withConfig(function (Configurer) {
          Configurer.setBaseUrl('/api/userstories');
      });

    var _projectService = null;

    return {
        getProjectAndMembers: function (projectId) {            
            _projectService = Restangular.one('project', projectId);
            return _projectService.get();
        },

        updateProjectAndMembers: function (project) {            
            return _projectService.customPUT(project);
        },

        deleteProject: function () {
            return _projectService.remove();
        }
    }

}]);
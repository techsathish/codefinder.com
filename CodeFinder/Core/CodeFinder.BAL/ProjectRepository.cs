using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CodeFinder.Model;
using CodeFinder.DAL;

namespace CodeFinder.BAL
{
    public static class ProjectRepository
    {
        public static List<Project> GetAllProjects(Guid createdBy) {
            return ProjectDT.Current.GetAllProjects(createdBy);
        }

        public static Project GetProjectAndMemebers(int projectId) {
            Project project = ProjectDT.Current.GetProjectAndMemebers(projectId);

            return project;
        }

        public static int CreateProject(Project project) {
            return ProjectDT.Current.CreateProject(project);
        }

        public static void UpdateProject(Project project){
            ProjectDT.Current.UpdateProject(project);
        }

        public static void DeleteProject(int id)
        {
            ProjectDT.Current.DeleteProject(id);
        }
    }
}

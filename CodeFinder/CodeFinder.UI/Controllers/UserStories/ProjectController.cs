using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using CodeFinder.BAL;
using CodeFinder.Common;
using CodeFinder.Model;
using System.Web.Security;

namespace CodeFinder.UI.Controllers.UserStories
{
    [Authorize]
    public class ProjectController : CodeFinderApiController
    {
        // GET: api/Project
        public IEnumerable<Project> Get()
        {
            Guid guid = (Guid)Membership.GetUser().ProviderUserKey;
            List<Project> projects = ProjectRepository.GetAllProjects(guid);
            return projects;
        }

        // GET: api/Project/5
        public Project Get(int id)
        {
            Project project = ProjectRepository.GetProjectAndMemebers(id);
            return project;
        }

        // POST: api/Project
        public int Post([FromBody]Project project)
        {

            project.CreatedBy = (Guid)Membership.GetUser().ProviderUserKey;

            project.ProjectMembers.Add(new ProjectMember
            {
                ProjectId = project.ProjectId,
                CanAcceptRequirement = true,
                CanEditContent = true,
                EmailId = User.Identity.Name,
                IsActive = true,
                UserId = project.CreatedBy
            });

            return ProjectRepository.CreateProject(project);
        }

        // PUT: api/Project/5
        public void Put(int id, [FromBody]Project project)
        {
            project.CreatedBy = (Guid)Membership.GetUser().ProviderUserKey;

            ProjectRepository.UpdateProject(project);
        }

        // DELETE: api/Project/5
        public void Delete(int id)
        {
            ProjectRepository.DeleteProject(id);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeFinder.Model
{
    public class Project
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public Guid CreatedBy { get; set; }

        public bool CanEditContent { get; set; }

        public bool CanAcceptRequirement { get; set; }

        public bool IsActive { get; set; }

        public bool IsOwner { get; set; }

        public List<ProjectMember> ProjectMembers { get; set; }
    }
}

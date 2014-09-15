using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeFinder.Model
{
    public class ProjectMember
    {
        public int ProjectMemberId { get; set; }
        public int ProjectId { get; set; }
        public Guid UserId { get; set; }
        public bool IsActive { get; set; }
        public bool CanEditContent { get; set; }
        public bool  CanAcceptRequirement{ get; set; }
        public string EmailId { get; set; }
        public string Name { get; set; }
    }

    public class ProjectMemberCastDB
    {
        public int ProjectMemberId { get; set; }
        public int ProjectId { get; set; }
        public Guid UserId { get; set; }
        public bool IsActive { get; set; }
        public bool CanEditContent { get; set; }
        public bool CanAcceptRequirement { get; set; }       
    }
}

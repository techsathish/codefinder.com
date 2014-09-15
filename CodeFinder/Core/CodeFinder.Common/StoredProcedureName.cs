using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeFinder.Common
{
    public static class StoredProcedureNames
    {
        public static class Project {
            public const string GetUserProject = "PRO_SELECT_USER_PROJECT";
            public const string GetProject = "PRO_SELECT_PROJECT";
            public const string CreateProject = "PRO_CREATE_PROJECT";
            public const string DeleteProject = "PRO_DELETE_PROJECT";
            public const string UpdateProject = "PRO_UPDATE_PROJECT";
            public const string ProjectAndMemebers = "PRO_GET_PROJECTANDMEMBERS";
        }

        public static class ProjectMembers {
            public const string UpsertProjectMemebers = "PRO_UPSERT_PROJECTMEMBERS";
        }
    }
}

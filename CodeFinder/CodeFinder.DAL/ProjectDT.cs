using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using CodeFinder.Model;
using CodeFinder.Common;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using CodeFinder.Common.Extention;

namespace CodeFinder.DAL
{
    public class ProjectDT
    {
        private static ProjectDT instance = null;

        public static ProjectDT Current
        {
            get
            {
                if (instance == null)
                    instance = new ProjectDT();
                return instance;
            }
        }

        public Project GetProjectAndMemebers(int projectId) {
            Project project = new Project();

            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["CareDeveloperConnection"].ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand { CommandText = StoredProcedureNames.Project.ProjectAndMemebers, Connection = con, CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.AddWithValue("@ProjectId", projectId);
                    SqlDataReader reader = null;
                    con.Open();

                    reader = cmd.ExecuteReader();

                    if (reader.Read()) {
                        project.ProjectId = reader.ReadValue<int>("ProjectId");
                        project.ProjectName = reader["ProjectName"].ToString();
                    }

                    reader.NextResult();

                    project.ProjectMembers = new List<ProjectMember>().FromDataReader(reader).ToList();     

                    //while (reader.Read())
                    //{
                    //    project.Add(new Project
                    //    {
                    //        ProjectId = (int)reader["ProjectId"],
                    //        ProjectName = (string)reader["ProjectName"]                 
                    //    });
                    //}
                }
            }

            return project;
        }

        public List<Project> GetAllProjects(Guid userId)
        {
            List<Project> Projects = null; //new List<Project>();

            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["CareDeveloperConnection"].ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand { CommandText = StoredProcedureNames.Project.GetUserProject, Connection = con, CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    SqlDataReader reader = null;
                    con.Open();

                    reader = cmd.ExecuteReader();

                    Projects = new List<Project>().FromDataReader(reader).ToList();                 
                }
            }

            return Projects;
        }

        public int CreateProject(Project project)
        {
            int projectId = 0;

            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["CareDeveloperConnection"].ConnectionString))
            {
                //create project

                var sqlParameters = new SqlParameter[] 
                {
                   new SqlParameter("@ProjectName", project.ProjectName),
                   new SqlParameter("@CreatedBy", project.CreatedBy),
                };

                using (SqlCommand cmd = new SqlCommand { CommandText = StoredProcedureNames.Project.CreateProject, Connection = con, CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.AddRange(sqlParameters);

                    SqlParameter cmdProjectId = new SqlParameter
                    {
                        ParameterName = "@ID",
                        Direction = ParameterDirection.Output,
                        SqlDbType = SqlDbType.Int
                    };

                    cmd.Parameters.Add(cmdProjectId);

                    con.Open();
                    cmd.ExecuteNonQuery();

                    projectId = Convert.ToInt32(cmd.Parameters["@ID"].Value);
                }


                if (projectId > 0)
                {
                    int i = 0;

                    project.ProjectMembers.ForEach(s =>
                    {
                        s.ProjectId = projectId;
                        s.ProjectMemberId = s.ProjectMemberId == 0 ? (-1 * (++i)) : s.ProjectMemberId;
                    });
                }

                DataTable myDataTable = project.ProjectMembers.ToDataTable<ProjectMember>(new List<string> { "EmailId", "Name" });

                using (SqlCommand cmd = new SqlCommand { CommandText = StoredProcedureNames.ProjectMembers.UpsertProjectMemebers, Connection = con, CommandType = CommandType.StoredProcedure })
                {
                    SqlParameter parameter = new SqlParameter
                    {
                        ParameterName = "@ProjectMembers",
                        SqlDbType = SqlDbType.Structured,
                        Value = myDataTable
                    };

                    cmd.Parameters.Add(parameter);

                    if (con.State == ConnectionState.Closed)
                        con.Open();

                    cmd.ExecuteNonQuery();
                }
            }

            return projectId;
        }


        public void UpdateProject(Project project)
        {

            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["CareDeveloperConnection"].ConnectionString))
            {
                //create project

                var sqlParameters = new SqlParameter[] 
                {
                   new SqlParameter("@ProjectId", project.ProjectId),
                   new SqlParameter("@ProjectName", project.ProjectName),
                   new SqlParameter("@ModifiedBy", project.CreatedBy)
                };

                using (SqlCommand cmd = new SqlCommand { CommandText = StoredProcedureNames.Project.UpdateProject, Connection = con, CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.AddRange(sqlParameters);

                    con.Open();
                    cmd.ExecuteNonQuery();

                    int i = 0;

                    project.ProjectMembers.ForEach(s =>
                    {
                        s.ProjectMemberId = s.ProjectMemberId == 0 ? (-1 * (++i)) : s.ProjectMemberId;
                    });

                    //update project members
                    DataTable myDataTable = project.ProjectMembers.ToDataTable<ProjectMember>(new List<string> { "EmailId", "Name" });

                    using (SqlCommand cmdProjectMembers = new SqlCommand { CommandText = StoredProcedureNames.ProjectMembers.UpsertProjectMemebers, Connection = con, CommandType = CommandType.StoredProcedure })
                    {
                        SqlParameter parameter = new SqlParameter
                        {
                            ParameterName = "@ProjectMembers",
                            SqlDbType = SqlDbType.Structured,
                            Value = myDataTable
                        };

                        cmdProjectMembers.Parameters.Add(parameter);

                        if (con.State == ConnectionState.Closed)
                            con.Open();

                        cmdProjectMembers.ExecuteNonQuery();
                    }
                }             
            }
        }

        public void DeleteProject(int id) {

            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["CareDeveloperConnection"].ConnectionString))
            {
                //create project

                var sqlParameters = new SqlParameter[] 
                {
                   new SqlParameter("@ProjectId", id),
                };

                using (SqlCommand cmd = new SqlCommand { CommandText = StoredProcedureNames.Project.DeleteProject, Connection = con, CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.AddRange(sqlParameters);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}

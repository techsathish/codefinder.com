using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeFinder.Model
{

    public class UserSignUpForm
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string EmailId { get; set; }
        public string Password { get; set; }
        public string RetypePassword { get; set; }
        public string SignUpFrom { get; set; }
    }

    public enum LoginType
    {
        Facebook,
        Google,
        CodeFinder
    }

    public class SignInDetail {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string AccessToken { get; set; }

        public LoginType LoginType { get; set; }
    }

    public class FacebookTokenResultError {
        public string message { get; set; }
        public string type { get; set; }
        //public bool IsTransient { get; set; }
        public int Code { get; set; }
    }

    public class FacebookTokenResult
    {
        public string Id { get; set; }
        public FacebookTokenResultError Error { get; set; }
    }

    public class UserSearch {
        public string SearchStringEmail { get; set; }
    }

    public class UserDetailsSearch {
        public string Email { get; set; }
    }

    public class UserProfile {
        public string Email { get; set; }
        public string FullName { get; set; }
        public Guid UserId { get; set; }
    }
}

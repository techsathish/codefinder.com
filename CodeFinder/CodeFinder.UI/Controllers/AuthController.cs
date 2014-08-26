using CodeFinder.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Profile;
using System.Web.Security;
using CodeFinder.Common;

namespace CodeFinder.Web.Controllers
{
    public class AuthController : CodeFinderApiController
    {
        [ActionName("Register")]
        [HttpPost]
        public AjaxResult PostRegister(UserSignUpForm userSignUpForm)
        {
            AjaxResult result = new AjaxResult();

            try
            {
                //first name valiadtion
                if (userSignUpForm.FirstName == "")
                {
                    result.Message = "name empty";
                    result.Status = Model.Status.Failure;
                    return result;
                }

                //email valitation

                //empty valdiation
                if (userSignUpForm.EmailId == "")
                {
                    result.Message = "emailid empty";
                    result.Status = Model.Status.Failure;
                    return result;
                }

                //email validation
                if (!ValidationHelper.IsValidEmail(userSignUpForm.EmailId))
                {
                    result.Message = "invalid email id";
                    result.Status = Model.Status.Failure;
                    return result;
                }

                //password validation
                if (userSignUpForm.SignUpFrom == "CodeFinder")
                {
                    if (userSignUpForm.Password == "")
                    {
                        result.Message = "password empty";
                        result.Status = Model.Status.Failure;
                        return result;
                    }
                }
                else
                {
                    userSignUpForm.Password = userSignUpForm.RetypePassword = "NoPassword";
                }

                if (userSignUpForm.Password != userSignUpForm.RetypePassword)
                {
                    result.Message = "password doesnt match";
                    result.Status = Model.Status.Failure;
                    return result;
                }

                MembershipCreateStatus membershipCreateStatus;
                MembershipUser user = Membership.CreateUser(userSignUpForm.EmailId, userSignUpForm.Password, userSignUpForm.EmailId, null, null, true, out membershipCreateStatus);

                if (membershipCreateStatus == MembershipCreateStatus.Success)
                {
                    dynamic profile = ProfileBase.Create(userSignUpForm.EmailId);
                    profile.FirstName = userSignUpForm.FirstName;
                    profile.SignUpFrom = userSignUpForm.SignUpFrom;
                    profile.Save();
                    result.Status = Model.Status.Success;

                }
                else
                {
                    result.Status = Model.Status.Failure;
                }

                //result.Result = new { 
                    
                //};

                result.Message = membershipCreateStatus.ToString();

                return result;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Status = Status.Failure;

                return result;
            }
        }

        [HttpGet]
        public AjaxResult GetUserExist(string emailId)
        {
            AjaxResult ajaxResult = new AjaxResult();

            MembershipUserCollection membershipUserCollection = Membership.FindUsersByEmail(emailId);
            if (membershipUserCollection != null && membershipUserCollection.Count > 0)
            {
                ajaxResult.Result = true;
            }
            else
            {
                ajaxResult.Result = false;
            }

            return ajaxResult;
        }

        [HttpGet]
        public bool DeleteUser(string emailId)
        {
            return Membership.DeleteUser(emailId);
        }

        [HttpGet]
        public AjaxResult IsAuthenticated() {
            AjaxResult ajaxResult = new AjaxResult();

            try
            {
                ajaxResult.Result = User.Identity.IsAuthenticated;
                ajaxResult.Status = Status.Success;
            }
            catch (Exception ex)
            {
                ajaxResult.Message = ex.Message;
                ajaxResult.Result = false;
                ajaxResult.Status = Status.Failure;
            }

            return ajaxResult;
        }

        [HttpPost]
        public AjaxResult Login(SignInDetail signinDetail)
        {
            AjaxResult ajaxResult = new AjaxResult();
            //HttpManager httpManager = new HttpManager();
            

            try
            {
                if (signinDetail.LoginType == LoginType.Facebook)
                {
                    string facebookUrl = "https://graph.facebook.com/me?fields=id&access_token=" + signinDetail.AccessToken;
                    FacebookTokenResult facebookTokenResult = HttpManager.GetResult<FacebookTokenResult>(facebookUrl);
                    if (facebookTokenResult.Id != null)
                    {
                        ajaxResult.Message = "Login Success";
                        ajaxResult.Result = true;
                        ajaxResult.Status = Status.Success;

                        FormsAuthentication.SetAuthCookie(signinDetail.UserName, false);                        
                    }
                    else {
                        ajaxResult.Message = "Login Failed";
                        ajaxResult.Result = false;
                        ajaxResult.Status = Status.Failure;

                        return ajaxResult;   
                    }

                    return ajaxResult;
                }
                else if (signinDetail.LoginType == LoginType.Google)
                {

                }
                else if (signinDetail.LoginType == LoginType.CodeFinder)
                {
                    string validationMessage = "";
                    bool valdiationPassed = true;

                    if (signinDetail.UserName == "") {
                        valdiationPassed = false;
                        validationMessage = "Username Empty";
                    }

                    if (signinDetail.Password == "") {
                        valdiationPassed = false;
                        validationMessage = "Password Empty";
                    }

                    if (!valdiationPassed) {
                        ajaxResult.Message = validationMessage;
                        ajaxResult.Result = false;
                        ajaxResult.Status = Status.Success;

                        return ajaxResult;
                    }

                    bool isAuthenticated = Membership.ValidateUser(signinDetail.UserName, signinDetail.Password);

                    if (isAuthenticated){
                        ajaxResult.Message = "Login Success";
                        ajaxResult.Result = true;
                        ajaxResult.Status = Status.Success;

                        FormsAuthentication.SetAuthCookie(signinDetail.UserName, false);           

                        return ajaxResult;
                    }
                    else {
                        ajaxResult.Message = "Login Failed";
                        ajaxResult.Result = false;
                        ajaxResult.Status = Status.Failure;

                        return ajaxResult;                        
                    }
                }
                else
                {
                    ajaxResult.Message = "Invalid Login Type";
                    ajaxResult.Status = Status.Failure;
                    return ajaxResult;
                }

                ajaxResult.Status = Status.Failure;
                ajaxResult.Message = "Unknown Error";

                return ajaxResult;
            }
            catch (Exception ex)
            {
                ajaxResult.Message = ex.Message;
                ajaxResult.Status = Status.Failure;
                return ajaxResult;
            }
        }

        [HttpGet]
        public AjaxResult Logout() {
            AjaxResult ajaxResult = new AjaxResult();

            try
            {
                FormsAuthentication.SignOut();
                ajaxResult.Result = true;
            }
            catch (Exception ex) {
                ajaxResult.Result = false;
                ajaxResult.Status = Status.Failure;
            }

            return ajaxResult;
        }
    }
}

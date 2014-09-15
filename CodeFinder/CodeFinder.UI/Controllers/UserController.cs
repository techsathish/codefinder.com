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

namespace CodeFinder.UI.Controllers
{
    public class UserController : CodeFinderApiController
    {
        [ActionName("UserNameSuggestion")]
        [HttpPost]
        [Authorize]
        public AjaxResult PostUserNameSuggestion(UserSearch userSearch)
        {
            AjaxResult ajaxResult = new AjaxResult();

            try
            {
                string typeString = userSearch.SearchStringEmail ?? "";

                typeString = typeString.Trim();

                if (!String.IsNullOrEmpty(typeString))
                {
                    int totalRecords = 0;
                    List<string> userEmail = null;

                    MembershipUserCollection membershipUserCollection = Membership.FindUsersByEmail(typeString + "%", 0, 7, out totalRecords);
                    if (membershipUserCollection != null)
                    {
                        userEmail = new List<string>();
                        foreach (MembershipUser item in membershipUserCollection)
                        {
                            if (User.Identity.Name != item.Email)
                            {
                                userEmail.Add(item.Email);
                            }
                        }
                    }

                    ajaxResult.Result = userEmail;
                }
                else
                {
                    ajaxResult.Message = "Given string is empty";
                    ajaxResult.Status = Status.Failure;
                }                
            }
            catch (Exception ex)
            {
                ajaxResult.Message = ex.Message;
                ajaxResult.Status = Status.Failure;
                return ajaxResult;
            }
         
            return ajaxResult;
        }

        [Authorize]
        [ActionName("UserCommonDetails")]
        [HttpPost]
        public AjaxResult PostUserCommonDetails(UserDetailsSearch userSearch)
        {
            AjaxResult ajaxResult = new AjaxResult();

            try
            {
                string email = userSearch.Email ?? "";

                email = email.Trim();

                if (!String.IsNullOrEmpty(email))
                {
                    UserProfile userProfile = null;

                    ProfileBase searchedProfile = ProfileBase.Create(email);

                    if (searchedProfile != null) {
                        userProfile = new UserProfile();

                        userProfile.FullName = (string)searchedProfile["FullName"];
                        userProfile.Email = email;
                        userProfile.UserId = (Guid)Membership.GetUser(email).ProviderUserKey;
                    }

                    ajaxResult.Result = userProfile;
                }
                else
                {
                    ajaxResult.Message = "Given string is empty";
                    ajaxResult.Status = Status.Failure;
                }
            }
            catch (Exception ex)
            {
                ajaxResult.Message = ex.Message;
                ajaxResult.Status = Status.Failure;
                return ajaxResult;
            }

            return ajaxResult;
        }
    }
}

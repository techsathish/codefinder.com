using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace CodeFinder.UI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Controller Only
            // To handle routes like `/api/VTRouting`
            config.Routes.MapHttpRoute(
                name: "ControllerOnly",
                routeTemplate: "api/{controller}"
            );

            // Controller with ID
            // To handle routes like `/api/VTRouting/1`
            config.Routes.MapHttpRoute(
                name: "ControllerAndId",
                routeTemplate: "api/{controller}/{id}",
                defaults: null,
                constraints: new { id = @"^\d+$" } // Only integers 
            );

            //USER STORIES

            // Controllers with Actions
            // To handle routes like `/api/userstories/controllername`
            config.Routes.MapHttpRoute(
                name: "ControllerOnlyForUserStories",
                routeTemplate: "api/userstories/{controller}"
            );

            // Controllers with Actions in UserStories
            // To handle routes like `/api/userstories/controllername/id`
            config.Routes.MapHttpRoute(
                name: "ControllerAndIdForUserStories",
                routeTemplate: "api/userstories/{controller}/{id}",
                defaults: null,
                constraints: new { id = @"^\d+$" } // Only integers 
            );

            // Controllers with Actions in UserStories
            // To handle routes like `/api/userstories/controllername/actionname`
            config.Routes.MapHttpRoute(
                name: "ControllerAndActionForUserStories",
                routeTemplate: "api/userstories/{controller}/{action}"
            );



            // Controllers with Actions in UserStories
            // To handle routes like `/api/userstories/controllername/actionname/id`
            config.Routes.MapHttpRoute(
                name: "ControllerAndActionIdForUserStories",
                routeTemplate: "api/userstories/{controller}/{action}/{id}",
                defaults: null,
                constraints: new { id = @"^\d+$" } // Only integers 
            );

            // Controllers with Actions
            // To handle routes like `/api/VTRouting/route`
            config.Routes.MapHttpRoute(
                name: "ControllerAndAction",
                routeTemplate: "api/{controller}/{action}"
            );

        }
    }
}

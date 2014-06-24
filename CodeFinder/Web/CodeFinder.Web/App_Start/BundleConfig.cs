using System.Web;
using System.Web.Optimization;

namespace CodeFinder.Web
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            //jquery
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-2.1.1.js"));

            //bootstrap
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                       "~/Scripts/bootstrap.js"));

            //angular js
            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                       "~/Scripts/angular.js",
                       "~/Scripts/angular-route.js",
                       "~/Scripts/angular-resource.js",
                       "~/Scripts/angular-animate.js"
                       ));        

            //app boot js
            bundles.Add(new ScriptBundle("~/bundles/boot").Include(
                    "~/app/boot/services.js",
                    "~/app/boot/boot.js"
                ));

            //home page js
            bundles.Add(new ScriptBundle("~/bundles/homepage").Include(
                   "~/app/home/controller/HomeController.js"
               ));

            //css 
            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                "~/Content/css/cosmo/bootstrap.css",
                "~/Content/css/cosmo/site.css"
            ));

        }
    }
}
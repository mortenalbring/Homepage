using System.Web;
using System.Web.Optimization;

namespace Homepage
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/d3").Include("~/Scripts/d3/d3.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular")
                .Include("~/Scripts/angular.js")
                .Include("~/Scripts/angular-route.js", 
                "~/Scripts/ng-file-upload.js",
            "~/Scripts/ng-file-upload-all.js",
            "~/Scripts/ng-file-upload-shim.js",
            "~/Scripts/FileAPI.js"));


            bundles.Add(new ScriptBundle("~/bundles/amenhokit")
               .Include("~/Scripts/d3.js")
                .Include("~/Scripts/moment.js")
               .Include("~/Scripts/angular-moment.js")
               .IncludeDirectory("~/Projects/AmenhokitApp/Controllers","*.js")
               .IncludeDirectory("~/Projects/AmenhokitApp/Services", "*.js")
               .Include("~/Projects/AmenhokitApp/amenhokitApp.js"));


            bundles.Add(new StyleBundle("~/Content/css")
                .Include("~/Content/mortenalbring.css", "~/Content/mortenalbring-charts.css", "~/Content/bootstrap.css", "~/Content/bootstrap-responsive.css", "~/Content/css/font-awesome.css")
                );
            bundles.Add(new LessBundle("~/Content/less")
                .Include("~/Content/styles/ma-home.less"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));
            
            BundleTable.EnableOptimizations = false;
        }

        
    }
}
using System.Web;
using System.Web.Optimization;
using OpenConfigurator.ModellingTool.WebUI.Common;

namespace OpenConfigurator.ModellingTool.WebUI
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            // Frameworks
            var frameworkBundle = new ScriptBundle("~/bundles/frameworks")
               .Include("~/Scripts/Frameworks/jquery-2.1.3.js")
               .Include("~/Scripts/Frameworks/jquery-ui.js")
               .Include("~/Scripts/Frameworks/knockout-3.2.0.js")
               .Include("~/Scripts/Frameworks/raphael.2.1.2.js")
               .Include("~/Scripts/Frameworks/underscore-min.js");
            frameworkBundle.Orderer = new NonOrderingBundleOrderer();
            bundles.Add(frameworkBundle);

            // Plugins (3rd party and custom)
            bundles.Add(new ScriptBundle("~/bundles/plugins")
                .Include("~/Scripts/Plugins/*.js")
                .Include("~/Scripts/CustomPlugins/*.js"));

            // Framework extensions
            bundles.Add(new ScriptBundle("~/bundles/frameworkextensions")
                .Include("~/Scripts/FrameworkExtensions/*.js"));

            // Application
            bundles.Add(new ScriptBundle("~/bundles/application")
                .Include("~/Scripts/Application/*.js"));

            // Css
            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

            // AMD
            var AMDBundle = new ScriptBundle("~/bundles/amd")
                .Include("~/Scripts/AMD/require.js")
                .Include("~/Scripts/AMD/text.js");
            AMDBundle.Orderer = new NonOrderingBundleOrderer();
            bundles.Add(AMDBundle);
        }
    }
}
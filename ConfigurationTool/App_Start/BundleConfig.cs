using System.Web;
using System.Web.Optimization;

namespace OpenConfigurator.ConfigurationTool
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                      "~/Scripts/libs/runtime*",
                      "~/Scripts/libs/polyfills*",
                      "~/Scripts/libs/vendor*",
                      "~/Scripts/libs/main*"));
        }
    }
}

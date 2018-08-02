using System.Web;
using System.Web.Optimization;
using OpenConfigurator.ConfigurationTool.WebUI.Common;

namespace OpenConfigurator.ConfigurationTool.WebUI
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            // Css
            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));
        }
    }
}
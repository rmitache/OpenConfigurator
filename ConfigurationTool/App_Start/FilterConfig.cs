using System.Web;
using System.Web.Mvc;

namespace OpenConfigurator.ConfigurationTool
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}

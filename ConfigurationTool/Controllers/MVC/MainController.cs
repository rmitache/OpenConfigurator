using System.Linq;
using System.Web;
using System.Web.Mvc;
using OpenConfigurator.ConfigurationTool.WebUI.Common;

namespace OpenConfigurator.ConfigurationTool.WebUI.Controllers
{
    public class MainController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string GetUIComponent(string UIComponentFullName)
        {
            // Get the UIComponent path
            var parsedUIComponentFullName = UIComponentFullName.Replace(".", "/");
            var shortName = parsedUIComponentFullName.Split('/').Last();
            string uiComponentNameAndPath = "~/" + parsedUIComponentFullName + "/" + shortName;

            // Parse js
            string htmlContent = Helpers.RenderViewToString(uiComponentNameAndPath + ".cshtml", this.ControllerContext);
            string jsScript = Helpers.GetJSFileAsString(Server.MapPath(uiComponentNameAndPath + ".js"));
            if (htmlContent != null)
            {
                jsScript = jsScript.Replace("#HTMLCONTENT#", HttpUtility.JavaScriptStringEncode(htmlContent, false));
            }

            //
            return jsScript;
        }
    }
}

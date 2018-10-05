using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OpenConfigurator.ModellingTool.WebUI.Common;
using System.Xml.Serialization;
using System.IO;
using System.Xml;
using System.Reflection;
using System.Net;
using OpenConfigurator.Core.Configuration.BLOManagers;
using OpenConfigurator.Core.Configuration.BLOs;

namespace OpenConfigurator.ModellingTool.WebUI.Controllers
{
    public class MainController : Controller
    {
        public ActionResult Index()
        {

            //ConfigurationInstanceManager configurationInstanceManager = new ConfigurationInstanceManager("");
            //ConfiguratorSession configSession = configurationInstanceManager.CreateConfiguratorSession(null);

            return View();
        }
    }
}

using OpenConfigurator.Core.Configuration.BLOManagers.Solver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OpenConfigurator.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var x = new SolverContext(null);
            return View();
        }
    }
}
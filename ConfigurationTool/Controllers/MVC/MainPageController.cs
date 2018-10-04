using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace WebUI.Controllers
{
    public class MainPageController : Controller
    {

        // MVC methods
        public IActionResult Index()
        {


            return View();
        }
    }

}

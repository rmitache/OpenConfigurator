using System.Diagnostics;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting.Internal;

namespace ModellingToolUI.Controllers;


public class APIController : Controller
{
    private readonly string modelFolderPath;
    private readonly IWebHostEnvironment _env;
    public APIController(IWebHostEnvironment env)
    {
        _env = env;
        modelFolderPath = System.IO.Path.Combine(_env.WebRootPath, "/ModelFiles/");
    }

    //[HttpGet]
    //public string Test()
    //{
    //    return "Test";
    //}

    [HttpGet]
    public iBLO CreateNewDefaultBLO(string bloTypeName)
    {
        return GenericBLOFactory.GetInstance().CreateBLOInstance(bloTypeName, DomainAreas.Modelling);
    }

}

using System.Diagnostics;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting.Internal;
using OpenConfigurator.Core.Domain.Common;
using OpenConfigurator.Core.Domain.Common.Factories;

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
    public BaseEntity? CreateNewDefaultBLO(string entityTypeName)
    {
        var newInstance = GenericEntityFactory.GetInstance().CreateEntityInstance(entityTypeName, DomainAreas.Modelling);
        return newInstance;
    }

}

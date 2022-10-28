using System.Diagnostics;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting.Internal;
using OpenConfigurator.Application.Services;
using OpenConfigurator.Core.Domain.Common;
using OpenConfigurator.Core.Domain.Common.Factories;
using OpenConfigurator.Core.Domain.Modeling.Entities;

namespace ModellingToolUI.Controllers;


public class APIController : Controller
{
    private readonly string _modelFolderPath;
    private readonly IWebHostEnvironment _env;
    private readonly IModelService _modelService;

    public APIController(IWebHostEnvironment env)
    {
        _env = env;
        _modelFolderPath = System.IO.Path.Combine(_env.WebRootPath, "/ModelFiles/");
    }

   

    [HttpGet]
    public BaseEntity? CreateNewDefaultBLO(string entityTypeName)
    {
        var newInstance = GenericEntityFactory.GetInstance().CreateEntityInstance(entityTypeName, DomainAreas.Modeling);
        return newInstance;
    }

    [HttpPost]
    public Model SaveChanges(Model model)
    {
        //ModelService service = new ModelService(_modelFolderPath);
        //manager.SaveModel(model);
        //return null;
        return null;
    }

    //[HttpGet]
    //public Model GetModel(string modelName)
    //{
    //    ModelManager manager = new ModelManager(modelFolderPath);
    //    return manager.GetModelByFileNameInFolder(modelName);
    //}

    //[HttpGet]
    //public string[] GetAllModelNames()
    //{
    //    ModelManager manager = new ModelManager(modelFolderPath);
    //    return manager.GetAllModelNames();
    //}
}

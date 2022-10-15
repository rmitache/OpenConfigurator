
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting.Internal;

namespace OpenConfigurator.WebUI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApiController : ControllerBase
{
    // Fields
    private string modelFolderPath = HostingEnvironment.MapPath("~/ModelFiles/");


    [HttpGet]
    public string CreateNewDefaultBLO()
    {
        return "Test";
    }

    //[HttpPost]
    //public Model SaveChanges(Model model)
    //{
    //    ModelManager manager = new ModelManager(modelFolderPath);
    //    manager.SaveModel(model);
    //    return null;
    //}

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

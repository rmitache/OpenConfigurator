using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using OpenConfigurator.Core.BLOs;
using OpenConfigurator.Core.Modelling.BLOs;
using OpenConfigurator.Core.Other.GenericBLOFactory;
using OpenConfigurator.Core.Modelling.BLOManagers;

namespace OpenConfigurator.ModellingTool.WebUI.Controllers
{
    public class GlobalAPIController : ApiController
    {
        // Fields
        private string modelFolderPath = HostingEnvironment.MapPath("~/ModelFiles/");


        [HttpGet]
        public iBLO CreateNewDefaultBLO(string bloTypeName)
        {
            return GenericBLOFactory.GetInstance().CreateBLOInstance(bloTypeName, DomainAreas.Modelling);
        }

        [HttpPost]
        public Model SaveChanges(Model model)
        {
            ModelManager manager = new ModelManager(modelFolderPath);
            manager.SaveModel(model);
            return null;
        }

        [HttpGet]
        public Model GetModel(string modelName)
        {
            ModelManager manager = new ModelManager(modelFolderPath);
            return manager.GetModelByFileNameInFolder(modelName);
        }

        [HttpGet]
        public string[] GetAllModelNames()
        {
            ModelManager manager = new ModelManager(modelFolderPath);
            return manager.GetAllModelNames();
        }
    }
}

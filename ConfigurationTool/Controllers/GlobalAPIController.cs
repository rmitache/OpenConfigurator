using OpenConfigurator.Core.Configuration.BLOManagers;
using OpenConfigurator.Core.Configuration.BLOManagers.Solver;
using OpenConfigurator.Core.Configuration.BLOs;
using OpenConfigurator.Core.Modelling.BLOManagers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace OpenConfigurator.Controllers
{
    public class GlobalAPIController : Controller
    {
        // Fields
        private readonly string _modelFolderPath;
        private readonly string _configurationInstanceFolderPath;
        

        public GlobalAPIController()
        {
            _modelFolderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/ModelFiles/");
            _configurationInstanceFolderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/ConfigurationFiles/");
        }

        // API methods (unused currently)
        [System.Web.Http.HttpGet]
        public JsonResult GetConfigurationInstance(string modelName)
        {
            // Get the FeatureModel
            ModelManager manager = new ModelManager(_modelFolderPath);
            Core.Modelling.BLOs.Model targetModel = manager.GetModelByFileNameInFolder(modelName);

            // Create a ConfiguratorSession and store it in the session
            ConfigurationInstanceManager configurationInstanceManager = new ConfigurationInstanceManager(_configurationInstanceFolderPath);
            ConfiguratorSession configSession = configurationInstanceManager.CreateConfiguratorSession(targetModel);
            HttpContext.Session["configuratorSession"] = configSession;

            // Toggle the root feature, as an initial starting point 
            configSession.ToggleFeatureAsUser(configSession.configurationInstance.RootFeatureSelection.FeatureIdentifier);


            //
            return Json(configSession.configurationInstance, JsonRequestBehavior.AllowGet);
        }
        [System.Web.Http.HttpPost]
        public void SaveConfigurationInstance()
        {
            // Get the ConfigurationInstance from the session
            ConfiguratorSession configSession = (ConfiguratorSession)HttpContext.Session["configuratorSession"];
            if (configSession == null)
            {
                throw new System.Exception("ConfiguratorSession not available anymore");
            }

            // Save it to file
            ConfigurationInstanceManager manager = new ConfigurationInstanceManager(_configurationInstanceFolderPath);
            manager.SaveConfigurationInstance(configSession.configurationInstance);
        }



        // API methods in use
        [System.Web.Http.HttpPost]
        public JsonResult UploadModelFile() // Uploads a Model file and then returns the ConfigurationInstance
        {
            try
            {
                // Get the model from the uploaded file
                var file = Request.Files[0];
                ModelManager manager = new ModelManager(_modelFolderPath);
                Core.Modelling.BLOs.Model targetModel = manager.GetModelFromStream(file.InputStream);

                // Create a ConfiguratorSession and store it in the session
                ConfigurationInstanceManager configurationInstanceManager = new ConfigurationInstanceManager(_configurationInstanceFolderPath);
                ConfiguratorSession configSession = configurationInstanceManager.CreateConfiguratorSession(targetModel);
                HttpContext.Session["configuratorSession"] = configSession;

                // Toggle the root feature, as an initial starting point 
                configSession.ToggleFeatureAsUser(configSession.configurationInstance.RootFeatureSelection.FeatureIdentifier);

                return Json(configSession.configurationInstance);
            }
            catch (System.Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }

        [System.Web.Http.HttpPost]
        public JsonResult ToggleFeatureSelection([FromBody] FeatureIDModel model)
        {
            // Get the ConfiguratorSession from the session state and Toggle the value
            ConfiguratorSession configSession = (ConfiguratorSession)HttpContext.Session["configuratorSession"];
            List<FeatureSelection> changedFeatureSelections = configSession.ToggleFeatureAsUser(model.FeatureID);


            // Return a dictionary with changes for each FeatureSelection
            Dictionary<string, object> changesDictionary = new Dictionary<string, object>();
            foreach (FeatureSelection changedFeatureSelection in changedFeatureSelections)
            {
                var featureSelectionChanges = new
                {
                    SelectionState = changedFeatureSelection.SelectionState,
                    Disabled = changedFeatureSelection.Disabled,
                    ToggledByUser = changedFeatureSelection.ToggledByUser,
                    AttributeValueChanges = new List<object>()
                };

                // Child attribute values
                foreach (AttributeValue changedAttrVal in changedFeatureSelection.AttributeValues)
                {
                    featureSelectionChanges.AttributeValueChanges.Add(new
                    {
                        AttributeIdentifier = changedAttrVal.AttributeIdentifier,
                        Value = changedAttrVal.Value
                    });
                }

                changesDictionary.Add(changedFeatureSelection.FeatureIdentifier, featureSelectionChanges);
            }

            return Json(changesDictionary);
        }

        public class FeatureIDModel
        {
            public string FeatureID { get; set; }
        }
        
    }
}
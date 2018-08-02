﻿using OpenConfigurator.Core.Configuration.BLOManagers;
using OpenConfigurator.Core.Configuration.BLOs;
using OpenConfigurator.Core.Modelling.BLOManagers;
using OpenConfigurator.Core;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Collections.Generic;
using OpenConfigurator.Core.Configuration.BLOManagers.Parser;


namespace OpenConfigurator.ConfigurationTool.WebUI.Controllers
{
    public class GlobalAPIController : ApiController
    {
        // Fields
        private string _modelFolderPath = HostingEnvironment.MapPath("~/ModelFiles/");
        private string _configurationInstanceFolderPath = HostingEnvironment.MapPath("~/ConfigurationFiles/");

        // API methods
        [HttpGet]
        public ConfigurationInstance GetConfigurationInstance(string modelName)
        {
            // Get the FeatureModel
            ModelManager manager = new ModelManager(_modelFolderPath);
            Core.Modelling.BLOs.Model targetModel = manager.GetModelByName(modelName);

            // Create a ConfiguratorSession and store it in the session
            ConfigurationInstanceManager configurationInstanceManager = new ConfigurationInstanceManager(_configurationInstanceFolderPath);
            ConfiguratorSession configSession = configurationInstanceManager.CreateConfiguratorSession(targetModel);
            HttpContext.Current.Session["configuratorSession"] = (object)configSession;

            // Toggle the root feature, as an initial starting point 
            configSession.ToggleFeatureAsUser(configSession.configurationInstance.RootFeatureSelection.FeatureIdentifier);


            //
            return configSession.configurationInstance;
        }
        [HttpPost]
        public Dictionary<string, object> ToggleFeatureSelection([FromBody]string featureID)
        {
            // Get the ConfiguratorSession from the session state and Toggle the value
            ConfiguratorSession configSession = (ConfiguratorSession)HttpContext.Current.Session["configuratorSession"];
            List<FeatureSelection> changedFeatureSelections = configSession.ToggleFeatureAsUser(featureID);


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
                foreach(AttributeValue changedAttrVal in changedFeatureSelection.AttributeValues)
                {
                    featureSelectionChanges.AttributeValueChanges.Add(new
                    {
                        AttributeIdentifier = changedAttrVal.AttributeIdentifier,
                        Value = changedAttrVal.Value
                    });
                }

                changesDictionary.Add(changedFeatureSelection.FeatureIdentifier, featureSelectionChanges);
            }

            return changesDictionary;
        }
        [HttpPost]
        public void SaveConfigurationInstance()
        {
            // Get the ConfigurationInstance from the session
            ConfiguratorSession configSession = (ConfiguratorSession)HttpContext.Current.Session["configuratorSession"];
            if (configSession == null)
            {
                throw new System.Exception("ConfiguratorSession not available anymore");
            }

            // Save it to file
            ConfigurationInstanceManager manager = new ConfigurationInstanceManager(_configurationInstanceFolderPath);
            manager.SaveConfigurationInstance(configSession.configurationInstance);
        }
    }
}

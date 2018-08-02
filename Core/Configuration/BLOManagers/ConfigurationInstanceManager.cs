using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using OpenConfigurator.Core.BLOs;
using OpenConfigurator.Core.Configuration.BLOs;
using OpenConfigurator.Core.Modelling.BLOs;
using OpenConfigurator.Core.Configuration.BLOManagers.Solver;
using OpenConfigurator.Core.XmlDAL.ConfigurationInstanceFile.Repositories;
using AutoMapper;

namespace OpenConfigurator.Core.Configuration.BLOManagers
{
    public class ConfigurationInstanceManager
    {
        // Fields
        private ConfigurationInstanceBLOFactory _configInstanceBLOFactory;
        private ConfigurationInstanceRepository _configInstanceRepository;

        // Constructor
        public ConfigurationInstanceManager(string configurationInstanceFolderPath)
        {
            _configInstanceBLOFactory = new ConfigurationInstanceBLOFactory();
            _configInstanceRepository = new ConfigurationInstanceRepository(configurationInstanceFolderPath);
        }

        // Public methods
        public void SaveConfigurationInstance(ConfigurationInstance configInstance)
        {
            // Get the DataEntity
            XmlDAL.ConfigurationInstanceFile.DataEntities.ConfigurationInstance dataEntity = Mapper.Map<XmlDAL.ConfigurationInstanceFile.DataEntities.ConfigurationInstance>(configInstance);

            // Save it
            _configInstanceRepository.SaveConfigurationInstance(dataEntity);
        }
        public ConfiguratorSession CreateConfiguratorSession(Model model)
        {
            // Create a ConfigurationInstance and SolverContext
            ConfigurationInstance configInstance = _configInstanceBLOFactory.Create_ConfigurationInstance_FromModel(model);
            SolverContext solverContext = new SolverContext(model);

            // Create a new ConfiguratorSession
            ConfiguratorSession newSession = new ConfiguratorSession(configInstance, model.CustomRules, solverContext);
            return newSession;
        }
    }
}

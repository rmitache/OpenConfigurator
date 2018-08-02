using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using OpenConfigurator.Core.XmlDAL.ConfigurationInstanceFile.DataEntities;

namespace OpenConfigurator.Core.XmlDAL.ConfigurationInstanceFile.Repositories
{
    internal class ConfigurationInstanceRepository
    {
        // Fields
        string _configInstanceFolderPath;

        // Constructor
        public ConfigurationInstanceRepository(string configInstanceFolderPath)
        {
            _configInstanceFolderPath = configInstanceFolderPath;
        }

        // Public methods
        public virtual void SaveConfigurationInstance(ConfigurationInstance configInstance)
        {
            // Write the file
            using (FileStream writer = new FileStream(_configInstanceFolderPath + configInstance.ModelName + ".cfx", FileMode.Create, FileAccess.Write))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(ConfigurationInstance));
                ser.WriteObject(writer, configInstance);
            }
        }
        public virtual ConfigurationInstance GetConfigurationInstance(string configInstanceName)
        {
            // Read file
            ConfigurationInstance dataEntity;
            using (FileStream reader = new FileStream(_configInstanceFolderPath + configInstanceName + ".cfx", FileMode.Open, FileAccess.Read))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(ConfigurationInstance));
                dataEntity = (ConfigurationInstance)ser.ReadObject(reader);
            }

            return dataEntity;
        }
        public string[] GetAllConfigInstanceNames()
        {
            // Read files and create DataEntities
            string[] configInstanceNames = Directory.GetFiles(_configInstanceFolderPath, "*.cix")
                                    .Select(path => Path.GetFileNameWithoutExtension(path))
                                    .ToArray();

            // 
            return configInstanceNames;
        }
    }
}

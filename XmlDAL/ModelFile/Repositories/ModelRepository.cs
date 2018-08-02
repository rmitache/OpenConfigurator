using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using OpenConfigurator.Core.XmlDAL.ModelFile.DataEntities;

namespace OpenConfigurator.Core.XmlDAL.ModelFile.Repositories
{
    internal class ModelRepository
    {
        // Fields
        string _modelFolderPath;

        // Constructor
        public ModelRepository(string modelFolderPath)
        {
            _modelFolderPath = modelFolderPath;
        }

        // Public methods
        public virtual void SaveModel(Model model)
        {
            // Write the file
            using (FileStream writer = new FileStream(_modelFolderPath + model.Name + ".xml", FileMode.Create, FileAccess.Write))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(Model));
                ser.WriteObject(writer, model);
            }
        }
        public virtual Model GetModel(string featureModelName)
        {
            // Read file
            Model dataEntity;
            using (FileStream reader = new FileStream(_modelFolderPath + featureModelName + ".xml", FileMode.Open, FileAccess.Read))
            {
                DataContractSerializer ser = new DataContractSerializer(typeof(Model));
                dataEntity = (Model)ser.ReadObject(reader);
            }

            return dataEntity;
        }
        public string[] GetAllModelNames()
        {
            // Read files and create DataEntities
            string[] modelNames = Directory.GetFiles(_modelFolderPath, "*.xml")
                                    .Select(path => Path.GetFileNameWithoutExtension(path))
                                    .ToArray();

            // 
            return modelNames;
        }
    }
}

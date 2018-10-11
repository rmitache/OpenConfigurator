using AutoMapper;
using OpenConfigurator.Core.Modelling.BLOs;
using OpenConfigurator.Core.XmlDAL.ModelFile.Repositories;
using System.IO;

namespace OpenConfigurator.Core.Modelling.BLOManagers
{
    public class ModelManager
    {
        // Fields
        private ModelRepository _modelRepository;

        // Constructor
        public ModelManager(string modelFolderPath)
        {
            _modelRepository = new ModelRepository(modelFolderPath);
        }

        // Public methods
        public void SaveModel(Model model)
        {
            // Get the DataEntity
            XmlDAL.ModelFile.DataEntities.Model dataEntity = Mapper.Map<XmlDAL.ModelFile.DataEntities.Model>(model);

            // Save it
            _modelRepository.SaveModel(dataEntity);
        }
        public Model GetModelByFileNameInFolder(string fileName)
        {
            // Get DataEntity and convert to BLO
            XmlDAL.ModelFile.DataEntities.Model dataEntity = _modelRepository.GetModel(fileName);
            BLOs.Model modelBLO = Mapper.Map<BLOs.Model>(dataEntity);
            return modelBLO;
        }
        public Model GetModelFromStream(Stream modelFileStream)
        {
            // Get DataEntity and convert to BLO
            XmlDAL.ModelFile.DataEntities.Model dataEntity = _modelRepository.GetModel(modelFileStream);
            BLOs.Model modelBLO = Mapper.Map<BLOs.Model>(dataEntity);
            return modelBLO;
        }
        public string[] GetAllModelNames()
        {
            // Read files and create BLOs
            return _modelRepository.GetAllModelNames();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenConfigurator.Application.Interfaces;
using OpenConfigurator.Core.Domain.Modeling.Entities;

namespace OpenConfigurator.Application.Services;
public class ModelService : IModelService
{
    // Fields
    private readonly IModelRepository _modelRepository;


    // Constructor
    public ModelService(IModelRepository modelRepository)
    {
        this._modelRepository = modelRepository;
    }


    // Public methods
    public void SaveModel(Model model)
    {
        //// Get the DataEntity
        //XmlDAL.ModelFile.DataEntities.Model dataEntity = Mapper.Map<XmlDAL.ModelFile.DataEntities.Model>(model);

        //// Save it
        //_modelRepository.SaveModel(dataEntity);
    }

    public Model GetModelByFileNameInFolder(string fileName)
    {
        // Get DataEntity and convert to BLO
        var model = _modelRepository.GetModel(fileName);

        return model;
    }

    //public Model GetModelFromStream(Stream modelFileStream)
    //{
    //    // Get DataEntity and convert to BLO
    //    XmlDAL.ModelFile.DataEntities.Model dataEntity = _modelRepository.GetModel(modelFileStream);
    //    BLOs.Model modelBLO = Mapper.Map<BLOs.Model>(dataEntity);
    //    return modelBLO;
    //}
    public string[] GetAllModelNames()
    {
        // Read files and create BLOs
        return _modelRepository.GetAllModelNames();
    }

}

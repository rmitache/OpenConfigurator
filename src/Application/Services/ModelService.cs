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
    public ModelService(string modelFolderPath, IModelRepository modelRepository)
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
    
}

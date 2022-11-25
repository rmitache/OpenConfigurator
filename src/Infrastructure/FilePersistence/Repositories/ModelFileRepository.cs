using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using OpenConfigurator.Application.Interfaces;
using OpenConfigurator.Core.Infrastructure.DataEntities;
using OpenConfigurator.Core.Domain.Modeling.Entities;

namespace OpenConfigurator.Infrastructure.FilePersistence.Repositories;
public class ModelFileRepository : IModelRepository
{
    // Fields
    private readonly string _modelFolderPath;
    private readonly IMapper _mapper;

    // Constructor
    public ModelFileRepository(string modelFolderPath, IMapper mapper)
    {
        _modelFolderPath = modelFolderPath;
        _mapper = mapper;   
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

    public Model GetModel(string featureModelName)
    {
        ModelDE dataEntity;
        using (FileStream reader = new FileStream(_modelFolderPath + "\\" + featureModelName + ".xml", FileMode.Open, FileAccess.Read))
        {
            DataContractSerializer ser = new DataContractSerializer(typeof(ModelDE));
            dataEntity = (ModelDE)ser.ReadObject(reader);
        }

        var model = _mapper.Map<Model>(dataEntity);
        return model;
    }

    public void UpdateModel(Model model)
    {
        // Convert to model filebased data entity 
        var dataEntity = _mapper.Map<ModelDE>(model);

        // Write the file
        using (FileStream writer = new FileStream(_modelFolderPath + "\\" + model.Name + ".xml", FileMode.Create, FileAccess.Write))
        {
            DataContractSerializer ser = new DataContractSerializer(typeof(ModelDE));
            ser.WriteObject(writer, dataEntity);
        }

    }
}

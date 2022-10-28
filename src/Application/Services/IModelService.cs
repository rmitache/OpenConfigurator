using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenConfigurator.Core.Domain.Modeling.Entities;

namespace OpenConfigurator.Application.Services;
public interface IModelService
{
    void SaveModel(Model model);
    Model GetModelByFileNameInFolder(string modelName);
    string[] GetAllModelNames();
}

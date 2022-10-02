using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenConfigurator.Domain.Modeling.Entities;

namespace OpenConfigurator.Application.Interfaces;
public interface IModelRepository
{
    public  void UpdateModel(Model model);
    public Model GetModel(string featureModelName);
    public string[] GetAllModelNames();
}

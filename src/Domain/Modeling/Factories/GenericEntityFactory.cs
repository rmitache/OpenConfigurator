using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using OpenConfigurator.Core.Domain.Common;

namespace OpenConfigurator.Core.Domain.Modeling.Factories;
public class GenericEntityFactory: IGenericEntityFactory
{
    public GenericEntityFactory()
    {

    }

    public BaseEntity? CreateEntityInstance(string entityTypeName, DomainAreas domainArea)
    {
        // Variables
        Assembly assembly = Assembly.GetAssembly(typeof(OpenConfigurator.Core.Domain.Common.BaseEntity));
        string domainAreaName = Enum.GetName(typeof(DomainAreas), domainArea);

        Type entityType = assembly.GetType("OpenConfigurator.Core." + domainAreaName + ".Entities." + entityTypeName);
        return CreateEntityInstance(entityType);
    }
    public BaseEntity? CreateEntityInstance(Type? entityType)
    {
        BaseEntity instance = (BaseEntity)entityType.GetMethod("CreateDefault", BindingFlags.NonPublic | BindingFlags.Static).Invoke(null, null);
        return instance;
    }
}

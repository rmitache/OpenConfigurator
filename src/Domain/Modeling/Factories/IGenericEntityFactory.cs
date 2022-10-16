using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using OpenConfigurator.Core.Domain.Common;

namespace OpenConfigurator.Core.Domain.Modeling.Factories;
public interface IGenericEntityFactory
{
    public BaseEntity CreateEntityInstance(string entityTypeName, DomainAreas domainArea);
    public BaseEntity CreateEntityInstance(Type entityType);
}

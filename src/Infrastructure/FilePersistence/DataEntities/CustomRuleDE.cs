using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Infrastructure.DataEntities;

[DataContract]
internal class CustomRuleDE
{
    [DataMember(Order = 0)]
    public string Identifier
    {
        get;
        set;
    }
    [DataMember(Order = 1)]
    public string Name
    {
        get;
        set;
    }
    [DataMember(Order = 2)]
    public string Expression
    {
        get;
        set;
    }
    [DataMember(Order = 3)]
    public string Description
    {
        get;
        set;
    }
}

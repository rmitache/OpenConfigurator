using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Infrastructure.DataEntities;

[DataContract]
internal class FeatureDE
{
    // Fields
    List<AttributeDE> attributes = new List<AttributeDE>();

    // Properties
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
    public List<AttributeDE> Attributes
    {
        get
        {
            return attributes ?? (attributes = new List<AttributeDE>());
        }
    }
    [DataMember(Order = 3)]
    public Nullable<double> XPos
    {
        get;
        set;
    }
    [DataMember(Order = 4)]
    public Nullable<double> YPos
    {
        get;
        set;
    }
}

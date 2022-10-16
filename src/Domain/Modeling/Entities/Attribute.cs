using OpenConfigurator.Core.Domain.Common;


namespace OpenConfigurator.Core.Domain.Modeling.Entities;

public class Attribute : BaseEntity
{
    // Properties
    public string Type
    {
        get
        {
            return "Attribute";
        }
    }
    public string Identifier
    {
        get;
        set;
    }
    public AttributeTypes AttributeType
    {
        get;
        set;
    }
    public AttributeDataTypes AttributeDataType
    {
        get;
        set;
    }
    public string DefaultValue
    {
        get;
        set;
    }
    public string Name
    {
        get;
        set;
    }
    public Feature ParentFeature
    {
        get;
        set;
    }

    // Constructors
    public Attribute()
    {
    }

    // Static instance creator
    internal static Attribute CreateDefault()
    {
        Attribute newBLO = new Attribute()
        {
            Name = "Default attribute"
        };
        newBLO.AttributeDataType = AttributeDataTypes.String;
        return newBLO;
    }
}

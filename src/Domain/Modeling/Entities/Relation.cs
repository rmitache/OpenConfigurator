using OpenConfigurator.Domain.Modeling.Enums;

namespace OpenConfigurator.Domain.Modeling.Entities;

public class Relation : BaseEntity
{
    // Properties
    public string Type
    {
        get
        {
            return "Relation";
        }
    }
    public string Identifier
    {
        get;
        set;
    }
    public RelationTypes RelationType
    {
        get;
        set;
    }
    public Feature ParentFeature
    {
        get;
        set;
    }
    public Feature ChildFeature
    {
        get;
        set;
    }
    public int? LowerBound
    {
        get;
        set;
    }
    public int? UpperBound
    {
        get;
        set;
    }
    public int? FixedLowerBound
    {
        get;
        set;
    }
    public int? FixedUpperBound
    {
        get;
        set;
    }

    // Constructors
    public Relation()
    {
    }

    // Static instance creator
    internal static Relation CreateDefault()
    {
        // Create new BLO
        Relation newBLO = new Relation()
        {
            RelationType = RelationTypes.Mandatory
        };
        newBLO.FixedLowerBound = (int?)typeof(RelationTypes_Info).GetNestedType(newBLO.RelationType.ToString()).GetField("FixedLowerBound").GetValue(null);
        newBLO.FixedUpperBound = (int?)typeof(RelationTypes_Info).GetNestedType(newBLO.RelationType.ToString()).GetField("FixedUpperBound").GetValue(null);

        // Set default initial bounds
        newBLO.LowerBound = (newBLO.FixedLowerBound == null) ? 1 : newBLO.FixedLowerBound;
        newBLO.UpperBound = (newBLO.FixedUpperBound == null) ? 2 : newBLO.FixedUpperBound;

        return newBLO;
    }
}

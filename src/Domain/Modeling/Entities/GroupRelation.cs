using OpenConfigurator.Core.Domain.Common;

namespace OpenConfigurator.Core.Domain.Modeling.Entities;

public class GroupRelation : BaseEntity
{
    // Fields
    protected List<Feature> childFeatures = new List<Feature>();

    // Properties
    public string Type
    {
        get
        {
            return "GroupRelation";
        }
    }
    public string Identifier
    {
        get;
        set;
    }
    public GroupRelationTypes GroupRelationType
    {
        get;
        set;
    }
    public Feature ParentFeature
    {
        get;
        set;
    }
    public List<Feature> ChildFeatures
    {
        get
        {
            return childFeatures;
        }
    }
    public int? UpperBound
    {
        get;
        set;
    }
    public int? LowerBound
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
    public GroupRelation()
    {
    }

    // Static instance creator
    internal static GroupRelation CreateDefault()
    {

        // Create new BLO
        GroupRelation newBLO = new GroupRelation()
        {
            GroupRelationType = GroupRelationTypes.XOR
        };
        newBLO.FixedLowerBound = (int?)typeof(GroupRelationTypes_Info).GetNestedType(newBLO.GroupRelationType.ToString()).GetField("FixedLowerBound").GetValue(null);
        newBLO.FixedUpperBound = (int?)typeof(GroupRelationTypes_Info).GetNestedType(newBLO.GroupRelationType.ToString()).GetField("FixedUpperBound").GetValue(null);

        // Set default initial bounds
        newBLO.LowerBound = (newBLO.FixedLowerBound == null) ? 0 : newBLO.FixedLowerBound;
        newBLO.UpperBound = (newBLO.FixedUpperBound == null) ? 1 : newBLO.FixedUpperBound;

        return newBLO;
    }

}

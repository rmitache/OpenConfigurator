using OpenConfigurator.Domain.Modeling.Enums;

namespace OpenConfigurator.Domain.Modeling.Entities;

public class Model : BaseEntity
{
    // Fields
    protected List<Feature> features = new List<Feature>();
    protected List<Relation> relations = new List<Relation>();
    protected List<GroupRelation> groupRelations = new List<GroupRelation>();
    protected List<CompositionRule> compositionRules = new List<CompositionRule>();
    protected List<CustomRule> customRules = new List<CustomRule>();

    // Properties
    public string Type
    {
        get
        {
            return "FeatureModel";
        }
    }
    public string Name
    {
        get;
        set;
    }
    public UIOrientationTypes UIOrientation
    {
        get;
        set;
    }
    public decimal ScaleModifier
    {
        get;
        set;
    }
    public List<Feature> Features
    {
        get
        {
            return features;
        }
    }
    public List<Relation> Relations
    {
        get
        {
            return relations;
        }
    }
    public List<GroupRelation> GroupRelations
    {
        get
        {
            return groupRelations;
        }
    }
    public List<CompositionRule> CompositionRules
    {
        get
        {
            return compositionRules;
        }
    }
    public List<CustomRule> CustomRules
    {
        get
        {
            return customRules;
        }
    }

    // Special static methods
    internal static Model CreateDefault()
    {
        Model newBLO = new Model()
        {
            Name = "Unnamed Model",
            UIOrientation = UIOrientationTypes.Vertical,
            ScaleModifier = 1
        };
        return newBLO;
    }
}

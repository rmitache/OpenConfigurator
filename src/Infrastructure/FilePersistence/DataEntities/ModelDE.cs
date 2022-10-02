using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Infrastructure.DataEntities;

[DataContract]
internal class ModelDE
{
    // Fields
    protected List<FeatureDE> features = new List<FeatureDE>();
    protected List<RelationDE> relations = new List<RelationDE>();
    protected List<GroupRelationDE> groupRelations = new List<GroupRelationDE>();
    protected List<CompositionRuleDE> compositionRules = new List<CompositionRuleDE>();
    protected List<CustomRuleDE> customRules = new List<CustomRuleDE>();

    // Properties
    [DataMember(Order = 0)]
    public string Name
    {
        get;
        set;
    }
    [DataMember(Order = 1)]
    public int UIOrientation
    {
        get;
        set;
    }
    [DataMember(Order = 2)]
    public decimal ScaleModifier
    {
        get;
        set;
    }
    [DataMember(Order = 3)]
    public List<FeatureDE> Features
    {
        get
        {
            return features ?? (features = new List<FeatureDE>());
        }
    }
    [DataMember(Order = 4)]
    public List<RelationDE> Relations
    {
        get
        {
            return relations ?? (relations = new List<RelationDE>());
        }
    }
    [DataMember(Order = 5)]
    public List<GroupRelationDE> GroupRelations
    {
        get
        {
            return groupRelations ?? (groupRelations = new List<GroupRelationDE>());
        }
    }
    [DataMember(Order = 6)]
    public List<CompositionRuleDE> CompositionRules
    {
        get
        {
            return compositionRules ?? (compositionRules = new List<CompositionRuleDE>());
        }
    }
    [DataMember(Order = 7)]
    public List<CustomRuleDE> CustomRules
    {
        get
        {
            return customRules ?? (customRules = new List<CustomRuleDE>());
        }
    }
    
}

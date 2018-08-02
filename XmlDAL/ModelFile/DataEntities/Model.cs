using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.XmlDAL.ModelFile.DataEntities
{
    [DataContract]
    internal class Model : iDataEntity
    {
        // Fields
        protected List<Feature> features = new List<Feature>();
        protected List<Relation> relations = new List<Relation>();
        protected List<GroupRelation> groupRelations = new List<GroupRelation>();
        protected List<CompositionRule> compositionRules = new List<CompositionRule>();
        protected List<CustomRule> customRules = new List<CustomRule>();

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
        public List<Feature> Features
        {
            get
            {
                return features ?? (features = new List<Feature>());
            }
        }
        [DataMember(Order = 4)]
        public List<Relation> Relations
        {
            get
            {
                return relations ?? (relations = new List<Relation>());
            }
        }
        [DataMember(Order = 5)]
        public List<GroupRelation> GroupRelations
        {
            get
            {
                return groupRelations ?? (groupRelations = new List<GroupRelation>());
            }
        }
        [DataMember(Order = 6)]
        public List<CompositionRule> CompositionRules
        {
            get
            {
                return compositionRules ?? (compositionRules = new List<CompositionRule>());
            }
        }
        [DataMember(Order = 7)]
        public List<CustomRule> CustomRules
        {
            get
            {
                return customRules ?? (customRules = new List<CustomRule>());
            }
        }
        
    }
}

using OpenConfigurator.Core.BLOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Modelling.BLOs
{
    public class GroupRelation : iBLO
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
}

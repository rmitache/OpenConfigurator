using OpenConfigurator.Core.BLOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Configuration.BLOs
{
    public class FeatureSelection : iBLO
    {
        // Fields
        private List<AttributeValue> attributeValues = new List<AttributeValue>();
        private List<FeatureSelection> childFeatureSelections = new List<FeatureSelection>();
        private List<Group> childGroups = new List<Group>();

        // Properties
        public string FeatureIdentifier
        {
            get;
            set;
        }
        public string FeatureName
        {
            get;
            set;
        }
        public FeatureSelectionStates SelectionState
        {
            get;
            set;
        }
        public bool? Disabled
        {
            get;
            set;
        }
        public bool? ToggledByUser
        {
            get;
            set;
        }
        public List<AttributeValue> AttributeValues
        {
            get
            {
                return attributeValues;
            }
        }
        public List<FeatureSelection> ChildFeatureSelections
        {
            get
            {
                return childFeatureSelections;
            }
        }
        public List<Group> ChildGroups
        {
            get
            {
                return childGroups;
            }
        }

        // Constructor
        public FeatureSelection()
        {
        }

        // Public methods
        public List<FeatureSelection> GetAllChildrenFeatureSelectionsIncludingFromChildGroups()
        {
            List<FeatureSelection> children = new List<FeatureSelection>();
            childFeatureSelections.ForEach(childFeatureSel => children.Add(childFeatureSel));
            childGroups.ForEach(childGroup => childGroup.InnerFeatureSelections.ForEach(innerFeatureSel => children.Add(innerFeatureSel)));


            return children;
        }

    }
}

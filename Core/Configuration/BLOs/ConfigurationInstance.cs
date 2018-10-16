using OpenConfigurator.Core.BLOs;
using OpenConfigurator.Core.Modelling.BLOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Configuration.BLOs
{
    public class ConfigurationInstance : iBLO
    {
        // Fields
        private List<FeatureSelection> featureSelections;
        private FeatureSelection rootFeatureSelection;

        // Properties
        public List<FeatureSelection> FeatureSelections
        {
            get
            {
                return featureSelections;
            }
        }
        public FeatureSelection RootFeatureSelection
        {
            get
            {
                return rootFeatureSelection;
            }
        }
        public string ModelName
        {
            get;
            set;
        }

        // Private methods
        private List<FeatureSelection> GetDescendantFeatureSelections_Recursive(FeatureSelection target)
        {
            List<FeatureSelection> childFeatureSelections = target.GetAllChildrenFeatureSelectionsIncludingFromChildGroups();
            List<FeatureSelection> descendants = new List<FeatureSelection>(childFeatureSelections);


            foreach (FeatureSelection childFeatureSel in childFeatureSelections)
            {
                descendants.AddRange(this.GetDescendantFeatureSelections_Recursive(childFeatureSel));
            }
            
            return descendants;
        }

        // Constructor
        public ConfigurationInstance(FeatureSelection rootFeatureSelection, List<FeatureSelection> featureSelections)
        {
            this.rootFeatureSelection = rootFeatureSelection;
            this.featureSelections = featureSelections;
        }

        // Public Methods
        public FeatureSelection GetFeatureSelectionByFeatureIdentifier(string featureID)
        {
            FeatureSelection featureSelection = featureSelections.FirstOrDefault(x => x.FeatureIdentifier == featureID);
            return featureSelection;
        }
        public AttributeValue GetAttributeValueByAttributeIdentifier(string attributeID)
        {
            // Find FeatureSelection which the appropriate AttributeValue
            FeatureSelection featureSelection = featureSelections.FirstOrDefault(f => f.AttributeValues.FirstOrDefault(x => x.AttributeIdentifier == attributeID) != null);
            AttributeValue attributeValue = featureSelection.AttributeValues.FirstOrDefault(x => x.AttributeIdentifier == attributeID);
            return attributeValue;
        }
        public List<FeatureSelection> GetDescendantFeatureSelections(FeatureSelection targetFeatureSelection)
        {
            var descendantFeatureSelections = GetDescendantFeatureSelections_Recursive(targetFeatureSelection);
            return descendantFeatureSelections;
        }
    }
}

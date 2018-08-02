using OpenConfigurator.Core.BLOs;
using OpenConfigurator.Core.Modelling.BLOs;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OpenConfigurator.Core.Configuration.BLOs
{
    internal class ConfigurationInstanceBLOFactory
    {
        // Private methods
        private AttributeValue CreateAttributeValue(Modelling.BLOs.Attribute attribute)
        {
            AttributeValue newAttrValue = new AttributeValue();
            newAttrValue.AttributeName = attribute.Name;
            newAttrValue.AttributeIdentifier = attribute.Identifier;
            newAttrValue.Value = attribute.DefaultValue;
            newAttrValue.DefaultValue = attribute.DefaultValue;
            newAttrValue.AttributeDataType = attribute.AttributeDataType;
            newAttrValue.AttributeType = attribute.AttributeType;

            return newAttrValue;
        }
        private FeatureSelection CreateFeatureSelection_Shallow(Feature feature)
        {
            // Set properties
            FeatureSelection newFeatureSelection = new FeatureSelection()
            {
                FeatureName = feature.Name,
                FeatureIdentifier = feature.Identifier,
                SelectionState = FeatureSelectionStates.Unselected
            };

            // Create attributes
            foreach (Modelling.BLOs.Attribute attr in feature.Attributes)
            {
                newFeatureSelection.AttributeValues.Add(CreateAttributeValue(attr));
            }

            return newFeatureSelection;
        }
        private FeatureSelection CreateFeatureSelection_Recursive(Feature feature, Model model, ref List<FeatureSelection> featureSelectionsList)
        {
            // 1. Create FeatureSelection with base properties and AttributeValues
            FeatureSelection newFeatureSelection = CreateFeatureSelection_Shallow(feature);


            // 2. Create child FeatureSelections
            var childFeatures = model.Features.Where(ft =>
                model.Relations.Exists(rel => rel.ChildFeature == ft && rel.ParentFeature == feature)
            ).ToList();
            foreach (Feature childFeature in childFeatures)
            {
                newFeatureSelection.ChildFeatureSelections.Add(CreateFeatureSelection_Recursive(childFeature, model, ref featureSelectionsList));
            }


            // 3. Create child Groups and their FeatureSelections
            var childGroupRelations = model.GroupRelations.Where(groupRel => groupRel.ParentFeature == feature).ToList();
            foreach (GroupRelation groupRelation in childGroupRelations)
            {
                Group newGroup = new Group();
                newGroup.GroupRelationType = groupRelation.GroupRelationType;
                var childGroupFeatures = model.Features.Where(ft =>
                    model.GroupRelations.Exists(groupRel => groupRel.ParentFeature == feature && groupRel.ChildFeatures.Contains(ft))
                ).ToList();
                foreach (Feature childGroupFeature in childGroupFeatures)
                {
                    newGroup.InnerFeatureSelections.Add(CreateFeatureSelection_Recursive(childGroupFeature, model, ref featureSelectionsList));
                }
                newFeatureSelection.ChildGroups.Add(newGroup);
            }


            featureSelectionsList.Add(newFeatureSelection);
            return newFeatureSelection;
        }

        // Public methods
        public ConfigurationInstance Create_ConfigurationInstance_FromModel(Model model)
        {
            // Get the root feature 
            Feature rootFeature = model.Features.Where(f =>
                !model.Relations.Exists(r => r.ChildFeature == f) &&
                !model.GroupRelations.Exists(gr => gr.ChildFeatures.Contains(f))
            ).SingleOrDefault();

            // Create FeatureSelections 
            List<FeatureSelection> featureSelectionsList = new List<FeatureSelection>();
            FeatureSelection rootFeatureSelection = CreateFeatureSelection_Recursive(rootFeature, model, ref featureSelectionsList);


            // Create a new ConfigurationInstance
            ConfigurationInstance newConfigInstance = new ConfigurationInstance(rootFeatureSelection, featureSelectionsList);
            newConfigInstance.ModelName = model.Name;
            return newConfigInstance;
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Antlr4.Runtime.Misc;
using OpenConfigurator.Core.Configuration.BLOs;

namespace OpenConfigurator.Core.Configuration.BLOManagers.Parser
{
    public class Visitor : GrammarBaseVisitor<object>
    {
        // Fields
        private ConfigurationInstance configInstance;

        // Constructor 
        public Visitor(ConfigurationInstance configInstance) : base()
        {
            this.configInstance = configInstance;
        }

        #region Visitor methods
        // Program
        public override object VisitProg([NotNull] GrammarParser.ProgContext context)
        {
            // 1. Visit and resolve left side (must return an AttributeValue) 
            AttrValAndFeatureSelPair leftSideResult = (AttrValAndFeatureSelPair)Visit(context.lefthandexpr());
            AttributeValue leftSideAttributeValueBLO = leftSideResult.AttributeValue;


            // 2. Visit and resolve right side (value - single or multiple)
            object rightSideValue = Visit(context.righthandexpr());


            // 3. Validate and assign resulting value in right side to AttributeValue on the left side 
            bool isDifferent = (leftSideAttributeValueBLO.Value != rightSideValue.ToString());
            if (rightSideValue.GetType() == typeof(int) && leftSideAttributeValueBLO.AttributeDataType == Core.BLOs.AttributeDataTypes.Integer)
            {
                leftSideAttributeValueBLO.Value = rightSideValue.ToString();
            }
            else if (rightSideValue.GetType() == typeof(bool))
            {
                leftSideAttributeValueBLO.Value = rightSideValue.ToString();
            }
            else
            {
                throw new Exception("Right side must evaluate to an int or bool");
            }


            // 4. Return the AttributeValue and it's parent FeatureSelection if any changes were done to it
            object returnValue = (isDifferent) ? leftSideResult.ParentFeatureSelection : null;
            return returnValue;
        }

        // Left hand
        public override object VisitComposite_selector_simple([NotNull] GrammarParser.Composite_selector_simpleContext context)
        {
            // 1. Visit the children (Feature_selector_abs and Attribute_selector)
            FeatureSelection matchingFeatureSelection = (FeatureSelection)Visit(context.feature_selector_abs());
            string attributeIdentifier = (string)Visit(context.attribute_selector());


            // 2. Get the matching AttributeValue
            AttributeValue matchingAttributeValue = matchingFeatureSelection.AttributeValues.Find(attrval => attrval.AttributeIdentifier == attributeIdentifier);


            // 3. Return the AttributeValue together with its parent FeatureSelection
            return new AttrValAndFeatureSelPair()
            {
                ParentFeatureSelection = matchingFeatureSelection,
                AttributeValue = matchingAttributeValue
            };
        }

        // Common
        public override object VisitFeature_selector_abs([NotNull] GrammarParser.Feature_selector_absContext context)
        {
            // Variables
            string featureIdentifier = context.IDENTIFIER() != null ? context.IDENTIFIER().ToString() : null;
            bool isRootFeatureSelector = context.ROOTFEATURE() != null ? true : false;
            FeatureSelection matchingFeatureSelection = null;

            // Find the matching FeatureSelection in the ConfigurationInstance
            if (featureIdentifier != null)
            {
                matchingFeatureSelection = configInstance.GetFeatureSelectionByFeatureIdentifier(featureIdentifier);
            }
            else if (isRootFeatureSelector)
            {
                matchingFeatureSelection = configInstance.RootFeatureSelection;
            }

            //
            return matchingFeatureSelection;
        }
        public override object VisitAttribute_selector([NotNull] GrammarParser.Attribute_selectorContext context)
        {

            string identifier = context.IDENTIFIER() != null ? context.IDENTIFIER().ToString() : null;
            return identifier;
        }

        // Right hand
        public override object VisitSumof_function([NotNull] GrammarParser.Sumof_functionContext context)
        {
            List<AttributeValue> attributeValues = (List<AttributeValue>)Visit(context.composite_selector_advanced());

            int sumResult = 0;
            attributeValues.ForEach(attrValue =>
            {
                int val;
                bool isInt = int.TryParse(attrValue.Value, out val);
                if(isInt)
                {
                    sumResult += val;
                }
            });


            return sumResult;
        }
        public override object VisitComposite_selector_advanced([NotNull] GrammarParser.Composite_selector_advancedContext context)
        {
            // 1. Visit the children (Feature_selector_abs, Feature_selector_rel and Attribute_selector)
            FeatureSelection absFeatureSelection = (FeatureSelection)Visit(context.feature_selector_abs());


            // 2. Get the matching relative FeatureSelections
            var relativeSelectorType = (int)Visit(context.feature_selector_rel());
            List<FeatureSelection> relativeMatchingFeatureSelections = null;
            if (relativeSelectorType == GrammarParser.DESCENDANTS_KEYWORD)
            {
                relativeMatchingFeatureSelections = configInstance
                    .GetDescendantFeatureSelections(absFeatureSelection)
                    .Where(featureSel => featureSel.SelectionState == Core.BLOs.FeatureSelectionStates.Selected)
                    .ToList();
            }
            else
            {
                throw new Exception("Only >descendants supported by the relative feature selector");
            }


            // 3. Get the matching AttributeValues for all of the relative FeatureSelections
            string attributeIdentifier = (string)Visit(context.attribute_selector());
            List<AttributeValue> matchingAttributeValues = new List<AttributeValue>();
            relativeMatchingFeatureSelections.ForEach(featureSelection =>
            {
                AttributeValue attrVal = featureSelection.AttributeValues.FirstOrDefault(attributeVal => attributeVal.AttributeIdentifier == attributeIdentifier);
                if (attrVal != null)
                {
                    matchingAttributeValues.Add(attrVal);
                }
            });


            return matchingAttributeValues;
        }
        public override object VisitFeature_selector_rel([NotNull] GrammarParser.Feature_selector_relContext context)
        {
            return context.op.Type;
        }
        #endregion


        //public override object VisitInt(GrammarParser.IntContext context)
        //{
        //    return int.Parse(context.INT().GetText());
        //}
        //public override object VisitAddSub(GrammarParser.AddSubContext context)
        //{
        //    int left = (int)Visit(context.expr(0));
        //    int right = (int)Visit(context.expr(1));
        //    if (context.op.Type == GrammarParser.ADD)
        //    {
        //        return left + right;
        //    }
        //    else 
        //    {
        //        return left - right;
        //    }
        //}
    }

    public class AttrValAndFeatureSelPair
    {
        public AttributeValue AttributeValue { get; set; }
        public FeatureSelection ParentFeatureSelection { get; set; }
    }
}

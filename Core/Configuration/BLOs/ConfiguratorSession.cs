using OpenConfigurator.Core.BLOs;
using OpenConfigurator.Core.Configuration.BLOManagers.Parser;
using OpenConfigurator.Core.Configuration.BLOManagers.Solver;
using OpenConfigurator.Core.Modelling.BLOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Configuration.BLOs
{
    public class ConfiguratorSession
    {
        // Properties
        public ConfigurationInstance configurationInstance { get; private set; }
        public SolverContext solverContext { get; private set; }
        private List<CustomRule> customRules { get; set; }
        private ParserEngine parserEngine;

        // Private  methods
        private static FeatureSelectionStates GetNextSelectionStateOnToggle(FeatureSelectionStates currentSelectionState)
        {
            FeatureSelectionStates nextSelectionState = FeatureSelectionStates.Unselected;
            switch (currentSelectionState)
            {
                case FeatureSelectionStates.Unselected:
                    nextSelectionState = FeatureSelectionStates.Selected;
                    break;
                case FeatureSelectionStates.Selected:
                    nextSelectionState = FeatureSelectionStates.Deselected;
                    break;
                case FeatureSelectionStates.Deselected:
                    nextSelectionState = FeatureSelectionStates.Unselected;
                    break;
            }
            return nextSelectionState;
        }
        private bool ApplyFeedbackAlgorithm(ref List<FeatureSelection> changedFeatureSelections)
        {
            // Variables
            bool validity = true;

            // Loop through all FeatureSelections
            foreach (FeatureSelection fSelection in configurationInstance.FeatureSelections)
            {
                // Determine the state of each Feature - so as to keep the validity of the configuration 
                if (fSelection.ToggledByUser != true)
                {

                    bool CanBeTrue = solverContext.VerifyTemporaryAssumption(fSelection.FeatureIdentifier, true, typeof(FeatureSelection));
                    bool CanBeFalse = solverContext.VerifyTemporaryAssumption(fSelection.FeatureIdentifier, false, typeof(FeatureSelection));

                    // Feature cannot be false nor true - configuration INVALID  
                    if (!CanBeFalse && !CanBeTrue)
                    {
                        validity = false;
                    }
                    // Feature has to be false - disable and DESELECT
                    else if (!CanBeTrue)
                    {
                        fSelection.SelectionState = FeatureSelectionStates.Deselected;
                        fSelection.Disabled = true;
                    }
                    // Feature has to be true - disable and SELECT
                    else if (!CanBeFalse)
                    {
                        fSelection.SelectionState = FeatureSelectionStates.Selected;
                        fSelection.Disabled = true;
                    }
                    // Feature can be anything - enable and UNSELECT
                    else if (CanBeFalse && CanBeTrue)
                    {
                        fSelection.SelectionState = FeatureSelectionStates.Unselected;
                        fSelection.Disabled = false;
                    }


                }
                changedFeatureSelections.Add(fSelection);
            }

            //
            return validity;
        }
        private void RecalculateCustomFunctions(ref List<FeatureSelection> changedFeatureSelections)
        {
            //
            foreach (CustomRule customRule in customRules)
            {
                var returnVal = parserEngine.Execute(customRule);
                if(returnVal!= null &&  !changedFeatureSelections.Contains((FeatureSelection) returnVal)) {
                    changedFeatureSelections.Add((FeatureSelection)returnVal);
                }
            }
        }

        // Constructor
        internal ConfiguratorSession(ConfigurationInstance configurationInstance, List<CustomRule> customRules, SolverContext context)
        {
            this.configurationInstance = configurationInstance;
            this.customRules = customRules;
            this.solverContext = context;
            this.parserEngine = new ParserEngine(configurationInstance);
        }

        // Public methods
        public List<FeatureSelection> ToggleFeatureAsUser(string featureIdentifier)
        {
            // Variables
            FeatureSelection toggledFeatureSelection = this.configurationInstance.FeatureSelections.Single(f => f.FeatureIdentifier == featureIdentifier);
            FeatureSelectionStates newSelectionState = GetNextSelectionStateOnToggle(toggledFeatureSelection.SelectionState);


            // Set the new selectionState, adding it as a decision to the SolverContext
            switch (newSelectionState)
            {
                // Assert-decision  -> Selected
                case FeatureSelectionStates.Selected:
                    solverContext.AddOrModifyDecisionAssumption(toggledFeatureSelection.FeatureIdentifier, true, typeof(FeatureSelection));
                    toggledFeatureSelection.SelectionState = FeatureSelectionStates.Selected;
                    toggledFeatureSelection.ToggledByUser = true;
                    break;

                // Assert-decision  -> Deselected
                case FeatureSelectionStates.Deselected:
                    solverContext.AddOrModifyDecisionAssumption(toggledFeatureSelection.FeatureIdentifier, false, typeof(FeatureSelection));
                    toggledFeatureSelection.SelectionState = FeatureSelectionStates.Deselected;
                    toggledFeatureSelection.ToggledByUser = true;
                    break;

                // Retract-decision  -> Unselected
                case FeatureSelectionStates.Unselected:
                    solverContext.RemoveDecisionAssumption(toggledFeatureSelection.FeatureIdentifier, typeof(FeatureSelection));
                    toggledFeatureSelection.SelectionState = FeatureSelectionStates.Unselected;
                    toggledFeatureSelection.ToggledByUser = false;
                    break;
            }

            // Call feedback algorithm and then recalculate all custom functions
            List<FeatureSelection> changedFeatureSelections = new List<FeatureSelection>();
            bool decisionIsValid = ApplyFeedbackAlgorithm(ref changedFeatureSelections);
            RecalculateCustomFunctions(ref changedFeatureSelections);

            //
            return changedFeatureSelections;
        }
    }
}


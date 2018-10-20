using Microsoft.Z3;
using OpenConfigurator.Core.BLOs;
using OpenConfigurator.Core.Configuration.BLOs;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OpenConfigurator.Core.Configuration.BLOManagers.Solver
{
    public class SolverContext
    {
        // Fields
        private Context _context;
        private Microsoft.Z3.Solver _solver;
        private Dictionary<string, Constant> _constants = new Dictionary<string, Constant>();
        private List<Constraint> _constraints = new List<Constraint>();
        private Dictionary<string, Function> _functions = new Dictionary<string, Function>();
        private Dictionary<string, Assumption> _decisionAssumptions = new Dictionary<string, Assumption>();

        // Properties
        public string SMTText
        {
            get
            {
                return this._solver.ToString();
            }
        }

        // Private helper methods
        private static bool? ConvertToBool(Expr value)
        {
            //Return val
            bool? returnValue = null;

            //Get the variable and cast its value to boolean?
            switch (value.ToString())
            {
                case "true":
                    returnValue = true;
                    break;
                case "false":
                    returnValue = false;
                    break;
            }

            return returnValue;
        }
        private static string GenerateFeatureSID(string featureIdentifier)
        {
            return "Features_" + featureIdentifier;
        }
        private static string GenerateAttributeSID(string attributeIdentifier, string parentFeatureIdentifier)
        {
            string fullParentFeatureIdentifier = GenerateFeatureSID(parentFeatureIdentifier);
            return fullParentFeatureIdentifier + "_" + attributeIdentifier;
        }
        private BoolExpr MakeNegatedAndCombinations(List<BoolExpr> exprs)
        {
            // Variables
            List<BoolExpr> negatedAnds = new List<BoolExpr>();
            BoolExpr finalExpr = null;

            //
            for (int i = 0; i < exprs.Count; i++)
            {
                for (int j = i + 1; j < exprs.Count; j++)
                {
                    negatedAnds.Add(_context.MkNot(_context.MkAnd(exprs[i], exprs[j])));
                }
            }
            if (negatedAnds.Count > 1)
                finalExpr = _context.MkAnd(negatedAnds.ToArray());
            else
                finalExpr = negatedAnds[0];

            //
            return finalExpr;
        }
        public Expr MakeBoolToInt(Expr expr)
        {
            // Get the BoolToInt function
            FuncDecl boolToIntfunction = _functions["BoolToInt"].FuncDecl;

            // Create the functionCall
            Expr funcCall = _context.MkApp(boolToIntfunction, expr);

            //
            return funcCall;
        }
        public BoolExpr MakeEquivalence(BoolExpr leftExpr, BoolExpr rightExpr)
        {
            BoolExpr leftImpliesRight = _context.MkImplies(leftExpr, rightExpr);
            BoolExpr rightImpliesLeft = _context.MkImplies(rightExpr, leftExpr);
            BoolExpr finalExpr = _context.MkAnd(leftImpliesRight, rightImpliesLeft);

            return finalExpr;
        }


        // Private methods
        private void AddFeature_Constant(string featureIdentifier)
        {
            // Variables
            string featureSID = GenerateFeatureSID(featureIdentifier);
            if (_constants.ContainsKey(featureSID))
                throw new Exception("A constant already exists for the given Feature");

            // Create the constant in the Z3 context
            Expr expr = _context.MkBoolConst(featureSID);

            // Keep track of the constant added
            Constant newFeatureConstant = new Constant(featureSID, ConstantDataTypes.Boolean, expr);
            _constants.Add(featureSID, newFeatureConstant);
        }
        private void AddAttribute_Constant(string attributeIdentifier, string parentFeatureIdentifier, AttributeDataTypes attributeDataType)
        {
            //// Variables
            //string attributeSID = GenerateAttributeSID(attributeIdentifier, parentFeatureIdentifier);
            //if (_constants.ContainsKey(attributeSID))
            //    throw new Exception("A constant already exists for the given Attribute");

            //// Create the constant in the Z3 context
            //Sort exprType = null;
            //ConstantDataTypes dataType;
            //switch (attributeDataType)
            //{
            //    case AttributeDataTypes.Boolean:
            //        exprType = _context.MkBoolSort();
            //        dataType = ConstantDataTypes.Boolean;
            //        break;
            //    case AttributeDataTypes.Integer:
            //        exprType = _context.MkIntSort();
            //        dataType = ConstantDataTypes.Integer;
            //        break;
            //    default:
            //        dataType = ConstantDataTypes.Integer;
            //        break;
            //}
            //Expr expr = _context.MkConst(attributeSID, exprType);

            //// Keep track of the constant added
            //Constant newAttributeConstant = new Constant(attributeSID, dataType, expr);
            //_constants.Add(attributeSID, newAttributeConstant);
        }
        private void AddRelation_Constraint(RelationTypes relationType, string parentFeatureIdentifier, string childFeatureIdentifier)
        {
            // Variables
            string parentFeatureSID = GenerateFeatureSID(parentFeatureIdentifier);
            string childFeatureSID = GenerateFeatureSID(childFeatureIdentifier);
            Constant parentFeatureConstant = _constants[parentFeatureSID];
            Constant childFeatureConstant = _constants[childFeatureSID];

            // Create the constraint in the Z3 context
            BoolExpr expr = null;
            switch (relationType)
            {
                case RelationTypes.Mandatory:
                    {
                        expr = MakeEquivalence(parentFeatureConstant.Expr as BoolExpr, childFeatureConstant.Expr as BoolExpr);
                        break;
                    }
                case RelationTypes.Optional:
                    {
                        expr = _context.MkImplies((BoolExpr)childFeatureConstant.Expr, (BoolExpr)parentFeatureConstant.Expr);
                        break;
                    }
            }

            // Assert the constraint in the Z3 solver
            _solver.Assert(expr);

            // Keep track of the constraint
            _constraints.Add(new Constraint(expr));

        }
        private void AddGroupRelation_Constraint(GroupRelationTypes groupRelationType, string parentFeatureIdentifier, string[] childFeatureIdentifiers
            , int groupRelationUpperBound, int groupRelationLowerBound)
        {
            // Variables
            string parentFeatureSID = GenerateFeatureSID(parentFeatureIdentifier);
            string[] childFeaturesSID = childFeatureIdentifiers.Select(childFeatureIdentifier => GenerateFeatureSID(childFeatureIdentifier)).ToArray();
            Constant parentFeatureConstant = _constants[parentFeatureSID];
            Constant[] childFeatureConstants = childFeaturesSID.Select(childFeatureID => _constants[childFeatureID]).ToArray();

            // Create the constraint in the Z3 context
            BoolExpr expr = null;
            switch (groupRelationType)
            {
                case GroupRelationTypes.OR:
                    {
                        BoolExpr innerMultipleOrBetweenChildren = _context.MkOr(childFeatureConstants.Select(childFeatureConstant => childFeatureConstant.Expr as BoolExpr).ToArray());
                        expr = MakeEquivalence(parentFeatureConstant.Expr as BoolExpr, innerMultipleOrBetweenChildren);
                        break;
                    }
                case GroupRelationTypes.XOR:
                    {
                        BoolExpr innerMultipleOrBetweenChildren = _context.MkOr(childFeatureConstants.Select(childFeatureConstant => childFeatureConstant.Expr as BoolExpr).ToArray());
                        BoolExpr parentEqToChildrenOrs = MakeEquivalence(parentFeatureConstant.Expr as BoolExpr, innerMultipleOrBetweenChildren);
                        BoolExpr negatedAndsBetweenChildren = MakeNegatedAndCombinations(childFeatureConstants.Select(childFeatureConstant => childFeatureConstant.Expr as BoolExpr).ToList());
                        expr = _context.MkAnd(parentEqToChildrenOrs, negatedAndsBetweenChildren);
                        break;
                    }
                case GroupRelationTypes.Cardinal:
                    {
                        List<ArithExpr> intConversions = new List<ArithExpr>();
                        childFeatureConstants.ToList().ForEach(childFeatureConstant => intConversions.Add(MakeBoolToInt(childFeatureConstant.Expr) as ArithExpr));
                        BoolExpr sumLesserThanOrEqToUBound = _context.MkLe(_context.MkAdd(intConversions.ToArray()), _context.MkInt(groupRelationUpperBound));
                        BoolExpr sumGreaterThanOrEqToLBound = _context.MkGe(_context.MkAdd(intConversions.ToArray()), _context.MkInt(groupRelationLowerBound));
                        BoolExpr sumValueConstraint = _context.MkAnd(sumLesserThanOrEqToUBound, sumGreaterThanOrEqToLBound);

                        BoolExpr IfAnyChildrenAreSelected = _context.MkGt(_context.MkAdd(intConversions.ToArray()), _context.MkInt(0));

                        expr = _context.MkAnd(_context.MkImplies(IfAnyChildrenAreSelected, parentFeatureConstant.Expr as BoolExpr),
                            _context.MkImplies(IfAnyChildrenAreSelected, sumValueConstraint),
                            _context.MkImplies(parentFeatureConstant.Expr as BoolExpr, sumValueConstraint));
                        break;
                    }
            }





            // Assert the constraint in the Z3 solver
            _solver.Assert(expr);

            // Keep track of the constraint
            _constraints.Add(new Constraint(expr));

        }
        private void AddCompositionRule_Constraint(CompositionRuleTypes compRuleType, string firstFeatureIdentifier, string secondFeatureIdentifier)
        {
            // Variables
            string firstFeatureSID = GenerateFeatureSID(firstFeatureIdentifier);
            string secondFeatureSID = GenerateFeatureSID(secondFeatureIdentifier);
            Constant firstFeatureConstant = _constants[firstFeatureSID];
            Constant secondFeatureConstant = _constants[secondFeatureSID];

            // Create the constraint in the Z3 context
            BoolExpr expr = null;
            switch (compRuleType)
            {
                case CompositionRuleTypes.Dependency:
                    {
                        expr = _context.MkImplies(firstFeatureConstant.Expr as BoolExpr, secondFeatureConstant.Expr as BoolExpr);
                        break;
                    }
                case CompositionRuleTypes.MutualDependency:
                    {
                        expr = MakeEquivalence(firstFeatureConstant.Expr as BoolExpr, secondFeatureConstant.Expr as BoolExpr);
                        break;
                    }
                case CompositionRuleTypes.MutualExclusion
                :
                    {
                        expr = _context.MkNot(_context.MkAnd(firstFeatureConstant.Expr as BoolExpr, secondFeatureConstant.Expr as BoolExpr));
                        break;
                    }
            }

            // Assert the constraint in the Z3 solver
            _solver.Assert(expr);

            // Keep track of the constraint
            _constraints.Add(new Constraint(expr));

        }
        private Expr CreateValueExpr(ConstantDataTypes dataType, object value)
        {
            // Create a term for the new value in Z3
            Expr newValue = null;
            switch (dataType)
            {
                // Bool
                case ConstantDataTypes.Boolean:
                    bool boolValue = (bool)value;
                    switch (boolValue)
                    {
                        case true:
                            newValue = _context.MkTrue();
                            break;
                        case false:
                            newValue = _context.MkFalse();
                            break;
                    }
                    break;

                // Int
                case ConstantDataTypes.Integer:
                    int intValue = (int)value;
                    newValue = _context.MkInt(intValue);
                    break;
            }

            return newValue;
        }
        private void ReAssertDecisionAssumptions()
        {
            _solver.Pop();
            _solver.Push();


            foreach (Assumption assumption in _decisionAssumptions.Values)
            {
                AssertValueAssumption(assumption);
            }
        }
        private void AssertValueAssumption(Assumption assumption)
        {
            _solver.Assert((BoolExpr)assumption.Expr);
        }
        private bool IsValid()
        {
            Microsoft.Z3.Status status = _solver.Check();
            return (status == Status.SATISFIABLE);
        }

        // Constructor
        public SolverContext(Modelling.BLOs.Model model)
        {
            // Create an empty z3 context
            Dictionary<string, string> configSettings = new Dictionary<string, string>();
            configSettings["MODEL"] = "true";
            configSettings["MACRO_FINDER"] = "true";
            _context = new Context(configSettings);
            _context.PrintMode = Z3_ast_print_mode.Z3_PRINT_SMTLIB2_COMPLIANT;


            // Setup the z3 context and solver
            _solver = _context.MkSolver();

            // Setup custom conversion method BoolToInt (boolean -> integer)
            FuncDecl boolToInt = _context.MkFuncDecl("BoolToInt", _context.MkBoolSort(), _context.MkIntSort());
            Expr i = _context.MkConst("i", _context.MkBoolSort());
            Expr fDef = _context.MkITE(_context.MkEq(i, _context.MkTrue()), _context.MkInt(1), _context.MkInt(0)); // x == true => 1, x == false => 0
            Expr fStatement = _context.MkForall(new Expr[] { i }, _context.MkEq(_context.MkApp(boolToInt, i), fDef));
            _solver.Assert(fStatement as BoolExpr);
            _functions.Add("BoolToInt", new Function(boolToInt));

            // Create the static part (constants and constraints) 
            model.Features.ForEach(feature =>
            {
                string featureSID = GenerateFeatureSID(feature.Identifier);
                AddFeature_Constant(feature.Identifier);
                feature.Attributes.ForEach(attribute => AddAttribute_Constant(attribute.Identifier, feature.Identifier, attribute.AttributeDataType));
            });
            model.Relations.ForEach(relation =>
            {
                AddRelation_Constraint(relation.RelationType, relation.ParentFeature.Identifier, relation.ChildFeature.Identifier);
            });
            model.GroupRelations.ForEach(groupRelation =>
            {
                string[] childFeatureIDs = groupRelation.ChildFeatures.Select(feature => feature.Identifier).ToArray();
                AddGroupRelation_Constraint(groupRelation.GroupRelationType, groupRelation.ParentFeature.Identifier, childFeatureIDs,
                    groupRelation.UpperBound ?? default(int), groupRelation.LowerBound ?? default(int));
            });
            model.CompositionRules.ForEach(compRule =>
            {
                AddCompositionRule_Constraint(compRule.CompositionRuleType, compRule.FirstFeature.Identifier, compRule.SecondFeature.Identifier);
            });

            // Create initial point
            _solver.Push();
        }

        // Public methods
        public bool VerifyTemporaryAssumption(string constantIdentifier, bool valueToTest, Type constantType)
        {
            // Determine constantSID
            string constantSID = "";
            if (constantType == typeof(FeatureSelection))
            {
                constantSID = GenerateFeatureSID(constantIdentifier);
            }
            else if (constantType == typeof(AttributeValue))
            {
                throw new Exception("Assumptions for AttributeValues are not yet supported!");
            }
            if (_decisionAssumptions.ContainsKey(constantSID))
                throw new Exception("Assumption for constant with ID = '" + constantSID + "' already exists!");


            // Add a new assumption to the z3 context WITHOUT adding it to the list of assumptions
            BoolExpr equals = _context.MkEq(_constants[constantSID].Expr, CreateValueExpr(ConstantDataTypes.Boolean, valueToTest));
            Assumption newValueAssumption = new Assumption(equals, constantSID, valueToTest);


            // Assert it immediately in the solver
            AssertValueAssumption(newValueAssumption);
            bool contextIsValid = IsValid();


            // Clean up and return whether the assumption was valid 
            ReAssertDecisionAssumptions();
            return contextIsValid;
        }
        public void AddOrModifyDecisionAssumption(string constantIdentifier, bool val, Type constantType)
        {
            // Determine constantSID
            string constantSID = "";
            if (constantType == typeof(FeatureSelection))
            {
                constantSID = GenerateFeatureSID(constantIdentifier);
            }
            else if (constantType == typeof(AttributeValue))
            {
                throw new Exception("Assumptions for AttributeValues are not yet supported!");
            }

            // Remove any existing assumptions on the same variable
            if (_decisionAssumptions.ContainsKey(constantSID))
                RemoveDecisionAssumption(constantIdentifier, constantType);

            // Add a new assumption to the list
            BoolExpr equals = _context.MkEq(_constants[constantSID].Expr, CreateValueExpr(ConstantDataTypes.Boolean, (bool)val));
            Assumption newValueAssumption = new Assumption(equals, constantSID, val);
            _decisionAssumptions.Add(constantSID, newValueAssumption);

            // Assert it immediately in the solver
            AssertValueAssumption(newValueAssumption);
        }
        public void RemoveDecisionAssumption(string constantIdentifier, Type constantType)
        {
            // Determine constantSID
            string constantSID = "";
            if (constantType == typeof(FeatureSelection))
            {
                constantSID = GenerateFeatureSID(constantIdentifier);
            }
            else if (constantType == typeof(AttributeValue))
            {
                throw new Exception("Assumptions for AttributeValues are not yet supported!");
            }

            //
            if (_decisionAssumptions.ContainsKey(constantSID))
                _decisionAssumptions.Remove(constantSID);

            // 
            ReAssertDecisionAssumptions();
        }
    }
}

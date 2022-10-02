using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Domain.Modeling.Enums;

// BLO related Enums
public enum RelationTypes
{
    Mandatory = 0,
    Optional = 1,
    Cloneable = 2
};
public enum GroupRelationTypes
{
    OR = 0,
    XOR = 1,
    Cardinal = 2
};
public enum CompositionRuleTypes
{
    Dependency = 0,
    MutualDependency = 1,
    MutualExclusion = 2
};
public enum AttributeTypes
{
    Constant = 0,
    Dynamic = 1,
    UserInput = 2
}
public enum AttributeDataTypes
{
    Integer = 0,
    Boolean = 1,
    String = 2
}
public enum UIOrientationTypes
{
    Vertical = 0,
    Horizontal = 1
}
public enum FeatureSelectionStates
{
    Unselected = 0,
    Selected = 1,
    Deselected = 2
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace OpenConfigurator.Core.BLOs
{
    // Domain area enums
    public enum DomainAreas
    {
        Modelling = 0,
        Configuration = 1
    }

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

    // Extra information for enums (- was previously stored in the SQL db)
    public static class RelationTypes_Info
    {
        public static class Mandatory
        {
            public static readonly int? FixedLowerBound = 1;
            public static readonly int? FixedUpperBound = 1;
        }
        public static class Optional
        {
            public static readonly int? FixedLowerBound = 0;
            public static readonly int? FixedUpperBound = 1;
        }
        public static class Cloneable
        {
            public static readonly int? FixedLowerBound = null;
            public static readonly int? FixedUpperBound = null;
        }
    }
    public static class GroupRelationTypes_Info
    {
        public static class OR
        {
            public static readonly int? FixedLowerBound = 1;
            public static readonly int? FixedUpperBound = -1; // not editable & set to nr of child features
        }
        public static class XOR
        {
            public static readonly int? FixedLowerBound = 1;
            public static readonly int? FixedUpperBound = 1;
        }
        public static class CustomOR
        {
            public static readonly int? FixedLowerBound = null;
            public static readonly int? FixedUpperBound = null; // editable and set to nr of child features
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Domain.Modeling.Enums;
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
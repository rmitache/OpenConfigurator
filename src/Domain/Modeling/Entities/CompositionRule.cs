using OpenConfigurator.Domain.Modeling.Enums;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OpenConfigurator.Domain.Modeling.Entities;

public class CompositionRule : BaseEntity
{
    // Properties
    public string Type
    {
        get
        {
            return "CompositionRule";
        }
    }
    public string Identifier
    {
        get;
        set;
    }
    public CompositionRuleTypes CompositionRuleType
    {
        get;
        set;
    }
    public virtual Feature FirstFeature
    {
        get;
        set;
    }
    public virtual Feature SecondFeature
    {
        get;
        set;
    }
    public virtual string Name
    {
        get;
        set;
    }
    public virtual string Description
    {
        get;
        set;
    }

    // Constructors
    public CompositionRule()
    {
    }

    // Static instance creator
    internal static CompositionRule CreateDefault()
    {
        // Create new BLO
        CompositionRule newBLO = new CompositionRule()
        {
            CompositionRuleType = CompositionRuleTypes.Dependency
        };
        return newBLO;
    }

}

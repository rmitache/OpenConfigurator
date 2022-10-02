using AutoMapper;
using OpenConfigurator.Core.Infrastructure.DataEntities;
using OpenConfigurator.Domain.Modeling.Entities;
using System.Collections.Generic;
using System.Linq;
using Attribute = OpenConfigurator.Domain.Modeling.Entities.Attribute;

namespace OpenConfigurator.Infrastructure;

public class MappingConfiguration : Profile
{

    public MappingConfiguration()
    {
        // Model 
        CreateMap<Model, ModelDE>().ReverseMap();
        CreateMap<Feature, FeatureDE>().ReverseMap();
        CreateMap<Attribute, AttributeDE>().ReverseMap();
        CreateMap<Relation, RelationDE>().ReverseMap();
        CreateMap<GroupRelation, GroupRelationDE>().ReverseMap();
        CreateMap<CustomRule, CustomRuleDE>().ReverseMap();

    }
}

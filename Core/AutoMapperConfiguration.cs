using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using OpenConfigurator.Core.Modelling.BLOs;
using OpenConfigurator.Core.Configuration.BLOs;

namespace OpenConfigurator.Core
{
    public static class AutoMapperConfiguration
    {
        public static void Configure()
        {
            // Model --------------------------------------------------------------------------------------------------------------------------------------------------
            // Standard mappings (both ways)
            Mapper.CreateMap<Model, XmlDAL.ModelFile.DataEntities.Model>().ReverseMap();
            Mapper.CreateMap<Feature, XmlDAL.ModelFile.DataEntities.Feature>().ReverseMap();
            Mapper.CreateMap<Modelling.BLOs.Attribute, XmlDAL.ModelFile.DataEntities.Attribute>().ReverseMap();
            Mapper.CreateMap<CustomRule, XmlDAL.ModelFile.DataEntities.CustomRule>().ReverseMap();

            // Mappings with Identifier references (BLO to DataEntity)
            Mapper.CreateMap<Relation, XmlDAL.ModelFile.DataEntities.Relation>();
            Mapper.CreateMap<GroupRelation, XmlDAL.ModelFile.DataEntities.GroupRelation>()
                .ForMember(dest => dest.ChildFeatureIdentifiers, opt => opt.MapFrom(so => so.ChildFeatures.Select(f => f.Identifier).ToList()));
            Mapper.CreateMap<CompositionRule, XmlDAL.ModelFile.DataEntities.CompositionRule>();

            // Mappings with Identifier references (DataEntity to BLO)
            Mapper.CreateMap<XmlDAL.ModelFile.DataEntities.Relation, Relation>()
                .ForMember(dest => dest.ParentFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.ParentFeatureIdentifier))
                .ForMember(dest => dest.ChildFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.ChildFeatureIdentifier));
            Mapper.CreateMap<XmlDAL.ModelFile.DataEntities.GroupRelation, GroupRelation>()
                .ForMember(dest => dest.ParentFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.ParentFeatureIdentifier))
                .ForMember(dest => dest.ChildFeatures, opt => opt.ResolveUsing<FeatureReferenceIDListConverter>().FromMember(src => src.ChildFeatureIdentifiers));
            Mapper.CreateMap<XmlDAL.ModelFile.DataEntities.CompositionRule, CompositionRule>()
                .ForMember(dest => dest.FirstFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.FirstFeatureIdentifier))
                .ForMember(dest => dest.SecondFeature, opt => opt.ResolveUsing<FeatureReferenceIDConverter>().FromMember(src => src.SecondFeatureIdentifier));
            // -------------------------------------------------------------------------------------------------------------------------------------------------------

            // Configuration -----------------------------------------------------------------------------------------------------------------------------------------
            // Standard mappings (BLO to DataEntity)
            Mapper.CreateMap<ConfigurationInstance, XmlDAL.ConfigurationInstanceFile.DataEntities.ConfigurationInstance>();
            Mapper.CreateMap<FeatureSelection, XmlDAL.ConfigurationInstanceFile.DataEntities.FeatureSelection>();
            Mapper.CreateMap<AttributeValue, XmlDAL.ConfigurationInstanceFile.DataEntities.AttributeValue>();
            // -------------------------------------------------------------------------------------------------------------------------------------------------------
        }

        ///<summary>
        /// Resolves a single FeatureIdentifier reference field by returning the BLO.Feature it refers to
        ///</summary>
        public class FeatureReferenceIDConverter : IValueResolver
        {
            public ResolutionResult Resolve(ResolutionResult source)
            {

                // Get the parent FeatureModel
                Model parentFeatureModel = (Model)source.Context.InstanceCache.Values.Where(v => v.GetType() == typeof(Model)).First();

                // Get the Feature corresponding to the given Identifier
                string featureIdentifier = (string)source.Value;
                Feature feature = parentFeatureModel.Features.Where(f => f.Identifier == featureIdentifier).First();
                return source.New(feature);
            }
        }
        ///<summary>
        /// Resolves a List of FeatureIdentifier reference fields by returning the BLO.Features it refers to
        ///</summary>
        public class FeatureReferenceIDListConverter : IValueResolver
        {
            public ResolutionResult Resolve(ResolutionResult source)
            {

                // Get the parent FeatureModel
                Model parentFeatureModel = (Model)source.Context.InstanceCache.Values.Where(v => v.GetType() == typeof(Model)).First();

                // Get the Features corresponding to the given Identifiers
                List<string> featureIdentifiers = (List<string>)source.Value;
                List<Feature> featuresList = new List<Feature>();
                for (int i = 0; i < featureIdentifiers.Count; i++)
                {
                    Feature feature = parentFeatureModel.Features.Where(f => f.Identifier == featureIdentifiers[i]).First();
                    featuresList.Add(feature);
                }
                return source.New(featuresList);
            }
        }


    }
}

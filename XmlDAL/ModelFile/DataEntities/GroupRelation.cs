using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using OpenConfigurator.Core.XmlDAL;

namespace OpenConfigurator.Core.XmlDAL.ModelFile.DataEntities
{
    [DataContract]
    internal class GroupRelation : iDataEntity
    {
        // Fields
        List<string> childFeatureIdentifiers = new List<string>();

        // Properties
        [DataMember(Order = 0)]
        public string Identifier
        {
            get;
            set;
        }
        [DataMember(Order = 1)]
        public int GroupRelationType
        {
            get;
            set;
        }
        [DataMember(Order = 2)]
        public string ParentFeatureIdentifier
        {
            get;
            set;
        }
        [DataMember(Order = 3)]
        public List<string> ChildFeatureIdentifiers
        {
            get
            {
                return childFeatureIdentifiers ?? (childFeatureIdentifiers = new List<string>());
            }
        }
        [DataMember(Order = 4)]
        public int? LowerBound
        {
            get;
            set;
        }
        [DataMember(Order = 5)]
        public int? UpperBound
        {
            get;
            set;
        }
    }
}

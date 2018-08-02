using OpenConfigurator.Core.XmlDAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.XmlDAL.ModelFile.DataEntities
{
    [DataContract]
    internal class Relation : iDataEntity
    {
        [DataMember(Order = 0)]
        public int RelationType
        {
            get;
            set;
        }
        [DataMember(Order = 1)]
        public string Identifier
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
        public string ChildFeatureIdentifier
        {
            get;
            set;
        }
        [DataMember(Order = 4)]
        public int? UpperBound
        {
            get;
            set;
        }
        [DataMember(Order = 5)]
        public int? LowerBound
        {
            get;
            set;
        }
    }
}

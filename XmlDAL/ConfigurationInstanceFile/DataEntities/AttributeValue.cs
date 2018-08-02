using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using OpenConfigurator.Core.XmlDAL;

namespace OpenConfigurator.Core.XmlDAL.ConfigurationInstanceFile.DataEntities
{
    [DataContract]
    public class AttributeValue : iDataEntity
    {
        // Properties
        [DataMember(Order = 0)]
        public string AttributeIdentifier
        {
            get;
            set;
        }
        [DataMember(Order = 1)]
        public string AttributeName
        {
            get;
            set;
        }
        [DataMember(Order = 2)]
        public string Value
        {
            get;
            set;
        }

    }
}

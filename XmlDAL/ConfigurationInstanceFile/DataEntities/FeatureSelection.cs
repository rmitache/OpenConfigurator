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
    public class FeatureSelection : iDataEntity
    {
        // Fields
        List<AttributeValue> attributeValues = new List<AttributeValue>();

        // Properties
        [DataMember(Order = 0)]
        public string FeatureIdentifier
        {
            get;
            set;
        }
        [DataMember(Order = 1)]
        public string FeatureName
        {
            get;
            set;
        }
        [DataMember(Order = 2)]
        public int SelectionState
        {
            get;
            set;
        }
        [DataMember(Order = 3)]
        public List<AttributeValue> AttributeValues
        {
            get
            {
                return attributeValues ?? (attributeValues = new List<AttributeValue>());
            }
        }

    }
}

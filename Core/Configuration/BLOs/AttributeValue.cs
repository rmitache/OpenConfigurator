using OpenConfigurator.Core.BLOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Configuration.BLOs
{
    public class AttributeValue : iBLO
    {
        // Constructors
        public AttributeValue()
        {
        }

        // Properties
        public string AttributeIdentifier
        {
            get;
            set;
        }
        public string AttributeName
        {
            get;
            set;
        }
        public string Value
        {
            get;
            set;
        }
        public string DefaultValue
        {
            get;
            set;
        }
        public AttributeTypes AttributeType
        {
            get;
            set;
        }
        public AttributeDataTypes AttributeDataType
        {
            get;
            set;
        }
    }

}

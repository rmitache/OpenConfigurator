using OpenConfigurator.Core.BLOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Modelling.BLOs
{
    public class Attribute : iBLO
    {
        // Properties
        public string Type
        {
            get
            {
                return "Attribute";
            }
        }
        public string Identifier
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
        public string DefaultValue
        {
            get;
            set;
        }
        public string Name
        {
            get;
            set;
        }
        public Feature ParentFeature
        {
            get;
            set;
        }

        // Constructors
        public Attribute()
        {
        }

        // Static instance creator
        internal static Attribute CreateDefault()
        {
            Attribute newBLO = new Attribute()
            {
                Name = "Default attribute"
            };
            newBLO.AttributeDataType = AttributeDataTypes.String;
            return newBLO;
        }
    }
}

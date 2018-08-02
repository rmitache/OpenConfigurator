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
    internal class Feature : iDataEntity
    {
        // Fields
        List<Attribute> attributes = new List<Attribute>();

        // Properties
        [DataMember(Order = 0)]
        public string Identifier
        {
            get;
            set;
        }
        [DataMember(Order = 1)]
        public string Name
        {
            get;
            set;
        }
        [DataMember(Order = 2)]
        public List<Attribute> Attributes
        {
            get
            {
                return attributes ?? (attributes = new List<Attribute>());
            }
        }
        [DataMember(Order = 3)]
        public Nullable<double> XPos
        {
            get;
            set;
        }
        [DataMember(Order = 4)]
        public Nullable<double> YPos
        {
            get;
            set;
        }
    }
}

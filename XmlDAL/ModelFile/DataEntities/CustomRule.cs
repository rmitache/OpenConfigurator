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
    internal class CustomRule : iDataEntity
    {
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
        public string Expression
        {
            get;
            set;
        }
        [DataMember(Order = 3)]
        public string Description
        {
            get;
            set;
        }
    }
}

﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using OpenConfigurator.Core.XmlDAL;

namespace OpenConfigurator.Core.XmlDAL.ModelFile.DataEntities
{
    [DataContract]
    internal class Attribute : iDataEntity
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
        public string Description
        {
            get;
            set;
        }
        [DataMember(Order = 3)]
        public int AttributeType
        {
            get;
            set;
        }
        [DataMember(Order = 4)]
        public int AttributeDataType
        {
            get;
            set;
        }
        [DataMember(Order = 5)]
        public string DefaultValue
        {
            get;
            set;
        }
    }
}

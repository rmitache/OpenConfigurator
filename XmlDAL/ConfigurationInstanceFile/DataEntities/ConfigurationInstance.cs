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
    public class ConfigurationInstance : iDataEntity
    {
        // Fields
        protected List<FeatureSelection> featureSelections = new List<FeatureSelection>();

        // Properties
        [DataMember(Order = 0)]
        public string ModelName
        {
            get;
            set;
        }
        [DataMember(Order = 1)]
        public List<FeatureSelection> FeatureSelections
        {
            get
            {
                return featureSelections ?? (featureSelections = new List<FeatureSelection>());
            }
        }


    }
}

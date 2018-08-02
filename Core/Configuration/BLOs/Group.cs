using OpenConfigurator.Core.BLOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Configuration.BLOs
{
    public class Group : iBLO
    {
        // Fields
        protected List<FeatureSelection> innerFeatureSelections = new List<FeatureSelection>();

        // Constructors
        public Group()
        {
        }

        // Properties
        public GroupRelationTypes GroupRelationType
        {
            get;
            set;
        }
        public List<FeatureSelection> InnerFeatureSelections
        {
            get
            {
                return innerFeatureSelections;
            }

        }

    }
}

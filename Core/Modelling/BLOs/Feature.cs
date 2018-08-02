using OpenConfigurator.Core.BLOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Modelling.BLOs
{
    public class Feature : iBLO
    {
        // Fields
        protected List<Attribute> attributes = new List<Attribute>();

        // Properties
        public string Type
        {
            get
            {
                return "Feature";
            }
        }
        public string Identifier
        {
            get;
            set;
        }
        public string Name
        {
            get;
            set;
        }
        public List<Attribute> Attributes
        {
            get
            {
                return attributes;
            }
        }
        public virtual Nullable<double> XPos
        {
            get;
            set;
        }
        public virtual Nullable<double> YPos
        {
            get;
            set;
        }

        // Constructor
        public Feature()
        {
        }

        // Static instance creator
        internal static Feature CreateDefault()
        {
            Feature newBLO = new Feature()
            {
                Name = "Test name"
            };

            return newBLO;
        }
    }
}

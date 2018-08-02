using OpenConfigurator.Core.BLOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Modelling.BLOs
{
    public class CustomRule : iBLO
    {
        // Properties
        public string Type
        {
            get
            {
                return "CustomRule";
            }
        }
        public virtual string Identifier
        {
            get;
            set;
        }
        public virtual string Name
        {
            get;
            set;
        }
        public virtual string Expression
        {
            get;
            set;
        }
        public virtual string Description
        {
            get;
            set;
        }

        // Constructors
        public CustomRule()
        {
        }

        // Static instance creator
        internal static CustomRule CreateDefault()
        {
            // Create new BLO
            CustomRule newBLO = new CustomRule()
            {
                Name = "Default Custom rule"
            };
            return newBLO;
        }

    }
}

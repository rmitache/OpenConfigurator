using Microsoft.Z3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Configuration.BLOManagers.Solver
{
    public class Constraint
    {
        // Fields
        private Expr _expr;

        // Properties
        public Expr Expr
        {
            get { return _expr; }
            private set { _expr = value; }
        }
       
        // Constructor
        public Constraint(Expr expr)
        {
            _expr = expr;
        }
    }
}

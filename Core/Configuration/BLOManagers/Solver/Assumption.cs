using Microsoft.Z3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Configuration.BLOManagers.Solver
{
    public class Assumption
    {
        // Fields
        private Expr _expr;
        private string _constantSID;
        private bool _value;

        // Properties
        public Expr Expr
        {
            get { return _expr; }
            private set { _expr = value; }
        }
        public string ConstantSID
        {
            get { return _constantSID; }
            private set { _constantSID = value; }
        }
        public bool Value
        {
            get { return _value; }
            private set { _value = value; }
        }

        // Constructor
        public Assumption(Expr expr, string constantSID, bool value)
        {
            _expr = expr;
            _constantSID = constantSID;
            _value = value;
        }
    }
}

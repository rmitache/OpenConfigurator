using Microsoft.Z3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Configuration.BLOManagers.Solver
{
    public class Constant
    {
        // Fields
        private string _constantSID;
        private ConstantDataTypes _dataType;
        private Expr _expr;

        // Properties
        public Expr Expr
        {
            get { return _expr; }
            private set { _expr = value; }
        }
        public ConstantDataTypes DataType
        {
            get { return _dataType; }
            private set { _dataType = value; }
        }

        // Constructor
        public Constant(string constantSID, ConstantDataTypes dataType, Expr expr)
        {
            _constantSID = constantSID;
            _dataType = dataType;
            _expr = expr;
        }
    }
}

using Microsoft.Z3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenConfigurator.Core.Configuration.BLOManagers.Solver
{
    public class Function
    {
        // Fields
        private FuncDecl _funcDecl;

        // Properties
        public FuncDecl FuncDecl
        {
            get { return _funcDecl; }
            private set { _funcDecl = value; }
        }
       
        // Constructor
        public Function(FuncDecl funcDecl)
        {
            _funcDecl = funcDecl;
        }
    }
}

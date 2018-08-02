using System;
using System.Reflection;
using OpenConfigurator.Core.BLOs;

namespace OpenConfigurator.Core.Other.GenericBLOFactory
{
    public class GenericBLOFactory
    {

        // Constructor
        private GenericBLOFactory()
        {

        }
        public static GenericBLOFactory GetInstance()
        {
            return new GenericBLOFactory();
        }

        // Public methods
        public iBLO CreateBLOInstance(string bloTypeName, DomainAreas domainArea)
        {
            // Variables
            Assembly assembly = Assembly.GetAssembly(typeof(OpenConfigurator.Core.Modelling.BLOs.Model));
            string domainAreaName = Enum.GetName(typeof(DomainAreas), domainArea);

            Type bloType = assembly.GetType("OpenConfigurator.Core.Modelling.BLOs." + bloTypeName);
            return CreateBLOInstance(bloType);
        }
        public iBLO CreateBLOInstance(Type bloType)
        {
            iBLO instance = (iBLO)bloType.GetMethod("CreateDefault", BindingFlags.NonPublic | BindingFlags.Static).Invoke(null, null);
            return instance;
        }
    }
}

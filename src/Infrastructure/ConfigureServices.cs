using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using OpenConfigurator.Infrastructure;
using OpenConfigurator.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using OpenConfigurator.Infrastructure.FilePersistence.Repositories;
using System.Reflection;

namespace Microsoft.Extensions.DependencyInjection;



public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, 
        IConfiguration configuration)
    {
        services.AddAutoMapper(typeof(MappingConfiguration));


        // Get path and create folder if it doesn't exist 
        var hostDir = AppDomain.CurrentDomain.BaseDirectory;
        string absoluteFolderPath = hostDir + configuration["AppSettings:ModelFilesFolder"];
        System.IO.Directory.CreateDirectory(absoluteFolderPath);

        services.AddTransient<IModelRepository>(provider => new ModelFileRepository(absoluteFolderPath,
            provider.GetService<IMapper>()));

        return services;
    }
}

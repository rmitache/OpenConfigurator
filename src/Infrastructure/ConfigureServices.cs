using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using OpenConfigurator.Infrastructure;
using OpenConfigurator.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using OpenConfigurator.Infrastructure.FilePersistence.Repositories;

namespace Microsoft.Extensions.DependencyInjection;



public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, 
        IConfiguration configuration)
    {
        services.AddAutoMapper(typeof(MappingConfiguration));
        services.AddTransient<IModelRepository>(provider => new ModelFileRepository(configuration["AppSettings:ModelFilesPath"],
            provider.GetService<IMapper>()));

        return services;
    }
}

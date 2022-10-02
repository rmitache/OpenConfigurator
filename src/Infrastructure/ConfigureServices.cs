using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using OpenConfigurator.Infrastructure;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {

        services.AddAutoMapper(typeof(MappingConfiguration));


        //services.AddTransient<IDateTime, DateTimeService>();
        //services.AddTransient<IIdentityService, IdentityService>();

        return services;
    }
}

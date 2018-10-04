using System;
using System.Reflection;
using Autofac;
using Autofac.Extensions.DependencyInjection;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using Newtonsoft.Json.Serialization;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;

namespace OpenConfigurator.ConfigurationTool.WebUI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }


        public IServiceProvider ConfigureServices(IServiceCollection services)
        {


            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services
                .AddMvc(
                config =>
                {
                    config.Filters.Add(typeof(CustomExceptionFilter));
                })
                .AddJsonOptions(options =>
                    {
                        options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                        options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
                    });


            // DI configuration------------------------------------------------------------------------------------------------------------
            var containerBuilder = new ContainerBuilder();

            //// WebUI
            //var webUIAssembly = Assembly.GetExecutingAssembly();
            //containerBuilder.RegisterAssemblyTypes(webUIAssembly).Where(t => t.Name.EndsWith("Controller")).InstancePerLifetimeScope();
            //containerBuilder.RegisterType<WebSecurityManager>()
            //   .AsSelf()
            //   .InstancePerLifetimeScope();


            //// BLL
            //Assembly bllAssembly = typeof(BLL.DomainModel.Factors.Medicine.BLOs.MedicineFactorRecord).Assembly;
            //containerBuilder.RegisterAssemblyTypes(bllAssembly)
            //    .Where(t => t.Name.EndsWith("Engine") || t.Name.EndsWith("Service") || t.Name.EndsWith("Factory"))
            //    .AsImplementedInterfaces()
            //    .InstancePerDependency();

            //// DAL
            //Assembly dalAssembly = typeof(MedicineTypeRepository).Assembly;
            //containerBuilder.RegisterAssemblyTypes(dalAssembly)
            //    .Where(t => t.Name.EndsWith("Repository"))
            //    .AsImplementedInterfaces()
            //    .InstancePerDependency();
            //containerBuilder.RegisterType<DataEntitiesContext>()
            //    .InstancePerDependency();
            ////-----------------------------------------------------------------------------------------------------------------------------

            containerBuilder.Populate(services);
            var container = containerBuilder.Build();
            return new AutofacServiceProvider(container);

        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/HomePage/Error");
            }


            app.UseAuthentication();

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                template: "{controller=MainPage}/{action=Index}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "MainPage", action = "Index" });
            });



        }
    }
}

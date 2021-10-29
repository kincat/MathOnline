using log4net.Config;
using Abhs.App_Start;
using Abhs.Application.IService;
using Abhs.Application.Service;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using StructureMap.Attributes;
using System.Threading.Tasks;
using Abhs.Common.Enums;
using Abhs.Cache.Redis;
using Abhs.Common;
using System.Timers;
using System.Collections.Concurrent;
using Abhs.Model.MonitorMiddle;
using Abhs.Model.Common;
using Abhs.Application.IService.Business;

namespace Abhs
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        private  log4net.ILog _logNet = log4net.LogManager.GetLogger(typeof(WebApiApplication));
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            //GlobalConfiguration.Configuration.Filters.Add(new WebApiExceptionFilterAttribute());
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            
            FileInfo configFile = new FileInfo(HttpContext.Current.Server.MapPath("/Configs/log4net.config"));
            log4net.Config.XmlConfigurator.Configure(configFile);
            //var container = StructuremapMvc.StructureMapDependencyScope.Container;
            //var studentService = container.GetInstance<IDataCheckService>();
            //studentService.CheckLessonData();

        }
 
        protected void Application_End(object sender,EventArgs e)
        {

        }
    }
}

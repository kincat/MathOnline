using log4net.Config;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.WinService
{
    static class Program
    {

        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        static void Main()
        { 
            string configFilePath = AppDomain.CurrentDomain.BaseDirectory + "app.config";
            XmlConfigurator.ConfigureAndWatch(new FileInfo(configFilePath));
            ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[]
            {
                new QuartzService()
            };
            ServiceBase.Run(ServicesToRun);
        }
    }
}

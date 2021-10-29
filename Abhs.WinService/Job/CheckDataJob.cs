using Abhs.Application.IService.Business;
using Quartz;
using StructureMap;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.WinService.Job
{
    public class CheckDataJob : IJob
    {
        private log4net.ILog _logNet = log4net.LogManager.GetLogger(typeof(ClassMonitorJob));

        public async Task Execute(IJobExecutionContext context)
        {

            _logNet.Info("ClassMonitorJob开启");
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var dic = (Dictionary<string, object>)context.JobDetail.JobDataMap.Get("container");
            var container = dic["container"] as IContainer;
            var dataCheckService = container.GetInstance<IDataCheckService>();
            dataCheckService.CheckLessonData();
            sw.Stop();
            _logNet.Info("ClassMonitorJob程序执行时间：" + sw.ElapsedMilliseconds + "毫秒");

        }
    }
}

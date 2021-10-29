using Abhs.Application.IService;
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
    public class StudentMonitorJob : IJob
    {
        private log4net.ILog _logNet = log4net.LogManager.GetLogger(typeof(StudentMonitorJob));

        public async Task Execute(IJobExecutionContext context)
        {
            _logNet.Info("StudentMonitorJob开启");
            return;
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var dic = (Dictionary<string, object>)context.JobDetail.JobDataMap.Get("container");
            var container = dic["container"] as IContainer;
            var middleStudentService = container.GetInstance<IMiddleStudentService>();
            middleStudentService.MiddleStudentData();
            sw.Stop();
            _logNet.Info("StudentMonitorJob程序执行时间：" + sw.ElapsedMilliseconds + "毫秒");

        }
    }
}

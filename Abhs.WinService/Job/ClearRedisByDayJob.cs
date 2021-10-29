using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Abhs.Application.IService;
using Abhs.Application.Service;
using System.Diagnostics;
using StructureMap;

namespace Abhs.WinService.Job
{
    /// <summary>
    /// 更新redis缓存数据
    /// </summary>
    public class ClearRedisByDayJob : IJob
    {
     
        private static log4net.ILog _logNet = log4net.LogManager.GetLogger(typeof(ClearRedisByDayJob));
       
        public async Task Execute(IJobExecutionContext context)
        {
            _logNet.Info("ClearRedisByDayJob开启");
            Stopwatch sw = new Stopwatch();
            sw.Start();
            
            var container = context.JobDetail.JobDataMap.Get("container") as IContainer;
            var policyService = container.GetInstance<IPolicyService>();
            policyService.InitBaseData();

            sw.Stop();
            _logNet.Info("ClearRedisByDayJob程序执行时间：" + sw.ElapsedMilliseconds+"毫秒");
            
        }
    }
}
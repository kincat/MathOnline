using Abhs.DependencyResolution;
using Abhs.WinService.Ioc;
using Abhs.WinService.Job;
using log4net;
using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using StructureMap;

namespace Abhs.WinService
{
    public partial class QuartzService : ServiceBase
    {
 
        private readonly ILog logger;

        // 调度器工厂
        private static  ISchedulerFactory factory = null;

        // 调度器
         private static  IScheduler scheduler = null;

        public QuartzService()
        {
            InitializeComponent();
            logger = LogManager.GetLogger(GetType());

             //创建一个工厂
            factory = new StdSchedulerFactory();

            // 调度器
            scheduler = factory.GetScheduler().Result;

            IContainer container = new Container(c => c.AddRegistry<DefaultRegistry>());

            // 注册任务
            RegClearRedisByDayJob(container);

            // 设置课中和课后的学生情况
            RegClassMonitorJob(container);
        }

        protected override void OnStart(string[] args)
        {
            logger.Info("开启任务");
            
            //启动
            scheduler.Start();
        }
      
        /// <summary>
        /// 每天缓存的清除和初始化【学校 班级 老师 课 题 课表...】
        /// </summary>
        /// <param name="dic"></param>
        private static void RegClearRedisByDayJob(IContainer container)
        {
            // 创建一个具体的作业即job(具体的job需要单独在一个文件中执行
            var job = JobBuilder.Create<ClearRedisByDayJob>().WithIdentity(nameof(ClearRedisByDayJob), $"{nameof(ClearRedisByDayJob)}Group").Build();
            job.JobDataMap.Add("container", container);

            // 创建并配置一个触发器即trigger
            var trigger = TriggerBuilder.Create()
               .WithIdentity(nameof(ClearRedisByDayJob), $"{nameof(ClearRedisByDayJob)}Group")
               .WithCronSchedule("0 0/5 * * * ?")     //秒 分 时 某一天 月 周 年(可选参数)                          
               .Build();

            // 将job和trigger加入到作业调度池中
            scheduler.ScheduleJob(job, trigger);
        }

        private static void RegClassMonitorJob(IContainer container)
        {

            IJobDetail job = JobBuilder.Create<ClassMonitorJob>().WithIdentity(nameof(ClassMonitorJob), $"{nameof(ClassMonitorJob)}Group").Build();
            job.JobDataMap.Add("container", container);
            ITrigger trigger = TriggerBuilder.Create()
               .WithIdentity(nameof(ClassMonitorJob), $"{nameof(ClassMonitorJob)}Group")
               .WithCronSchedule("0 0/5 * * * ?")                       
               .Build();
            scheduler.ScheduleJob(job, trigger);      //把作业，触发器加入调度器。
        }

       /// <summary>
       /// 任务停止
       /// </summary>
        protected override void OnStop()
        {
            if (!scheduler.IsShutdown)
            {
                scheduler.Shutdown();
            }
                
            logger.Info("停止任务");
        }
    }
}

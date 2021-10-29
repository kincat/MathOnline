using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
    //大模块类别
    public enum EnumModuleType
    {
        //--这个双横线后面的是学生的分组

        //学 -- 有课时内容
        [Description("智能学习")]
        智能学习 = 1,

        //提  -- 有课时内容
        [Description("智能提升")]
        智能提升 = 2,

        //作 系统自动留的 --课后任务
        [Description("智能作业")]
        智能作业 = 3,

        //任 老师留的 --课后任务
        [Description("课后任务")]
        课后任务 = 4,

        //订 -- 提问 --错题本
        [Description("错题订正")]
        错题订正 = 5,

        //阅  --错题本
        [Description("今日错题")]
        今日错题 = 6,

        //阅 --报告中心
        [Description("报告中心")]
        报告中心 = 7,

        //算 -- 计算训练
        [Description("计算训练")]
        计算训练 = 8,

        //登
        [Description("登录")]
        登录 = 9,
        
        //退
        [Description("退出")]
        退出 = 10,

        //首 -- 首页
        [Description("首页")]
        首页 = 11,

        //首 -- 首页
        [Description("考试")]
        考试 = 12,
        [Description("奖励金币")]
        奖励金币 = 30

    }
}

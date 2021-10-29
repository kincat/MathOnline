using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
    /// <summary>
    /// 小模块类别 
    /// </summary>
    public enum EnumLessonModuleType
    {
        [Description("学前测试")]
        学前测试 = 10,
        //-------- 智能学习 -------- 有课时内容LessonsItem
        //错 -- 提问
        [Description("错题巩固")]
        错题巩固 = 11,
        //阅
        [Description("内容浏览")]
        内容浏览 = 12,
        //测 
        [Description("基础大过关")]
        基础大过关 = 13,
        //学
        [Description("视频学习")]
        视频学习 = 14,
        //例 -- 提问
        [Description("典例学习")]
        典例学习 = 15,
        //查 -- 提问
        [Description("查漏补缺")]
        查漏补缺 = 16,



        //-------- 智能提升 -------- 有课时内容LessonsItem
        //提 -- 提问
        [Description("智能提升")]
        智能提升_智能提升 = 21,
        //学
        [Description("视频学习")]
        视频学习_智能提升 = 22,



        //-------- 智能作业 -------- 有课时内容LessonsItem
        //学
        [Description("基础学习")]
        基础学习 = 31,
        //阅
        [Description("错题复习")]
        错题复习 = 32,
        //练 
        [Description("作业答题")]
        作业答题 = 33,


        //-------- 课后任务 --------
        //学
        [Description("基础学习")]
        基础学习_课后任务 = 41,
        //练
        [Description("任务答题")]
        任务答题 = 42,



        //-------- 计算训练 --------
        //闯
        [Description("闯关")]
        闯关 = 81,
        //练
        [Description("练习场")]
        练习场 = 82,


        //-------- 考试 --------
        //考
        [Description("考试")]
        考试 = 121,

    }
}

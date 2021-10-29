using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
    public enum HandleType
    {
        [Description("呼叫")]
        呼叫 = 1,
        [Description("忽略")]
        忽略 = 2,
        [Description("表扬")]
        表扬 = 3,
        [Description("提醒")]
        提醒 = 4,
        [Description("奖励")]
        奖励 = 5,
        [Description("惩罚")]
        惩罚 = 6,
        /// <summary>
        /// 超过15分钟系统自动忽略,此处忽略的消息不会提交给学生
        /// </summary>
        [Description("系统自动忽略")]
        自动忽略 = 7,
        [Description("通知")]
        通知 = 8,
    }
}

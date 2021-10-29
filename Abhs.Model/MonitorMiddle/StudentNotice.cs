using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
    /// <summary>
    /// 给学生的通知消息, 写入list. 前端消费了即消失
    /// key: notice:schoolid:classid:studentid
    /// </summary>
    public class StudentNotice
    {        
        /// <summary>
        /// 消息唯一标识号
        /// </summary>
        public string message_id { get; set; }

        /// <summary>
        /// 消息处理类型, 1 已呼叫 2. 忽略 3.表扬 4 提醒, 5 奖励金币 5惩罚金币
        /// </summary>
        public HandleType handle_type { get; set; }

        /// <summary>
        /// 8种警告类型
        /// 1：长时间无学习记录
        /// 2：长时间不在学习页面
        /// 3：答题时间过长
        /// 4：答题过快
        /// 5：“学前测评”多次未通过
        /// 6：“典例学习”题目全错
        /// 7：2星题连续做错
        /// 8：中途退出
        /// </summary>
        public int warning_type { get; set; }

        /// <summary>
        /// 要通知给学生的消息内容. 一般是处理的结果或者其他自动生成的内容
        /// </summary>
        public string content { get; set; }

        public int gold { get; set; } = 0;
        
        /// <summary>
        /// 处理时间
        /// </summary>
        public DateTime handle_time { get; set; }

        /// <summary>
        /// 消息处理的老师ID
        /// </summary>
        public int handle_teacherid { get; set; }

        /// <summary>
        /// 消息处理的老师姓名
        /// </summary>
        public string handle_teachername { get; set; }

        public string courseId { get; set; } = "";

    }
}

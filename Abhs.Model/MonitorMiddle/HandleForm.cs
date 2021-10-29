using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
    /// <summary>
    /// 
    /// </summary>
    public class HandleForm
    {
        /// <summary>
        /// 消息唯一标识号
        /// </summary>
        public string messageid { get; set; }

        /// <summary>
        /// 学生id
        /// </summary>
        public int studentid { get; set; }

        /// <summary>
        /// 消息类型: 1 提问 2 预警 3其它	
        /// </summary>
        public int messagetype { get; set; }

        /// <summary>
        /// 8种警告类型
        /// 
        /// 1：长时间无学习记录
        /// 2：长时间不在学习页面
        /// 3：答题时间过长
        /// 4：答题过快
        /// 5：“学前测评”多次未通过
        /// 6：“典例学习”题目全错
        /// 7：2星题连续做错
        /// 8：中途退出
        /// 
        /// -1: 不做处理
        /// </summary>
        public int warning_type { get; set; }
        

        /// <summary>
        /// 消息处理类型, 1 呼叫 2. 忽略 3.表扬 4 提醒, 5 奖励金币 6 惩罚金币 7 系统自动忽略
        /// </summary>
        public HandleType handle_type { get; set; }

        /// <summary>
        /// 处理结果内容
        /// </summary>
        public string handle_result { get; set; }



    }

    public class HandleFormList
    {
        public List<HandleForm> forms { get; set; }
    }
}

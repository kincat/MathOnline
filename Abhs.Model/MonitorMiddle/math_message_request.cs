using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
    public class math_message_request
    {
        
        /// <summary>
        /// 消息唯一标识号
        /// </summary>
        public string message_id { get; set; }

        /// <summary>
        /// 上课年月日yyyyMMdd
        /// </summary>
        public string day { get; set; }


        /// <summary>
        /// 学生ID
        /// </summary>
        public int student_id { get; set; }

        /// <summary>
        /// 学生姓名
        /// </summary>
        public string student_name { get; set; }  

        /// <summary>
        /// 星级
        /// </summary>
        public int level { get; set; }

        /// <summary>
        /// 学生头像
        /// </summary>
        public string head { get; set; } = "/Content/images/userimg.png";

        /// <summary>
        /// 消息类型: 1 提问 2 预警  3学情	4 特殊学情(也归属于学情,不过内容部分是特殊的json串) 5  视频学情
        /// </summary>
        public int message_type { get; set; }

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
        /// </summary>
        public int warning_type { get; set; }

        /// <summary>
        /// 消息类型名称
        /// </summary>
        public string message_typename { get; set; }

        /// <summary>
        /// 消息标题. 
        /// 单行文字提示信息的,标题可以传空字符串.
        /// 两行文字的,标题为显示的第一行内容
        /// </summary>
        public string message_title { get; set; }

        /// <summary>
        /// 原始消息内容
        /// </summary>
        public string message_content { get; set; }     

        /// <summary>
        /// 消息创建时间
        /// </summary>
        public DateTime create_time { get; set; } = DateTime.Now;

        /// <summary>
        /// 大模块分类 ( 1 智能学习,2 智能提升,3 智能作业, 4课后任务,5 错题订正,6 今日错题 7 查看报告 8 计算训练 9 登录 10 退出)		
        /// </summary>
        public int module_type { get; set; }
        
        /// <summary>
        /// 大模块分类名称 keyword
        /// </summary>
        public string module_name { get; set; }
        /// <summary>
        /// 小模块类别	
        /// </summary>
        public int lesson_module_type { get; set; }
        /// <summary>
        /// 课时模块类别名称 keyword
        /// </summary>
        public string lesson_module_typename { get; set; }

        /// <summary>
        ///  1 开始 2 完成
        ///  有小模块配合着小模块显示, 没有的话跟着大模块显示
        /// </summary>
        public int action_type { get; set; }
        /// <summary>
        /// 查看报告的URL地址,已经做过免登录处理
        /// </summary>
        public string reporturl { get; set; }

        /// <summary>
        /// 评价内容,json格式.解析后为List<MessageEvaluate>类型
        /// </summary>
        public string evaluate_jsoncontent { get; set; }

        /// <summary>
        /// 所属课程ID		
        /// </summary>
        public int package_id { get; set; }
        /// <summary>
        /// 课程名称
        /// </summary>
        public string package_name { get; set; }
        /// <summary>
        /// 课时ID	
        /// </summary>
        public int lesson_id { get; set; }
        /// <summary>
        /// 课时序号
        /// </summary>
        public int lesson_index { get; set; }
        /// <summary>
        /// 课时名称
        /// </summary>
        public string lesson_name { get; set; }
        /// <summary>
        /// 课时内容ID		
        /// </summary>
        public int lesson_itemid { get; set; }
        /// <summary>
        /// 课时内容名称
        /// </summary>
        public string lesson_itemname { get; set; }
        
        /// <summary>
        /// 题型Code keyword
        /// </summary>
        public string question_typecode { get; set; }
        /// <summary>
        /// 题型名称 text
        /// </summary>
        public string question_typename { get; set; }
        /// <summary>
        /// 题目ID
        /// </summary>
        public int question_itemid { get; set; }
    }
}

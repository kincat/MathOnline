using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
    public class message_for_student
    {
        
        /// <summary>
        /// 学生ID
        /// </summary>
        public int student_id { get; set; }
        /// <summary>
        /// 消息类型: 1 提问 2 预警  3学情	4 特殊学情(也归属于学情,不过内容部分是特殊的json串) 5  视频学情
        /// </summary>
        public int message_type { get; set; }

        /// <summary>
        /// 当前正在上课的班级
        /// 有值代表这个学生正在上这一个班的课程.
        /// 如果为0或为null, 则可能当前学生正在上多个班级的课程
        /// </summary>
        public int class_id { get; set; }

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
        /// 消息标题. 
        /// 单行文字提示信息的,标题可以传空字符串.
        /// 两行文字的,标题为显示的第一行内容
        /// </summary>
        public string message_title { get; set; }
        /// <summary>
        /// 消息内容
        /// </summary>
        public string message_content { get; set; }
        /// <summary>
        /// 查看报告的URL地址,已经做过免登录处理
        /// </summary>
        public string reporturl { get; set; }

        /// <summary>
        /// 评价内容,json格式.解析后为List<MessageEvaluate>类型
        /// </summary>
        public string evaluate_jsoncontent { get; set; }

        /// <summary>
        /// 大模块分类 	
        /// </summary>
        public int module_type { get; set; }
        /// <summary>
        ///  1 开始 2 完成
        ///  有小模块配合着小模块显示, 没有的话跟着大模块显示
        /// </summary>
        public int action_type { get; set; }

        /// <summary>
        /// 课时模块类别	
        /// </summary>
        public int? lesson_module_type { get; set; }

        /// <summary>
        /// 所属课程ID		
        /// </summary>
        public int? package_id { get; set; }
        /// <summary>
        /// 课时ID	
        /// </summary>
        public int? lesson_id { get; set; }
      
        /// <summary>
        /// 课时内容ID		
        /// </summary>
        public int? lesson_itemid { get; set; }
       
        /// <summary>
        /// 题型Code keyword
        /// </summary>
        public string question_typecode { get; set; }
        /// <summary>
        /// 题目ID
        /// </summary>
        public int? question_itemid { get; set; }
    }
}

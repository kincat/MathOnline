using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    public class StudentHeartCondition
    {
        /// <summary>
        /// 学生ID
        /// </summary>
        public int student_id { get; set; }

        /// <summary>
        /// 大模块分类 ( 1 智能学习,2 智能提升, 3智能作业, 4错题巩固,5 思维训练,6计算训练 7 其它)	
        /// </summary>
        public int module_type { get; set; } = 0;

        /// <summary>
        /// 课时模块类别 (1.错题巩固 2 基础检测 3 课时介绍 4视频学习 5 典例训练 6 查漏补缺)		
        /// </summary>
        public int lesson_module_type { get; set; } = 0;

        /// <summary>
        /// 课时ID
        /// </summary>
        public int lesson_id { get; set; } = 0;
        /// <summary>
        /// 学生位置
        /// </summary>
        public string student_position { get; set; } = "";
        /// <summary>
        /// 学生动作
        /// </summary>
        public string student_action { get; set; } = "";
    }
}

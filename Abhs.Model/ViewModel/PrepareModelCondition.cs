using Abhs.Model.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    public class BaseCondition
    {
        /// <summary>
        /// 学校ID
        /// </summary>
        public int schoolId { get; set; }
        /// <summary>
        /// 班级ID
        /// </summary>
        public int classId { get; set; }
        /// <summary>
        /// 课程ID
        /// </summary>
        public int packId { get; set; }
        /// <summary>
        /// 课时ID
        /// </summary>
        public int lessonId { get; set; }
        /// <summary>
        /// 备课ID
        /// </summary>
        public int prepareId { get; set; }
        /// <summary>
        /// 老师ID
        /// </summary>
        public int teacherId { get; set; }
        public string teacherName { get; set; }

    }
    public class PrepareLessonConditionBase: BaseCondition
    {
       
        /// <summary>
        /// 老师姓名
        /// </summary>
        public string teacherName { get; set; } = "";
 
        /// <summary>
        /// 页面停留时长
        /// </summary>
        public int timeCounts { get; set; } = 0;
    }
    /// <summary>
    /// 保存错题巩固
    /// </summary>
    public class PrepareMistakeCondition: PrepareLessonConditionBase
    {
        /// <summary>
        /// 错题数量
        /// </summary>
        public int mistakesCount { get; set; } = 0;
        /// <summary>
        /// 备课开始时间
        /// </summary>
        public DateTime beginTime { get; set; }    
        public int qid { get; set; }    
    }
    /// <summary>
    /// 保存智能学习
    /// </summary>
    public class PrepareLearningCondition : PrepareLessonConditionBase
    {

        /// <summary>
        /// 课时内容ID
        /// </summary>
        public int itemId { get; set; } = 0;
        
        /// <summary>
        /// 题型选择
        /// </summary>
        public List<LearnQuestionType> selectValue { get; set; }
    }
    public class QuestionTypeCondition
    {  
        /// <summary>
       /// 备课ID
       /// </summary>
        public int prepareId { get; set; }

        /// <summary>
        /// 课时内容ID
        /// </summary>
        public int itemId { get; set; }

        /// <summary>
        /// 题型code
        /// </summary>
        public string code { get; set; }

        /// <summary>
        /// 题型级别
        /// </summary>
        public int level { get; set; }

        /// <summary>
        /// 时长
        /// </summary>
        public int timeCount { get; set; }
    }
   
     
}

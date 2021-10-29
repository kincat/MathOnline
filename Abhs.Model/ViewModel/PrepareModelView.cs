using Abhs.Model.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    /// <summary>
    /// 课时
    /// </summary>
    public class PrepareModelView
    {
        /// <summary>
        /// 备课ID
        /// </summary>
        public int prepareId { get; set; } = 0;
        public int packId { get; set; }

        /// <summary>
        /// 课时ID
        /// </summary>
        public int lessonId { get; set; }

        /// <summary>
        /// 班级ID
        /// </summary>
        public int classId { get; set; } = 0;

        /// <summary>
        /// 课时索引，第几课时
        /// </summary>
        public int index { get; set; }

        /// <summary>
        /// 课时标题
        /// </summary>
        public string lessionTitle { get; set; }
        /// <summary>
        /// 课时状态, 0 未开始, 1 已备课, 2 备课中
        /// </summary>
        public int status { get; set; }

        /// <summary>
        /// 状态名称0 未开始, 1 已备课, 2 备课中
        /// </summary>
        public string statusName { get; set; } = "";

        /// <summary>
        /// 已经有多少人学习过了
        /// </summary>
        public string desc { get; set; }

        /// <summary>
        /// 课时状态
        /// </summary>
        public int lessonStatus { get; set; }

        /// <summary>
        /// 课时状态(1、普通课时，2、复习课，3、考试课)
        /// </summary>
        public int lessonType { get; set; }
    }
    /// <summary>
    /// 备课班级
    /// </summary>
    public class PrepareClassView
    {
        /// <summary>
        /// 班级ID
        /// </summary>
        public int classId { get; set; } = 0;
        public int packId { get; set; } = 0;
        /// <summary>
        /// 班级名称
        /// </summary>
        public string className { get; set; } = "";
        public int wait { get; set; } = 0;
        /// <summary>
        /// 待备课数量
        /// </summary>
        public int prepareing { get; set; } = 0;
        /// <summary>
        /// 已备课数量
        /// </summary>
        public int finish { get; set; } = 0;
        /// <summary>
        /// 需备课 0:不需要，1:需备课
        /// </summary>
        public int isMust { get; set; } = 0;
        /// <summary>
        /// 最近开课时间
        /// </summary>
        public string benginTime { get; set; } = "";
        public int isSelect { get; set; } = 0;
    }

    /// <summary>
    /// 备课课时内容
    /// </summary>
    public class PrepareLessonContentView
    {
        /// <summary>
        /// 备课开始时间
        /// </summary>
        public string beginTime { get; set; } = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        /// <summary>
        /// 备课完成时间
        /// </summary>
        public string prepareTime { get; set; } = "";
        /// <summary>
        /// 备课老师
        /// </summary>
        public string prepareTeacher { get; set; } = "";
        /// <summary>
        /// 备课进度
        /// </summary>
        public string prepareProcess { get; set; } = "";
        /// <summary>
        /// 错题数量
        /// </summary>
        public int mistakes { get; set; }
        /// <summary>
        /// 网页停留位置
        /// </summary>
        public int position { get; set; }
        /// <summary>
        /// 智能学习
        /// </summary>
        public List<PreparelearnView> learnList { get; set; }
        /// <summary>
        /// 查漏补缺
        /// </summary>
        public PrepareLeakFillingView leakFilling { get; set; }
        /// <summary>
        /// 备课步骤
        /// </summary>
        public PrepareStep step { get; set; }


    }
    /// <summary>
    /// 智能学习
    /// </summary>
    public class PreparelearnView
    {
        /// <summary>
        /// 课时内容ID
        /// </summary>
        public int id { get; set; }
        /// <summary>
        /// 标题
        /// </summary>
        public string title { get; set; }
        /// <summary>
        /// 内容
        /// </summary>
        public string content { get; set; }
        /// <summary>
        /// 视频
        /// </summary>
        public VideoView video { get; set; }
        /// <summary>
        /// 是否展开，1是，0否
        /// </summary>
        public int isOpen { get; set; } = 0;
       
        public List<PrepareQuestionView> questionTypeItem { get; set; }
    }
    public class PrepareQuestionView
    {
        /// <summary>
        /// 题型code
        /// </summary>
        public string code { get; set; }
        /// <summary>
        /// 题型名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 状态,是否选中
        /// </summary>
        public int status { get; set; } = 1;
        public List<PreparelearnLevelView> learnLevel { get; set; }
    }
    public class PreparelearnLevelView
    {
        /// <summary>
        /// 星级
        /// </summary>
        public int level { get; set; }
        /// <summary>
        /// 0未点击，1点击
        /// </summary>
        public int status { get; set; }

        /// <summary>
        /// 查漏补缺题目
        /// </summary>
        public PreparelearnQuestionView question { get; set; }
    }

    /// <summary>
    ///  查漏补缺题目
    /// </summary>
    public class PreparelearnQuestionView
    {
        /// <summary>
        /// 题库ID
        /// </summary>
        public int questionId { get; set; }
        /// <summary>
        /// 题干
        /// </summary>
        public string questionTitle { get; set; }
        /// <summary>
        /// 选型A
        /// </summary>
        public string optionA { get; set; }
        /// <summary>
        /// 选型B
        /// </summary>
        public string optionB { get; set; }
        /// <summary>
        /// 选型C
        /// </summary>
        public string optionC { get; set; }
        /// <summary>
        /// 选型D
        /// </summary>
        public string optionD { get; set; }
        /// <summary>
        /// 选型E
        /// </summary>
        public string optionE { get; set; }
        /// <summary>
        /// 选型F
        /// </summary>
        public string optionF { get; set; }
        /// <summary>
        /// 答案
        /// </summary>
        public string answer { get; set; }
        /// <summary>
        /// 答案解析
        /// </summary>
        public string answerExplain { get; set; } = "";
        /// <summary>
        /// 问题类型
        /// </summary>
        public int questionType { get; set; }

    }

    /// <summary>
    /// 查漏补缺
    /// </summary>
    public class PrepareLeakFillingView
    {
        public List<PreparelearnQuestionView> question { get; set; }
    }

    public class TeacherTaskView
    {
        /// <summary>
        /// 课前备课
        /// </summary>
        public int prepareCount { get; set; } = 0;
        /// <summary>
        /// 上课管理
        /// </summary>
        public int attendClassCount { get; set; } = 0;
        /// <summary>
        /// 课后任务
        /// </summary>
        public int classFinishCount { get; set; } = 0;
        /// <summary>
        /// 班级管理
        /// </summary>
        public int classManageCount { get; set; } = 0;
    }
    public class TeacherKeepLiveView
    {
        public int SchoolID { get; set; }
        public int TeacherID { get; set; }
        public DateTime BeginTime { get; set; }
        public DateTime EndTime { get; set; }
        public int ValidTime { get; set; }
        public string FlagID { get; set; }
    }
    public class TestQuestionView
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public int Difficulty { get; set; }
        public string KnowCode { get; set; }
        public string TypeCode { get; set; }
        public int Type { get; set; }
    }
    public class TestCourseQuestionView
    {
        /// <summary>
        /// 题库ID
        /// </summary>
        public int qid { get; set; }
        /// <summary>
        /// 题干
        /// </summary>
        public string qTitle { get; set; }
        /// <summary>
        /// 选型A
        /// </summary>
        public string optionA { get; set; }
        /// <summary>
        /// 选型B
        /// </summary>
        public string optionB { get; set; }
        /// <summary>
        /// 选型C
        /// </summary>
        public string optionC { get; set; }
        /// <summary>
        /// 选型D
        /// </summary>
        public string optionD { get; set; }
        /// <summary>
        /// 选型E
        /// </summary>
        public string optionE { get; set; }
        /// <summary>
        /// 选型F
        /// </summary>
        public string optionF { get; set; }
        /// <summary>
        /// 答案
        /// </summary>
        public string answer { get; set; }
        /// <summary>
        /// 答案解析
        /// </summary>
        public string answerExplain { get; set; } = "";
        /// <summary>
        /// 问题类型
        /// </summary>
        public int qType { get; set; }
        public int level { get; set; }
        public int score { get; set; }
        public string knowName { get; set; }
        public string typeName { get; set; }
    }
}

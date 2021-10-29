using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.Model
{
    //public class AfterTaskModel
    //{
    //    public List<TaskLessonModel> lessonList { get; set; }
    //}
    public class TaskLessonModel
    {
        public int lessonId { get; set; }
        public int index { get; set; }
        public string lessonName { get; set; }
        public List<TaskLessonItemModel> itemList { get; set; }
    }
    public class TaskLessonItemModel
    {
        public int lessonId { get; set; }
        public int itemId { get; set; }
        public string name { get; set; }
        /// <summary>
        /// 1:视频，2题型
        /// </summary>
        public int itemType { get; set; }
        public string itemTypeName { get; set; }
        public string code { get; set; }
        /// <summary>
        /// 是否选择，1：选择，0：未选择
        /// </summary>
        public int status { get; set; }
        /// <summary>
        /// 题目难度
        /// </summary>
        public int level { get; set; } = 0;
        public string videoUrl { get; set; }
        /// <summary>
        /// 抽取数量
        /// </summary>
        public int counts { get; set; } = 0;
        public string desciption { get; set; } = "";
        public List<StudentStudyItem> students { get; set; }
    }
    public class StudentStudyItem
    {
        public int studentId { get; set; }
        public string studentName { get; set; }
        /// <summary>
        /// 应该达到多少级
        /// </summary>
        public int shouldLevel { get; set; }
        /// <summary>
        /// 当前多少级
        /// </summary>
        public int currentLevel { get; set; }
        public string desciption { get; set; } = "";
    }
    /// <summary>
    /// 智能作业
    /// </summary>
    public class AiTaskModels
    {
        /// <summary>
        /// 视频学习
        /// </summary>
        public List<AiTaskVideo> Videos { get; set; }

        /// <summary>
        /// 错题浏览
        /// </summary>
        public List<AiErrorQuestion> ErrorQuestions { get; set; }

        /// <summary>
        /// 练习题目
        /// </summary>
        public List<AiExeQuestion> ExeQuestions { get; set; }
    }
    /// <summary>
    /// 智能作业视频学习类
    /// </summary>
    public class AiTaskVideo
    {
        /// <summary>
        /// 视频名称
        /// </summary>
        public string VideoName { get; set; }

        /// <summary>
        /// 视频时长
        /// </summary>
        public int? VideoDuration { get; set; }

        /// <summary>
        /// 视频URL
        /// </summary>
        public string VideoUrl { get; set; }
        public int? ItemId { get; set; }

        /// <summary>
        /// 需要重点关注的知识点
        /// </summary>
        public Dictionary<string, int> NoKnows { get; set; }

        /// <summary>
        /// 开始学习时间
        /// </summary>
        public DateTime? BeginTime { get; set; }


        /// <summary>
        /// 结束学习时间
        /// </summary>
        public DateTime? FinishTime { get; set; }

        /// <summary>
        /// 学习时间
        /// </summary>
        public int? Time { get; set; }
    }
    /// <summary>
    /// 智能作业错题浏览
    /// </summary>
    public class AiErrorQuestion
    {
        /// <summary>
        /// 题目ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 题型ID
        /// </summary>
        public string TypeTitle { get; set; }

        /// <summary>
        /// 难度
        /// </summary>
        public int Difficulty { get; set; }

        /// <summary>
        /// 用户答案
        /// </summary>
        public string UserAnswer { get; set; }

        /// <summary>
        /// 学习时间
        /// </summary>
        public int? Time { get; set; }
    }

    /// <summary>
    /// 智能作业练习题
    /// </summary>
    public class AiExeQuestion
    {
        /// <summary>
        /// 题目ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 所属课时内容
        /// </summary>
        public int ItemId { get; set; }

        /// <summary>
        /// 题型CODE【典例训练】
        /// </summary>
        public string TypeCode { get; set; }

        /// <summary>
        /// 主知识点【基础过关测】
        /// </summary>
        public string KnowCode { get; set; }

        /// <summary>
        /// 用户答案
        /// </summary>
        public string UserAnswer { get; set; }

        /// <summary>
        /// 用户答案对错
        /// </summary>
        public string IsRight { get; set; }

    }
    public class TaskClassView
    {
        public int classId { get; set; }
        public string className { get; set; }
        public string nearCourse { get; set; }
        public DateTime courseTime { get; set; }
    }
    public class TaskTableView
    {
        public DateTime beginTime { get; set; }
        public string timeString { get; set; }
    }
    public class GoldDetailModel
    {
        public int schoolId { get; set; }
        public int studentId { get; set; }
        public int teacherId { get; set; }
        public string courseId { get; set; }
        public int gold { get; set; }
        public int packId { get; set; }
        public string remark { get; set; }
        public int classId { get; set; }
        public int isSend { get; set; } = 0;
    }
}

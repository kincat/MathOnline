using Abhs.Common;
using Abhs.Common.Enums;
using Abhs.Model.Access;
using Abhs.Model.Common;
using Abhs.Model.Model;
using Abhs.Model.MonitorMiddle;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    public class AfterClassTaskView
    {
    }
    public class TaskStepFirstCondition
    {
        public int taskId { get; set; } = 0;
        public int schoolId { get; set; }
        public int classId { get; set; }
        public string taskName { get; set; }
        public string beginTime { get; set; }
        public string endTime { get; set; }
        public int[] studentIds { get; set; }
        public int[] lessonIds { get; set; }
        public int teacherId { get; set; } = 0;
        public string teacherName { get; set; }
    }
    public class TaskStepTwoCondition
    {
        public int taskId { get; set; } = 0;
        public int schoolId { get; set; }
        public int classId { get; set; }
        public  List<TaskLessonModel> list { get; set; }
    }
    public class TaskStepThirdCondition
    {
        public int taskId { get; set; } = 0;
        public List<TaskQuestion> list { get; set; }
        public TaskStepTwoCondition data { get; set; }
    }
    public class TaskQuestion
    {
        public int itemId { get; set; }
        public string code { get; set; }
        public List<int> questionIds { get; set; }
    }


    public class GroupStudentView
    {
        public string groupName { get; set; }
        public List<Dictionary<string,object>> students { get; set; }

    }
    public class ClassLogView
    {
        //编号
        public int id { get; set; }
        //上课日期
        public  string classDate
        {
            get
            {
                var course = new CourseIdModel(this.courseId);
                return $"{course.Date.ToString().Insert(6, "-").Insert(4, "-")}（周{course.WeekName}）";
            }
        }
        public string courseId { get; set; }
        /// <summary>
        /// 上课时间
        /// </summary>
        public string classTime
        { 
            get
            {
                var course = new CourseIdModel(this.courseId);
                return $"{course.BeginTime.ToString("HH:mm")}~{course.EndTime.ToString("HH:mm")}";
            }
        }
        /// <summary>
        /// 应出勤
        /// </summary>
        public int allStudent { get; set; }
        /// <summary>
        /// 实际出勤
        /// </summary>
        public int studyStudent { get; set; }
        /// <summary>
        /// 未出勤
        /// </summary>
        public int otherStudent { get { return allStudent - studyStudent > 0 ? allStudent - studyStudent : 0; } }
        /// <summary>
        /// 出勤率
        /// </summary>
        public string studyRate {
            get {
                if (allStudent == 0) return "-";
                return (studyStudent * 100 / allStudent) > 100 ? "100%" : (studyStudent * 100 / allStudent) + "%";
            }
        }
        /// <summary>
        /// 提问数
        /// </summary>
        public int askCount { get; set; }
        /// <summary>
        /// 警告数
        /// </summary>
        public int errorCount { get; set; }
    }

    public class TaskLogView
    {
        //编号
        public int id { get; set; }
        //发布日期
        public string createTime { get; set; }
       
        /// <summary>
        /// 名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 任务开始时间
        /// </summary>
        public string beginTime { get; set; }
        /// <summary>
        /// 任务结束时间
        /// </summary>
        public string endTime { get; set; }
        /// <summary>
        /// 任务人数
        /// </summary>
        public int allStudent { get; set; }
        /// <summary>
        /// 完成人数
        /// </summary>
        public int overStudent { get; set; }
        /// <summary>
        /// 未完成
        /// </summary>
        public int otherStudent { get { return allStudent - overStudent > 0 ? allStudent - overStudent : 0; } }
        /// <summary>
        /// 完成率
        /// </summary>
        public string overRate
        {
            get
            {
                if (allStudent == 0) return "-";
                return (overStudent * 100 / allStudent) > 100 ? "100%" : (overStudent * 100 / allStudent) + "%";
            }
        }
        /// <summary>
        /// 提问数
        /// </summary>
        public string teacherName { get; set; }
    }
    public class AttendanceDetailView
    {
        public int studentId { get; set; }
        public string studentNo { get; set; }
        public string studentName { get; set; }
        public string sex{ get; set; }
        /// <summary>
        /// 出勤时间
        /// </summary>
        public string time { get; set; }
        public string grade { get; set; }
        /// <summary>
        /// 学习时长
        /// </summary>
        public string studyLength { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public string status { get; set; }
        public int onlineDuration { get; set; }
    }
    public class StudentTaskInfo
    {
        public int grade { get; set; }
        public int sex { get; set; }
        public int studentNo { get; set; }
    }

    public class StudentClassLogView
    {
        private CourseIdModel course { get { return new CourseIdModel(this.courseId); } }
        public DateTime begin { get; set; } =DateTime.MinValue;
        public DateTime end { get; set; } = DateTime.MinValue;

        public string courseId { get; set; }
        //编号
        public int id { get; set; }
        //上课日期
        public string classDate { get { return course.BeginTime.ToString("yyyy-MM-dd")+"（周"+ course.WeekName + "）"; } }

        /// <summary>
        /// 上课时间
        /// </summary>
        public string classTime { get { return course.BeginTime.ToString("HH:mm")+"~"+ course.EndTime.ToString("HH:mm"); } }
        /// <summary>
        /// 开始时间
        /// </summary>
        public string beginTime { get { return begin==DateTime.MinValue?"-": begin.ToString("HH:mm"); } }
        /// <summary>
        /// 结束时间
        /// </summary>
        public string endTime { get { return end == DateTime.MinValue ? "-" : end.ToString("HH:mm"); } }
        /// <summary>
        /// 上课时长
        /// </summary>
        public string studyTimeCount { get; set; }
        /// <summary>
        /// 有效时长
        /// </summary>
        public int validTimeCount { get; set; }
        /// <summary>
        /// 提问
        /// </summary>
        public int askCount { get; set; }
        /// <summary>
        /// 预警
        /// </summary>
        public int errorCount { get; set; }
        public string status { get; set; }
    }

    public class StudentTaskLogView
    {
        /// <summary>
        /// 编号
        /// </summary>
        public int id { get; set; }
        /// <summary>
        /// 发布时间
        /// </summary>
        public string publishTime { get; set; }
        /// <summary>
        /// 任务名称
        /// </summary>
        public string taskName { get; set; }
        /// <summary>
        /// 任务开始
        /// </summary>
        public string beginTime { get; set; }
        /// <summary>
        /// 任务结束
        /// </summary>

        public string endTime { get; set; }
        /// <summary>
        /// 发布人
        /// </summary>
  
        public string teacherName { get; set; }
        /// <summary>
        /// 完成时间
        /// </summary>
        public string finishTime { get; set; }
        /// <summary>
        /// 用时
        /// </summary>
        public string useTime { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public string status { get; set; }
        public string taskReportArg { get; set; }
 
    }
    public class StudentStudyProgressView
    {
        public int lessonId { get; set; }
        public string subTitle { get; set; }
        public string title { get; set; }
        public int lessonType { get; set; }
        public string beginTime { get; set; } = "-";
        public string endTime { get; set; } = "-";
        public int targetLevel { get; set; }
        /// <summary>
        /// 提升次数
        /// </summary>
        public string advanceCount { get; set; } = "-";
        /// <summary>
        /// 完成次数
        /// </summary>
        public int finishCount { get; set; }
        /// <summary>
        /// 未完成次数
        /// </summary>
        public int otherCount { get; set; }
        public string status { get; set; } = "-";
        public string studyReportArg { get; set; }
        public string taskReportArg { get; set; }
        /// <summary>
        /// 备课状态，0：未备课。1：已备课
        /// </summary>
        public int prepareStatus { get; set; }
        /// <summary>
        /// 解锁状态：0：未解锁，1：已解锁
        /// </summary>
        public int lockStatus { get; set; } = 0;
        public int lessonStatus { get; set; }
        public string lessonStatusName { get { return Enum.GetName(typeof(EnumLessonStatus), this.lessonStatus); } }
    }
    public enum EnumLessonStatus
    {
        未学习,
        学习中,
        已学完,
        未交卷,
        考试中,
        已交卷,
    }
}

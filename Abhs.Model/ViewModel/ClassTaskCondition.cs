using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    public class ClassTaskCondition
    {
        public int schoolId { get; set; }
        public int classId { get; set; }
        public int page { get; set; }
        public int limit { get; set; }
        public string beginTime { get; set; }
        public string endTime { get; set; }
        public string field { get; set; }
        public string order { get; set; }
    }
    public class TaskLogCondition
    {
        public int schoolId { get; set; }
        public int teacherId { get; set; }
        public string teacherName { get; set; }
        public int classId { get; set; }
        public int page { get; set; }
        public int limit { get; set; }
        public string beginTime { get; set; }
        public string endTime { get; set; }
    }
    public class StudentClassLogCondition
    {
        public int schoolId { get; set; }
        public int studentId { get; set; }
        public int classId { get; set; }
        public int page { get; set; }
        public int limit { get; set; }
        public string beginTime { get; set; }
        public string endTime { get; set; }
        public int status { get; set; } = -1;
        public string field { get; set; }
        public string order { get; set; }
    }
    public class StudentUpdateDetailCondition
    {
        public int studentId { get; set; }
        public int lessonId { get; set; }
    }
    public class StudentStudyWrongCondition
    {
        /// <summary>
        /// 学生ID
        /// </summary>
        public int studentId { get; set; }
        public int packId { get; set; }
        public int classId { get; set; }
        /// <summary>
        /// 第几页
        /// </summary>
        public int page { get; set; }
        /// <summary>
        /// 每页多少条
        /// </summary>
        public int pageSize { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public string beginTime { get; set; }
        public string endTime { get; set; }
        /// <summary>
        /// 题型：0全部，1选择，2填空
        /// </summary>
        public int questionType { get; set; }
        /// <summary>
        /// 状态-1全部，1掌握，0未掌握
        /// </summary>
        public int status { get; set; }
        /// <summary>
        /// 错题范围，-1不限制
        /// </summary>
        public int wrongCount { get; set; }
        public List<int> level { get; set; } = new List<int>();
    }
    public class SavePrintLogCondition
    {
        public int schoolId { get; set; }
        public int teacherId { get; set; }
        public int studentId { get; set; }
        public int[] select { get; set; }
        public int[] space { get; set; }
        public int[] answer { get; set; }
    }
}

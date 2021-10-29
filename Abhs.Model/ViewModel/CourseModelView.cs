using Abhs.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    public  class CourseModelView
    {
        /// <summary>
        /// 课程ID
        /// </summary>
        public int id { get; set; }
        /// <summary>
        /// 课程名称
        /// </summary>
        public string courseName { get; set; }
        public string bookName { get; set; }
        public int bookId { get; set; }
        public string gradeIds { get; set; }

    }
    public class CourseGradeYearView
    {
        /// <summary>
        /// 年级数值
        /// </summary>
        public int gradeYearValue { get; set; }
        /// <summary>
        /// 年级名称
        /// </summary>
        public string gradeYearName { get; set; }
        public int courseCount { get; set; } = 0;
    }
    public class CourseInfoView
    {
        /// <summary>
        /// 课程ID
        /// </summary>
        public int id { get; set; }
        /// <summary>
        /// 课程名称
        /// </summary>
        public string courseName { get; set; }
        /// <summary>
        /// 教材名称
        /// </summary>
        public string bookName { get; set; }
        public string cover { get; set; }
        public string gradeIds { get; set; }
        private string _fitGrade;
        /// <summary>
        /// 适用年级
        /// </summary>
        public string fitGrade
        {
            get { return GetGradeName(); }
            set { _fitGrade = value; }
        }
        /// <summary>
        /// 课程负责人
        /// </summary>
        public string courseLeader { get; set; }
        /// <summary>
        /// 课程描述
        /// </summary>
        public string courseContent { get; set; }
        /// <summary>
        /// 学生数量
        /// </summary>
        public string studentCount { get; set; }
        /// <summary>
        /// 已建班级
        /// </summary>
        public string useClass { get; set; }
        public List<PackageFile> fileList { get; set; }
        /// <summary>
        /// 所有课时
        /// </summary>
        public IList<CourseLessonView> lessonList { get; set; }
        
        private string GetGradeName()
        {
            if (!string.IsNullOrEmpty(_fitGrade))
            {
                var arr = _fitGrade.Split(',');
                var sb = new StringBuilder();
                foreach (var item in arr)
                {
                    sb.Append(Enum.GetName(typeof(EnumGradeYear), int.Parse(item)) + ",");
                }
                return sb.ToString().TrimEnd(',');
            }
            return "";
        }
       
    }
    public class PackageFile
    {
        /// <summary>
        /// 课件名称
        /// </summary>
        public string FileName { get; set; }

        /// <summary>
        /// 课件大小
        /// </summary>
        public string FileSize { get; set; }

        /// <summary>
        /// 课件地址
        /// </summary>
        public string FileUrl { get; set; }
    }
    public class CourseLessonView
    {
        /// <summary>
        /// 课程ID
        /// </summary>
        public int courseId { get; set; }
        /// <summary>
        /// 课时ID
        /// </summary>
        public int lessonId { get; set; }
        /// <summary>
        /// 课时名称
        /// </summary>
        public string lessonName { get; set; }
        /// <summary>
        /// 是否开放1：开放，0：不开放
        /// </summary>
        public int isOpen { get; set; }
        /// <summary>
        /// 第几课时
        /// </summary>
        public int index { get; set; }
        /// <summary>
        /// 0：制作中，1制作完成（）
        /// </summary>
        public string statusName { get; set; }
    }
    public class CourseBookModel
    {
        public string courseName { get; set; }
        public string bookName { get; set; }
        public int lessonCount { get; set; }
    }


}

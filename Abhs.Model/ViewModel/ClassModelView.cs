using Abhs.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    public class ClassModelView
    {
        private Dictionary<int,string> dic { get; set; }
        private Dictionary<int, CourseBookModel> cbDic { get; set; }
        public ClassModelView(Dictionary<int, string> dic, Dictionary<int, CourseBookModel> cbDic)
        {
            this.dic = dic;
            this.cbDic = cbDic;
        }
        /// <summary>
        /// 班级ID
        /// </summary>
        public int classId { get; set; }
        /// <summary>
        /// 班级名称
        /// </summary>
        public string className { get; set; }
        /// <summary>
        /// 课程ID
        /// </summary>
        public int courseId { get; set; }
        public int isSelect { get; set; }
        /// <summary>
        /// 课程名称
        /// </summary>
        public string courseName
        {
            get
            {
                if (cbDic.ContainsKey(this.courseId))
                {
                    return cbDic[this.courseId].courseName;
                }
                return "";
            }
        }
        public string bookName
        {
            get
            {
                if (cbDic.ContainsKey(this.courseId))
                {
                    return cbDic[this.courseId].bookName;
                }
                return "";
            }
        }
        public int courseItemCount
        {
            get
            {
                if (cbDic.ContainsKey(this.courseId))
                {
                    return cbDic[this.courseId].lessonCount;
                }
                return 0;
            }
        }
        public DateTime? beginDateTime { get; set; }
        /// <summary>
        /// 开课时间
        /// </summary>
        public string beginDate { get { return beginDateTime != null ? beginDateTime.Value.ToString("yyyy-MM-dd") : ""; } }
        public DateTime? endDateTime { get; set; }
        /// <summary>
        /// 结课时间
        /// </summary>
        public string endDate { get { return endDateTime != null ? endDateTime.Value.ToString("yyyy-MM-dd") : ""; } }
        /// <summary>
        /// 班级状态
        /// </summary>
        public int status { get; set; }
        /// <summary>
        /// 学生人数
        /// </summary>
        public int studentCount { get; set; }
        /// <summary>
        /// 班级课表
        /// </summary>
        public string classTable { get; set; }
        public string statusName { get { return Enum.GetName(typeof(EnumClassStatus), this.status); } }
        public int grade { get; set; }
        public string gradeName { get { return Enum.GetName(typeof(EnumGradeYear), this.grade); } }
        public string teacherIds;
        public string teacher {
            get {
                var str = string.Empty;
                if (!string.IsNullOrEmpty(teacherIds))
                {
                    var arr = teacherIds.Split(',');
                    foreach (var item in arr)
                    {
                        if (dic.ContainsKey(int.Parse(item)))
                        {
                            str = str + dic[int.Parse(item)] + ",";
                        }
                    }
                    if (str.Contains(","))
                        str = str.TrimEnd(',');                
                }
                return str;

            } }
        
    }
    public class SelectMutiple
    {
        public string name { get; set; }
        public int value { get; set; }
    }
}

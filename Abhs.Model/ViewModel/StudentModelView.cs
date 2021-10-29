using Abhs.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
   public  class StudentModelView
    {
        public StudentModelView(Dictionary<int, string> classDic)
        {
            this.classDic = classDic;
        }
        private Dictionary<int, string> classDic { get; set; }
        public int id { get; set; }
        /// <summary>
        /// 学号
        /// </summary>
        public string studentNo { get; set; } = "";
        /// <summary>
        /// 账号
        /// </summary>

        public string userAccount { get; set; }
        /// <summary>
        /// 姓名
        /// </summary>
        public string userName { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public string sexName { get { return Enum.GetName(typeof(EnumSex), sex)??"男"; } }
        public int sex { get; set; }
        /// <summary>
        /// 学段
        /// </summary>
        public string grade
        {
            get
            {
                return Enum.GetName(typeof(EnumGradeSection), gradeId) ?? "";
            }
        } 
        public int gradeId { get; set; }
        public string classId { get; set; }
        public string userHead { get; set; }
        /// <summary>
        /// 班级名称
        /// </summary>
        public string className {
            get {
                var name = string.Empty;
                if (!string.IsNullOrEmpty(this.classId))
                {
                    var sb = new StringBuilder();
                    foreach (var item in this.classId.Split(','))
                    {
                        int key = Convert.ToInt32(item);
                        if (this.classDic.ContainsKey(key))
                        {
                            sb.Append(this.classDic[key]+",");
                        }                      
                    }
                    name = sb.ToString();
                    if (name != null && name.Contains(",")) name = name.TrimEnd(',');
                }
                return name;
            }
        }
        /// <summary>
        /// 金币
        /// </summary>
        public int coin { get; set; }
        /// <summary>
        /// 积分
        /// </summary>
        public int mark { get; set; }
        /// <summary>
        /// 注册时间
        /// </summary>
        public string regTime { get; set; }
        /// <summary>
        /// 到期时间
        /// </summary>
        public string finishTime { get; set; }
        /// <summary>
        /// 最后登录时间
        /// </summary>
        public string lastLoginTime { get; set; }
        public int fromType { get; set; }
        /// <summary>
        /// 来源
        /// </summary>
        public string from { get { return fromType > 0 ? "" : ""; } }
        /// <summary>
        /// 状态
        /// </summary>
        public string statusName { get { return Enum.GetName(typeof(EnumStatus), status); } }
        public int status { get; set; }
        //是否禁用计算训练
        public int moudle { get; set; }
        public int isAble { get {
                if (this.moudle == 0)
                    return 0;
                return (this.moudle& (int)EnumStudentMoudle.计算训练)>0?1:0;
            }
        }
    }
    public class ClassStudentModelView
    {
        public ClassStudentModelView(Dictionary<int, int> lessonDic)
        {
            this.lessonDic = lessonDic;
        }
        private Dictionary<int, int> lessonDic { get; set; }
 
        public int id { get; set; }
        /// <summary>
        /// 学号
        /// </summary>
        public string studentNo { get; set; } = "";
        /// <summary>
        /// 出勤率
        /// </summary>
        public string attendanceRate { get; set; }
        public int lessonId { get; set; }
        /// <summary>
        /// 学习进度
        /// </summary>
        public string studyProcess {
            get
            {
                if (this.lessonDic.ContainsKey(this.lessonId))
                    return $"第{this.lessonDic[this.lessonId]}课时";
                return "";
            }
        }
        /// <summary>
        /// 账号
        /// </summary>

        public string userAccount { get; set; }
        /// <summary>
        /// 姓名
        /// </summary>
        public string userName { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public string sexName { get { return Enum.GetName(typeof(EnumSex), sex)??"男"; } }
        public int sex { get; set; }
        /// <summary>
        /// 学段
        /// </summary>
        public string grade { 

            get {
                return Enum.GetName(typeof(EnumGradeSection), gradeId) ?? "";
            } 
        }
        public int gradeId { get; set; }
        /// <summary>
        /// 金币
        /// </summary>
        public int coin { get; set; }
        /// <summary>
        /// 积分
        /// </summary>
        public int mark { get; set; }
        /// <summary>
        /// 到期时间
        /// </summary>
        public string finishTime { get; set; }
        /// <summary>
        /// 最后登录时间
        /// </summary>
        public string lastLoginTime { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public string statusName { get { return Enum.GetName(typeof(EnumStudentStatus), status); } }
        public int status { get; set; }
        public int classId { get; set; }
        public string createTime { get; set; }
    }
    public class StudentCountView
    {
        public int allotCount { get; set; } = 0;
        public int allotTimeOut { get; set; } = 0;
        public int notAllotCount { get; set; } = 0;
        public int notAllotTimeOut { get; set; } = 0;
    }
    public class SchoolCountView
    {
        public int schoolId { get; set; }
        public string name { get; set; }
        public string manager { get; set; }
        public int count { get; set; }
        public int allCount { get; set; }
    }
}

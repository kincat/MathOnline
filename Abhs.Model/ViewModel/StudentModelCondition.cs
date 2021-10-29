using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    public class StudentModelCondition
    {
        public int schoolId { get; set; }
        public int classId { get; set; }
        /// <summary>
        /// 注册开始时间
        /// </summary>
        public string regBeginDate { get; set; }
        /// <summary>
        /// 注册结束时间
        /// </summary>
        public string regEndDate { get; set; }
       /// <summary>
       /// 到期开始时间
       /// </summary>
        public string finishBeginDate { get; set; }
        /// <summary>
        /// 到期结束时间
        /// </summary>
        public string finishEndDate { get; set; }
        /// <summary>
        /// 搜索关键字
        /// </summary>
        public string key { get; set; }
        /// <summary>
        /// 年级
        /// </summary>
        public string grade { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public string sex { get; set; }
        /// <summary>
        /// 来源
        /// </summary>
        public string source { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public string status { get; set; }
        /// <summary>
        /// 是否分配
        /// </summary>
        public int isAllot { get; set; } = 1;
        public int page { get; set; }
        public int limit { get; set; }
    }

    public class StudentsCondition
    {
        public int schoolId { get; set; }
        public int classId { get; set; }
        //是否包含本班级
        public int isClass { get; set; }
       
        /// <summary>
        /// 搜索关键字
        /// </summary>
        public string key { get; set; }
        /// <summary>
        /// 年级
        /// </summary>
        public int grade { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public int sex { get; set; }
        /// <summary>
        /// 等级
        /// </summary>
        public int level { get; set; }
    }
}

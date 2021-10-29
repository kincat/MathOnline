using Abhs.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    public class PageViewLogCondition
    {
        /// <summary>
        /// 班级ID
        /// </summary>
        public int classId { get; set; }
        /// <summary>
        /// 模块ID
        /// </summary>
        public int modelCode { get; set; }
        /// <summary>
        /// 操作类型：1浏览记录，2：按钮操作记录
        /// </summary>
        public int actionType { get; set; }
        /// <summary>
        /// 具体浏览了什么，操作了什么
        /// </summary>
        public string actionTitle { get; set; }
        /// <summary>
        /// 数据详情
        /// </summary>
        public string actionContent { get; set; }
        /// <summary>
        /// 开始时间
        /// </summary>
        public string beginTime { get; set; }
        /// <summary>
        /// 有效时间
        /// </summary>
        public int validTime { get; set; }

        public int teacherId { get; set; }
        public string teacherName { get; set; }
        public int schoolId { get; set; }
        public int packId{ get; set; }
        public int lessonId { get; set; }
        //子模块ID
        public int subModel { get; set; }
       // public string SubModelName { get { return Enum.GetName(typeof(PreppareTypeEnum), this.SubModel); } }
       public string userAgent { get; set; }
        public string flagId { get; set; }

    }
}

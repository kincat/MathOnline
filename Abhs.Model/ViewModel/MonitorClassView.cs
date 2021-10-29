using Abhs.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    public class MonitorStudentView : IEquatable<MonitorStudentView>
    { 
        /// <summary>
        /// 学生ID
        /// </summary>
        public int StudentID { get; set; }

        /// <summary>
        /// 学生名字
        /// </summary>
        public string StudentName { get; set; } = "";

        /// <summary>
        /// 星级
        /// </summary>
        public int Level { get; set; } = 0;

        /// <summary>
        /// 最后一次学习动作描述比如:正在学习 第一课时 有理数
        /// </summary>
        public string LastStudyDesc { get; set; } = "";

        /// <summary>
        /// 正确率百分比,精确到小数点后1位. 
        /// 比如: 32代表正确率32%
        /// </summary>
        public int Accuracy { get; set; } = 0;
        
        /// <summary>
        /// 总题数
        /// </summary>
        public int AllAnswerCount { get; set; } = 0;

        /// <summary>
        /// 未作答题数,可以跳过的
        /// </summary>
        public int NoAnswerCount { get; set; } = 0;

        /// <summary>
        /// 错误作答题数
        /// </summary>
        public int ErrAnswerCount { get; set; } = 0;

        /// <summary>
        /// 预警总数量
        /// </summary>
        public int WarningCount { get; set; } = 0;

        /// <summary>
        /// 首次在线时间
        /// </summary>
        public DateTime FirstOnlineTime { get; set; } = DateTime.MinValue;

        /// <summary>
        /// 最后在线时间
        /// </summary>
        public DateTime LastOnlineTime { get; set; } = DateTime.MinValue;

        /// <summary>
        /// 加入在线记录
        /// </summary>
        public void AddOnLine()
        {
            // 在线列表
            if (OnLineList == null)
            {
                OnLineList = new List<OnLineTime>();
            }

            // 加入在线记录
            OnLineList.Add(new OnLineTime { OnLineBeginTime = DateTime.Now, OnLineEndTime = DateTime.Now , OnTimeCount = 0});
        }

        /// <summary>
        /// 更新在线记录
        /// </summary>
        public void UpDataOnLine()
        {
            if (OnLineList != null)
            {
                var lastOnline = OnLineList[OnLineList.Count - 1] ;
                lastOnline.OnLineEndTime = DateTime.Now;
                lastOnline.OnTimeCount = lastOnline.OnLineEndTime.Subtract(lastOnline.OnLineBeginTime).TotalSeconds;
            }
        }

        /// <summary>
        /// 在线记录
        /// </summary>
        public List<OnLineTime> OnLineList { get; set; }

        public bool Equals(MonitorStudentView other)
        {
            throw new NotImplementedException();
        }
    }


    /// <summary>
    /// 在线记录
    /// </summary>
    public class OnLineTime
    {
        public DateTime OnLineBeginTime { get; set; }
        public DateTime OnLineEndTime { get; set; }
        public double OnTimeCount { get; set; }
    }

    /// <summary>
    /// 学生模块持续在线明细
    /// </summary>
    public class UserKeepLive
    {
        public int StudentID { get; set; }
        /// <summary>
        /// 大模块分类 ( 1 智能学习,2 智能提升,3智能作业, 4错题巩固,5 思维训练,6计算训练)	
        /// </summary>
        public int ModuleType { get; set; }
        /// <summary>
        /// 具体细分模块ID（主要是课时ID）
        /// </summary>
        public int ItemID { get; set; } = 0;
        /// <summary>
        /// 课时模块ID
        /// </summary>
        public int ItemType { get; set; } = 0;
        /// <summary>
        /// 模块开始时间
        /// </summary>
        public DateTime BeginTime { get; set; }
        /// <summary>
        /// 模块结束时间
        /// </summary>
        public DateTime EndTime { get; set; }

        /// <summary>
        /// 是否是离线重算的标识
        /// </summary>
        public bool IsOnline { get; set; } = true;

    }
    public class ClassGoldView
    {
        public string courseId { get; set; }
        public int schoolId { get; set; }
        public int studentId { get; set; }
        public int classId { get; set; }
        public int gold { get; set; }
        public DateTime createTime { get; set; }
        public string remark { get; set; }
        public int teacherId { get; set; }
        public int isSend { get; set; }
        public string flag { get; set; }
    }
}

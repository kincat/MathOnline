using Abhs.Application.IService;
using Abhs.Application.IService.Business;
using Abhs.Cache.Redis;
using Abhs.Common;
using Abhs.Common.Enums;
using Abhs.Common.Extend;
using Abhs.Model.Access;
using Abhs.Model.Common;
using Abhs.Model.Model;
using Abhs.Model.MonitorMiddle;
using Abhs.Model.ViewModel;
using StructureMap.Attributes;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Abhs.Common.Enums.SysModel;

namespace Abhs.Application.Service.Business
{
    public class KeepLiveService : IKeepLiveService
    {
        [SetterProperty]
        public IMessageService messageService { get; set; }

        [SetterProperty]
        public IStudentService studentService { get; set; }

        /// <summary>
        /// 学生心跳
        /// 1.设置学生课中状态 MonitorStudentView
        /// 2.增加学生在线模块位置轨迹 UserKeepLive
        /// 3.返回老师反馈给学生的信息 StudentNotice
        /// </summary>
        /// <param name="condition"></param>
        public List<StudentNotice> StudentHeart(StudentHeartCondition condition)
        {
            List<StudentNotice> sn = new List<StudentNotice>();
            string logmark = Guid.NewGuid().ToString();

            // 获取学生
            var student = studentService.GetModelCacheById(condition.student_id);      

            // 设置学生在线时间
            SetMonitorStudent(student, condition);

            // 得到发给学生的信息
            var notice = messageService.GetNotice(student);
            if (notice != null && notice.Count > 0)
            {
                sn.AddRange(notice);
            }

            return sn;
        }

        /// <summary>
        /// 设置课中学生状态
        /// </summary>
        /// <param name="mmClass"></param>
        /// <param name="student"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        private void SetMonitorStudent(BasStudent student, StudentHeartCondition condition)
        {
            // 获取今日学生信息
            var studenInfo = studentService.GetMonitorStudent(student.s_ID);

            // 没有课中信息 说明学生是在本课中第一次发心跳 则新建课中信息
            if (studenInfo == null)
            {
                //心跳监测模型
                studenInfo = new StudyModel();
                studenInfo.Level = PublicKey.STUDENT_LEVEL;
                studenInfo.StudentID = student.s_ID;
                studenInfo.StudentName = student.s_Name;
                studenInfo.LastStudyDesc = (condition.student_position ?? "") + (condition.student_action ?? "");
                studenInfo.FirstOnlineTime = DateTime.Now;
                studenInfo.LastOnlineTime = DateTime.Now;
                studenInfo.AddOnLine();
                studentService.SetMonitorStudent(studenInfo);
            }
            else
            {
                studenInfo.LastStudyDesc = (condition.student_position ?? "") + (condition.student_action ?? "");

                // 判断离线(超过30秒没有发送任何在线心跳)
                if (DateTime.Now.AddSeconds(-PublicKey.STUDENT_OFFLINE_TIME) > studenInfo.LastOnlineTime)
                {
                    studenInfo.AddOnLine();
                }
                else
                {
                    studenInfo.UpDataOnLine();
                }

                studenInfo.LastOnlineTime = DateTime.Now;

                studentService.SetMonitorStudent(studenInfo);
            }        
        }      

    }
}

using Abhs.Application.IService;
using Abhs.Cache.Redis;
using Abhs.Common.Enums;
using Abhs.Data.Repository;
using Abhs.Model.Access;
using Abhs.Model.Common;
using Abhs.Model.Model;
using Abhs.Model.MonitorMiddle;
using Abhs.Model.ViewModel;
using StructureMap.Attributes;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.Service
{
    public class StudentService : IStudentService
    {
        [SetterProperty]
        public IRepositoryBase<BasStudent> studentDAL { get; set; }
      
        public BasStudent FindEntity(object pk)
        {
            return studentDAL.FindEntity(pk);
        }
        public IQueryable<BasStudent> Queryable()
        {
            return studentDAL.IQueryable();
        }
                
        /// <summary>
        /// 获取学生信息
        /// </summary>
        /// <param name="studentId"></param>
        /// <returns></returns>
        public BasStudent GetModelCacheById(int studentId)
        {
            var student = this.Queryable().FirstOrDefault(x => x.s_ID == studentId);
            return student;
        }

        /// <summary>
        /// 获取学生当天的上课信息
        /// </summary>
        /// <param name="studentId"></param>
        /// <returns></returns>
        public StudyModel GetMonitorStudent(int studentId)
        {
            return RedisUtil.Instance.Get<StudyModel>(PublicKey.HASHKEY_MONITOR_CLASS_STUDENT + ":" + DateTime.Today.ToString("yyyy-MM-dd") + "_" + studentId);
        }

        /// <summary>
        /// 设置学生当天的上课信息
        /// </summary>
        /// <param name="student"></param>
        /// <returns></returns>
        public void SetMonitorStudent(StudyModel student)
        {
            RedisUtil.Instance.Set(PublicKey.HASHKEY_MONITOR_CLASS_STUDENT + ":" + DateTime.Today.ToString("yyyy-MM-dd") + "_" + student.StudentID, student);
        }
    }
}

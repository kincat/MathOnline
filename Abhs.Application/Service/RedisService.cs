using Abhs.Cache.Redis;
using Abhs.Common;
using Abhs.Common.Enums;
using Abhs.Model.Access;
using Abhs.Model.Common;
using Abhs.Model.MonitorMiddle;
using Abhs.Model.RedisModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.Service
{
    public class RedisService
    {
        private static int maxTime = 60 * 60 * 48;
        private static RedisService _service;
        //private static readonly object locker = new object();
        public static RedisService Instance()
        {
            if (_service == null)
            {
                _service = new RedisService();
            }

            return _service;
        }
        private List<T> GetAllData<T>(string hashKey)
        {
            return RedisUtil.Instance.HGetAll<T>(hashKey);
        }

        #region package 修改完成

        public void SetPackageCache<T>(int packId, T t)
        {
            RedisUtil.Instance.HSet<T>(PublicKey.HASHKEY_PACKAGE, string.Format(PublicKey.KEY_PACKAGE, packId), t, maxTime);
        }
        public T GetPackage<T>(int packId)
        {
            string key = PublicKey.KEY_PACKAGE.Replace("{0}", packId.ToString());
            return  RedisUtil.Instance.HGet<T>(PublicKey.HASHKEY_PACKAGE, key);
        }

        #endregion

        #region packageLesson 修改完成
        public List<T> GetAllPackageLessonData<T>()
        {
            return GetAllData<T>(PublicKey.HASHKEY_PACKAGELESSON);
        }
        public void SetPackageLessonCache<T>(int lessonId, T t)
        {
            RedisUtil.Instance.HSet<T>(PublicKey.HASHKEY_PACKAGELESSON, string.Format(PublicKey.KEY_PACKAGELESSON,lessonId), t, maxTime);
        }
        public T GetPackageLesson<T>(int lessonId)
        {
            string key = PublicKey.KEY_PACKAGELESSON.Replace("{0}",lessonId.ToString());
            return RedisUtil.Instance.HGet<T>(PublicKey.HASHKEY_PACKAGELESSON, key);
          
        }
      
        #endregion

        #region packageLessonItem
        public void SetPackageLessonItemCache<T>(int itemId, T t)
        {
            RedisUtil.Instance.HSet<T>(PublicKey.HASHKEY_PACKAGELESSONITEM, string.Format(PublicKey.KEY_PACKAGELESSONITEM,itemId), t, maxTime);
        }
 
         public T GetPackageLessonItem<T>(int itemId)
        {
            string key = PublicKey.KEY_PACKAGELESSONITEM.Replace("{0}", itemId.ToString());
            return RedisUtil.Instance.HGet<T>(PublicKey.HASHKEY_PACKAGELESSONITEM, key); 
        }

        #endregion        
        
        #region 课中金币
        public List<T> GetClassGoldList<T>(int schoolId)
        {
            return RedisUtil.Instance.HGetAll<T>(string.Format(PublicKey.HASHKEY_MONITOR_CLASS_GOLD,schoolId));
        }
        public List<T> GetClassGoldNoticeList<T>(int schoolId)
        {
            return RedisUtil.Instance.HGetAll<T>(string.Format(PublicKey.HASHKEY_MONITOR_CLASS_GOLD_NOTICE, schoolId));
        }
        public void SetClassGold<T>(int schoolId,string flag, T t)
        {
            RedisUtil.Instance.HSet<T>(string.Format(PublicKey.HASHKEY_MONITOR_CLASS_GOLD, schoolId), string.Format(PublicKey.KEY_MONITOR_CLASS_GOLD, flag), t,10);
            RedisUtil.Instance.HSet<T>(string.Format(PublicKey.HASHKEY_MONITOR_CLASS_GOLD_NOTICE, schoolId), string.Format(PublicKey.KEY_MONITOR_CLASS_GOLD_NOTICE, flag), t, 5);
        }
        public void RemoveClassGold(int schoolId,string flag)
        {
            RedisUtil.Instance.HDel(string.Format(PublicKey.HASHKEY_MONITOR_CLASS_GOLD, schoolId), string.Format(PublicKey.KEY_MONITOR_CLASS_GOLD, flag));
        }
        #endregion

        #region 课中监测学生心跳
        public void SetStudentKeepLiveCache<T>(string courseId, int stuId, T t)
        {
            RedisUtil.Instance.HSet<T>(PublicKey.HASHKEY_STUDENT_KEEPLIVE, string.Format(PublicKey.KEY_STUDENT_KEEPLIVE, courseId, stuId), t, maxTime);
        }
        public void RemoveStudentKeepLive(List<string> keys)
        {
            foreach (var key in keys)
            {
                RedisUtil.Instance.HDel(PublicKey.HASHKEY_STUDENT_KEEPLIVE, key);
            }          
        }

        /// <summary>
        /// 获取正在线数据列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="courseId"></param>
        /// <param name="stuId"></param>
        /// <returns></returns>
        public T GetStudentKeepLive<T>(string courseId, int stuId)
        {
            string key =string.Format(PublicKey.KEY_STUDENT_KEEPLIVE, courseId, stuId.ToString());
            return RedisUtil.Instance.HGet<T>(PublicKey.HASHKEY_STUDENT_KEEPLIVE, key);
        }

        #endregion  
 

        #region 消息分组

        /// <summary>
        /// 分到学生学习列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="studentId"></param>
        /// <param name="messageId"></param>
        /// <param name="t"></param>
        public void SetStudentMessage<T>(int studentId, string messageId, T t)
        {
            string hashkey = String.Format(PublicKey.HASHKEY_MESSAGE_STUDENT, DateTime.Today.ToString("yyyy-MM-dd") ,studentId);
            RedisUtil.Instance.HSet<T>(hashkey, messageId, t, 60 * 60 * 24);
        }

        #endregion

        #region 课中消息获取

        public List<math_message_request> GetStudentMessages(string key)
        {
            return RedisUtil.Instance.HScanList<math_message_request>(key, "*");
        }


        #endregion
       
        public List<T> GetAllMonitorStudent<T>()
        {
            return GetAllData<T>(PublicKey.HASHKEY_MONITOR_STUDENT);
        }
        public void RemoveMonitorStudent(int studentId)
        {
            RedisUtil.Instance.HDel(PublicKey.HASHKEY_MONITOR_STUDENT, string.Format(PublicKey.KEY_MONITOR_STUDENT, studentId));
        }



        

        #region 清理策略
        public void ClearRedisByDay()
        {

            //清理课程
            RedisUtil.Instance.HDel(PublicKey.HASHKEY_PACKAGE);
            //清理课时
            RedisUtil.Instance.HDel(PublicKey.HASHKEY_PACKAGELESSON);
            //清理课时内容
            RedisUtil.Instance.HDel(PublicKey.HASHKEY_PACKAGELESSONITEM);
            //清理学生
            RedisUtil.Instance.HDel(PublicKey.KEY_USER_STUDENT);

        }   

        #endregion
                

        #region 题型相关缓存

        public T GetSysQuestionMarkByCode<T>(string code)
        {
            return RedisUtil.Instance.HGet<T>(PublicKey.HASHKEY_QUESTION_LIB, string.Format(PublicKey.KEY_SYSQUESTIONMARK, code));
        }

        public void SetSysQuestionMarkByCode<T>(string code, T t)
        {
            RedisUtil.Instance.HSet<T>(PublicKey.HASHKEY_QUESTION_LIB, string.Format(PublicKey.KEY_SYSQUESTIONMARK, code), t);
        }


        #endregion
    }
}

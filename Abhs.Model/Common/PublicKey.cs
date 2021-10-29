using Abhs.Common.Enums;
using Abhs.Common.Extend;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.Common
{
    public abstract class PublicKey
    {
        public const string CLASSPRE = "cla_";
        public const string STUDENTPRE = "s_";
        public const string RELATIONPRE = "r_";
        public const string MMCPRE =  "mmc_";
        public const string MMSPRE = "mms_";
        public const string OPPRE = "op_";
        public const string LOGPRE = "log_";
        public const string ACTPRE = "act_";
        public const string PREPAREPRE = "p_";
        public const string TABLEPRE = "tab_";
        public const string TPPRE = "tp_";
        public const string TASK = "tc_";
        public const string PRINTLOG = "eql_";
        public const string GOLD = "gd_";
        public const string HOST = "school.ailianmath.com";
        public const string NEWHOST = "mathschool.abhseducation.com";
        public const string CLASSNAME = "{CLASSNAME}";
        public const string STUDENTNAME = "{STUDENTNAME}";
        /// <summary>
        /// 接口返回值
        /// </summary>
        public const int SUCCESS_CODE = 200;
        public const int FAIL_CODE = 500;
        public const int TIME_OUT = -1;

        public const int SUCCESS_REGISTER = 2001;
        public const int SUCCESS_LOGIN = 2002;

        /// <summary>
        /// 迟到5分钟算迟到
        /// </summary>
        public const int MINUTES = 10;

        /// <summary>
        /// 备课模块星级抽取题数
        /// </summary>
        public const int QUESTION_COUNT = 1;

        /// <summary>
        /// 最大登录次数
        /// </summary>
        public const int MAX_LOGIN_COUNT = 5;

        /// <summary>
        /// 达到最大登录失败次数等待时长
        /// </summary>
        public const int MAX_LOGIN_WAIT = 180;


        /// <summary>
        /// 学生默认头像
        /// </summary>
        public const string STUDENT_PHOTO = "/Content/images/userimg.png";
        public const string STUDENT_GIRL_PHOTO = "/Content/images/girl.png";
        public const string STUDENT_BOY_PHOTO = "/Content/images/boy.png";
        public const string TEACHER_MALE_PHOTO = "/Content/images/male.png";
        public const string TEACHER_FEMALE_PHOTO = "/Content/images/female.png";

        /// <summary>
        /// 默认学生3星
        /// </summary>
        public const int STUDENT_LEVEL = 3;
        public const string HEADIMAGE_DEFAULT = "/Content/images/userimg.png";
        /// <summary>
        /// 学生离线时间多少秒设置为离线
        /// </summary>
        public const int STUDENT_OFFLINE_TIME = 60;
        /// <summary>
        /// 提前0分钟记录心跳
        /// </summary>
        public const int BEFORETIME = 0;
        //默认分页条数
        public const int PAGESIZE = 15;
        /// <summary>
        /// 小于这个天数就提示过期
        /// </summary>
        public const int MIN_DAY = 10;

        /// <summary>
        /// 学生的学习数据
        /// </summary>
        public const string HASHKEY_MESSAGE_STUDENT  = "HASHKEY_MESSAGE_STUDENT:{0}_{1}";

        /// <summary>
        /// 缓存清理最后执行时间
        /// </summary>
        public const string HASHKEY_TASKEXECTIME = "HASHKEY_TASKEXEC_TIME";      

        /// <summary>
        /// 按天清理的任务执行时间
        /// </summary>
        public const string KEY_CLEAR_DAY = "KEY_CLEAR_DAY";

        /// <summary>
        /// 课程缓存key
        /// </summary>
        public const string HASHKEY_PACKAGE = "HASHKEY_PACKAGE";
        /// <summary>
        /// 课程缓存key，{0}课程ID,
        /// </summary>
        public const string KEY_PACKAGE = "KEY_PACKAGE_{0}";
        /// <summary>
        /// 课时缓存key
        /// </summary>
        public const string HASHKEY_PACKAGELESSON = "HASHKEY_PACKAGELESSON";
        /// <summary>
        /// 课时缓存key，{0}课时ID
        /// </summary>
        public const string KEY_PACKAGELESSON = "KEY_PACKAGELESSON_{0}";
        /// <summary>
        /// 课时内容缓存key
        /// </summary>
        public const string HASHKEY_PACKAGELESSONITEM = "HASHKEY_PACKAGELESSONITEM";
        /// <summary>
        /// 课时内容缓存key，{0}内容ID
        /// </summary>
        public const string KEY_PACKAGELESSONITEM = "KEY_PACKAGELESSONITEM_{0}";

        /// <summary>
        /// 课中级学生缓存key
        /// </summary>
        public const string HASHKEY_MONITOR_CLASS_STUDENT = "HASHKEY_MONITOR_CLASS_STUDENT";

        /// <summary>
        /// 学生缓存key
        /// </summary>
        public const string HASHKEY_USER_STUDENT = "HASHKEY_USER_STUDENT";

        /// <summary>
        /// 学生缓存key{0}学生ID
        /// </summary>
        public const string KEY_USER_STUDENT = "KEY_USER_STUDENT_{0}";
 
        /// <summary>
        /// 课中金币{0}courseID
        /// </summary>
        public const string HASHKEY_MONITOR_CLASS_GOLD = "HASHKEY_MONITOR_CLASS_GOLD_{0}";
        /// <summary>
        /// 课中金币缓存{0}courseID
        /// </summary>
        public const string KEY_MONITOR_CLASS_GOLD = "KEY_MONITOR_CLASS_GOLD_{0}";
        /// <summary>
        /// 课中金币{0}courseID
        /// </summary>
        public const string HASHKEY_MONITOR_CLASS_GOLD_NOTICE = "HASHKEY_MONITOR_CLASS_GOLD_NOTICE_{0}";
        /// <summary>
        /// 通知
        /// </summary>
        public const string KEY_MONITOR_CLASS_GOLD_NOTICE = "KEY_MONITOR_CLASS_GOLD_NOTICE_{0}";
        /// <summary>
        /// 课中班级学生心跳缓存key{0}学校ID，{1}班级ID,{2}学生ID
        /// </summary>
        public const string HASHKEY_STUDENT_KEEPLIVE = "HASHKEY_STUDENT_KEEPLIVE";
        /// <summary>
        /// 课中班级学生心跳缓存key{0} 课表ID{1}学生ID
        /// </summary>
        public const string KEY_STUDENT_KEEPLIVE = "KEY_STUDENT_KEEPLIVE_{0}_{1}";

        /// <summary>
        /// 缓存题库，已经审核的
        /// </summary>
        public const string HASHKEY_QUESTION_LIB = "HASHKEY_QUESTION_LIB";
        /// <summary>
        /// {0}id
        /// </summary>
        public const string KEY_QUESTION_LIB = "KEY_QUESTION_LIB_{0}";
        /// <summary>
        /// monitorHash
        /// </summary>
        public const string HASHKEY_MONITOR_STUDENT = "HASHKEY_MONITOR_STUDENT";
        /// <summary>
        /// monitorkey
        /// </summary>
        public const string KEY_MONITOR_STUDENT = "KEY_MONITOR_STUDENT_{0}";

        /// <summary>
        /// 题型 hashkey
        /// </summary>
        public const string HASHKEY_SYSQUESTIONMARK = "HASHKEY_SYSQUESTIONMARK";

        /// <summary>
        /// 具体的题型code 的key ,都是type为3且状态为1 的
        /// </summary>
        public const string KEY_SYSQUESTIONMARK = "QM_{0}";

        #region 消息相关key
        
        //{0} studentid {1}messageid
        public const string KEY_MESSAGE_STUDENT = "KEY_MESSAGE_STUDENT:{0}:{1}";

        /// <summary>
        /// 完整的消息队列
        /// </summary>
        public const string KEY_MATHMESSAGE_FULL = "mathmessage:full";

        #endregion      

    }
    public abstract class PublicData
    {
        public static string GetStudentPhoto(int sex)
        {
            if (sex == (int)EnumSex.女)
            {
                return PublicKey.STUDENT_GIRL_PHOTO;
            }
            else
            {
                return PublicKey.STUDENT_BOY_PHOTO;
            }
        }
    }
    
}



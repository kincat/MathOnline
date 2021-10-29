using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abhs.Application.IService;
using Abhs.Model.MonitorMiddle;
using Abhs.Cache.Redis;
using Abhs.Common;
using System.Threading;
using Abhs.Model.ViewModel;
using Abhs.Model.Access;
using StructureMap.Attributes;
using Abhs.Model.Common;
using Abhs.Application.IService.Business;
using Abhs.ES;
using Newtonsoft.Json;
using Abhs.Model.Model;

namespace Abhs.Application.Service
{
    public class MessageService : IMessageService
    {
        #region 服务注入区域

        [SetterProperty]
        public IStudentService studentService { get; set; }

        [SetterProperty]
        public IPackagesService packageService { get; set; }

        [SetterProperty]
        public IPackageLessonService packageLessonService { get; set; }

        [SetterProperty]
        public IPackageLessonItemsService packageLessonItemsService { get; set; }

        [SetterProperty]
        public IQuestionMarkService questionMarkService { get; set; }


        #endregion

        /// <summary>
        /// 用于接收来自学生端产生的消息
        /// </summary>
        /// <param name="req"></param>
        public void AddMessage(message_for_student req)
        {
            var message = BuildMessage(req, studentService.GetModelCacheById(req.student_id));

            // 将消息分类存储到Hash结构中,学生为单位
            RedisService.Instance().SetStudentMessage(message.student_id,message.message_id, message);


            //更新在线学生的提问和预警数量
            var studentStudy = studentService.GetMonitorStudent(message.student_id);


            #region 更新StudyModel

            if (studentStudy != null)
            {
                // 预警
                if (message.message_type == 2)
                {
                    studentStudy.WarningCount++;
                }

                // 学情
                if (message.message_type == 4)
                {
                    if (message.module_type != (int)EnumModuleType.奖励金币)
                    {
                        SpecContent specContent = JsonConvert.DeserializeObject<SpecContent>(message.message_content);

                        studentStudy.AllAnswerCount += specContent.AllCount;
                        studentStudy.NoAnswerCount += specContent.NullCount;
                        studentStudy.ErrAnswerCount += specContent.ErrCount;
         
                        //计算正确率
                        int rightCount = studentStudy.AllAnswerCount - studentStudy.NoAnswerCount - studentStudy.ErrAnswerCount;
                        studentStudy.Accuracy = Convert.ToInt32(((double)rightCount / studentStudy.AllAnswerCount) * 100);                        
                    }
                }

                // 设置学生当天的上课信息
                studentService.SetMonitorStudent(studentStudy);
            }

            #endregion


            //完整消息主队列【队列中数据将由服务异步同步到ES】. 
            RedisUtil.Instance.RInListGp(PublicKey.KEY_MATHMESSAGE_FULL, message);
        }

        /// <summary>
        /// 数据转换
        /// </summary>
        /// <param name="model"></param>
        /// <param name="student"></param>
        /// <returns></returns>
        private math_message_request BuildMessage(message_for_student model, BasStudent student)
        {
            math_message_request message = new math_message_request();
            message.day = DateTime.Today.ToString("yyyyMMdd");

            //消息id
            message.message_id = Guid.NewGuid().ToString();
            message.create_time = DateTime.Now;

            message.reporturl = model.reporturl;
            message.evaluate_jsoncontent = model.evaluate_jsoncontent;
            message.action_type = model.action_type;
            message.warning_type = model.warning_type;
            //学生
            message.student_id = model.student_id;
            message.student_name = student.s_Name;
            message.level = PublicKey.STUDENT_LEVEL;
            message.head = PublicData.GetStudentPhoto(student.s_Sex ?? 0) ;

            //消息类型 1 提问 2 预警 3其它	
            message.message_type = model.message_type;
            message.message_typename = Enum.GetName(typeof(EnumMessageType), model.message_type);

            //消息标题 内容
            message.message_title = model.message_title;
            message.message_content = model.message_content;

            //大模块分类 ( 1 智能学习,2 智能提升,3 智能作业, 4课后任务,5 错题订正,6 今日错题 7 查看报告 8 计算训练 9 登录 10 退出)	
            message.module_type = model.module_type;
            if (model.module_type > 0)
            {
                message.module_name = Enum.GetName(typeof(EnumModuleType), model.module_type);
            }
            else
            {
                message.module_name = "";
            }

            //课时模块类别 (1.错题巩固 2 基础检测 3 课时介绍 4视频学习 5 典例训练 6 查漏补缺 7 基础学习[智能作业] 8 错题复习[智能作业] 9 答卷测试[智能作业] 10 训练场[计算训练] 11 闯关[计算训练] ))	
            if (model.lesson_module_type.HasValue)
            {
                message.lesson_module_type = model.lesson_module_type.Value;
                if (model.lesson_module_type > 0)
                {
                    message.lesson_module_typename = Enum.GetName(typeof(EnumLessonModuleType), model.lesson_module_type);
                }
                else
                {
                    message.lesson_module_typename = "";
                }
            }
            else
            {
                message.lesson_module_type = 0;
                message.lesson_module_typename = "";
            }


            //课程 redis
            if (model.package_id.HasValue)
            {
                message.package_id = model.package_id.Value;
                if (model.package_id > 0)
                {
                    var packageModel = packageService.GetModelByCache(model.package_id.Value);
                    message.package_name = packageModel.sp_Name;
                }
                else
                {
                    message.package_name = "";
                }
            }
            else
            {
                message.package_id = 0;
                message.package_name = "";
            }

            //课时
            if (model.lesson_id.HasValue)
            {
                message.lesson_id = model.lesson_id.Value;
                if (model.lesson_id > 0)
                {
                    var lessonModel = packageLessonService.GetModelByCache(model.lesson_id.Value);
                    message.lesson_name = lessonModel.spl_Name;
                    message.lesson_index = lessonModel.spl_Index;
                }
                else
                {
                    message.lesson_name = "";
                }
            }
            else
            {
                message.lesson_id = 0;
                message.lesson_name = "";
            }

            //课时内容ID
            if (model.lesson_itemid.HasValue)
            {
                message.lesson_itemid = model.lesson_itemid.Value;
                if (model.lesson_itemid > 0)
                {
                    var lessonItemModel = packageLessonItemsService.GetModelByCache(model.lesson_itemid.Value);
                    message.lesson_itemname = lessonItemModel.spk_Name;
                }
                else
                {
                    message.lesson_itemname = "";
                }
            }

            //题型
            message.question_typecode = model.question_typecode;
            if (!string.IsNullOrEmpty(model.question_typecode))
            {
                var questionMark = questionMarkService.QueryQMName(model.question_typecode);
                message.question_typename = questionMark.m_Name;
            }
            else
            {
                message.question_typename = "";
            }

            return message;
        }



        /// <summary>
        /// 获取今日要发给学生的信息【提醒 呼叫, 表扬】
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        public List<StudentNotice> GetNotice(BasStudent form)
        {
            string key = String.Format("studentmsg:{0}:{1}", form.s_ID, DateTime.Today.ToString("yyyy-MM-dd"));

            List<StudentNotice> notice = RedisUtil.Instance.GetAllList<StudentNotice>(key);
            if (notice == null)
            {
                return new List<StudentNotice>();
            }
            return notice;

        }


        /// <summary>
        /// 获取学生的学情
        /// </summary>
        /// <param name="studentId"></param>
        /// <returns></returns>
        public List<math_message_request> GetStudentMessages(int studentId)
        {
            string day = DateTime.Today.ToString("yyyy-MM-dd");


            string hashkey = String.Format(PublicKey.HASHKEY_MESSAGE_STUDENT, day, studentId);

            List<math_message_request> studentMsg = RedisService.Instance().GetStudentMessages(hashkey);
            //倒序,时间越新越靠前
            studentMsg.Sort((x, y) => y.create_time.CompareTo(x.create_time));

            return studentMsg;
        }

        /// <summary>
        /// 查询该班级下单个学生的最新消息, 需要传一个上次最新消息的ID,以此来分隔最新的消息
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        public List<math_message_request> GetNewMessageByStudent(int studentId, string newestMsgId)
        {
            List<math_message_request> studentMsg = GetStudentMessages(studentId);

            List<math_message_request> result = new List<math_message_request>();

            foreach (var msg in studentMsg)
            {
                if (msg.message_id == newestMsgId)
                {
                    break;
                }
                result.Add(msg);
            }

            return result;
        }
    }
}

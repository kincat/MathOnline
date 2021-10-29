using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Abhs.Application;
using Abhs.Application.Service;
using System.Web.Http.Description;
using System.Web.Http.Cors;
using Abhs.Model.MonitorMiddle;
using Abhs.Web.Filters;
using Abhs.Web.Common;
using Abhs.Application.IService;
using StructureMap.Attributes;
using Abhs.Model.ViewModel;
using Abhs.Application.IService.Business;
using Abhs.Common;
using Abhs.ES;
using System.Web;
using Abhs.Model.Common;

namespace Abhs.Web.Controllers
{
    //启用跨域请求
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MessageController : ApiController
    {
        #region 注入方法区

        [SetterProperty]
        public IMessageService msgService { get; set; }

        [SetterProperty]
        public IKeepLiveService keepLiveService { get; set; }

        [SetterProperty]
        public IStudentService studentService { get; set; }

        [SetterProperty]
        public IWeChatBindService weChatBindService { get; set; }

        #endregion



        /// <summary>
        /// 客户端提交消息
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/message/pushmessage")]
        public IHttpActionResult PushMessage(message_for_student message)
        {
            //将消息加入redis队列
            msgService.AddMessage(message);

            //直接返回
            return new MathResponse(new { result = "OK" });
        }

        //获取该班级下的某个学生的消息
        [HttpPost]
        [Route("api/message/getstudentmsg")]
        public IHttpActionResult GetStudentMsg(int studentId)
        {
            return new MathResponse(new { result = msgService.GetStudentMessages(studentId) });
        }

        //获取该班级下的某个学生的最新的消息
        [HttpPost]
        [Route("api/message/getstudentnewmsg")]
        public IHttpActionResult GetStudentNewMsg(int studentId, string newestMsgId)
        {
            return new MathResponse(new { result = msgService.GetNewMessageByStudent(studentId, newestMsgId) });
        }

        //小程序登录
        [Route("api/message/mathhomelogin")]
        [HttpPost]
        public IHttpActionResult MathHomeLogin(string code)
        {
            var s = Tools.HttpGet("https://api.weixin.qq.com/sns/jscode2session?appid=wx0f0ac6e33d9c71ef&secret=05af3dbe631b78259235c745d5acb8e6&js_code=" + code + " &grant_type=authorization_code");

            var openId = "testOpenId";

            // 得到绑定数据
            var weChat = weChatBindService.GetWeChatBindByOpenId(openId);
            if (weChat == null)
            {
                var token = weChatBindService.AddWeChatBind(openId, "t1");

                if (!string.IsNullOrEmpty(token))
                {
                    return new MathResponse(PublicKey.SUCCESS_REGISTER, "注册成功！", token);
                }
                else
                {
                    return new MathResponse(PublicKey.FAIL_CODE, "注册失败！", "");
                }
            }
            else
            {
                // 已经绑定了学生
                if (weChat.uc_BindStudentId > 0)
                {
                    return new MathResponse(PublicKey.SUCCESS_LOGIN, "登录成功！", weChat.uc_Token);
                }
                else
                {
                    return new MathResponse(PublicKey.SUCCESS_REGISTER, "注册成功！", weChat.uc_Token);

                }
            }
        }

        //小程序校验
        [Route("api/message/mathhomebind")]
        [HttpPost]
        public IHttpActionResult MathHomeBind(string token, string loginId, string pwd)
        {
            // 得到绑定数据
            var weChat = weChatBindService.GetWeChatBindByToken(token);
            if (weChat == null || weChat.uc_BindStudentId > 0)
            {
                return new MathResponse(PublicKey.FAIL_CODE, "校验失败！", "");
            }

            pwd = Encrypt.MD5(pwd);
            var student = studentService.Queryable().FirstOrDefault(o => o.s_LoginId == loginId && o.s_Password == pwd);
            if (student == null)
            {
                return new MathResponse(PublicKey.FAIL_CODE, "账号密码错误！", "");
            }

            if (weChatBindService.BindWeChatBind(weChat.uc_OpenId, student.s_ID))
            {
                return new MathResponse(PublicKey.SUCCESS_LOGIN, "绑定成功！", "");
            }
            else
            {
                return new MathResponse(PublicKey.FAIL_CODE, "绑定失败！", "");
            }
        }

        //小程序校验
        [Route("api/message/mathhomecheck")]
        [HttpPost]
        public IHttpActionResult MathHomeCheck(string token)
        {
            // 得到绑定数据
            var weChat = weChatBindService.GetWeChatBindByToken(token);
            if (weChat == null)
            {
                return new MathResponse(PublicKey.FAIL_CODE, "校验失败！", "");
            }
            else
            {
                // 已经绑定了学生
                if (weChat.uc_BindStudentId > 0)
                {
                    return new MathResponse(PublicKey.SUCCESS_LOGIN, "登录成功！", weChat.uc_Token);
                }
                else
                {
                    return new MathResponse(PublicKey.SUCCESS_REGISTER, "注册成功！", weChat.uc_Token);

                }
            }
        }
    }

}

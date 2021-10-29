using Abhs.Common;
using Abhs.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Abhs.Attributes
{
    public class GlobalErrorAttribute : HandleErrorAttribute
    {
        private static log4net.ILog _logNet = log4net.LogManager.GetLogger(typeof(GlobalErrorAttribute));
        /// <summary>
        /// 控制器方法中出现异常，会调用该方法捕获异常
        /// </summary>
        /// <param name="filterContext"></param>
        public override void OnException(ExceptionContext filterContext)
        {
            if (filterContext.Exception is CheckException)
            {
                filterContext.HttpContext.Response.Redirect("/");
            }
            else if (filterContext.Exception is ResultException)
            {
                //LogHelper.Info(filterContext.Exception.Message);
                filterContext.HttpContext.Response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(new Result() { code = PublicKey.FAIL_CODE, message = filterContext.Exception.Message }));                
                filterContext.HttpContext.Response.End();
            }
            else
            {
                string message = filterContext.Exception.Message;
                if(!message.Contains("服务器无法在发送 HTTP 标头之后设置内容类型"))
                    _logNet.Error(filterContext.Exception);
                filterContext.HttpContext.Response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(new Result() { code = PublicKey.FAIL_CODE, message = "系统异常" }));
                filterContext.HttpContext.Response.End();
            }
            
            base.OnException(filterContext);
        }

    }
}
using Abhs.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;

namespace Abhs.App_Start
{
    public class WebApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private static log4net.ILog _logger = log4net.LogManager.GetLogger("WebApiExceptionFilterAttribute");
        //重写基类的异常处理方法
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {

            //2.返回调用方具体的异常信息
            if (actionExecutedContext.Exception is NotImplementedException)
            {
                //actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.NotImplemented);
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(HttpStatusCode.OK, new Result() { code = 501, message = actionExecutedContext.Exception.Message });
            }
            else if (actionExecutedContext.Exception is TimeoutException)
            {
                //actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.RequestTimeout);
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(HttpStatusCode.OK, new Result() { code = 408, message = actionExecutedContext.Exception.Message });
            }
            else if (actionExecutedContext.Exception is NotSupportedException)
            {
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(HttpStatusCode.OK, new Result() { code = -1, message = actionExecutedContext.Exception.Message });
            }
            else
            {
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(HttpStatusCode.OK, new Result() { code = PublicKey.FAIL_CODE, message = actionExecutedContext.Exception.Message });
                _logger.Error(actionExecutedContext.Exception.StackTrace);
            }

            base.OnException(actionExecutedContext);
        }
    }
}
using Abhs.Model.Common;
using Abhs.Web.Common;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Http.ModelBinding;



namespace Abhs.Web.Filters
{
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var modelState = actionContext.ModelState;
            if (!modelState.IsValid)
            {
                base.OnActionExecuting(actionContext);

                //聚合所有的验证错误消息
                string error = string.Empty;
                foreach (var key in modelState.Keys)
                {
                    var state = modelState[key];
                    if (state.Errors.Any())
                    {
                        foreach(var e in state.Errors)
                        {
                            if (!string.IsNullOrEmpty(e.ErrorMessage))
                            {
                                error += "|" + e.ErrorMessage;
                            }
                            
                        }
                        
                    }
                }

                Result result = new Result();
                result.code = (int)HttpStatusCode.BadRequest;
                result.data = new { };
                result.message = error;

                //重新封装回传格式
                HttpResponseMessage httpResponseMessage = new HttpResponseMessage();
                httpResponseMessage.Content = new StringContent(JsonConvert.SerializeObject(result));
                
                actionContext.Response = httpResponseMessage; 
                
            }
        }
    }
}
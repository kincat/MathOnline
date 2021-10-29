using Abhs.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Abhs.Web.Common
{
    public class MathResponse : IHttpActionResult
    {
        public Result result { get; set; }

        
        public MathResponse()
        {
            result = new Result();
        }
        public MathResponse(object data)
        {
            result = new Result();
            result.data = data;
        }
        public MathResponse(int code, string message, object data)
        {
            result = new Result();
            result.code = code;
            result.message = message;
            result.data = data;
        }
        

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage()
            {
                Content = new ObjectContent(typeof(Result), result, new System.Net.Http.Formatting.JsonMediaTypeFormatter()),
                StatusCode = System.Net.HttpStatusCode.OK
            };
            return Task.FromResult(response);
        }
    }
}
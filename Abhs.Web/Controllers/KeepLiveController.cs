using Abhs.Application.IService;
using Abhs.Application.IService.Business;
using Abhs.Application.Service;
using Abhs.Model.ViewModel;
using Abhs.Web.Common;
using StructureMap.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Abhs.Web.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class KeepLiveController : ApiController
    {
        [SetterProperty]
        public IKeepLiveService keepLiveService { get; set; }


        /// <summary>
        /// 学生心跳
        /// </summary>
        /// <param name="condition"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/message/heartbeat")]
        public IHttpActionResult StudentLive(StudentHeartCondition condition)
        {
            return new MathResponse(new { result = keepLiveService.StudentHeart(condition) });
        }
    }
}

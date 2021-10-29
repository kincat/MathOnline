using Abhs.App_Start;
using Abhs.Application.Service;
using Abhs.Attributes;
using Abhs.Cache;
using Abhs.Common.Enums;
using Abhs.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Abhs.Controllers
{
    public class BaseController : Controller
    {
        /// <summary>
        /// Action执行前判断
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {


            //判读Action是否需要Cookie...
            if (filterContext.ActionDescriptor.GetCustomAttributes(typeof(GuestAttribute), true).Length == 0)
            {
                //filterContext.Result = RedirectToRoute("Default", new { Controller = "Home", Action = "Login" });
            }

            base.OnActionExecuting(filterContext);
        }

    }
}
using Abhs.Application.IService;
using Abhs.Application.IService.Business;
using Abhs.Application.Service;
using Abhs.Controllers;
using Abhs.Model.ViewModel;
using StructureMap.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static Abhs.Common.Enums.SysModel;


namespace Abhs.Web.Controllers
{
    public class MonitorController : BaseController
    {
        // GET: Monitor
        public ActionResult Index()
        {
            return View();
        }
    }
}
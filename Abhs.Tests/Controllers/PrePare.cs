using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Abhs.Controllers;
using Abhs.DependencyResolution;
using Abhs.Application.IService;
using Abhs.Application.Service;
using Abhs.Model.MonitorMiddle;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;

namespace Abhs.Tests.Controllers
{
    [TestClass]
    public class PrePare
    {
        [TestMethod]
        public void HomeControllerTest()
        {
            DateTime begin = Convert.ToDateTime("2021-01-05");
            DateTime end = Convert.ToDateTime(DateTime.Now.ToShortDateString());
            TimeSpan ts1 = new TimeSpan(begin.Ticks);
            TimeSpan ts2 = new TimeSpan(end.Ticks);
            TimeSpan ts3 = ts1.Subtract(ts2).Duration();
            var ss = ts3.TotalDays;
            
            //bool a = IsTime("5:5");
            //var list = new List<apple>();
            //list.Add(new apple { a = 1, b = 1 });
            //list.Add(new apple { a = 2, b = 2 });
            //list.Add(new apple { a = 3, b = 3 });
            //var index = list.FindIndex(x => x.a == 2);
            //list.RemoveAt(index);
            //list.Insert(index, new apple { a = 4, b = 4 });
            //int a = list.Count;
            //string a=  Enum.GetName(typeof(EnumModuleType), 8);
            IDependency dependency = new StructureMapAdapter();
            dependency.AddTransient(typeof(ITeacherService), typeof(TeacherService));
            dependency.Build();
            dependency.AddTransient(typeof(IClassService), typeof(ClassService));
            dependency.Build();
            //var teacherService = (TeacherService)dependency.GetInstance(typeof(TeacherService));
            //var classService = (ClassService)dependency.GetInstance(typeof(ClassService));
            //HomeController controller = new HomeController(teacherService, classService);
            //controller.TeacherLogin("zchxz", "E10ADC3949BA59ABBE56E057F20F883E", "");
            Assert.AreEqual("", "");
        }
        public static bool IsTime(string StrSource)
        {
            return Regex.IsMatch(StrSource, @"^((20|21|22|23|[0-1]?\d):[0-5]?\d)$");
        }
    }
    public class apple
    {
        public int a { get; set; }
        public int b { get; set; }
    }
}

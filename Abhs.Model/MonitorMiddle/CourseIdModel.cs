using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
    public class CourseIdModel
    {
        public CourseIdModel(string courseId)
        {

            //var courseId = $"{item.cla_SchoolID}-{classId}-{now.ToString("yyyyMMdd")}-{detailItem.start.Replace(":", "")}-{detailItem.end.Replace(":", "")}";
            var array = courseId.Split('-');
            var now = Convert.ToDateTime(array[2].Insert(6, "-").Insert(4, "-"));
            this.SchoolId =Convert.ToInt32(array[0]);
            this.ClassId = Convert.ToInt32(array[1]);
            this.Week = (int)now.DayOfWeek;
            if (this.Week == 0)
                this.Week = 7;
            this.Date =Convert.ToInt32(array[2]);
            this.BeginTime = Convert.ToDateTime($"{now.ToShortDateString()} {array[3].Insert(2, ":")}:00");
            this.EndTime = Convert.ToDateTime($"{now.ToShortDateString()} {array[4].Insert(2, ":")}:00");
        }
        public int SchoolId { get; set; }
        public int ClassId { get; set; }
        public int Week { get; set; }
        public DateTime BeginTime { get; set; }
        public DateTime EndTime { get; set; }
        public int Date { get; set; }
        public string WeekName
        {

            get
            {
                switch (this.Week)
                {
                    case 1:
                        return "一";
                    case 2:
                        return "二";
                    case 3:
                        return "三";
                    case 4:
                        return "四";
                    case 5:
                        return "五";
                    case 6:
                        return "六";
                    case 7:
                        return "日";
                }
                return "";
            }
        }
    }
}

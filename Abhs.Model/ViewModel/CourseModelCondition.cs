using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    public class CourseModelCondition
    {
        public int schoolId { get; set; } = 0;
        public string gradeYearValue { get; set; }
        public int bookId { get; set; }
    }
    public class CourseGradeCondition
    {
        public int schoolId { get; set; } = 0;
        public int bookId { get; set; } = 0;
    }
  
}

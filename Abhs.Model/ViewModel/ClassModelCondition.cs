using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.ViewModel
{
    public class ClassModelCondition
    {
        public int schoolId { get; set; }
        public int classId { get; set; }
        public string className { get; set; }
        public string beginDate { get; set; }
        public string endDate { get; set; }
        public int grade { get; set; }
        public int courseId { get; set; }
        public string teacherIds { get; set; }
        public List<WeekTime> timeList { get; set; }
    }
    public class WeekTime
    {
        public int weekIndex { get; set; }
        public string beginTime { get; set; }
        public string endTime { get; set; }
    }
    public class WeekTimeModel
    {
        public int weekIndex { get; set; }
        public DateTime beginTime { get; set; }
        public DateTime endTime { get; set; }
    }
    public class JoinClassCondition
    {
        public int studentId { get; set; }
        public int classId { get; set; }
        public int schoolId { get; set; }
        public int oldClassId { get; set; }
        public int isConfirm { get; set; } = 0;
    }
    public class StudentJoinClassCondition
    {
        public int[] studentIds { get; set; }
        public int classId { get; set; }
        public int schoolId { get; set; }
    }
    public class ClassCondition
    {
        public int gradeId { get; set; } = 0;
        public int bookId { get; set; } = 0;
        public int classAllot { get; set; } = 1;
        public int schoolId { get; set; }
        public int studentId { get; set; }
        //-1全部,0停课，1正常，2结课
        public int status { get; set; } = -1;
        public bool isManage { get; set; } = false;
        public int teacherId { get; set; }
        public int classId { get; set; } = 0;

    }
    public class TempClassTableCondition
    {
        public int classId { get; set; }
        public string oldTime { get; set; }
        public string times { get; set; }
        public List<int> studentIds { get; set; }
        public int week { get; set; }
    }
}

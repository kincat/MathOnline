using Abhs.Model.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
   public  class MonitorStudent
    {
        public MonitorStudentView student { get; set; }
        public int studentId { get; set; }
        public bool isOffLine { get; set; } = false;
        public DateTime updateTime { get; set; } = DateTime.MinValue;
        public message_for_student GetMessageForStudent()
        {
            var message = new message_for_student();
            message.action_type = 1;
            message.lesson_id = 0;
            return message;
        }
    }
}

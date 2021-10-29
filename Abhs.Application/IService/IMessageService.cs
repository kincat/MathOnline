using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abhs.ES;
using Abhs.Model.MonitorMiddle;
using Abhs.Model.ViewModel;
using Abhs.Model.Access;

namespace Abhs.Application.IService
{
    public interface IMessageService
    {
        void AddMessage(message_for_student req);
        
        List<StudentNotice> GetNotice(BasStudent form);

        List<math_message_request> GetStudentMessages(int studentId);

        List<math_message_request> GetNewMessageByStudent(int studentId, string newestMsgId);
    }
}

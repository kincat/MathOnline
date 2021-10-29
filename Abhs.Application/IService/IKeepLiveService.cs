using Abhs.Model.MonitorMiddle;
using Abhs.Model.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.IService.Business
{
    public  interface IKeepLiveService
    {
        List<StudentNotice> StudentHeart(StudentHeartCondition condition);
    }
}

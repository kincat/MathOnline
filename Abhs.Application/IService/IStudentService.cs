using Abhs.Model.Access;
using Abhs.Model.Common;
using Abhs.Model.Model;
using Abhs.Model.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.IService
{
    public interface IStudentService : IBaseService<BasStudent>
    {
        void SetMonitorStudent(StudyModel student);
        BasStudent GetModelCacheById(int studentId);

        StudyModel GetMonitorStudent(int studentId);
    }
}

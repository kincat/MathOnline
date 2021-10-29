using Abhs.Model.Access;
using Abhs.Model.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.IService
{
    public interface IPackageLessonItemsService : IBaseService<SysPackageLessonItems>
    {
        void PackageLessonItemInit();

        /// <summary>
        /// 从缓存获取实体
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        SysPackageLessonItems GetModelByCache(int id);
        /// <summary>
        /// 获取该课时下的所有课时内容
        /// </summary>
        /// <param name="lessonId"></param>
        /// <returns></returns>
        List<SysPackageLessonItems> GetPackageLessonItemByLessonId(int lessonId);
    }
}

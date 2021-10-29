using Abhs.Model.Access;
using Abhs.Model.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.IService
{
    public interface IPackageLessonService : IBaseService<SysPackageLesson>
    {
        void PackageLessonInit();
        /// <summary>
        /// 获取所有课时
        /// </summary>
        /// <returns></returns>
        List<SysPackageLesson> GetAllPackageLessonByCache();
        /// <summary>
        /// 从缓存获取实体
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        SysPackageLesson GetModelByCache(int id);
        /// <summary>
        /// 获取课时
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        SysPackageLesson GetModel(int id);
        /// <summary>
        /// 获取课程下的课时，有缓存
        /// </summary>
        /// <param name="packId"></param>
        /// <returns></returns>
        List<SysPackageLesson> GetModelListByPackId(int packId);
        /// <summary>
        /// 获取课程下的课时,包含未审核的，有缓存
        /// </summary>
        /// <param name="packId"></param>
        /// <returns></returns>
        List<SysPackageLesson> GetListByPackId(int packId);
        /// <summary>
        /// 获取多个课时
        /// </summary>
        /// <param name="packIds"></param>
        /// <returns></returns>
        List<SysPackageLesson> GetLessonByPackIds(List<int> packIds);
 
 
        


    }
}

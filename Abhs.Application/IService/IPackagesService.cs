using Abhs.Model.Access;
using Abhs.Model.Model;
using Abhs.Model.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.IService
{
    public interface IPackagesService : IBaseService<SysPackages>
    {
        void PackageInit();
        /// <summary>
        /// 获取所有课程包
        /// </summary>
        /// <returns></returns>
        //List<SysPackages> GetAllPackagesByCache();
        List<PackageModel> GetAllPackages();
        SysPackages GetModel(int id);
        /// <summary>
        /// 从缓存获取实体
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        SysPackages GetModelByCache(int id);
        /// <summary>
        /// 获取学校的所有课时
        /// </summary>
        /// <param name="bookIds"></param>
        /// <returns></returns>
        List<SysPackages> GetPackagesByBookIds(List<int> bookIds);
       

    }
}

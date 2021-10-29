using Abhs.Application.IService;
using Abhs.Data.Repository;
using Abhs.Model.Access;
using Abhs.Model.Model;
using Abhs.Model.ViewModel;
using StructureMap.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.Service
{
    public class PackagesService : IPackagesService
    {
        [SetterProperty]
        public IRepositoryBase<SysPackages> packageDAL { get; set; }
        [SetterProperty]
        public IRepositoryBase<SysPackageLesson> lessonDAL { get; set; }
        public SysPackages FindEntity(object pk)
        {
            return packageDAL.FindEntity(pk);
        }
        public IQueryable<SysPackages> Queryable()
        {
            return packageDAL.IQueryable();
        }
        public void PackageInit()
        { 
            var list = this.Queryable().ToList();
            list.ForEach(x =>
            {
                var lessonList = lessonDAL.IQueryable().Where(y => y.spl_spID == x.sp_ID).Select(y => y.spl_ID).ToList();
                x.lessonList = lessonList;
                RedisService.Instance().SetPackageCache<SysPackages>(x.sp_ID, x);
            });
        }
         
        public List<PackageModel> GetAllPackages()
        {
            return this.Queryable().Where(x => x.sp_State == 1).Select(x=>new PackageModel { bookId=x.sp_Book, grades=x.sp_Grades,packId=x.sp_ID }).ToList();
        }
        public SysPackages GetModel(int id)
        {
            return this.FindEntity(id);
        }
        /// <summary>
        /// 从缓存获取实体
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public SysPackages GetModelByCache(int id)
        {
            
            var model = RedisService.Instance().GetPackage<SysPackages>(id);
            if (model == null)
            {
                model = this.FindEntity(id);
                var lessonList = lessonDAL.IQueryable().Where(y => y.spl_spID == model.sp_ID).Select(y => y.spl_ID).ToList();
                model.lessonList = lessonList;
                RedisService.Instance().SetPackageCache<SysPackages>(model.sp_ID, model);
            }
            return model;
        }
        /// <summary>
        /// 获取学校的所有课时
        /// </summary>
        /// <param name="schoolId"></param>
        /// <returns></returns>
        public List<SysPackages> GetPackagesByBookIds(List<int> bookIds)
        {
            var allList= this.Queryable().Where(x => x.sp_State == 1).ToList();
            return allList.Where(x => bookIds.Contains(x.sp_Book)).ToList();     
        }
       
    }
}

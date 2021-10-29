using Abhs.Application.IService;
using Abhs.Common.Enums;
using Abhs.Data.Repository;
using Abhs.Model.Access;
using Abhs.Model.Common;
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
    public class PackageLessonService : IBaseService<SysPackageLesson>, IPackageLessonService
    {
        [SetterProperty]
        public IRepositoryBase<SysPackageLesson> packageLessonDAL { get; set; }
        [SetterProperty]
        public IRepositoryBase<SysPackageLessonItems> lessonItemDAL { get; set; }
        public SysPackageLesson FindEntity(object pk)
        {
            return packageLessonDAL.FindEntity(pk);
        }
        public IQueryable<SysPackageLesson> Queryable()
        {
            return packageLessonDAL.IQueryable();
        }
        public void PackageLessonInit()
        { 
            var list = this.Queryable().Where(x => x.spl_State == 1).OrderBy(x => x.spl_Index).ToList();
            list.ForEach(x =>
            {
                var itemList = lessonItemDAL.IQueryable().Where(y => y.spk_splID == x.spl_ID).Select(y => y.spk_ID).ToList();
                x.itemList = itemList;
                RedisService.Instance().SetPackageLessonCache<SysPackageLesson>(x.spl_ID, x);
            });
        }
        /// <summary>
        /// 获取所有课时
        /// </summary>
        /// <returns></returns>
        public List<SysPackageLesson> GetAllPackageLessonByCache()
        {
            return this.Queryable().Where(x => x.spl_State == 1).OrderBy(x => x.spl_Index).ToList();
            var list = RedisService.Instance().GetAllPackageLessonData<SysPackageLesson>();
            if (list == null || list.Count == 0)
            {
                list = this.Queryable().Where(x=>x.spl_State==1).OrderBy(x=>x.spl_Index).ToList();
                list.ForEach(x =>
                {
                    var itemList = lessonItemDAL.IQueryable().Where(y => y.spk_splID == x.spl_ID).Select(y => y.spk_ID).ToList();
                    x.itemList = itemList;
                    RedisService.Instance().SetPackageLessonCache<SysPackageLesson>(x.spl_ID, x);
                });
            }
            return list;
        }
        /// <summary>
        /// 从缓存获取实体
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public SysPackageLesson GetModelByCache(int id)
        {
            var model=RedisService.Instance().GetPackageLesson<SysPackageLesson>(id);
            if (model == null)
            {
                model = this.FindEntity(id);
                if(model != null)
                {
                    var itemList = lessonItemDAL.IQueryable().Where(y => y.spk_splID == model.spl_ID).Select(y => y.spk_ID).ToList();
                    model.itemList = itemList;
                    RedisService.Instance().SetPackageLessonCache<SysPackageLesson>(model.spl_ID, model);
                }              
            }
            return model;
        }
        public SysPackageLesson GetModel(int id)
        {
            return this.FindEntity(id);
        }
        private IQueryable<SysPackageLesson> GetPackageLessonByPackId(int packId)
        {
            return this.Queryable().Where(x => x.spl_spID == packId&&x.spl_State==1).OrderBy(x=>x.spl_Index);
        }
        /// <summary>
        /// 获取课程下的课时，有缓存
        /// </summary>
        /// <param name="packId"></param>
        /// <returns></returns>

        public List<SysPackageLesson> GetModelListByPackId(int packId)
        {
            return GetPackageLessonByPackId(packId).ToList();
            //var lessonList = RedisService.Instance().GetPackageLessonByPackId<SysPackageLesson>(packId).OrderBy(x=>x.spl_Index).ToList();
            //if (lessonList == null || lessonList.Count == 0)
            //{
            //    lessonList = GetPackageLessonByPackId(packId).ToList();
            //}
           
           //return lessonList;
        }
        /// <summary>
        /// 获取课程下的课时,包含未审核的，有缓存
        /// </summary>
        /// <param name="packId"></param>
        /// <returns></returns>
        public List<SysPackageLesson> GetListByPackId(int packId)
        {
            return this.Queryable().Where(x => x.spl_spID == packId&&x.spl_State!=-5).OrderBy(x => x.spl_Index).ToList();
        }
       
        public List<SysPackageLesson> GetLessonByPackIds(List<int> packIds)
        {
            return this.Queryable().Where(x => packIds.Contains(x.spl_spID)&& x.spl_State ==1).ToList();
        }
       


    }
}

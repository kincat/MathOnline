using Abhs.Application.IService;
using Abhs.Common.Enums;
using Abhs.Data.Repository;
using Abhs.Model.Access;
using Abhs.Model.Common;
using Abhs.Model.ViewModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using StructureMap.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.Service
{
    public class PackageLessonItemsService : IPackageLessonItemsService
    {
        [SetterProperty]
        public IRepositoryBase<SysPackageLessonItems> packageLessonItemsDAL { get; set; }




        public SysPackageLessonItems FindEntity(object pk)
        {
            return packageLessonItemsDAL.FindEntity(pk);
        }
        public IQueryable<SysPackageLessonItems> Queryable()
        {
            return packageLessonItemsDAL.IQueryable();
        }
        public void PackageLessonItemInit()
        { 
            var list = this.Queryable().Where(x => x.spk_State == 1).ToList();
            list.ForEach(x =>
            {
                RedisService.Instance().SetPackageLessonItemCache<SysPackageLessonItems>(x.spk_ID, x);
            });
        }
        /// <summary>
        /// 从缓存获取实体
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public SysPackageLessonItems GetModelByCache(int id)
        {
            var model = RedisService.Instance().GetPackageLessonItem<SysPackageLessonItems>(id);
            if (model == null)
            {
                model = this.FindEntity(id);
                RedisService.Instance().SetPackageLessonItemCache<SysPackageLessonItems>( model.spk_ID, model);
            }
            return model;
        }
        /// <summary>
        /// 获取该课时下的所有课时内容
        /// </summary>
        /// <param name="lessonId"></param>
        /// <returns></returns>
        public List<SysPackageLessonItems> GetPackageLessonItemByLessonId(int lessonId)
        {
            return this.Queryable().Where(x => x.spk_splID == lessonId && x.spk_State == 1).OrderBy(x => x.spk_Index).ToList();             
        }

    }
}

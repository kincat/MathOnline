using Abhs.Application.IService;
using Abhs.Common.Enums;
using Abhs.Data.Repository;
using Abhs.Model.Access;
using StructureMap.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.Service
{
    public class QuestionMarkService : IQuestionMarkService
    {
        [SetterProperty]
        public IRepositoryBase<SysQuestionMark> questionMarkDAL { get; set; }
        [SetterProperty]
        public IPackageLessonItemsService packageLessonItemsService { get; set; }
        public SysQuestionMark FindEntity(object pk)
        {
            return questionMarkDAL.FindEntity(pk);
        }

        public IQueryable<SysQuestionMark> Queryable()
        {
            return questionMarkDAL.IQueryable().Where(t => t.m_State == (int)EnumMarkState.正常使用);
        }
        public IQueryable<SysQuestionMark> QueryableKnowledge()
        {
            return questionMarkDAL.IQueryable().Where(t => t.m_Type == (int)EnumMarkType.知识点 && t.m_State == (int)EnumMarkState.正常使用);
        }
        public IQueryable<SysQuestionMark> QueryableQuestionType()
        {
            return questionMarkDAL.IQueryable().Where(t => t.m_Type == (int)EnumMarkType.题型 && t.m_State == (int)EnumMarkState.正常使用);
        }
        public IQueryable<SysQuestionMark> QueryableCommon()
        {
            return questionMarkDAL.IQueryable().Where(t => t.m_Type == (int)EnumMarkType.普通标签 && t.m_State == (int)EnumMarkState.正常使用);
        }

        public SysQuestionMark QueryQMName(string code)
        {
            var result = RedisService.Instance().GetSysQuestionMarkByCode<SysQuestionMark>(code);
            if(result == null)
            {
                result = QueryableQuestionType().FirstOrDefault(m => m.m_Code == code);
                RedisService.Instance().SetSysQuestionMarkByCode<SysQuestionMark>(code, result);
            }
            return result;
        }

        /// <summary>
        /// 根据codes获取知识点LIST
        /// </summary>
        /// <param name="codes"></param>
        /// <returns></returns>
        public List<SysQuestionMark> GetDataByCodes(List<string> codes)
        {
            return QueryableKnowledge().Where(o => codes.Contains(o.m_Code)).ToList();
        }
        /// <summary>
        /// 根据codes获取题型LIST
        /// </summary>
        /// <param name="codes"></param>
        /// <returns></returns>
        public List<SysQuestionMark> GetQuestionTypeByCodes(List<string> codes)
        {
            return QueryableQuestionType().Where(o => codes.Contains(o.m_Code)).ToList();
        }
        /// <summary>
        /// 获取题型题库
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        public List<SysQuestionMark> GetModelList(List<string> list, EnumMarkType mark)
        {
            return this.Queryable().Where(x => x.m_Type == (int)mark && list.Contains(x.m_Code)).ToList();
        }
        /// <summary>
        /// 返回课时下涉及到的知识点列表
        /// </summary>
        /// <param name="lessId"></param>
        /// <returns></returns>
        public List<SysQuestionMark> GetKnowsByLess(int lessId)
        {
            var codes = new List<string>();
            var items = packageLessonItemsService.GetPackageLessonItemByLessonId(lessId);
            items.ForEach(o => {
                var temp = Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(o.spk_KnowledgeIDs);
                foreach (var k in temp)
                {
                    if (!string.IsNullOrEmpty(k))
                    {
                        codes.Add(k);
                    }
                }
            });
            return GetDataByCodes(codes);
        }

    }
}

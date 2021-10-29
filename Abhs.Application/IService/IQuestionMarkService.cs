using Abhs.Common.Enums;
using Abhs.Model.Access;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.IService
{
    public interface IQuestionMarkService : IBaseService<SysQuestionMark>
    {
        /// <summary>
        /// 获取题型题库
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        List<SysQuestionMark> GetModelList(List<string> list, EnumMarkType mark);
        /// <summary>
        /// 返回课时下涉及到的知识点列表
        /// </summary>
        /// <param name="lessId"></param>
        /// <returns></returns>
       List<SysQuestionMark> GetKnowsByLess(int lessId);
        /// <summary>
        /// 知识点
        /// </summary>
        /// <returns></returns>
        IQueryable<SysQuestionMark> QueryableKnowledge();
        /// <summary>
        /// 题型
        /// </summary>
        /// <returns></returns>
        IQueryable<SysQuestionMark> QueryableQuestionType();
        /// <summary>
        /// 普通
        /// </summary>
        /// <returns></returns>
        IQueryable<SysQuestionMark> QueryableCommon();

        /// <summary>
        /// 根据codes获取知识点LIST
        /// </summary>
        /// <param name="codes"></param>
        /// <returns></returns>
        List<SysQuestionMark> GetDataByCodes(List<string> codes);
        /// <summary>
        /// 根据codes获取题型LIST
        /// </summary>
        /// <param name="codes"></param>
        /// <returns></returns>
        List<SysQuestionMark> GetQuestionTypeByCodes(List<string> codes);

        SysQuestionMark QueryQMName(string code);
    }
}

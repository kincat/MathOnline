using Abhs.Application.IService;
using Abhs.Cache.Redis;
using Abhs.Common.Enums;
using Abhs.Data.Repository;
using Abhs.Model.Access;
using Abhs.Model.Common;
using Abhs.Model.Model;
using Abhs.Model.MonitorMiddle;
using Abhs.Model.ViewModel;
using StructureMap.Attributes;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.Service
{
    public class WeChatBindService : IWeChatBindService
    {
        [SetterProperty]
        public IRepositoryBase<BasWeChatBind> weChatBindDAL { get; set; }

        public string AddWeChatBind(string openId, string session_key)
        {
            var add = new BasWeChatBind();
            add.uc_OpenId = openId;
            add.uc_Session_key = session_key;
            add.uc_CreateTime = DateTime.Now;
            add.uc_LastLoginTime = DateTime.Now;
            add.uc_LoginCount = 0;
            add.uc_Token = Guid.NewGuid().ToString();
            if(weChatBindDAL.Insert(add) > 0)
            {
                return add.uc_Token;
            }

            return "";
        }

        public bool BindWeChatBind(string openId, int studentId)
        {
            // 得到绑定数据
            var weChat = this.GetWeChatBindByOpenId(openId);
            weChat.uc_BindStudentId = studentId;
            weChat.uc_LoginCount += 1;

            return weChatBindDAL.Update(weChat) > 0;
        }

        public BasWeChatBind GetWeChatBindByOpenId(string openId)
        {
            return this.Queryable().FirstOrDefault(o => o.uc_OpenId == openId);
        }

        public BasWeChatBind GetWeChatBindByToken(string token)
        {
            return this.Queryable().FirstOrDefault(o => o.uc_Token == token);
        }

        public BasWeChatBind FindEntity(object pk)
        {
            return weChatBindDAL.FindEntity(pk);
        }

        public IQueryable<BasWeChatBind> Queryable()
        {
            return weChatBindDAL.IQueryable();
        }
    }
}

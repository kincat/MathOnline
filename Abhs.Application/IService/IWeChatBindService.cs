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
    public interface IWeChatBindService : IBaseService<BasWeChatBind>
    {
        BasWeChatBind GetWeChatBindByToken(string token);
        BasWeChatBind GetWeChatBindByOpenId(string openId);

        string AddWeChatBind(string openId,string session_key);

        bool BindWeChatBind(string openId, int studentId);
    }
}

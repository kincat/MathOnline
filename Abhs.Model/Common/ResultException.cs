using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Abhs.Model.Common
{
    public class ResultException:ApplicationException
    {
        /// <summary>
        /// 返回json
        /// </summary>
        /// <param name="message"></param>
        public ResultException(string message,int flag=0) : base(message)
        {
        }
    }
}
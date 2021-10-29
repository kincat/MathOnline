using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Abhs.Attributes
{
    public class CheckException:ApplicationException
    {
        /// <summary>
        /// 直接返回错误页面
        /// </summary>
        /// <param name="message"></param>
        public CheckException(string message) : base(message)
        {
        }
    }
}
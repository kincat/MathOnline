using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Abhs.Data.ServiceDBContext
{
    /// <summary>
    /// 线程单例类...
    /// </summary>
    public class ThreadSingleton
    {
        /// <summary>
        /// 获取EF数据库连接对象...
        /// </summary>
        /// <returns></returns>
        public static MathDbContext GetDBEntities()
        {

            System.Web.HttpContext context = System.Web.HttpContext.Current;
            if(context==null)
                return new MathDbContext();

            if (context.Items["DBEntities"] == null)
                context.Items["DBEntities"] = new MathDbContext();

            return context.Items["DBEntities"] as MathDbContext;
        }
    }
}

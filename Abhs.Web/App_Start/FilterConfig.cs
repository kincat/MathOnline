using Abhs.Attributes;
using System.Web;
using System.Web.Mvc;

namespace Abhs
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            //filters.Add(new HandleErrorAttribute());
            filters.Add(new GlobalErrorAttribute());//使用自定义异常处理的过滤器
        }
    }
}

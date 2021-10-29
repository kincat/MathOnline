using Abhs.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Abhs.Web.Cookie
{
    public class CookieHelper
    {
        public static void SetLoginFail()
        {
            int count = GetLoginFailCount();
            if (count == 0)
            {

                HttpContext.Current.Response.Cookies["loginFail"].Values["loginTime"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                HttpContext.Current.Response.Cookies["loginFail"].Values["loginCount"] = "1";
                HttpContext.Current.Response.Cookies["loginFail"].Expires = DateTime.Now.AddSeconds(600);//设置过期时间
            }
            else
            {
                HttpContext.Current.Response.Cookies["loginFail"].Values["loginCount"] = (count + 1).ToString();
                HttpContext.Current.Response.Cookies["loginFail"].Values["loginTime"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            }
        }
        private static HttpCookie GetHttpCookie(string key)
        {
            return HttpContext.Current.Response.Cookies["key"];
        }
        /// <summary>
        /// 清理登录失败cookie
        /// </summary>
        public static void ClearLoginFailCookie()
        {
            var cookie = GetHttpCookie("loginFail");
            if (cookie != null)
                HttpContext.Current.Response.Cookies["loginFail"].Expires = DateTime.Now.AddSeconds(-1);
        }
        /// <summary>
        /// 获取登录失败次数
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public static int GetLoginFailCount()
        {
            int count = 0;
            var cookie = GetHttpCookie("loginFail");
            string loginCount = string.Empty;
            if (cookie != null)
            {
                loginCount = cookie.Values["loginCount"];
            }
            if (!string.IsNullOrEmpty(loginCount))
            {
                count = Convert.ToInt32(loginCount);
            }
            return count;
        }
        /// <summary>
        /// 判断是否等待完成
        /// </summary>
        /// <returns></returns>
        public static bool CheckWaitFinish()
        {
            var cookie = GetHttpCookie("loginFail");
            if (cookie == null)
                return true;
            var beginTime = cookie.Values["loginTime"];
            if (!string.IsNullOrEmpty(beginTime))
            {
                if (DateTime.Now > Convert.ToDateTime(beginTime).AddSeconds(PublicKey.MAX_LOGIN_WAIT))
                {
                    //清理cookie
                    ClearLoginFailCookie();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            return true;
        }
    }
}
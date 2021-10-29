using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Abhs.Common
{
    public class CookieUtil
    {
        public static void SetEncryptCookie(string key, object value)
        {
            if (value != null)
            {
                HttpContext.Current.Response.Cookies[key].Domain = GetHostName();
                HttpContext.Current.Response.Cookies[key].Value = Encrypt.EncryptQueryString(value.ToString());
            }
        }
        public static object GetDecryptCookie(string key)
        {
            var obj = HttpContext.Current.Request.Cookies[key];
            if (obj != null&& obj.Value.ToString()!="")
                return Encrypt.DecryptQueryString(HttpContext.Current.Request.Cookies[key].Value);
            return "";
        }
        public static void SetUrlEncodeCookie(string key, object value)
        {
            HttpContext.Current.Response.Cookies[key].Domain = GetHostName();
            HttpContext.Current.Response.Cookies[key].Value = HttpUtility.UrlEncode(value.ToString());
        }
        public static object GetUrlDecodeCookie(string key)
        {
            var obj = HttpContext.Current.Request.Cookies[key];
            if (obj != null)
            {
                return HttpUtility.UrlDecode(HttpContext.Current.Request.Cookies[key].Value);
            }
            return null;
        }
        public static void SetCookie(string key, object value)
        {
            if (value != null)
            {
                HttpContext.Current.Response.Cookies[key].Domain = GetHostName();
                HttpContext.Current.Response.Cookies[key].Value = value.ToString();
            }
        }
        public static object GetCookie(string key)
        {
            var obj = HttpContext.Current.Request.Cookies[key];
            if (obj != null)
            {
                return HttpContext.Current.Request.Cookies[key].Value;
            }
                
            return null;
        }
        private static string GetHostName()
        {
            string HostName = HttpContext.Current.Request.Url.Host.ToString(); //获取URL主机地址
            string[] UserHost = HostName.Split(new Char[] { '.' });
            if (UserHost.Length == 3)
            {
                HostName = string.Format("{0}.{1}", UserHost[1], UserHost[2]);
            }
            if (HostName == "localhost")
                HostName = "";
            return HostName;
        }
    }
}

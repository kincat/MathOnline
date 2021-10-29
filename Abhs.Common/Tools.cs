using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;
using System.Data;
using System.Drawing;
using System.Web;
using System.Text.RegularExpressions;
using System.IO;
using System.Xml;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Net.Sockets;
using System.Management;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;

namespace Abhs.Common
{
    /// <summary>
    /// 公用方法集合
    /// </summary>
    public static class Tools
    {
        /// <summary>
        /// 获取客户端IP地址
        /// </summary>
        /// <returns>若失败则返回回送地址</returns>
        public static string GetIP()
        {
            try
            {
                string userHostAddress = string.Empty;

                //如果客户端使用了代理服务器，则利用HTTP_X_FORWARDED_FOR找到客户端IP地址
                if (HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
                    userHostAddress = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString().Split(',')[0].Trim();


                //否则直接读取REMOTE_ADDR获取客户端IP地址
                if (string.IsNullOrEmpty(userHostAddress))
                {
                    userHostAddress = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                }
                //前两者均失败，则利用Request.UserHostAddress属性获取IP地址，但此时无法确定该IP是客户端IP还是代理IP
                if (string.IsNullOrEmpty(userHostAddress))
                {
                    userHostAddress = HttpContext.Current.Request.UserHostAddress;
                }

                //最后判断获取是否成功，并检查IP地址的格式（检查其格式非常重要）
                if (!string.IsNullOrEmpty(userHostAddress))
                {
                    return userHostAddress;
                }
                else // 未获取到外网IP 获取内网IP
                {
                    foreach (var hostAddress in Dns.GetHostAddresses(Dns.GetHostName()))
                    {
                        if (hostAddress.AddressFamily == AddressFamily.InterNetwork)
                            return hostAddress.ToString();
                    }
                    return string.Empty;
                }
            }
            catch (Exception)
            {

                return "";
            }


        }

        /// <summary>
        /// 获取客户端mac地址
        /// </summary>
        /// <returns>若失败则返回unknow</returns>
        public static string GetMacAddress()
        {
            try
            {
                string mac = "";
                ManagementClass mc = new ManagementClass("Win32_NetworkAdapterConfiguration");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {
                    if ((bool)mo["IPEnabled"] == true)
                    {
                        mac = mo["MacAddress"].ToString();
                        break;
                    }
                }
                moc = null;
                mc = null;
                return mac;
            }
            catch
            {
                return "unknow";
            }
        }

        public static string CityName_ByBaidu(string IP)
        {
            //是否根据ip地址获取所在城市信息
            //if (!wlf.Common.Parameter.WhetherGetCity)
            //    return "";

            try
            {
                string url = "http://opendata.baidu.com/api.php?query=" + IP + "&co=&resource_id=6006&t=1321340433171&ie=utf8&oe=gbk&cb=bd__cbs__ssms4p&format=json&tn=baidu";
                System.Net.WebRequest wreq = WebRequest.Create(url);
                wreq.Method = "get";
                HttpWebResponse wresp = (HttpWebResponse)wreq.GetResponse();
                Stream s = wresp.GetResponseStream();
                StreamReader objReader = new StreamReader(s, Encoding.GetEncoding("gb2312"));
                string strCityName = objReader.ReadToEnd();
                Match m = Regex.Match(strCityName, "(?<=\"location\":\").*?(?=\",)");
                string d = m.Value.ToString();

                objReader.Dispose();
                wresp.Dispose();
                s.Dispose();
                objReader.Dispose();

                return d;

            }
            catch (System.Exception ex)
            {
                return "";
            }
            finally
            {

            }
        }

        /// <summary>
        /// 返回日期几
        /// </summary>
        /// <returns></returns>
        public static string DayOfWeek
        {
            get
            {
                switch (DateTime.Now.DayOfWeek.ToString("D"))
                {
                    case "0":
                        return "星期日 ";
                    case "1":
                        return "星期一 ";
                    case "2":
                        return "星期二 ";
                    case "3":
                        return "星期三 ";
                    case "4":
                        return "星期四 ";
                    case "5":
                        return "星期五 ";
                    case "6":
                        return "星期六 ";
                    default:
                        return "";
                }
            }
        }

        /// <summary>
        /// webGet方法
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string HttpGet(string url)
        {

            if (string.IsNullOrEmpty(url))
                return null;

            try
            {
                System.Net.WebRequest wreq = WebRequest.Create(url);
                wreq.Method = "get";
                HttpWebResponse wresp = (HttpWebResponse)wreq.GetResponse();
                Stream s = wresp.GetResponseStream();
                StreamReader objReader = new StreamReader(s, Encoding.UTF8);
                return objReader.ReadToEnd();
            }
            catch (System.Exception ex)
            {
                return "";
            }
            finally
            {

            }
        }
        //注册证书验证回调事件，在请求之前注册
        //private void SetCertificatePolicy()
        //{
        //    ServicePointManager.ServerCertificateValidationCallback
        //               += RemoteCertificateValidate;
        //}
        /// <summary> 
        /// 远程证书验证，固定返回true
        /// </summary> 
        private static bool RemoteCertificateValidate(object sender, X509Certificate cert,
            X509Chain chain, SslPolicyErrors error)
        {
            return true;
        }

        /// <summary>
        /// 得到http根目录
        /// </summary>
        /// <returns></returns>
        public static string GetRootPath()
        {
            // 是否为SSL认证站点
            string secure = HttpContext.Current.Request.ServerVariables["HTTPS"];
            string httpProtocol = (secure == "on" ? "https://" : "http://");

            // 服务器名称
            string serverName = HttpContext.Current.Request.ServerVariables["Server_Name"];

            // 应用服务名称
            string applicationName = HttpContext.Current.Request.ApplicationPath;

            string siteURL = httpProtocol + serverName + applicationName;
            return siteURL;
        }

        /// <summary>
        /// 方 法 名：HTMLEncode
        /// 主要功能：对HTML字符串进行格式化处理
        /// 完成日期：2006-03-02
        /// </summary>
        /// <param name="sText">待格式化的文本</param>
        /// <returns>格式化后的文本</returns>
        public static string HTMLEncode(string sText)
        {
            return sText.Replace("  ", "&nbsp;&nbsp;").Replace("\r\n", "<br />").Replace("\n\n", "<br />").Replace("\n", "<br />").Replace("\"", "&quot;");
        }

        /// <summary>
        /// 方 法 名：HTMLDecode
        /// 主要功能：去除字符串中的HTML元素
        /// 完成日期：2006-03-21
        /// </summary>
        /// <param name="sText">待格式化的文本</param>
        /// <returns>格式化后的文本</returns>
        public static string HTMLDecode(string sText)
        {
            string s = sText.Replace("&nbsp;", " ").Replace("<br />", "\r\n").Replace("<br/>", "\r\n");
            return s;
        }

        /// <summary>
        /// 方 法 名：HTMLEncode
        /// 主要功能：对HTML字符串进行格式化处理
        /// 完成日期：2006-03-02
        /// </summary>
        /// <param name="sText">待格式化的文本</param>
        /// <returns>格式化后的文本</returns>
        public static string HTMLEncodeNew(string sText)
        {
            string s = sText.Replace("&", "&amp;");

            s = s.Replace("\"", "&quot;");
            s = s.Replace("<", "&lt;");
            s = s.Replace(">", "&gt;");
            s = s.Replace("\'", "&#146;");
            //s = s.Replace(" ", "&nbsp;");
            s = s.Replace("\r", "<br>");
            s = s.Replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");

            //return s;
            return s.Replace("  ", "&nbsp;&nbsp;").Replace("\r\n", "<br />").Replace("\n\r", "<br />").Replace("\n", "<br />");
        }

        /// <summary>
        /// 方 法 名：HTMLDecode
        /// 主要功能：去除字符串中的HTML元素
        /// 完成日期：2006-03-21
        /// </summary>
        /// <param name="sText">待格式化的文本</param>
        /// <returns>格式化后的文本</returns>
        public static string HTMLDecodeNew(string sText)
        {
            string stroutput = sText;

            stroutput = stroutput.Replace("&quot;", "\"");
            stroutput = stroutput.Replace("&lt;", "<");
            stroutput = stroutput.Replace("&gt;", ">");
            stroutput = stroutput.Replace("&#146;", "\'");
            stroutput = stroutput.Replace("&nbsp;", " ");
            stroutput = stroutput.Replace("<br>", "\r");
            stroutput = stroutput.Replace("&nbsp;&nbsp;&nbsp;&nbsp;", "\t");


            //Regex regex = new Regex(@"<[^>]+>|</[^>]+>");

            return stroutput.Replace("&nbsp;", " ").Replace("<br />", "\r\n");
        }
        /// <summary>
        /// 去除字符串中的HTML元素
        /// </summary>
        /// <param name="Input"></param>
        /// <returns></returns>
        public static string RemoveSpaceHtmlTag(string Input)
        {
            string input = Input;
            //去html标签
            input = Regex.Replace(input, @"<(.[^>]*)>", "", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"([\r\n])[\s]+", "", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"-->", "", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"<!--.*", "", RegexOptions.IgnoreCase);

            input = Regex.Replace(input, @"&(quot|#34);", "\"", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"&(amp|#38);", "&", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"&(lt|#60);", "<", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"&(gt|#62);", ">", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"&(nbsp|#160);", " ", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"&(iexcl|#161);", "\xa1", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"&(cent|#162);", "\xa2", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"&(pound|#163);", "\xa3", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"&(copy|#169);", "\xa9", RegexOptions.IgnoreCase);
            input = Regex.Replace(input, @"&#(\d+);", "", RegexOptions.IgnoreCase);

            input.Replace("<", "");
            input.Replace(">", "");
            input.Replace("\r\n", "");
            //去两端空格，中间多余空格
            input = Regex.Replace(input.Trim(), "\\s+", " ");
            return input;
        }


        #region 格式化文本（防止SQL注入）
        /// <summary>
        /// 格式化文本（防止SQL注入）
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string TextFilter(string html)
        {
            System.Text.RegularExpressions.Regex regex1 = new System.Text.RegularExpressions.Regex(@"<script[\s\S]+</script *>", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            System.Text.RegularExpressions.Regex regex2 = new System.Text.RegularExpressions.Regex(@" href *= *[\s\S]*script *:", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            System.Text.RegularExpressions.Regex regex3 = new System.Text.RegularExpressions.Regex(@" on[\s\S]*=", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            System.Text.RegularExpressions.Regex regex4 = new System.Text.RegularExpressions.Regex(@"<iframe[\s\S]+</iframe *>", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            System.Text.RegularExpressions.Regex regex5 = new System.Text.RegularExpressions.Regex(@"<frameset[\s\S]+</frameset *>", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            //System.Text.RegularExpressions.Regex regex6 = new System.Text.RegularExpressions.Regex(@"\<img[^\>]+\>", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            //System.Text.RegularExpressions.Regex regex7 = new System.Text.RegularExpressions.Regex(@"</p>", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            //System.Text.RegularExpressions.Regex regex8 = new System.Text.RegularExpressions.Regex(@"<p>", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            //System.Text.RegularExpressions.Regex regex9 = new System.Text.RegularExpressions.Regex(@"<[^>]*>", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            System.Text.RegularExpressions.Regex regex10 = new System.Text.RegularExpressions.Regex(@"select", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            System.Text.RegularExpressions.Regex regex11 = new System.Text.RegularExpressions.Regex(@"update", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            System.Text.RegularExpressions.Regex regex12 = new System.Text.RegularExpressions.Regex(@"delete", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            html = regex1.Replace(html, ""); //过滤<script></script>标记
            html = regex2.Replace(html, ""); //过滤href=javascript: (<A>) 属性
            html = regex3.Replace(html, " _disibledevent="); //过滤其它控件的on...事件
            html = regex4.Replace(html, ""); //过滤iframe
            html = regex5.Replace(html, ""); //过滤frameset
            //html = regex6.Replace(html, ""); //过滤frameset
            //html = regex7.Replace(html, ""); //过滤frameset
            //html = regex8.Replace(html, ""); //过滤frameset
            //html = regex9.Replace(html, "");
            html = regex10.Replace(html, "s_elect");
            html = regex11.Replace(html, "u_pudate");
            html = regex12.Replace(html, "d_elete");
            html = html.Replace("'", "’");
            html = html.Replace("&nbsp;", " ");
            //html = html.Replace("</strong>", "");
            //html = html.Replace("<strong>", "");
            return html;

        }
        #endregion



        #region 格式化文本（输出内容）
        /// <summary>
        /// 格式化文本（输出内容）
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string MyFormatDestr(string str)
        {
            str = str.Replace("  ", " &nbsp;");
            str = str.Replace("\"", "&quot;");
            str = str.Replace("\'", "&#39;");
            str = str.Replace("\r\n", "<br/>");
            str = str.Replace("\n", "<br/>");
            str = str.Replace("\r", "<br/>");

            return str;
        }
        #endregion


        /// <summary>
        /// 获取枚举名称，没有返回空字符串...
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="Value"></param>
        /// <returns></returns>
        public static string GetEnumName<T>(int? Value)
        {
            //return Convert.ChangeType(a, typeof(T)).ToString();

            //if (Value == null)
            //    return "";

            //Array vals = Enum.GetValues(typeof(T));
            //foreach (object val in vals)
            //{
            //    if ((int)val == Value)
            //    {
            //        if (val.ToString().StartsWith("_"))
            //            return val.ToString().Substring(1);
            //        else
            //            return val.ToString();
            //    }

            //}

            return "";

        }


        /// <summary>
        /// 获取枚举名称，没有返回空字符串...
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="Value"></param>
        /// <returns></returns>
        public static string GetEnumName<T>(int Value)
        {
            //return Convert.ChangeType(a, typeof(T)).ToString();

            //Array vals = Enum.GetValues(typeof(T));
            //foreach (object val in vals)
            //{
            //    if ((int)val == Value)
            //        return val.ToString();
            //}

            return "";

        }


        public static T GetEnum<T>(string name)
        {
            //return Convert.ChangeType(a, typeof(T)).ToString();

            //Array vals = Enum.GetValues(typeof(T));
            //foreach (object val in vals)
            //{
            //    if (val.ToString() == name)
            //        return (T)val;
            //}

            //return (T)vals.GetValue(0);
            return default(T);

        }

        /// <summary>
        /// 获取枚举名称，没有返回空字符串...
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="Value"></param>
        /// <returns></returns>
        /// wlf.Common.Tools.GetEnumNameCombin<wlf.Common.enm薪资组成>(_drQInvite["qi_JobType"]._ToInt32(), "+")
        public static string GetEnumNameCombin<T>(int Value, string strConn)
        {
            return null;
            //string str = "";
            //Array vals = Enum.GetValues(typeof(T));
            //foreach (object val in vals)
            //{
            //    if (((int)val & Value) == (int)val)
            //        str += strConn + val.ToString();

            //}

            //return str.Length > 0 ? str.Substring(strConn.Length) : "";

        }

        public static string UtoGB(string str)
        {
            Regex reg = new Regex(@"(?i)\\u[a-f0-9]{4}");
            Match mat = reg.Match(str);
            while (mat.Success)
            {
                char c = Convert.ToChar(Convert.ToInt32(mat.Value.Substring(2), 16));
                str = str.Replace(mat.Value, c.ToString());
                mat = reg.Match(str);
            }
            return str;
        }

        public static string Int2Char(string str)
        {
            Regex reg = new Regex(@"&#(\d+);");
            StringBuilder sb = new StringBuilder();
            foreach (Match m in reg.Matches(str))
            {
                sb.Append((char)(Convert.ToInt32(m.Groups[1].Value)));
            }
            return sb.ToString();
        }

        /// <summary>
        /// 已重载.计算两个日期的时间间隔,返回的是时间间隔的日期差的绝对值.
        /// </summary>
        /// <param name="DateTime1">第一个日期和时间</param>
        /// <param name="DateTime2">第二个日期和时间</param>
        /// <returns></returns>
        public static string DateDiff(DateTime DateTime1, DateTime DateTime2)
        {
            string dateDiff = null;
            try
            {
                TimeSpan ts1 = new TimeSpan(DateTime1.Ticks);
                TimeSpan ts2 = new TimeSpan(DateTime2.Ticks);
                TimeSpan ts = ts1.Subtract(ts2).Duration();

                if (ts.Days > 0)
                    dateDiff = (ts.Days + 1).ToString() + "天";
                else if (ts.Hours > 0)
                    dateDiff = ts.Hours.ToString() + "小时";
                else if (ts.Minutes > 0)
                    dateDiff = ts.Minutes.ToString() + "分钟";
                else if (ts.Seconds > 0)
                    dateDiff = ts.Seconds.ToString() + "秒";
            }
            catch
            {

            }
            return dateDiff;
        }
        /// <summary>
        /// 已重载.计算一个时间与当前本地日期和时间的时间间隔,返回的是时间间隔的日期差的绝对值.
        /// </summary>
        /// <param name="DateTime1">一个日期和时间</param>
        /// <returns></returns>
        public static string DateDiff(DateTime DateTime1)
        {
            return DateDiff(DateTime1, DateTime.Now);
        }

        /// <summary>
        /// 输入秒数，获取时间差...
        /// </summary>
        /// <param name="seconds"></param>
        /// <returns></returns>
        public static string GetTimeBySeconds(int seconds)
        {
            DateTime t = DateTime.Now;
            return DateDiff(t.AddSeconds(seconds), t);
        }

        /// <summary>
        /// 经纬度之间的距离(注意：单位是km)
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <returns></returns>
        public static double CalcDistance(double fromX, double fromY, double toX, double toY)
        {
            /*
            double rad = 6371; //Earth radius in Km
            double p1X = fromX / 180 * Math.PI;
            double p1Y = fromY / 180 * Math.PI;
            double p2X = toX / 180 * Math.PI;
            double p2Y = toY / 180 * Math.PI;
            return Math.Acos(Math.Sin(p1Y) * Math.Sin(p2Y) +
                Math.Cos(p1Y) * Math.Cos(p2Y) * Math.Cos(p2X - p1X)) * rad;
             */
            var R = 6371;

            var deltaLatitude = toRadians(toX - fromX);
            var deltaLongitude = toRadians(toY - fromY);
            fromX = toRadians(fromX);
            toX = toRadians(toX);

            var a = Math.Sin(deltaLatitude / 2) *
                    Math.Sin(deltaLatitude / 2) +
                    Math.Cos(fromX) *
                    Math.Cos(toX) *
                    Math.Sin(deltaLongitude / 2) *
                    Math.Sin(deltaLongitude / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = R * c;
            return d;
        }

        private static double toRadians(double degree)
        {
            return degree * Math.PI / 180;
        }

        /// <summary>
        /// 实现数据的四舍五入法
        /// </summary>
        /// <param name="value">要进行处理的数据</param>
        /// <param name="decimals">保留的小数位数</param>
        /// <returns>四舍五入后的结果</returns>
        public static double Round(double value, int decimals)
        {
            if (value < 0)
            {
                return Math.Round(value + 5 / Math.Pow(10, decimals + 1), decimals, MidpointRounding.AwayFromZero);
            }
            else
            {
                return Math.Round(value, decimals, MidpointRounding.AwayFromZero);
            }
        }


        /// <summary>
        /// 将Object对象生成json串...
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string CreateJsonString(object obj)
        {
            IsoDateTimeConverter dtConverter = new IsoDateTimeConverter { DateTimeFormat = "yyyy'-'MM'-'dd' 'HH':'mm':'ss" };
            string Json = JsonConvert.SerializeObject(obj, dtConverter);
            Json = Json.Replace("\\\"", "\'");
            Json = Regex.Replace(Json, "(?<=:\")(.*?)(?=[(\",)|(\"\\})])", m => { return System.Web.HttpUtility.UrlEncode(m.ToString(), Encoding.UTF8); });
            Json = Json.Replace("+", " ");
            return Json;
        }

        /// <summary>
        /// 下载图片...
        /// </summary>
        /// <param name="url"></param>
        /// <param name="SavePath"></param>
        public static void DownloadImages(string url, string SavePath)
        {
            WebRequest request = WebRequest.Create(url);
            WebResponse response = request.GetResponse();
            Stream reader = response.GetResponseStream();
            FileStream writer = new FileStream(SavePath, FileMode.OpenOrCreate, FileAccess.Write);
            byte[] buff = new byte[512];
            int c = 0; //实际读取的字节数
            while ((c = reader.Read(buff, 0, buff.Length)) > 0)
            {
                writer.Write(buff, 0, c);
            }
            writer.Close();
            writer.Dispose();
            reader.Close();
            reader.Dispose();
            response.Close();
        }


        /// <summary> 
        /// 获取字符串长度，一个汉字算两个字节 
        /// </summary> 
        /// <param name="str"></param> 
        /// <returns></returns> 
        public static int GetByteLength(string str)
        {
            if (str.Length == 0) return 0;
            ASCIIEncoding ascii = new ASCIIEncoding();
            int tempLen = 0; byte[] s = ascii.GetBytes(str);
            for (int i = 0; i < s.Length; i++)
            {
                if ((int)s[i] == 63)
                {
                    tempLen += 2;
                }
                else
                {
                    tempLen += 1;
                }
            }
            return tempLen;
        }

        /// <summary>  
        /// 得到本周第一天(以星期一为第一天)  
        /// </summary>  
        /// <param name="datetime"></param>  
        /// <returns></returns>  
        public static DateTime GetWeekFirstDayMon(DateTime datetime)
        {
            //星期一为第一天  
            int weeknow = Convert.ToInt32(datetime.DayOfWeek);

            //因为是以星期一为第一天，所以要判断weeknow等于0时，要向前推6天。  
            weeknow = (weeknow == 0 ? (7 - 1) : (weeknow - 1));
            int daydiff = (-1) * weeknow;

            //本周第一天  
            string FirstDay = datetime.AddDays(daydiff).ToString("yyyy-MM-dd");
            return Convert.ToDateTime(FirstDay);
        }

        /// <summary>  
        /// 得到本周最后一天(以星期天为最后一天)  
        /// </summary>  
        /// <param name="datetime"></param>  
        /// <returns></returns>  
        public static DateTime GetWeekLastDaySun(DateTime datetime)
        {
            //星期天为最后一天  
            int weeknow = Convert.ToInt32(datetime.DayOfWeek);
            weeknow = (weeknow == 0 ? 7 : weeknow);
            int daydiff = (7 - weeknow);

            //本周最后一天  
            string LastDay = datetime.AddDays(daydiff).ToString("yyyy-MM-dd");
            return Convert.ToDateTime(LastDay);
        }

        //base64编码的文本 转为    图片
        public static  void Base64StringToImage(string txtFileName)
        {
            try
            {
                FileStream ifs = new FileStream(txtFileName, FileMode.Open, FileAccess.Read);
                StreamReader sr = new StreamReader(ifs);

                String inputStr = sr.ReadToEnd();
                byte[] arr = Convert.FromBase64String(inputStr);
                MemoryStream ms = new MemoryStream(arr);
                Bitmap bmp = new Bitmap(ms);

                //bmp.Save(txtFileName + ".jpg", System.Drawing.Imaging.ImageFormat.Jpeg);
                //bmp.Save(txtFileName + ".bmp", ImageFormat.Bmp);
                //bmp.Save(txtFileName + ".gif", ImageFormat.Gif);
                //bmp.Save(txtFileName + ".png", ImageFormat.Png);
                ms.Close();
                sr.Close();
                ifs.Close();
                if (File.Exists(txtFileName))
                {
                    File.Delete(txtFileName);
                }
                //MessageBox.Show("转换成功！");
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Base64StringToImage 转换失败\nException：" + ex.Message);
            }
        }

        /// <summary>
        /// 小时
        /// </summary>
        /// <param name="dateBegin"></param>
        /// <param name="dateEnd"></param>
        /// <returns></returns>
        public static double GetHourDiff(DateTime dateBegin, DateTime dateEnd)
        {
            TimeSpan ts1 = new TimeSpan(dateBegin.Ticks);
            TimeSpan ts2 = new TimeSpan(dateEnd.Ticks);
            TimeSpan ts3 = ts2.Subtract(ts1);
            return ts3.TotalHours;
        }
        /// <summary>
        /// 天
        /// </summary>
        /// <param name="dateBegin"></param>
        /// <param name="dateEnd"></param>
        /// <returns></returns>
        public static double GetDayDiff(DateTime dateBegin, DateTime dateEnd)
        {
            TimeSpan ts1 = new TimeSpan(dateBegin.Ticks);
            TimeSpan ts2 = new TimeSpan(dateEnd.Ticks);
            TimeSpan ts3 = ts2.Subtract(ts1);
            return ts3.TotalDays;
        }
        /// <summary>
        /// 时间
        /// </summary>
        /// <param name="dateBegin"></param>
        /// <param name="dateEnd"></param>
        /// <returns></returns>
        public static double GetSecondDiff(DateTime dateBegin, DateTime dateEnd)
        {
            TimeSpan ts1 = new TimeSpan(dateBegin.Ticks);
            TimeSpan ts2 = new TimeSpan(dateEnd.Ticks);
            TimeSpan ts3 = ts2.Subtract(ts1);
            return ts3.TotalSeconds;
        }

        public static double GetMinuteDiff(DateTime dateBegin, DateTime dateEnd)
        {
            TimeSpan ts1 = new TimeSpan(dateBegin.Ticks);
            TimeSpan ts2 = new TimeSpan(dateEnd.Ticks);
            TimeSpan ts3 = ts2.Subtract(ts1);
            return ts3.TotalMinutes;
        }
        public static double GetMsDiff(DateTime dateBegin, DateTime dateEnd)
        {
            TimeSpan ts1 = new TimeSpan(dateBegin.Ticks);
            TimeSpan ts2 = new TimeSpan(dateEnd.Ticks);
            TimeSpan ts3 = ts2.Subtract(ts1);
            return ts3.TotalMilliseconds;
        }
    }
}

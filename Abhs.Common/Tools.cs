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
    /// ���÷�������
    /// </summary>
    public static class Tools
    {
        /// <summary>
        /// ��ȡ�ͻ���IP��ַ
        /// </summary>
        /// <returns>��ʧ���򷵻ػ��͵�ַ</returns>
        public static string GetIP()
        {
            try
            {
                string userHostAddress = string.Empty;

                //����ͻ���ʹ���˴����������������HTTP_X_FORWARDED_FOR�ҵ��ͻ���IP��ַ
                if (HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
                    userHostAddress = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString().Split(',')[0].Trim();


                //����ֱ�Ӷ�ȡREMOTE_ADDR��ȡ�ͻ���IP��ַ
                if (string.IsNullOrEmpty(userHostAddress))
                {
                    userHostAddress = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                }
                //ǰ���߾�ʧ�ܣ�������Request.UserHostAddress���Ի�ȡIP��ַ������ʱ�޷�ȷ����IP�ǿͻ���IP���Ǵ���IP
                if (string.IsNullOrEmpty(userHostAddress))
                {
                    userHostAddress = HttpContext.Current.Request.UserHostAddress;
                }

                //����жϻ�ȡ�Ƿ�ɹ��������IP��ַ�ĸ�ʽ��������ʽ�ǳ���Ҫ��
                if (!string.IsNullOrEmpty(userHostAddress))
                {
                    return userHostAddress;
                }
                else // δ��ȡ������IP ��ȡ����IP
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
        /// ��ȡ�ͻ���mac��ַ
        /// </summary>
        /// <returns>��ʧ���򷵻�unknow</returns>
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
            //�Ƿ����ip��ַ��ȡ���ڳ�����Ϣ
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
        /// �������ڼ�
        /// </summary>
        /// <returns></returns>
        public static string DayOfWeek
        {
            get
            {
                switch (DateTime.Now.DayOfWeek.ToString("D"))
                {
                    case "0":
                        return "������ ";
                    case "1":
                        return "����һ ";
                    case "2":
                        return "���ڶ� ";
                    case "3":
                        return "������ ";
                    case "4":
                        return "������ ";
                    case "5":
                        return "������ ";
                    case "6":
                        return "������ ";
                    default:
                        return "";
                }
            }
        }

        /// <summary>
        /// webGet����
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
        //ע��֤����֤�ص��¼���������֮ǰע��
        //private void SetCertificatePolicy()
        //{
        //    ServicePointManager.ServerCertificateValidationCallback
        //               += RemoteCertificateValidate;
        //}
        /// <summary> 
        /// Զ��֤����֤���̶�����true
        /// </summary> 
        private static bool RemoteCertificateValidate(object sender, X509Certificate cert,
            X509Chain chain, SslPolicyErrors error)
        {
            return true;
        }

        /// <summary>
        /// �õ�http��Ŀ¼
        /// </summary>
        /// <returns></returns>
        public static string GetRootPath()
        {
            // �Ƿ�ΪSSL��֤վ��
            string secure = HttpContext.Current.Request.ServerVariables["HTTPS"];
            string httpProtocol = (secure == "on" ? "https://" : "http://");

            // ����������
            string serverName = HttpContext.Current.Request.ServerVariables["Server_Name"];

            // Ӧ�÷�������
            string applicationName = HttpContext.Current.Request.ApplicationPath;

            string siteURL = httpProtocol + serverName + applicationName;
            return siteURL;
        }

        /// <summary>
        /// �� �� ����HTMLEncode
        /// ��Ҫ���ܣ���HTML�ַ������и�ʽ������
        /// ������ڣ�2006-03-02
        /// </summary>
        /// <param name="sText">����ʽ�����ı�</param>
        /// <returns>��ʽ������ı�</returns>
        public static string HTMLEncode(string sText)
        {
            return sText.Replace("  ", "&nbsp;&nbsp;").Replace("\r\n", "<br />").Replace("\n\n", "<br />").Replace("\n", "<br />").Replace("\"", "&quot;");
        }

        /// <summary>
        /// �� �� ����HTMLDecode
        /// ��Ҫ���ܣ�ȥ���ַ����е�HTMLԪ��
        /// ������ڣ�2006-03-21
        /// </summary>
        /// <param name="sText">����ʽ�����ı�</param>
        /// <returns>��ʽ������ı�</returns>
        public static string HTMLDecode(string sText)
        {
            string s = sText.Replace("&nbsp;", " ").Replace("<br />", "\r\n").Replace("<br/>", "\r\n");
            return s;
        }

        /// <summary>
        /// �� �� ����HTMLEncode
        /// ��Ҫ���ܣ���HTML�ַ������и�ʽ������
        /// ������ڣ�2006-03-02
        /// </summary>
        /// <param name="sText">����ʽ�����ı�</param>
        /// <returns>��ʽ������ı�</returns>
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
        /// �� �� ����HTMLDecode
        /// ��Ҫ���ܣ�ȥ���ַ����е�HTMLԪ��
        /// ������ڣ�2006-03-21
        /// </summary>
        /// <param name="sText">����ʽ�����ı�</param>
        /// <returns>��ʽ������ı�</returns>
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
        /// ȥ���ַ����е�HTMLԪ��
        /// </summary>
        /// <param name="Input"></param>
        /// <returns></returns>
        public static string RemoveSpaceHtmlTag(string Input)
        {
            string input = Input;
            //ȥhtml��ǩ
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
            //ȥ���˿ո��м����ո�
            input = Regex.Replace(input.Trim(), "\\s+", " ");
            return input;
        }


        #region ��ʽ���ı�����ֹSQLע�룩
        /// <summary>
        /// ��ʽ���ı�����ֹSQLע�룩
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
            html = regex1.Replace(html, ""); //����<script></script>���
            html = regex2.Replace(html, ""); //����href=javascript: (<A>) ����
            html = regex3.Replace(html, " _disibledevent="); //���������ؼ���on...�¼�
            html = regex4.Replace(html, ""); //����iframe
            html = regex5.Replace(html, ""); //����frameset
            //html = regex6.Replace(html, ""); //����frameset
            //html = regex7.Replace(html, ""); //����frameset
            //html = regex8.Replace(html, ""); //����frameset
            //html = regex9.Replace(html, "");
            html = regex10.Replace(html, "s_elect");
            html = regex11.Replace(html, "u_pudate");
            html = regex12.Replace(html, "d_elete");
            html = html.Replace("'", "��");
            html = html.Replace("&nbsp;", " ");
            //html = html.Replace("</strong>", "");
            //html = html.Replace("<strong>", "");
            return html;

        }
        #endregion



        #region ��ʽ���ı���������ݣ�
        /// <summary>
        /// ��ʽ���ı���������ݣ�
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
        /// ��ȡö�����ƣ�û�з��ؿ��ַ���...
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
        /// ��ȡö�����ƣ�û�з��ؿ��ַ���...
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
        /// ��ȡö�����ƣ�û�з��ؿ��ַ���...
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="Value"></param>
        /// <returns></returns>
        /// wlf.Common.Tools.GetEnumNameCombin<wlf.Common.enmн�����>(_drQInvite["qi_JobType"]._ToInt32(), "+")
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
        /// ������.�����������ڵ�ʱ����,���ص���ʱ���������ڲ�ľ���ֵ.
        /// </summary>
        /// <param name="DateTime1">��һ�����ں�ʱ��</param>
        /// <param name="DateTime2">�ڶ������ں�ʱ��</param>
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
                    dateDiff = (ts.Days + 1).ToString() + "��";
                else if (ts.Hours > 0)
                    dateDiff = ts.Hours.ToString() + "Сʱ";
                else if (ts.Minutes > 0)
                    dateDiff = ts.Minutes.ToString() + "����";
                else if (ts.Seconds > 0)
                    dateDiff = ts.Seconds.ToString() + "��";
            }
            catch
            {

            }
            return dateDiff;
        }
        /// <summary>
        /// ������.����һ��ʱ���뵱ǰ�������ں�ʱ���ʱ����,���ص���ʱ���������ڲ�ľ���ֵ.
        /// </summary>
        /// <param name="DateTime1">һ�����ں�ʱ��</param>
        /// <returns></returns>
        public static string DateDiff(DateTime DateTime1)
        {
            return DateDiff(DateTime1, DateTime.Now);
        }

        /// <summary>
        /// ������������ȡʱ���...
        /// </summary>
        /// <param name="seconds"></param>
        /// <returns></returns>
        public static string GetTimeBySeconds(int seconds)
        {
            DateTime t = DateTime.Now;
            return DateDiff(t.AddSeconds(seconds), t);
        }

        /// <summary>
        /// ��γ��֮��ľ���(ע�⣺��λ��km)
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
        /// ʵ�����ݵ��������뷨
        /// </summary>
        /// <param name="value">Ҫ���д��������</param>
        /// <param name="decimals">������С��λ��</param>
        /// <returns>���������Ľ��</returns>
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
        /// ��Object��������json��...
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
        /// ����ͼƬ...
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
            int c = 0; //ʵ�ʶ�ȡ���ֽ���
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
        /// ��ȡ�ַ������ȣ�һ�������������ֽ� 
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
        /// �õ����ܵ�һ��(������һΪ��һ��)  
        /// </summary>  
        /// <param name="datetime"></param>  
        /// <returns></returns>  
        public static DateTime GetWeekFirstDayMon(DateTime datetime)
        {
            //����һΪ��һ��  
            int weeknow = Convert.ToInt32(datetime.DayOfWeek);

            //��Ϊ��������һΪ��һ�죬����Ҫ�ж�weeknow����0ʱ��Ҫ��ǰ��6�졣  
            weeknow = (weeknow == 0 ? (7 - 1) : (weeknow - 1));
            int daydiff = (-1) * weeknow;

            //���ܵ�һ��  
            string FirstDay = datetime.AddDays(daydiff).ToString("yyyy-MM-dd");
            return Convert.ToDateTime(FirstDay);
        }

        /// <summary>  
        /// �õ��������һ��(��������Ϊ���һ��)  
        /// </summary>  
        /// <param name="datetime"></param>  
        /// <returns></returns>  
        public static DateTime GetWeekLastDaySun(DateTime datetime)
        {
            //������Ϊ���һ��  
            int weeknow = Convert.ToInt32(datetime.DayOfWeek);
            weeknow = (weeknow == 0 ? 7 : weeknow);
            int daydiff = (7 - weeknow);

            //�������һ��  
            string LastDay = datetime.AddDays(daydiff).ToString("yyyy-MM-dd");
            return Convert.ToDateTime(LastDay);
        }

        //base64������ı� תΪ    ͼƬ
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
                //MessageBox.Show("ת���ɹ���");
            }
            catch (Exception ex)
            {
                //MessageBox.Show("Base64StringToImage ת��ʧ��\nException��" + ex.Message);
            }
        }

        /// <summary>
        /// Сʱ
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
        /// ��
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
        /// ʱ��
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

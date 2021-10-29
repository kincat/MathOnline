using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Common
{
    public class FeedBackHelper
    {
        public static int evaluateSceneType { get; set; } = 2;
        public static int evaluateSystemId { get; set; } = 64;
        public static long ticks { get; set; } = DateTime.Now.Ticks;
        /// <summary>
        /// 签名
        /// 1. 对参数进行排序
        /// 2. 剔除空值参数
        /// 3. 剔除 sign 参数
        /// </summary>
        /// <param name="args">请求参数</param>
        /// <returns>签名结果</returns>
        private static string MakeSign(SortedDictionary<string, object> args)
        {
            StringBuilder buff = new StringBuilder();
            foreach (KeyValuePair<string, object> pair in args)
            {
                if (!"sign".Equals(pair.Key, StringComparison.OrdinalIgnoreCase) && pair.Value != null && pair.Value.ToString() != "")
                {
                    buff.AppendFormat("{0}={1}&", pair.Key, pair.Value);
                }
            }
            buff.Append("key=63c315d3a&*%￥@dea99d0223ecd4d74f8");

            var md5 = System.Security.Cryptography.MD5.Create();
            var bs = md5.ComputeHash(Encoding.UTF8.GetBytes(buff.ToString()));
            var sb = new StringBuilder();
            foreach (byte b in bs)
            {
                sb.Append(b.ToString("x2"));
            }
            return sb.ToString();
        }
        public static string GetFeedBackSignV2(long ticks, int evaluateSceneTypes = 0)
        {
            SortedDictionary<string, object> args = new SortedDictionary<string, object>();
            //args.Add("evaluateSceneId", 0);
            args.Add("evaluateSceneType", evaluateSceneTypes==0?evaluateSceneType: evaluateSceneTypes);
            args.Add("evaluateSystemId", evaluateSystemId);
            args.Add("ticks", ticks);
            return MakeSign(args);
        }

    }
}

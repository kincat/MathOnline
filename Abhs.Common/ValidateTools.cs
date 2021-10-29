using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Abhs.Common
{
   public  class ValidateTools
    {
        /// <summary>
        /// 校验时间格式 HH:mm
        /// </summary>
        /// <param name="StrSource"></param>
        /// <returns></returns>
        public static bool IsTime(string StrSource)
        {
            if (StrSource.Length != 5)
                return false;
            return Regex.IsMatch(StrSource, @"^((20|21|22|23|[0-1]?\d):[0-5]?\d)$");
        }
        /// <summary>
        /// 是否为时间型字符串
        /// </summary>
        /// <param name="source">时间字符串(15:00:00)</param>
        /// <returns></returns>
        public static bool IsTimes(string StrSource)
        {
            if (StrSource.Length != 8)
                return false;
            return Regex.IsMatch(StrSource, @"^((20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d)$");
        }
    }
}

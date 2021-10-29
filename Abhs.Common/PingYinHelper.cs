using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Common
{
    public class PingYinHelper
    {

        /// <summary>
        /// 汉字转首字母
        /// </summary>
        /// <param name="strChinese"></param>
        /// <returns></returns>
        public static string GetFirstSpell(string strChinese)
        {
            if (strChinese.Length > 1)
                strChinese = strChinese.Substring(0, 1);
           return  NPinyin.Pinyin.GetPinyin(strChinese).Substring(0,1);            
        }       
    }
}

using Abhs.Common.Enums;
using Abhs.Common.Extend;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Common
{
    /// <summary>
    /// 操作警告类型
    /// </summary>
    public class WarningHelper
    {
        /// <summary>
        /// 获取描述
        /// </summary>
        /// <param name="w"></param>
        /// <returns></returns>
        public static string GetDescription(int w)
        {
            WarningEnum type =IntConvertToEnum(w);
            string desc= type.ToDescription();
            if (desc.Contains("{0}"))
            {
                var rang = getWarningRule(type);
                desc = desc.Replace("{0}", rang.first.ToString());
                if (desc.Contains("{1}"))
                {
                    desc = desc.Replace("{1}", rang.second.ToString());
                }
            }
            return desc;
        }
        /// <summary>
        /// 获取描述
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static string GetDescription(WarningEnum type)
        {
            string desc = type.ToDescription();
            if (desc.Contains("{0}"))
            {
                var rang = getWarningRule(type);
                desc = desc.Replace("{0}", rang.first.ToString());
                if (desc.Contains("{1}"))
                {
                    desc = desc.Replace("{1}", rang.second.ToString());
                }
            }
            return desc;
        }
        public static WarningEnum IntConvertToEnum(int i)
        {
            if (Enum.IsDefined(typeof(WarningEnum), i))
            {
                return (WarningEnum)Enum.ToObject(typeof(WarningEnum), i);
            }
            return WarningEnum.其他;
        }
       
        public static WarningRule getWarningRule(WarningEnum type)
        {
            int first = 0;
            int second = 0;
           
            switch (type)
            {
                case WarningEnum.其他:
                    first = 0;
                    second = 0;
                    break;
                case WarningEnum.登录预警:
                    first = 3;
                    second = 0;
                    break;
                case WarningEnum.学习效率低:
                    first = 10;
                    second = 1;
                    break;
                case WarningEnum.学习不认真:
                    first = 5;
                    second = 3;
                    break;
                case WarningEnum.基础检测预警:
                    first = 3;
                    second = 0;
                    break;
                case WarningEnum.学习时退出:
                    first = 0;
                    second = 0;
                    break;
                case WarningEnum.连续两次降级:
                    first = 2;
                    second = 0;
                    break;
                case WarningEnum.连续两次冲级失败:
                    first = 2;
                    second = 0;
                    break;
                default:
                    break;
            }
            return new WarningRule { first=first, second=second };
        }
    }
    public class WarningRule
    {
        public int first { get; set; }
        public int second { get; set; }
    }

}

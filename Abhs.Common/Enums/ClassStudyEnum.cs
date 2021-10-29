using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Common.Enums
{
    /// <summary>
    /// 警告枚举
    /// </summary>
    public enum WarningEnum
    {
        其他 = 0,
        /// <summary>
        /// 3分钟没开始学习
        /// </summary>
        [Description("{0}分钟没开始学习")]
        登录预警 = 1,
        /// <summary>
        /// 10分钟没做完1题
        /// </summary>
        [Description("学习效率低。{0}分钟没做完{1}题")]
        学习效率低 = 2,
        /// <summary>
        /// 做题太快不看题,单题5秒，连续3题
        /// </summary>
        [Description("学习不认真，做题太快不看题。单题{0}秒，连续{1}题")]
        学习不认真 = 3,
        /// <summary>
        /// 基础检测3次未过（无提问）
        /// </summary>
        [Description("基础检测{0}次未过（无提问）")]
        基础检测预警 = 4,
        /// <summary>
        /// 同题型连错3题（无提问）
        /// </summary>
        [Description("同题型连错{0}题（无提问）")]
        错题预警 = 5,
        /// <summary>
        /// 学习新课时时退出
        /// </summary>
        [Description("学习新课时时退出")]
        学习时退出 = 6,
        /// <summary>
        /// 连续两次降到X-1
        /// </summary>
        [Description("连续{0}次降到X-1")]
        连续两次降级 = 7,
        /// <summary>
        /// 连续两次冲级失败
        /// </summary>
        [Description("连续{0}次冲级失败")]
        连续两次冲级失败 = 8,
    }
}

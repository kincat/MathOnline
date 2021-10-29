using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
    public class SpecContent
    {
        /// <summary>
        /// 总题数
        /// </summary>
        public int AllCount { get; set; }

        /// <summary>
        /// 错误题数
        /// </summary>
        public int ErrCount { get; set; }

        /// <summary>
        /// 未答题数
        /// </summary>
        public int NullCount { get; set; }

        /// <summary>
        /// 答题共花费时间 秒
        /// </summary>
        public int Times { get; set; }
    }
}

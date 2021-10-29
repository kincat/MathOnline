using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
    public class MessageEvaluate
    {
        /// <summary>
        /// 1 正面评价 2 负面评价 3 中肯评价
        /// </summary>
        public int type { get; set; }

        /// <summary>
        /// 评价内容
        /// </summary>
        public string content { get; set; }
    }
}

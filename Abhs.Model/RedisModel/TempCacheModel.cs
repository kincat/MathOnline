using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.RedisModel
{
    public class TempCacheModel
    {
        public int schoolId { get; set; }
        /// <summary>
        /// 0:未处理，1处理中
        /// </summary>
        public int status { get; set; } = 0;
        public DateTime updateTime { get; set; } = DateTime.Now;
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Common.Enums
{
    public enum EnumWeek
    {
        周日 = 0,
        周一 = 1,
        周二 = 2,
        周三 = 3,
        周四 = 4,
        周五 = 5,
        周六 = 6
    }

    public enum EnumPrepareStatus
    {
        已下架=-1,
        未备课=0,
        已备课=1,
        备课中=2
    }
    public enum EnumPrepareModel
    {
        错题巩固 = 1,
        智能学习 = 2,
        查漏补缺 = 3
    }

}

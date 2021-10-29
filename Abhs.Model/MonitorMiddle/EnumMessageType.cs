using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.MonitorMiddle
{
    public enum EnumMessageType
    {
        [Description("问题")]
        问题 = 1,
        [Description("预警")]
        预警 = 2,
        [Description("学情")]
        学情 = 3,
        [Description("特殊学情")]
        特殊学情 = 4
    }
}

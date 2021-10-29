using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.Common
{
    public class Result
    {
        public int code { get; set; } = PublicKey.SUCCESS_CODE;
        public string serverTime { get; set; } = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff");
        public string message { get; set; } = "success";
        public object data { get; set; } = new object();
    }
    public class LayUIResult
    {
        public string serverTime { get; set; } = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss");
        public int code { get; set; } = 0;
        public string msg { get; set; } = "";
        public int count { get; set; } = 0;
        public object data { get; set; }
    }
}

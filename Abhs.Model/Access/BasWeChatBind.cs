//------------------------------------------------------------------------------
// <auto-generated>
//    此代码是根据模板生成的。
//
//    手动更改此文件可能会导致应用程序中发生异常行为。
//    如果重新生成代码，则将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace Abhs.Model.Access
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bas_WeChatBind")]
    public partial class BasWeChatBind
    {
        public int uc_ID { get; set; }
        public string uc_OpenId { get; set; }
        public string uc_Session_key { get; set; }
        public int? uc_BindStudentId { get; set; }
        public DateTime uc_CreateTime { get; set; }
        public DateTime uc_LastLoginTime { get; set; }
        public int uc_LoginCount { get; set; }
        public string uc_Token { get; set; }
    }
}

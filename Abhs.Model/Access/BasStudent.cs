
namespace Abhs.Model.Access
{
    using Abhs.Model.Common;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("bas_Student")]
    public partial class BasStudent
    {
        public int s_ID { get; set; }
        public string s_Name { get; set; }
        public Nullable<int> s_Sex { get; set; }
        public Nullable<System.DateTime> s_Birthday { get; set; }
        public string s_Phone { get; set; }
        public string s_Address { get; set; }
        public int s_Gold { get; set; }
        public string s_LoginId { get; set; }
        public string s_Password { get; set; }
        public DateTime s_ValidDate { get; set; }
        public DateTime s_CreateDate { get; set; }
        public Nullable<System.DateTime> s_LastLoginDate { get; set; }
        public string s_LastLoginIP { get; set; }
        public string s_LastLoginArea { get; set; }
        public bool s_IsEnabled { get; set; }
        public int s_AccountType { get; set; }
        public DateTime s_ActivationDate { get; set; }
        public int s_OperatorId { get; set; }
        public string s_Note { get; set; }
        public int s_GradeSection { get; set; }
        public int s_LoginCount { get; set; }
        public string s_UserHead { get; set; }
        public string s_StudyTimes { get; set; }
        public int? s_DisableModel { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Common.Enums
{
    /// <summary>
    /// 系统标识
    /// </summary>
    public enum EnumSystemFlag
    {
        Math = 1,       //数学
        Physics = 2,    //物理
        Chemistry = 4   //化学
    }
    //public enum EnumClassStatus
    //{
    //    停用=0,
    //    正常=1,
    //    结课=2
    //}

    /// <summary>
    /// 性别
    /// </summary>
    public enum EnumSex
    {
        男 = 1,
        女
    }

    public enum EnumYesOrNo
    {
        否 = 0,
        是 = 1
    }

    /// <summary>
    /// 状态
    /// </summary>
    public enum EnumStatus
    {
        停用 = 0,
        正常 = 1,
        到期=2
    }


    /// <summary>
    /// 学段
    /// </summary>
    public enum EnumGradeSection
    {
        小学 = 1,
        初中 = 2,
        高中 = 3
    }
    /// <summary>
    /// 班级状态
    /// </summary>
    public enum EnumClassStatus
    {
        停用 = 0,
        正常 = 1,
        结课 = 2
    }
    public enum EnumStudentStatus
    {
        调班 = -2,
        删除 =-1,
        停用 = 0,
        正常 = 1,
        到期 = 2
    }
    /// <summary>
    /// 具体年级,Description 1表示显示，0不显示
    /// </summary>
    public enum EnumGradeYear
    {
        [Description("0")]
        一年级 = 1,
        [Description("0")]
        二年级 = 2,
        [Description("1")]
        三年级 = 3,
        [Description("1")]
        四年级 = 4,
        [Description("1")]
        五年级 = 5,
        [Description("1")]
        六年级 = 6,
        [Description("1")]
        七年级 = 7,
        [Description("1")]
        八年级 = 8,
        [Description("1")]
        九年级 = 9,
        [Description("0")]
        高一 = 10,
        [Description("0")]
        高二 = 11,
        [Description("0")]
        高三 = 12
    }

    /// <summary>
    /// 教材版本
    /// </summary>
    public enum EnumBook
    {
        人教版 = 1,
        沪教版 = 2,
        冀教版 = 3,
        湘教版 = 4,
        浙教版 = 5,
        沪科版 = 6,
        苏科版 = 7,
        华师版 = 8,
        北师大版 = 9,
        西师大版 = 10,
        新课改版 = 11,
        北京课改版 = 12,
        人教五四版 = 13,
        //沪教五四版 = 14,
        鲁教五四版 = 15,
        青岛版六三制 = 16,
        青岛版五四制 = 17,
        人教版1 = 18,
        人教版2 = 19,
        通用版=20
    }


    /// <summary>
    /// 学生类型
    /// </summary>
    public enum EnumStudentAccountType
    {
        试学账号 = 0,
        正式账号 = 1
    }
    public enum EnumSchoolAccountType
    {
        老师=1,
        校长=2
    }
    public enum EnumReportType
    {
        学习报告 = 1,
        提升报告 = 2,
        作业报告 = 3,
        任务报告 = 4
    }
}

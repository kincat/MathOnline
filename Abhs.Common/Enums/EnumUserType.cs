using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Common.Enums
{
    /// <summary>
    /// 用户类别
    /// </summary>
    public enum EnumUserType
    {
        学生 = 1,
        教师 = 2,
        教研 = 3
    }
    /// <summary>
    /// 标签类型
    /// </summary>
    public enum EnumMarkType
    {
        普通标签 = 1,
        知识点 = 2,
        题型 = 3
    }

    /// <summary>
    /// 普通标签分类
    /// </summary>
    public enum EnumMarkCat
    {
        单选 = 1,
        复选 = 2
    }

    /// <summary>
    /// 标签状态
    /// </summary>
    public enum EnumMarkState
    {
        已废止 = 0,
        正常使用 = 1
    }

    /// <summary>
    /// 题目标签关系表
    /// </summary>
    public enum EnumQuestionMarkRelation
    {
        主知识点 = 1,
        其他知识点 = 2,
        所属题型 = 3,
        通用标签 = 4
    }
    /// <summary>
    /// 任务类型
    /// </summary>
    public enum EnumTaskType
    {
        智能作业 = 1,
        布置任务 = 2
    }
    public enum EnumStudentMoudle
    {
        计算训练=1
    }
}


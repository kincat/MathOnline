using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Common.Enums
{
    /// <summary>
    /// 题目分类
    /// </summary>
    public enum EnumQuestionType
    {
        选择题 = 1,
        填空题 = 2,
        解答题 = 3
    }


    /// <summary>
    /// 题目状态
    /// </summary>
    public enum EnumQuestionState
    {
        草稿 = -2,
        待修改 = -21,
        待审核 = -1,
        审核通过 = 1,
        已废止 = 0
    }

    /// <summary>
    /// 题难易度
    /// </summary>
    public enum EnumQuestionDifficulty
    {
        一星 = 1,
        二星 = 2,
        三星 = 3,
        四星 = 4,
        五星 = 5
    }

    /// <summary>
    /// 错题是否掌握
    /// </summary>
    public enum EnumQuestionErrIsLearn
    {
        未掌握 = 1,

        已掌握 = 0
    }
}

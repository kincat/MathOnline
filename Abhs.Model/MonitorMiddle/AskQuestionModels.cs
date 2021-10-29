using Abhs.Common.Enums;
using Abhs.Model.Access;
using System;
using System.Collections.Generic;

namespace Abhs.Model.MonitorMiddle
{
    /// <summary>
    /// 提问项
    /// </summary>
    public class AskItem
    {
        /// <summary>
        /// 提问类型
        /// </summary>
        public EnumAdkType AskType { get; set; }

        /// <summary>
        /// 提问时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 主键 (课时内容ID 或者 题目ID )
        /// </summary>
        public int Pk { get; set; }

        /// <summary>
        /// 是否解答【我已学会】
        /// </summary>
        public bool IsAnswer { get; set; }

        /// <summary>
        /// 解答时间【学会时间】
        /// </summary>
        public DateTime? AnswerTime { get; set; }

        /// <summary>
        /// 所属上级ID (课时ID[课时内容ID] 或者 课时内容ID[对应题目ID])
        /// </summary>
        public int? SuperId { get; set; }

        /// <summary>
        /// 所属模块名称
        /// </summary>
        public string ModelName { get; set; }

        /// <summary>
        /// 步骤名称
        /// </summary>
        public string StepName { get; set; }


        /// <summary>
        /// 提问内容【提问类的JSON】
        /// </summary>
        public string AskContentJson { get; set; }

    }



    /// <summary>
    /// 普通题目提问
    /// </summary>
    public class QuestionAsk
    {
        /// <summary>
        /// 用户答案
        /// </summary>
        public string UserAnswer { get; set; }
    }

    /// <summary>
    /// 题型题目提问
    /// </summary>
    public class TypeQuestionAsk : QuestionAsk
    {
        /// <summary>
        /// 题型code
        /// </summary>
        public string TypeCode { get; set; }

        /// <summary>
        /// 难度
        /// </summary>
        public int Difficulty { get; set; }
    }



    /// <summary>
    /// 视频提问
    /// </summary>
    public class VideoAsk
    {
        /// <summary>
        /// 视频地址
        /// </summary>
        public string VideoUrl { get; set; }

        /// <summary>
        /// 视频名称
        /// </summary>
        public string VideoName { get; set; }

        /// <summary>
        /// 播放点
        /// </summary>
        public int VideoTimePoint { get; set; }

        /// <summary>
        /// 备注信息
        /// </summary>
        public string Remark { get; set; }
    }

    /// <summary>
    /// 提问类型
    /// </summary>
    public enum EnumAdkType
    {
        普通题目提问 = 1,
        题型题目提问 = 2,
        视频提问 = 3
    }
}

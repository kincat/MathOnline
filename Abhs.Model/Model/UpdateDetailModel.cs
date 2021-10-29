using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.Model
{
    public class UpdateDetailModel
    {
        public string TypeCode { get; set; }
        public string TypeTitle { get; set; }
        public int CurrentDifficulty { get; set; }
        public int PreviousDifficulty { get; set; }
        public int MaxDifficulty { get; set; }
        /// <summary>
        /// 学习时长秒
        /// </summary>
        public int StudyTimes { get; set; }
    }
    public class UserAnswerModel
    {
        public string UserAnswer { get; set; }
        public string FirstAnswer { get; set; }
        public string ChangeCount { get; set; }
        public int Time { get; set; }
        public string IsRight { get; set; }
        public DateTime CreateTime { get; set; }
    }
    public class UserErrorAnswer
    {
        public string Answer { get; set; }
        public List<UserAnswerModel> UserAnswerList { get; set; }
    }
}

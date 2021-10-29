using Abhs.Common.Enums;
using Abhs.Model.ViewModel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.Model
{
    public class ClassPackage
    {
        public int ClassID { get; set; }
        public int PackID { get; set; }
    }
    public class OptionView
    {
        public int id { get; set; }
        public int index { get; set; }
        /// <summary>
        /// 0未完成，1：已完成，2：备课中(2可能没有)
        /// </summary>
        public int status { get; set; }
    }
    public class VideoView
    {
        /// <summary>
        /// 视频路径
        /// </summary>
        public string VideoUrl { get; set; }
        /// <summary>
        /// 视频间的提示内容坐标点
        /// </summary>
        public List<PositionView> Points { get; set; }
    }
    public class PositionView
    {
        /// <summary>
        /// 位置，秒
        /// </summary>
        public int BegTime { get; set; }
        /// <summary>
        /// 文本
        /// </summary>
        public string Text { get; set; }
    }
    public class PrepareStep
    {
        public PrepareStep()
        {
            this.mistakes = 0;
            this.learnFilling = 0;
            this.learning = new List<LearnItem>();
        }
        public PrepareStep(List<LearnItem> learning, int mistakes)
        {
            this.learning = learning;
            this.mistakes = mistakes;
        }

        /// <summary>
        /// 错题巩固是否备完 1完成 0没完成
        /// </summary>
        public int mistakes { get; set; }

        /// <summary>
        /// 智能学习是否备完
        /// </summary>
        public int learnFinish
        {
            get
            {
                // 还有未备完的课时内容
                if (this.learning.Where(x => x.status == 0).Count() > 0)
                {
                    return 0;
                }                    
                else
                {
                    return 1;
                }
            }
        }

        /// <summary>
        /// 查漏补缺是否完成 1完成 0没完成
        /// </summary>
        public int learnFilling { get; set; } = 0;

        /// <summary>
        /// 智能学习课时内容备课列表
        /// </summary>
        public List<LearnItem> learning { get; set; }


        public int mistakesTime { get; set; } = 0;


        public int learningTime { get; set; } = 0;


        public int learnFillingTime { get; set; } = 0;
        /// <summary>
        /// 获取整个json
        /// </summary>
        /// <returns></returns>
        public string GetJson()
        {
            return JsonConvert.SerializeObject(this);
        }
        /// <summary>
        /// 获取智能学习json
        /// </summary>
        /// <returns></returns>
        public string GetLearnJson()
        {
            return JsonConvert.SerializeObject(this.learning);
        }
        public string Init(string json)
        {
            this.mistakes = 0;
            this.learnFilling = 0;
            this.mistakesTime = 0;
            this.learnFillingTime = 0;
            this.learningTime = 0;          
            var info= JsonConvert.DeserializeObject<PrepareStep>(json);
            this.learning = ClearLearn(info.learning);
            return JsonConvert.SerializeObject(this);
        }
        private List<LearnItem> ClearLearn(List<LearnItem> list)
        {
            foreach (var item in list)
            {
                item.status = 0;
                foreach (var it in item.list)
                {
                    it.status = 1;
                    int index = 0;
                    foreach (var level in it.levelList)
                    {
                        level.status = index==0?1:0;
                        index++;
                    }
                }
            }
            return list;
        }
        
        /// <summary>
        /// 课时内容ID
        /// </summary>
        /// <param name="itemId"></param>
        /// <param name="code">题型code</param>
        /// <param name="status">1：是，2否</param>
        public void SetFinishStatus(int itemId,string code,int status,List<QuestionTypeCondition> list)
        {
            var temp = this.learning.FirstOrDefault(x => x.itemId == itemId);
            var modelIndex = this.learning.FindIndex(x => x.itemId == itemId);
            if (temp != null)
            {               
                var question = temp.list.FirstOrDefault(x => x.code == code);
                if (question != null)
                {
                    if (list != null && list.Count > 0)
                    {
                        var typeList = question.levelList;
                        foreach (var item in list)
                        {
                            var index = typeList.FindIndex(x => x.level == item.level);
                            if (index >= 0)
                            {
                                typeList.RemoveAt(index);
                                typeList.Insert(index,new QuestionLevel { level = item.level, levelName = item.level + "星", status = 1, timeCount = item.timeCount });
                            }
                        }
                        question.levelList = typeList;
                    }
                    question.status = status;
                }
                temp.status = (int)EnumPrepareStatus.已备课;
            }
            if (modelIndex >= 0)
            {
                this.learning.RemoveAt(modelIndex);
                this.learning.Insert(modelIndex, temp);
            }
            this.learning = this.learning.OrderBy(x => x.index).ToList();
        }
        /// <summary>
        /// 计算进度
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        public int GetProcess()
        {
            //错题巩固1，智能提升按照课时内容定，查漏补缺1
            int all = 1 + this.learning.Count + 1;
            int finish = (this.mistakes == 1 ? 1 : 0) + CountLearn(this.learning) + (this.learnFilling == 1 ? 1 : 0);
            return (finish*100) / all;
        }
        /// <summary>
        /// 计算智能学习的进度
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        private int CountLearn(List<LearnItem> list)
        {
            return list.Where(x => x.status == 1).Count();
        }
    }

    /// <summary>
    /// 课时内容备课项
    /// </summary>
    public class LearnItem
    {
        /// <summary>
        /// 课时内容ID
        /// </summary>
        public int itemId { get; set; }

        public int index { get; set; }

        /// <summary>
        /// 0:还未提交课时内容备课 1:已经提交课时内容备课
        /// </summary>
        public int status { get; set; }

        public List<LearnQuestionType> list { get; set; }
    }
    public class LearnQuestionType
    {
        /// <summary>
        /// 题型Code
        /// </summary>
        public string code { get; set; }
        /// <summary>
        /// 是否选择：0:未操作，1：已选是，2：否
        /// </summary>
        public int status { get; set; }
        public List<QuestionLevel> levelList{ get;set;}
       
    }
    public class QuestionLevel
    {
        public int level { get; set; }
        public string levelName { get; set; }
        public int status { get; set; } = 0;
        //浏览时长
        public int timeCount { get; set; } = 0;
    }

}
 

using Abhs.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Abhs.Common
{
    public static class QuestionCommon
    {
        public static D Mapper<D, S>(S s)
        {
            D d = Activator.CreateInstance<D>(); //构造新实例
            try
            {
                var Types = s.GetType();//获得类型  
                var Typed = typeof(D);
                foreach (PropertyInfo sp in Types.GetProperties())//获得类型的属性字段  
                {
                    foreach (PropertyInfo dp in Typed.GetProperties())
                    {
                        if (dp.Name == sp.Name && dp.PropertyType == sp.PropertyType && dp.Name != "Error" && dp.Name != "Item")//判断属性名是否相同  
                        {
                            dp.SetValue(d, sp.GetValue(s, null), null);//获得s对象属性的值复制给d对象的属性  
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return d;
        }

        /// <summary>
        /// 题目中有多少个空
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static int GetBlanksCount(string strQuestionText)
        {
            MatchCollection mc = Regex.Matches(strQuestionText, "(\\[%(.*?)%\\])|(\\[:(.*?):\\])");
            return mc.Count;
        }


        /// <summary>
        /// 去掉答案中无效的字符...
        /// </summary>
        /// <param name="Answer"></param>
        /// <returns></returns>
        public static string CurtailAnswer(string Answer)
        {
            if (string.IsNullOrEmpty(Answer))
                return string.Empty;

            //去掉<img>标签...
            Regex MyRegex = new Regex("<img[^>]+?data-latex=\"([^\"]+?)\"[^>] +?>", RegexOptions.IgnoreCase
                                                | RegexOptions.Multiline
                                                | RegexOptions.IgnorePatternWhitespace
                                                | RegexOptions.Compiled
                                                );

            Answer = MyRegex.Replace(Answer, "$$$1$$");

            MyRegex = new Regex("<sub[^>]*?>(.*?)</sub>", RegexOptions.IgnoreCase
                                                | RegexOptions.Multiline
                                                | RegexOptions.IgnorePatternWhitespace
                                                | RegexOptions.Compiled
                                                );
            Answer = MyRegex.Replace(Answer, "<sub>$1</sub>");


            MyRegex = new Regex("<sup[^>]*?>(.*?)</sup>", RegexOptions.IgnoreCase
                                               | RegexOptions.Multiline
                                               | RegexOptions.IgnorePatternWhitespace
                                               | RegexOptions.Compiled
                                               );
            Answer = MyRegex.Replace(Answer, "<sup>$1</sup>");

            return Answer;
        }


        /// <summary>
        /// 闭环的解答题解析
        /// </summary>
        /// <param name="strAnswer"></param>
        /// <returns></returns>
        public static string PackageReplaceFillBlanksAnswer(string strAnswer)
        {
            if (string.IsNullOrEmpty(strAnswer))
                return string.Empty;

            //替换[%%]文字之间的答案...
            Regex MyRegex = new Regex("\\[%(.*?)%\\]", RegexOptions.IgnoreCase
                                                        | RegexOptions.Multiline
                                                        | RegexOptions.IgnorePatternWhitespace
                                                        | RegexOptions.Compiled
                                                        );

            MatchCollection mc = MyRegex.Matches(strAnswer);

            if (mc.Count > 0)
            {
                strAnswer = mc.Cast<Match>().Aggregate(strAnswer, (current, m) => current.Replace(m.Groups[0].Value, "<div class='quizPutTag' style='min-width:50px;font-weight:normal; ' contenteditable='true' spellcheck='false' answer='" + Encrypt.EncryptByAES(m.Groups[1].Value) + "'></div>"));
            }

            //替换[::]文字之间的答案...
            MyRegex = new Regex("\\[:(.*?):\\]", RegexOptions.IgnoreCase
                                                 | RegexOptions.Multiline
                                                 | RegexOptions.IgnorePatternWhitespace
                                                 | RegexOptions.Compiled
                );

            mc = MyRegex.Matches(strAnswer);
            if (mc.Count > 0)
            {
                List<string> aList = new List<string>();
                int index = 0;
                foreach (Match m in mc)
                {
                    // 确定答案的占位个数
                    int bu = (m.Groups[1].Value.Split(';')[0].Length) - 6;
                    var val = "";
                    for (int i = 0; i < bu; i++)
                    {
                        val += "*";
                    }
                    val = val == "" ? "*" : val;

                    int begIndex = strAnswer.IndexOf(m.Groups[0].Value, StringComparison.Ordinal);

                    index++;
                    string tmp = "";
                    if (index < 10)
                    {
                        tmp = "00" + index;
                    }
                    else if (index < 100)
                    {
                        tmp = "0" + index;
                    }
                    else
                    {
                        tmp = index.ToString();
                    }

                    strAnswer = strAnswer.Remove(begIndex, m.Groups[0].Value.Length).Insert(begIndex, "[:" + tmp + val + ":]");
                    aList.Add(Encrypt.EncryptByAES(m.Groups[1].Value));
                }

                strAnswer += string.Format("<span class='spanflagAnswers' style='display:none;'>{0}</span>", string.Join(",", aList.ToArray())  );
            }

            //替换[##]知识点...
            MyRegex = new Regex("\\[#(.*?)#\\]", RegexOptions.IgnoreCase
                                                        | RegexOptions.Multiline
                                                        | RegexOptions.IgnorePatternWhitespace
                                                        | RegexOptions.Compiled
                                                        );

            mc = Regex.Matches(strAnswer, "\\[#(.*?)#\\]");

            return strAnswer;
        }
        public static string PackageReplaceFillBlanksAnswers(string strAnswer,bool isShowAnswer=true)
        {
            if (string.IsNullOrEmpty(strAnswer))
                return string.Empty;

            //替换[%%]文字之间的答案...
            Regex MyRegex = new Regex("\\[%(.*?)%\\]", RegexOptions.IgnoreCase
                                                        | RegexOptions.Multiline
                                                        | RegexOptions.IgnorePatternWhitespace
                                                        | RegexOptions.Compiled
                                                        );

            MatchCollection mc = MyRegex.Matches(strAnswer);

            if (mc.Count > 0)
            {
                if (isShowAnswer)
                {
                    strAnswer = mc.Cast<Match>().Aggregate(strAnswer, (current, m) => current.Replace(m.Groups[0].Value, "<div class='quizPutTag' style='min-width:50px;font-weight:normal; ' contenteditable='false' spellcheck='false' answer='" + Encrypt.EncryptByAES(m.Groups[1].Value) + "'>" + m.Groups[1].Value + "</div>"));
                }
                else
                {
                    strAnswer = mc.Cast<Match>().Aggregate(strAnswer, (current, m) => current.Replace(m.Groups[0].Value, "<div class='quizPutTag' style='min-width:50px;font-weight:normal; ' contenteditable='false' spellcheck='false' answer=''> </div>"));
                }
            }

            //替换[::]文字之间的答案...
            MyRegex = new Regex("\\[:(.*?):\\]", RegexOptions.IgnoreCase
                                                 | RegexOptions.Multiline
                                                 | RegexOptions.IgnorePatternWhitespace
                                                 | RegexOptions.Compiled
                );

            mc = MyRegex.Matches(strAnswer);
            if (mc.Count > 0)
            {
                List<string> aList = new List<string>();
                int index = 0;
                foreach (Match m in mc)
                {
                    // 确定答案的占位个数
                    int bu = (m.Groups[1].Value.Split(';')[0].Length) - 6;
                    var val = "";
                    for (int i = 0; i < bu; i++)
                    {
                        val += "*";
                    }
                    val = val == "" ? "*" : val;

                    int begIndex = strAnswer.IndexOf(m.Groups[0].Value, StringComparison.Ordinal);

                    index++;
                    string tmp = "";
                    if (index < 10)
                    {
                        tmp = "00" + index;
                    }
                    else if (index < 100)
                    {
                        tmp = "0" + index;
                    }
                    else
                    {
                        tmp = index.ToString();
                    }

                    strAnswer = strAnswer.Remove(begIndex, m.Groups[0].Value.Length).Insert(begIndex, "[:" + tmp + val + ":]");
                    aList.Add(Encrypt.EncryptByAES(m.Groups[1].Value));
                }

                strAnswer += string.Format("<span class='spanflagAnswers' style='display:none;'>{0}</span>", string.Join(",", aList.ToArray()));
            }

            //替换[##]知识点...
            MyRegex = new Regex("\\[#(.*?)#\\]", RegexOptions.IgnoreCase
                                                        | RegexOptions.Multiline
                                                        | RegexOptions.IgnorePatternWhitespace
                                                        | RegexOptions.Compiled
                                                        );

            mc = Regex.Matches(strAnswer, "\\[#(.*?)#\\]");
            if (mc.Count > 0)
            {
                foreach (Match m in mc)
                {
                    // 不显示
                    strAnswer = strAnswer.Replace(m.Groups[0].Value, "");
                }
            }
            return strAnswer;
        }


        public static string ReplaceFillBlanksAnswer(string strAnswer)
        {
            if (string.IsNullOrEmpty(strAnswer))
                return string.Empty;

            //替换[%%]文字之间的答案...
            Regex MyRegex = new Regex("\\[%(.*?)%\\]", RegexOptions.IgnoreCase
                                                        | RegexOptions.Multiline
                                                        | RegexOptions.IgnorePatternWhitespace
                                                        | RegexOptions.Compiled
                                                        );

            MatchCollection mc = MyRegex.Matches(strAnswer);

            if (mc.Count > 0)
            {
                strAnswer = mc.Cast<Match>().Aggregate(strAnswer, (current, m) => current.Replace(m.Groups[0].Value, "<div class='quizPutTag' style='min-width:50px;font-weight:normal;vertical-align:middle;min-height:25px; text-align:center; padding:0px; line-height:24px;' contenteditable='true' spellcheck='false' answer='" + Encrypt.EncryptByAES(m.Groups[1].Value) + "'></div>"));
            }

            //替换[::]文字之间的答案...
            MyRegex = new Regex("\\[:(.*?):\\]", RegexOptions.IgnoreCase
                                                 | RegexOptions.Multiline
                                                 | RegexOptions.IgnorePatternWhitespace
                                                 | RegexOptions.Compiled
                );

            mc = MyRegex.Matches(strAnswer);
            if (mc.Count > 0)
            {
                List<string> aList = new List<string>();
                int index = 0;
                foreach (Match m in mc)
                {
                    // 确定答案的占位个数
                    int bu = (m.Groups[1].Value.Split(';')[0].Length) - 6;
                    var val = "";
                    for (int i = 0; i < bu; i++)
                    {
                        val += "*";
                    }
                    val = val == "" ? "*" : val;

                    int begIndex = strAnswer.IndexOf(m.Groups[0].Value, StringComparison.Ordinal);

                    index++;
                    string tmp = "";
                    if (index < 10)
                    {
                        tmp = "00" + index;
                    }
                    else if (index < 100)
                    {
                        tmp = "0" + index;
                    }
                    else
                    {
                        tmp = index.ToString();
                    }

                    strAnswer = strAnswer.Remove(begIndex, m.Groups[0].Value.Length).Insert(begIndex, "₧");

                    aList.Add(Encrypt.EncryptByAES(m.Groups[1].Value));
                }

                strAnswer += string.Format("<span class='spanflagAnswers' style='display:none;'>{0}</span>",string.Join(",", aList.ToArray()));
            }

            //替换[##]知识点...
            MyRegex = new Regex("\\[#(.*?)#\\]", RegexOptions.IgnoreCase
                                                        | RegexOptions.Multiline
                                                        | RegexOptions.IgnorePatternWhitespace
                                                        | RegexOptions.Compiled
                                                        );

            mc = Regex.Matches(strAnswer, "\\[#(.*?)#\\]");

            if (mc.Count > 0)
            {
                foreach (Match m in mc)
                {
                    // 不显示
                    strAnswer = strAnswer.Replace(m.Groups[0].Value, "");
                }
            }

            return strAnswer;
        }
    }
}

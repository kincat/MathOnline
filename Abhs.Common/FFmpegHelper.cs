using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Abhs.Common
{
   public  class FFmpegHelper
    {
        public static string GetVideoLength(string url)
        {
            string ffmpegPath = AppDomain.CurrentDomain.BaseDirectory + @"Content\ffmpeg.exe";
            string output;
            string error;
            ExecuteCommand("\"" + ffmpegPath + "\"" + " -i " + "\"" + url + "\"", out output, out error);
            //通过正则表达式获取信息里面的宽度信息
            //Regex regex = new Regex("(\\d{2,4})x(\\d{2,4})", RegexOptions.Compiled);
            //获取视频时长
            Regex regex = new Regex(": (\\d{2,4}):(\\d{2,4}):(\\d{2,4})", RegexOptions.Compiled);
            Match m = regex.Match(error);
            string video = m.Groups[0].Value;
            if (string.IsNullOrEmpty(video))
                return "";
            return video.Substring(2);

        }
        public static void ExecuteCommand(string command, out string output, out string error)
        {
            try
            {
                //创建一个进程
                Process pc = new Process();
                pc.StartInfo.FileName = command;
                pc.StartInfo.UseShellExecute = false;
                pc.StartInfo.RedirectStandardOutput = true;
                pc.StartInfo.RedirectStandardError = true;
                pc.StartInfo.CreateNoWindow = true;
                //启动进程
                pc.Start();
                //准备读出输出流和错误流
                string outputData = string.Empty;
                string errorData = string.Empty;
                pc.BeginOutputReadLine();
                pc.BeginErrorReadLine();

                pc.OutputDataReceived += (ss, ee) =>
                {
                    outputData += ee.Data;
                };
                pc.ErrorDataReceived += (ss, ee) =>
                {
                    errorData += ee.Data;
                };

                //等待退出
                pc.WaitForExit();
                //关闭进程
                pc.Close();
                //返回流结果
                output = outputData;
                error = errorData;
            }
            catch (Exception)
            {
                output = null;
                error = null;
            }
        }
    }
}

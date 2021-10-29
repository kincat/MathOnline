using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Common
{
    /// <summary>
    /// 验证码生成工具类
    /// </summary>
    ///


    public class ValidateCodeHelper
    {
        private static Random rand = new Random();
        private static string code;
        /// <summary>
        /// 随机生成指定长度的验证码
        /// </summary>
        /// <param name="length"></param>
        /// <returns></returns>
        public static string GetCode(int length)
        {
            string codes = "AaBbCcDdEeFfJjHhiJjKkMmNnPpQRSsTtUuVvWwXxYyZz23456789";
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < length; i++)
            {
                int index = rand.Next(codes.Length);
                if (sb.ToString().Contains(codes[index]))
                {

                    i--;
                    continue;
                }
                sb.Append(codes[index]);
            }
            code = sb.ToString();
            return code;

        }

        /// <summary>
        /// 获取随机颜色
        /// </summary>
        /// <returns></returns>
        private static Color GetRandomColor()
        {


            int red = rand.Next(10, 255);
            int green = rand.Next(10, 255);
            int blue = rand.Next(10, 255);

            return Color.FromArgb(red, green, blue);
        }



        /// <summary>
        /// 生成验证码
        /// </summary>
        /// <returns></returns>
        public static byte[] ValidateCode(string code)
        {

            Bitmap img = new Bitmap(100, 30);
            Graphics g = Graphics.FromImage(img);
            g.FillRectangle(Brushes.White, 0, 0, img.Width, img.Height);
            g.DrawRectangle(new Pen(Color.Black), 1, 1, img.Width - 2, img.Height - 2);
            Brush bush = new SolidBrush(Color.SteelBlue);
            g.DrawString(code, new Font("黑体", 20, FontStyle.Italic), bush, 10, 2);
            Random r = new Random();
            //画线条
            for (int i = 0; i < 5; i++)
            {
                g.DrawLine(new Pen(GetRandomColor()), r.Next(img.Width), r.Next(img.Height), r.Next(img.Width), r.Next(img.Height));
            }
            //画躁点
            for (int i = 0; i < 100; i++)
            {
                img.SetPixel(r.Next(img.Width), r.Next(img.Height), GetRandomColor());
            }
            MemoryStream ms = new MemoryStream();
            img.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);

            byte[] data = ms.GetBuffer();
            g.Dispose();
            ms.Close();
            return data;
        }



        /// <summary>
        /// 生成验证码
        /// </summary>
        /// <param name="code">验证码</param>
        /// <param name="fontColor">验证码颜色</param>
        /// <returns></returns>
        public static byte[] ValidateCode(string code, Color fontColor)
        {

            Bitmap img = new Bitmap(100, 30);
            Graphics g = Graphics.FromImage(img);

            g.FillRectangle(Brushes.White, 0, 0, img.Width, img.Height);

            Brush bush = new SolidBrush(fontColor);
            g.DrawString(code, new Font("黑体", 20, FontStyle.Italic), bush, 10, 2);
            Random r = new Random();
            //画线条
            for (int i = 0; i < 5; i++)
            {
                g.DrawLine(new Pen(GetRandomColor()), r.Next(img.Width), r.Next(img.Height), r.Next(img.Width), r.Next(img.Height));
            }
            //画躁点
            for (int i = 0; i < 100; i++)
            {
                img.SetPixel(r.Next(img.Width), r.Next(img.Height), GetRandomColor());
            }
            MemoryStream ms = new MemoryStream();
            img.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);

            byte[] data = ms.GetBuffer();
            g.Dispose();
            ms.Close();
            return data;
        }
        /// <summary>
        /// 生成验证码
        /// </summary>
        /// <param name="code">验证码</param>
        /// <param name="fontColor">验证码颜色</param>
        /// <param name="backgroundColor">验证码背景颜色</param>
        /// <returns></returns>
        public static byte[] ValidateCode(string code, Color backgroundColor, Color fontColor)
        {

            Bitmap img = new Bitmap(100, 30);
            Graphics g = Graphics.FromImage(img);
            Brush bush1 = new SolidBrush(backgroundColor);
            g.FillRectangle(bush1, 0, 0, img.Width, img.Height);
            Brush bush = new SolidBrush(fontColor);
            g.DrawString(code, new Font("黑体", 20, FontStyle.Italic), bush, 10, 2);
            Random r = new Random();
            //画线条
            for (int i = 0; i < 5; i++)
            {
                g.DrawLine(new Pen(GetRandomColor()), r.Next(img.Width), r.Next(img.Height), r.Next(img.Width), r.Next(img.Height));
            }
            //画躁点
            for (int i = 0; i < 100; i++)
            {
                img.SetPixel(r.Next(img.Width), r.Next(img.Height), GetRandomColor());
            }
            MemoryStream ms = new MemoryStream();
            img.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);

            byte[] data = ms.GetBuffer();
            g.Dispose();
            ms.Close();
            return data;
        }

        /// <summary>
        /// 判断验证码是否正确
        /// </summary>
        /// <param name="Code"></param>
        /// <returns></returns>
        public static bool IsValidate(string Code)
        {

            if (string.IsNullOrEmpty(Code) || !code.ToLower().Equals(Code.ToLower()))
            {

                return false;
            }

            return true;
        }
    }
}

 
 

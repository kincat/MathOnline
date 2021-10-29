using System;
using System.Collections.Generic;
using System.Text;
using System.Security;
using System.Security.Cryptography;
using System.IO;
using System.Runtime.InteropServices;
using System.Management;
using System.Configuration;
using System.Text.RegularExpressions;

namespace Abhs.Common
{

    public class Encrypt
    {

        private static string _strKey = "abcdefgh"; //URL传输参数加密Key        
        public static string _strMD5Append = "w.l.f.eng"; //MD5加密时增加的串


        #region  公用接口

        /// <summary>
        /// 数据加密操作
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string MD5(string str)
        {
            if (string.IsNullOrEmpty(str)) return "";

            var md5 = System.Security.Cryptography.MD5.Create();
            return BitConverter.ToString(md5.ComputeHash(Encoding.UTF8.GetBytes(str))).Replace("-", null);

            //string Sstr = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(str, "MD5");
            //return Sstr;
        }


        /// <summary>
        /// 加密可用于URL传输的字符串
        /// </summary>
        /// <param name="strEncrypt">需要加密的原文</param>
        /// <returns></returns>
        public static string EncryptQueryString(string strEncrypt)
        {
            DESCryptoServiceProvider des = new DESCryptoServiceProvider(); //把字符串放到byte数组中 

            byte[] inputByteArray = Encoding.Default.GetBytes(strEncrypt);

            des.Key = ASCIIEncoding.ASCII.GetBytes(_strKey); //建立加密对象的密钥和偏移量



            des.IV = ASCIIEncoding.ASCII.GetBytes(_strKey); //原文使用ASCIIEncoding.ASCII方法的GetBytes方法 
            MemoryStream ms = new MemoryStream(); //使得输入密码必须输入英文文本
            CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);

            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();

            StringBuilder ret = new StringBuilder();
            foreach (byte b in ms.ToArray())
            {
                ret.AppendFormat("{0:X2}", b);
            }
            ret.ToString();
            return ret.ToString();
        }


        /// <summary>
        /// 解密URL传输的字符串
        /// </summary>
        /// <param name="strDecrypt">需要解密的原文</param>
        /// <returns></returns>
        public static string DecryptQueryString(string strDecrypt)
        {
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();

            byte[] inputByteArray = new byte[strDecrypt.Length / 2];
            for (int x = 0; x < strDecrypt.Length / 2; x++)
            {
                int i = (Convert.ToInt32(strDecrypt.Substring(x * 2, 2), 16));
                inputByteArray[x] = (byte)i;
            }

            des.Key = ASCIIEncoding.ASCII.GetBytes(_strKey); //建立加密对象的密钥和偏移量，此值重要，不能修改 
            des.IV = ASCIIEncoding.ASCII.GetBytes(_strKey);
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);

            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();

            StringBuilder ret = new StringBuilder(); //建立StringBuild对象，CreateDecrypt使用的是流对象，必须把解密后的文本变成流对象 

            return System.Text.Encoding.Default.GetString(ms.ToArray());
        }

        #endregion


        const string AES_IV = "1234567890000000";//16位    
        const string AES_KEY = "12345678900000001234567890000000";

        /// <summary>
        /// AES加密
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string EncryptByAES(string input)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(AES_KEY.Substring(0, 32));
            using (AesCryptoServiceProvider aesAlg = new AesCryptoServiceProvider())
            {
                aesAlg.Key = keyBytes;
                aesAlg.IV = Encoding.UTF8.GetBytes(AES_IV.Substring(0, 16));

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(input);
                        }
                        byte[] bytes = msEncrypt.ToArray();
                        return ByteArrayToHexString(bytes);
                    }
                }
            }
        }

        /// <summary>
        /// AES解密
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string DecryptByAES(string input)
        {
            byte[] inputBytes = HexStringToByteArray(input);
            byte[] keyBytes = Encoding.UTF8.GetBytes(AES_KEY.Substring(0, 32));
            using (AesCryptoServiceProvider aesAlg = new AesCryptoServiceProvider())
            {
                aesAlg.Key = keyBytes;
                aesAlg.IV = Encoding.UTF8.GetBytes(AES_IV.Substring(0, 16));

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                using (MemoryStream msEncrypt = new MemoryStream(inputBytes))
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srEncrypt = new StreamReader(csEncrypt))
                        {
                            return srEncrypt.ReadToEnd();
                        }
                    }
                }
            }
        }


        /// <summary>
        /// 将指定的16进制字符串转换为byte数组
        /// </summary>
        /// <param name="s">16进制字符串(如：“7F 2C 4A”或“7F2C4A”都可以)</param>
        /// <returns>16进制字符串对应的byte数组</returns>
        private static byte[] HexStringToByteArray(string s)
        {
            s = s.Replace(" ", "");
            byte[] buffer = new byte[s.Length / 2];
            for (int i = 0; i < s.Length; i += 2)
                buffer[i / 2] = (byte)Convert.ToByte(s.Substring(i, 2), 16);
            return buffer;
        }

        /// <summary>
        /// 将一个byte数组转换成一个格式化的16进制字符串
        /// </summary>
        /// <param name="data">byte数组</param>
        /// <returns>格式化的16进制字符串</returns>
        private static string ByteArrayToHexString(byte[] data)
        {
            StringBuilder sb = new StringBuilder(data.Length * 3);
            foreach (byte b in data)
            {
                //16进制数字
                sb.Append(Convert.ToString(b, 16).PadLeft(2, '0'));
                //16进制数字之间以空格隔开
                //sb.Append(Convert.ToString(b, 16).PadLeft(2, '0').PadRight(3, ' '));
            }
            return sb.ToString().ToUpper();
        }
    }
}
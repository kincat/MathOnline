using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Common
{
    public class ExcelHelper
    {
        public static void ExportExcel(List<Dictionary<string,string>> list)
        {
            //if (model == null) return string.Empty;
            //string tempDirPath = AppDomain.CurrentDomain.BaseDirectory+"/Templates/Excel/");
            //if (!Directory.Exists(tempDirPath))
            //{
            //    Directory.CreateDirectory(tempDirPath);
            //}
            IWorkbook workbook =  new HSSFWorkbook();
            //string excelTempPath = tempDirPath + "quotaExcelTemp-new.xls";
            ////加载excel模板
            //using (FileStream fs = new FileStream(excelTempPath, FileMode.Open, FileAccess.Read))
            //{
            //    //XSSFWorkbook 适用XLSX格式，HSSFWorkbook 适用XLS格式
            //    workbook = new HSSFWorkbook(fs);
            //}

            ISheet sheet = workbook.CreateSheet("sheet1");


            int count = list.Count;
            int rows = 0;
            for (int i = 0; i < count; i++)
            {
                int r = rows + i;
                sheet.CreateRow(rows + i);
                var dic = list[i];
                int j = 0;
                var row = sheet.GetRow(r);
                foreach (var key in dic.Keys)
                {
                    row.CreateCell(j);
                    row.GetCell(j).SetCellValue(dic[key]);
                    j++;
                }                 
            }
            string fileName = @"D:\"+Guid.NewGuid().ToString()+".xls";
            //if (File.Exists(fileName))
            //{
            //    File.Delete(fileName);
            //}
            FileStream file = new FileStream(fileName, FileMode.CreateNew, FileAccess.Write);
            workbook.Write(file);//book写到file
            file.Dispose();
            workbook.Close();
        }
        /// <summary>
        /// 给Excel添加边框
        /// </summary>
        private ICellStyle SetCellStyle(HSSFWorkbook hssfworkbook, HorizontalAlignment ha)
        {
            ICellStyle cellstyle = hssfworkbook.CreateCellStyle();
            cellstyle.Alignment = ha;

            //有边框
            cellstyle.BorderBottom = BorderStyle.Thin;
            cellstyle.BorderLeft = BorderStyle.Thin;
            cellstyle.BorderRight = BorderStyle.Thin;
            cellstyle.BorderTop = BorderStyle.Thin;
            return cellstyle;
        }
    }
}

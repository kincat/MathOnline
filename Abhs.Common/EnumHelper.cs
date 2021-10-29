using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Common
{
    public static class EnumHelper
    {
        public static string GetDescription(this Enum value)
        {
            FieldInfo field = value.GetType().GetField(value.ToString());
            DescriptionAttribute attribute = Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute)) as DescriptionAttribute;

            return attribute == null ? value.ToString() : attribute.Description;
        }

        public static string GetEnumDesc(this Type e, int? value)
        {
            FieldInfo[] fields = e.GetFields();
            for (int i = 1, count = fields.Length; i < count; i++)
            {
                if ((int)System.Enum.Parse(e, fields[i].Name) == value)
                {
                    DescriptionAttribute[] EnumAttributes = (DescriptionAttribute[])fields[i].
                GetCustomAttributes(typeof(DescriptionAttribute), false);
                    if (EnumAttributes.Length > 0)
                    {
                        return EnumAttributes[0].Description;
                    }
                }
            }
            return "";
        }
    }
}

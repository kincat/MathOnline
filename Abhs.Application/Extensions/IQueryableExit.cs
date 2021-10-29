using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application.Extensions
{
    public static class IQueryableExit
    { /// <summary>
      /// 模糊查询一组数据，满足一组数据的模糊查询
      /// </summary>
      /// <typeparam name="T">查询列表类型</typeparam>
      /// <param name="sqlData">查询数据源</param>
      /// <param name="array">模糊查询条件</param>
      /// <param name="propertyName">要模糊查询的属性</param>
      /// <returns>返回模糊查询后的结果</returns>
        public static IQueryable<T> QueryLikeArray<T>(this IQueryable<T> sqlData, IEnumerable<string> array, string propertyName)
        {
            if (array == null || array.Count() == 0)
                return sqlData;
            if (string.IsNullOrEmpty(propertyName))
                throw new Exception("QueryLikeArray：propertyName未设置查询属性名称");
            var type = typeof(T);
            ParameterExpression param = Expression.Parameter(type);
            Expression filter1 = null;
            Expression filter2 = null;
            foreach (var item in array)
            {
                filter2 = Expression.Call(Expression.Property(param, type.GetProperty(propertyName)),
                typeof(String).GetMethod("Contains"), new Expression[] { Expression.Constant(item) });
                if (filter1 == null)
                    filter1 = filter2;
                else
                    filter1 = Expression.Or(filter1, filter2);
            }
            Expression pred = Expression.Lambda(filter1, param);
            MethodCallExpression whereCallExpression = Expression.Call(typeof(Queryable), "Where", new Type[] { type }, Expression.Constant(sqlData), pred);
            sqlData = sqlData.Provider.CreateQuery<T>(whereCallExpression);
            return sqlData;
        }
    }
}

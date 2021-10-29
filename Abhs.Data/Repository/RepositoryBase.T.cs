
using Abhs.Data.ServiceDBContext;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Abhs.Data.Repository
{
    /// <summary>
    /// 仓储实现
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    public class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : class, new()
    {

        public int Insert(TEntity entity)
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            dbcontext.Entry<TEntity>(entity).State = EntityState.Added;
            return dbcontext.SaveChanges();
        }

        public int Insert(List<TEntity> entitys)
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            foreach (var entity in entitys)
            {
                dbcontext.Entry<TEntity>(entity).State = EntityState.Added;
            }
            return dbcontext.SaveChanges();
        }

        public int Update(TEntity entity)
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            dbcontext.Set<TEntity>().Attach(entity);
            PropertyInfo[] props = entity.GetType().GetProperties();
            foreach (PropertyInfo prop in props)
            {
                if (prop.GetValue(entity, null) != null)
                {
                    if (prop.GetValue(entity, null).ToString() == "&nbsp;")
                        dbcontext.Entry(entity).Property(prop.Name).CurrentValue = null;
                    dbcontext.Entry(entity).Property(prop.Name).IsModified = true;
                }
            }
            return dbcontext.SaveChanges();
        }

        public int UpdateForce(TEntity entity)
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            dbcontext.Set<TEntity>().Attach(entity);
            PropertyInfo[] props = entity.GetType().GetProperties();
            foreach (PropertyInfo prop in props)
            {
                dbcontext.Entry(entity).Property(prop.Name).IsModified = true;
            }
            return dbcontext.SaveChanges();
        }

        public int Delete(TEntity entity)
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            dbcontext.Set<TEntity>().Attach(entity);
            dbcontext.Entry<TEntity>(entity).State = EntityState.Deleted;
            return dbcontext.SaveChanges();
        }

        public IQueryable<TEntity> IQueryable()
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            return dbcontext.Set<TEntity>();
        }

        public TEntity FindEntity(object keyValue)
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            return dbcontext.Set<TEntity>().Find(keyValue);
        }

        public List<TEntity> FindList(string strSql)
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            return dbcontext.Database.SqlQuery<TEntity>(strSql).ToList<TEntity>();
        }

        public List<TEntity> FindList(string strSql, DbParameter[] dbParameter)
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            return dbcontext.Database.SqlQuery<TEntity>(strSql, dbParameter).ToList<TEntity>();
        }

        public int ExecuteSql(string strSql)
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            return dbcontext.Database.ExecuteSqlCommand(strSql);
        }

        public List<OEntity> SqlQuery<OEntity>(string strSql)
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            return dbcontext.Database.SqlQuery<OEntity>(strSql).ToList<OEntity>();
        }
        public DbRawSqlQuery<OEntity> DbRawSqlQuery<OEntity>(string strSql)
        {
            var dbcontext = ThreadSingleton.GetDBEntities();
            return dbcontext.Database.SqlQuery<OEntity>(strSql);
        }
        public void BatchInsert<T>(List<T> list)
        {
            using (var db = ThreadSingleton.GetDBEntities())
            {
                if (db.Database.Connection.State != ConnectionState.Open)
                {
                    db.Database.Connection.Open(); //打开Connection连接
                }
                var t = typeof(T);
                string tabelName=t.CustomAttributes.ToList()[0].ConstructorArguments[0].Value.ToString();
                //调用BulkInsert方法,将entitys集合数据批量插入到数据库的tolocation表中
                BulkInsert<T>((SqlConnection)db.Database.Connection, tabelName, list);

                if (db.Database.Connection.State != ConnectionState.Closed)
                {
                    db.Database.Connection.Close(); //关闭Connection连接
                }
            }


        }
        public void BulkInsert<T>(SqlConnection conn, string tableName, IList<T> list)
        {
            using (var bulkCopy = new SqlBulkCopy(conn))
            {
                bulkCopy.BatchSize = list.Count;
                bulkCopy.DestinationTableName = tableName;

                var table = new DataTable();
                var props = TypeDescriptor.GetProperties(typeof(T))

                    .Cast<PropertyDescriptor>()
                    .Where(propertyInfo => propertyInfo.PropertyType.Namespace.Equals("System"))
                    .ToArray();

                foreach (var propertyInfo in props)
                {
                    string col = string.Empty;
                    var attrInfo = propertyInfo.Attributes;
                    foreach (var item in attrInfo)
                    {
                        if (item is System.ComponentModel.DataAnnotations.Schema.ColumnAttribute)
                        {
                            col = (item as System.ComponentModel.DataAnnotations.Schema.ColumnAttribute).Name;
                            break;
                        }
                    }
                        
                    //Object[] obs = propertyInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);
                    bulkCopy.ColumnMappings.Add(col??propertyInfo.Name, col ?? propertyInfo.Name);
                    table.Columns.Add(col ?? propertyInfo.Name, Nullable.GetUnderlyingType(propertyInfo.PropertyType) ?? propertyInfo.PropertyType);
                }

                var values = new object[props.Length];
                foreach (var item in list)
                {
                    for (var i = 0; i < values.Length; i++)
                    {
                        values[i] = props[i].GetValue(item);
                    }

                    table.Rows.Add(values);
                }

                bulkCopy.WriteToServer(table);
            }
        }
        public void BatchInserts<T>(List<T> list)
        {
            using (var db = ThreadSingleton.GetDBEntities())
            {
                if (db.Database.Connection.State != ConnectionState.Open)
                {
                    db.Database.Connection.Open(); //打开Connection连接
                }
                var t = typeof(T);
                string tabelName = t.CustomAttributes.ToList()[0].ConstructorArguments[0].Value.ToString();
                //调用BulkInsert方法,将entitys集合数据批量插入到数据库的tolocation表中
                BulkInserts<T>((SqlConnection)db.Database.Connection, tabelName, list);

                if (db.Database.Connection.State != ConnectionState.Closed)
                {
                    db.Database.Connection.Close(); //关闭Connection连接
                }
            }
        }
        public void BulkInserts<T>(SqlConnection conn, string tableName, IList<T> list)
        {
            using (var bulkCopy = new SqlBulkCopy(conn))
            {
                bulkCopy.BatchSize = list.Count;
                bulkCopy.DestinationTableName = tableName;

                var table = new DataTable();
                var props = TypeDescriptor.GetProperties(typeof(T))

                    .Cast<PropertyDescriptor>()
                    .Where(propertyInfo => propertyInfo.PropertyType.Namespace.Equals("System"))
                    .ToArray();

                foreach (var propertyInfo in props)
                {
                    bulkCopy.ColumnMappings.Add(propertyInfo.Name, propertyInfo.Name);
                    table.Columns.Add(propertyInfo.Name, Nullable.GetUnderlyingType(propertyInfo.PropertyType) ?? propertyInfo.PropertyType);
                }

                var values = new object[props.Length];
                foreach (var item in list)
                {
                    for (var i = 0; i < values.Length; i++)
                    {
                        values[i] = props[i].GetValue(item);
                    }

                    table.Rows.Add(values);
                }

                bulkCopy.WriteToServer(table);
            }
        }

    }
}

using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;

namespace Abhs.Data.Repository
{
    /// <summary>
    /// 仓储接口
    /// </summary>
    /// <typeparam name="TEntity">实体类型</typeparam>
    public interface IRepositoryBase<TEntity> where TEntity : class,new()
    {
        int Insert(TEntity entity);

        int Insert(List<TEntity> entitys);

        int Update(TEntity entity);

        int UpdateForce(TEntity entity);

        int Delete(TEntity entity);

        IQueryable<TEntity> IQueryable();

        TEntity FindEntity(object keyValue);

        List<TEntity> FindList(string strSql);

        List<TEntity> FindList(string strSql, DbParameter[] dbParameter);


        int ExecuteSql(string strSql);

        List<OEntity> SqlQuery<OEntity>(string strSql);
        DbRawSqlQuery<OEntity> DbRawSqlQuery<OEntity>(string strSql);
        void BatchInsert<T>(List<T> list);
        void BatchInserts<T>(List<T> list);
    }
}

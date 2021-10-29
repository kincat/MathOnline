using System;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;

namespace Abhs.Data.ServiceDBContext
{
    public class DbHelper
    {
        private static string connstring = ConfigurationManager.ConnectionStrings["AbhsDbContext"].ConnectionString;

        public static string Connstring
        {
            get
            {
                return connstring;
            }
        }

        public static int ExecuteSqlCommand(string cmdText)
        {
            using (DbConnection conn = new SqlConnection(Connstring))
            {
                DbCommand cmd = new SqlCommand();
                PrepareCommand(cmd, conn, null, CommandType.Text, cmdText, null);
                return cmd.ExecuteNonQuery();
            }
        }
        private static void PrepareCommand(DbCommand cmd, DbConnection conn, DbTransaction isOpenTrans, CommandType cmdType, string cmdText, DbParameter[] cmdParms)
        {
            if (conn.State != ConnectionState.Open)
                conn.Open();
            cmd.Connection = conn;
            cmd.CommandText = cmdText;
            if (isOpenTrans != null)
                cmd.Transaction = isOpenTrans;
            cmd.CommandType = cmdType;
            if (cmdParms != null)
            {
                cmd.Parameters.AddRange(cmdParms);
            }
        }

        public static DataSet ExecuteDataSet(string sql, params SqlParameter[] par)
        {
            using (SqlConnection conn = new SqlConnection(Connstring))
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();

                using (SqlDataAdapter sda = new SqlDataAdapter(sql, conn))
                {
                    if (par != null && par.Length > 0)
                    {
                        sda.SelectCommand.Parameters.AddRange(par);
                    }
                    DataSet dt = new DataSet();
                    sda.Fill(dt);
                    return dt;
                }
            }
        }



        public static DataTable ExecuteSql(SqlConnection conn, SqlTransaction transaction, string sql)
        {
            using (SqlDataAdapter sda = new SqlDataAdapter(sql, conn))
            {
                sda.SelectCommand.Transaction = transaction;
                DataSet dt = new DataSet();
                sda.Fill(dt);
                return dt.Tables[0];
            }
        }


        public static int Update(SqlConnection conn, SqlTransaction transaction, string sql)
        {
            using (SqlCommand cmd = new SqlCommand(sql, conn))
            {
                cmd.Transaction = transaction;
                return cmd.ExecuteNonQuery();
            }
        }
    }
}

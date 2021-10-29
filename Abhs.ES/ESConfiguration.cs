using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nest;
using Abhs.Model.MonitorMiddle;

namespace Abhs.ES
{
    public static class ESConfiguration
    {
        public static ElasticClient GetClient() => new ElasticClient(_connectionSettings);

        private static string esUri = System.Configuration.ConfigurationManager.AppSettings["es-host"];
        private static string username = System.Configuration.ConfigurationManager.AppSettings["es-username"];
        private static string password = System.Configuration.ConfigurationManager.AppSettings["es-password"];

        static ESConfiguration()
        {
            _connectionSettings = new ConnectionSettings(CreateUri(esUri,9200)).BasicAuthentication(username, password)
                .DefaultIndex("math-search-msg")
                .DefaultMappingFor<math_message_request>(i => i
                    .IndexName("math-search-msg")
                );
        }
        private static readonly ConnectionSettings _connectionSettings;

        public static string LiveIndexAlias => "mathsearch";

        public static string OldIndexAlias => "mathsearch-old";

        public static Uri CreateUri(string uri, int port)
        {
            var host = !string.IsNullOrEmpty(uri) ? uri : "localhost";
            return new Uri($"http://{host}:{port}");
        }

        public static string CreateIndexName() => "math-search-msg";


        public static string CreateIndexName(string indexName)
        {
            return System.Configuration.ConfigurationManager.AppSettings["es-index-name"].ToString();
        }




    }
}

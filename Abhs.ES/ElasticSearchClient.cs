using Elasticsearch.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.ES
{
    public class ElasticSearchClient
    {
        public ElasticLowLevelClient Client { get; }


        public ElasticSearchClient()
        {
            Client = InitClient("http://localhost:9200/");
        }

        #region Methods
        public async Task<string> Index(string index, string id, PostData body)
        {
            var response = await Client.IndexAsync<StringResponse>(index, id, body);

            ResponseValidate(response);
            return response.Body;
        }

        public async Task<List<string>> SearchWithHighLight(string index, string query)
        {
            var response = await Client.SearchAsync<StringResponse>(
                index,
                PostData.Serializable(new
                {
                    from = 0,
                    size = 100,
                    query = new
                    {
                        match = new
                        {
                            content = query
                        }
                    },
                    highlight = new
                    {
                        pre_tags = new[] { "<tag1>", "<tag2>" },
                        post_tags = new[] { "/<tag1>", "/<tag2>" },
                        fields = new
                        {
                            content = new { }
                        }
                    }
                }));

            ResponseValidate(response);
            var responseJson = (JObject)JsonConvert.DeserializeObject(response.Body);

            var hits = responseJson["hits"]["hits"] as JArray;

            var result = new List<string>();

            foreach (var hit in hits)
            {
                var id = hit["_id"].ToObject<string>();

                result.Add(id);
            }

            return result;
        }

        //public async Task Delete(string index, string id)
        //{
        //    var response = await Client.DeleteAsync<StringResponse>(index, id);

        //    ResponseValidate(response);
        //}
        #endregion

        #region privates
        private ElasticLowLevelClient InitClient(string url)
        {
            var node = new Uri(url);
            var settings = new ConnectionConfiguration(node).RequestTimeout(TimeSpan.FromMinutes(2));
            var client = new ElasticLowLevelClient(settings);
            
           

            return client;
        }

        private void ResponseValidate(StringResponse response)
        {
            if (response.Success == false)
            {
                //throw new ResultException(response.Body);
            }
        }

        #endregion

    }
}

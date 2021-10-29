using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ExceptionServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Abhs.Model.MonitorMiddle;

namespace Abhs.ES
{
    public class MathService
    {
        private static ElasticClient Client { get; set; }
        private static string CurrentIndexName { get; set; }

        static MathService()
        {
            Client = ESConfiguration.GetClient();
            CurrentIndexName = ESConfiguration.CreateIndexName();
        }

        /// <summary>
        /// 创建默认名字为math-search的索引
        /// </summary>
        /// <returns></returns>
        //public static CreateIndexResponse CreateIndex()
        //{
        //    if (Client.Indices.Exists(CurrentIndexName).Exists)
        //    {
        //        Console.WriteLine("indexname:" + CurrentIndexName + "exists");
        //        Client.Indices.Delete(CurrentIndexName);
        //    }
        //    Console.WriteLine("start create");
        //    var response = Client.Indices.Create(CurrentIndexName, i => i
        //        .Settings(s => s
        //            .NumberOfShards(2)
        //            .NumberOfReplicas(1)
        //        //.Setting("index.mapping.nested_objects.limit", 12000)
        //        //.Analysis(Analysis)
        //        )
        //        .Map<math_message_request>(MapPackage)
        //    );
        //    Console.WriteLine("create success");
        //    //SwapAlias();

        //    return response;
        //}

        /// <summary>
        /// 单纯创建索引,不指定mapping和别名
        /// </summary>
        /// <param name = "indexName" > 索引名字 </ param >
        /// < param name="alias">别名</param>
        /// <returns></returns>
        //public static CreateIndexResponse CreateIndex(string indexName, string alias)
        //{
        //    if (Client.Indices.Exists(indexName).Exists)
        //    {
        //        Client.Indices.Delete(indexName);
        //    }

        //    var response = Client.Indices.Create(indexName, i => i
        //        .Settings(s => s
        //            .NumberOfShards(2)
        //            .NumberOfReplicas(1)
        //        //.Setting("index.mapping.nested_objects.limit", 12000)
        //        //.Analysis(Analysis)
        //        )
        //    );

        //    return response;
        //}


        #region 定义mapping

        private static TypeMappingDescriptor<math_message_request> MapPackage(TypeMappingDescriptor<math_message_request> map) => map
            .AutoMap()
            .Properties(ps => ps
                .Keyword(k => k
                    .Name(p => p.module_name) //大模块
                    .Name(p => p.package_name) //课程
                    .Name(p => p.lesson_name) //课时
                    .Name(p => p.lesson_itemname) //课时名称
                    .Name(p => p.lesson_module_typename) //课时模块类型
                    .Name(p => p.question_typename) //题型名称
                )
            );
        #endregion

        #region 指定分析器
        private static AnalysisDescriptor Analysis(AnalysisDescriptor analysis) => analysis
            .Tokenizers(tokenizers => tokenizers
                .Pattern("nuget-id-tokenizer", p => p.Pattern(@"\W+"))
            )
            .TokenFilters(tokenfilters => tokenfilters
                .WordDelimiter("nuget-id-words", w => w
                    .SplitOnCaseChange()
                    .PreserveOriginal()
                    .SplitOnNumerics()
                    .GenerateNumberParts(false)
                    .GenerateWordParts()
                )
            )
            .Analyzers(analyzers => analyzers
                .Custom("nuget-id-analyzer", c => c
                    .Tokenizer("nuget-id-tokenizer")
                    .Filters("nuget-id-words", "lowercase")
                )
                .Custom("nuget-id-keyword", c => c
                    .Tokenizer("keyword")
                    .Filters("lowercase")
                )
            );
        #endregion

        //public static void DeleteIndex(string indexName)
        //{
        //    if (Client.Indices.Exists(indexName).Exists)
        //    {
        //        Client.Indices.Delete(indexName);
        //    }
        //}



        /// <summary>
        /// 使用BulkAll批量向索引中添加文档
        /// </summary>
        /// <param name="packages">批量消息</param>
        public static void AddDocuments(List<math_message_request> packages)
        {
            //if (Client.Indices.Exists(CurrentIndexName).Exists)
            //{
            //    return;
            //}
            Console.Write("Indexing documents into Elasticsearch...");
            var waitHandle = new CountdownEvent(1);

            var bulkAll = Client.BulkAll(packages, b => b
                .Index(CurrentIndexName)
                .BackOffRetries(2)
                .BackOffTime("30s")
                .RefreshOnCompleted(true)
                .MaxDegreeOfParallelism(4)
                .Size(1000)
            );

            ExceptionDispatchInfo captureInfo = null;

            bulkAll.Subscribe(new BulkAllObserver(
                onNext: b => Console.WriteLine("go-"),
                onError: e =>
                {
                    captureInfo = ExceptionDispatchInfo.Capture(e);
                    waitHandle.Signal();
                },
                onCompleted: () => waitHandle.Signal()
            ));

            waitHandle.Wait(TimeSpan.FromMinutes(30));
            captureInfo?.Throw();
            Console.WriteLine("Done.");
        }

        public static bool UpdateDocument(math_message_request req)
        {
            var result = Client.Update<math_message_request>(req.message_id, u => u
                 .Index(CurrentIndexName).Type("doc")
                 .Doc(req)
            );
            return result.IsValid;
        }
        public static bool AddDocument(math_message_request req)
        {
            var result = Client.Index<math_message_request>(req, u => u.Index(CurrentIndexName).Type("doc"));
            return result.IsValid;
        }

        /// <summary>
        /// 查询某个课下的所有消息
        /// </summary>
        /// <param name="courseid"></param>
        /// <returns></returns>
        public static List<math_message_request> GetDocument(string courseid)
        {
            List<math_message_request> result = new List<math_message_request>();
            var response = Client.Search<math_message_request>(s => s.Index(CurrentIndexName).Type("doc")
                   .Size(10000)
                   .Sort(sort=> {
                       return sort.Descending(p => p.create_time);
                   })
                   
                   .Query(q => (q.Term( ts=>
                        ts.Field("course_id.keyword").Value(courseid)
                        )
                   )
                )
             );

            if(response.Total == 0)
            {
                return null;
            }

            foreach( var q in response.Hits)
            {
                result.Add(q.Source);
            }

            return result;
        }

        /// <summary>
        /// 获取某个课下的某个学生的所有消息
        /// </summary>
        /// <param name="courseid"></param>
        /// <param name="studentid"></param>
        /// <returns></returns>
        public static List<math_message_request> GetDocumentStudent(string courseid, int studentid)
        {
            List<math_message_request> result = new List<math_message_request>();
            var response = Client.Search<math_message_request>(s => s.Index(CurrentIndexName).Type("doc")
                   .Size(10000)
                   .Sort(sort => {
                       return sort.Descending(p => p.create_time);
                   })
                   .Query(q => (q.Term(ts =>ts.Field("course_id.keyword").Value(courseid))) && (q.Term(ts => ts.Field("student_id").Value(studentid)))

                )
             );

            if (response.Total == 0)
            {
                return null;
            }

            foreach (var q in response.Hits)
            {
                result.Add(q.Source);
            }

            return result;
        }



        //指定别名
        //private static void SwapAlias()
        //{
        //    var indexExists = Client.Indices.Exists(ESConfiguration.LiveIndexAlias).Exists;

        //    Client.Indices.BulkAlias(aliases =>
        //    {
        //        if (indexExists)
        //            aliases.Add(a => a
        //                .Alias(ESConfiguration.OldIndexAlias)
        //                .Index(Client.GetIndicesPointingToAlias(ESConfiguration.LiveIndexAlias).First())
        //            );

        //        return aliases
        //            .Remove(a => a.Alias(ESConfiguration.LiveIndexAlias).Index("*"))
        //            .Add(a => a.Alias(ESConfiguration.LiveIndexAlias).Index(CurrentIndexName));
        //    });

        //    //只保留最新的两个版本
        //    var oldIndices = Client.GetIndicesPointingToAlias(ESConfiguration.OldIndexAlias)
        //        .OrderByDescending(name => name)
        //        .Skip(2);

        //    foreach (var oldIndex in oldIndices)
        //        Client.Indices.Delete(oldIndex);
        //}




    }
}

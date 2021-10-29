using CSRedis;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Abhs.Cache.Redis
{
    public class RedisUtil
    {
        private log4net.ILog _logNet = log4net.LogManager.GetLogger(typeof(RedisUtil));
        private static string conn = System.Configuration.ConfigurationManager.AppSettings["redisConn"];

        static RedisUtil _service;
        private static CSRedisClient redis = new CSRedisClient(conn);
        public static RedisUtil Instance
        {
            get
            {
                if (_service == null)
                {
                    RedisHelper.Initialization(redis);
                    _service = new RedisUtil();
                    
                }
                return _service;
            }
        }
        #region base

        /// <summary>
        /// 默认一天过期
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="Key"></param>
        /// <param name="t"></param>
        /// <param name="expireSeconds"></param>
        public void Set<T>(string Key, T t, int expireSeconds = 60 * 60 * 24)
        {
            try
            {
                RedisHelper.Set(Key, t, expireSeconds);
            }
            catch (Exception exp)
            {
            }
        }

        public T Get<T>(string key)
        {
            return RedisHelper.Get<T>(key);
        }
        public void Remove(string Key)
        {
            try
            {
                RedisHelper.Del(Key);
            }
            catch (Exception exp)
            {
            }
        }
        public void RemoveAll(string pattern)
        {
            try
            {

                var allKey = RedisHelper.Keys(pattern);
                RedisHelper.Del(allKey);
            }
            catch (Exception exp)
            {
            }
        }

        //public Dictionary<string,T> HGetAll<T>(string key)
        //{
        //    return RedisHelper.HGetAll<T>(key);
        //}


        public List<T> GetValueList<T>(string pattern)
        {

            var allKey = RedisHelper.Keys(pattern);
            return RedisHelper.MGet<T>(allKey).ToList();
        }

        public string[] Keys(string pattern)
        {
            return RedisHelper.Keys(pattern);
        }
        #region hash
        public void HSet(string hashKey, string key, string obj,int seconds=0)
        {
            RedisHelper.HSet(hashKey, key, obj);
            if(seconds>0)
              RedisHelper.Expire(hashKey, seconds);
        }
        public void HSet<T>(string hashKey, string key, T obj,int seconds = 0)
        {
            Stopwatch sw = new Stopwatch();
            var p = new Par() { isOver = false };
            sw.Start();
            
            try
            {
                // 开启器计数器
                Times($"HSet-hashkey:{hashKey},key:{key}",p);

                RedisHelper.HSet(hashKey, key, obj);
                if (seconds > 0)
                    RedisHelper.Expire(hashKey, seconds);
                sw.Stop();
                if (sw.ElapsedMilliseconds > 50)
                {
                    string val = obj == null ? "" : Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    _logNet.Warn($"HSet------hashkey:{hashKey},key:{key},times:{sw.ElapsedMilliseconds},data:{val}");

                    foreach (var pool in redis.Nodes.Values)
                    {
                        _logNet.Warn("对象池信息: " + pool.Key + "|" + pool.Statistics);
                    }

                }
             
            }
            catch (Exception e)
            {
                sw.Stop();
                _logNet.Warn($"HSet------hashkey:{hashKey},key:{key},times:{sw.ElapsedMilliseconds},Exception:{e.Message}");
                throw e;
            }
            finally
            {
                p.isOver = true;
            }
        }
     
        //HMGet
        public string HGet(string hashKey, string key)
        {
            return RedisHelper.HGet(hashKey, key);
        }

        public T HGet<T>(string hashKey, string key)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var p = new Par() { isOver = false };
            try
            {
                
                // 开启器计数器
                Times($"HGet-hashkey:{hashKey},key:{key}", p);
                var obj = RedisHelper.HGet<T>(hashKey, key);
                sw.Stop();
                if (sw.ElapsedMilliseconds > 50)
                {
                    string val = obj == null ? "" : Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    _logNet.Warn($"HGet------hashkey:{hashKey},key:{key},times:{sw.ElapsedMilliseconds},data:{val}");


                    foreach (var pool in redis.Nodes.Values)
                    {
                        _logNet.Warn("对象池信息: " + pool.Key + "|" + pool.Statistics);
                    }
                }
                return obj;
            }
            catch (Exception e)
            {
                sw.Stop();
                _logNet.Warn($"HGet------hashkey:{hashKey},key:{key},times:{sw.ElapsedMilliseconds},Exception:{e.Message}");
                throw e;
            }
            finally
            {
                p.isOver = true;
            }
        }

        public List<string> HGet(string hashKey, params string[] keys)
        {

            return RedisHelper.HMGet(hashKey, keys).ToList();

        }
        public void bulkData<T>(string hashKey,Dictionary<string,T> dic)
        {
            var pip = RedisHelper.StartPipe();
            foreach (var key in dic.Keys)
            {
                pip.HSet(hashKey, key, dic[key]);
            }
            pip.EndPipe();           
        }



        public List<T> HGetList<T>(string hashKey, params string[] keys)
        {
            Stopwatch sw = new Stopwatch();
            var p = new Par() { isOver = false };
            sw.Start();
            try
            {
                // 开启器计数器
                Times($"HGetList-hashkey:{hashKey},key:{string.Join(",", keys)}", p);
                var obj = RedisHelper.HMGet<T>(hashKey, keys).ToList();
                sw.Stop();
                if (sw.ElapsedMilliseconds > 50)
                {
                    string val = obj == null ? "" : Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    _logNet.Warn($"HGetList------hashkey:{hashKey},key:{string.Join(",", keys)},times:{sw.ElapsedMilliseconds},data:{val}");

                    foreach (var pool in redis.Nodes.Values)
                    {
                        _logNet.Warn("对象池信息: " + pool.Key + "|" + pool.Statistics);
                    }

                }
                return obj;
            }
            catch (Exception e)
            {
                sw.Stop();
                _logNet.Warn($"HGetList------hashkey:{hashKey},key:{string.Join(",", keys)},times:{sw.ElapsedMilliseconds},Exception:{e.Message}");
                throw e;
            }
            finally
            {
                p.isOver = true;
            }
        }
        public List<T> HGetAll<T>(string hashKey)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var px = new Par() { isOver = false };
            try
            {
                // 开启器计数器
                Times($"HGetAll-hashkey:{hashKey}", px);
                var list = new List<T>();
                var keys = RedisHelper.HKeys(hashKey);
                var p = RedisHelper.StartPipe();
                foreach (var key in keys)
                {
                    p.HGet<T>(hashKey, key);
                }
                var allresult = p.EndPipe();
                if (allresult.Length > 0)
                {
                    //T[] data = (T[])allresult[0];
                    foreach (T o in allresult)
                    {
                        list.Add(o);
                    }
                }
                var obj = list;
                sw.Stop();
                if (sw.ElapsedMilliseconds > 50)
                {
                    string val = obj == null ? "" : Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    _logNet.Warn($"HGetAll------hashkey:{hashKey},times:{sw.ElapsedMilliseconds},data:{val}");
                }
                return obj;
            }
            catch (Exception e)
            {
                sw.Stop();
                _logNet.Warn($"HGetAll------hashkey:{hashKey},times:{sw.ElapsedMilliseconds},Exception:{e.Message}");
                throw e;
            }
            finally
            {
                px.isOver = true;
            }
        }

        public string[] HKeys(string hashKey)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var p = new Par() { isOver = false };
            try
            {
                // 开启器计数器
                Times($"HKeys-hashkey:{hashKey}", p);
                var obj = RedisHelper.HKeys(hashKey);
                sw.Stop();
                if (sw.ElapsedMilliseconds > 50)
                {
                    string val = obj == null ? "" : Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    _logNet.Warn($"HKeys------hashkey:{hashKey},times:{sw.ElapsedMilliseconds},data:{val}");
                }
                return obj;
            }
            catch (Exception e)
            {
                sw.Stop();
                _logNet.Warn($"HKeys------hashkey:{hashKey},times:{sw.ElapsedMilliseconds},Exception:{e.Message}");
                throw e;
            }
            finally
            {
                p.isOver = true;
            }
        }
        public T HScan<T>(string hashKey,string pattern)
        {
            var list = HScanList<T>(hashKey, pattern);
            if (list != null && list.Count > 0)
                return list[0];
            return default(T);
        }
        public List<T> HScanList<T>(string hashKey, string pattern)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var p = new Par() { isOver = false };
            try
            {
                // 开启器计数器
                Times($"HScanList-hashkey:{hashKey},pattern:{pattern}", p);
                var list = new List<T>();
                HScanLists<T>(hashKey, pattern, list);
                var obj = list;
                sw.Stop();
                if (sw.ElapsedMilliseconds > 50)
                {
                    string val = obj == null ? "" : Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    //_logNet.Warn($"HScanList------hashkey:{hashKey},pattern:{pattern},times:{sw.ElapsedMilliseconds},data:{val}");

                    foreach (var pool in redis.Nodes.Values)
                    {
                        _logNet.Warn("对象池信息: " + pool.Key + "|" + pool.Statistics);
                    }


                }
                return obj;
            }
            catch (Exception e)
            {
                sw.Stop();
                //_logNet.Warn($"HScanList------hashkey:{hashKey},pattern:{pattern},times:{sw.ElapsedMilliseconds},Exception:{e.Message}");
                throw e;
            }
            finally
            {
                p.isOver = true;
            }

        }
        private void HScanLists<T>(string hashKey, string pattern, List<T> list, long cursor = 0)
        {
            var result = RedisHelper.HScan<T>(hashKey, cursor, pattern,10000);
            cursor = result.Cursor; 
            if (result.Items.Length>0)
            {
                var dataList = result.Items.Select(x => x.Item2).ToList<T>();
                if (dataList != null && dataList.Count > 0)
                    list.AddRange(dataList);
            }
            if (cursor != 0)
            {
                HScanLists<T>(hashKey, pattern, list, cursor);
            }
            else
            {
                return;
            }
        }
        public T[] HMGet<T>(string hashKey, string[] keys)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var p = new Par() { isOver = false };
            try
            {
                // 开启器计数器
                Times($"HMGet-hashkey:{hashKey},keys:{string.Join(",", keys)}", p);
                var obj = RedisHelper.HMGet<T>(hashKey, keys);
                sw.Stop();
                if (sw.ElapsedMilliseconds > 50)
                {
                    string val = obj == null ? "" : Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    _logNet.Warn($"HMGet------hashkey:{hashKey},keys:{string.Join(",", keys)},times:{sw.ElapsedMilliseconds},data:{val}");


                    foreach (var pool in redis.Nodes.Values)
                    {
                        _logNet.Warn("对象池信息: " + pool.Key + "|" + pool.Statistics);
                    }
                }
                return obj;
            }
            catch (Exception e)
            {
                sw.Stop();
                _logNet.Warn($"HMGet------hashkey:{hashKey},keys:{string.Join(",", keys)},times:{sw.ElapsedMilliseconds},Exception:{e.Message}");
                throw e;
            }
            finally
            {
                p.isOver = true;
            }
        }

        public List<string> HVals(string hashKey)
        {
            return RedisHelper.HVals(hashKey).ToList();
        }

        public List<T> HVals<T>(string hashKey)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var p = new Par() { isOver = false };
            try
            {
                // 开启器计数器
                Times($"HVals-hashkey:{hashKey}", p);
                var obj = RedisHelper.HVals<T>(hashKey).ToList();
                sw.Stop();
                if (sw.ElapsedMilliseconds > 50)
                {
                    string val = obj == null ? "" : Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    //_logNet.Warn($"HVals------hashkey:{hashKey},times:{sw.ElapsedMilliseconds},data:{val}");


                    foreach (var pool in redis.Nodes.Values)
                    {
                        _logNet.Warn("对象池信息: " + pool.Key + "|" + pool.Statistics);
                    }
                }
                return obj;
            }
            catch (Exception e)
            {
                sw.Stop();
                _logNet.Warn($"HVals------hashkey:{hashKey},times:{sw.ElapsedMilliseconds},Exception:{e.Message}");
                throw e;
            }
            finally
            {
                p.isOver = true;
            }
        }

        public bool HDel(string hashKey, string key)
        {
            string[] arrayKeys = new string[] { key };
            return RedisHelper.HDel(hashKey, arrayKeys) > 0;
        }
        public bool HDel(string hashKey)
        {
            string[] arrayKeys = RedisHelper.HKeys(hashKey);
            var p = RedisHelper.StartPipe();
            foreach (var key in arrayKeys)
            {
                p.HDel(hashKey, key);
            }
            p.EndPipe();

            return true;
        }

        public IDisposable AcquireLock(string key, TimeSpan timeOut)
        {
            return RedisHelper.Lock(key, (int)timeOut.TotalSeconds);
        }
        #endregion

        #endregion


        #region list

        /// <summary>
        /// 入队异步版本
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public async Task<long> RInList<T>(string key, params T[] value)
        {
            var p = new Par() { isOver = false };
            // 开启器计数器
            Times($"RInList-hashkey:{key}",p);
            var r = RedisHelper.RPush(key, value);
            p.isOver = true;
            return r;
        }

        /// <summary>
        /// 入队, 同步版本
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public long RInListGp<T>(string key, params T[] value)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var p = new Par() { isOver = false };
            try
            {
                // 开启器计数器
                Times($"RInListGp-hashkey:{key}", p);



                var obj = RedisHelper.RPush(key, value);



                sw.Stop();
                if (sw.ElapsedMilliseconds > 50)
                {
                    foreach (var pool in redis.Nodes.Values)
                    {
                        _logNet.Warn("对象池信息: " + pool.Key + "|" + pool.Statistics);
                    }

                    _logNet.Warn($"RInListGp------hashkey:{key},times:{sw.ElapsedMilliseconds},data:{ Newtonsoft.Json.JsonConvert.SerializeObject(value)}");
                    
                }
                return obj;
            }
            catch (Exception e)
            {
                sw.Stop();
                _logNet.Warn($"RInListGp------hashkey:{key},times:{sw.ElapsedMilliseconds},Exception:{e.Message}");
                throw e;
            }
            finally
            {
                p.isOver = true;
            }
        }

        /// <summary>
        /// 出队,同步版本
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public string LOutList(string key)
        {
            
            return RedisHelper.BLPop(3, key);
        }

        public T LOutList<T>(string key)
        {
            return RedisHelper.LPop<T>(key);
        }

        public T ROutList<T>(string key)
        {
            return RedisHelper.RPop<T>(key);
        }

        /// <summary>
        /// 一次性lpop消费List里的前n个数据.   [已经废弃]
        /// 消息采用Rpush进入的队列,采用lrange从左往右拿,拿的都是最早时间的.
        /// </summary>
        /// <typeparam name="T">消息体</typeparam>
        /// <param name="key">list的key</param>
        /// <param name="n">前n条消息</param>
        /// <returns></returns>
        public List<T> GetAllList<T>(string key, int n = 10)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var px = new Par() { isOver = false };
            try
            {
                // 开启器计数器
                Times($"GetAllList-hashkey:{key}", px);

                //如果队列里没消息直接返回null
                long num = RedisHelper.LLen(key);
                if(num == 0)
                {
                    sw.Stop();
                    if (sw.ElapsedMilliseconds > 50)
                    {
                        _logNet.Warn($"GetAllList------hashkey:{key},times:{sw.ElapsedMilliseconds},data:{num }");

                        foreach (var pool in redis.Nodes.Values)
                        {
                            _logNet.Warn("对象池信息: " + pool.Key + "|" + pool.Statistics);
                        }
                    }


                    return null;
                }


                List<T> result = new List<T>();

                var p = RedisHelper.StartPipe();
                //在获取的期间,消息还可能会继续增加
                p.LRange<T>(key, 0, n - 1); //获取前n条 如果stop比list的实际尾部大的时候，Redis会当它是最后一个元素的下标
                p.LTrim(key, n, -1); //如果start > end，结果会是列表变成空表（即该 key 会被移除）
                var allresult = p.EndPipe();

                if (allresult.Length > 0 && Convert.ToBoolean(allresult[1]) == true)
                {
                    T[] data = (T[])allresult[0];
                    foreach (T o in data)
                    {
                        result.Add(o);
                    }
                }

                var obj = result;

                sw.Stop();
                if (sw.ElapsedMilliseconds > 50)
                {
                    _logNet.Warn($"GetAllList------hashkey:{key},times:{sw.ElapsedMilliseconds},data:{ Newtonsoft.Json.JsonConvert.SerializeObject(result)}");

                    foreach (var pool in redis.Nodes.Values)
                    {
                        _logNet.Warn("对象池信息: " + pool.Key + "|" + pool.Statistics);
                    }
                }
                return obj;
            }
            catch (Exception e)
            {
                sw.Stop();
                _logNet.Warn($"GetAllList------hashkey:{key},times:{sw.ElapsedMilliseconds},Exception:{e.Message}");
                throw e;
            }
            finally
            {
                px.isOver = true;
            }
        }
        #endregion

        #region 分布式ID

        public long GetGeneratorUID()
        {
            return RedisHelper.IncrBy("uid-generator");
        }

        #endregion


        /// <summary>
        /// 计数器函数
        /// </summary>
        /// <param name="msn"></param>
        public void Times(string msn, Par p)
        {
            Thread thread = new Thread(new ParameterizedThreadStart(SubThread)) { IsBackground = true };
            thread.Name = msn;
            thread.Start(p);
        }

        public class Par
        {
            public bool isOver = false;
        }

        /// <summary>
        /// 计数器子线程
        /// </summary>
        /// <param name="par"></param>
        public void SubThread(object par)
        {
            var temp = (Par)par;
            var sw = DateTime.Now;

            while (true)
            {
                Thread.Sleep(1000);
                TimeSpan ts = DateTime.Now.Subtract(sw);
                int sec = (int)ts.TotalSeconds;

                // 如果已经结束 则直接退出
                if(temp.isOver)
                {
                    return;
                }


                // 超过5秒就技术并退出
                if (sec > 15)
                {
                    //Console.WriteLine(Thread.CurrentThread.Name + "执行超过了5秒");

                    _logNet.Warn(Thread.CurrentThread.Name + "执行超过了15秒");
                    return;
                }
            }
        }

    }
}

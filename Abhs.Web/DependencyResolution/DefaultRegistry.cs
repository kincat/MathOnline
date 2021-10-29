// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DefaultRegistry.cs" company="Web Advanced">
// Copyright 2012 Web Advanced (www.webadvanced.com)
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace Abhs.DependencyResolution {
    using Application.IService;
    using Application.IService.Business;
    using Application.Service;
    using Application.Service.Business;
    using Cache.Redis;
    using Data.Repository;
    using log4net;
    using StructureMap.Configuration.DSL;
    using StructureMap.Graph;
    using StructureMap.Web;
    using System.Web.Script.Services;

    public class DefaultRegistry : Registry {
        #region Constructors and Destructors

        public DefaultRegistry() {
            Scan(
                scan => {
                    scan.TheCallingAssembly();
                    scan.WithDefaultConventions();
                });
            For(typeof(IRepositoryBase<>)).Use(typeof(RepositoryBase<>));
            For<IMessageService>().Singleton().Use<MessageService>();
            For<IStudentService>().Singleton().Use<StudentService>();
            For<IKeepLiveService>().Singleton().Use<KeepLiveService>();
            For<IPackageLessonItemsService>().Singleton().Use<PackageLessonItemsService>();
            For<IPackageLessonService>().Singleton().Use<PackageLessonService>();
            For<IPackagesService>().Singleton().Use<PackagesService>();
            For<IQuestionMarkService>().Singleton().Use<QuestionMarkService>();
            For<IWeChatBindService>().Singleton().Use<WeChatBindService>();
        }
        #endregion
    }
}
using Abhs.Application.IService;
using Abhs.Application.IService.Business;
using Abhs.Application.Service;
using Abhs.Application.Service.Business;
using Abhs.Data.Repository;
using StructureMap.Configuration.DSL;
using StructureMap.Graph;

namespace Abhs.WinService.Ioc
{
    public class DefaultRegistry: Registry
    {
        public DefaultRegistry()
        {
            Scan(
                scan => {
                    scan.TheCallingAssembly();
                    scan.WithDefaultConventions();
                });
            For(typeof(IRepositoryBase<>)).Use(typeof(RepositoryBase<>));
            For<IPolicyService>().Singleton().Use<PolicyService>();
            For<ISchoolService>().Singleton().Use<SchoolService>();
            For<ITeacherService>().Singleton().Use<TeacherService>();
            For<IClassService>().Singleton().Use<ClassService>();
            For<IPrepareLessonsService>().Singleton().Use<PrepareLessonsService>();
            For<IMessageService>().Singleton().Use<MessageService>();
            For<IStudentService>().Singleton().Use<StudentService>();
            For<ILoginLogService>().Singleton().Use<LoginLogService>();
            For<IAdminService>().Singleton().Use<AdminService>();
            For<IBookKnowService>().Singleton().Use<BookKnowService>();
            For<IBookService>().Singleton().Use<BookService>();
            For<IMiddleClassService>().Singleton().Use<MiddleClassService>();
            For<IMiddleStudentService>().Singleton().Use<MiddleStudentService>();
            For<IPackageLessonItemsService>().Singleton().Use<PackageLessonItemsService>();
            For<IPackageLessonService>().Singleton().Use<PackageLessonService>();
            For<IPackagesService>().Singleton().Use<PackagesService>();
            For<IPackageStudyDetailService>().Singleton().Use<PackageStudyDetailService>();
            For<IQuestionLibService>().Singleton().Use<QuestionLibService>();
            For<IStudyDetailService>().Singleton().Use<StudyDetailService>();
            For<IQuestionMarkService>().Singleton().Use<QuestionMarkService>();
            For<IKeepLiveService>().Singleton().Use<KeepLiveService>();
            For<IPrepareClassService>().Singleton().Use<PrepareClassService>();
            For<ICourseService>().Singleton().Use<CourseService>();
            For<IClassManageService>().Singleton().Use<ClassManageService>();
            For<IStudentManageService>().Singleton().Use<StudentManageService>();
            For<IStudentClassRelationService>().Singleton().Use<StudentClassRelationService>();
            For<ILogHelper>().Singleton().Use<LogHelper>();
            For<IDataCheckService>().Singleton().Use<DataCheckService>();
            For<ITeacherMonitorLogService>().Singleton().Use<TeacherMonitorLogService>();
        }
    }
}

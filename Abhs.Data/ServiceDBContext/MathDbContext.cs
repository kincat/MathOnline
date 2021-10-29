using Abhs.Model;
using Abhs.Model.Access;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Reflection;

namespace Abhs.Data.ServiceDBContext
{
    public class MathDbContext : DbContext
    {
        public MathDbContext()
            : base("SmartMathEntities")
        {
            this.Configuration.AutoDetectChangesEnabled = false;
            this.Configuration.ValidateOnSaveEnabled = false;
            this.Configuration.LazyLoadingEnabled = false;
            this.Configuration.ProxyCreationEnabled = false;
            this.Configuration.UseDatabaseNullSemantics = true;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            //学生账号表
            modelBuilder.Entity<BasStudent>().HasKey(t => new { t.s_ID });
            modelBuilder.Entity<SysPackages>().HasKey(t => new { t.sp_ID });
            modelBuilder.Entity<SysPackageLesson>().HasKey(t => new { t.spl_ID });
            modelBuilder.Entity<SysPackageLessonItems>().HasKey(t => new { t.spk_ID });
            modelBuilder.Entity<SysQuestionMark>().HasKey(t => new { t.m_ID });
            modelBuilder.Entity<BasWeChatBind>().HasKey(t => new { t.uc_ID });

            base.OnModelCreating(modelBuilder);
        }
    }
}

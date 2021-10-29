using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Model.Data
{
    public abstract class BaseErrQuestion
    {
        public virtual int yeq_SchoolID { get; set; }
        public virtual int yeq_PackageID { get; set; }
        public virtual int yeq_StudentID { get; set; }
        public virtual int yeq_QuestionType { get; set; }
        public virtual int yeq_QuestionID { get; set; }
        public virtual System.DateTime yeq_CreateDate { get; set; }
        public virtual System.DateTime yeq_LastUpDate { get; set; }
        public virtual int yeq_ErrCount { get; set; }
        public virtual int yeq_RightCount { get; set; }
        public virtual string yeq_ErrorContent { get; set; }
        public virtual string yeq_RightRecord { get; set; }
        public virtual bool yeq_IsLearn { get; set; }
        public virtual bool yeq_IsDelete { get; set; }
        public virtual string yeq_InitSourceCode { get; set; }
        public virtual string yeq_SourceTitle { get; set; }
    }
}

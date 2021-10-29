using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.Application
{
    public interface IBaseService<T>
    {
        T FindEntity(object pk);
        IQueryable<T> Queryable();
      
    }
}

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abhs.WinService.Ioc
{
    public interface IDependency
    {
        void Build();

        void EndRequest();

        void AddTransient(Type from, Type to, object instance = null);

        void AddScoped(Type from, Type to, object instance = null);

        void AddSingleton(Type from, Type to, object instance = null);

        object GetInstance(Type type);

        IEnumerable GetAllInstances(Type type);
    }
}

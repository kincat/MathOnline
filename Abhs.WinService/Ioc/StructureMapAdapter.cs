using StructureMap;
using StructureMap.Configuration.DSL;
using StructureMap.Pipeline;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Abhs.WinService.Ioc
{
    public class StructureMapAdapter : IDependency, IDisposable
    {
        private bool _disposed = false;
        private Container _container;
        private Registry _registry;

        public StructureMapAdapter()
        {
            this._registry = new Registry();
        }

        public void Build()
        {
            _container = new Container(_registry);
        }

        public void EndRequest()
        {
            //HttpContextLifecycle.DisposeAndClearAll();
        }

        public void AddTransient(Type from, Type to, object instance = null)
        {
            if (instance == null)
            {
                _registry.For(from).Use(to).LifecycleIs<TransientLifecycle>();
            }
            else
            {
                _registry.For(from).Use(instance).LifecycleIs<TransientLifecycle>();
            }
        }

        public void AddScoped(Type from, Type to, object instance = null)
        {
            //if (instance == null)
            //{
            //    _registry.For(from).Use(to).LifecycleIs<HttpContextLifecycle>();
            //}
            //else
            //{
            //    _registry.For(from).Use(instance).LifecycleIs<HttpContextLifecycle>();
            //}
        }

        public void AddSingleton(Type from, Type to, object instance = null)
        {
            if (instance == null)
            {
                _registry.For(from).Use(to).LifecycleIs<SingletonLifecycle>();
            }
            else
            {
                _registry.For(from).Use(instance).LifecycleIs<SingletonLifecycle>();
            }
        }

        public object GetInstance(Type type)
        {
            return _container.GetInstance(type);
        }

        public IEnumerable GetAllInstances(Type type)
        {
            return _container.GetAllInstances(type);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    this._container.Dispose();
                }

                _disposed = true;
            }
        }
    }
}
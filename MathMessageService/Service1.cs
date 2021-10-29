using Abhs.Application.Service;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace MathMessageService
{
    public partial class Service1 : ServiceBase
    {
        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            MessageConsumerService consumer = new MessageConsumerService();
            //死循环处理消息消费内容
            while (true)
            {
                consumer.Consumer();
            }
        }

        protected override void OnStop()
        {

        }
    }
}

namespace Abhs.WinService
{
    partial class ProjectInstaller
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region 组件设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.Abhs = new System.ServiceProcess.ServiceProcessInstaller();
            this.AbhsWinService = new System.ServiceProcess.ServiceInstaller();
            // 
            // Abhs
            // 
            this.Abhs.Account = System.ServiceProcess.ServiceAccount.LocalSystem;
            this.Abhs.Installers.AddRange(new System.Configuration.Install.Installer[] {
            this.AbhsWinService});
            this.Abhs.Password = null;
            this.Abhs.Username = null;
            // 
            // AbhsWinService
            // 
            this.AbhsWinService.ServiceName = "AbhsWinService";
            this.AbhsWinService.StartType = System.ServiceProcess.ServiceStartMode.Automatic;
            // 
            // ProjectInstaller
            // 
            this.Installers.AddRange(new System.Configuration.Install.Installer[] {
            this.Abhs});

        }

        #endregion

        private System.ServiceProcess.ServiceProcessInstaller Abhs;
        public System.ServiceProcess.ServiceInstaller AbhsWinService;
    }
}
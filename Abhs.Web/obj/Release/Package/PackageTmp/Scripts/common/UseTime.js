var date1 = Date.parse(new Date());
var date2 = null
var dateValue = 0
var eventing = 0
function ScreenSaver(settings) {
    this.settings = settings;
    this.nTimeout = this.settings.timeout;
    document.body.screenSaver = this;
    // link in to body events      
    document.body.onmousemove = ScreenSaver.prototype.onevent;
    document.body.onmousedown = ScreenSaver.prototype.onevent;
    document.body.onkeydown = ScreenSaver.prototype.onevent;
    document.body.onkeypress = ScreenSaver.prototype.onevent;
    var pThis = this;
    var f = function () { pThis.timeout(); }
    this.timerID = window.setTimeout(f, this.nTimeout);
}
ScreenSaver.prototype.timeout = function () {
    var pThis = this;
    if (!this.saver) {
        eventing = 0
        /* 120s 后无操作停止记录时间 计算此刻与最初的时间差 */
        console.log("120秒内无操作,开始停止计时");
        date2 = Date.parse(new Date())
        dateValue += date2 - date1
    }
}
ScreenSaver.prototype.signal = function () {
    if (this.saver) {
        this.saver.stop();
    }
    window.clearTimeout(this.timerID);
    var pThis = this;
    var f = function () { pThis.timeout(); }
    this.timerID = window.setTimeout(f, this.nTimeout);
}
ScreenSaver.prototype.reset = function () {
    date1 = Date.parse(new Date());
    date2 = null
    dateValue = 0
    eventing = 0
    console.log("eventing:" + eventing + ",dateValue:" + dateValue);
}
ScreenSaver.prototype.dateDiff = function () {
    date2 = Date.parse(new Date())
    var val = date2 - date1;
    return (val / 1000) < 1 ? 1 : val / 1000;
}

ScreenSaver.prototype.onevent = function (e) {
    this.screenSaver.signal();
    eventing++
    /* console.log("开始操作", eventing) */
    if (eventing == 1) {
        /* 页面刚进来有操作后才开始计算时间 */
        /* 5秒过后又重新操作了也重新开始计算时间 */
        date1 = Date.parse(new Date())
    }
}

var saver;
function initScreenSaver() {
    //blort;      
    saver = new ScreenSaver({ timeout: 10000 });   //无动作时间  
   
}
window.onload = function () {
    initScreenSaver();
}

setInterval(function ()
{
    //console.log("dateValue:" + dateValue)
    //console.log("eventing:" + eventing)
}, 3000);
/*
autor: 孟凡博
email: mengfanbo-41@163.com
createdate: 2021年02月26日
updatedate: 2021年02月26日
description: 课后任务里的-上课记录展示
*/


//所有班级的学生分类列表
var classStudentsList = [];
var source_studentlist = {};

var classStudentsList_animate = null;
var source_studentlist_animate = null;

var studentMessageList = [];
var classAllMsg = [];

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var taskClass = {

    urlhost: "http:\/\/mathschool.abhseducation.com\/",
    AsynUrls: {
        url_GetAllMessageByStudentId: "/api/getallmessage/{courseid}/{studentid}",
        url_getAllClasses: "/api/message/getclasses",
        url_getStudentsByClassId: "/api/message/getstudents/{corseid}",
        url_getAllStudentsDetails: "/api/message/getclassmsg",
        url_getStudentDetails: "/api/message/getstudentmsg",
        url_GetClassNewMsg: "/api/message/getclassnewmsg",
        url_GetStudentNewMsg: "/api/message/getstudentnewmsg",
        url_doAttentionStudent: "/api/message/attention_student/{isAttention}", //关注
        url_HandleMessage: "/api/message/handle", //处理消息
        url_Delay: "/api/message/delay", //延迟下课30分钟,
        url_GetQuestionDetail: "/api/message/getquestionlib/{questionid}",
        url_GetOnlineStudentsByCorseid: "/api/message/getonlinestudents/{corseid}",
        url_DismissClass: "/api/message/dismiss", //立即下课
        url_GetStudentMonitorDetail: "/api/message/getstudentdetail",
        url_HandleAllMessage: "/api/message/handleall"
    },


    //type 2:提问 1 预警 0 学情
    showStudentContent: function (classdate, type, courseid, studentid) {
        console.log("type=" + type + ",courseid=" + courseid + ",studentid=" + studentid);
        $("#asktab").find('a').attr("actionvalue", courseid);
        //this.getStudentDetails("10808-10126-20210226-1315-1600", 100012);

        this.getStudentDetails(courseid, studentid);

        //设置标题
        $(".title").text(classdate);

        $("#asktab a.fr").eq(type).addClass("ljlactive").siblings().removeClass('ljlactive');
        $('.content83 .contbox').find('.listitem').eq(type).show().siblings('.listitem').hide();
        $('.content83 .niceScrollbox').getNiceScroll().resize();

        //呼唤出右侧滑动窗口
        $('.content83').toggleClass('content83_1');
        $('.content83 .maskbox').toggle();
       
    },


    //获取某个学生下的所有消息
    getStudentDetails: function (courseid, studentid) {
        var that = this;

        //let schoolid = obj.closest("#studentlist_container").find(".student_title").data("schoolid");
        //let classid = curClassId;

        // 如果已经初始化过了,就不在重新获取. 由后续的定时器来自动更新.
        // 另外可以只获取最新的部分消息,更新js对象.
        //if (studentMessageList["student_" + studentid] != undefined) {
        //    that.buildStudentMessageHtml(studentid);
        //    return;
        //}

        $.ajax({
            async: false,
            type: "get",
            datatype: "json",
            url: taskClass.AsynUrls.url_GetAllMessageByStudentId.replace("{courseid}", courseid).replace("{studentid}", studentid),
            //url: taskClass.AsynUrls.url_getStudentDetails,
            //data: {
            //    SchoolID: 10808,
            //    ClassID: curClassId,
            //    StudentID: studentid,
            //    corseid: courseid
            //},
            success: function (info) {
                if (info.code == 200) {
                    // 加载头部. 当前选中的学生的总体详情
                    //加载消息区域
                    if (info.data.result != null && info.data.result.length > 0) {
                        let msgList = info.data.result;
                        studentMessageList["source_student_" + studentid] = msgList;

                        that.doAllocMessage_student(studentid, msgList);

                        console.log("--获取某个学生下的所有消息 studentMessageList[student_" + studentid + "]")
                        console.log(studentMessageList["student_" + studentid]);

                        that.buildStudentMessageHtml(studentid);
                    }
                    else {
                        //$(".student_question_container").html("<div class=\"nodate\"></div>")
                        //$(".student_warning_container").html("<div class=\"nodate1\"></div>");
                        //$(".student_all_container").html("");
                        //$(".student_question_untreatcount").text(0);
                        //$(".student_warning_untreatcount").text(0);
                    }
                }
            }
        });



    },

    //=============== 单个学生消息结构体 ===============
    doAllocMessage_student: function (studentid, msgList) {

        var isHaveExpireMsg = false;

        //消息已经在服务端按时间进行了倒序排序. 最新的时间在最前面
        if (msgList.length > 0) {
            //为空则初始化,否则就是修改

            var msg_stuct = {
                newest: "",
                question: { //提问
                    untreatcount: 0,
                    count: 0,
                    info: new Map()
                },
                warning: { //预警
                    untreatcount: 0,
                    count: 0,
                    info: new Map()
                },
                other: { //
                    info: new Map()
                },
                all: new Map() //所有学情
            };

            var previous_key = "";
            var previous_name = "";
            var previous_indexpos = 0;

            var quesIndex = 0;
            var warnIndex = 0;

            for (let i = 0; i < msgList.length; i++) {
                let msg = msgList[i];
                if (i == 0) {
                    msg_stuct.newest = msg.message_id;
                }
                var current_lessonKey = "";
                var current_itemname = "";
                //智能学习或者智能提升下, 按课时分类
                current_lessonKey = "module_" + msg.module_type;

                if (msg.module_type == 1 || msg.module_type == 2 || msg.module_type == 3) {
                    current_itemname = " 第" + msg.lesson_index + "课 “" + msg.lesson_name + "”" + msg.module_name
                }
                else {
                    current_itemname = msg.module_name;
                }



                //同属上个分类,则跟上个分类归在一起.只分相邻紧挨着的. 用于学情
                //all 结构体, 用于学情展示
                if (previous_key == current_lessonKey + "_" + previous_indexpos) {

                    var item = msg_stuct.all.get(previous_key);

                    //push后, 最新的跑到了最下面.
                    item.list.push(msg);
                    msg_stuct.all.set(previous_key, item);
                }
                else {
                    //当前的消息跟上一个消息不在同一个分类下,则新建分类,用key区分.因为name可能相同
                    previous_indexpos = previous_indexpos + 1; //这里必须加1,用来区分虽然同类,但是不挨着的分组
                    previous_key = current_lessonKey + "_" + previous_indexpos;
                    previous_name = current_itemname;
                    var item = {};
                    item.name = previous_name;
                    item.module_type = msg.module_type;
                    item.lesson_module_type = msg.lesson_module_type;
                    item.action_type = msg.action_type;
                    item.list = [];
                    item.list.push(msg);
                    msg_stuct.all.set(previous_key, item);
                }


                //提问
                if (msg.message_type == 1) {

                    if (!msg_stuct.question.info.has(current_lessonKey)) {
                        var item = {};
                        item.name = current_itemname;
                        item.module_type = msg.module_type;
                        item.lesson_module_type = msg.lesson_module_type;
                        item.list = [];
                        item.list.push(msg);
                        msg_stuct.question.info.set(current_lessonKey, item);
                    }
                    else {
                        var item = msg_stuct.question.info.get(current_lessonKey);
                        item.list.push(msg);
                        msg_stuct.question.info.set(current_lessonKey, item);
                    }
                    msg_stuct.question.count++;
                    if (msg.state == 1) {
                        msg_stuct.question.untreatcount++;
                    }
                    if (quesIndex == 0) {
                        msg_stuct.question.newest = msg.message_id;
                        quesIndex++;
                    }

                }
                else if (msg.message_type == 2) { //预警

                    if (!msg_stuct.warning.info.has(current_lessonKey)) {
                        var item = {};
                        item.name = current_itemname;
                        item.module_type = msg.module_type;
                        item.lesson_module_type = msg.lesson_module_type;
                        item.list = [];
                        item.list.push(msg);
                        msg_stuct.warning.info.set(current_lessonKey, item);
                    }
                    else {
                        var item = msg_stuct.warning.info.get(current_lessonKey);
                        item.list.push(msg);
                        msg_stuct.warning.info.set(current_lessonKey, item);
                    }
                    msg_stuct.warning.count++;
                    if (msg.state == 1) {
                        msg_stuct.warning.untreatcount++;
                    }

                    if (warnIndex == 0) {
                        msg_stuct.warning.newest = msg.message_id;
                        warnIndex++;
                    }

                }
                else if (msg.message_type == 3 || msg.message_type == 4) { //学情和特殊学情
                    msg_stuct.other.info.set(msg.message_id, msg);
                }

            }


            studentMessageList["student_" + studentid] = msg_stuct;


        }

        return isHaveExpireMsg;

    },

    //------------------HTML-----------------单个学生-消息区域
    buildStudentMessageHtml: function (studentid) {
        if (typeof studentMessageList["student_" + studentid] != "undefined" && studentMessageList["student_" + studentid] != null) {

            var that = this;

            let msg_stuct = studentMessageList["student_" + studentid];
            $(".student_question_container").html("")
            $(".student_warning_container").html("");
            $(".student_all_container").html("");

            //提问-标签页
            if (msg_stuct.question.info.size > 0) {

                msg_stuct.question.info.forEach(function (valueE, key) {
                    let item = valueE;
                    let html_smi = $("#hide_template .template_student_message_item").clone(true);
                    html_smi.toggleClass("template_student_message_item");
                    
                    //分类标题
                    html_smi.find(".categoryname").text(item.name).attr("data-key", key);

                    //分类单字缩写
                    html_smi.find(".singleword").text(taskClass.getSimpleWord_BigModuleType(item.module_type));

                    if (typeof item.list != "undefined" && item.list.length > 0) {
                        $.each(item.list, function (i, msg) {
                            let html_msgItem = $("#hide_template .template_msgitem").clone(true);
                            html_msgItem.toggleClass("template_msgitem");
                            html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);
                            
                            html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));
                            html_msgItem.find(".listbox").addClass("doublelinebox");
                            //消息内容处理
                            //html_msgItem.find(".listbox .btns").html("");
                            try {
                                var askItem = JSON.parse(msg.message_content);


                                //普通题目提问
                                if (askItem.AskType == 1) {
                                    var questionAsk = JSON.parse(askItem.AskContentJson);

                                    let msgitem_detail = $("#hide_template .msgitem_xueqing_tiwen").clone().removeClass("msgitem_xueqing_tiwen");

                                    //标题部分
                                    msgitem_detail.find(".info").addClass("info1").html("<span>“" + that.getSimpleModuleType(msg.module_name, msg.lesson_module_typename) + "” 题目提问</span>");
                                    html_msgItem.find(".cnttext").append(msgitem_detail);

                                    //题干部分
                                    let msgitem_detail2 = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                    msgitem_detail2.find(".info").append("<label>题目题干：</label>");
                                    msgitem_detail2.find(".info").addClass("msgitem_detail_content").append(msg.question_itemname);
                                    html_msgItem.find(".cnttext").append(msgitem_detail2);

                                    //挖空&渲染...
                                    //MathJaxRender(msgitem_detail2.find(".msgitem_detail_content")[0], msgitem_detail2);

                                }
                                    //题型题目提问
                                else if (askItem.AskType == 2) {

                                    var typeQuestionAsk = JSON.parse(askItem.AskContentJson);

                                    let msgitem_detail = $("#hide_template .msgitem_xueqing_tiwen").clone().removeClass("msgitem_xueqing_tiwen");


                                    //标题部分
                                    msgitem_detail.find(".info").addClass("info1").html("<span>“" + msg.question_typename + "” 题型提问</span>");
                                    html_msgItem.find(".cnttext").append(msgitem_detail);

                                    //题型名称 暂无

                                    //题干部分
                                    let msgitem_detail2 = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                    msgitem_detail2.find(".info").append("<label>问题描述：</label>");
                                    msgitem_detail2.find(".info").addClass("msgitem_detail_content").append(msg.question_itemname);
                                    html_msgItem.find(".cnttext").append(msgitem_detail2);

                                    //挖空&渲染...
                                    //MathJaxRender(msgitem_detail2.find(".msgitem_detail_content")[0], msgitem_detail2);


                                }
                                    //视频提问
                                else if (askItem.AskType == 3) {
                                    var videoAsk = JSON.parse(askItem.AskContentJson);
                                    if (videoAsk.VideoUrl != "") {

                                        let msgitem_detail = $("#hide_template .msgitem_xueqing_tiwen").clone().removeClass("msgitem_xueqing_tiwen");

                                        //标题部分
                                        msgitem_detail.find(".info").addClass("info1").html("<span class=\"hasimg\">“" + videoAsk.VideoName + "” 视频提问</span>");

                                        html_msgItem.find(".cnttext").append(msgitem_detail);

                                        //提问时间
                                        if (videoAsk.VideoTimePoint > 0) {

                                            let m = 0, s = 0;
                                            if (videoAsk.VideoTimePoint < 60) {
                                                s = videoAsk.VideoTimePoint;
                                            }
                                            else {
                                                m = parseInt(videoAsk.VideoTimePoint / 60);
                                                s = parseInt(videoAsk.VideoTimePoint % 60)
                                            }

                                            msgitem_detail = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                            msgitem_detail.find(".info").append("<label>提问时间：</label>")
                                            msgitem_detail.find(".info").append(m + "分" + s + "秒");

                                            html_msgItem.find(".cnttext").append(msgitem_detail);
                                        }

                                        //问题描述
                                        msgitem_detail = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                        msgitem_detail.find(".info").append("<label>问题描述：</label>");
                                        msgitem_detail.find(".info").append(videoAsk.Remark.replace("㊣", "；"));
                                        html_msgItem.find(".cnttext").append(msgitem_detail);

                                    }
                                }

                                html_msgItem.attr("status", "finish");
                            } catch (exception) {
                               
                            }
                            if (msg.state == 1) {
                                //未处理
                                html_msgItem.attr("status", "wait");
                                html_msgItem.find(".lineinfo").addClass("dotcolor_yellow"); //黄色小圆点
                            }
                            else if (msg.state == 2) {
                                //已处理
                                html_msgItem.find(".cnttext").append("<div class=\"tet hasignore\"><i>已呼叫</i></div>");
                                html_msgItem.addClass("listdef");
                                html_msgItem.find(".lineinfo").addClass("dotcolor_grey");
                            }
                            else if (msg.state == 3) {
                                //已忽略
                                html_msgItem.find(".cnttext").append("<div class=\"tet hasignore\"><i>已忽略</i></div>");
                                html_msgItem.addClass("listdef");
                                html_msgItem.find(".lineinfo").addClass("dotcolor_grey");
                            }
                            else if (msg.state == 4) {
                                //已忽略
                                html_msgItem.find(".cnttext").append("<div class=\"tet hasignore\"><i>自动忽略</i></div>");
                                html_msgItem.addClass("listdef");
                                html_msgItem.find(".lineinfo").addClass("dotcolor_grey");
                            }

                            html_smi.find(".ljlcnt").append(html_msgItem);
                        });
                    }

                    $(".student_question_container").append(html_smi);

                });

            }
            else {
                //$(".student_question_container").html("<div class=\"nodate\"></div>");
            }
            //预警-标签页
            if (msg_stuct.warning.info.size > 0) {


                msg_stuct.warning.info.forEach(function (valueE, key) {
                    let item = valueE;
                    let html_smi = $("#hide_template .template_student_message_item").clone(true);
                    html_smi.toggleClass("template_student_message_item");
                    html_smi.find(".categoryname").text(item.name).attr("data-key", key);

                    //分类单字缩写
                    html_smi.find(".singleword").text(taskClass.getSimpleWord_BigModuleType(item.module_type));

                    if (typeof item.list != "undefined" && item.list.length > 0) {
                        $.each(item.list, function (i, msg) {
                            let html_msgItem = $("#hide_template .template_situation_msgitem").clone(true);
                            html_msgItem.toggleClass("template_situation_msgitem");
                            //html_msgItem.addClass("list3");
                            html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);;
                            html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));
                            html_msgItem.find(".lineinfo").addClass("dotcolor_red"); //红色小圆点
                            html_msgItem.find(".listbox").addClass("singlelinebox"); //预警都是单行的

                            let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                            t_tet.find(".info span").html(msg.message_content);
                            html_msgItem.find(".cnttext").append(t_tet);


                            html_msgItem.attr("status", "finish");
                            if (msg.state == 1) {
                                //未处理
                                html_msgItem.attr("status", "wait");
                            }
                            else if (msg.state == 2) {
                                //已处理
                                html_msgItem.find(".tet .info span").append("<i>已提醒</i>");
                                html_msgItem.addClass("listdef");
                            }
                            else if (msg.state == 3) {
                                //已忽略
                                html_msgItem.find(".tet .info span").append("<i>已忽略</i>");
                                html_msgItem.addClass("listdef");
                            }
                            else if (msg.state == 4) {
                                //已忽略
                                html_msgItem.find(".tet .info span").append("<i>自动忽略</i>");
                                html_msgItem.addClass("listdef");
                            }

                            html_smi.find(".ljlcnt").append(html_msgItem);
                        });
                    }

                    $(".student_warning_container").append(html_smi);

                });

            }
            else {
                //$(".student_warning_container").html("<div class=\"nodate1\"></div>");
            }
            //学情-标签页
            if (msg_stuct.all.size > 0) {

                msg_stuct.all.forEach(function (valueE, key) {
                    let item = valueE;

                    let html_category = $("#hide_template .template_situation_category").clone(true);
                    html_category.removeClass("template_situation_category");

                    let category_name = item.name;
                    if (item.module_type != 9 && item.module_type != 10 && item.module_type != 11 && item.module_type != 30) {
                        category_name = "开始" + category_name;
                    }
                    //分类名称
                    html_category.find(".categoryname").text(category_name).attr("data-key", key);
                    //单字简写
                    html_category.find(".singleword").text(taskClass.getSimpleWord_BigModuleType(item.module_type));


                    //循环处理具体的学情内容
                    if (typeof item.list != "undefined" && item.list.length > 0) {
                        $.each(item.list, function (i, msg) {

                            //提问-学情
                            if (msg.message_type == 1) {

                                let html_msgItem = $("#hide_template .template_situation_msgitem").clone(true);
                                html_msgItem.toggleClass("template_situation_msgitem");
                                html_msgItem.addClass("list5").find(".lineinfo").addClass("dotcolor_yellow"); //橙色的小底单
                                html_msgItem.find(".listbox").addClass("doublelinebox"); //提问一定是多行
                                html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);

                                html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));

                                //消息内容处理

                                try {
                                    var askItem = JSON.parse(msg.message_content);

                                    var current_lessonKey = "";

                                    //普通题目提问-学情
                                    if (askItem.AskType == 1) {
                                        var questionAsk = JSON.parse(askItem.AskContentJson);

                                        let msgitem_detail = $("#hide_template .msgitem_xueqing_tiwen").clone().removeClass("msgitem_xueqing_tiwen");

                                        //标题部分
                                        msgitem_detail.find(".info").addClass("info1").html("<span>“" + taskClass.getSimpleModuleType(msg.module_name, msg.lesson_module_typename) + "” 题目提问</span>");
                                        html_msgItem.find(".cnttext").append(msgitem_detail);

                                        //题干部分
                                        let msgitem_detail2 = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                        msgitem_detail2.find(".info").append("<label>题目题干：</label>");
                                        msgitem_detail2.find(".info").addClass("msgitem_detail_content").append(msg.question_itemname);
                                        html_msgItem.find(".cnttext").append(msgitem_detail2);


                                        //挖空&渲染...
                                        //MathJaxRender(msgitem_detail2.find(".msgitem_detail_content")[0], msgitem_detail2);


                                    }
                                        //题型题目提问-学情
                                    else if (askItem.AskType == 2) {

                                        var typeQuestionAsk = JSON.parse(askItem.AskContentJson);

                                        let msgitem_detail = $("#hide_template .msgitem_xueqing_tiwen").clone().removeClass("msgitem_xueqing_tiwen");


                                        //标题部分
                                        msgitem_detail.find(".info").addClass("info1").html("<span>“" + msg.question_typename + "” 题型提问</span>");
                                        html_msgItem.find(".cnttext").append(msgitem_detail);

                                        //题型名称 暂无

                                        //题干部分
                                        let msgitem_detail2 = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                        msgitem_detail2.find(".info").append("<label>问题描述：</label>");
                                        msgitem_detail2.find(".info").addClass("msgitem_detail_content").append(msg.question_itemname);
                                        html_msgItem.find(".cnttext").append(msgitem_detail2);

                                        //挖空&渲染...
                                        //MathJaxRender(msgitem_detail2.find(".msgitem_detail_content")[0], msgitem_detail2);

                                    }
                                        //视频提问-学情
                                    else if (askItem.AskType == 3) {
                                        var videoAsk = JSON.parse(askItem.AskContentJson);
                                        if (videoAsk.VideoUrl != "") {

                                            let msgitem_detail = $("#hide_template .msgitem_xueqing_tiwen").clone().removeClass("msgitem_xueqing_tiwen");

                                            //标题部分
                                            msgitem_detail.find(".info").addClass("info1").html("<span class=\"hasimg\">“" + videoAsk.VideoName + "” 视频提问</span>");

                                            html_msgItem.find(".cnttext").append(msgitem_detail);

                                            //提问时间
                                            if (videoAsk.VideoTimePoint > 0) {

                                                let m = 0, s = 0;
                                                if (videoAsk.VideoTimePoint < 60) {
                                                    s = videoAsk.VideoTimePoint;
                                                }
                                                else {
                                                    m = parseInt(videoAsk.VideoTimePoint / 60);
                                                    s = parseInt(videoAsk.VideoTimePoint % 60)
                                                }

                                                msgitem_detail = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                                msgitem_detail.find(".info").append("<label>提问时间：</label>")
                                                msgitem_detail.find(".info").append(m + "分" + s + "秒");

                                                html_msgItem.find(".cnttext").append(msgitem_detail);
                                            }

                                            //问题描述
                                            msgitem_detail = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                            msgitem_detail.find(".info").append("<label>问题描述：</label>");
                                            msgitem_detail.find(".info").append(videoAsk.Remark.replace("㊣", "；"));
                                            html_msgItem.find(".cnttext").append(msgitem_detail);

                                        }
                                    }


                                    html_msgItem.attr("status", "finish");
                                } catch (exception) {
                                    //console.log("消息内容格式发生解析异常,原始json如下:" + msg.message_content + ",异常信息:" + exception.message);
                                }


                                if (msg.state == 1) {
                                    //未处理
                                    html_msgItem.attr("status", "wait");
                                }
                                else if (msg.state == 2) {
                                    //已处理
                                    html_msgItem.find(".cnttext").append("<div class=\"tet hasignore\"><i>已呼叫</i></div>");
                                    html_msgItem.addClass("listdef");
                                }
                                else if (msg.state == 3) {
                                    //已忽略
                                    html_msgItem.find(".cnttext").append("<div class=\"tet hasignore\"><i>已忽略</i></div>");
                                    html_msgItem.addClass("listdef");
                                }
                                else if (msg.state == 4) {
                                    //已忽略
                                    html_msgItem.find(".cnttext").append("<div class=\"tet hasignore\"><i>自动忽略</i></div>");
                                    html_msgItem.addClass("listdef");
                                }

                                html_category.find(".ljlcnt").append(html_msgItem);

                            }
                                //预警
                            else if (msg.message_type == 2) {
                                let html_msgItem = $("#hide_template .template_situation_msgitem").clone(true);
                                html_msgItem.toggleClass("template_situation_msgitem");
                                html_msgItem.addClass("list3");
                                html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);;
                                html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));
                                html_msgItem.find(".lineinfo").addClass("dotcolor_red"); //红色小圆点
                                html_msgItem.find(".listbox").addClass("singlelinebox"); //预警都是单行的

                                let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                t_tet.find(".info span").html(msg.message_content);
                                html_msgItem.find(".cnttext").append(t_tet);

                                html_msgItem.find(".cnttext").after("<div class=\"btns\"></div>")

                                html_msgItem.attr("status", "finish");
                                if (msg.state == 1) {
                                    //未处理
                                    html_msgItem.attr("status", "wait");
                                }
                                else if (msg.state == 2) {
                                    //已处理
                                    html_msgItem.find(".tet .info span").append("<i>已提醒</i>");
                                    html_msgItem.addClass("listdef");
                                }
                                else if (msg.state == 3) {
                                    //已忽略
                                    html_msgItem.find(".tet .info span").append("<i>已忽略</i>");
                                    html_msgItem.addClass("listdef");
                                }
                                else if (msg.state == 4) {
                                    //已忽略
                                    html_msgItem.find(".tet .info span").append("<i>自动忽略</i>");
                                    html_msgItem.addClass("listdef");
                                }

                                html_category.find(".ljlcnt").append(html_msgItem);
                            }
                                //学情
                            else if (msg.message_type == 3) {

                                let html_msgItem = $("#hide_template .template_situation_msgitem").clone(true);
                                html_msgItem.toggleClass("template_situation_msgitem"); //去模板类
                                html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);
                                html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));

                                html_msgItem.find(".lineinfo").addClass("dotcolor_grey"); //默认浅灰色小圆点

                                //显示小模块的单字简写
                                if (msg.lesson_module_type != "" && msg.lesson_module_type > 0 && msg.action_type == 1) {
                                    html_msgItem.find(".lineinfo").addClass("dotcolorbig_grey"); //大点加字
                                    html_msgItem.find(".singleword").text(taskClass.getSimpleWord_SmallModuleType(msg.lesson_module_type));
                                }
                                //第一行文本
                                if (msg.message_title != "" && msg.message_title != null) {
                                    let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                    t_tet.find(".info span").html(msg.message_title);
                                    html_msgItem.find(".cnttext").append(t_tet);

                                    //如果有title则表明是双行的. 
                                    html_msgItem.find(".listbox").addClass("doublelinebox");
                                }
                                else {
                                    html_msgItem.find(".listbox").addClass("singlelinebox");
                                }

                                //第二行文本
                                if (msg.message_content != "" && msg.message_content != null) {
                                    let evaluate_content = "";
                                    let reportcontent = "";
                                    if (msg.evaluate_jsoncontent != "" && msg.evaluate_jsoncontent != null) {
                                        var evaluateJson = JSON.parse(msg.evaluate_jsoncontent);
                                        if (typeof evaluateJson != "undefined" && evaluateJson.length > 0) {
                                            for (let p = 0; p < evaluateJson.length; p++) {
                                                let ev = evaluateJson[p];
                                                if (ev.type == 1) {
                                                    //正面评价
                                                    evaluate_content += "<i style=\"margin-left:20px;color: #00C00E;\">" + ev.content + "</i>";
                                                }
                                                else if (ev.type == 2) {
                                                    //负面评价
                                                    evaluate_content += "<i style=\"margin-left:20px;color: #ff0000;\">" + ev.content + "</i>";
                                                } else {
                                                    //中肯评价
                                                    evaluate_content += "<i style=\"margin-left:20px;color: #00C00E;\">" + ev.content + "</i>";
                                                }
                                                //不是最后一项的话, 加顿号分隔
                                                if (p < evaluateJson.length - 1) {
                                                    evaluate_content += "、";
                                                }
                                            }
                                        }

                                    }
                                    if (msg.reporturl != "" && msg.reporturl != null) {
                                        html_msgItem.addClass("list11");
                                        reportcontent = "<a href=\"" + taskClass.urlhost + msg.reporturl + "\" target=\"_blank\" class=\"mor\">查看报告</a>";
                                    }

                                    if (msg.action_type == 2 && msg.action_type != "" && msg.action_type != null) {
                                        html_msgItem.find(".lineinfo").removeClass("dotcolor_grey").addClass("dotcolor_black"); //完成点,深灰点表示
                                    }


                                    let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                    t_tet.find(".info span").html(msg.message_content + evaluate_content + reportcontent);
                                    html_msgItem.find(".cnttext").append(t_tet);

                                }

                                //TODO: 第三行 可能是按钮. 待做. 比如奖励,表扬


                                html_category.find(".ljlcnt").append(html_msgItem);

                            }
                                //特殊学情,包含做题数等信息
                            else if (msg.message_type == 4) {
                                try {


                                    let html_msgItem = $("#hide_template .template_situation_msgitem").clone(true);
                                    html_msgItem.toggleClass("template_situation_msgitem"); //去模板类
                                    html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);
                                    html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));

                                    html_msgItem.find(".lineinfo").addClass("dotcolor_grey"); //默认浅灰色

                                    //第一行文本
                                    if (msg.message_title != "" && msg.message_title != null) {
                                        let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                        t_tet.find(".info span").html(msg.message_title);
                                        html_msgItem.find(".cnttext").append(t_tet);

                                        //如果有title则表明是双行的. 
                                        html_msgItem.find(".listbox").addClass("doublelinebox");
                                    }
                                    else {
                                        html_msgItem.find(".listbox").addClass("singlelinebox");
                                    }

                                    //第二行文本
                                    if (msg.message_content != "" && msg.message_content != null) {

                                        let specItem = JSON.parse(msg.message_content);
                                        let allCount = specItem.AllCount;// 题目数
                                        let nullCount = specItem.NullCount; // 未作数
                                        let errCount = specItem.ErrCount;// 作错数
                                        let times = specItem.Times;// 总花费时间

                                        let hasAnswerCount = allCount - nullCount;
                                        let rightCount = specItem.RightCount; //做对题数 hasAnswerCount - errCount;


                                        let time_mimute = 0;
                                        let time_second = 0;

                                        if (times > 0) {
                                            time_mimute = parseInt(times / 60); //在线时长-分
                                            if (times < 60) {
                                                time_second = times;
                                            }
                                            else {
                                                time_second = parseInt(times % 60); //在线时长-秒
                                            }
                                        }
                                        let evaluate_content = "";
                                        let reportcontent = "";
                                        if (msg.evaluate_jsoncontent != "" && msg.evaluate_jsoncontent != null) {
                                            var evaluateJson = JSON.parse(msg.evaluate_jsoncontent);
                                            if (typeof evaluateJson != "undefined" && evaluateJson.length > 0) {
                                                for (let p = 0; p < evaluateJson.length; p++) {
                                                    let ev = evaluateJson[p];
                                                    if (ev.type == 1) {
                                                        //正面评价
                                                        evaluate_content += "、<i style=\"color: #00C00E;\">" + ev.content + "</i>";
                                                    }
                                                    else if (ev.type == 2) {
                                                        //负面评价
                                                        evaluate_content += "、<i style=\"color: #ff0000;\">" + ev.content + "</i>";
                                                    } else {
                                                        //中肯评价
                                                        evaluate_content += "、<i style=\"color: #00C00E;\">" + ev.content + "</i>";
                                                    }
                                                }
                                            }

                                        }
                                        if (msg.reporturl != "" && msg.reporturl != null) {
                                            html_msgItem.addClass("list11");
                                            reportcontent = "<a href=\"" + taskClass.urlhost + msg.reporturl + "\" target=\"_blank\" class=\"mor\">查看报告</a>";
                                        }
                                        if (msg.action_type == 2 && msg.action_type != "" && msg.action_type != null) {
                                            html_msgItem.find(".lineinfo").removeClass("dotcolor_grey").addClass("dotcolor_black"); //完成点,深灰点表示
                                        }

                                        let word = "共" + allCount + "题、答" + hasAnswerCount + "题、 对" + rightCount + "题、错" + errCount + "题、正确率" + Math.round(rightCount / allCount * 100) + "%";
                                        if (specItem.AskCount != undefined && specItem.AskCount != null && specItem.AskCount > 0) {
                                            word += "、提问" + specItem.AskCount + "次";
                                        }
                                        if (specItem.MasterCount != undefined && specItem.MasterCount != null && specItem.MasterCount > 0) {
                                            word += "、<i style=\"color: #00C00E;\">掌握" + specItem.MasterCount + "题</i>";
                                        }
                                        if (specItem.MasterTypeCount != undefined && specItem.MasterTypeCount != null && specItem.MasterTypeCount > 0) {
                                            word += "、<i style=\"color: #00C00E;\">已掌握题型" + specItem.MasterTypeCount + "个</i>";
                                        }
                                        if (specItem.NotTypeCount != undefined && specItem.NotTypeCount != null && specItem.NotTypeCount > 0) {
                                            word += "、<i style=\"color: #ff0000;\">未掌握题型" + specItem.NotTypeCount + "个</i>";
                                        }

                                        let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                        t_tet.find(".info span").html(word + evaluate_content + "。 " + reportcontent);
                                        html_msgItem.find(".cnttext").append(t_tet);

                                    }

                                    html_category.find(".ljlcnt").append(html_msgItem);

                                } catch (exception) {
                                    console.log("错误:" + exception.message)
                                }



                            }
                            else if (msg.message_type == 5) {
                                try {


                                    let html_msgItem = $("#hide_template .template_situation_msgitem").clone(true);
                                    html_msgItem.toggleClass("template_situation_msgitem"); //去模板类
                                    html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);
                                    html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));

                                    html_msgItem.find(".lineinfo").addClass("dotcolor_grey"); //默认浅灰色

                                    //第一行文本
                                    if (msg.message_title != "" && msg.message_title != null) {
                                        let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                        t_tet.find(".info span").html(msg.message_title);
                                        html_msgItem.find(".cnttext").append(t_tet);

                                        //如果有title则表明是双行的. 
                                        html_msgItem.find(".listbox").addClass("doublelinebox");
                                    }
                                    else {
                                        html_msgItem.find(".listbox").addClass("singlelinebox");
                                    }
                                    if (msg.action_type == 2 && msg.action_type != "" && msg.action_type != null) {
                                        html_msgItem.find(".lineinfo").removeClass("dotcolor_grey").addClass("dotcolor_black"); //完成点,深灰点表示
                                    }
                                    //第二行文本
                                    if (msg.message_content != "" && msg.message_content != null) {

                                        let specItem = JSON.parse(msg.message_content);

                                        let times = specItem.VideoTimes;// 视频长度
                                        let time_mimute = 0;
                                        let time_second = 0;

                                        if (times > 0) {
                                            time_mimute = parseInt(times / 60); //视频长度-分
                                            if (times < 60) {
                                                time_second = times;
                                            }
                                            else {
                                                time_second = parseInt(times % 60); //视频长度-秒
                                            }

                                        }
                                        let times2 = specItem.ValidTime;// 有效学习时长
                                        let time_mimute2 = 0;
                                        let time_second2 = 0;

                                        if (times > 0) {
                                            time_mimute2 = parseInt(times2 / 60); //有效学习时长-分
                                            if (times2 < 60) {
                                                time_second2 = times2;
                                            }
                                            else {
                                                time_second2 = parseInt(times2 % 60); //有效学习时长-秒
                                            }

                                        }



                                        let evaluate_content = "";
                                        let reportcontent = "";
                                        if (msg.evaluate_jsoncontent != "" && msg.evaluate_jsoncontent != null) {
                                            var evaluateJson = JSON.parse(msg.evaluate_jsoncontent);
                                            if (typeof evaluateJson != "undefined" && evaluateJson.length > 0) {
                                                for (let p = 0; p < evaluateJson.length; p++) {
                                                    let ev = evaluateJson[p];
                                                    if (ev.type == 1) {
                                                        //正面评价
                                                        evaluate_content += "、<i style=\"color: #00C00E;\">" + ev.content + "</i>";
                                                    }
                                                    else if (ev.type == 2) {
                                                        //负面评价
                                                        evaluate_content += "、<i style=\"color: #ff0000;\">" + ev.content + "</i>";
                                                    } else {
                                                        //中肯评价
                                                        evaluate_content += "、<i style=\"color: #00C00E;\">" + ev.content + "</i>";
                                                    }
                                                }
                                            }

                                        }
                                        if (msg.reporturl != "" && msg.reporturl != null) {
                                            html_msgItem.addClass("list11");
                                            reportcontent = "、<a href=\"" + taskClass.urlhost + msg.reporturl + "\" target=\"_blank\" class=\"mor\">查看报告</a>";
                                        }

                                        let word = "视频长度" + time_mimute + "分" + time_second + "秒、有效学习" + time_mimute2 + "分" + time_second2 + "秒";

                                        if (specItem.AskCount != undefined && specItem.AskCount != null && specItem.AskCount > 0) {
                                            word += "、提问" + specItem.AskCount + "次";
                                        }

                                        let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                        t_tet.find(".info span").html(word + evaluate_content + "。 " + reportcontent);
                                        html_msgItem.find(".cnttext").append(t_tet);

                                    }

                                    html_category.find(".ljlcnt").append(html_msgItem);

                                } catch (exception) {
                                    console.log("错误:" + exception.message)
                                }
                            } else if (msg.message_type == 6) {
                                let html_msgItem = $("#hide_template .template_situation_msgitem").clone(true);
                                html_msgItem.toggleClass("template_situation_msgitem"); //去模板类
                                html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);
                                html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));
                                html_msgItem.find(".lineinfo").addClass("dotcolor_grey"); //默认浅灰色
                                //第一行文本
                                if (msg.message_title != "" && msg.message_title != null) {
                                    let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                    t_tet.find(".info span").html(msg.message_title);
                                    html_msgItem.find(".cnttext").append(t_tet);

                                    //如果有title则表明是双行的. 
                                    html_msgItem.find(".listbox").addClass("singlelinebox");
                                }                                
                                html_category.find(".ljlcnt").append(html_msgItem);
                            }

                        });

                        $(".student_all_container").append(html_category);
                    }

                });

                //最后一条消息, 表示最新的一条数据,用蓝色的点
                $(".student_all_container").find(".ljlshowbox").eq(0).find(".ljlcnt .lineinfo").eq(0).removeClass("dotcolor_grey").addClass("dotcolor_blue").addClass("dotcolorbig_blur");

            }


            $('.student_all_container .ljlshowbox .list1 .cnttext').click(function () {
                var obj = $(this);
                obj.find('span').toggleClass('degspan');
                $(this).parents('.ljlshowbox').find('.ljlcnt').slideToggle(function () {
                    $('.content83 .niceScrollbox').getNiceScroll().resize();
                });
            });
            MathJax.typeset();
            ShowInput3();
            $('.content8 .niceScrollbox').getNiceScroll().resize();
        }
    },

    //返回大模块单字简写
    getSimpleWord_BigModuleType: function (module_type) {
        var word = "";
        switch (module_type) {
            case 1:
                word = "学";
                break;
            case 2:
                word = "提";
                break;
            case 3:
                word = "作";
                break;
            case 4:
                word = "任";
                break;
            case 5:
                word = "订";
                break;
            case 6:
                word = "阅";
                break;
            case 7:
                word = "阅";
                break;
            case 8:
                word = "算";
                break;
            case 9:
                word = "登";
                break;
            case 10:
                word = "退";
                break;
            case 11:
                word = "首";
                break;
            case 30:
                word = "奖";
                break;
            default:
                word = "学";
                break;
        }

        return word;
    },
    //返回小模块单字简写
    getSimpleWord_SmallModuleType: function (lesson_module_type) {
        var word = "学";
        switch (lesson_module_type) {
            case 10:
                word = "测";
                break;
            case 11:
                word = "错";
                break;
            case 12:
                word = "阅";
                break;
            case 13:
                word = "基";
                break;
            case 14:
                word = "学";
                break;
            case 15:
                word = "例";
                break;
            case 16:
                word = "查";
                break;
            case 21:
                word = "提";
                break;
            case 22:
                word = "学";
                break;
            case 31:
                word = "学";
                break;
            case 32:
                word = "阅";
                break;
            case 33:
                word = "练";
                break;
            case 41:
                word = "学";
                break;
            case 42:
                word = "练";
                break;
            case 81:
                word = "闯";
                break;
            case 82:
                word = "练";
                break;

        }

        return word;
    },

    getSimpleModuleType: function (moduleTypeName, SmallTypeName) {
        if (SmallTypeName != "") {
            return SmallTypeName;
        }
        else {
            return moduleTypeName;
        }
    },

    showHourAndMinute: function (fulltime) {
        if (fulltime.length > 0) {
            let part = fulltime.split("T");
            let date = part[0];
            let time = part[1];

            let timepart = time.split(":");
            let hour = timepart[0];
            let minute = timepart[1];
            let second = timepart[2].split(".")[0];

            return hour + ":" + minute;
        }
        return "";
    },

}


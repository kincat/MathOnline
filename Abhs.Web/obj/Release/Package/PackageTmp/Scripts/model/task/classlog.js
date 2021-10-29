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

var classLogGo = {
    config_offlineDuration: 15,
    urlhost: "http:\/\/math.abhseducation.com\/",
    AsynUrls: {

        url_getAllStudentsDetails: "/api/message/getclassmsg",
        url_getStudentDetails: "/api/message/getstudentmsg",

        url_GetQuestionDetail: "/api/message/getquestionlib/{questionid}",
        url_GetStudentMonitorDetail: "/api/message/getstudentdetail",
        url_GetAllMessageByCourseId: "/api/getallmessage/{courseid}",

    },

    //type 0出勤 1 预警 2 提问
    showClassContent: function (classdate, type, courseid, classid) {
        
        $("#asktab").find('a').attr("actionvalue", courseid);
        //this.getAllStudentsDetails("10808-10126-20210226-1315-1600", 10126);
        //预警和提问
        this.getAllStudentsDetails(courseid, classid);
        //出勤
        attendanceDetail(courseid, classdate);
        let sldf = "";
        if(type==0){
            sldf = "班级出勤";
        }
        if (type == 1) {
            sldf = "班级预警";
        }
        if (type == 2) {
            sldf = "班级提问";
        }
        //设置标题
        $(".loltitle").text(classdate + sldf);

        $("#asktab a.fr").eq(type).addClass("ljlactive").siblings().removeClass('ljlactive');
        $('.content82 .contbox').find('.listitem').eq(type).show().siblings('.listitem').hide();
        $('.content82 .niceScrollbox').getNiceScroll().resize();

        //呼唤出右侧滑动窗口
        $('.content82').toggleClass('content82_1');
        $('.content82 .maskbox').toggle();

    },

    //获取该班级下所有学生的全部消息
    getAllStudentsDetails: function (courseid, classid) {

        var that = this;

        //if (classAllMsg["class_" + classid] != undefined) {
        //    //TODO: 只获取最新的部分消息
        //    that.buildClassMessageHtml(classid);
        //    return;
        //}

        $.ajax({
            async: false,
            type: "get",
            datatype: "json",
            url: classLogGo.AsynUrls.url_GetAllMessageByCourseId.replace("{courseid}", courseid),
            //url: classLogGo.AsynUrls.url_getAllStudentsDetails,
            //data: {
            //    SchoolID: 10808,
            //    ClassID: classid,
            //    StudentID: 0,
            //    corseid: courseid
            //},
            success: function (info) {
                if (info.code == 200) {

                    //加载消息区域
                    if (info.data.result != null && info.data.result.length > 0) {
                        classAllMsg["source_class_" + classid] = info.data.result;
                        that.doAllocAllMessage(classid, info.data.result)
                        that.buildClassMessageHtml(classid);
                    }
                    else {

                        //TODO:暂无提问

                        //TODO:暂无预警
                    }

                }
            }
        });

    },


    //=============== 班级结构体 ===============
    doAllocAllMessage: function (classid, msgList) {

        var isHaveExpireMsg = false;

        if (msgList.length > 0) {
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
                }
            };


            for (let i = 0; i < msgList.length; i++) {
                let msg = msgList[i];
                if (i == 0) {
                    msg_stuct.newest = msg.message_id;
                }
                var current_lessonKey = "";
                var current_itemname = "";
                //如果提问有题型的按题型进行聚合分类
                //有视频的按视频进行聚合分类.
                //出去题型和视频,其它的按模块聚合分类
                if (msg.question_typecode != "" && msg.question_typecode != null) {
                    current_lessonKey = "typecode_" + msg.question_typecode;
                    current_itemname = "第" + msg.lesson_index + "课时 “" + msg.question_typename + "” 题型提问";
                }
                else if (msg.lesson_module_type == 14 || msg.lesson_module_type == 22) {
                    current_lessonKey = "video_" + msg.lesson_itemid;
                    current_itemname = "第" + msg.lesson_index + "课时 “" + msg.lesson_itemname + "” 视频提问";
                }
                else {
                    current_lessonKey = "module_" + msg.lesson_module_type;
                    current_itemname = "“" + classLogGo.getSimpleModuleType(msg.module_name, msg.lesson_module_typename) + "” 题目提问";
                }


                //提问的类型, 要按照题型和模块进行分组.
                if (msg.message_type == 1) {

                    if (!msg_stuct.question.info.has(current_lessonKey)) {
                        var item = {};
                        item.name = current_itemname;
                        item.list = [];
                        item.list.push(msg);
                        item.count = 1;
                        item.peoplelist = new Map();
                        item.untreatcount = 0;
                        item.peoplecount = 1;
                        if (msg.state == 1) {
                            item.untreatcount = 1;
                            item.peoplelist.set("s_" + msg.student_id, 1);
                        }
                        msg_stuct.question.info.set(current_lessonKey, item);
                    }
                    else {
                        var item = msg_stuct.question.info.get(current_lessonKey);
                        item.count++;
                        if (msg.state == 1) {
                            item.untreatcount++;
                            //没找到
                            if (!item.peoplelist.has("s_" + msg.student_id)) {
                                item.peoplelist.set("s_" + msg.student_id, 1);
                                item.peoplecount++;
                            }
                            else {
                                item.peoplelist.set("s_" + msg.student_id, item.peoplelist.get("s_" + msg.student_id) + 1);
                            }
                        }
                        item.list.push(msg);
                        msg_stuct.question.info.set(current_lessonKey, item);
                    }
                    msg_stuct.question.count++;
                    if (msg.state == 1) {
                        msg_stuct.question.untreatcount++;
                    }

                }
                else if (msg.message_type == 2) { //预警

                    let studentkey = "student_" + msg.student_id;

                    if (!msg_stuct.warning.info.has(studentkey)) {
                        var item = {};
                        item.stuid = msg.student_id;
                        item.name = msg.student_name;
                        item.head = msg.head;
                        item.level = msg.level;
                        item.count = 1;
                        item.untreatcount = 0;
                        if (msg.state == 1) {
                            item.untreatcount = 1;
                        }
                        item.hasnew = 0;
                        item.list = [];
                        item.list.push(msg);
                        msg_stuct.warning.info.set(studentkey, item);
                    }
                    else {
                        var item = msg_stuct.warning.info.get(studentkey);
                        item.count++;
                        if (msg.state == 1) {
                            item.untreatcount++;
                        }
                        item.list.push(msg);
                        msg_stuct.warning.info.set(studentkey, item);
                    }

                    msg_stuct.warning.count++;
                    if (msg.state == 1) {
                        msg_stuct.warning.untreatcount++;
                    }

                }
            }


            classAllMsg["class_" + classid] = msg_stuct;
            console.log("构造班级所有消息,分类结构:  classAllMsg[\"class_" + classid + "\"] ");
            console.log(msg_stuct);

        }

        return isHaveExpireMsg;
    },

    //------------------HTML-----------------
    buildClassMessageHtml: function (classid) {
        if (classAllMsg["class_" + classid] != undefined) {

            var that = this;

            let msg_stuct = classAllMsg["class_" + classid];


            //提问
            if (msg_stuct.question.info.size > 0) {

                $(".content82 .askbox").html("");

                msg_stuct.question.info.forEach(function (valueE, key) {
                    let item = valueE;
                    let html_smi = $("#hide_template .template_class_message_question").clone(true);
                    html_smi.toggleClass("template_class_message_question");
                    html_smi.find(".ftitlte label").text(item.name).attr("data-key", key);
                    if (key.indexOf("video_") > -1) {
                        html_smi.find(".ftitlte label").addClass("hasimg");
                    }

                    html_smi.find(".questionmore").attr("data-key", key).attr("data-classid", classid);


                    if (typeof item.list != "undefined" && item.list.length > 0) {
                        $.each(item.list, function (i, msg) {
                            //构造提问主区域的内容


                            //第一个消息元素,显示到外面
                            if (i == 0) {
                                html_smi.find(".timedate").text(that.showHourAndMinute(msg.create_time));
                                html_smi.find(".data_studentname").text(msg.student_name).attr("data-studentid", msg.student_id);
                                //html_smi.find(".data_createtime").text(msg.create_time);
                                html_smi.find(".data_level").html(that.buildLevelImgHtml(msg.level));
                                try {
                                    var askItem = JSON.parse(msg.message_content);
                                    //普通题目提问
                                    if (askItem.AskType == 1) {
                                        var questionAsk = JSON.parse(askItem.AskContentJson);

                                        let msgitem_detail = $("#hide_template .all_msgitem_detail").clone();
                                        msgitem_detail.find(".msgitem_detail_title").text("题目题干");
                                        msgitem_detail.find(".msgitem_detail_content").html(msg.question_itemname);
                                        html_smi.find(".allcontent").append(msgitem_detail);

                                        //挖空&渲染...
                                       // MathJaxRender(msgitem_detail.find(".msgitem_detail_content")[0], msgitem_detail);

                                    }
                                        //题型题目提问
                                    else if (askItem.AskType == 2) {

                                        var typeQuestionAsk = JSON.parse(askItem.AskContentJson);

                                        let msgitem_detail = $("#hide_template .all_msgitem_detail").clone();
                                        msgitem_detail.find(".msgitem_detail_title").text("问题描述");
                                        msgitem_detail.find(".msgitem_detail_content").html(msg.question_itemname);
                                        html_smi.find(".allcontent").append(msgitem_detail);

                                        if (typeQuestionAsk.Difficulty > 0) {
                                            html_smi.find(".questiontype_difficulty").show();
                                            html_smi.find(".questiontype_difficulty .questiontype_difficulty_stars").html(that.buildLevelImgHtml(typeQuestionAsk.Difficulty));
                                        }
                                        //挖空&渲染...
                                        //MathJaxRender(msgitem_detail.find(".msgitem_detail_content")[0], msgitem_detail);

                                    }
                                        //视频提问
                                    else if (askItem.AskType == 3) {

                                        var videoAsk = JSON.parse(askItem.AskContentJson);
                                        if (videoAsk.VideoUrl != "") {

                                            let msgitem_detail = $("#hide_template .all_msgitem_detail").clone();
                                            msgitem_detail.find(".msgitem_detail_title").text("问题描述");
                                            msgitem_detail.find(".msgitem_detail_content").html(videoAsk.Remark.replace("㊣", "；"));
                                            html_smi.find(".allcontent").append(msgitem_detail);

                                            //msgitem_detail = $("#hide_template .all_msgitem_detail").clone();
                                            //msgitem_detail.find(".msgitem_detail_title").text("视频名称");
                                            //msgitem_detail.find(".msgitem_detail_content").html(videoAsk.VideoName);
                                            //html_smi.find(".allcontent").append(msgitem_detail);

                                            if (videoAsk.VideoTimePoint > 0) {
                                                html_smi.find(".videotimepoint").show();
                                                let m = 0, s = 0;
                                                if (videoAsk.VideoTimePoint < 60) {
                                                    s = videoAsk.VideoTimePoint;
                                                }
                                                else {
                                                    m = parseInt(videoAsk.VideoTimePoint / 60);
                                                    s = parseInt(videoAsk.VideoTimePoint % 60)
                                                }
                                                html_smi.find(".videotimepoint .minute").text(m);
                                                html_smi.find(".videotimepoint .second").text(s);
                                            }


                                        }
                                    }

                                } catch (exception) {
                                    console.log("消息内容格式发生解析异常,原始json如下:" + msg.message_content);
                                }

                            }


                            //构造点击查看全部后的弹窗内容
                            let html_msgItem = $("#hide_template .template_window_question_item").clone(true);
                            html_msgItem.removeClass("template_window_question_item");
                            let headsrc = (msg.head == undefined || msg.head == "") ? "/Content/images/boy.png" : msg.head;

                            html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);
                            html_msgItem.find(".time_ms").text(classLogGo.showHourAndMinute(msg.create_time));
                            html_msgItem.find(".userimg img").attr("src", headsrc);
                            html_msgItem.find(".studentname").text(msg.student_name);
                            html_msgItem.find(".studentlevel").html(classLogGo.buildLevelImgHtml(msg.level));


                            //消息内容处理
                            try {
                                var askItem = JSON.parse(msg.message_content);
                                //普通题目提问
                                if (askItem.AskType == 1) {

                                    var questionAsk = JSON.parse(askItem.AskContentJson);

                                    let msgitem_detail = $("#hide_template .all_msgitem_detail").clone();
                                    msgitem_detail.find(".msgitem_detail_title").text("问题描述");
                                    msgitem_detail.find(".msgitem_detail_content").html(msg.question_itemname);
                                    html_msgItem.find(".cnttext").append(msgitem_detail);

                                    //挖空&渲染...
                                    //MathJaxRender(msgitem_detail.find(".msgitem_detail_content")[0], msgitem_detail);

                                }
                                else if (askItem.AskType == 2) {
                                    //题型题目提问
                                    var typeQuestionAsk = JSON.parse(askItem.AskContentJson);

                                    let msgitem_detail = $("#hide_template .all_msgitem_detail").clone();
                                    msgitem_detail.find(".msgitem_detail_title").text("问题描述");
                                    msgitem_detail.find(".msgitem_detail_content").html(msg.question_itemname);
                                    html_msgItem.find(".cnttext").append(msgitem_detail);

                                    //挖空&渲染...
                                    //MathJaxRender(msgitem_detail.find(".msgitem_detail_content")[0], msgitem_detail);

                                }
                                else if (askItem.AskType == 3) {
                                    //视频提问
                                    var videoAsk = JSON.parse(askItem.AskContentJson);
                                    if (videoAsk.VideoUrl != "") {

                                        let msgitem_detail = $("#hide_template .all_msgitem_detail").clone();
                                        msgitem_detail.find(".msgitem_detail_title").text("问题描述");
                                        msgitem_detail.find(".msgitem_detail_content").html(videoAsk.Remark.replace("㊣", "；"));
                                        html_msgItem.find(".cnttext").append(msgitem_detail);

                                        msgitem_detail = $("#hide_template .all_msgitem_detail").clone();
                                        msgitem_detail.find(".msgitem_detail_title").text("视频名称");
                                        msgitem_detail.find(".msgitem_detail_content").html(videoAsk.VideoName);
                                        html_msgItem.find(".cnttext").append(msgitem_detail);

                                    }
                                }
                            } catch (exception) {
                                html_msgItem.find(".msg_content").text("消息内容格式发生解析异常,原始json如下:" + msg.message_content);
                            }

                            html_msgItem.attr("status", "finish");

                            if (msg.state == 1) {
                                //未处理
                                html_msgItem.attr("status", "wait");
                            }
                            else if (msg.state == 2 || msg.state == 3 || msg.state == 4) {
                                html_msgItem.addClass("listdef");
                            }

                            html_smi.find(".studentslist div.ljlshowbox").prepend(html_msgItem);


                        });

                    }

                    if (item.count > 0) {
                        html_smi.find(".studentslist .peoplenum").text(item.peoplecount);
                        html_smi.find(".studentslist .questionnum").text(item.count);
                    }

                    $(".content82 .askbox").append(html_smi);
               
                });

            }
            else {
                //暂无提问
                //if ($(".quanbutiwenlieibao").prev().length == 0) {
                //    $(".quanbutiwenlieibao").before("<div class=\"nodate\"></div>");
                //    $(".quanbutiwenlieibao").hide();
                //}

            }

            //预警
            if (msg_stuct.warning.info.size > 0) {

                $(".allwarning_container").html("");

                msg_stuct.warning.info.forEach(function (valueE, key) {
                    let item = valueE;
                    let html_smi = $("#hide_template .template_class_warning").clone(true).removeClass("template_class_warning");
                    let headsrc = (item.head == undefined || item.head == "") ? "/Content/images/boy.png" : item.head;
                    html_smi.find(".userimg img").attr("src", headsrc);
                    html_smi.find(".data_stuname").text(item.name).attr("data-studentid", item.stuid);

                    html_smi.find(".data_new").hide(); //是否有新消息
                    html_smi.find(".data_level").append(that.buildLevelImgHtml(item.level));
                    html_smi.find(".warningmore").attr("data-classid", classid).attr("data-studentid", item.stuid).attr("data-key", key);

                    //在人的分类下, 再次根据课时和模块进行归类
                    let warninginfo = new Map();
                    if (typeof item.list != "undefined" && item.list.length > 0) {
                        $.each(item.list, function (i, msg) {
                            //显示最新的第一个消息到外层
                            if (i == 0) {
                                html_smi.find(".data_createtime").text(that.showHourAndMinute(msg.create_time));
                                html_smi.find(".lastestmsg").text(msg.message_content);
                            }

                            let current_lessonKey = "";
                            let current_itemname = "";
                            //智能学习或者智能提升下, 按课时分类
                            current_lessonKey = "module_" + msg.module_type;

                            if (msg.module_type == 1 || msg.module_type == 2 || msg.module_type == 3) {
                                current_itemname = " 第" + msg.lesson_index + "课 “" + msg.lesson_name + "”" + msg.module_name
                            }
                            else {
                                current_itemname = msg.module_name;
                            }

                            if (!warninginfo.has(current_lessonKey)) {
                                var item = {};
                                item.name = current_itemname;
                                item.list = [];
                                item.list.push(msg);
                                warninginfo.set(current_lessonKey, item);
                            }
                            else {
                                var item = warninginfo.get(current_lessonKey);
                                item.list.push(msg);
                                warninginfo.set(current_lessonKey, item);
                            }

                        });
                    }


                    if (warninginfo.size > 0) {
                        $(".warning_window_content").html("");
                        warninginfo.forEach(function (valueE, key) {
                            let item2 = valueE;
                            let html_category = $("#hide_template .template_situation_category").clone(true);
                            html_category.removeClass("template_situation_category");
                            html_category.find(".categoryname").text(item2.name).attr("data-key", key);
                            html_category.find(".singleword").text(classLogGo.getSimpleWord_BigModuleType(item2.module_type));
                            html_category.find(".cnt").removeClass("cnt").addClass("cont");

                            if (typeof item2.list != "undefined" && item2.list.length > 0) {

                                $.each(item2.list, function (i, msg) {

                                    let html_msgItem = $("#hide_template .template_situation_msgitem").clone(true);
                                    html_msgItem.toggleClass("template_situation_msgitem");
                                    html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);;
                                    html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));
                                    html_msgItem.find(".cnt").removeClass("cnt").addClass("cont");



                                    let t_tet = $("#hide_template .msgitem_detail").clone().removeClass("msgitem_detail");
                                    t_tet.find(".msgitem_detail_content").remove();
                                    t_tet.find(".msgitem_detail_title").html(msg.message_content);
                                    html_msgItem.find(".cnttext").append(t_tet);

                                    html_msgItem.addClass("list2");

                                    html_msgItem.attr("status", "finish");

                                    if (msg.state == 1) {
                                        //未处理
                                        html_msgItem.attr("status", "wait");
                                    }
                                    else if (msg.state == 2 || msg.state == 3 || msg.state == 4) {
                                       // html_msgItem.addClass("listdef");
                                    }

                                    html_category.find(".ljlcnt").append(html_msgItem);

                                });

                            }

                            html_smi.find(".studyinfobox").append(html_category);

                        });

                    }
                    html_smi.find(".data_stucount_wrapper").attr("studentid", item.stuid);
                    if (item.untreatcount > 0) {
                        html_smi.find(".data_stucount_wrapper").show().find(".data_stucount").text(item.untreatcount);
                    } else {
                        html_smi.find(".data_stucount_wrapper").hide();
                    }

                    $(".allwarning_container").append(html_smi);
                });


                //如果有预警内容则显示它, 一般是首次
                if ($(".quanbuyujingliebiao").prev().length > 0) {
                    $(".quanbuyujingliebiao").prev().remove();
                    $(".quanbuyujingliebiao").show();
                }
            }
            else {
                //暂无预警
                //if ($(".quanbuyujingliebiao").prev().length == 0) {
                //    $(".quanbuyujingliebiao").before("<div class=\"nodate1\"></div>");
                //    $(".quanbuyujingliebiao").hide();
                //}
            }
            MathJax.typeset();
            ShowInput3();

            $('.content82 .niceScrollbox').getNiceScroll().resize();
        }
    },


    //构建学生等级星星 或者 题目难度星级
    buildLevelImgHtml: function (level) {
        let html = "";
        for (let i = 1; i <= 5; i++) {
            if (i <= level) {
                html += "<img src=\"/Content/images/actstar.png\" />";
            }
            else {
                html += "<img src=\"/Content/images/actstar1.png\" />";
            }
        }
        return html;
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

    //提问查看全部,滑动窗口.
    //用于 班级的提问聚类 和 个人的提问聚类
    slideAboutQuestion: function (obj) {
        $('.content32').toggle();
        $('.question_window').toggleClass('content29_1');

        let key = $(obj).data("key");
        let classid = $(obj).data("classid");
        let msg_stuct = classAllMsg["class_" + classid];
        if (msg_stuct != undefined) {
            if (msg_stuct.question.info.has(key)) {
                let item = msg_stuct.question.info.get(key);
                //弹窗标题
                $(".question_window .ftitle span").text(item.name);
                if (key.indexOf("video") > -1) {
                    $(".question_window .ftitle span").addClass("hasimg");
                }
                $(".question_window .btn_neglect_all").attr("datakey", key);
                $(".question_window .btn_call_all").attr("datakey", key);

                $(".question_window .ljlshowbox").html("");
                $.each(item.list, function (i, msg) {
                    //构造点击查看全部后的弹窗内容
                    let html_msgItem = $("#hide_template .template_window_question_item").clone(true);

                    let headsrc = (msg.head == undefined || msg.head == "") ? "/Content/images/boy.png" : msg.head;

                    html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);
                    html_msgItem.find(".time_ms").text(classLogGo.showHourAndMinute(msg.create_time));
                    html_msgItem.find(".userimg img").attr("src", headsrc);
                    html_msgItem.find(".studentname").text(msg.student_name);
                    html_msgItem.find(".studentlevel").html(classLogGo.buildLevelImgHtml(msg.level));
                    html_msgItem.find(".msg_time").text(msg.create_time);
                    //html_msgItem.find(".msg_content").text(msg.message_content);

                    //消息内容处理
                    html_msgItem.find(".listbox .btns").html("");
                    try {
                        var askItem = JSON.parse(msg.message_content);
                        //普通题目提问
                        if (askItem.AskType == 1) {

                            var questionAsk = JSON.parse(askItem.AskContentJson);

                            let msgitem_detail = $("#hide_template .msgitem_detail").clone();
                            msgitem_detail.find(".msgitem_detail_title").text("问题描述");
                            msgitem_detail.find(".msgitem_detail_content").html(msg.question_itemname);
                            html_msgItem.find(".cnttext").append(msgitem_detail);

                            html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showquestion\" question_itemid=\"" + msg.question_itemid
                                + "\" useranswer=\"" + questionAsk.UserAnswer + "\" onclick=\"classLogGo.showQuestion(this)\" >问题详情</a>");

                            //挖空&渲染...
                            //MathJaxRender(msgitem_detail.find(".msgitem_detail_content")[0], msgitem_detail);

                        }
                        else if (askItem.AskType == 2) {
                            //题型题目提问
                            var typeQuestionAsk = JSON.parse(askItem.AskContentJson);

                            let msgitem_detail = $("#hide_template .msgitem_detail").clone();
                            msgitem_detail.find(".msgitem_detail_title").text("问题描述");
                            msgitem_detail.find(".msgitem_detail_content").html(msg.question_itemname);
                            html_msgItem.find(".cnttext").append(msgitem_detail);

                            html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showquestion\" question_itemid=\"" + msg.question_itemid
                                + "\" useranswer=\"" + typeQuestionAsk.UserAnswer + "\" onclick=\"classLogGo.showQuestion(this)\" >问题详情</a>");

                            //挖空&渲染...
                            //MathJaxRender(msgitem_detail.find(".msgitem_detail_content")[0], msgitem_detail);

                        }
                        else if (askItem.AskType == 3) {
                            //视频提问
                            var videoAsk = JSON.parse(askItem.AskContentJson);
                            if (videoAsk.VideoUrl != "") {

                                let msgitem_detail = $("#hide_template .msgitem_detail").clone();
                                msgitem_detail.find(".msgitem_detail_title").text("问题描述");
                                msgitem_detail.find(".msgitem_detail_content").html(videoAsk.Remark.replace("㊣", "；"));
                                html_msgItem.find(".cnttext").append(msgitem_detail);

                                msgitem_detail = $("#hide_template .msgitem_detail").clone();
                                msgitem_detail.find(".msgitem_detail_title").text("视频名称");
                                msgitem_detail.find(".msgitem_detail_content").html(videoAsk.VideoName);
                                html_msgItem.find(".cnttext").append(msgitem_detail);

                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showvideo\" VideoUrl=\"" + videoAsk.VideoUrl +
                                    "\" VideoTimePoint=\"" + videoAsk.VideoTimePoint +
                                    "\" Remark=\"" + videoAsk.Remark.replace("㊣", "；") + "\"  onclick=\"classLogGo.showVideo(this)\" >视频详情</a>");

                            }
                        }
                    } catch (exception) {
                        html_msgItem.find(".msg_content").text("消息内容格式发生解析异常,原始json如下:" + msg.message_content);
                    }

                    html_msgItem.attr("status", "finish");

                    if (msg.state == 1) {
                        //未处理
                        html_msgItem.attr("status", "wait");

                        html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_ignore\" onclick=\"classLogGo.handleSignal(this,1,2,-1,-1)\">忽 略</a>");
                        html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_call ljlactive\" onclick=\"classLogGo.handleSignal(this,1,1,-1,-1)\" class=\"ljlactive\">呼 叫</a>");
                    }
                    else if (msg.state == 2) {
                        //已处理
                        html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已呼叫</a>");
                    }
                    else if (msg.state == 3) {
                        //已忽略
                        html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已忽略</a>");
                        html_msgItem.addClass("listdef");
                    }
                    else if (msg.state == 4) {
                        //已忽略
                        html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">自动忽略</a>");
                        html_msgItem.addClass("listdef");
                    }
                    $(".question_window .ljlshowbox").append(html_msgItem);

                });
                MathJax.typeset();
                ShowInput3();
                $('.content29 .niceScrollbox').getNiceScroll().resize();
            }
        }
    },

}


//主要用于外面的消息区域的渲染. 
//输入框渲染为空白只读.
function MathJaxRender(content, wrapper) {
    //挖空&渲染...
    MathJax.typeset();
    ShowInput3();
    //MathJax.Hub.Queue(["Typeset", MathJax.Hub, content], function () {

    //    wrapper.find(".mrow").each(function () {
    //        if ((/^\[:[^:]+?:\]$/).test($(this).text()) && $(this).html().indexOf("input type") == -1) {
    //            var w = $(this).width();
    //            if (w == 0) {
    //                w = 60;
    //            }
    //            var input = "<input type='text' value=''  style='width:" + w + "px;border-bottom:1px solid #000000;text-align:center;background: transparent;' readonly />"
    //            $(this).html(input);
    //        }
    //    });

    //});
}
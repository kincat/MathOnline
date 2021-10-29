/*
autor: 孟凡博
email: mengfanbo-41@163.com
createdate: 2020年12月1日
updatedate: 2021年2月24日
description: 课中监控的页面构建和动态效果
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

var MonitorClass = {
    config_offlineDuration: 15,
    urlhost: "http:\/\/math.abhseducation.com\/",
    AsynUrls: {
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
        url_HandleAllMessage: "/api/message/handleall",
        url_getStudentTodayWrongQuestion: "/Task/GetStudentTodayWrongQuestion"

    },

    //页面整体加载初始化
    Init: function () {
        if (window.location.hostname.toLowerCase() != "school.ailianmath.com" && window.location.hostname.toLowerCase() != "mathschool.abhseducation.com") {
            MonitorClass.urlhost = "http://teststudy.ailianmath.com/";
        } else {
            MonitorClass.urlhost = "http://math.abhseducation.com/";
        }
        this.bindBeforeEventHandler();
        this.getAllClasses();
        this.monitorWin();
    },
    bindBeforeEventHandler: function () {
        var that = this;
        //班级点击
        $(".template_classitem").click(function () {
            $(this).removeClass('lihover');
            $(this).siblings().addClass('lihover');
            $(this).siblings().removeClass('ljlactive');
            $(this).addClass('ljlactive');

            var obj = {};
            obj.classid = $(this).find(".dataitem").data("classid");
            obj.courseid = $(this).find(".dataitem").data("courseid");
            obj.schoolid = $(this).find(".dataitem").data("schoolid");
            obj.week = $(this).find(".dataitem").attr("data-week");
            obj.start = $(this).find(".dataitem").attr("data-start");
            obj.end = $(this).find(".dataitem").attr("data-end");
            obj.delay = $(this).find(".dataitem").attr("data-delay");

            $("#hidden_schoolid").val(obj.schoolid);
            $("#current_courseid").val(obj.courseid);
            $("#current_week").val(obj.week);
            $("#current_start").val(obj.start);
            $("#current_end").val(obj.end);
            $("#current_delay").val(obj.delay);

            //默认触发所有在线学生的消息监控
            MonitorClass.getStudentsByClassId(obj);
            $("#current_classid").val(obj.classid);
            if ($(this).find(".flash").length > 0) {
                $(this).find(".flash").removeClass("flash animated infinite");
            }

        });

        //点击全部学生
        $('#hide_template .student_title').click(function () {
            $('.content19 li').addClass('lihover').removeClass('ljlactive');
            $(this).addClass('ljlactive').removeClass('tithover');
            $('.content40 .pagelist').eq(0).show().siblings('.pagelist').hide();
            $('.content8 .niceScrollbox').getNiceScroll().resize();
            $('.content8 .niceScrollbox').animate({
                scrollTop: 0
            }, 300);

            that.getAllStudentsDetails($(this));

            $("#current_all").val(1);
            $("#current_studentid").val(0);
            $("#current_moduletype").val(1);

        });
        //点击单个学生
        $('.template_student_item').click(function () {
            if ($('.content40 .pagelist').eq(1).is(':hidden')) {
                $('.content40 .pagelist').eq(1).show().siblings('.pagelist').hide();
                $('.content19 .tit').addClass('tithover').removeClass('ljlactive');
            }

            $('.content19 li').addClass('lihover').removeClass('ljlactive');
            $(this).addClass('ljlactive').removeClass('lihover');
            $('.content8 .niceScrollbox').getNiceScroll().resize();
            $('.content8 .niceScrollbox').animate({
                scrollTop: 0
            }, 300);


            //离线的 和 缺勤的学生不触发消息内容
            if ($(this).attr("accuracy") == "offline" || $(this).attr("accuracy") == "absent") {
                $("#current_all").val("");
                $("#current_studentid").val("");
                $("#current_moduletype").val("");


                $(".student_question_container").html("<div class=\"nodate\"></div>")
                $(".student_warning_container").html("<div class=\"nodate1\"></div>");
                $(".student_all_container").html("");
                $(".student_question_untreatcount").text(0);
                $(".student_warning_untreatcount").text(0);

            }
            else {
                that.getStudentDetails($(this));

                $("#current_all").val(2);
                $("#current_studentid").val($(this).find(".dataitem").data("studentid"));
                $("#current_moduletype").val(1);

            }
            //点击后去掉闪烁状态.
            if ($(this).find(".flash").length > 0) {
                $(this).find(".flash").removeClass("flash animated infinite");
            }
            //找他的所属班级是否有闪烁状态, 有的话, 也去掉.
            let classid = $(this).find("a.dataitem").data("classid");
            let classItem = $(".classcontainer a.dataitem[data-classid=" + classid + "]");
            if (classItem.find(".flash").length > 0) {
                classItem.find(".flash").removeClass("flash animated infinite");
            }

            if (classStudentsList_animate != null && source_studentlist_animate != null) {
                classStudentsList = classStudentsList_animate;
                source_studentlist = source_studentlist_animate
            }
            //判断是否显示今日错题
            if ($(".dangexuesheng .content23 .contbox .conttab a").eq(3).hasClass('ljlactive') > 0) {
                that.getStudentTodayWrongQuestion();
            }
            //构建学生基本信息
            that.buildStudentDetails($(this));

        });

        //提问滑动弹窗的关闭
        $('.question_window .closewindow span').click(function () {
            $('.question_window').toggleClass('content29_1');
            $('.content32').toggle();
        });
        $('.content32').click(function () {
            $('.content32').toggle();
            $('.content29').toggleClass('content29_1');
        });

        //预警滑动弹窗的关闭
        $('.content123').click(function () {
            $(".content123").toggle();
            $(".content129").toggleClass('content29_1');
        });
        $('.warning_window .closewindow span').click(function () {
            $('.warning_window').toggleClass('content29_1');
            $('.content123').toggle();
        });

        //警告查看全部
        $('.warningmore').click(function () {
            $('.content123').toggle();
            $('.warning_window').toggleClass('content29_1');

            let key = $(this).data("key");
            let classid = $(this).data("classid");
            let msg_stuct = classAllMsg["class_" + classid];
            let studentid = $(this).data("studentid");

            let parentBox = $(this).closest(".userinfobox");

            let student = MonitorClass.findStudent(classid, studentid);

            let headsrc = (student.Head == undefined || student.Head == "") ? "/Content/images/boy.png" : student.Head;
            $(".warning_window .studentname").text(student.StudentName);
            $(".warning_window .userpic img").attr("src", headsrc);
            $(".warning_window .userconfig .studentlevel").html(MonitorClass.buildLevelImgHtml(student.Level));
            if (parentBox.find(".data_stucount").text() > 0) {
                $(".warning_window .studentwarningcount_wrapper").show().find(".studentwarningcount").text(parentBox.find(".data_stucount").text());
            }
            else {
                $(".warning_window .studentwarningcount_wrapper").hide();
            }
            //$(".warning_window .studentwarningcount").text(parentBox.find(".data_stucount").text());

            if (student.OnlineDuration > 0) {
                $(".warning_window .head_student_duration").text(parseInt(student.OnlineDuration / 60)); //在线时长-分
                if (student.OnlineDuration < 60) {
                    $(".warning_window .head_student_duration_second").text(student.OnlineDuration); //在线时长-秒
                }
                else {
                    $(".warning_window .head_student_duration_second").text(parseInt(student.OnlineDuration % 60)); //在线时长-秒
                }

            }
            else {
                $(".warning_window .head_student_duration").text("0");
                $(".warning_window .head_student_duration_second").text("0");
            }
            $(".warning_window .head_student_answercount").text(student.AllAnswerCount); //已作答提数
            
            $(".warning_window .head_student_accuracy").text((typeof student.Accuracy == "undefined" ? 0 : student.Accuracy) + "%"); //正确率


            $(".warning_window .head_student_light").attr("src", MonitorClass.getStudentLight(student.Accuracy));


            let warninginfo = new Map();

            if (msg_stuct != undefined) {
                if (msg_stuct.warning.info.has(key)) {
                    let item = msg_stuct.warning.info.get(key);
                    $.each(item.list, function (i, msg) {
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
            }

            //var untreatedWarningCount = 0;
            if (warninginfo.size > 0) {
                $(".warning_window_content").html("");
                warninginfo.forEach(function (valueE, key) {
                    let item = valueE;
                    let html_category = $("#hide_template .template_situation_category").clone(true);
                    html_category.removeClass("template_situation_category");
                    html_category.find(".categoryname").text(item.name).attr("data-key", key).css("background", "transparent");
                    html_category.find(".singleword").text(MonitorClass.getSimpleWord_BigModuleType(item.module_type));
                    //$(".warning_window_content").append(html_category);

                    if (typeof item.list != "undefined" && item.list.length > 0) {

                        $.each(item.list, function (i, msg) {


                            let html_msgItem = $("#hide_template .template_situation_msgitem").clone(true);
                            html_msgItem.toggleClass("template_situation_msgitem");
                            html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);;
                            html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));


                            let t_tet = $("#hide_template .msgitem_detail").clone().removeClass("msgitem_detail");
                            t_tet.find(".msgitem_detail_content").remove();
                            t_tet.append("<div class=\"btns\"></div>")
                            t_tet.find(".fl").removeClass("fl");
                            t_tet.find(".msgitem_detail_title").html(msg.message_content);

                            html_msgItem.find(".cnttext").append(t_tet);


                            html_msgItem.addClass("list2").addClass("list3");

                            html_msgItem.attr("status", "finish");

                            if (msg.state == 1) {
                                //未处理
                                html_msgItem.attr("status", "wait");
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_ignore\" moduleId=\"1\"  subModuleId=\"12\" actionType=\"122\" datatype=\"1\" onclick=\"MonitorClass.handleSignal(this,2,2,-1,1)\">忽 略</a>");
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_warning ljlactive\" moduleId=\"1\"  subModuleId=\"12\" actionType=\"123\" datatype=\"1\" onclick=\"MonitorClass.handleSignal(this,2,4," + msg.warning_type + ",1)\" class=\"ljlactive\">提 醒</a>");
       
                            }
                            else if (msg.state == 2) {
                                //已处理
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已提醒</a>");
                            }
                            else if (msg.state == 3) {
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已忽略</a>");
                                html_msgItem.addClass("listdef");
                            }
                            else if (msg.state == 4) {
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">自动忽略</a>");
                                html_msgItem.addClass("listdef");
                            }

                            html_category.find(".ljlcnt").append(html_msgItem);
                            //html_itemWarpper.append(html_msgItem);
                        });
                        webLogReg(".btn_ignore");
                        webLogReg(".btn_warning");
                    }

                    $(".warning_window_content").append(html_category);

                });


                $('.content129 .niceScrollbox').getNiceScroll().resize();
            }
        });

        $('.content47 a').click(function () {
            var status = $(this).data("status");
            MonitorClass.filterStudentList(status);
            $("#student_current_filter_status").val(status);
            MonitorClass.showStudentFilterText(status);
        });
        //延迟下课
        $(".yanchixiake").click(function () {

            var yanchi_ele = $(this);

            layer.confirm('是否确认延迟下课30分钟？', {
                btn: ['取 消', '确 认']
            }, function (index) {
                //取消,关闭窗口
                layer.close(index);
            }, function (index) {
                $.ajax({
                    async: false,
                    type: "post",
                    datatype: "json",
                    url: MonitorClass.AsynUrls.url_Delay,
                    data: {
                        SchoolID: $("#hidden_schoolid").val(),
                        ClassID: $("#current_classid").val(),
                        StudentID: "",
                        corseid: $("#current_courseid").val(),
                        NewestMsgId: ""
                    },
                    success: function (info) {
                        if (info.code == 200) {
                            if (info.data.result == true) {
                                layer.msg('延迟30分钟下课成功', { icon: 1 });
                                //当前的班级的下课时间实时更改.
                                let source_endtime = $("#studentlist_container .student_title").data("end");
                                var d = new Date();
                                d.setHours(source_endtime.split(":")[0]);
                                d.setMinutes(source_endtime.split(":")[1]);

                                //console.log("延迟下课前:" + d.Format("hh:mm"));

                                d = new Date(d.valueOf() + (30 * 60 * 1000)); //延迟30分钟后的时间

                                //console.log("延迟下课后:" + d.Format("hh:mm"));


                                $("#studentlist_container .student_title").attr("data-end", d.Format("hh:mm"));
                                $("#current_end").val(d.Format("hh:mm"));

                                let classSchedult = $(".class_schedule").text();
                                let starttime_p = classSchedult.split("〜")[0];
                                $(".class_schedule").text(starttime_p + "〜" + d.Format("hh:mm"));

                                $(".classcontainer li.ljlactive").find(".dataitem").attr("data-end", d.Format("hh:mm"));
                                $(".classcontainer li.ljlactive").find(".classtime").text("上课时间：" + starttime_p + "-" + d.Format("hh:mm"));
                                $(".classcontainer li.ljlactive").find(".classtime").attr("data-start", starttime_p).attr("data-end", d.Format("hh:mm"));

                                yanchi_ele.hide();

                            }
                        }
                    }
                });

            });

        });

        //立即下课
        $(".xiake").click(function () {
            //当前班级立即下课.
            var xiake_ele = $(this);
            layer.confirm('是否确认立即下课？', {
                btn: ['取 消', '确 认']
            }, function (index) {
                layer.close(index);
                

            }, function (index) {
                $.ajax({
                    async: false,
                    type: "post",
                    datatype: "json",
                    url: MonitorClass.AsynUrls.url_DismissClass,
                    data: {
                        SchoolID: $("#hidden_schoolid").val(),
                        ClassID: $("#current_classid").val(),
                        StudentID: "",
                        corseid: $("#current_courseid").val(),
                        NewestMsgId: ""
                    },
                    success: function (info) {
                        if (info.code == 200) {
                            if (info.data.result == true) {
                                layer.msg('立即下课成功', { icon: 1 });
                            }
                        }
                    }
                });
            });
        });

        //提问滑动弹窗里的 - 全部忽略
        $(".btn_neglect_all").click(function () {
            MonitorClass.dealAllMsg($(this), 2);
        });

        ////提问滑动弹窗里的 - 全部呼叫
        $(".btn_call_all").click(function () {
            MonitorClass.dealAllMsg($(this), 1);
        });

    },

    //全体学生里, 提问滑动弹窗的全部消息处理
    dealAllMsg: function (obj, handletype) {
        //找出未处理的. 如果已经都处理过了,则忽略.
        var undealedList = obj.closest(".question_window ").find("div.list[status=wait]");
        if (undealedList.length > 0) {

            var handleFormList = [];
            var handleResult = "";
            if (handletype == 1) {
                handleResult = "呼叫";
            }
            else {
                handleResult = "忽略";
            }

            var datakey = obj.attr("datakey");
            let currentClassId = $("#current_classid").val();

            //构造批量提交参数
            $.each(undealedList, function (i, item) {
                //要提交的表单
                let handleForm = {
                    messageid: $(item).attr("data-messageid"),
                    corseid: $("#current_courseid").val(),
                    studentid: $(item).attr("data-studentid"),
                    messagetype: 1, //消息类型: 1 提问 2 预警 3其它	
                    handle_type: handletype, //消息处理类型, 1 呼叫 2. 忽略 3.表扬 4 提醒, 5 奖励金币 6 惩罚金币 7自动忽略
                    handle_result: handleResult,
                    warning_type: -1,
                }
                handleFormList.push(handleForm);

            });
            console.log("构造批量提交参数:");
            console.log(handleFormList);

            $.ajax({
                async: false,
                type: "post",
                datatype: "json",
                url: MonitorClass.AsynUrls.url_HandleAllMessage,
                data: { forms: handleFormList },
                success: function (info) {
                    if (info.code == 200) {
                        //批量处理表单.
                        console.log("开始批量处理弹窗样式");
                        $.each(undealedList, function (i, item) {
                            var $item = $(item);
                            if (handletype == 1) {
                                //已呼叫
                                $item.find("div.btns").append("<a href=\"#\" class=\"defa\">已呼叫</a>");
                            } else if (handletype == 2) {
                                //已忽略
                                $item.find("div.btns").append("<a href=\"#\" class=\"defa\">已忽略</a>");
                            }
                            $item.find(".btn_call").hide();
                            $item.find(".btn_ignore").hide();
                            $item.attr("status", "finish");

                            let studentid = $item.attr("data-studentid");
                            let messageid = $item.attr("data-messageid");
                            //班级
                            let source_class_stuct = classAllMsg["source_class_" + currentClassId];
                            if (source_class_stuct != undefined) {
                                for (let i = 0; i < source_class_stuct.length; i++) {
                                    if (source_class_stuct[i].message_id == messageid) {
                                        source_class_stuct[i].state = 2;
                                        if (handletype == 2) {
                                            source_class_stuct[i].state = 3;
                                        }
                                        break;
                                    }
                                }
                            }

                            //学生
                            let source_student_stuct = studentMessageList["source_student_" + currentClassId + "_" + studentid];
                            if (source_student_stuct != undefined) {
                                for (let i = 0; i < source_student_stuct.length; i++) {
                                    if (source_student_stuct[i].message_id == messageid) {
                                        source_student_stuct[i].state = 2;
                                        if (handletype == 2) {
                                            source_student_stuct[i].state = 3;
                                        }
                                        break;
                                    }
                                }
                            }

                            let class_stuct = classAllMsg["class_" + currentClassId];
                            let student_stuct = studentMessageList["student_" + currentClassId + "_" + studentid];
                            console.log("开始设置顶部标签里的消息数量");
                            //批量设置标签里的数量
                            if (class_stuct != undefined && student_stuct != undefined) {
                                class_stuct.question.untreatcount--;
                                student_stuct.question.untreatcount--;
                                //设置顶部标签里的消息数量
                                $(".question_all_untreatcount").text(class_stuct.question.untreatcount);
                                $(".student_question_untreatcount").text(student_stuct.question.untreatcount);
                            }

                        });



                        $(".questionmore[data-key='" + datakey + "']").closest("div.ljllist").find(".overview").hide();

                    }
                }
            });

        }
        else {
            layer.msg("没有要处理的的消息", { icon: 1 });
        }

    },

    //获取当前老师负责的所有班级
    getAllClasses: function () {
        var that = this;
        $.ajax({
            async: true,
            type: "get",
            url: MonitorClass.AsynUrls.url_getAllClasses,
            data: {},
            success: function (info) {
              
                if (info.code == 200 && info.data.result.length > 0) {
                    //console.log("1. 获取当前老师负责的所有班级")
                    //console.log(info.data.result);
                    //先清空班级列表
                    $(".classcontainer").html("");
                    for (var i = 0; i < info.data.result.length; i++) {
                        var cls = info.data.result[i];
                        //拿模板
                        var html = $("#hide_template .template_classitem").clone(true);
                        html.toggleClass("template_classitem");
                        //绑定数据
                        html.find(".dataitem").attr("data-classid", cls.ClassID)
                            .attr("data-courseid", cls.CourseID)
                            .attr("data-schoolid", cls.SchoolID)
                            .attr("data-week", cls.Week)
                            .attr("data-start", cls.StartTimeFormat)
                            .attr("data-end", cls.EndTimeFormat)
                            .attr("data-delay", cls.DelayMinute)
                            .append("<span class=\"corsename\" style=\"display:none\">" + cls.CourseName + "</span>");
                        //构造html内容
                        html.find(".label").text(cls.ClassName);
                        html.find(".questioncount").text(cls.QuestionWaitCount);
                        html.find(".waningcount").text(cls.WarningWaitCount);
                        html.find(".classtime").text("上课时间：" + cls.StartTimeFormat + "-" + cls.EndTimeFormat);
                        html.find(".classtime").attr("data-start", cls.StartTimeFormat).attr("data-end", cls.EndTimeFormat);



                        $(".classcontainer").append(html);
                    }

                    //重置滚动条高度
                    $('.content4 .niceScrollbox').getNiceScroll().resize();
                    //默认选中第一个,并加载第一个班级
                    $(".classcontainer li").eq(0).attr("class", "ljlactive").click();

                }
                else {
                    $(".classcontainer").html($("#hide_template .noneclass").clone());
                    $("#studentlist_container").html($("#hide_template .nonestudent").clone());
                    $(".content40").prepend("<div class=\"nodate2 noneinfo\"></div>");
                    $(".quanbuxuesheng").hide();
                }
            }
        });


    },
    //获取某个班级下的所有学生列表
    getStudentsByClassId: function (obj) {
        var mythis = this;
        $.ajax({
            async: true,
            type: "get",
            url: MonitorClass.AsynUrls.url_getStudentsByClassId.replace("{corseid}", obj.courseid),
            data: {},
            success: function (info) {
                if (info.code == 200) {

                    //console.log("2.获取班级下所有学生列表");
                    //console.log("source_studentlist[class_" + obj.classid + "]");
                    if (info.data.Students != null && info.data.Students.length > 0) {
                        source_studentlist["class_" + obj.classid] = info.data;
                        //console.log(source_studentlist);
                        $("#student_online_status").text(info.data.StudentOnlineNumber + "/" + info.data.StudentAllNumber);
                        obj.online_num = info.data.StudentOnlineNumber;
                        obj.all_num = info.data.StudentAllNumber;

                        mythis.doAllocStudent(obj, info.data.Students);

                        mythis.buildStudentListHtml(obj, classStudentsList["class_" + obj.classid]);

                        //默认加载全部学生的消息详情
                        $("#studentlist_container .student_title").click();

                        $('.content5 .niceScrollbox').getNiceScroll().resize();
                    }
                    else {
                        $("#studentlist_container").html("");
                    }
                }
            }
        });
    },
    getLevel: function (level) {
        var html = "";
        for (var i = 0; i < 5; i++) {
            if (i < level) {
                html = html + '<img src="/Content/images/actstar.png" />';
            } else {
                html = html + '<img src="/Content/images/actstar1.png" />';
            }
        }
        return html;
    },
    monitorWin:function(){       
        layui.use(['form'], function () {
            var form = layui.form;
            form.render();
        })     
        //奖励惩罚金币弹窗
        $('#getgold').off('click').on('click',function () {
            $("#goldCount").val('');
            layui.form.render('select');
            $('#goldtext').val('');
            $('.content28 .ftitlte').html('奖惩金币')
            var studentId = $('#current_studentid').val();
            $.ajax({
                url: '/Student/GetGoldCount',
                type: "post",
                dataType: "json",
                data: { studentId: studentId},
                success: function (data) {
                    if (data.code == 200) {
                        var count = data.data;
                        layer.open({
                            type: 1,
                            title: false,
                            //closeBtn: 0,
                            area: ['auto', '450px'],
                            content: $('.content28') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                        });
                        if (count >= 10) {
                            $('.content28 .ftitlte').html('奖惩金币<span style="color:#ff0000;font-size:14px">(今日奖励金币次数已达上限)</span>');
                            $('.content28 .ljlbtn a').addClass('unableBtn');
                        } else {
                            $('.content28 .ljlbtn a').removeClass('unableBtn');
                        }
                        
                    } else {
                        layer.msg(data.message);
                    }
                },
                error: function (errorMsg) {
                    layer.msg("Err:" + JSON.stringify(errorMsg));
                },
                complete: function (XMLHttpRequest, status) {

                }
            });
        });
        //奖励惩还是罚金币选择
        $('.content28 .goldcheckbox .fl').off('click').on("click",function () {
            //$(this).siblings('.fl').find('span').removeClass('yes');
            //$(this).find('span').addClass('yes');
            //if($(".content28 .checkbox span").eq(0).hasClass('yes')>0){
            //    $('#goldtext').attr("placeholder","请输入老师寄语");
            //}else{
            //    $('#goldtext').attr("placeholder","请输入老师寄语");
            //}
        });
        //是否给班级学生推送消息
        $('.content28 .msgcheckbox .fl').off('click').on("click", function () {
            if ($(this).find('span').hasClass('yes')) {
                $(this).find('span').removeClass('yes');
            } else {
                $(this).find('span').addClass('yes');
            }
            //$(this).find('span').addClass('yes');           
        });
       
    },
    //今日错题
    getStudentTodayWrongQuestion: function () {
        $.ajax({
            async: true,
            type: "get",
            url: MonitorClass.AsynUrls.url_getStudentTodayWrongQuestion,
            data: { studentId: $("#current_studentid").val(),classId:$("#current_classid").val() },
            success: function (info) {
                $(".today_wrong_question .content65").remove();
                $(".today_wrong_question .errorbookitems").empty();
                if (info.pageCount > 0) {
                   
                    $(".today_wrong_question").append($("#wrongTemp .content90")[0]);
                    $(info.data).each(function (index, element) {
                        var wrongTemp = $("#wrongQuestionTemp")[0];
                        var temp = wrongTemp.cloneNode(true);
                        $(temp).removeAttr("id");
                        $(temp).show();
                        $(temp).find(".objdifficulty").find('img').remove();
                        $(temp).find(".difficultytext").after(MonitorClass.getLevel(element.level));
                        $(temp).find(".all").text("共答" + element.answerCount + "次,");
                        $(temp).find(".righttimes").text("对" + element.rightCount + "次,");
                        $(temp).find(".wrongtimes").text("错" + element.wrongCount + "次");
                        $(temp).find(".subjecttitle").attr("index", index + 1);
                        $(temp).find(".subjecttitle").attr("qTitle", element.qTitle);
                        $(temp).find(".subjecttitle").html("【" + (index + 1) + "】" + element.qTitle)
                        if (element.wrongSource != null && element.wrongSource!="")
                           $(temp).find(".wrongSource").text("来源："+element.wrongSource);
                        
                        $(temp).find(".subjectcont").empty();

                        if (element.qType == 1) {
                           // $(temp).find(".studentsanswer").html("学生答案：" + element.studentAnswer);
                            if (element.optionA != null && element.optionA != "")
                                $(temp).find(".subjectcont").append('<div class="optionitem"><label>A：</label><strong>' + element.optionA + '</strong></div>');
                            if (element.optionB != null && element.optionB != "")
                                $(temp).find(".subjectcont").append('<div class="optionitem"><label>B：</label><strong>' + element.optionB + '</strong></div>');
                            if (element.optionC != null && element.optionC != "")
                                $(temp).find(".subjectcont").append('<div class="optionitem"><label>C：</label><strong>' + element.optionC + '</strong></div>');
                            if (element.optionD != null && element.optionD != "")
                                $(temp).find(".subjectcont").append('<div class="optionitem"><label>D：</label><strong>' + element.optionD + '</strong></div>');
                            if (element.optionE != null && element.optionE != "")
                                $(temp).find(".subjectcont").append('<div class="optionitem"><label>E：</label><strong>' + element.optionE + '</strong></div>');
                            $(temp).find(".subjectcont").append('<div class="optionitem studentsanswer">学生答案：' + (element.studentAnswer == null || element.studentAnswer == "" ? "未作答" : element.studentAnswer) + '</div>');
                        } else {
                            //$(temp).find(".subjectcont").remove();
                            $(temp).find(".studentsanswer").attr("useranswer", element.studentAnswer);
                            $(temp).find(".studentsanswer").empty();
                        }
                        $(temp).find(".subjectanalysistext").html(element.answerExplain);
                        $(".today_wrong_question .content90 .errorbookitems").append($(temp)[0]);
                    })
                   
                    //挖空&渲染...
                    MathJax.typeset();
                    ShowInput3();
                        $('.content90 .showorhide').click(function () {
                            $(this).find('span').toggleClass('degspan');
                            $(this).parents('.erroritem').find('.toggleshow').slideToggle(function () {
                                $('.content8 .niceScrollbox').getNiceScroll().resize();
                            });
                           
                        })
                        $($(".today_wrong_question .spanflagAnswers")).each(function(){
                        //正确答案
                        var alist = $(this).text().split(",");
                            var index = 1;
                            alist.forEach(function (item) {
                                findInput($(".today_wrong_question"), item, index);
                                index++;
                            });
                            
                            var answer = $(this).parents('.erroritem').find('.studentsanswer').attr("useranswer");
                            if (answer == null || answer == undefined)
                                answer = "";
                                //用户答案
                            var tempList = answer.split("㊣");
                            var ins = 0;
                            // 初始化
                            $(this).parents('.erroritem').find(".quizPutTag").each(function () {
                                 // 当前输入
                                 var control = $a(this);
                                 control.setValue(tempList[ins]);
                                 // 填空对错
                                 control.showRight();
                                 ins++;
                             });
                             
                             
                        })
                        clickShowAnswer3($(".today_wrong_question"))
                        $('.content8 .niceScrollbox').getNiceScroll().resize();
                   
                 
                }
            }
        });
    },

    //获取该班级下所有学生的全部消息
    getAllStudentsDetails: function (ele) {

        var that = this;

        var classid = ele.data("classid");


        if (classAllMsg["class_" + classid] != undefined) {
            //TODO: 只获取最新的部分消息
            that.buildClassMessageHtml(classid);
            return;
        }

        $.ajax({
            async: true,
            type: "post",
            datatype: "json",
            url: MonitorClass.AsynUrls.url_getAllStudentsDetails,
            data: {
                SchoolID: ele.data("schoolid"),
                ClassID: classid,
                StudentID: 0,
                corseid: $("#current_courseid").val()
            },
            success: function (info) {
                if (info.code == 200) {

                    //加载头部
                    that.buildClassTitle();

                    //加载消息区域
                    if (info.data.result != null && info.data.result.length > 0) {
                        classAllMsg["source_class_" + classid] = info.data.result;
                        that.doAllocAllMessage(classid, info.data.result)
                        that.buildClassMessageHtml(classid);
                    }
                    else {
                        $(".allquestion_container").html("");
                        $(".allwarning_container").html("");
                        $(".question_all_untreatcount").text(0);
                        $(".warning_all_untreatcount").text(0);

                        //暂无提问
                        if ($(".quanbutiwenlieibao").prev().length == 0) {
                            $(".quanbutiwenlieibao").before("<div class=\"nodate\"></div>");
                            $(".quanbutiwenlieibao").hide();
                        }

                        //暂无预警
                        if ($(".quanbuyujingliebiao").prev().length == 0) {
                            $(".quanbuyujingliebiao").before("<div class=\"nodate1\"></div>");
                            $(".quanbuyujingliebiao").hide();
                        }


                    }

                }
            }
        });

    },
    //全部学生的头部加载
    buildClassTitle: function () {
        //加载头部
        var classname = $(".classcontainer li.ljlactive").find(".label ").text();
        var corsename = $(".classcontainer li.ljlactive").find(".corsename ").text();
        $(".classname").text(classname + "（" + corsename + "）");

        var ele = $("#studentlist_container .student_title");

        $(".userinfo_classid").text("ID：" + ele.data("classid"));
        $(".class_schedule").text(ele.data("start") + "〜" + ele.data("end"));
        let onlinenum = ele.data("onlinenum");
        let allnum = ele.data("allnum");
        $(".class_onlinenum").text(onlinenum);
        let percent = Math.round(onlinenum / allnum * 100);
        $(".class_chuqinlv").text(percent);

        timerTask.flushClassDelay();

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
                    current_itemname = "“" + MonitorClass.getSimpleModuleType(msg.module_name, msg.lesson_module_typename) + "” 题目提问";
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

                    //先处理超过15分钟未进行操作的预警数据
                    if (MonitorClass.autoIgnoreWarningMsg(msg)) {
                        isHaveExpireMsg = true;
                    }

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
            //console.log("3.构造班级所有消息:classAllMsg[\"class_" + classid + "\"]");
            //console.log(msg_stuct);

        }

        return isHaveExpireMsg;
    },

    //------------------HTML-----------------全部学生-消息区域
    buildClassMessageHtml: function (classid) {
        if (classAllMsg["class_" + classid] != undefined) {

            var that = this;

            let msg_stuct = classAllMsg["class_" + classid];
            $(".allquestion_container").html("");
            $(".allwarning_container").html("");
            //全部学生提问未处理数量
            $(".question_all_untreatcount").text(msg_stuct.question.untreatcount);
            //全部学生预警未处理数量
            $(".warning_all_untreatcount").text(msg_stuct.warning.untreatcount);


            //提问
            if (msg_stuct.question.info.size > 0) {
                if ($(".noneinfo").length > 0) {
                    $(".noneinfo").remove();
                }

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
                            let headsrc = (msg.head == undefined || msg.head == "") ? "/Content/images/boy.png" : msg.head;

                            //只显示前8条消息
                            if (i < 8) {
                                let html_msgItem = $("#hide_template .template_class_message_stuitem").clone(true);
                                html_msgItem.toggleClass("template_class_message_stuitem");
                                //第一个消息元素,显示详细的内容.
                                if (i == 0) {
                                    html_smi.find(".timedate").text(that.showHourAndMinute(msg.create_time));
                                    html_smi.find(".data_studentname").text(msg.student_name).attr("data-studentid", msg.student_id);
                                    html_smi.find(".data_createtime").text(msg.create_time);
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

                                //其它的只显示头像即可
                                html_msgItem.find(".imgbox img").attr("src", headsrc);
                                html_msgItem.find(".username").text(msg.student_name);
                                html_msgItem.find(".userxx").html(that.buildLevelImgHtml(msg.level));

                                html_smi.find(".studentslist").prepend(html_msgItem);
                            }

                        });

                       
                    }

                    if (item.untreatcount > 0) {
                        html_smi.find(".ftitlte .peoplenum").text(item.peoplecount);
                        html_smi.find(".ftitlte .questionnum").text(item.untreatcount);
                    }
                    else {
                        html_smi.find(".overview").hide();
                    }

                    $(".allquestion_container").append(html_smi);

                });

                //如果有提问内容则显示它, 一般是首次
                if ($(".quanbutiwenlieibao").prev().length > 0) {
                    $(".quanbutiwenlieibao").prev().remove();
                    $(".quanbutiwenlieibao").show();
                }
            }
            else {
                //暂无提问
                if ($(".quanbutiwenlieibao").prev().length == 0) {
                    $(".quanbutiwenlieibao").before("<div class=\"nodate\"></div>");
                    $(".quanbutiwenlieibao").hide();
                }

            }

            //预警
            if (msg_stuct.warning.info.size > 0) {
                if ($(".noneinfo").length > 0) {
                    $(".noneinfo").remove();
                }
                msg_stuct.warning.info.forEach(function (valueE, key) {
                    let item = valueE;
                    let html_smi = $("#hide_template .template_class_warning").clone(true).removeClass("template_class_warning");
                    let headsrc = (item.head == undefined || item.head == "") ? "/Content/images/boy.png" : item.head;
                    html_smi.find(".userimg img").attr("src", headsrc);
                    html_smi.find(".data_stuname").text(item.name).attr("data-studentid", item.stuid);

                    html_smi.find(".data_new").hide(); //是否有新消息
                    html_smi.find(".data_level").append(that.buildLevelImgHtml(item.level));
                    html_smi.find(".warningmore").attr("data-classid", classid).attr("data-studentid", item.stuid).attr("data-key", key);
                    if (typeof item.list != "undefined" && item.list.length > 0) {

                        $.each(item.list, function (i, msg) {
                            if (i == 0) {
                                html_smi.find(".data_createtime").text(that.showHourAndMinute(msg.create_time));
                                html_smi.find(".textinfo").text(msg.message_content);
                                $(".allwarning_container").append(html_smi);

                                return false; //只显示一次,跳出循环
                            }

                        });
                    }
                    html_smi.find(".data_stucount_wrapper").attr("studentid", item.stuid);
                    if (item.untreatcount > 0) {
                        html_smi.find(".data_stucount_wrapper").show().find(".data_stucount").text(item.untreatcount);
                    } else {
                        html_smi.find(".data_stucount_wrapper").hide();
                    }


                });

                //如果有预警内容则显示它, 一般是首次
                if ($(".quanbuyujingliebiao").prev().length > 0) {
                    $(".quanbuyujingliebiao").prev().remove();
                    $(".quanbuyujingliebiao").show();
                }
            }
            else {
                //暂无预警
                if ($(".quanbuyujingliebiao").prev().length == 0) {
                    $(".quanbuyujingliebiao").before("<div class=\"nodate1\"></div>");
                    $(".quanbuyujingliebiao").hide();
                }

            }
            MathJax.typeset();
            ShowInput3();

            $('.content8 .niceScrollbox').getNiceScroll().resize();
        }
    },

    //**************** 自动处理超过15分钟未处理的预警消息 ****************
    autoIgnoreWarningMsg: function (msg) {
        //忽略已经处理过的消息
        if (msg.state != 1) {
            return false;
        }
        //1. 判断消息是否已经超过15分钟
        let current_time = new Date();

        let date1 = msg.create_time.split(".")[0];
        let date2 = date1.replace("T", " ").replace(/-/g, '/');

        let msg_createtime = new Date(date2);
        //相差秒数
        var m = parseInt(Math.abs(current_time - msg_createtime) / 1000);

        //console.log("消息ID:" + msg.message_id + ", 当前时间:" + current_time.Format("yyyy-MM-dd hh:mm:ss") + ",消息创建时间:" + msg_createtime.Format("yyyy-MM-dd hh:mm:ss") + ",相差秒数:" + m);

        //如果大于15分钟未处理
        if (m > 15 * 60) {

            console.log("消息ID:" + msg.message_id + ", 当前时间:" + current_time.Format("yyyy-MM-dd hh:mm:ss") + ",消息创建时间:" + msg_createtime.Format("yyyy-MM-dd hh:mm:ss") + ",相差秒数:" + m);

            //要提交的表单
            let handleForm = {
                messageid: msg.message_id,
                corseid: msg.course_id,
                studentid: msg.student_id,
                messagetype: 2, //消息类型: 1 提问 2 预警 3其它	
                handle_type: 7, //消息处理类型, 1 呼叫 2. 忽略 3.表扬 4 提醒, 5 奖励金币 6惩罚金币 7 自动忽略
                handle_result: "超过15分钟自动忽略",
                warning_type: msg.warning_type,
            }
            $.ajax({
                async: false,
                type: "post",
                datatype: "json",
                url: MonitorClass.AsynUrls.url_HandleMessage,
                data: handleForm,
                success: function (info) {
                    if (info.code == 200) {
                        msg.state = 4;
                        msg.handle_result = "超过15分钟自动忽略";
                    }
                }
            });

            return true;
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

    //获取某个学生下的所有消息
    getStudentDetails: function (obj) {
        var that = this;

        let schoolid = obj.closest("#studentlist_container").find(".student_title").data("schoolid");
        let classid = obj.find(".dataitem").data("classid");
        let studentid = obj.find(".dataitem").data("studentid");

        // 如果已经初始化过了,就不在重新获取. 由后续的定时器来自动更新.
        // 另外可以只获取最新的部分消息,更新js对象.
        if (studentMessageList["student_" + classid + "_" + studentid] != undefined) {
            that.buildStudentMessageHtml(classid, studentid);
            return;
        }

        $.ajax({
            async: true,
            type: "post",
            datatype: "json",
            url: MonitorClass.AsynUrls.url_getStudentDetails,
            data: {
                SchoolID: schoolid,
                ClassID: classid,
                StudentID: studentid,
                corseid: $("#current_courseid").val()
            },
            success: function (info) {
                if (info.code == 200) {
                    // 加载头部. 当前选中的学生的总体详情
                    //加载消息区域
                    if (info.data.result != null && info.data.result.length > 0) {
                        let msgList = info.data.result;
                        studentMessageList["source_student_" + classid + "_" + studentid] = msgList;

                        that.doAllocMessage_student(classid, studentid, msgList);

                        //console.log("--获取某个学生下的所有消息 studentMessageList[student_" + studentid + "]")
                        //console.log(studentMessageList["student_" + studentid]);

                        that.buildStudentMessageHtml(classid, studentid);
                    }
                    else {
                        $(".student_question_container").html("<div class=\"nodate\"></div>")
                        $(".student_warning_container").html("<div class=\"nodate1\"></div>");
                        $(".student_all_container").html("");
                        $(".student_question_untreatcount").text(0);
                        $(".student_warning_untreatcount").text(0);
                    }
                }
            }
        });



    },

    //=============== 单个学生消息结构体 ===============
    doAllocMessage_student: function (classid, studentid, msgList) {

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

                    //先处理超过15分钟未进行操作的预警数据
                    //先处理超过15分钟未进行操作的预警数据
                    if (MonitorClass.autoIgnoreWarningMsg(msg)) {
                        isHaveExpireMsg = true;
                    }

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


            studentMessageList["student_" + classid + "_" + studentid] = msg_stuct;


        }

        return isHaveExpireMsg;

    },

    //------------------HTML-----------------单个学生-消息区域
    buildStudentMessageHtml: function (classid, studentid) {

        let msg_stuct = studentMessageList["student_" + classid + "_" + studentid];

        if (typeof msg_stuct != "undefined" && msg_stuct != null) {

            var that = this;
          
            $(".student_question_container").html("")
            $(".student_warning_container").html("");
            $(".student_all_container").html("");
            $(".student_question_untreatcount").text(msg_stuct.question.untreatcount);
            $(".student_warning_untreatcount").text(msg_stuct.warning.untreatcount);

            //提问-标签页
            if (msg_stuct.question.info.size > 0) {
                if ($(".noneinfo").length > 0) {
                    $(".noneinfo").remove();
                }
                msg_stuct.question.info.forEach(function (valueE, key) {
                    let item = valueE;
                    let html_smi = $("#hide_template .template_student_message_item").clone(true);
                    html_smi.toggleClass("template_student_message_item");
                    html_smi.attr("class", "");
                    html_smi.addClass("content26");
                    //分类标题
                    html_smi.find(".categoryname").text(item.name).attr("data-key", key);

                    //分类单字缩写
                    html_smi.find(".singleword").text(MonitorClass.getSimpleWord_BigModuleType(item.module_type));

                    if (typeof item.list != "undefined" && item.list.length > 0) {
                        $.each(item.list, function (i, msg) {
                            let html_msgItem = $("#hide_template .template_msgitem").clone(true);
                            html_msgItem.toggleClass("template_msgitem");
                            html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);

                            html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));
                            //html_msgItem.find(".msg_title").text(msg.message_title);
                            //html_msgItem.find(".msg_time").text(msg.create_time);

                            //消息内容处理
                            html_msgItem.find(".listbox .btns").html("");
                            try {
                                var askItem = JSON.parse(msg.message_content);

                                var current_lessonKey = "";

                                //普通题目提问
                                if (askItem.AskType == 1) {
                                    var questionAsk = JSON.parse(askItem.AskContentJson);

                                    let msgitem_detail = $("#hide_template .msgitem_detail").clone().removeClass("msgitem_detail");

                                    //标题部分
                                    msgitem_detail.find(".msgitem_detail_title").remove();
                                    msgitem_detail.find(".msgitem_detail_content").removeClass("info").addClass("info1")
                                        .html("<span>“" + MonitorClass.getSimpleModuleType(msg.module_name, msg.lesson_module_typename) + "” 题目提问</span>");
                                    html_msgItem.find(".cnttext").append(msgitem_detail);

                                    //问题描述
                                    msgitem_detail = $("#hide_template .msgitem_detail").clone().removeClass("msgitem_detail");
                                    msgitem_detail.find(".msgitem_detail_title").text("题目题干：");
                                    msgitem_detail.find(".msgitem_detail_content").html(msg.question_itemname+"123456");
                                    html_msgItem.find(".cnttext").append(msgitem_detail);

                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showquestion\" question_itemid=\"" + msg.question_itemid
                                        + "\" useranswer=\"" + questionAsk.UserAnswer + "\" moduleId=\"1\"  subModuleId=\"21\" actionType=\"211\" datatype=\"0\" onclick=\"MonitorClass.showQuestion(this)\" >问题详情</a>");

                                    //挖空&渲染...
                                    //MathJaxRender(msgitem_detail.find(".msgitem_detail_content")[0], msgitem_detail);


                                }
                                    //题型题目提问
                                else if (askItem.AskType == 2) {

                                    var typeQuestionAsk = JSON.parse(askItem.AskContentJson);

                                    let msgitem_detail = $("#hide_template .msgitem_detail").clone().removeClass("msgitem_detail");


                                    //标题部分
                                    msgitem_detail.find(".msgitem_detail_title").remove();
                                    msgitem_detail.find(".msgitem_detail_content").removeClass("info").addClass("info1")
                                        .html("<span>“" + msg.question_typename + "” 题型提问</span>");
                                    html_msgItem.find(".cnttext").append(msgitem_detail);

                                    //题型名称 暂无

                                    //题干部分
                                    msgitem_detail = $("#hide_template .msgitem_detail").clone().removeClass("msgitem_detail");
                                    msgitem_detail.find(".msgitem_detail_title").text("问题描述：");
                                    msgitem_detail.find(".msgitem_detail_content").html(msg.question_itemname);
                                    html_msgItem.find(".cnttext").append(msgitem_detail);

                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showquestion\" question_itemid=\"" + msg.question_itemid
                                        + "\" useranswer=\"" + typeQuestionAsk.UserAnswer + "\"  moduleId=\"1\"  subModuleId=\"21\" actionType=\"211\" datatype=\"0\"  onclick=\"MonitorClass.showQuestion(this)\" >问题详情</a>");

                                    //挖空&渲染...
                                    //MathJaxRender(msgitem_detail.find(".msgitem_detail_content")[0], msgitem_detail);

                                }
                                    //视频提问
                                else if (askItem.AskType == 3) {
                                    var videoAsk = JSON.parse(askItem.AskContentJson);
                                    if (videoAsk.VideoUrl != "") {

                                        let msgitem_detail = $("#hide_template .msgitem_detail").clone().removeClass("msgitem_detail");

                                        //标题部分
                                        msgitem_detail.find(".msgitem_detail_title").remove();
                                        msgitem_detail.find(".msgitem_detail_content").removeClass("info").addClass("info1").html("<span>“" + videoAsk.VideoName + "” 视频提问</span>");
                                        html_msgItem.find(".cnttext").append(msgitem_detail);

                                        //提问时间
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

                                            msgitem_detail = $("#hide_template .msgitem_detail").clone().removeClass("msgitem_detail");
                                            msgitem_detail.find(".msgitem_detail_title").text("提问时间：");
                                            msgitem_detail.find(".msgitem_detail_content").html(m + "分" + s + "秒");
                                            html_msgItem.find(".cnttext").append(msgitem_detail);
                                        }


                                        msgitem_detail = $("#hide_template .msgitem_detail").clone().removeClass("msgitem_detail");
                                        msgitem_detail.find(".msgitem_detail_title").text("问题描述：");
                                        msgitem_detail.find(".msgitem_detail_content").html(videoAsk.Remark.replace("㊣", "；"));
                                        html_msgItem.find(".cnttext").append(msgitem_detail);



                                        html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showvideo\" VideoUrl=\"" + videoAsk.VideoUrl +
                                            "\" VideoTimePoint=\"" + videoAsk.VideoTimePoint +
                                            "\" Remark=\"" + videoAsk.Remark.replace("㊣", "；") + "\"   moduleId=\"1\"  subModuleId=\"21\" actionType=\"211\" datatype=\"0\"   onclick=\"MonitorClass.showVideo(this)\" >视频详情</a>");

                                    }
                                }


                                //题型的聚合
                                if (msg.question_typecode != "" && msg.question_typecode != null) {
                                    current_lessonKey = "typecode_" + msg.question_typecode;
                                }
                                else if (msg.lesson_module_type == 14 || msg.lesson_module_type == 22) {
                                    current_lessonKey = "video_" + msg.lesson_itemid;
                                }

                                // 思路: 去找班级全部消息的聚合分组, 根据Key去找. 找到了并且还有未处理的则进行显示.
                                // 点击查看后,班级的提问聚合的查看全部是同一个弹窗内容.
                                // 为啥不在学生机构哪就把组分好呢? 因为消息是一条一条的显示的, 即使是同一个视频的不同提问对于单个人来说也要都显示出来.

                                if (classAllMsg["class_" + msg.class_id] != undefined) {
                                    let class_stuct_tmp = classAllMsg["class_" + msg.class_id];
                                    if (class_stuct_tmp.question.info.size > 0) {

                                        if (class_stuct_tmp.question.info.has(current_lessonKey)) {
                                            var questionAggItem = class_stuct_tmp.question.info.get(current_lessonKey);
                                            //必须大于1, 不包含自己在内
                                            if (questionAggItem.peoplecount > 1) {
                                                html_msgItem.find(".listbox .btns").prepend("<a class=\"fl checkquestion\"  onclick=\"MonitorClass.slideAboutQuestion(this)\" data-key=\"" + current_lessonKey + "\" data-classid=\"" + msg.class_id + "\"  href=\"#\">查看</a>")
                                                html_msgItem.find(".listbox .btns").prepend("<span class=\"fl\">还有" + (questionAggItem.peoplecount - 1) + "位同学有相同问题未处理</span>");

                                            }
                                        }
                                    }
                                }

                                if (current_lessonKey.indexOf("video_") > -1) {
                                    html_msgItem.addClass("videoquestion");
                                }

                                html_msgItem.attr("status", "finish");
                            } catch (exception) {
                                html_msgItem.find(".msg_content").text("消息内容格式发生解析异常,原始json如下:" + msg.message_content);
                            }
                            if (msg.state == 1) {
                                //未处理
                                html_msgItem.attr("status", "wait");
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_ignore\" moduleId=\"1\"  subModuleId=\"21\" actionType=\"212\" datatype=\"0\"  onclick=\"MonitorClass.handleSignal(this,1,2,-1,3)\" >忽 略</a>");
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_call ljlactive\"  moduleId=\"1\"  subModuleId=\"21\" actionType=\"213\" datatype=\"0\"  onclick=\"MonitorClass.handleSignal(this,1,1,-1,3)\" class=\"ljlactive\">呼 叫</a>");
                            }
                            else if (msg.state == 2) {
                                //已处理
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已呼叫</a>");
                                //html_msgItem.find(".listbox .btns").append("<a href=\"#\" onclick=\"MonitorClass.handleSignal(this,1,1)\" class=\"ljlactive\">再次呼叫</a>");
                            }
                            else if (msg.state == 3) {
                                //已忽略
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已忽略</a>");
                                html_msgItem.addClass("listdef");
                            }
                            else if (msg.state == 4) {
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">自动忽略</a>");
                                html_msgItem.addClass("listdef");
                            }


                            html_smi.find(".ljlshowbox").append(html_msgItem);
                        });
                    }
                    
                    $(".student_question_container").append(html_smi);
                 
                    webLogReg(".btn_showvideo");
                    webLogReg(".btn_showquestion");
                    webLogReg(".btn_ignore");
                    webLogReg(".btn_call");
                });
                //MathJax.typeset();
                //ShowInput3();
            }
            else {
                $(".student_question_container").html("<div class=\"nodate\"></div>");
            }
            //预警-标签页
            if (msg_stuct.warning.info.size > 0) {

                if ($(".noneinfo").length > 0) {
                    $(".noneinfo").remove();
                }
                msg_stuct.warning.info.forEach(function (valueE, key) {
                    let item = valueE;
                    let html_smi = $("#hide_template .template_student_message_item").clone(true);
                    html_smi.toggleClass("template_student_message_item");
                    html_smi.attr("class", "");
                    html_smi.addClass("content24");
                    html_smi.find(".categoryname").text(item.name).attr("data-key", key);

                    //分类单字缩写
                    html_smi.find(".singleword").text(MonitorClass.getSimpleWord_BigModuleType(item.module_type));

                    if (typeof item.list != "undefined" && item.list.length > 0) {
                        $.each(item.list, function (i, msg) {
                            let html_msgItem = $("#hide_template .template_msgitem").clone(true);
                            html_msgItem.toggleClass("template_msgitem");
                            html_msgItem.attr("data-messageid", msg.message_id).attr("data-studentid", msg.student_id);;
                            html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));
                            html_msgItem.find(".cnttext").html(msg.message_content).addClass("fl");

                            html_msgItem.find(".listbox .btns").html("");
                            html_msgItem.attr("status", "finish");
                            if (msg.state == 1) {
                                //未处理
                                html_msgItem.attr("status", "wait");
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_ignore\"  moduleId=\"1\"  subModuleId=\"22\" actionType=\"221\" datatype=\"0\"  onclick=\"MonitorClass.handleSignal(this,2,2,-1,4)\" >忽 略</a>");
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_warning ljlactive\" moduleId=\"1\"  subModuleId=\"22\" actionType=\"222\" datatype=\"0\" onclick=\"MonitorClass.handleSignal(this,2,4," + msg.warning_type + ",4)\" class=\"ljlactive\">提 醒</a>");
                            }
                            else if (msg.state == 2) {
                                //已处理
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已提醒</a>");
                            }
                            else if (msg.state == 3) {
                                //已忽略
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已忽略</a>");
                                html_msgItem.addClass("listdef");
                            }
                            else if (msg.state == 4) {
                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">自动忽略</a>");
                                html_msgItem.addClass("listdef");
                            }

                            html_smi.find(".ljlshowbox").append(html_msgItem);
                        });
                    }

                    $(".student_warning_container").append(html_smi);
                    webLogReg(".btn_ignore");
                    webLogReg(".btn_warning");
                });

            }
            else {
                $(".student_warning_container").html("<div class=\"nodate1\"></div>");
            }
            //学情-标签页
            if (msg_stuct.all.size > 0) {
                if ($(".noneinfo").length > 0) {
                    $(".noneinfo").remove();
                }
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
                    html_category.find(".singleword").text(MonitorClass.getSimpleWord_BigModuleType(item.module_type));


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
                                html_msgItem.attr("data-messagetype", msg.message_type);
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
                                        msgitem_detail.find(".info").addClass("info1").html("<span>“" + MonitorClass.getSimpleModuleType(msg.module_name, msg.lesson_module_typename) + "” 题目提问</span>");
                                        html_msgItem.find(".cnttext").append(msgitem_detail);

                                        //题干部分
                                        let msgitem_detail2 = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                        msgitem_detail2.find(".info").append("<label>题目题干：</label>");
                                        msgitem_detail2.find(".info").addClass("msgitem_detail_content").append(msg.question_itemname);
                                        html_msgItem.find(".cnttext").append(msgitem_detail2);

                                        //占位
                                        msgitem_detail = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                        msgitem_detail.addClass("tetinfo").css({ "height": "35px", "line-height": "35px" }).find(".info").remove();
                                        html_msgItem.find(".cnttext").append(msgitem_detail);

                                        html_msgItem.find(".cnttext").after("<div class=\"btns\"></div>")
                                        html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showquestion\" question_itemid=\"" + msg.question_itemid
                                           + "\" useranswer=\"" + questionAsk.UserAnswer + "\" onclick=\"MonitorClass.showQuestion(this)\"  moduleId=\"1\"  subModuleId=\"23\" actionType=\"233\" datatype=\"0\">问题详情</a>");


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

                                        //占位
                                        msgitem_detail = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                        msgitem_detail.addClass("tetinfo").css({ "height": "35px", "line-height": "35px" }).find(".info").remove();
                                        html_msgItem.find(".cnttext").append(msgitem_detail);

                                        html_msgItem.find(".cnttext").after("<div class=\"btns\"></div>")
                                        html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showquestion\" question_itemid=\"" + msg.question_itemid
                                           + "\" useranswer=\"" + typeQuestionAsk.UserAnswer + "\"  moduleId=\"1\"  subModuleId=\"23\" actionType=\"233\" datatype=\"0\" onclick=\"MonitorClass.showQuestion(this)\" >问题详情</a>");

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

                                            //占位
                                            msgitem_detail = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                            msgitem_detail.addClass("tetinfo").css({ "height": "35px", "line-height": "35px" }).find(".info").remove();
                                            html_msgItem.find(".cnttext").append(msgitem_detail);

                                            //按钮区域
                                            html_msgItem.find(".cnttext").after("<div class=\"btns\"></div>")
                                            html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showvideo\" VideoUrl=\"" + videoAsk.VideoUrl +
                                                "\" VideoTimePoint=\"" + videoAsk.VideoTimePoint +
                                                "\" Remark=\"" + videoAsk.Remark.replace("㊣", "；") + "\"  moduleId=\"1\"  subModuleId=\"23\" actionType=\"233\" datatype=\"0\"  onclick=\"MonitorClass.showVideo(this)\" >视频详情</a>");

                                        }
                                    }


                                    //题型的聚合
                                    if (msg.question_typecode != "" && msg.question_typecode != null) {
                                        current_lessonKey = "typecode_" + msg.question_typecode;
                                    }
                                    else if (msg.lesson_module_type == 14 || msg.lesson_module_type == 22) {
                                        current_lessonKey = "video_" + msg.lesson_itemid;
                                    }


                                    if (classAllMsg["class_" + msg.class_id] != undefined) {
                                        let class_stuct_tmp = classAllMsg["class_" + msg.class_id];
                                        if (class_stuct_tmp.question.info.size > 0) {

                                            if (class_stuct_tmp.question.info.has(current_lessonKey)) {
                                                var questionAggItem = class_stuct_tmp.question.info.get(current_lessonKey);
                                                //必须大于1, 不包含自己在内
                                                if (questionAggItem.peoplecount > 1) {
                                                    html_msgItem.find(".listbox .tetinfo").prepend("<a class=\"mor\"  onclick=\"MonitorClass.slideAboutQuestion(this)\" data-key=\"" + current_lessonKey + "\" data-classid=\"" + msg.class_id + "\"  href=\"#\">查看</a>")
                                                    html_msgItem.find(".listbox .tetinfo").prepend("<label>还有" + (questionAggItem.peoplecount - 1) + "位同学有相同问题未处理</label>");

                                                }
                                            }
                                        }
                                    }

                                    if (current_lessonKey.indexOf("video_") > -1) {
                                        html_msgItem.addClass("videoquestion");
                                    }

                                    html_msgItem.attr("status", "finish");
                                } catch (exception) {
                                    console.log("消息内容格式发生解析异常,原始json如下:" + msg.message_content + ",异常信息:" + exception.message);
                                }


                                if (msg.state == 1) {
                                    //未处理
                                    html_msgItem.attr("status", "wait");
                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_ignore\"   moduleId=\"1\"  subModuleId=\"23\" actionType=\"234\" datatype=\"0\"  onclick=\"MonitorClass.handleSignal(this,1,2,-1,5)\" >忽 略</a>");
                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_call ljlactive\"   moduleId=\"1\"  subModuleId=\"23\" actionType=\"235\" datatype=\"0\"  onclick=\"MonitorClass.handleSignal(this,1,1,-1,5)\" class=\"ljlactive\">呼 叫</a>");
                                }
                                else if (msg.state == 2) {
                                    //已处理
                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已呼叫</a>");
                                    //html_msgItem.find(".listbox .btns").append("<a href=\"#\" onclick=\"MonitorClass.handleSignal(this,1,1)\" class=\"ljlactive\">再次呼叫</a>");
                                }
                                else if (msg.state == 3) {
                                    //已忽略
                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已忽略</a>");
                                    html_msgItem.addClass("listdef");
                                }
                                else if (msg.state == 4) {
                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">自动忽略</a>");
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
                                html_msgItem.attr("data-messagetype", msg.message_type);
                                html_msgItem.find(".time_ms").text(that.showHourAndMinute(msg.create_time));
                                html_msgItem.find(".lineinfo").addClass("dotcolor_red"); //红色小圆点
                                html_msgItem.find(".listbox").addClass("singlelinebox"); //预警都是单行的

                                let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                t_tet.find(".info").html(msg.message_content);
                                html_msgItem.find(".cnttext").append(t_tet);

                                html_msgItem.find(".cnttext").after("<div class=\"btns\"></div>")

                                html_msgItem.attr("status", "finish");
                                if (msg.state == 1) {
                                    //未处理
                                    html_msgItem.attr("status", "wait");
                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_ignore\"   moduleId=\"1\"  subModuleId=\"23\" actionType=\"231\" datatype=\"0\"  onclick=\"MonitorClass.handleSignal(this,2,2,-1,5)\" >忽 略</a>");
                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_warning ljlactive\"   moduleId=\"1\"  subModuleId=\"23\" actionType=\"232\" datatype=\"0\"  onclick=\"MonitorClass.handleSignal(this,2,4," + msg.warning_type + ",5)\" class=\"ljlactive\">提 醒</a>");
                                }
                                else if (msg.state == 2) {
                                    //已处理
                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已提醒</a>");
                                }
                                else if (msg.state == 3) {
                                    //已忽略
                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">已忽略</a>");
                                    html_msgItem.addClass("listdef");
                                }
                                else if (msg.state == 4) {
                                    html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">自动忽略</a>");
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
                                    html_msgItem.find(".singleword").text(MonitorClass.getSimpleWord_SmallModuleType(msg.lesson_module_type));
                                }
                                //第一行文本
                                if (msg.message_title != "" && msg.message_title != null) {
                                    let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                    t_tet.find(".info").html(msg.message_title);
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
                                        reportcontent = "<a href=\"" + MonitorClass.urlhost + msg.reporturl + "\" target=\"_blank\" class=\"mor report\"   moduleId=\"1\"  subModuleId=\"23\" actionType=\"236\" datatype=\"0\" >查看报告</a>";
                                    }

                                    if (msg.action_type == 2 && msg.action_type != "" && msg.action_type != null) {
                                        html_msgItem.find(".lineinfo").removeClass("dotcolor_grey").addClass("dotcolor_black"); //完成点,深灰点表示
                                    }


                                    let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                    t_tet.find(".info").html(msg.message_content + evaluate_content + reportcontent);
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
                                        t_tet.find(".info").html(msg.message_title);
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
                                            reportcontent = "<a href=\"" + MonitorClass.urlhost + msg.reporturl + "\" target=\"_blank\"  class=\"mor report\"   moduleId=\"1\"  subModuleId=\"23\" actionType=\"236\" datatype=\"0\">查看报告</a>";
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
                                        t_tet.find(".info").html(word + evaluate_content + "。 " + reportcontent);
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
                                        t_tet.find(".info").html(msg.message_title);
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
                                            reportcontent = "、<a href=\"" + MonitorClass.urlhost + msg.reporturl + "\" target=\"_blank\"  class=\"mor report\"   moduleId=\"1\"  subModuleId=\"23\" actionType=\"236\" datatype=\"0\">查看报告</a>";
                                        }

                                        let word = "视频长度" + time_mimute + "分" + time_second + "秒、有效学习" + time_mimute2 + "分" + time_second2 + "秒";

                                        if (specItem.AskCount != undefined && specItem.AskCount != null && specItem.AskCount > 0) {
                                            word += "、提问" + specItem.AskCount + "次";
                                        }

                                        let t_tet = $("#hide_template .msgitem_xueqing").clone().removeClass("msgitem_xueqing");
                                        t_tet.find(".info").html(word + evaluate_content + "。 " + reportcontent);
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
                                    t_tet.find(".info").html(msg.message_title);
                                    html_msgItem.find(".cnttext").append(t_tet);

                                    //如果有title则表明是双行的. 
                                    html_msgItem.find(".listbox").addClass("doublelinebox");
                                }

                              

                                html_category.find(".ljlcnt").append(html_msgItem);
                            }

                        });

                        $(".student_all_container").append(html_category);
                        webLogReg(".btn_ignore");
                        webLogReg(".btn_warning"); 
                        webLogReg(".btn_call");
                        webLogReg(".report");
                    }

                });

                //最后一条消息, 表示最新的一条数据,用蓝色的点
                $(".student_all_container").find(".ljlshowbox").eq(0).find(".ljlcnt .lineinfo").eq(0).removeClass("dotcolor_grey").addClass("dotcolor_blue").addClass("dotcolorbig_blur");

            }

           
            $('.student_all_container .ljlshowbox .list1 .cnttext').click(function () {
                $(this).find('.categoryname').toggleClass('degspan');
                $(this).parents('.ljlshowbox').find('.ljlcnt').slideToggle(function () {
                    $('.content8 .niceScrollbox').getNiceScroll().resize();
                });
            });

            $('.student_warning_container .list1 .cnttext').click(function () {
                $(this).find('.categoryname').toggleClass('degspan');
                $(this).parents('.ljlshowbox').find('.ljlcnt').slideToggle(function () {
                    $('.content8 .niceScrollbox').getNiceScroll().resize();
                });
            });
            $('.student_question_container .list1 .cnttext').click(function () {
                $(this).find('.categoryname').toggleClass('degspan');
                $(this).parents('.ljlshowbox').find('.ljlcnt').slideToggle(function () {
                    $('.content8 .niceScrollbox').getNiceScroll().resize();
                });
            });
            $('.content8 .niceScrollbox').getNiceScroll().resize();
            MathJax.typeset();
            //ShowInput3();
        }
        
    },

    //更新 - 单个学生消息
    doAllocNewMessage_student: function (classid, studentid, newMsgList) {
        var old_student_list = studentMessageList["source_student_" + classid + "_" + studentid];
        if (old_student_list != undefined && old_student_list != null && old_student_list.length > 0) {

            //将最新的消息插入到开头
            newMsgList.unshift(0, 0);
            Array.prototype.splice.apply(old_student_list, newMsgList);

        }
    },
    //更新 - 班级所有消息
    doAllocNewMessage_class: function (classid, newMsgList) {
        var old_class_list = classAllMsg["source_class_" + classid];
        if (old_class_list != undefined && old_class_list != null && old_class_list.length > 0) {
            //将最新的消息插入到开头
            newMsgList.unshift(0, 0);
            Array.prototype.splice.apply(old_class_list, newMsgList);
        }
    },

    //------------------HTML-----------------构建学生的基本信息
    buildStudentDetails: function (obj) {
        //console.log("构建学生的表头");
        var that = this;

        let schoolid = obj.closest("#studentlist_container").find(".student_title").data("schoolid");
        let classid = obj.find(".dataitem").data("classid");
        let studentid = obj.find(".dataitem").data("studentid");

        //let parentname = obj.closest("div.listbox").attr("category");
        //let parentkey = obj.closest("div.listbox").attr("key");

        let student_category = source_studentlist["class_" + classid] // classStudentsList["class_" + classid];
        if (student_category != undefined && student_category.Students.length > 0) {
            //在已有的结构中找到那个学生

            let student = null;

            for (let i = 0; i < student_category.Students.length; i++) {
                if (student_category.Students[i].StudentID == studentid) {
                    student = student_category.Students[i];
                    break;
                }
            }

            //console.log(student);

            let headsrc = (student.Head == undefined || student.Head == "") ? "/Content/images/boy.png" : student.Head;
            $(".head_student_attention").attr("studentid", student.StudentID);
            //重点关注
            if (student.IsAttention) {
                $(".head_student_attention").addClass("selimg");
                $(".head_student_attention .infotext").text("取消关注");
                $(".head_student_attention").attr("actionType", "262");
            }
            else {
                $(".head_student_attention").removeClass("selimg");
                $(".head_student_attention .infotext").text("重点关注");
                $(".head_student_attention").attr("actionType", "261");
            }
            $(".head_student_name").text(student.StudentName);
            $(".head_student_desc").text(student.Desc);
            $(".head_student_head").attr("src", headsrc);
            $(".head_student_level").html(that.buildLevelImgHtml(student.Level));
            if (student.OnlineDuration > 0) {
                $(".head_student_duration").text(parseInt(student.OnlineDuration / 60)); //在线时长-分
                if (student.OnlineDuration < 60) {
                    $(".head_student_duration_second").text(student.OnlineDuration); //在线时长-秒
                }
                else {
                    $(".head_student_duration_second").text(parseInt(student.OnlineDuration % 60)); //在线时长-秒
                }

            }
            else {
                $(".head_student_duration").text("0");
                $(".head_student_duration_second").text("0");
            }
            $(".head_student_answercount").text(student.AllAnswerCount); //已作答提数
            $(".head_student_accuracy").text(student.Accuracy + "%"); //正确率
            $(".head_student_light").attr("src", that.getStudentLight(student.Accuracy));



        }
    },

    updateStudentDetails: function (student) {
        let headsrc = (student.Head == undefined || student.Head == "") ? "/Content/images/boy.png" : student.Head;
        $(".head_student_attention").attr("studentid", student.StudentID);
        $(".head_student_name").text(student.StudentName);
        $(".head_student_desc").text(student.Desc);
        $(".head_student_head").attr("src", headsrc);
        $(".head_student_level").html(that.buildLevelImgHtml(student.Level));
        if (student.OnlineDuration > 0) {
            $(".head_student_duration").text(parseInt(student.OnlineDuration / 60)); //在线时长-分
            if (student.OnlineDuration < 60) {
                $(".head_student_duration_second").text(student.OnlineDuration); //在线时长-秒
            }
            else {
                $(".head_student_duration_second").text(parseInt(student.OnlineDuration % 60)); //在线时长-秒
            }

        }
        else {
            $(".head_student_duration").text("0");
            $(".head_student_duration_second").text("0");
        }
        $(".head_student_answercount").text(student.AllAnswerCount - student.NoAnswerCount); //已作答提数
        $(".head_student_accuracy").text(student.Accuracy + "%"); //正确率
        if (student.IsAttention) {
            $(".head_student_attention").addClass("selimg");
            $(".head_student_attention .infotext").text("取消关注");
        }
        $(".head_student_light").attr("src", that.getStudentLight(student.Accuracy));
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
            case 12:
                word = "考";
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
                //word = "测";
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

            case 121:
                word = "考";
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
    changeButton: function (obj, msgtype, handletype, windowtype, studentid) {
        var thisBtn = $(obj).find('.btns');
 
        //隐藏按钮,显示
        if (msgtype == 1) {
            if (handletype == 1) {
                if (thisBtn.text().indexOf('已呼叫') == -1) {
                    //已呼叫
                    thisBtn.append("<a href=\"#\" class=\"defa\">已呼叫</a>");
                }
            } else if (handletype == 2) {
                if (thisBtn.text().indexOf('已忽略')== -1) {
                    //已忽略
                    thisBtn.append("<a href=\"#\" class=\"defa\">已忽略</a>");
                }
            }
            thisBtn.find(".btn_call").hide();
            thisBtn.find(".btn_ignore").hide();
        }
        else if (msgtype == 2) {
            if (handletype == 4) {
                if (thisBtn.text().indexOf('已提醒')== -1) {
                    //提醒
                    thisBtn.append("<a href=\"#\" class=\"defa\">已提醒</a>");
                }
            }
            else if (handletype == 2) {
                if (thisBtn.text().indexOf('已忽略') == -1) {
                    //已忽略
                    thisBtn.append("<a href=\"#\" class=\"defa\">已忽略</a>");
                }
            }

            //如果是警告弹窗里的忽略处理
            if (windowtype == 1) {
                thisBtn.closest("div.list").addClass("listdef");
                var leftCount = thisBtn.closest("div.warning_window ").find(".studentwarningcount").text();
                leftCount = leftCount - 1;
                if (leftCount > 0) {
                    thisBtn.closest("div.warning_window ").find(".studentwarningcount").text(leftCount);
                    $(".allwarning_container .data_stucount_wrapper[studentid=" + studentid + "]").find(".data_stucount").text(leftCount);
                }
                else {
                    thisBtn.closest("div.warning_window ").find(".studentwarningcount_wrapper").hide();
                    $(".allwarning_container .data_stucount_wrapper[studentid=" + studentid + "]").hide();
                }
            }

            thisBtn.find(".btn_warning").hide();
            thisBtn.find(".btn_ignore").hide();
        }
    },
    //处理消息
    //obj: 当前触发事件的元素
    //msgtype: 消息类型: 1 提问 2 预警 3其它	
    //handletype: 消息处理类型, 1 呼叫 2. 忽略 3.表扬 4 提醒, 5 奖励金币 6 惩罚金币 7 自动忽略
    //warning_type: 8种预警类型.详情见后台代码
    //windowtype: -1不做任何处理. 1. 全部学生里的预警弹窗里的处理 2, 全部学生里的提问弹窗  3. 个人提问 4. 个人预警 5. 个人学情
    handleSignal: function (obj, msgtype, handletype, warning_type, windowtype) {
        let thisButton = $(obj);
        //先处理按钮状态, 再提交服务器
        //thisButton.hide();
        let btnParent = thisButton.closest("div.btns");
        let messageid = thisButton.closest("div.list").data("messageid");
        let studentid = thisButton.closest("div.list").data("studentid");
        let messagetype = thisButton.closest("div.list").data("messagetype");
        let currentClassId = $("#current_classid").val();
        //student_question_container 提问
        //student_warning_container 个人警告
        //contbox student_all_container 个人学情 
        //判断是否学情
        if ($(".student_all_container").is(":hidden")) {
            $.each($(".student_all_container .list"), function (i, e) {
                if ($(this).data("messageid") == messageid) {                   
                    MonitorClass.changeButton($(this)[0], msgtype, handletype, windowtype, studentid);
                }
            })
        } else {          
            if (messagetype == 1) { //提问
                $.each($(".student_question_container .list"), function (i, e) {
                    if ($(this).data("messageid") == messageid) {
                        MonitorClass.changeButton($(this)[0], msgtype, handletype, windowtype, studentid);
                    }
                })
            } else if (messagetype == 2) { //警告
                $.each($(".student_warning_container .list"), function (i, e) {
                    if ($(this).data("messageid") == messageid) {
                        MonitorClass.changeButton($(this)[0], msgtype, handletype, windowtype, studentid);
                    }
                })
            }
        }
         
        let handleMsgContent = "";
        MonitorClass.changeButton(thisButton.closest("div.list")[0], msgtype, handletype, windowtype, studentid);
        //要提交的表单
        let handleForm = {
            messageid: messageid,
            corseid: $("#current_courseid").val(),
            studentid: studentid,
            messagetype: msgtype, //消息类型: 1 提问 2 预警 3其它	
            handle_type: handletype, //消息处理类型, 1 呼叫 2. 忽略 3.表扬 4 提醒, 5 奖励金币 6惩罚金币 7自动忽略
            handle_result: "",
            warning_type: warning_type,
        }
        $.ajax({
            async: true,
            type: "post",
            datatype: "json",
            url: MonitorClass.AsynUrls.url_HandleMessage,
            data: handleForm,
            success: function (info) {
                if (info.code == 200) {
                    //console.log("消息处理成功:" + info.data.result);
                    //当前消息设置为已处理
                    thisButton.closest("div.list").attr("status", "finish");

                    //更新缓存中的数量.

                    //班级
                    let source_class_stuct = classAllMsg["source_class_" + currentClassId];
                    if (source_class_stuct != undefined) {
                        for (let i = 0; i < source_class_stuct.length; i++) {
                            if (source_class_stuct[i].message_id == messageid) {
                                source_class_stuct[i].state = 2;
                                if (handletype == 2) {
                                    source_class_stuct[i].state = 3;
                                }
                                break;
                            }
                        }
                    }

                    //学生
                    let source_student_stuct = studentMessageList["source_student_" + currentClassId + "_" + studentid];
                    if (source_student_stuct != undefined) {
                        for (let i = 0; i < source_student_stuct.length; i++) {
                            if (source_student_stuct[i].message_id == messageid) {
                                source_student_stuct[i].state = 2;
                                if (handletype == 2) {
                                    source_student_stuct[i].state = 3;
                                }
                                break;
                            }
                        }
                    }

                    //全部学生 滑动弹窗的预警数量处理.
                    if (windowtype == 1) {

                    }


                    let class_stuct = classAllMsg["class_" + currentClassId];
                    let student_stuct = studentMessageList["student_" + currentClassId + "_" + studentid];

                    if (class_stuct != undefined && student_stuct != undefined) {
                        if (msgtype == 1) {
                            class_stuct.question.untreatcount--;
                            student_stuct.question.untreatcount--;
                            //设置顶部标签里的消息数量
                            $(".question_all_untreatcount").text(class_stuct.question.untreatcount);
                            $(".student_question_untreatcount").text(student_stuct.question.untreatcount);

                        }
                        else if (msgtype == 2) {
                            class_stuct.warning.untreatcount--;
                            student_stuct.warning.untreatcount--;
                            //设置顶部标签里的消息数量
                            $(".warning_all_untreatcount").text(class_stuct.warning.untreatcount);
                            $(".student_warning_untreatcount").text(student_stuct.warning.untreatcount);
                        }
                    }

                }
            }
        });


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


    doAllocStudent: function (obj, students) {
        classStudentsList["class_" + obj.classid] = this.bulidStudentsStruct(obj, students);
        //console.log("classStudentsList[class_" + obj.classid + "]");
        //console.log(classStudentsList);
    },
    //=============== 学生列表结构体 ===============
    bulidStudentsStruct: function (obj, students) {
        var that = this;
        var student_category = {
            classinfo: obj,
            attention: {},
            lesson: new Map(),
            module: new Map(),
            other: {},
            offline: [],
            absent: []
        }
        if (students == undefined || students == null || students.length==0)
            return student_category;

        for (var i = 0; i < students.length; i++) {
            var stu = students[i];

            if (stu.IsOnline == false) {
                student_category.offline.push(stu);
                if (stu.OnlineDuration == 0) {
                    student_category.absent.push(stu);
                }
                continue;
            }

            //先入重点关注,在分其它的类
            if (stu.IsAttention) {
                student_category.attention.name = "重点关注";
                if (student_category.attention.list == undefined) {
                    student_category.attention.list = [];
                }
                that.doListSort(student_category.attention.list, stu);
            }
            else {
                //智能学习或者智能提升下, 按课时分类
                if (stu.ModuleType == 1 || stu.ModuleType == 2) {

                    var lessonKey = "lesson_" + stu.LessonID;
                    if (!student_category.lesson.has(lessonKey)) {
                        var item = {};
                        item.name = (stu.LessonName != "" && stu.LessonName != null) ? "第" + stu.LessonIndex + "课 " + stu.LessonName : "其它";
                        item.list = [];
                        that.doListSort(item.list, stu);
                        student_category.lesson.set(lessonKey, item);
                    }
                    else {
                        var item = student_category.lesson.get(lessonKey);
                        that.doListSort(item.list, stu);
                        student_category.lesson.set(lessonKey, item);
                    }

                }
                else if (stu.ModuleType > 2) {

                    var moduleKey = "module_" + stu.ModuleType;

                    if (!student_category.module.has(moduleKey)) {
                        var item = {};
                        if (stu.ModuleType == 3 || stu.ModuleType == 4) {
                            item.name = "课后任务";
                        }
                        else if (stu.ModuleType == 5 || stu.ModuleType == 6) {
                            item.name = "错题本";
                        }
                        else {
                            item.name = stu.ModuleName;
                        }
                        item.list = [];
                        that.doListSort(item.list, stu);
                        student_category.module.set(moduleKey, item);
                    } else {
                        var item = student_category.module.get(moduleKey);
                        that.doListSort(item.list, stu);
                        student_category.module.set(moduleKey, item);
                    }

                }
                else {
                    student_category.other.name = "其它";
                    if (student_category.other.list == undefined) {
                        student_category.other.list = [];
                    }
                    that.doListSort(student_category.other.list, stu);
                }
            }
        }

        return student_category;

    },

    //------------------HTML-----------------学生列表
    buildStudentListHtml: function (obj, student_category) {

        //var student_category = classStudentsList["class_" + obj.classid];

        if (typeof student_category != "undefined" && student_category != null) {

            var that = this;

            var studentlist_container = $("#studentlist_container");
            studentlist_container.html("");

            var studenttitle = $("#hide_template .student_title").clone(true);

            studenttitle.attr("data-classid", obj.classid);
            studenttitle.attr("data-schoolid", obj.schoolid);
            studenttitle.attr("data-start", obj.start);
            studenttitle.attr("data-end", obj.end);
            studenttitle.attr("data-onlinenum", obj.online_num);
            studenttitle.attr("data-allnum", obj.all_num);
            studentlist_container.append(studenttitle);

            //先构造重点关注
            if (typeof student_category.attention.list != "undefined" && student_category.attention.list.length > 0) {
                var html_sl = $("#hide_template .template_student_list").clone(true);
                html_sl.toggleClass("template_student_list");
                html_sl.attr("category", "attention").attr("key", "");
                html_sl.find(".moduletypename").text(student_category.attention.name).addClass("line1");;
                //遍历构造重点关注的学生列表
                $.each(student_category.attention.list, function (index, valueE) {
                    var student = valueE;
                    var imgUrl = that.getStudentLight(student.Accuracy);
                    let color = that.getStudentColor(student.Accuracy);
                    var html_item = $("#hide_template .template_student_item").clone(true);
                    html_item.toggleClass("template_student_item");
                    html_item.attr("accuracy", color);
                    html_item.find(".dataitem").attr("data-studentid", student.StudentID).attr("data-classid", student.ClassID);
                    html_item.find(".label").append("<img src='" + imgUrl + "' />")
                    html_item.find(".label").append(student.StudentName);

                    html_item.find(".qwc").text(student.QuestionUntreatedCount);
                    html_item.find(".wwc").text(student.WarningWaitCount);


                    html_sl.find("ul").append(html_item);
                });
                studentlist_container.append(html_sl);
            }

            //构造正在学习某个课时的学生列表
            if (typeof student_category.lesson != "undefined" && student_category.lesson.size > 0) {

                student_category.lesson.forEach(function (valueE, key) {
                    var lessonInfo = valueE;

                    var html_sl = $("#hide_template .template_student_list").clone(true);
                    html_sl.find(".moduletypename").text(lessonInfo.name).addClass("line1");
                    html_sl.toggleClass("template_student_list");
                    html_sl.attr("category", "lesson").attr("key", key);
                    if (typeof lessonInfo.list != "undefined" && lessonInfo.list.length > 0) {
                        $.each(lessonInfo.list, function (i, student) {
                            var imgUrl = that.getStudentLight(student.Accuracy);
                            let color = that.getStudentColor(student.Accuracy);
                            var html_item = $("#hide_template .template_student_item").clone(true);
                            html_item.toggleClass("template_student_item");
                            html_item.attr("accuracy", color);
                            html_item.find(".dataitem").attr("data-studentid", student.StudentID).attr("data-classid", student.ClassID);
                            html_item.find(".label").append("<img src='" + imgUrl + "' />")
                            html_item.find(".label").append(student.StudentName);
                            if (student.QuestionUntreatedCount > 0) {
                                html_item.find(".qwc").text(student.QuestionUntreatedCount).show();
                            }
                            else {
                                html_item.find(".qwc").hide();
                            }
                            if (student.WarningWaitCount > 0) {
                                html_item.find(".wwc").text(student.WarningWaitCount).show();
                            }
                            else {
                                html_item.find(".wwc").hide();
                            }

                            html_sl.find("ul").append(html_item);
                        });
                    }
                    studentlist_container.append(html_sl);

                });
            }

            //构造正在学习其他模块的学生
            if (typeof student_category.module != "undefined" && student_category.module.size > 0) {
                student_category.module.forEach(function (valueE, key) {
                    var lessonInfo = valueE;

                    var html_sl = $("#hide_template .template_student_list").clone(true);
                    html_sl.find(".moduletypename").text(lessonInfo.name).addClass("line1");;
                    html_sl.toggleClass("template_student_list");
                    html_sl.attr("category", "module").attr("key", key);;
                    if (typeof lessonInfo.list != "undefined" && lessonInfo.list.length > 0) {
                        $.each(lessonInfo.list, function (i, student) {
                            var imgUrl = that.getStudentLight(student.Accuracy);
                            let color = that.getStudentColor(student.Accuracy);
                            var html_item = $("#hide_template .template_student_item").clone(true);
                            html_item.toggleClass("template_student_item");
                            html_item.attr("accuracy", color);
                            html_item.find(".dataitem").attr("data-studentid", student.StudentID).attr("data-classid", student.ClassID);
                            html_item.find(".label").append("<img src='" + imgUrl + "' />")
                            html_item.find(".label").append(student.StudentName);
                            if (student.QuestionUntreatedCount > 0) {
                                html_item.find(".qwc").text(student.QuestionUntreatedCount).show();
                            }
                            else {
                                html_item.find(".qwc").hide();
                            }
                            if (student.WarningWaitCount > 0) {
                                html_item.find(".wwc").text(student.WarningWaitCount).show();
                            }
                            else {
                                html_item.find(".wwc").hide();
                            }

                            html_sl.find("ul").append(html_item);
                        });
                    }
                    studentlist_container.append(html_sl);

                });
            }

            //构造其它类别
            if (typeof student_category.other.list != "undefined" && student_category.other.list.length > 0) {
                var html_sl = $("#hide_template .template_student_list").clone(true);
                html_sl.toggleClass("template_student_list");
                html_sl.attr("category", "other").attr("key", "");
                html_sl.find(".moduletypename").text(student_category.other.name).addClass("line1");;

                $.each(student_category.other.list, function (index, valueE) {
                    var student = valueE;
                    var imgUrl = that.getStudentLight(student.Accuracy);
                    let color = that.getStudentColor(student.Accuracy);
                    var html_item = $("#hide_template .template_student_item").clone(true);
                    html_item.toggleClass("template_student_item");
                    html_item.attr("accuracy", color);
                    html_item.find(".dataitem").attr("data-studentid", student.StudentID).attr("data-classid", student.ClassID);
                    html_item.find(".label").append("<img src='" + imgUrl + "' />")
                    html_item.find(".label").append(student.StudentName);
                    if (student.QuestionUntreatedCount > 0) {
                        html_item.find(".qwc").text(student.QuestionUntreatedCount).show();
                    }
                    else {
                        html_item.find(".qwc").hide();
                    }
                    if (student.WarningWaitCount > 0) {
                        html_item.find(".wwc").text(student.WarningWaitCount).show();
                    }
                    else {
                        html_item.find(".wwc").hide();
                    }


                    html_sl.find("ul").append(html_item);
                });
                studentlist_container.append(html_sl);
            }

            //离线
            if (student_category.offline != undefined && student_category.offline.length > 0) {


                var html_sl = $("#hide_template .template_student_list").clone(true);
                html_sl.find(".moduletypename").text("离线学生");
                html_sl.toggleClass("offline");
                html_sl.attr("category", "offline").attr("key", "");;
                html_sl.toggleClass("template_student_list");

                $.each(student_category.offline, function (i, student) {

                    var imgUrl = "/Content/images/dp7.png";
                    var html_item = $("#hide_template .template_student_item").clone(true);

                    html_item.toggleClass("template_student_item");
                    html_item.attr("accuracy", "offline");
                    html_item.find(".dataitem").attr("data-studentid", student.StudentID).attr("data-classid", student.ClassID);
                    html_item.find(".label").append("<img src='" + imgUrl + "' />")
                    html_item.find(".label").append(student.StudentName);
                    html_item.find(".spec_info").html("离线");

                    html_sl.find("ul").append(html_item);


                });


                html_sl.hide();
                studentlist_container.append(html_sl);

            }

            //缺勤
            if (student_category.absent != undefined && student_category.absent.length > 0) {
                var html_sl = $("#hide_template .template_student_list").clone(true);
                html_sl.find(".moduletypename").text("缺勤学生");
                html_sl.toggleClass("absent");
                html_sl.toggleClass("template_student_list");
                html_sl.attr("category", "absent").attr("key", "");;

                $.each(student_category.offline, function (i, student) {

                    var imgUrl = "/Content/images/dp6.png";
                    var html_item = $("#hide_template .template_student_item").clone(true);
                    html_item.toggleClass("template_student_item");
                    html_item.attr("accuracy", "absent");
                    html_item.find(".dataitem").attr("data-studentid", student.StudentID).attr("data-classid", student.ClassID);
                    html_item.find(".label").append("<img src='" + imgUrl + "' />")
                    html_item.find(".label").append(student.StudentName);
                    html_item.find(".spec_info").html("缺勤");

                    html_sl.find("ul").append(html_item);


                });


                html_sl.hide();
                studentlist_container.append(html_sl);
            }


        }
    },

    //按正确率排序
    doListSort: function (array, obj) {
        //为空直接插入
        if (array.length == 0) {
            array.push(obj);
        }
        else {
            let isFind = false;
            for (let i = 0; i < array.length; i++) {
                let item = array[i];//这里必须要定义，因为循环结束，会用到。
                if (obj.Accuracy >= item.Accuracy) {
                    //比当前元素大,则插入到当前位置
                    array.splice(i, 0, obj);
                    isFind = true;
                    break;
                }
            }
            //如果没找到,则代表obj是最小的那个,则放入到数组末尾
            if (!isFind) {
                array.push(obj);
            }
        }
    },
    //根据正确率返回相应的亮灯颜色
    getStudentLight: function (accuracy) {
        var baseImgUrl = "/Content/images/";
        var imageName = "";
        if (accuracy > 0 && accuracy < 45) { //红灯
            imageName = "dp4.png";
        }
        else if (accuracy >= 45 && accuracy < 80) { //黄灯
            imageName = "dp3.png";
        }
        else if (accuracy >= 80) { //紫灯
            imageName = "dp2.png";
        }
        else { //灰灯 五正确率
            imageName = "dp5.png";
        }

        return baseImgUrl + imageName;
    },
    getStudentColor: function (accuracy) {

        var color = "";
        if (accuracy > 0 && accuracy < 45) { //红灯
            color = "red";
        }
        else if (accuracy >= 45 && accuracy < 80) { //黄灯
            color = "yellow";
        }
        else if (accuracy >= 80) { //紫灯
            color = "purple";
        }
        else { //灰灯 无正确率
            color = "gray";
        }

        return color;
    },

    //关注或者不关注某个学生
    doAttentionStudent: function (obj) {

        let element = $(obj);
        let isAttention = 1;
        //已经关注过了,再次点击就是取消关注
        if (element.hasClass("selimg")) {
            isAttention = 0;
        }
       
        $.ajax({
            async: false,
            type: "post",
            datatype: "json",
            url: MonitorClass.AsynUrls.url_doAttentionStudent.replace("{isAttention}", isAttention),
            data: {
                SchoolID: $("#hidden_schoolid").val(),
                ClassID: $("#current_classid").val(),
                StudentID: element.attr("studentid"),
                corseid: $("#current_courseid").val(),
                NewestMsgId: ""
            },
            success: function (info) {
                if (info.code == 200) {
                    if (info.data.result == true) {
                        let student = null;
                        
                        if (isAttention == 1) {
                            $(obj).attr("actiontype", 261);
                        } else {
                            $(obj).attr("actiontype", 262);
                        }
                        let student_category = source_studentlist["class_" + $("#current_classid").val()];
                        if (student_category != undefined && student_category.Students.length > 0) {

                            for (let i = 0; i < student_category.Students.length; i++) {
                                if (student_category.Students[i].StudentID == element.attr("studentid")) {
                                    student = student_category.Students[i];
                                    break;
                                }
                            }
                        }
                        $(obj).toggleClass('selimg');
                        if (isAttention == 1) {

                            if (student != null) {
                                student.IsAttention = true;
                            }

                            element.find(".infotext").text("取消关注");

                            layer.msg("该学生已重点关注");
                        }
                        else {

                            if (student != null) {
                                student.IsAttention = false;
                            }
                            element.find(".infotext").text("重点关注");
                            layer.msg("取消关注成功");
                        }



                    }


                }
            }
        });
    },

    //根据正确率过滤学生显示
    filterStudentList: function (status) {
        if (status == "all") {
            $("#studentlist_container .listbox").hide();
            $("#studentlist_container div.offline").show();
            $("#studentlist_container .student_title").show();
            $("#studentlist_container li").show();
            $("#studentlist_container .listbox").show();
            $("#studentlist_container div.absent").hide();
            $("#studentlist_container div.offline").hide();
        } else if (status == "off") {
            //缺勤
            $("#studentlist_container .student_title").hide();
            $("#studentlist_container .listbox").hide();
            $("#studentlist_container div.absent").show();
            $("#studentlist_container div.absent li").show();
        }
        else if (status == "go") {
            //离线
            $("#studentlist_container .student_title").hide();
            $("#studentlist_container div.offline li").show();
        }
        else {
            $("#studentlist_container li").hide()
            $("#studentlist_container li[accuracy=" + status + "]").show();
            $("#studentlist_container li[accuracy=" + status + "]").closest(".listbox").show();
            $("#studentlist_container .listbox").each(function (index, ele) {
                if ($(ele).find("li:visible").length == 0) {
                    $(this).hide();
                }
            });
            $("#studentlist_container .student_title").show();
        }

        $('.content47').hide();
    },

    showStudentFilterText: function (status) {
        var text = "";
        switch (status) {
            case "all":
                text = "在线学生";
                break;
            case "purple":
                text = "紫灯学生";
                break;
            case "yellow":
                text = "黄灯学生";
                break;
            case "red":
                text = "红灯学生";
                break;
            case "gray":
                text = "灰灯学生";
                break;
            case "go":
                text = "离线学生";
                break;
            case "off":
                text = "缺勤学生";
                break;
            default:
                text = "在线学生";
                break;
        }

        $("label.textbox").text(text);
    },

    //视频提问的弹窗
    showVideo: function (obj) {
        var element = $(obj);
        var btnText = element.parents('.btns').find('a.defa').text();
        let videoUrl = element.attr("VideoUrl");
        let point = element.attr("VideoTimePoint");
        let remark = element.attr("Remark");

        let message_id = element.closest("div.list").data("messageid");
        let message_state = element.closest("div.list").attr("status");

        let btns = [];
        if (message_state == "wait") {
            //btns = ['忽略', '呼叫'];
            $(".video_hujiao").show();
            $(".video_hulue").show();
            $(".video_close").hide();
            $(".videobtns a.defa").hide();
            $(".videobtns .video_hujiao").click(function () {
                MonitorClass.handleSignal(element, 1, 1, -1, -1);
                $(".video_hujiao").hide();
                $(".video_hulue").hide();
                $(".videobtns").append("<a href=\"#\" class=\"defa\">已呼叫</a>");
                layer.close(1);
                playerTemp.videoPause();
                playerTemp = null;
            });

            $(".videobtns .video_hulue").click(function () {
                MonitorClass.handleSignal(element, 1, 2, -1, -1)
                $(".video_hujiao").hide();
                $(".video_hulue").hide();
                $(".videobtns").append("<a href=\"#\" class=\"defa\">已忽略</a>");
                layer.close(1);
                playerTemp.videoPause();
                playerTemp = null;
            });

        }
        else {
            //btns = ['关闭']
            $(".video_hujiao").hide();
            $(".video_hulue").hide();
            if (btnText != '') {
                if ($(".videobtns a.defa").text() == '') {
                    $(".videobtns").append("<a href=\"#\" class=\"defa\">" + btnText + "</a>");
                } else {
                    $(".videobtns a.defa").text(btnText)
                }
            }
            //$(".video_close").show();
            //$(".video_close").click(function () {
            //    layer.close(1);
            //    playerTemp.videoPause();
            //    playerTemp = null;
            //});
        }

        $(".questioninfo").text(remark);

        layer.open({
            type: 1,
            //btn: btns,
            title: "视频提问详情",
            area: ['1140px'],
            skin: 'content64_1',
            content: $('.content39'),
            yes: function (index) {

            },
            btn2: function () {

            },
            cancel: function () {
                if (playerTemp != null) {
                    playerTemp.videoPause();
                    playerTemp = null;
                }
            }

        });

        // 弹窗中的视频播放器
        var videoObjectTemp = {
            container: '#videoTemp', //容器的ID或className
            variable: 'player', //播放函数名称
            autoplay: true, //是否自动播放
            debug: true, //是否开启调试模式
            loaded: 'loadedHandlerTemp',
            isAutoHideBar: false,
            video: videoUrl,
            seek: point,
            promptSpot: [{ "time": point * 1, "words": "", "remark": remark.replace("㊣", "；"), "url": videoUrl }]
        };

        playerTemp = new ckplayer(videoObjectTemp);


    },

    //问题提问弹窗
    showQuestion: function (obj) {
        var element = $(obj);

        let question_itemid = $(obj).attr("question_itemid");
        let UserAnswer = $(obj).attr("useranswer");
        let message_id = element.closest("div.list").data("messageid");
        let message_state = element.closest("div.list").attr("status");

        $.ajax({
            async: true,
            type: "get",
            datatype: "json",
            url: MonitorClass.AsynUrls.url_GetQuestionDetail.replace("{questionid}", question_itemid),
            success: function (info) {
                if (info.code == 200) {

                    //构造问题的显示区域
                    var questionitem = info.data;
                    $(".content64 .contbox").html("");
                    if (questionitem.q_Type == 1) {
                        //选择题

                        //标题
                        let title = $(".template_question_title").clone().toggleClass("template_question_title");
                        title.find(".objtextinfo").html(questionitem.q_Content);
                        $(".content64 .contbox").append(title);

                        //选择题选项
                        let optionshtml = $(".template_question_select").clone().toggleClass("template_question_select");
                        optionshtml.find(".ljlitem[option='A']").find(".ljlspan").html(questionitem.q_OptionsA);
                        optionshtml.find(".ljlitem[option='B']").find(".ljlspan").html(questionitem.q_OptionsB);
                        optionshtml.find(".ljlitem[option='C']").find(".ljlspan").html(questionitem.q_OptionsC);
                        optionshtml.find(".ljlitem[option='D']").find(".ljlspan").html(questionitem.q_OptionsD);
                        //显示正确的 和 错误的选项
                        optionshtml.find(".ljlitem[option='" + questionitem.q_Answer + "']").addClass("ljlsuccess").append("<i class=\"ljlerrorico\"></i>");
                        optionshtml.find(".ljlitem[option='" + UserAnswer + "']").addClass("ljlerror").append("<i class=\"ljlerrorico\"></i>");
                        $(".content64 .contbox").append(optionshtml);



                    } else if (questionitem.q_Type == 2) {
                        //填空题
                        let title = $(".template_question_filling").clone().toggleClass("template_question_filling");
                        title.find(".fillbox").html(questionitem.q_Content);
                        $(".content64 .contbox").append(title);

                    }
                    else {
                        //解答题

                        let title = $(".template_question_title").clone().toggleClass("template_question_title");
                        title.find(".objtextinfo").html(questionitem.q_Content);
                        $(".content64 .contbox").append(title);

                        let anwer = $(".template_question_title").clone().toggleClass("template_question_title");
                        title.find(".objtextinfo").html(questionitem.q_Answer);
                        $(".content64 .contbox").append(anwer);
                    }

                    //题目解析
                    let objanalysis = $(".template_question_analysis").clone().toggleClass("template_question_analysis");
                    objanalysis.find(".objanalysistext").html(questionitem.q_TextExplain);
                    $(".content64 .contbox").append(objanalysis);
                    MathJax.typeset();
                    ShowInput3();
                 

                    //正确答案
                    var alist = $(".content64 .contbox .spanflagAnswers").text().split(",");
                    var index = 1;
                    alist.forEach(function (item) {
                        findInput($(".content64 .contbox"), item, index);
                        index++;
                    });

                    //用户答案
                    var tempList = UserAnswer.split("㊣");
                    var ins = 0;

                    // 初始化
                    $(".content64 .contbox").find(".quizPutTag").each(function () {

                        // 当前输入
                        var control = $a(this);
                        control.setValue(tempList[ins]);

                        // 填空对错
                        control.showRight();

                        ins++;
                    });

                    clickShowAnswer3($(".content64 .contbox"));

                    

                }
            }
        });

        let btns = [];
        if (message_state == "wait") {
            btns = ['忽 略', '呼 叫'];
        }
        else {
            btns = ['关闭']
        }

        layer.open({
            type: 1,
            btn: btns,
            title: '详情',
            btnAlign: 'c',
            skin: 'content64_1',
            closeBtn: 1,
            area: ['900px', '700px'],
            content: $('.content64'),
            yes: function (index) {
                if (message_state == "wait") {
                    MonitorClass.handleSignal(element, 1, 2, -1, -1)
                }
                layer.close(index);
            },
            btn2: function () {
                MonitorClass.handleSignal(element, 1, 1, -1, -1)
            },
            success: function () {
                if (message_state != "wait") {
                    $(".content64_1 .layui-layer-btn0").addClass("layui-layer-btn1");
                }
            }
        });
    },

    findStudent: function (classid, studentid) {
        var studentlist = source_studentlist["class_" + classid];

        let student = {};
        if (typeof studentlist != "undefined" && studentlist != null) {
            if (studentlist.Students != undefined && studentlist.Students.length > 0) {
                for (let i = 0; i < studentlist.Students.length; i++) {
                    if (studentlist.Students[i].StudentID == studentid) {
                        student = studentlist.Students[i];
                        break;
                    }
                }
            }
        }

        return student;

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
                    html_msgItem.find(".time_ms").text(MonitorClass.showHourAndMinute(msg.create_time));
                    html_msgItem.find(".userimg img").attr("src", headsrc);
                    html_msgItem.find(".studentname").text(msg.student_name);
                    html_msgItem.find(".studentlevel").html(MonitorClass.buildLevelImgHtml(msg.level));
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
                            msgitem_detail.find(".msgitem_detail_title").text("问题描述：");
                            msgitem_detail.find(".msgitem_detail_content").html(msg.question_itemname);
                            html_msgItem.find(".cnttext").append(msgitem_detail);

                            html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showquestion\" question_itemid=\"" + msg.question_itemid
                                + "\" useranswer=\"" + questionAsk.UserAnswer + "\" onclick=\"MonitorClass.showQuestion(this)\" moduleId=\"1\"  subModuleId=\"11\" actionType=\"114\" datatype=\"1\">问题详情</a>");

                            //挖空&渲染...
                            //MathJaxRender(msgitem_detail.find(".msgitem_detail_content")[0], msgitem_detail);

                        }
                        else if (askItem.AskType == 2) {
                            //题型题目提问
                            var typeQuestionAsk = JSON.parse(askItem.AskContentJson);

                            let msgitem_detail = $("#hide_template .msgitem_detail").clone();
                            msgitem_detail.find(".msgitem_detail_title").text("问题描述：");
                            msgitem_detail.find(".msgitem_detail_content").html(msg.question_itemname);
                            html_msgItem.find(".cnttext").append(msgitem_detail);

                            html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showquestion\" question_itemid=\"" + msg.question_itemid
                                + "\" useranswer=\"" + typeQuestionAsk.UserAnswer + "\" onclick=\"MonitorClass.showQuestion(this)\"   moduleId=\"1\"  subModuleId=\"11\" actionType=\"114\" datatype=\"1\">问题详情</a>");

                            //挖空&渲染...
                            //MathJaxRender(msgitem_detail.find(".msgitem_detail_content")[0], msgitem_detail);

                        }
                        else if (askItem.AskType == 3) {
                            //视频提问
                            var videoAsk = JSON.parse(askItem.AskContentJson);
                            if (videoAsk.VideoUrl != "") {

                                let msgitem_detail = $("#hide_template .msgitem_detail").clone();
                                msgitem_detail.find(".msgitem_detail_title").text("问题描述：");
                                msgitem_detail.find(".msgitem_detail_content").html(videoAsk.Remark.replace("㊣", "；"));
                                html_msgItem.find(".cnttext").append(msgitem_detail);

                                msgitem_detail = $("#hide_template .msgitem_detail").clone();
                                msgitem_detail.find(".msgitem_detail_title").text("视频名称：");
                                msgitem_detail.find(".msgitem_detail_content").html(videoAsk.VideoName);
                                html_msgItem.find(".cnttext").append(msgitem_detail);

                                html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_showvideo\" VideoUrl=\"" + videoAsk.VideoUrl +
                                    "\" VideoTimePoint=\"" + videoAsk.VideoTimePoint +
                                    "\" Remark=\"" + videoAsk.Remark.replace("㊣", "；") + "\"  moduleId=\"1\"  subModuleId=\"11\" actionType=\"114\" datatype=\"1\"  onclick=\"MonitorClass.showVideo(this)\" >视频详情</a>");

                            }
                        }
                    } catch (exception) {
                        html_msgItem.find(".msg_content").text("消息内容格式发生解析异常,原始json如下:" + msg.message_content);
                    }

                    html_msgItem.attr("status", "finish");

                    if (msg.state == 1) {
                        //未处理
                        html_msgItem.attr("status", "wait");

                        html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_ignore\"  moduleId=\"1\"  subModuleId=\"11\" actionType=\"116\" datatype=\"1\" onclick=\"MonitorClass.handleSignal(this,1,2,-1,-1)\">忽 略</a>");
                        html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"btn_call ljlactive\"  moduleId=\"1\"  subModuleId=\"11\" actionType=\"115\" datatype=\"1\" onclick=\"MonitorClass.handleSignal(this,1,1,-1,-1)\" class=\"ljlactive\">呼 叫</a>");
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
                        html_msgItem.find(".listbox .btns").append("<a href=\"#\" class=\"defa\">自动忽略</a>");
                        html_msgItem.addClass("listdef");
                    }
                    $(".question_window .ljlshowbox").append(html_msgItem);

                });
                MathJaxRender();
                webLogReg(".btn_showquestion");
                webLogReg(".btn_ignore");
                webLogReg(".btn_call");
                $('.content29 .niceScrollbox').getNiceScroll().resize();
            }
        }
    }

}

// 视频是否拖动 是否显示倍速
function loadedHandlerTemp(t) {
    playerTemp.changeConfig('config', 'timeScheduleAdjust', 1);
    playerTemp.disPlaybackrate = false;
}

//主要用于外面的消息区域的渲染. 
//输入框渲染为空白只读.
function MathJaxRender() {
    //挖空&渲染...
    MathJax.typeset();
    ShowInput3();
}


var timerTask = {

    //定时任务-获取当前的最新消息 - 只监控选中状态的班级
    getCurrentMessages: function () {

        let current_all = $("#current_all").val();
        let current_classid = $("#current_classid").val();
        let current_studentid = $("#current_studentid").val();
        let current_moduletype = $("#current_moduletype").val();

        if (current_all == 1) {
            //全体学生监控时的最新消息获取
            var msg_stuct = classAllMsg["class_" + current_classid];
            if (typeof classAllMsg["class_" + current_classid] != "undefined" && classAllMsg["class_" + current_classid] != null) {
                //有过消息了,则只获取最新的消息
                $.ajax({
                    async: true,
                    type: "post",
                    datatype: "json",
                    url: MonitorClass.AsynUrls.url_GetClassNewMsg,
                    data: {
                        SchoolID: $("#hidden_schoolid").val(),
                        ClassID: current_classid,
                        StudentID: current_studentid,
                        NewestMsgId: msg_stuct.newest,
                        corseid: $("#current_courseid").val()
                    },
                    success: function (info) {
                        if (info.code == 200) {
                            var old_class_list = classAllMsg["source_class_" + current_classid];
                            if (info.data.result != null && info.data.result.length > 0) {
                                let msgList = info.data.result;
                                MonitorClass.doAllocNewMessage_class(current_classid, msgList);
                                MonitorClass.doAllocAllMessage(current_classid, old_class_list);
                                MonitorClass.buildClassMessageHtml(current_classid);
                            }
                        }
                    }
                });
            }
            else {

                //首次加载时,需要全部获取一次.
                MonitorClass.getAllStudentsDetails($("#studentlist_container .student_title"));

                //如果有提问内容则显示它, 一般是首次
                if ($("#current_moduletype").val() == 1 && $(".quanbutiwenlieibao").prev().length > 0 && $(".allquestion_container").html() != "") {
                    $(".quanbutiwenlieibao").prev().remove();
                    $(".quanbutiwenlieibao").show();
                }

                //如果有预警内容则显示它, 一般是首次
                if ($("#current_moduletype").val() == 2 && $(".quanbuyujingliebiao").prev().length > 0 && $(".allwarning_container").html() != "") {
                    $(".quanbuyujingliebiao").prev().remove();
                    $(".quanbuyujingliebiao").show();
                }

            }

            //加载头部
            MonitorClass.buildClassTitle();

        }
        else if (current_all == 2) {
            var msg_stuct = studentMessageList["student_" + current_classid + "_" + current_studentid];
            //单个学生监控时的最新消息获取
            if (typeof msg_stuct != "undefined" && msg_stuct != null) {

                $.ajax({
                    async: true,
                    type: "post",
                    datatype: "json",
                    url: MonitorClass.AsynUrls.url_GetStudentNewMsg,
                    data: {
                        SchoolID: $("#hidden_schoolid").val(),
                        ClassID: current_classid,
                        StudentID: current_studentid,
                        NewestMsgId: msg_stuct.newest,
                        corseid: $("#current_courseid").val()
                    },
                    success: function (info) {
                        if (info.code == 200) {
                            //var old_student_list = msg_stuct;
                            if (info.data.result != null && info.data.result.length > 0) {
                                let msgList = info.data.result;
                                //更新js本地缓存
                                MonitorClass.doAllocNewMessage_student(current_classid, current_studentid, msgList);
                                //重新构造缓存结构体
                                var old_student_list = studentMessageList["source_student_" + current_classid + "_" + current_studentid];
                                MonitorClass.doAllocMessage_student(current_classid, current_studentid, old_student_list);

                                //重新构造界面
                                MonitorClass.buildStudentMessageHtml(current_classid, current_studentid);
                            }
                        }
                    }
                });

            }

        }


    },

    //定时任务-班级列表的变化
    classChangeHandler: function () {

        $.ajax({
            async: true,
            type: "get",
            url: MonitorClass.AsynUrls.url_getAllClasses,
            data: {},
            success: function (info) {
                if (info.code == 200 && info.data.result.length > 0) {

                    if ($(".classcontainer .noneclass").length > 0) {
                        $(".classcontainer .noneclass").remove();
                    }
                    if ($("#studentlist_container .nonestudent").length > 0) {
                        $("#studentlist_container .nonestudent").remove();
                    }
                    if ($(".noneinfo").length > 0) {
                        $(".noneinfo").remove();
                    }

                    let newClasses = info.data.result;
                    let isEmpty = false;
                    if ($(".classcontainer li").length == 0) {
                        isEmpty = true;
                    }
                    for (var i = 0; i < info.data.result.length; i++) {
                        var cls = info.data.result[i];
                        let isFind = false;
                        $(".classcontainer li").each(function (index, ele) {
                            let classid = $(ele).find(".dataitem").data("classid");
                            let courseid = $(ele).find(".dataitem").data("courseid");
                            //检查在最新的班级列表中是否存在
                            //找到了班级,代表当前班级还在上课中,只更新数量即可
                            if (classid == cls.ClassID && courseid == cls.CourseID) {
                                isFind = true;
                                let questioncount = parseInt($(ele).find(".questioncount").text());
                                let waningcount = parseInt($(ele).find(".waningcount").text());
                                //更新最新的问题数
                                if (questioncount != cls.QuestionWaitCount) {
                                    $(ele).find(".questioncount").text(cls.QuestionWaitCount);
                                    if (questioncount < cls.QuestionWaitCount) {
                                        if (!$(ele).find("span.Lessons").hasClass("flash")) {
                                            $(ele).find("span.Lessons").addClass("flash animated infinite");
                                        }
                                    }
                                }

                                //更新最新的预警数
                                if (waningcount != cls.WarningWaitCount) {
                                    $(ele).find(".waningcount").text(cls.WarningWaitCount);
                                    if (waningcount < cls.WarningWaitCount) {
                                        if (!$(ele).find("span.preparedLessons").hasClass("flash")) {
                                            $(ele).find("span.preparedLessons").addClass("flash animated infinite");
                                        }
                                    }
                                }

                                //更新其它的数据
                                $(ele).find(".dataitem").attr("data-week", cls.Week)
                                    .attr("data-start", cls.StartTimeFormat)
                                    .attr("data-end", cls.EndTimeFormat).attr("data-delay", cls.DelayMinute);
                                    //.append("<span class=\"corsename\" style=\"display:none\">" + cls.CourseName + "</span>");
                                //构造html内容
                                $(ele).find(".label").text(cls.ClassName);
                                $(ele).find(".classtime").text("上课时间：" + cls.StartTimeFormat + "-" + cls.EndTimeFormat);
                                $(ele).find(".classtime").attr("data-start", cls.StartTimeFormat).attr("data-end", cls.EndTimeFormat);



                                return false; //跳出循环
                            }

                        });

                        //自动上课
                        if (!isFind) {
                            var html = $("#hide_template .template_classitem").clone(true);
                            html.removeClass("template_classitem");
                            //上课动画
                            //html.addClass("fadeInDown animated infinite newinclass");
                            html.find(".dataitem").attr("data-classid", cls.ClassID)
                                .attr("data-courseid", cls.CourseID)
                                .attr("data-schoolid", cls.SchoolID)
                                .attr("data-week", cls.Week)
                                .attr("data-start", cls.StartTimeFormat);
                                //.attr("data-end", cls.EndTimeFormat).attr("data-delay", cls.DelayMinute).append("<span class=\"corsename\" style=\"display:none\">" + cls.CourseName + "</span>");
                            html.find(".label").text(cls.ClassName);
                            html.find(".questioncount").text(cls.QuestionWaitCount);
                            html.find(".waningcount").text(cls.WarningWaitCount);
                            html.find(".classtime").text("上课时间：" + cls.StartTimeFormat + "-" + cls.EndTimeFormat);
                            html.find(".classtime").attr("data-start", cls.StartTimeFormat).attr("data-end", cls.EndTimeFormat);


                            $(".classcontainer").append(html);

                            //上课动画
                            //setTimeout(function () {
                            //    html.removeClass("fadeInDown animated infinite");
                            //}, 1000);
                        }

                    }
                    if (isEmpty) {
                        $(".classcontainer li").eq(0).attr("class", "ljlactive").click();
                    }
                    else {
                        //自动下课
                        $(".classcontainer li").each(function (index, ele) {
                            let isFind = false;
                            let classid = $(ele).find(".dataitem").data("classid");
                            let courseid = $(ele).find(".dataitem").data("courseid");
                            for (var i = 0; i < info.data.result.length; i++) {
                                var cls = info.data.result[i];
                                if (classid == cls.ClassID && courseid == cls.CourseID) {
                                    isFind = true;
                                    break;
                                }
                            }
                            //没找到,代表该班级已经下课了.
                            if (!isFind) {
                                let endtime = $(ele).find(".classtime").data("end");
                                let endHour = endtime.split(":")[0];
                                let endMinute = endtime.split(":")[1];

                                let currentDate = new Date();
                                let thisDate = new Date(currentDate.getYear(), currentDate.getMonth(), currentDate.getDay(), endHour, endMinute, 0);
                                if (currentDate > thisDate) {

                                    $(ele).remove();

                                    //下课动画效果
                                    //$(ele).addClass("fadeOutUp animated infinite");
                                    //setTimeout(function () {
                                    //    $(ele).removeClass("fadeInDown animated infinite").remove();
                                    //}, 800);

                                }

                            }
                        });
                    }

                    //如果列表中没有班级选中的
                    if ($(".classcontainer li.ljlactive").length == 0 && $(".classcontainer li").length > 0) {
                        $(".classcontainer li").eq(0).addClass("ljlactive");
                        $("#current_classid").val($(".classcontainer li").eq(0).find(".dataitem").attr("data-classid"));
                    }



                    $('.content4 .niceScrollbox').getNiceScroll().resize();

                } else {
                    //所有班级都没了
                    $(".classcontainer").html($("#hide_template .noneclass").clone());
                    $("#studentlist_container").html($("#hide_template .nonestudent").clone());
                    if ($(".noneinfo").length == 0) {
                        $(".content40").prepend("<div class=\"nodate2 noneinfo\"></div>");
                    }
                    $(".quanbuxuesheng").hide();
                    $(".dangexuesheng").hide();

                    $("#current_all").val("");
                    $("#current_classid").val("");
                    $("#current_studentid").val("");
                    $("#current_moduletype").val("")
                    $("#current_courseid").val("");
                    $("#current_week").val("");
                    $("#current_day").val("");
                    $("#current_start").val("");
                    $("#current_end").val("");
                    $("#current_delay").val("");

                }
            }
        });

    },

    //定时任务-当前学生列表的变化 - 只监控选中状态的班级学生列表
    studentListChangeHandler: function () {

        let current_classid = $("#current_classid").val();
        let current_studentid = $("#current_studentid").val();

        if (current_classid) {

            var currentClass = $(".classcontainer li.ljlactive");
            if (currentClass.length == 0) {
                return;
            }

            var obj = {};
            obj.classid = currentClass.find(".dataitem").data("classid");
            obj.courseid = currentClass.find(".dataitem").data("courseid");
            obj.schoolid = currentClass.find(".dataitem").data("schoolid");
            obj.week = currentClass.find(".dataitem").attr("data-week");
            obj.start = currentClass.find(".dataitem").attr("data-start");
            obj.end = currentClass.find(".dataitem").attr("data-end");



            var that = MonitorClass;

            $.ajax({
                async: true,
                type: "get",
                url: MonitorClass.AsynUrls.url_getStudentsByClassId.replace("{corseid}", obj.courseid),
                data: {},
                success: function (info) {
                    if (info.code == 200) {
                        $("#student_online_status").text(info.data.StudentOnlineNumber + "/" + info.data.StudentAllNumber);
                        let online_num = info.data.StudentOnlineNumber;
                        let all_num = info.data.StudentAllNumber;

                        obj.online_num = info.data.StudentOnlineNumber;
                        obj.all_num = info.data.StudentAllNumber;

                        //最新结果
                        var student_category = MonitorClass.bulidStudentsStruct(obj, info.data.Students);

                        //重新构造html内容
                        MonitorClass.buildStudentListHtml(obj, student_category);

                        //找到原先数量变化的部分, 并设置动画.

                        //老的本地缓存
                        var source_data = source_studentlist["class_" + obj.classid];

                        if (typeof source_data != "undefined" && source_data != null && source_data.Students.length > 0) {

                            var studentlist_container = $("#studentlist_container");

                            //先找原始已经存在的,
                            for (let i = 0; i < source_data.Students.length; i++) {

                                let source_student = source_data.Students[i];

                                for (let j = 0; j < info.data.Students.length; j++) {
                                    let new_student = info.data.Students[j];
                                    //找到这个学生,
                                    if (source_student.StudentID == new_student.StudentID) {
                                        // 不处理离线的, 只处理在线的学生.
                                        if (new_student.IsOnline == false) {
                                            //跳出当前循环
                                            continue;
                                        }

                                        //问题数量更新了. 加动画
                                        if (new_student.QuestionUntreatedCount > source_student.QuestionUntreatedCount) {
                                            //然后再html里去找,并判断,该学生的消息数量是否变化
                                            let target = studentlist_container.find("a[data-studentid=" + source_student.StudentID + "]");
                                            //这里只加闪烁动画, 不做数量更新, 上面的buildStudentListHtml已经更新过了.
                                            if (!target.find("span.Lessons").hasClass("flash")) {
                                                target.find("span.Lessons").addClass("flash animated infinite");
                                            }
                                            //source_student.QuestionUntreatedCount = new_student.QuestionUntreatedCount;
                                        }

                                        //警告数量更新了.加动画
                                        if (new_student.WarningWaitCount > source_student.WarningWaitCount) {
                                            //然后再html里去找,并判断,该学生的消息数量是否变化
                                            let target = studentlist_container.find("a[data-studentid=" + source_student.StudentID + "]");
                                            //这里只加闪烁动画, 不做数量更新, 上面的buildStudentListHtml已经更新过了.
                                            if (!target.find("span.preparedLessons").hasClass("flash")) {
                                                target.find("span.preparedLessons").addClass("flash animated infinite");
                                            }

                                            //source_student.WarningWaitCount = new_student.WarningWaitCount;
                                        }

                                        // 更新当前选中的学生的表头
                                        if (new_student.Desc != source_student.Desc) {
                                            if ($("#studentlist_container .listbox").find("li.ljlactive").length > 0) {
                                                MonitorClass.updateStudentDetails(new_student);
                                            }
                                        }
                                        //找到了, 处理完成后,就跳出循环
                                        continue;
                                    }
                                }

                            }
                        }
                        //处理完动画后,保留最新的结构. 以待点击时再更新
                        source_studentlist_animate = [];
                        source_studentlist_animate["class_" + obj.classid] = info.data;
                        classStudentsList_animate = [];
                        classStudentsList_animate["class_" + obj.classid] = student_category;

                        let status = $("#student_current_filter_status").val();
                        MonitorClass.filterStudentList(status);

                        //根据之前的选中状态,保持选中的样式
                        if ($("#current_all").val() == 2) {
                            let stuid = $("#current_studentid").val();
                            let stuitem = $("#studentlist_container a[data-studentid=" + stuid + "]");
                            if (stuitem.length > 0) {

                                $('.content19 li').addClass('lihover').removeClass('ljlactive');
                                stuitem.closest("li").addClass('ljlactive').removeClass('lihover');
                            }
                        }
                        else {
                            //$('.content19 li').addClass('lihover').removeClass('ljlactive');
                            $("#studentlist_container .student_title").addClass('ljlactive').removeClass('tithover');
                        }



                        $('.content5 .niceScrollbox').getNiceScroll().resize();

                    }
                }
            });
        }

    },

    flushClassAndStudents: function () {
        this.classChangeHandler();
        this.studentListChangeHandler();
        this.HandleExpireMsg();
        this.getCurrentMessages();
        this.flushClassDelay();
    },

    //离下课不足30分钟时, 显示延迟下课按钮 .
    flushClassDelay: function () {
        if ($(".classcontainer .ljlactive").length > 0) {
            let endtime = $(".classcontainer .ljlactive").find(".dataitem").attr("data-end");
            let endHour = endtime.split(":")[0];
            let endMinute = endtime.split(":")[1];

            let currentDate = new Date();
            let thisDate = new Date();

            thisDate.setHours(endHour);
            thisDate.setMinutes(endMinute);

            let currentMicroSecond = currentDate.getTime();
            let planMicroSecond = thisDate.getTime()

            let dateDiff = planMicroSecond - currentMicroSecond; // 相差的毫秒数

            let minutes = Math.floor(dateDiff / (60 * 1000));// 计算剩余的分钟数

            if (minutes <= 30 && $(".classcontainer li.ljlactive").find(".dataitem ").attr("data-delay") == 0) {
                $(".yanchixiake").show();
            }
            else {
                $(".yanchixiake").hide();
            }
        }
    },

    //定时处理超过15分钟未处理的消息 和 个人基本信息的刷新
    HandleExpireMsg: function () {
        let current_all = $("#current_all").val();
        let current_classid = $("#current_classid").val();
        let current_studentid = $("#current_studentid").val();
        let current_moduletype = $("#current_moduletype").val();


        if (current_all == 1) {
            //全体学生
            if (typeof classAllMsg["class_" + current_classid] != "undefined" && classAllMsg["class_" + current_classid] != null) {
                let msg_stuct = classAllMsg["class_" + current_classid];
                let old_class_list = classAllMsg["source_class_" + current_classid];
                //判断下是否有超过15分钟未处理的预警消息, 如果有的话, 则处理后重新构造界面
                var isHaveExpireMsg = MonitorClass.doAllocAllMessage(current_classid, old_class_list);
                if (isHaveExpireMsg) {
                    console.log("全体学生 - 有超过15分钟的消息");;
                    MonitorClass.buildClassMessageHtml(current_classid);
                }
            }
        }
        else if (current_all == 2) {
            $.ajax({
                async: false,
                type: "post",
                datatype: "json",
                url: MonitorClass.AsynUrls.url_GetStudentMonitorDetail,
                data: {
                    SchoolID: $("#hidden_schoolid").val(),
                    ClassID: current_classid,
                    StudentID: current_studentid,
                    corseid: $("#current_courseid").val(),
                    NewestMsgId: ""
                },
                success: function (info) {
                    if (info.code == 200) {
                        if (info.data.result != null) {
                            var student = info.data.result;

                            //更新缓存的学生信息.
                            //let student_category = source_studentlist["class_" + current_classid]
                            //if (student_category != undefined && student_category.Students.length > 0) {
                            //    //在已有的结构中找到那个学生
                            //    for (let i = 0; i < student_category.Students.length; i++) {
                            //        if (student_category.Students[i].StudentID == current_studentid) {
                            //            student_category.Students[i] = student; //更新
                            //            break;
                            //        }
                            //    }
                            //}


                            //更新界面元素
                            let headsrc = (student.Head == undefined || student.Head == "") ? "/Content/images/boy.png" : student.Head;
                            $(".head_student_attention").attr("studentid", student.StudentID);
                            $(".head_student_name").text(student.StudentName);
                            $(".head_student_desc").text(student.Desc);
                            $(".head_student_head").attr("src", headsrc);
                            $(".head_student_level").html(MonitorClass.buildLevelImgHtml(student.Level));
                            if (student.OnlineDuration > 0) {
                                $(".head_student_duration").text(parseInt(student.OnlineDuration / 60)); //在线时长-分
                                if (student.OnlineDuration < 60) {
                                    $(".head_student_duration_second").text(student.OnlineDuration); //在线时长-秒
                                }
                                else {
                                    $(".head_student_duration_second").text(parseInt(student.OnlineDuration % 60)); //在线时长-秒
                                }

                            }
                            else {
                                $(".head_student_duration").text("0");
                                $(".head_student_duration_second").text("0");
                            }
                            $(".head_student_answercount").text(student.AllAnswerCount); //已作答提数
                            $(".head_student_accuracy").text(student.Accuracy + "%"); //正确率
                            $(".head_student_light").attr("src", MonitorClass.getStudentLight(student.Accuracy));

                        }
                    }
                }
            });

            let msg_stuct = studentMessageList["student_" + current_classid + "_" + current_studentid];
            let old_student_list = studentMessageList["source_student_" + current_classid + "_" + current_studentid];

            //单个学生
            if (typeof msg_stuct != "undefined" && msg_stuct != null) {


                //判断下是否有超过15分钟未处理的预警消息, 如果有的话, 则处理后重新构造界面
                var isHaveExpireMsg = MonitorClass.doAllocMessage_student(current_classid, current_studentid, old_student_list);
                if (isHaveExpireMsg) {
                    console.log("单个学生 - 有超过15分钟的消息-开始重新构造个人区域界面");
                    MonitorClass.buildStudentMessageHtml(current_classid, current_studentid);
                }

            }

        }



    }

}

var videoHelp = {
    videoList: new Array(),
    loadVideo: function (videoUrl, container, id) {
        var newVideoObject = {
            container: container, //容器的ID或className
            variable: 'player', //播放函数名称
            //loaded: 'loadedHandler', //当播放器加载后执行的函数
            loop: true, //播放结束是否循环播放
            config: '', //指定配置函数
            debug: true, //是否开启调试模式
            drag: 'start', //拖动的属性
            seek: 0, //默认跳转的时间
            video: videoUrl
        }
        var player = new ckplayer(newVideoObject);
        var obj = {};
        obj.id = id;
        obj.player = player;
        this.videoList.push(obj)
    }
}

var classChangeTask, studentListChangeTask, currentTask;

$(document).ready(function () {
    MonitorClass.Init();
    //当前学生列表的变化
    //studentListChangeTask = setInterval("timerTask.studentListChangeHandler()", 1000 * 10);
    //班级列表的变化
    //classChangeTask = setInterval("timerTask.classChangeHandler()", 1000 * 3);

    //班级列表和学生列表同时刷
    classChangeTask = setInterval("timerTask.flushClassAndStudents()", 1000 * 5);

    //获取当前的最新消息
    //currentHandler = setInterval("timerTask.getCurrentMessages()", 1000 * 8);
});
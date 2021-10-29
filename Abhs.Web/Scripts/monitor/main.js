/*
autor: 孟凡博
email: mengfanbo-41@163.com
createdate: 2020年12月1日
updatedate: 2021年2月24日
description: 课中监控的页面构建和动态效果
*/

var studentMessageList = [];

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
        url_getStudentDetails: "/api/message/getstudentmsg", //获取单个学生的学情
        url_GetStudentNewMsg: "/api/message/getstudentnewmsg",
        url_HandleMessage: "/api/message/handle", //处理消息
        url_GetOnlineStudentsByCorseid: "/api/message/getonlinestudents/{corseid}",
        url_GetStudentMonitorDetail: "/api/message/getstudentdetail",
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
        this.monitorWin();
    },
    bindBeforeEventHandler: function () {
        var that = this;

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
            let studentid = $(this).data("studentid");

            let parentBox = $(this).closest(".userinfobox");

            let student = null;

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
        
        //提问滑动弹窗里的 - 全部忽略
        $(".btn_neglect_all").click(function () {
            MonitorClass.dealAllMsg($(this), 2);
        });

        ////提问滑动弹窗里的 - 全部呼叫
        $(".btn_call_all").click(function () {
            MonitorClass.dealAllMsg($(this), 1);
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
    getStudentDetails: function () {
        var that = MonitorClass;
        let studentid = $("#current_studentid").val();


        $.ajax({
            async: true,
            type: "post",
            datatype: "json",
            url: MonitorClass.AsynUrls.url_getStudentDetails + "?studentId=" + studentid,
            success: function (info) {
                if (info.code == 200) {
                    // 加载头部. 当前选中的学生的总体详情
                    //加载消息区域
                    if (info.data.result != null && info.data.result.length > 0) {
                        let msgList = info.data.result;

                        studentMessageList["source_student_" + studentid] = msgList;

                        that.doAllocMessage_student(studentid, msgList);

                        that.buildStudentMessageHtml(studentid);
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
    doAllocMessage_student: function (studentid, msgList) {

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
    },

    //------------------HTML-----------------单个学生-消息区域
    buildStudentMessageHtml: function (studentid) {

        let msg_stuct = studentMessageList["student_" + studentid];

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
                });
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
                    }
                });

                //最后一条消息, 表示最新的一条数据,用蓝色的点
                $(".student_all_container").find(".ljlshowbox").eq(0).find(".ljlcnt .lineinfo").eq(0).removeClass("dotcolor_grey").addClass("dotcolor_blue").addClass("dotcolorbig_blur");

            }

           // 学情组的展开 收缩
            $('.student_all_container .ljlshowbox .list1 .cnttext').click(function () {
                $(this).find('.categoryname').toggleClass('degspan');
                $(this).parents('.ljlshowbox').find('.ljlcnt').slideToggle(function () {
                    $('.content8 .niceScrollbox').getNiceScroll().resize();
                });
            });

            // 警报组的展开 收缩
            $('.student_warning_container .list1 .cnttext').click(function () {
                $(this).find('.categoryname').toggleClass('degspan');
                $(this).parents('.ljlshowbox').find('.ljlcnt').slideToggle(function () {
                    $('.content8 .niceScrollbox').getNiceScroll().resize();
                });
            });

            // 问答组的展开 收缩
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
    doAllocNewMessage_student: function (studentid, newMsgList) {
        var old_student_list = studentMessageList["source_student_" + studentid];
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
        let studentid = obj.find(".dataitem").data("studentid");

        //let parentname = obj.closest("div.listbox").attr("category");
        //let parentkey = obj.closest("div.listbox").attr("key");

        if (false) {
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
                    let source_student_stuct = studentMessageList["source_student_" + studentid];
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
                    let student_stuct = studentMessageList["student_" + studentid];

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

    flushClassAndStudents: function () {

        console.log("time");

        this.getCurrentMessages();  
    },

   //定时任务-获取当前的最新消息
    getCurrentMessages: function () {

        let current_studentid = $("#current_studentid").val();
        let current_moduletype = $("#current_moduletype").val();

        var msg_stuct = studentMessageList["student_" + current_studentid];


        //单个学生监控时的最新消息获取
        if (typeof msg_stuct != "undefined" && msg_stuct != null) {

            $.ajax({
                async: true,
                type: "post",
                datatype: "json",
                url: MonitorClass.AsynUrls.url_GetStudentNewMsg + "?studentId=" + current_studentid + "&newestMsgId=" + msg_stuct.newest,
                success: function (info) {
                    if (info.code == 200) {

                        console.log(info);

                        if (info.data.result != null && info.data.result.length > 0) {
                            let msgList = info.data.result;

                            //更新js本地缓存
                            MonitorClass.doAllocNewMessage_student(current_studentid, msgList);

                            //重新构造缓存结构体
                            var old_student_list = studentMessageList["source_student_" + current_studentid];

                            console.log(studentMessageList);
                            console.log("source_student_" + current_studentid);

                            MonitorClass.doAllocMessage_student(current_studentid, old_student_list);

                            //重新构造界面
                            MonitorClass.buildStudentMessageHtml(current_studentid);
                        }
                    }
                }
            });

        }
    }
}

$(document).ready(function () {
    MonitorClass.Init();

    //班级列表和学生列表同时刷
    setInterval("timerTask.flushClassAndStudents()", 1000 * 5);

    InitStudent();
});

// 开始学生的学情获取
function InitStudent()
{
    $('.content8 .niceScrollbox').getNiceScroll().resize();
    $('.content8 .niceScrollbox').animate({
        scrollTop: 0
    }, 300);


    MonitorClass.getStudentDetails();

    console.log(studentMessageList);

    $("#current_moduletype").val(1);


    //判断是否显示今日错题
    if ($(".dangexuesheng .content23 .contbox .conttab a").eq(3).hasClass('ljlactive') > 0) {
        MonitorClass.getStudentTodayWrongQuestion();
    }
    //构建学生基本信息
    MonitorClass.buildStudentDetails($(this));

    //console.log(studentMessageList);
}
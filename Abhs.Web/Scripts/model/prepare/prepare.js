
//初始化
function Init() {
    //滚动条
    ScrollInit();
    //加载我的班级
    LoadMyClass(0);
    //绑定默认样式
    PrepareStyleInit();   
}
//参数初始化
function ArgsInit() {
    stepNum = 0;
    stepObj = {};
    curClassId = 0;
    curPackId = 0;
    curLessonId = 0;
    curPrepareId = 0;
    isEnd = false;
}
//备课样式初始化，默认错题巩固
function PrepareStyleInit() {
    //$(".stepTitle").html("第1步：错题巩固，可根据实际教学情况在1〜10题之间设置。")
    //错题巩固
    $(".content10").show();
    //$("#saveBtn").off('click').on("click", function () {
    //    SaveMistakes();
    //});
    $("#stepNext1").off('click').on("click", function () {
        SaveMistakes();
    });
    //智能学习
    $(".content12").hide();
    //查漏补缺
    $(".content13").hide();  
    $("#saveLearnBtn").off('click').on("click", function () {
        SaveLearnFilling();
        //$(this).removeClass("ljlactive");
    });
}
//加载我的班级
function selectGrade(grade, obj) {
    var text = $(obj).text();
    $(".content4 .ljltitle .selectclass").find('span').text(text);
    curGrade=grade;
    ArgsInit();
    LoadMyClass(0)
}
function LoadMyClass(loadLesson) {
    $.ajax({
        url: '/Prepare/GetAllMyClass',
        type: "post",
        data: { grade: curGrade },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                $(".content9").show();
                //$(".content10").show();
                $(".content65").hide();
                //加载班级列表
                var selectObj = BindClassStyle(encodeURI(JSON.stringify(data.data)));
                //大于0只刷新班级列表
                if (loadLesson == 0 || $("#lessonList").html()=='') {
                    //加载选定信息
                    LoadClassInfo(encodeURI(JSON.stringify(selectObj)))
                   
                }                              
                //绑定事件
                BindClassListLI();
            } else {
                $(".content9").hide();
                $(".content10").hide();
                $(".content65").show();
                $("#classList").empty();
                $("#classList").html('<ul><li class="ljldatatext"><div class=\"labelkc\">没有班级</div></li></ul>');
                $("#lessonList").empty();
                $("#lessonList").html('<ul><li class="ljldatatext"><div class=\"labelkc\">没有课时</div></li></ul>');
                
                //$("#lessonList").empty();
                $("#lastTime").html('');
                //layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            layer.msg("Err:" + JSON.stringify(errorMsg));
        },
        complete: function (XMLHttpRequest, status) {
        }
    });
}
//加载选定信息
function LoadClassInfo(obj) {
    var data = JSON.parse(decodeURI(obj));
    curClassId = data.classId;
    var text = data.benginTime;
    if (text != null && text != "") {
        text = "下次上课：" + text
    }
    var html="<span class=\"fl\">课时</span>" + text;
    $(".content92").hide();
    //加载默认课时列表
    GetLesson(curClassId, html);
}
//班级DOM操作
function BindClassStyle(obj) {
    var data = JSON.parse(decodeURI(obj));
    var selectData = {};
    var classTemp = $("#classListTemp").html();
    var html = "<ul>";
    $(data).each(function (index, element) {
        var t0 = "lihover", t1 = "", t2 = "", t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = "";
        t0 = (curClassId == 0 && element.isSelect == 1) || (curClassId > 0 && curClassId == element.classId) ? "ljlactive" : t0;
        t1 = element.isMust == 0 ? "<span class=\"line1 normalspan\">" + element.className + "</span>" : "<span class=\"warn\"><label class=\"line1\">" + element.className + "</label>";
        t2 = element.prepareing > 0 ? "" : (element.isMust == 1 ? "<i class=\"redwarn\">备</i></span>" :"");
        t3 = element.prepareing;
        t4 = element.wait;
        t5 = element.finish;
        t6 = element.classId;
        t7 = element.prepareing > 0 ? "<div class=\"classstatus\">备课中</div>" : "";
        //if (element.prepareing == -1) {
        //    t7 = "<div class=\"classstatus\">已下架</div>";
        //}
        var temp = classTemp;
        temp = temp.replace("{0}", t0);
        temp = temp.replace("{1}", t1);
        temp = temp.replace("{2}", t2);
        temp = temp.replace("{3}", t3);
        temp = temp.replace("{4}", t4);
        temp = temp.replace("{5}", t5);
        temp = temp.replace("{6}", t6);
        temp = temp.replace("{7}", t7);
        var htm = element.benginTime;
        if (htm != null && htm != "") {
            htm = "下次上课：" + htm
        }
        var htmls = `<span class='fl'>课时</span>` + htm;
        temp = temp.replace("{8}", htmls);
        html = html + temp;
        //设置选定对象
        if (t0 == "ljlactive") {
            selectData = element;
        }
    })
    html = html + "</ul>";
    if (data.length > 0) {
        $("#classList").html(html)
    } else {
        $("#classList").html('<ul><li class="ljldatatext"><div class=\"labelkc\">没有课程</div></li></ul>')
    }
    //刷新滚动条
    $('.content4 .niceScrollbox').getNiceScroll().resize();
    return selectData;
}
//班级列表事件绑定
function BindClassListLI() {
    $('.content16 li').click(function () {
        $(this).removeClass('lihover');
        $(this).siblings().addClass('lihover');
        $(this).siblings().removeClass('ljlactive');
        $(this).addClass('ljlactive');
    })
}
//课时列表
function GetLesson(id, html) {
    $("#lastTime").html(html);
    //切换班级，参数初始化
    if(id!=curClassId)
       ArgsInit();
    //切换班级，样式初始化
    PrepareStyleInit();
    var winIndex = 0;
    $.ajax({
        url: '/Prepare/GetAllClassLesson',
        type: "post",
        dataType: "json",
        data: { classId: id },
        beforeSend: function () {
            winIndex = layer.load(1, {
                shade: [0.5, '#fff'] //0.1透明度的白色背景
            });
        },
        success: function (data) {
            if (data.code == 200) {
                curClassId = id;
                //加载课时列表样式，返回默认选定的课时
                var selectObj = BindLessonStyle(encodeURI(JSON.stringify(data.data)));
                
                //加载默认课时
                LoadLessonInfo(encodeURI(JSON.stringify(selectObj)));
         
                //绑定点击效果
                BindLessonListLI();

            } else {
                layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            layer.msg("Err:" + JSON.stringify(errorMsg));
        },
        complete: function (XMLHttpRequest, status) {
            layer.close(winIndex);
        }
    });
}
//操作课时列表dom
function BindLessonStyle(obj) {
    var data = JSON.parse(decodeURI(obj));
    var selectData = {};
  
    var first = 0; //第一个未备课可点击，其他不可以
    $("#lessonList").empty();
    if (data.length > 0) {
        $("#lessonList").append("<ul></ul>");
    }
    $(data).each(function (index, element) {
        //是否有学生学习
        var isStudy = element.desc != null && element.desc != "";
        //模板选择
        var temp = $("#lessonListTemp").find('li')[0].cloneNode(true);
        $(temp).show();
        $(temp).removeAttr('id');
        var t0 = "", t1 = "", t2 = "", t3 = "", t4 = "", t5 = "",t6=""
        if (element.status == 1) {
            t0 ="defbox lihover";
        } else {
            t0 = first == 0 ? "defbox lihover" : "defbox defcolor";
            first++;
        }
        if (element.lessonStatus != "") {
            t0 = "defbox defcolor";
        }
        if ((index == 0 && curLessonId == 0) || (curLessonId > 0 && curLessonId == element.lessonId))
            t0 = (t0 + " ljlactive").replace("lihover", "");
        $(temp).addClass(t0);
        if (t0.indexOf("defcolor") == -1 && element.status!=-1) {
            $(temp).find('a').attr('xp', JSON.stringify(element))
            if (element.lessonType !=3) {
                $(temp).find('a').off('click').on('click', function () {
                    GetLessonItem(JSON.parse($(this).attr('xp')))
                })
            } else {
                $(temp).find('a').off('click').on('click', function () {
                    GetTest(JSON.parse($(this).attr('xp')))
                })
            }
        }
        else {
            $(temp).find('a').addClass('ljl_tooltip');
            var title = '';
            if (element.lessonStatus != "") {
                title="课程制作中";
            } else {
                title = "请按顺序备课";
            }
            if (element.status== -1)
                title = "课程已下架";
            $(temp).find('a').attr('title', title);
        }
        $(temp).find('.ltitle label').text('第' + element.index+ '课时:')
        t3 = element.lessionTitle;
        $(temp).find('.ltitle strong').text(t3)
        t4 = '第' + element.index + '课时:' + t3;
        $(temp).find('.hidebox').text(t4)
        t5 = element.status == 0 ? "" : (element.status == 2 ? "preparedLessons" : "Lessons");
        if(t5!="")
            $(temp).find('span').addClass(t5)       
        t6 = element.statusName;
        $(temp).find('span').text(t6);
        $("#lessonList ul").append($(temp)[0]);
        //设置选定对象
        if ((index == 0 && curLessonId == 0) || (curLessonId > 0 && element.lessonId == curLessonId)) {
            selectData = element;
        }
    })
 
   
    countLiTwo()
    return selectData;
}
//课时列表事件
function BindLessonListLI() {
    
    $('.content5 .niceScrollbox').getNiceScroll().resize();
    prepareTip();
    $('.content17 li').click(function () {
        if ($(this).attr('class').indexOf('defcolor') < 0) {
            $('.content17 li').removeClass('lihover').removeClass('ljlactive')
            $(this).addClass('ljlactive');
        }             
    })
}
function countLiTwo(){
    $.each($('.content17 li'),function(){
        var hgt=$(this).find('.hidebox').height();
        if(hgt>30){
            $(this).addClass('listtwo')
        }
    })
}
//加载课时
function LoadLessonInfo(obj) {
    var data = JSON.parse(decodeURI(obj));
    if (data.lessonType != 3) {
        //加载默认课时列表
        GetLessonItem(data);
    } else {
        GetTest(data)
    }
}
//默认样式
function DefaultStyle() {
    $(".content9 .contitle").empty();
    //$("#saveBtn").unbind("click");
    BtnInitStyle(-1);
}
//课时内容
function GetLessonItem(prepare) {
    var str = JSON.stringify(prepare)
    if (str == "{}") {
        DefaultStyle();
        return;
    }
    isEnd = false;
    stepObj = {};
    //curLessonId = 0;
    curPrepareId = 0;
    stepNum = 0;
    //先赋值头部信息
    $(".stepTitle").show();
    $(".stepbox").show();
    $(".content9").show();
    $(".content7 a").show();
    $(".content92").hide();
    var temp = $("#contitleTemp").html();
    temp = temp.replace("{0}", prepare.index);
    temp = temp.replace("{1}", prepare.lessionTitle+prepare.lessonStatus);
    temp = temp.replace("{2}",prepare.statusName!=""?("<em " + (prepare.status == 2? "" : "class=\"haslessons\"") + ">" + prepare.statusName + "</em>"):"");
    temp = temp.replace("{3}", prepare.desc != null && prepare.desc != "" ? " <span>(" + prepare.desc + ")</span>" : (prepare.status == 1 ? "<a href=\"#\" onclick=\"Repeat()\">再次备课</a>" : ""));
    $(".content9 .contitle").html(temp)
    $("#stepNext1").hide();
    if (prepare.lessonStatus != "制作中"&&prepare.statusName!="已备课") {
        
       $("#stepNext1").show();
    }
    if (prepare.status == -1) {
        $("#stepNext1").hide();
        $("#classList ul li.ljlactive").remove('.classstatus')
        return;
    }
    var winIndex = 0;
    $.ajax({
        url: '/Prepare/GetLessonItem',
        type: "post",
        dataType: "json",
        beforeSend: function () {
            winIndex = layer.load(1, {
                shade: [0.5, '#fff'] //0.1透明度的白色背景
            });
        },
        data: { classId: prepare.classId, lessonId: prepare.lessonId, prepareId:prepare.prepareId },
        success: function (data) {
            //加载完成
            isLoad = true;
            if (data.code == 200) {
                curLessonId = prepare.lessonId
                curPrepareId = prepare.prepareId
                curPackId = prepare.packId;
                stepObj = data.data.step
                subModelBeginTime = data.data.beginTime;
                   
                //绑定事件
                BindStepClick();
                //绑定页面元素
                PrepareDetail(JSON.stringify(data.data))
                //按钮初始化
                BtnInitStyle(-1);
                //绑定题型点击记录
                BindQuestionLog();

                // 重新渲染
                //MathJax.typeset();
                //ShowInput3()
                MathJax.typesetPromise().then(() => {
                    ShowInput3();
                    //MathJax.typesetPromise();
                }).catch((err) => console.log(err.message));
                if (stepObj.learnFilling == 1) {
                    prepare.status = 1
                    prepare.statusName = "已备课";
                } else {
                    if (stepObj.mistakes == 1) {
                        prepare.status = 2
                        prepare.statusName = "备课中";
                    }
                }

                var temp = $("#contitleTemp").html();
                temp = temp.replace("{0}", prepare.index);
                temp = temp.replace("{1}", prepare.lessionTitle + prepare.lessonStatus);
                temp = temp.replace("{2}", prepare.statusName != "" ? ("<em " + (prepare.status == 2 ? "" : "class=\"haslessons\"") + ">" + prepare.statusName + "</em>") : "");
                temp = temp.replace("{3}", prepare.desc != null && prepare.desc != "" ? " <span>(" + prepare.desc + ")</span>" : (prepare.status == 1 ? "<a href=\"#\" onclick=\"Repeat()\">再次备课</a>" : ""));
                $(".content9 .contitle").html(temp)
                   
            } else {
                layer.msg(data.message);
            }
            TeacherKeepLive();
        },
        error: function (errorMsg) {
            layer.msg("Err:" + JSON.stringify(errorMsg));
        },
        complete: function (XMLHttpRequest, status) {
            layer.close(winIndex);
        }
    });
}

//考试课
function GetTest(prepare) {
    $(".content10").hide();
    $(".content12").hide(); 
    $(".content13").hide();
    $(".content92").show();
    $(".stepTitle").hide(); 
    $(".stepbox").hide();
    $(".content7 a").hide();
    curLessonId = prepare.lessonId;
    curPrepareId = prepare.prepareId;
    var temp = $("#contitleTemp").html();
    temp = temp.replace("{0}", prepare.index);
    temp = temp.replace("{1}", prepare.lessionTitle + prepare.lessonStatus);
    temp = temp.replace("{2}", prepare.statusName != "" ? ("<em " + (prepare.status == 2 ? "" : "class=\"haslessons\"") + ">" + prepare.statusName + "</em>") : "");
    temp = temp.replace("{3}", prepare.desc != null && prepare.desc != "" ? " <span>(" + prepare.desc + ")</span>" : (prepare.status == 1 ? "<a href=\"#\" onclick=\"Repeat()\">再次备课</a>" : ""));
    //temp = temp.replace("{3}", prepare.desc != null && prepare.desc != "" ? " <span>(" + prepare.desc + ")</span>" : (prepare.status == 1 ? "" : ""));
    $(".content9 .contitle").html(temp);
    $.ajax({
        url: '/Prepare/GetLessonTest',
        type: "post",
        dataType: "json",
        beforeSend: function () {
            winIndex = layer.load(1, {
                shade: [0.5, '#fff'] //0.1透明度的白色背景
            });
        },
        data: { classId: prepare.classId, lessonId: prepare.lessonId, prepareId: prepare.prepareId },
        success: function (data) {
            //加载完成
            isLoad = true;
            if (data.code == 200) {
                curLessonId = prepare.lessonId
                curPrepareId = prepare.prepareId
                curPackId = prepare.packId;
                 
                subModelBeginTime = data.data.prepareTime;
                var prepareTime = pageBeginTime;
                var prepareTeacher = teacherName;
                var prepareProcess = '0%';
                if (data.data.prepareTime != null && data.data.prepareTime != "") {
                    prepareTime = data.data.prepareTime
                    prepareTeacher = data.data.prepareTeacher;
                }
                if (data.data.prepareProcess != null && data.data.prepareProcess != "") {
                    prepareProcess = data.data.prepareProcess;
                }
                if (prepareProcess == '0%')
                    $(".content92 .btns a").removeClass('defa');
                else {
                    $(".content92 .btns a").addClass('defa');
                    $('.changeobj').hide();
                }
                var config=data.data.config;
                $(".examinationtitle").text(config.TestTitle);
                var warnText = "本试卷满分" + config.TestScore + "分";
                warnText = warnText + "，考试时间" + config.TestTime + "分钟";
                testCourseTime = config.TestTime;
                $(".content92 warn1").text("1、" + warnText);
                warnText = "本次考试" + (config.IsNull == 1 ? "" : "不") + "可空题";
                warnText = warnText + "，" + config.MinTime + "分钟内不可交卷";
                $(".content92 warn2").text("2、" + warnText);
                $('#selectQuestion').text('一、选择题（' + data.data.selectDesc + '）');
                $('#spaceQuestion').text('二、填空题（' + data.data.spaceDesc + '）');
                $('#answerQuestion').text('三、解答题（' + data.data.answerDesc + '）');
                if (data.data.selectDesc == '') {
                    $('#selectQuestion').hide();
                    $('#selectContent').hide();
                } else {
                    $('#selectQuestion').show();
                    $('#selectContent').show();
                }
                if (data.data.spaceDesc == '') {
                    $('#spaceQuestion').hide();
                    $('#spaceContent').hide();
                } else {
                    $('#spaceQuestion').show();
                    $('#spaceContent').show();
                }
                if (data.data.answerDesc == '') {
                    $('#answerQuestion').hide();
                    $('#answerContent').hide();
                } else {
                    $('#answerQuestion').show();
                    $('#answerContent').show();
                }
                $("#prepareInfo").html(" <i>备课时间：</i>" + prepareTime.substr(0, 16) + "丨<i>备课老师：</i>" + prepareTeacher + "丨<i>备课进度：</i><span class=\"preprocess\">" + prepareProcess + "</span>");
                $("#prepareInfo1").html($("#prepareInfo").html());
                $(".content92 .itemlist").remove()
                var itemIndex = 1;
                $(data.data.selectList).each(function (index, element) {
                    var ele = getNode(element, itemIndex);
                    itemIndex = itemIndex + 1;
                    $("#selectContent").append(ele);
                })
               
                $(data.data.spaceList).each(function (index, element) {
                    var ele = getNode(element, itemIndex);
                    itemIndex = itemIndex + 1;
                    $("#spaceContent").append(ele);
                })
                $(data.data.answerList).each(function (index, element) {
                    var ele = getNode(element, itemIndex);
                    itemIndex = itemIndex + 1;
                    $("#answerContent").append(ele);
                })
            
                MathJax.typesetPromise().then(() => {
                    ShowInput3();
                    $('.content8 .niceScrollbox').getNiceScroll().resize();
                }).catch((err) => console.log(err.message));
                $('.content92 .showorhide').click(function () {
                    $(this).find('span').toggleClass('degspan');
                    $(this).parents('.itemlist').find('.errorsubjectanalysis').slideToggle(function () {
                        $('.content8 .niceScrollbox').getNiceScroll().resize();
                    });
                })
            } else {
                layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            layer.msg("Err:" + JSON.stringify(errorMsg));
        },
        complete: function (XMLHttpRequest, status) {
            layer.close(winIndex);
        }
    });
   
}
function getNode(element, itemIndex) {
    var wrongTemp = $("#testquestiontemp")[0];
    var temp = wrongTemp.cloneNode(true);
    $(temp).removeAttr("id");
    $(temp).show();
    $(temp).find(".config").find('img').remove();
    $(temp).find(".config label").after(getLevel(element.level));
    if (element.knowName != null && element.knowName != "") {
        $(temp).find(".config span").text("知识点：" + element.knowName);
    }
    if (element.typeName != null && element.typeName != "") {
        $(temp).find(".config span").text("题型：" + element.typeName);
    }
    $(temp).find(".config span").after('<em>|</em><span>分数：' + element.score + '分</span>')
    $(temp).find(".optiontitle .indexnum").attr("qid", element.qid);
    $(temp).find(".optiontitle .indexnum").html("【" + itemIndex + "】");
    $(temp).find(".optiontitle .indexnum").after(element.qTitle);
    $(temp).find(".optionlist").empty();

    if (element.qType == 1) {
        // $(temp).find(".studentsanswer").html("学生答案：" + element.studentAnswer);
        if (element.optionA != null && element.optionA != "")
            $(temp).find(".optionlist").append('<div class="optionitem"><label>A：</label> <div class="optioncont">' + element.optionA + '</div></div>');
        if (element.optionB != null && element.optionB != "")
            $(temp).find(".optionlist").append('<div class="optionitem"><label>B：</label><div class="optioncont">' + element.optionB + '</div></div>');
        if (element.optionC != null && element.optionC != "")
            $(temp).find(".optionlist").append('<div class="optionitem"><label>C：</label><div class="optioncont">' + element.optionC + '</div></div>');
        if (element.optionD != null && element.optionD != "")
            $(temp).find(".optionlist").append('<div class="optionitem"><label>D：</label><div class="optioncont">' + element.optionD + '</div></div>');
        if (element.optionE != null && element.optionE != "")
            $(temp).find(".optionlist").append('<div class="optionitem"><label>E：</label><div class="optioncont">' + element.optionE + '</div></div>');

    } else {

    }
    $(temp).find(".subjectanalysistext").html(element.answerExplain);
    if (element.qType != 3) {
        $(temp).find(".changeobj").off('click').on('click', function () {
            confirmChange(element.qid, $(this)[0])
        });
    } else {
        $(temp).find(".changeobj").remove();
    }
    return $(temp)[0];
}
function confirmChange(qid,obj) {
    var winIndex = layer.confirm('确认要更换题目吗？', {
        btn: ['否', '是'] //按钮
    }, function () {
        layer.close(winIndex);
    }, function () {
        changeQuestion(qid,obj)
    });
}
function changeQuestion(qid,obj) {
    $.ajax({
        url: '/Prepare/ChangeTestCourse',
        type: "post",
        dataType: "json",
        data: { qid: qid, classId: curClassId, lessonId: curLessonId ,beginTime: subModelBeginTime},
        beforeSend: function () {
            winIndex = layer.load(1, {
                shade: [0.5, '#fff'] //0.1透明度的白色背景
            });
        },
        success: function (data) {
            if (data.code == 200) {
                var element = data.data;
                if (element == null)
                    return;
                layer.msg("换题成功", { icon: 1, time: 1000 }, function () {
                    console.log(element.qid)
                    var temp = $(obj).parents('.itemlist')
                   
                    //$(temp).find(".config").find('img').remove();
                    //$(temp).find(".config label").after(getLevel(element.level));
                    //if (element.knowName != null && element.knowName != "") {
                    //    $(temp).find(".config span").text("知识点：" + element.knowName);
                    //}
                    //if (element.typeName != null && element.typeName != "") {
                    //    $(temp).find(".config span").text("题型：" + element.typeName);
                    //}
                    var titleTempNode = temp.find(".optiontitle .indexnum")[0];
                    var titleNode = titleTempNode.cloneNode(true);
                    temp.find(".optiontitle").empty();
                    temp.find(".optiontitle").append(titleNode);
                    temp.find(".optiontitle .indexnum").attr("qid", element.qid);
                    //$(temp).find(".optiontitle .indexnum").html("【" + itemIndex + "】");
                    temp.find(".optiontitle .indexnum").after(element.qTitle);
                    temp.find(".optionlist").empty();

                    if (element.qType == 1) {
                        // $(temp).find(".studentsanswer").html("学生答案：" + element.studentAnswer);
                        if (element.optionA != null && element.optionA != "")
                            temp.find(".optionlist").append('<div class="optionitem"><label>A：</label> <div class="optioncont">' + element.optionA + '</div></div>');
                        if (element.optionB != null && element.optionB != "")
                            temp.find(".optionlist").append('<div class="optionitem"><label>B：</label><div class="optioncont">' + element.optionB + '</div></div>');
                        if (element.optionC != null && element.optionC != "")
                            temp.find(".optionlist").append('<div class="optionitem"><label>C：</label><div class="optioncont">' + element.optionC + '</div></div>');
                        if (element.optionD != null && element.optionD != "")
                            temp.find(".optionlist").append('<div class="optionitem"><label>D：</label><div class="optioncont">' + element.optionD + '</div></div>');
                        if (element.optionE != null && element.optionE != "")
                            temp.find(".optionlist").append('<div class="optionitem"><label>E：</label><div class="optioncont">' + element.optionE + '</div></div>');

                    } else {

                    }
                    temp.find(".subjectanalysistext").html(element.answerExplain);
                    temp.find(".changeobj").off('click').on('click', function () {
                        confirmChange(element.qid, $(this)[0]);
                    });

                    MathJax.typesetPromise();

                    ShowInput3();

           
                    $('.content8 .niceScrollbox').getNiceScroll().resize();
                });
            } else {
                layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            layer.msg("Err:" + JSON.stringify(errorMsg));
        },
        complete: function (XMLHttpRequest, status) {
            layer.close(winIndex);
        }
    });
}
var testCourseTime = 0;
function saveTestCourse() {
    if ($('.content92 .btns a').hasClass('defa'))
        return;
    var win = layer.confirm('根据备课内容，完成本课时学习预计需要：' + testCourseTime + '分钟。确定完成备课吗？', {
        btn: ['否', '是'] //按钮
    }, function () {
        layer.close(win);
    }, function () {
        var data = { classId: curClassId, lessonId: curLessonId, beginTime:subModelBeginTime, packId: curPackId }
        $.ajax({
            url: '/Prepare/SaveTestCourse',
            type: "post",
            dataType: "json",
            data:data ,
            beforeSend: function () {
                winIndex = layer.load(1, {
                    shade: [0.5, '#fff'] //0.1透明度的白色背景
                });
            },
            success: function (data) {
                if (data.code == 200) {
                    layer.msg("备课完成", { icon: 1, time: 1500 }, function () {
                        //加载课时列表样式，返回默认选定的课时
                        var prepare = BindLessonStyle(encodeURI(JSON.stringify(data.data)));
                        console.log(prepare)
                        //绑定点击效果
                        BindLessonListLI();
                        //unableBtn
                        $('.content92 .btns a').addClass('defa');
                        $('.changeobj').hide();
                        //状态改成备课完成
                        $(".content9 .contitle em").text("已备课").addClass("haslessons");
                        $(".content9 .contitle").html($(".content9 .contitle").html() + "<a href=\"#\" onclick=\"Repeat()\">再次备课</a>");
                        //刷出状态栏
                        SaveProcess(100)
                        //课时列表改成备课中
                        $("#lessonList .ljlactive span").html("已备课");
                        $("#lessonList .ljlactive span").removeClass("preparedLessons").addClass("Lessons");
                        //班级列表修改数量 
                        var Lessons = parseInt($("#classList .ljlactive .Lessons em").html()) + 1;
                        $("#classList .ljlactive .Lessons em").html(Lessons);
                        $("#classList .ljlactive .classstatus ").remove();
                    });
                } else {
                    layer.msg(data.message);
                    LoadMyClass(0);
                }
            },
            error: function (errorMsg) {
                layer.msg("Err:" + JSON.stringify(errorMsg));
            },
            complete: function (XMLHttpRequest, status) {
                layer.close(winIndex);
            }
        });

    });
}
function getLevel(level) {
    var html = "";
    for (var i = 0; i < 5; i++) {
        if (i < level) {
            html = html + '<img src="/Content/images/actstar.png" />';
        } else {
            html = html + '<img src="/Content/images/actstar1.png" />';
        }
    }
    return html;
}
//课时内容样式渲染
function PrepareDetail(prepare) {
    var obj = JSON.parse(prepare)
       
    var prepareTime = pageBeginTime;
    var prepareTeacher = teacherName;
    var prepareProcess = obj.prepareProcess;
    if (obj.prepareTime != "")
    {
        prepareTime = obj.prepareTime
        prepareTeacher = obj.prepareTeacher;
    }

    $("#prepareInfo").html(" <i>备课时间：</i>" + prepareTime.substr(0, 16) + "丨<i>备课老师：</i>" + prepareTeacher + "丨<i>备课进度：</i><span class=\"preprocess\">" + prepareProcess + "</span>");
    $("#prepareInfo1").html($("#prepareInfo").html());
    //错题巩固
    $("#mistakeCount").val(obj.mistakes)
    mistake = obj.mistakes;
    //智能提升
    var learnTemp = $("#queTemp")[0];
    $(".content12").empty();
    var html = "";
    var data = obj.learnList;

    $(data).each(function (index, element) {
        var temp = learnTemp.cloneNode(true);
        $(temp).show();
        $(temp).removeAttr("id");
        $(temp).find(".conttitle").find(".fl").text("第" + (index + 1) + "部分：" + element.title);
        $(temp).find(".listbox .ccont").html(element.content);
        $(temp).find(".listbox .videobox").attr("id", "video" + element.id);
        //题型
        ShowQuestionType(JSON.stringify(element.questionTypeItem), element.id, $(temp).find(".questionContent"));
        //保存按钮
        $(temp).find(".ljlbtnpage a").off('click').on("click", function () {
            SaveLearn(encodeURI(JSON.stringify(LearnJson(element.questionTypeItem, element.id))), $(this))
        })
        $(temp).attr("vid", element.id);
        $(temp).attr("vurl", element.video.VideoUrl);
        $(temp).attr("index", index);
        $(".content12").append($(temp)[0]);
        if (element.isOpen == 1) {
            stepNum = index+1;
        }
    })
     
    $(".content12").append(" <div class=\"ljlbtnpage\" id=\"stepNext2\"><a href=\"#\"  class=\"unableBtn\" onclick=\"Step2Next()\">下一步</a></div>");
    $('.content12 .ljlbtnpage').each(function (index, element) {
        if (index < $('.content12 .ljlbtnpage').length - 1 && stepObj.learnFinish == 0) {          
            $(this).find('a').eq(1).hide();
        }           
    })      
    //filling fillingTemp查漏补缺
    var htmls = "";
    $("#filling").empty();
    var filling = obj.leakFilling.question;
    var fillingTemp = $("#fillingTemp")[0];
    $(filling).each(function (index, element) {
        var temp = fillingTemp.cloneNode(true);
        $(temp).show();
        $(temp).removeAttr("id");
        $(temp).find(".t1").find("em").text(index + 1);
        $(temp).find(".t2").html(element.questionTitle);
        $(temp).find(".t3").html(element.answerExplain);
        $("#filling").append($(temp)[0]);
    })     
    //MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#filling")[0]], function () {
    //    ShowAnswer();
    //    scrollRefresh();
    //});

   
    $('.content12 .ljltab a').click(function () {
        //alert($(this).text() + "---" + curPrepareId + "----" +(5-$(this).index()))
        $(this).addClass('ljlactive').siblings().removeClass('ljlactive');
        $(this).parents('.ljltopiccnt').find('.boxcont').find('.ljllist').eq(3 - $(this).index()).show().siblings().hide();
        if (!isEnd) {
            //提交查看星级题目点击记录
            questionTypeClick($(this).parent().attr("xitem"), $(this).parent().attr("xcode"), 5 - $(this).index());
        }
        $(this).find("i").hide();
        //刷新滚动条
        scrollRefresh();
    })
    showStep()
       
       
    $('.content12 .conttitle label').click(function () {
        $(this).parents('.contbox').find('.listbox').slideToggle(500, function () {
            scrollRefresh();
        });
        $(this).toggleClass('degspan');
        //if ($(this).parents('.contbox').find('.listbox').css("display") == 'none')
        loadVideo($(this).parents('.contbox').attr("vurl"), ("#video" + $(this).parents('.contbox').attr("vid")), $(this).parents('.contbox').attr("vid"))
        //MathJax.Hub.Queue(["Typeset", MathJax.Hub, $(this).parents('.contbox').find('.listbox')[0]]);
           
        //showStep();
        //$(this).find('.listbox').show();
        //setTimeout(function () {
        //    //刷新滚动条
        //    scrollRefresh();
        //}, 400);
    })
    $('.content12 .cntbox .objconfig span').click(function () {
        if (isEnd)
            return;
        $(this).parents('.cntbox').toggleClass('cntbox_1');
        $(this).toggleClass('ljlactive');
            

        if ($(this).hasClass("ljlactive")) {
            var span = $(this);

            var winIndex = layer.confirm('您确认要放弃该题型学习吗？', {
                btn: ['否', '是'] //按钮
            }, function () {
                    span.parents('.cntbox').toggleClass("cntbox_1");
                    span.removeClass('ljlactive');
                layer.close(winIndex);
            }, function () {
                    
                layer.close(winIndex);
            });
        }
    })
        
}
//绑定问题点击记录
function BindQuestionLog() {
    $('.content12 .ljltab a').each(function () {
        var level = $(this);
        var parent = $(this).parent();
        var code = parent.attr("xcode");
        var itemId = parent.attr("xitem");
        var pos = 5 - $(this).index();
        var data = stepObj.learning;
        for (let i in data) {
            if (data[i].itemId == parseInt(itemId)) {
                let elementList = data[i].list;
                for (let j in elementList) {
                    if (elementList[j].code == code) {
                        var eleList = elementList[j].levelList
                        for (let e in eleList) {
                            if (eleList[e].level > 2 && eleList[e].level == pos) {
                                if (eleList[e].status == 1)
                                    $(this).find("i").hide();
                                else
                                    $(this).find("i").show();
                            }
                        }
                    }
                }
            }
                
        }         
    })
}
//解析json
function LearnJson(obj, id) {
    var myData = new Array()
    $(obj).each(function (index, element) {
        var o = { code: element.code, status: element.status }
        myData.push(o)
    })
    return { itemId: id, selectValue: myData };
}
//处理题型
function ShowQuestionType(obj,itemId,dom) {
    var questionTemp = $("#questionTemp")[0];
    var data = JSON.parse(obj);
    var html = "";
    $(data).each(function (index, element) {
        var temp = questionTemp.cloneNode(true);
        $(temp).show();
        $(temp).removeAttr("id");
        $(temp).find(".ctitle").text("题型（" + (index + 1) + "）")
        $(temp).find(".ltitle").text("题型名称：" + element.name)
        if (element.status == 1) {
            $(temp).find(".objconfig").find(".objcnt").find(".fl").removeClass("ljlactive");
        } else {
            $(temp).find(".objconfig").find(".objcnt").find(".fl").addClass("ljlactive");
        }
        //题型
        ShowQuestion(JSON.stringify(element.learnLevel), $(temp).find(".boxcont"))
        if (index == data.length - 1) {
            $(temp).find(".ccont1").addClass("noborder");
        } else {
            $(temp).find(".ccont1").removeClass("noborder");
        }
        $(temp).find(".ljltopiccnt .ljltab").attr("xcode", element.code);
        $(temp).find(".ljltopiccnt .ljltab").attr("xitem", itemId);
        if (element.status == 1) {
            $(temp).removeClass("cntbox_1");
        } else {
            $(temp).addClass("cntbox_1");
        }
        //html = html + temp;
        $(dom).append($(temp)[0])
    })
    //return html;
}
//绑定问题
function ShowQuestion(obj,dom) {
    var levelQuestionTemp = $("#levelQuestionTemp")[0];
    var data = JSON.parse(obj);
    //var html = "";
    $(data).each(function (index, element) {
        var style = "";
        if (index > 0)
            style = "style=\"display:none\"";
        var que = element.question;
        if (element.question == null) {
            $(dom).append("<div class=\"ljllist\" " + style + "></div>");
            return;
        }
        var explain = que.answerExplain;
        var temp = levelQuestionTemp.cloneNode(true);
        $(temp).show();
        $(temp).removeAttr("id");
        $(temp).find(".tt").html(que.questionTitle)
        var option = "";
        if (que.optionA != null && que.optionA != "") {
            option = option + "<div class=\"ljlitem\">A：" + que.optionA + "</div>";
        }
        if (que.optionB != null && que.optionB != "")
            option = option + "<div class=\"ljlitem\">B：" + que.optionB + "</div>";
        if (que.optionC != null && que.optionC != "")
            option = option + "<div class=\"ljlitem\">C：" + que.optionC + "</div>";
        if (que.optionD != null && que.optionD != "")
            option = option + "<div class=\"ljlitem\">D：" + que.optionD + "</div>";
        
        $(temp).find(".tcontent").html(option);
        $(temp).find(".texec").html(explain)
           
        //html = html + temp;
        $(dom).append($(temp)[0])
    })
 
    //return html;
}
//绑定步骤按钮
function BindStepClick() {
    //绑定事件
    $(".stepcnt").off('click').on('click', 'a', function (e) {
        if ($(this).index() < getStep() + 1) {
               
            BtnInitStyle($(this).index())
        }
    });
    //绑定学习不学习点击事件
    $('.objcnt span').off('click').click(function () {
        $(this).addClass('ljlactive').siblings().removeClass('ljlactive');
    });
}
//获取步骤
function  getStep() {
    if (stepObj.learnFilling == 1)
        return 2;
    if (stepObj.learnFinish == 1)
        return 2;
    if (stepObj.mistakes == 1)
        return 1;
    return 0;
}
//步骤按钮样式初始化
function BtnInitStyle(btnIndex) {
    //defk 可点击， 空不可点击  def当前
    ClearBtnStyle();
     
    //备完
    if (stepObj.learnFilling == 1) {
        isEnd = true;     
        //隐藏错题巩固按钮
        $(".content10 .ljlbtn").hide();
        $("#stepNext2").hide();
        $("#mistakeCount").attr("disabled", "disabled");
        //隐藏智能学习按钮
        $(".content12 .ljlbtnpage").hide();
        //隐藏查漏补缺
        $(".content13 .ljlbtnpage").hide();
           
        stepAll(btnIndex);
        //刷新滚动条
        scrollRefresh();
        return;
    }
    $("#mistakeCount").removeAttr("disabled");
    //备到第一步
    if (stepObj.mistakes == 0) {
        step1();
    } 
    //备课到第二步
    if (stepObj.mistakes == 1 && stepObj.learnFinish == 0 && stepObj.learnFilling == 0) {
        step2(btnIndex);
    }
    //备课到第三步
    if (stepObj.mistakes == 1 && stepObj.learnFinish == 1 && stepObj.learnFilling == 0) {
        step3(btnIndex)
    }
    //显示错题巩固按钮
    $(".content10 .ljlbtn").show();
    //显示智能学习按钮
    $(".content12 .ljlbtnpage").show();
    //显示查漏补缺
    $(".content13 .ljlbtnpage").show();
    //刷新滚动条
    scrollRefresh();
       
}
//步骤样式
function stepAll(btnIndex) {
    if (btnIndex == -1)
        btnIndex = 0;
    for (var i = 0; i < 3; i++) {
        if (i == btnIndex) {
            $(".content9 .stepcnt").find("a").eq(i).addClass("def")
            $(".content11 .stepcnt").find("a").eq(i).addClass("def")
        } else {
            $(".content9 .stepcnt").find("a").eq(i).addClass("defk")
            $(".content11 .stepcnt").find("a").eq(i).addClass("defk")
        }
    }
    ShowView(btnIndex)
}
//第一步样式
function step1() {
   $(".content9 .stepcnt").find("a").eq(0).addClass("def")
   $(".content11 .stepcnt").find("a").eq(0).addClass("def")
   ShowView(0)       
}
//第二步样式
function step2(btnIndex) {
   //-1默认选择1
   if (btnIndex == -1)
       btnIndex = 1;
   for (var i = 0; i < 2; i++) {
       if (i == btnIndex) {
            $(".content9 .stepcnt").find("a").eq(i).addClass("def")
            $(".content11 .stepcnt").find("a").eq(i).addClass("def")
       } else {
            $(".content9 .stepcnt").find("a").eq(i).addClass("defk")
            $(".content11 .stepcnt").find("a").eq(i).addClass("defk")
       }
   }
   ShowView(btnIndex)
   scrollRefresh();
}
//第三步样式
function step3(btnIndex) {
    //-1默认选择2
    if (btnIndex == -1)
        btnIndex = 2;
    for (var i = 0; i < 3; i++) {
        if (i == btnIndex) {
            $(".content9 .stepcnt").find("a").eq(i).addClass("def")
            $(".content11 .stepcnt").find("a").eq(i).addClass("def")
        } else {
            $(".content9 .stepcnt").find("a").eq(i).addClass("defk")
            $(".content11 .stepcnt").find("a").eq(i).addClass("defk")
        }
    }
    ShowView(btnIndex)
}
//刷新滚动条
function scrollRefresh() {
    $('.content8 .niceScrollbox').getNiceScroll().resize();
    //  $('.content12 .niceScrollbox').getNiceScroll().resize();
}
//清除样式
function ClearBtnStyle() {
    $(".content9 .stepcnt").find("a").siblings().removeClass('def');
    $(".content9 .stepcnt").find("a").siblings().removeClass('defk');
    $(".content11 .stepcnt").find("a").siblings().removeClass('def');
    $(".content11 .stepcnt").find("a").siblings().removeClass('defk');
}
//显示DIV
function ShowView(index) {
    if (stepObj.mistakes == 1) {

        //$('#stepNext1').off('click').on("click", function () {
        //    BtnInitStyle(1);
        //    scrollRefresh();
        //})
    }
 
    if (stepObj.learnFinish == 1) {
        $("#stepNext2").find('a').removeClass('unableBtn');
        $("#stepNext2").find("a").addClass("ljlactive");
        $.each($(".content12 .contbox"), function () {
            $(this).find(".ljlbtnpage").find('a').eq(1).off('click').on("click", function () {
                BtnInitStyle(2);
                $('.content8 .niceScrollbox').animate({ scrollTop: 0 }, 300);
            });
        })
       
    }
        if (index == 0) {
            $(".stepTitle").html("第1步：错题巩固，可根据实际教学情况在1〜10题之间设置。")
            //错题巩固
            $(".content10").show();
            //智能学习
            $(".content12").hide();
            //查漏补缺
            $(".content13").hide();
            subModel = 1;
        }
  
        if (stepObj.mistakes == 0)
            return;
        if (index == 1) {
            $(".stepTitle").html("第2步：智能学习，可根据实际教学情况选择学习内容。")
            //错题巩固
            $(".content10").hide();
            //智能学习
            $(".content12").show();
            //查漏补缺
            $(".content13").hide();
            subModel = 2;
            showLearning();
           
        }
        if (stepObj.learnFinish == 0)
            return;
        if (index == 2) {
            $(".stepTitle").html("第3步：查漏补缺，掌握不同查漏补缺的方式也不同。")
            //错题巩固
            $(".content10").hide();
            //智能学习
            $(".content12").hide();
            //查漏补缺
            $(".content13").show();
            subModel = 3;
            $("#stepNext2").find('a').removeClass('unableBtn')
            $("#stepNext2").find("a").addClass("ljlactive");
           
        }
}
//显示智能学习
function showLearning() {
    $.each($(".content12 .listbox"), function () {
        if ($(this).is(":visible")) {
            $(this).parents(".contbox").find(".conttitle").find("label").removeClass('degspan');
        } else {
            $(this).parents(".contbox").find(".conttitle").find("label").addClass('degspan');
        }
    })
}
//保存错题巩固后刷新本地数据
function MistakesRefresh() {
        if (curPrepareId == 0) {
            //状态改成备课中
            $(".content9 .contitle").html($(".content9 .contitle").html() + "<em>备课中</em>")
            //课时列表改成备课中
            $("#lessonList .ljlactive span").html("备课中");
            $("#lessonList .ljlactive span").addClass("preparedLessons");
            var wait = parseInt($("#classList .ljlactive .preparedLessons em").html()) - 1;
            $("#classList .ljlactive .preparedLessons em").html(wait);
            var classActive = $("#classList .ljlactive .ltitle ");

            classActive.after("<div class=\"classstatus\">备课中</div>");
            
        }
        
}
//保存进度
function SaveProcess(process) {
    $(".preprocess").text(process+ "%");
    $("#prepareInfo1").html($("#prepareInfo").html());
}
//展示第二步
function Step2Next() {
 
    if (stepObj.learnFinish == 0) {
        layer.msg("请先全部保存完智能学习，再进行下一步");
        return;
    }
    BtnInitStyle(2)
}
//保存错题巩固
function SaveMistakes() {
    if (isEnd)
        return;
    if(curClassId==0)
        return;
    if ($(".content9 .contitle").text().indexOf("制作中") != -1) {
        layer.msg('该课时不可以进行备课')
        return;

    }
    //获取可用时间
    validTime = saver.dateDiff();
    TeacherKeepLive();
    var winIndex = 0;
    $.ajax({
        url: '/Prepare/SaveMistakes',
        type: "post",
        dataType: "json",
        data: { mistakesCount: $("#mistakeCount").val(), beginTime: subModelBeginTime, classId: curClassId, lessonId: curLessonId, prepareId: curPrepareId, packId: curPackId, timeCounts: validTime },
        beforeSend: function () {
            winIndex = layer.load(1, {
                shade: [0.5, '#fff'] //0.1透明度的白色背景
            });
        },
        success: function (data) {
            if (data.code == 200) {
                //更新本地
                MistakesRefresh();
                stepObj=JSON.parse(data.data.step)
                curPrepareId = data.data.prepareId;                   
                SaveProcess(data.data.prepareProcess)                   
                layer.msg("保存成功", { icon: 1, time: 1000 },function(){
                    BtnInitStyle(1);
                    scrollRefresh();
                    saver.reset();
                    layer.close(winIndex);
                });                   
            } else {
                layer.msg(data.message);
                LoadMyClass(0);
            }
        },
        error: function (errorMsg) {
            layer.msg("Err:" + JSON.stringify(errorMsg));
        },
        complete: function (XMLHttpRequest, status) {
                
        }
    });
}
var myData = new Array()
//保存智能学习
function SaveLearn(obj, dom) {
      
    if (isEnd)
        return;
    var data = JSON.parse(decodeURI(obj));
    myData = new Array()
    var confirmHtml = "";
    var isPass = false;
    $(data.selectValue).each(function (index, element) {
        var parent = $(dom).parent().parent().find(".cntbox").eq(index + 2);
        var val = 1;
        var questionTypeHtml = "";
        if (parent.find(".objcnt").find("span").eq(0).hasClass("ljlactive") > 0) {
            val = 0;
            var temp = "<div class=\"ljllist\">{0}<span class=\"notstudy\">(不学习)</span></div>";
            temp = temp.replace("{0}", parent.find(".ctitle").html() + ":" + parent.find(".ltitle").html());
            $.each(parent.find(".ljltab a"), function () {
                if ($(this).find("i").length > 0 && !$(this).find("i").is(':hidden')) {
                    var qtTemp = "<div class=\"ljllist\">{0}<span class=\"notstudy\">(未浏览)</span></div>";
                    qtTemp = qtTemp.replace("{0}", $(this).text());
                    questionTypeHtml = qtTemp + questionTypeHtml;
                }
            })
            confirmHtml = confirmHtml + temp;
        } else {
            $.each(parent.find(".ljltab a"), function () {
                if ($(this).find("i").length > 0 && !$(this).find("i").is(':hidden')) {
                    var qtTemp = "<div class=\"ljllist\">{0}<span class=\"notstudy\">(未浏览)</span></div>";
                    qtTemp = qtTemp.replace("{0}", $(this).text());
                    questionTypeHtml = qtTemp + questionTypeHtml;
                }
            })
            if (questionTypeHtml != "") {
                var temp = "<div class=\"ljllist\">{0}<span>(学习)</span></div>";
                temp = temp.replace("{0}", parent.find(".ctitle").html() + ":" + parent.find(".ltitle").html());
                confirmHtml = confirmHtml + temp;
            }
        }
        confirmHtml = confirmHtml + questionTypeHtml;
        if (val == 1)
            isPass = true
        var o = { code: element.code, status: val }
        myData.push(o)
    })
    if (!isPass) {
        layer.msg('必须要选择一个题型来进行备课');
        return;
    }
    isPass = false;
    $(dom).parents('.contbox').find(".ljllist").each(function () {
        if ($(this).text() == '') {
            isPass = true;
            return;
        }
    }) 
    if (isPass) {
        layer.msg('有星级难度缺少例题');
        return;
    }
    if ($(dom).parents('.contbox').find(".ljllist").length < 4) {
        layer.msg('缺少例题');
        return;
    }
    if (confirmHtml != "") {
        var winHtml = $("#content38temp").html().replace("{0}", $(dom).parent().parent().parent().find(".conttitle .lable").html()).replace("{1}", confirmHtml);
        $(".content38 .listbox").html(winHtml);
        $(".content38 .ljlbtnpage").find('a').eq(0).off('click').on("click", function () {
            layer.closeAll();
        })
        $(".content38 .ljlactive").off('click').on("click", function () {
            ConfirmSave(data.itemId, dom);
            layer.closeAll();
        })
        var win = layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            title: '备课学习内容',
            area: ['600px'],
            content: $('.content38') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        });
    } else {
        ConfirmSave(data.itemId, dom);
    }
}
//二次确认保存智能学习
function ConfirmSave(itemId, dom) {
        //获取可用时间
        validTime = saver.dateDiff();
        //TeacherKeepLive();
        var winIndex = 0;
        $.ajax({
            url: '/Prepare/SaveLearning',
            type: "post",
            dataType: "json",
            data: { itemId: itemId, selectValue: myData, classId: curClassId, lessonId: curLessonId, prepareId: curPrepareId, packId: curPackId, timeCounts: validTime },
            beforeSend: function () {
                winIndex = layer.load(1, {
                    shade: [0.5, '#fff'] //0.1透明度的白色背景
                });
            },
            success: function (data) {
                if (data.code == 200) {
                    

                    layer.msg("保存成功", { icon: 1, time: 1000 }, function () {
                        saver.reset();
                        SaveProcess(data.data.PrepareProgress)
                        stepObj = JSON.parse(data.data.PrepareStep)
                        //curPrepareId = data.data.prepareId;
                        var learning = stepObj.learning;
                        var t = 1;
                        $(stepObj.learning).each(function (index, element) {
                            if (element.status == 0) {
                                t = element.index-1;
                                return false;
                            }
                        })
                      
                        //更新本地
                        stepNum = t;
                        if (stepObj.learnFinish == 1) {
                            stepNum = stepObj.learning.length
                            $("#stepNext2").find('a').removeClass('unableBtn')
                            $("#stepNext2").find("a").addClass("ljlactive");
                        }
                        showStep();
                        $('.content8 .niceScrollbox').animate({ scrollTop: 0 }, 300);
 
                    });
                } else {
                    layer.msg(data.message);
                    LoadMyClass();
                }
            },
            error: function (errorMsg) {
                layer.msg("Err:" + JSON.stringify(errorMsg));
            },
            complete: function (XMLHttpRequest, status) {
                layer.close(winIndex);
            }
        });
}
//智能学习
function showStep() {   
    $('.content12 .contbox').each(function () {
        if ($(this).index() < stepNum) {
            $(this).find('.conttitle label').show();
            $(this).find('.listbox').hide();
            //视频暂停
            videoPause($(this).attr("vid"));
        } else {
            $(this).find('.conttitle label').hide();
            if ($(this).index() == stepNum) {
                $(this).find('.conttitle label').show()
                $(this).find('.listbox').show();
                //加载视频
                loadVideo($(this).attr("vurl"), ("#video" + $(this).attr("vid")), $(this).attr("vid"))
            }
               
        }
    })
    showLearning();
    scrollRefresh();
      
}
//刷新查漏补缺
function LearnFillingRefresh() {
    if (stepObj.learnFilling == 0) {
        stepObj.learnFilling = 1;
        isEnd = true;
        //状态改成备课完成
        $(".content9 .contitle em").text("已备课").addClass("haslessons");
        $(".content9 .contitle").html($(".content9 .contitle").html() + "<a href=\"#\" onclick=\"Repeat()\">再次备课</a>");
        //刷出状态栏
        SaveProcess(100)
        //课时列表改成备课中
        $("#lessonList .ljlactive span").html("已备课");
        $("#lessonList .ljlactive span").removeClass("preparedLessons").addClass("Lessons");
        //班级列表修改数量 
        var Lessons = parseInt($("#classList .ljlactive .Lessons em").html()) + 1;
        $("#classList .ljlactive .Lessons em").html(Lessons);
        $("#classList .ljlactive .classstatus ").remove();                        
    }
}
//保存查漏补缺
function SaveLearnFilling() {
    if (isEnd)
        return;
    validTime = saver.dateDiff();
    TeacherKeepLive();
        
    var win = layer.confirm('确定完成备课吗？', {
        btn: ['否', '是'] //按钮
    }, function () {
        layer.close(win);
    }, function () {
        $.ajax({
            url: '/Prepare/SaveLearnFilling',
            type: "post",
            dataType: "json",
            data: { classId: curClassId, lessonId: curLessonId, prepareId: curPrepareId, packId: curPackId, timeCounts: validTime },
            beforeSend: function () {
                winIndex = layer.load(1, {
                    shade: [0.5, '#fff'] //0.1透明度的白色背景
                });
            },
            success: function (data) {
                if (data.code == 200) {
                    saver.reset();
                    //更新本地
                    LearnFillingRefresh();
                    layer.msg("备课完成", { icon: 1, time: 1500 }, function () {
                        //加载课时列表样式，返回默认选定的课时
                        var selectObj = BindLessonStyle(encodeURI(JSON.stringify(data.data)));

                        //加载默认课时
                        // LoadLessonInfo(encodeURI(JSON.stringify(selectObj)));
                        //隐藏查漏补缺
                        $(".content13 .ljlbtnpage").hide();
                        $("#stepNext2").hide();
                        //绑定点击效果
                        BindLessonListLI();

                    });
                } else {
                    layer.msg(data.message);
                    LoadMyClass(0);
                }
            },
            error: function (errorMsg) {
                layer.msg("Err:" + JSON.stringify(errorMsg));
            },
            complete: function (XMLHttpRequest, status) {
                layer.close(winIndex);
            }
        });

    });
       
}
//再次备课
function Repeat() {
    if (!isEnd)
        return;
    var win = layer.confirm('您确认要再次备课吗？', {
        btn: ['否','是'] //按钮
    }, function () {
        layer.close(win);
    },function () {
        var winIndex = 0;
        $.ajax({
            url: '/Prepare/RepeatLesson',
            type: "post",
            dataType: "json",
            data: { classId: curClassId, lessonId: curLessonId, prepareId: curPrepareId },
            beforeSend: function () {
                winIndex = layer.load(1, {
                    shade: [0.5, '#fff'] //0.1透明度的白色背景
                });
            },
            success: function (data) {
                if (data.code == 200) {
                    
                    var attr = $('#lessonList .ljlactive').find('a').attr('xp');
                    var obj = JSON.parse(attr);
                    if (obj.lessonType != 3) {
                        LoadMyClass(0);
                        //显示错题巩固按钮
                        $(".content10 .ljlbtn").show();
                        //显示智能学习按钮
                        $(".content12 .ljlbtnpage").show();
                        //显示查漏补缺
                        $(".content13 .ljlbtnpage").show();
                    } else {
                        $("#classList ul").find(".ljlactive")
                        GetTest(obj)
                        //状态改成备课完成
                        $(".content9 .contitle em").text("备课中").removeClass("haslessons");
                        $(".content9 .contitle a").remove();
                        //$(".content9 .contitle").html($(".content9 .contitle").html());
                        ////刷出状态栏
                        SaveProcess(0)
                        //课时列表改成备课中
                        $("#lessonList .ljlactive span").html("备课中");
                        $("#lessonList .ljlactive span").addClass("preparedLessons").removeClass("Lessons");
                        //班级列表修改数量 
                        var Lessons = parseInt($("#classList .ljlactive .Lessons em").html()) -1;
                        $("#classList .ljlactive .Lessons em").html(Lessons);
                        $("#classList .ljlactive .ltitle ").after('<div class="classstatus">备课中</div>');
                        $(".changeobj").show();
                    }
             
                   
                    //$("#lessonList ul li").find('.defcolor')
                } else {
                    layer.msg(data.message);
                }
            },
            error: function (errorMsg) {
                layer.msg("Err:" + JSON.stringify(errorMsg));
            },
            complete: function (XMLHttpRequest, status) {
                layer.close(winIndex);
                layer.close(win);
            }
        });

    });
}
var oldData = {};
function TeacherKeepLive() {
    var log = {};
    log.actionContent = actionContent;
    log.actionTitle = actionTitle;
    log.flagId = flagId;
    log.actionType = actionType;
    log.beginTime = (actionType == 1 ? pageBeginTime : subModelBeginTime);
    log.classId = curClassId;
    log.modelCode = model;
    log.validTime = validTime;
    log.packId = curPackId;
    log.lessonId = curLessonId;
    log.subModel = subModel;
    $.ajax({
        url: '/Prepare/PageLog',
        type: "post",
        dataType: "json",
        data: log,
        async: true,
        success: function (data) {
            //只有第一次心跳是1，其他全是2
            actionType = 2;
            //serverTime
            //判断课时是否变化或者，变化就刷新subModelBeginTime
            if (log.subModel != oldData.subModel) {
                subModelBeginTime = data.serverTime;
            }
            if (log.lessonId != oldData.lessonId) {
                subModelBeginTime = data.serverTime;
            }
            oldData = log;
        },
        error: function (errorMsg) {
        },
        complete: function (XMLHttpRequest, status) {
        }
    });
}
//保存题型点击记录
function questionTypeClick(itemId,code,level) {
    $.ajax({
        url: '/Prepare/SaveQuestionTypeLog',
        type: "post",
        dataType: "json",
        data: { prepareId: curPrepareId, itemId: itemId, code: code, level: level },
        async: true,
        success: function (data) {
                 
        },
        error: function (errorMsg) {
        },
        complete: function (XMLHttpRequest, status) {
        }
    });
}
//滚动条初始化
function ScrollInit() {
    $('.content4 .niceScrollbox').niceScroll({
        cursorcolor: "#000000", //#CC0071 光标颜色
        cursoropacitymax: .3, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
        cursorwidth: "3px", //像素光标的宽度
        cursorborder: "3px solid #000000", // 游标边框css定义
        cursorborderradius: "3px", //以像素为光标边界半径
        autohidemode: false, //是否隐藏滚动条
        railpadding: {
            top: 0,
            right: 18,
            left: 0,
            bottom: 0
        }, //滚动条的位置
    });
    $('.content8 .niceScrollbox').niceScroll({
        cursorcolor: "#000000", //#CC0071 光标颜色
        cursoropacitymax: .3, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
        cursorwidth: "3px", //像素光标的宽度
        cursorborder: "3px solid #000000", // 游标边框css定义
        cursorborderradius: "3px", //以像素为光标边界半径
        autohidemode: true, //是否隐藏滚动条
        railpadding: {
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        }, //滚动条的位置

    });
    $('.content8 .niceScrollbox').scroll(function (e) {
        var scroH = $('.content8 .niceScrollbox').scrollTop();  //滚动高度
        if (scroH > 80) {
            $('.content11').show();
        } else {
            $('.content11').hide();
        }
    });


    $('.content5 .niceScrollbox').niceScroll({
        cursorcolor: "#000000", //#CC0071 光标颜色
        cursoropacitymax: .3, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
        cursorwidth: "3px", //像素光标的宽度
        cursorborder: "3px solid #000000", // 游标边框css定义
        cursorborderradius: "3px", //以像素为光标边界半径
        autohidemode: false, //是否隐藏滚动条
        railpadding: {
            top: 0,
            right:32,
            left: 0,
            bottom: 0
        }, //滚动条的位置
    });
    $('.content7 a').click(function () {
        //$('.content8 .niceScrollbox').getNiceScroll().hide();
        if ($('.content6').hasClass('fx')) {
            $('.content6').removeClass('fx');
            $(this).html('全屏备课');
            setTimeout(function () {
                //刷新滚动条
                scrollRefresh();
            }, 310);
        } else {
            setTimeout(function () {
                //刷新滚动条
                scrollRefresh();
            }, 310);
            $('.content6').addClass('fx');
            $(this).html('退出全屏')
        }
    });
    $('.content8 .niceScrollbox').scroll(function (e) {
        var scroH = $('.content8 .niceScrollbox').scrollTop();  //滚动高度
        if (scroH > 80) {
            $('.content11').show();
        } else {
            $('.content11').hide();
        }
    });

    $('.content13 .cnttitle label').click(function () {
        $(this).parents('.contbox').find('.listbox').slideToggle(500, function () {
            scrollRefresh();
        });
        $(this).toggleClass('degspan');
        //setTimeout(function () {
        //    //刷新滚动条
        //    scrollRefresh();
        //}, 400);
    })
    $('.content92 .showorhide').click(function () {
        $(this).find('span').toggleClass('degspan');
        $(this).parents('.itemlist').find('.errorsubjectanalysis').slideToggle(function () {
            $('.content8 .niceScrollbox').getNiceScroll().resize();
        });
    })
    //班级选择下拉
    $('.content68').hover(function () {
        $('.content68').show();
    }, function () {
        $('.content68').hide();
    })
    $('.content68 a').click(function () {
        $('.content68').hide();
    });
    $('.content4 .selectclass').hover(function () {
        $('.content68').show();
    }, function () {
        $('.content68').hide();
    })
}
var videoList = new Array();
//加载视频
function loadVideo(videoUrl, container, id) {
    var newVideoObject = {
        container: container, //容器的ID或className
        variable: 'player', //播放函数名称
        //loaded: 'loadedHandler', //当播放器加载后执行的函数
        loop: true, //播放结束是否循环播放
        config: '', //指定配置函数
        debug: true, //是否开启调试模式
        drag: 'start', //拖动的属性
        seek: 0, //默认跳转的时间
        videoId: id,
        videoList:videoList,
        video: videoUrl,
        stopOther: function () {
            var curVid = id;
            if (videoList != undefined && videoList != null && videoList.length > 0) {
                $(videoList).each(function (index, element) {
                    if (element.id != curVid) {
                        var player = element.player;
                        player.videoPause();
                    }
                })
            }
        }
    }
    var player = new ckplayer(newVideoObject);
    var obj = {};
    obj.id = id;
    obj.player = player;
    videoList.push(obj)
}
//视频暂停
function videoPause(id) {
    $(videoList).each(function (index, element) {
        if (element.id == id) {
            var player = element.player;
            player.videoPause();
        }
    })
}
  
//课时列表的tip提升
function prepareTip() {
    var x = 10;
    var y = 20;
    $(".ljl_tooltip").mouseover(function (e) {
        this.myTitle = this.title;
        this.title = "";
        var tooltip = "<div id='ljl_tooltip'>" + this.myTitle + "<\/div>"; //创建 div 元素 文字提示
        $("body").append(tooltip);	//把它追加到文档中
        $("#ljl_tooltip").css({
            "top": (e.pageY + y) + "px",
            "left": (e.pageX + x) + "px"
        }).show("fast");	  //设置x坐标和y坐标，并且显示
    }).mouseout(function () {
        this.title = this.myTitle;
        $("#ljl_tooltip").remove();   //移除 
    }).mousemove(function (e) {
        $("#ljl_tooltip").css({
            "top": (e.pageY + y) + "px",
            "left": (e.pageX + x) + "px"
        });
    });
}

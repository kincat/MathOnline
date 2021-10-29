// 当前选中的班级
let curClassId = 0;

// 当前选中的年级
var curGrade = 0;

// 当前备课信息
var curPrepare = {};

// 加载遮罩
var shadeIndex = 0;

// 备课步骤
var stepObj = {};
   
// 外链地址
var mainUrl = "";

//所属子模块1：错题巩固 2 智能学习 3 查漏补缺
var subModel=1;

// 错题巩固设置的题数
var mistake = 0;

// 操作的时长
var validTime = 0;

// 课时内容编号
var stepNum = 0;

// 课时内容视频
var videoList = new Array();

$(function () {
    //滚动条
    initScroll();

    // 初始化Session
    initSession();

    //加载我的班级
    loadMyClass();

    //刷新班级
    setInterval(function(){
        loadMyClass(true)
    },30000);

    // 设置外链URL
    if (window.location.hostname.toLowerCase() == "mathschool.abhseducation.com") 
    {
        mainUrl = "http://math.abhseducation.com/";
    } 
    else if (window.location.hostname.toLowerCase() == "test.mathschool.abhseducation.com")
    {
        mainUrl = "http://test.math.abhseducation.com/";
    }
    else
    {
        mainUrl = "http://localhost/";
    }
});


//滚动条初始化
function initScroll() {

    $('.classContent .niceScrollbox').niceScroll({
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
    $('#mathArea .niceScrollbox').niceScroll({
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

    // 浮动步骤栏效果
    $('#mathArea .niceScrollbox').scroll(function (e) {
        var scroH = $('#mathArea .niceScrollbox').scrollTop();  //滚动高度
        if (scroH > 80) {
            $('.floatStepPan').show();
        } else {
            $('.floatStepPan').hide();
        }
    });


    $('.lessContent .niceScrollbox').niceScroll({
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
    $('.prepareItemTool a').click(function () {

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

    // 查漏补缺的解答题题展开处理
    $('.step3 .cnttitle label').click(function () {
        $(this).parents('.contbox').find('.listbox').slideToggle(500, function () {
            scrollRefresh();
        });
        $(this).toggleClass('degspan');
    });
    
    // 考试课查看解析
    $('.testContent .showExplain').click(function () {
        $(this).find('span').toggleClass('degspan');
        $(this).parents('.itemlist').find('.errorsubjectanalysis').slideToggle(function () {
            scrollRefresh();
        });
    });

    // 年级级选择下拉处理
    $('.gradeContent').hover(function () {
        $('.gradeContent').show();
    }, function () {
        $('.gradeContent').hide();
    })
    $('.gradeContent a').click(function () {
        $('.gradeContent').hide();
    });
    $('.classContent .selectclass').hover(function () {
        $('.gradeContent').show();
    }, function () {
        $('.gradeContent').hide();
    })
}


//Session初始化
function initSession() {

    // 设置当前年级
    if(sessionStorage.getItem("currentGrade") == null || sessionStorage.getItem("currentGrade") == "")
    {
        sessionStorage.setItem("currentGrade", 0);
    }
    curGrade = sessionStorage.getItem("currentGrade") * 1;

    // 设置默认选择的年级标题
    $(".gradeTitle").text($("a[v='" + curGrade + "']").text());


    // 设置当前班级
    if(sessionStorage.getItem("currentClass") == null || sessionStorage.getItem("currentClass") == "")
    {
        // 如果有传递过来的班级 则设置到当前班级
        let classId = getQueryVariable("classId");
        if(classId  != "" )
        {
            sessionStorage.setItem("currentClass", classId);
        }
        else
        {
            sessionStorage.setItem("currentClass", 0);
        }
    }
    curClassId = sessionStorage.getItem("currentClass") * 1;


    // 设置当前课时
    if(sessionStorage.getItem("currentPrepare") != null && sessionStorage.getItem("currentPrepare") != "")
    {
        curPrepare = JSON.parse(sessionStorage.getItem("currentPrepare"));
    }
    else
    {
        curPrepare = {PackId: 0, LessonId: 0, PrepareId: 0}
    }    
}



// 年级切换 重新加载班级
function selectGrade(grade, text) {

    // 设置标题
    $(".gradeTitle").text(text);

    // 设置当前年级
    sessionStorage.setItem("currentGrade", grade);
    curGrade = grade;

    loadMyClass()
}

//根据选择的年级加载班级【isOnlyClass 是否只重新加载班级 而不加载联动的下级课时列表】
function loadMyClass(isOnlyClass = false) {

    $.ajax({
        url: '/Prepare/GetAllMyClass',
        type: "post",
        data: { grade: curGrade },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                //$(".testContent").show();
                //$(".noItemDefault").hide();

                //加载班级列表
                var selectObj = createClassHtml(data.data);

                // 不是只刷新班级 则刷新班级课时列表
                if (!isOnlyClass) {

                    // 显示课时列表TOP
                    var text = "";
                    if (selectObj.benginTime != null && selectObj.benginTime != "") 
                    {
                        text = "<span class=\"fl\">课时</span>" + "下次上课：" + selectObj.benginTime
                    }
                        
                    // 试卷隐藏
                    $(".testContent").hide();

                    //加载默认课时列表
                    getLesson(curClassId, text);
                }
                
                //绑定事件
                $('#classList li').click(function () {
                    $('#classList li').removeClass('ljlactive').addClass('lihover');
                    $(this).addClass('ljlactive').removeClass('lihover');
                });

            } else {

                // 隐藏备课信息描述 显示无内容时的图片
                $(".prepareItemMsn").hide();
                $(".noItemDefault").show();

                // 隐藏备课步骤
                $(".step1,step2,step3").hide();

                // 设置班级列表显示
                $("#classList").html('<ul><li class="ljldatatext"><div class=\"labelkc\">没有班级</div></li></ul>');
                
                // 设置班级课时列表显示
                $("#lessonList").html('<ul><li class="ljldatatext"><div class=\"labelkc\">没有课时</div></li></ul>');                
  
                // 课时列表Top上课事件显示清空
                $("#lastTime").html('');
            }
        },
        error: function (errorMsg) {
            layer.msg("Err:" + JSON.stringify(errorMsg));
        },
        complete: function (XMLHttpRequest, status) {
        }
    });
}


    // 构建班级列表HTML
    function createClassHtml(data) 
    {
        var selectData = {};
        var classTemp = $("#classListTemp").html();
        var html = "<ul>";

        $(data).each(function (index, element) {

            // 设置选中的班级
            if(curClassId == 0 && element.isSelect == 1)
            {
                sessionStorage.setItem("currentClass", element.classId);
                curClassId = element.classId;
            }

            var t0 = "lihover", t1 = "", t2 = "", t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = "";
            t0 = curClassId == element.classId ? "ljlactive" : t0;
            t1 = element.isMust == 0 ? "<span class=\"line1 normalspan\">" + element.className + "</span>" : "<span class=\"warn\"><label class=\"line1\">" + element.className + "</label>";
            t2 = element.prepareing > 0 ? "" : (element.isMust == 1 ? "<i class=\"redwarn\">备</i></span>" :"");
            t3 = element.prepareing;
            t4 = element.wait;
            t5 = element.finish;
            t6 = element.classId;
            t7 = element.prepareing > 0 ? "<div class=\"classstatus\">备课中</div>" : "";

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

            if (htm != null && htm != "") 
            {
                htm = "下次上课：" + htm
            }

            var htmls = `<span class='fl'>课时</span>` + htm;
            temp = temp.replace("{8}", htmls);
            html = html + temp;

            //设置选定对象
            if (t0 == "ljlactive") 
            {
                selectData = element;
            }
        });

        html = html + "</ul>";
        if (data.length > 0) 
        {
            $("#classList").html(html)
        } 
        else 
        {
            $("#classList").html('<ul><li class="ljldatatext"><div class=\"labelkc\">没有课程</div></li></ul>')
        }

        //刷新滚动条
        $('.classContent .niceScrollbox').getNiceScroll().resize();

        return selectData;
    }


    // 查找班级挂在的课程课时列表
    function getLesson(classId, html) {

        $("#lastTime").html(html);

        $.ajax({
            url: '/Prepare/GetAllClassLesson',
            type: "post",
            dataType: "json",
            data: { classId: classId },
            beforeSend: function () {
                shadeIndex = layer.load(1, {
                    shade: [0.5, '#fff'] //0.1透明度的白色背景
                });
            },
            success: function (data) {
             
                // 设置当前选择的班级
                sessionStorage.setItem("currentClass", classId);
                curClassId = classId;

                //加载课时列表
                createLessonHtml(data.data);                

                // 找到当前课时
                let lessItem = $("#lessonList li[lessonid='" + curPrepare.LessonId + "']")

                // 根据课时类型 默认加载下级内容
                if (lessItem.attr("lessonType") != 3) 
                {
                    //加载默认课时列表
                    getLessonItem();
                } 
                else // 考试课
                {
                    getTest();
                }
            },
            error: function (errorMsg) {
                layer.msg("Err:" + JSON.stringify(errorMsg));
            },
            complete: function (XMLHttpRequest, status) {
                layer.close(shadeIndex);
            }
        });
    }


    // 课时内容
    function getLessonItem(btnIndex = -1) {

        // 找到当前选择的课时
        let lessItem = $("#lessonList li[lessonid='" + curPrepare.LessonId + "']");    

        // 找到对象
        let prepare = JSON.parse(lessItem.find("a").attr("xp"));


        // 课时未审核通过
        if (prepare.lessonStatus != 1) 
        {
            $("#stepNext1").hide();
            $("#classList li.ljlactive").remove('.classstatus')
            return;
        }

        stepObj = {};
        curPrepare.PrepareId = 0;
        sessionStorage.setItem("currentPrepare", JSON.stringify(curPrepare));

        stepNum = 0;

        // 显示备课信息描述
        $(".prepareItemMsn").show();

        // 显示步骤描述
        $(".stepTitle").show();

        // 显示步骤
        $(".stepbox").show();

        // 备课标题工具栏【显示全屏备课】
        $(".prepareItemTool a").show();

        // 隐藏掉考试课内容
        $(".testContent").hide();

        // 课时备课信息
        var temp = $("#contitleTemp").html();
        temp = temp.replace("{0}", prepare.index);
        temp = temp.replace("{1}", prepare.lessionTitle);
        temp = temp.replace("{2}",prepare.statusName!=""?("<em " + (prepare.status == 2? "" : "class=\"haslessons\"") + ">" + prepare.statusName + "</em>"):"");
        temp = temp.replace("{3}", prepare.desc != null && prepare.desc != "" ? " <span>(" + prepare.desc + ")</span>" : (prepare.status == 1 ? "<a href=\"#\" onclick=\"Repeat()\">再次备课</a>" : ""));
        $(".prepareTitle").html(temp);    
           
        // 加载数据
        $.ajax({
            url: '/Prepare/GetLessonItem',
            type: "post",
            dataType: "json",
            beforeSend: function () {
                shadeIndex = layer.load(1, {
                    shade: [0.5, '#fff'] //0.1透明度的白色背景
                });
            },
            data: { classId: prepare.classId, lessonId: prepare.lessonId, prepareId:prepare.prepareId },
            success: function (data) {

                // 备课步骤
                stepObj = data.data.step
                subModelBeginTime = data.data.beginTime;
                   

                //绑定步骤点击切换事件
                //绑定事件
                $(".stepcnt").off('click').on('click', 'a', function (e) {

                    // 还没备课 
                    if (stepObj.mistakes == 0)
                    {
                        // 只能切换到错题
                        if($(this).index() == 0)
                        {
                            showStepContent($(this).index());
                        }                            
                    }
                    else if (stepObj.learnFinish == 0) // 课时内容未备
                    {
                        // 只能切换到错题和智能学习
                        if($(this).index() <= 1)
                        {
                            showStepContent($(this).index());
                        }   
                    }
                    else
                    {
                        showStepContent($(this).index())
                    }
                });


                // 绑定题型是否学习开关事件     
                $('.objcnt span').off('click').click(function () {
                    $(this).addClass('ljlactive').siblings().removeClass('ljlactive');
                });

                // 构造智能学习课时内容
                createLessonItemHtml(data.data);

                //按钮初始化
                showStepContent(btnIndex);
                    
                //初始化题型点击记录
                initTypeIsClick();

                // 重新渲染
                MathJax.typeset();

                // 显示篮筐
                ShowInput3()

                // 查漏补缺备完课
                if (stepObj.learnFilling == 1) 
                {
                    prepare.status = 1
                    prepare.statusName = "已备课";
                } 
                else 
                {
                    // 错题巩固已经备课完毕
                    if (stepObj.mistakes == 1) {
                        prepare.status = 2
                        prepare.statusName = "备课中";
                    }
                }
            },
            error: function (errorMsg) {
                layer.msg("Err:" + JSON.stringify(errorMsg));
            },
            complete: function (XMLHttpRequest, status) {
                layer.close(shadeIndex);
            }
        });
    }

        // 构造课时列表
        function createLessonHtml(data) {
  
            $("#lessonList").empty();

            if (data.length > 0) 
            {
                $("#lessonList").append("<ul></ul>");
            }

            // 遍历课时
            $(data).each(function (index, element) {

                //模板选择
                var temp = $($("#lessonListTemp").find('li')[0].cloneNode(true));

                // 课时名称
                temp.find('.ltitle strong').text(element.lessionTitle);
        
                // 课程编号
                temp.attr('packId',element.packId);

                // 课时编号
                temp.attr('lessonId',element.lessonId);

                // 设置备课ID
                temp.attr('prepareId',element.prepareId);

                // 课时类型
                temp.attr('lessonType',element.lessonType);
        
                // 备课状态
                temp.attr('status',element.status);  

                // 课时编号
                temp.find('.ltitle label').text('第' + element.index+ '课时:');

                // 计算高度
                let linfo = '第' + element.index + '课时:' + element.lessionTitle;
                temp.find('.hidebox').text(linfo)

                // 备课状态
                temp.find('span').text(element.statusName);

                // 课时状态 1为审核通过
                if (element.lessonStatus == 1) {

                    // 备课状态, 0 未开始, 1 已备课, 2 备课中
                    if (element.status == 1) 
                    {
                        temp.addClass("lihover");
                        temp.find('span').addClass("Lessons"); 
                    } 
                    else if(element.status == 2) //  备课中
                    {
                        temp.addClass("lihover");
                        temp.find('span').addClass("preparedLessons"); 
                    }
                    else 
                    {
                        temp.addClass("defcolor");
                        temp.find('a').attr('title', "请按顺序备课");
                    }
                }
                else
                {
                    temp.addClass("defcolor");
                    temp.find('a').attr('title', "课时已下架");
                }

                // 设置数据
                temp.find('a').attr('xp', JSON.stringify(element));

                // 绑定单击事件
                $(temp).find('a').click(function () {

                    // 处理样式
                    let lessItem = $(this).parent();

                    // 课时未上架或者当前已选择
                    if(lessItem.attr("status") == -1 || lessItem.hasClass("ljlactive"))
                    {
                        return;
                    }

                    // 已备课或正在备课
                    if(lessItem.attr("status") == 1 || lessItem.attr("status") == 2)
                    {
                        $("#lessonList li.ljlactive").removeClass("ljlactive").addClass("lihover");
                        lessItem.removeClass("lihover").addClass("ljlactive");
                    }
            
                    // 还未备课
                    if(lessItem.attr("status") == 0)
                    {
                        // 查找上一个兄弟节点
                        let prev = lessItem.prev();
                
                        // 本节是第一节课
                        if(prev.length == 0)
                        {
                            $("#lessonList li.ljlactive").removeClass("ljlactive").addClass("lihover");
                            lessItem.removeClass("lihover").addClass("ljlactive");
                        }
                        else
                        {
                            // 上一节已备完 否则不允许点击
                            if(prev.attr("status") != 1)
                            {
                                return;
                            }
                            else
                            {
                                $("#lessonList li.ljlactive").removeClass("ljlactive").addClass("lihover");
                                lessItem.removeClass("lihover").addClass("ljlactive");
                            }
                        }
                    }


                    // 设置参数
                    curPrepare.LessonId = element.lessonId
                    curPrepare.PrepareId = element.prepareId
                    curPrepare.PackId = element.packId;
                    sessionStorage.setItem("currentPrepare", JSON.stringify(curPrepare));

                    // 普通课
                    if (element.lessonType !=3) {
                        getLessonItem();
                    } 
                    else  // 考试课
                    {
                        getTest();
                    }            
                });

                // 加入ul
                $("#lessonList ul").append($(temp)[0]);    
            });

            // 计算高度
            $('#lessonList li').each(function(){
                if($(this).find('.hidebox').height()>30){
                    $(this).addClass('listtwo')
                }
            });
    
            // 找到当前选择的课时
            var lessItem = $('#lessonList li[LessonId="' + curPrepare.LessonId + '"]');
            if(lessItem.length == 0)
            {
                // 找到第一个备课中
                lessItem = $('#lessonList li[status="2"]').first();
                if(lessItem.length == 0)
                {
                    // 找到第一个未备课
                    lessItem = $('#lessonList li[status="0"]').first();
                    if(lessItem.length == 0)
                    {
                        // 找到第一节课
                        lessItem = $('#lessonList li').first();
                    }
                } 
            }

            // 设置选中
            lessItem.addClass("ljlactive").removeClass("lihover");

            // 设置备课课程
            curPrepare.LessonId = lessItem.attr("lessonId") * 1;
            curPrepare.PrepareId = lessItem.attr("prepareId") * 1;
            curPrepare.PackId = lessItem.attr("packId") * 1;
            sessionStorage.setItem("currentPrepare", JSON.stringify(curPrepare));
        }


        // 显示题型级别是否点击
        function initTypeIsClick() {
            $('.step2 .ljltab a').each(function () {
                var level = $(this).attr("level") * 1;

                var parent = $(this).parent();

                var code = parent.attr("xcode");

                var itemId = parent.attr("xitem") * 1;

                let levelItem = stepObj.learning.find(o => o.itemId == itemId);
                if(levelItem != null)
                {
                    levelItem = levelItem.list.find(o => o.code == code);

                }
                if(levelItem != null)
                {
                    levelItem = levelItem.levelList.find(o => o.level == level);
                } 

                // 是否已经点击
                if (levelItem != null && levelItem.status == 1) 
                {
                    $(this).find("i").hide();
                }
                else {
                    $(this).find("i").show();
                }
            });
        }

        //考试课
        function getTest() {

            // 找到当前选择的课时
            let lessItem = $("#lessonList li[lessonid='" + curPrepare.LessonId + "']");

            // 找到对象
            let prepare = JSON.parse(lessItem.find("a").attr("xp"));

            // 隐藏步骤
            $(".step1,.step2,.step3").hide();

            // 显示考试课模块
            $(".testContent").show();

            // 显示备课信息描述
            $(".prepareItemMsn").show();

            // 隐藏步骤描述
            $(".stepTitle").hide(); 

            // 隐藏步骤
            $(".stepbox").hide();

            // 备课标题工具栏【显示全屏备课】
            $(".prepareItemTool a").show();

            var temp = $("#contitleTemp").html();
            temp = temp.replace("{0}", prepare.index);
            temp = temp.replace("{1}", prepare.lessionTitle);
            temp = temp.replace("{2}", prepare.statusName != "" ? ("<em " + (prepare.status == 2 ? "" : "class=\"haslessons\"") + ">" + prepare.statusName + "</em>") : "");
            temp = temp.replace("{3}", prepare.desc != null && prepare.desc != "" ? " <span>(" + prepare.desc + ")</span>" : (prepare.status == 1 ? "<a href=\"#\" onclick=\"Repeat()\">再次备课</a>" : ""));
            $(".prepareTitle").html(temp);

            // 获取
            $.ajax({
                url: '/Prepare/GetLessonTest',
                type: "post",
                dataType: "json",
                beforeSend: function () {
                    shadeIndex = layer.load(1, {
                        shade: [0.5, '#fff'] //0.1透明度的白色背景
                    });
                },
                data: { classId: prepare.classId, lessonId: prepare.lessonId, prepareId: prepare.prepareId },
                success: function (data) { 

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
                    {
                        $(".testContent .btns a").removeClass('defa');
                    }                        
                    else 
                    {
                        // 隐藏换题功能
                        $(".testContent .btns a").addClass('defa');
                        $('.changeTestQuestion').hide();
                    }
                    var config=data.data.config;

                    // 考试课的考试时间
                    $(".saveTestCourse").attr("time",config.TestTime);

                    // 试卷满分
                    $(".saveTestCourse").attr("score",config.TestScore);

                    $(".examinationtitle").text(config.TestTitle);
                    var warnText = "本试卷满分" + config.TestScore + "分";
                    warnText = warnText + "，考试时间" + config.TestTime + "分钟";
                    $(".testContent warn1").text("1、" + warnText);
                    warnText = "本次考试" + (config.IsNull == 1 ? "" : "不") + "可空题";
                    warnText = warnText + "，" + config.MinTime + "分钟内不可交卷";
                    $(".testContent warn2").text("2、" + warnText);
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
                    $(".testContent .itemlist").remove()
                    var itemIndex = 1;

                    // 选择题处理
                    $(data.data.selectList).each(function (index, element) {
                        createTestQuestionHtml(element, itemIndex);
                        itemIndex = itemIndex + 1;
                    });
               
                    // 填空题处理
                    $(data.data.spaceList).each(function (index, element) {
                        createTestQuestionHtml(element, itemIndex);
                        itemIndex = itemIndex + 1;
                    });

                    // 解答题处理
                    $(data.data.answerList).each(function (index, element) {
                        createTestQuestionHtml(element, itemIndex);
                        itemIndex = itemIndex + 1;
                    });

                    // 重新渲染
                    MathJax.typeset();

                    // 显示篮筐
                    ShowInput3();

                    scrollRefresh();

                    // 考试课查看解析按钮处理
                    $('.testContent .showExplain').click(function () {
                        $(this).find('span').toggleClass('degspan');
                        $(this).parents('.itemlist').find('.errorsubjectanalysis').slideToggle(function () {
                            scrollRefresh();
                        });
                    })
                },
                error: function (errorMsg) {
                    layer.msg("Err:" + JSON.stringify(errorMsg));
                },
                complete: function (XMLHttpRequest, status) {
                    layer.close(shadeIndex);
                }
            });   
        }

        // 创建考试课的题目
        function createTestQuestionHtml(element, itemIndex) 
        {
            var wrongTemp = $("#testquestiontemp")[0];
            var temp = wrongTemp.cloneNode(true);
            $(temp).removeAttr("id");
            $(temp).show();
            $(temp).find(".config").find('img').remove();

            // 级别转成星星显示
            let strtemp = "";
            for (var i = 0; i < 5; i++) 
            {
                if (i < element.level) 
                {
                    strtemp += '<img src="/Content/images/actstar.png" />';
                } else {
                    strtemp += '<img src="/Content/images/actstar1.png" />';
                }
            }
            $(temp).find(".config label").after(strtemp);

            // 知识点名称
            if (element.knowName != null && element.knowName != "")
            {
                $(temp).find(".config span").text("知识点：" + element.knowName);
            }
            // 题型名称
            if (element.typeName != null && element.typeName != "")
            {
                $(temp).find(".config span").text("题型：" + element.typeName);
            }


            $(temp).find(".config span").after('<em>|</em><span>分数：' + element.score + '分</span>')
            $(temp).find(".optiontitle .indexnum").attr("qid", element.qid);
            $(temp).find(".optiontitle .indexnum").html("【" + itemIndex + "】");
            $(temp).find(".optiontitle .indexnum").after(element.qTitle);
            $(temp).find(".optionlist").empty();

            // 选择题
            if (element.qType == 1)
            {
                $(temp).find(".optionlist").append('<div class="optionitem"><label>A：</label> <div class="optioncont">' + element.optionA + '</div></div>');
                $(temp).find(".optionlist").append('<div class="optionitem"><label>B：</label><div class="optioncont">' + element.optionB + '</div></div>');

                if (element.optionC != null && element.optionC != "")
                {
                    $(temp).find(".optionlist").append('<div class="optionitem"><label>C：</label><div class="optioncont">' + element.optionC + '</div></div>');
                }
                if (element.optionD != null && element.optionD != "")
                {
                    $(temp).find(".optionlist").append('<div class="optionitem"><label>D：</label><div class="optioncont">' + element.optionD + '</div></div>');
                }
            }

            // 题目解析
            $(temp).find(".subjectanalysistext").html(element.answerExplain);

            // 非解答题增加换题功能
            if (element.qType != 3)
            {
                $(temp).find(".changeTestQuestion").click(function () 
                {
                    changeTestQuestion(element.qid, $(this)[0])
                });
            } else
            {
                $(temp).find(".changeTestQuestion").remove();
            }

            // 选择题
            if (element.qType == 1)
            {
                $("#selectContent").append($(temp)[0]);
            }

            // 填空题
            if (element.qType == 2) {
                $("#spaceContent").append($(temp)[0]);
            }

            // 解答题
            if (element.qType == 3) {
                $("#answerContent").append($(temp)[0]);
            }
        }

        // 考试课换题
        function changeTestQuestion(qid, obj)
        {
            var shadeIndex = layer.confirm('确认要更换题目吗？', {
                btn: ['否', '是'] //按钮
            }, function () {
                layer.close(shadeIndex);
            }, function () {
        
                $.ajax({
                    url: '/Prepare/ChangeTestCourse',
                    type: "post",
                    dataType: "json",
                    data: { qid: qid, classId: curClassId, lessonId: curPrepare.LessonId, beginTime: subModelBeginTime },
                    beforeSend: function () {
                        shadeIndex = layer.load(1, {
                            shade: [0.5, '#fff'] //0.1透明度的白色背景
                        });
                    },
                    success: function (data) {
                        if (data.code == 200) {
                            var element = data.data;
                            if (element == null)
                            {
                                return;
                            }
                                
                            layer.msg("换题成功", { icon: 1, time: 1000 }, function () 
                            {       
                                var temp = $(obj).parents('.itemlist')

                                var titleTempNode = temp.find(".optiontitle .indexnum")[0];
                                var titleNode = titleTempNode.cloneNode(true);
                                temp.find(".optiontitle").empty();
                                temp.find(".optiontitle").append(titleNode);
                                temp.find(".optiontitle .indexnum").attr("qid", element.qid);

                                temp.find(".optiontitle .indexnum").after(element.qTitle);
                                temp.find(".optionlist").empty();

                                if (element.qType == 1) {
                                    temp.find(".optionlist").append('<div class="optionitem"><label>A：</label> <div class="optioncont">' + element.optionA + '</div></div>');
                                    temp.find(".optionlist").append('<div class="optionitem"><label>B：</label><div class="optioncont">' + element.optionB + '</div></div>');

                                    if (element.optionC != null && element.optionC != "")
                                    {
                                        temp.find(".optionlist").append('<div class="optionitem"><label>C：</label><div class="optioncont">' + element.optionC + '</div></div>');
                                    }

                                    if (element.optionD != null && element.optionD != "")
                                    {
                                        temp.find(".optionlist").append('<div class="optionitem"><label>D：</label><div class="optioncont">' + element.optionD + '</div></div>');
                                    }

                                }

                                temp.find(".subjectanalysistext").html(element.answerExplain);
                                temp.find(".changeTestQuestion").click(function ()
                                {
                                    changeTestQuestion(element.qid, $(this)[0]);
                                });

                                // 重新渲染
                                MathJax.typeset();

                                // 显示篮筐
                                ShowInput3();

                                scrollRefresh();
                            });
                        } else {
                            layer.msg(data.message);
                        }
                    },
                    error: function (errorMsg) {
                        layer.msg("Err:" + JSON.stringify(errorMsg));
                    },
                    complete: function (XMLHttpRequest, status) {
                        layer.close(shadeIndex);
                    }
                });
            });   
        }


        // 保存考试课备课
        function saveTestCourse(obj) {
    
            if ($('.testContent .btns a').hasClass('defa'))
            {
                return;
            }

            let testCourseTime = $(obj).attr("time");
            let testCourseScore = $(obj).attr("score");
        
            shadeIndex = layer.confirm('本节考试课满分<b>' + testCourseScore + '</b>分 时间<b>' + testCourseTime + '</b>分钟,\。确定完成备课吗？',
            {
                btn: ['否', '是'] //按钮
            },
            function ()
            {
                layer.close(shadeIndex);
            },
            function () {
                var data = { classId: curClassId, lessonId: curPrepare.LessonId, beginTime:subModelBeginTime, packId: curPrepare.PackId }
                $.ajax({
                    url: '/Prepare/SaveTestCourse',
                    type: "post",
                    dataType: "json",
                    data:data ,
                    beforeSend: function () {
                        shadeIndex = layer.load(1, {
                            shade: [0.5, '#fff'] //0.1透明度的白色背景
                        });
                    },
                    success: function (data) {
                        if (data.code == 200) {
                            layer.msg("备课完成", { icon: 1, time: 1500 }, function () {
                                //加载课时列表样式，返回默认选定的课时
                                var prepare = createLessonHtml(data.data);

                                //unableBtn
                                $('.testContent .btns a').addClass('defa');

                                // 隐藏换题功能
                                $('.changeTestQuestion').hide();

                                //状态改成备课完成
                                $(".prepareItemMsn .contitle em").text("已备课").addClass("haslessons");
                                $(".prepareItemMsn .contitle").html($(".prepareItemMsn .contitle").html() + "<a href=\"#\" onclick=\"Repeat()\">再次备课</a>");

                                //刷出状态栏
                                $(".preprocess").text("100%");
                                $("#prepareInfo1").html($("#prepareInfo").html());

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
                            loadMyClass();
                        }
                    },
                    error: function (errorMsg) {
                        layer.msg("Err:" + JSON.stringify(errorMsg));
                    },
                    complete: function (XMLHttpRequest, status) {
                        layer.close(shadeIndex);
                    }
                });

            });
        }


        // 模拟答题
        function imitateTest(){
            var url=mainUrl+"Test/VirtualTest?lessId="+curLessonId;

            layer.open({
                type: 2,
                skin: 'content88_1',
                title: "模拟答题",
                area: ['95%', '95%'],
                //btn: ['关闭'],
                btnAlign: 'c',
                content: url
            });
        }

        // 获取URL参数
        function getQueryVariable(variable)
        {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
            }

            return "";
        }

        // 刷新滚动条
        function scrollRefresh() {       
            $('#mathArea .niceScrollbox').getNiceScroll().resize();        
        }


        // 显示步骤内容
        function showStepContent(btnIndex) {

            // 默认展开【非指定步骤】
            if(btnIndex == -1)
            {
                // 还未备课
                if (stepObj.mistakes == 0) 
                {
                    btnIndex = 0;
                }
                else if (stepObj.learnFinish == 0)  // 智能学习还未备
                {
                    btnIndex = 1;
                }
                else
                {
                    btnIndex = 2;
                }
            }


            // 添加可用样式defk
            $(".stepcnt").find("a").addClass('defk');

            // 去掉所有的当前标签样式
            $(".stepcnt").find("a").removeClass('def');


            // 设置当前标签【浮动和原标签】
            $(".stepcnt1").find("a").eq(btnIndex).addClass("def").removeClass('defk');
            $(".stepcnt2").find("a").eq(btnIndex).addClass("def").removeClass('defk');

            // 查漏补缺备完【全部备完】
            if (stepObj.learnFilling == 1) {
  
                //隐藏错题巩固下一步按钮
                $(".step1 .ljlbtn").hide();

                // 禁止改变错题巩固数量
                $("#mistakeCount").attr("disabled", "disabled");


                //隐藏智能学习每个课时内容的保存按钮
                $(".step2 .ljlbtnpage").hide();

                // 隐藏课时内容备课下一步按钮
                $("#stepNext2").hide();

                //隐藏查漏补缺完成按钮
                $(".step3 .ljlbtnpage").hide(); 
            }
            else
            {
                $("#mistakeCount").removeAttr("disabled");            

                // 错题巩固还未备
                if (stepObj.mistakes == 0) {

                    // 第二步第三步禁用【浮动和原标签】
                    $(".stepcnt1").find("a").eq(1).removeClass("defk");
                    $(".stepcnt1").find("a").eq(2).removeClass("defk");
                    $(".stepcnt2").find("a").eq(1).removeClass("defk");
                    $(".stepcnt2").find("a").eq(2).removeClass("defk");
                }        

                // 智能学习还未备
                if (stepObj.learnFinish == 0) 
                {
                    // 第三步禁用
                    $(".stepcnt1").find("a").eq(2).removeClass("defk");
                    $(".stepcnt2").find("a").eq(2).removeClass("defk");
                }

                //显示错题巩固下一步按钮
                $(".step1 .ljlbtn").show();

                //显示智能学习每个课时内容的保存按钮
                $(".step2 .ljlbtnpage").show();

                //显示查漏补缺完成按钮
                $(".step3 .ljlbtnpage").show();
            }

            // 显示错题巩固
            if (btnIndex == 0) {
                $(".stepTitle").html("第1步：错题巩固，可根据实际教学情况在1〜10题之间设置。");

                //错题巩固
                $(".step1").show();

                //智能学习
                $(".step2").hide();

                //查漏补缺
                $(".step3").hide();

                // 模块
                subModel = 1;
            }

            // 显示智能学习
            if (btnIndex == 1) {
                $(".stepTitle").html("第2步：智能学习，可根据实际教学情况选择学习内容。");

                //错题巩固
                $(".step1").hide();

                //智能学习
                $(".step2").show();

                //查漏补缺
                $(".step3").hide();

                // 模块
                subModel = 2;
            }

            // 查漏补缺  
            if (btnIndex == 2) {
                $(".stepTitle").html("第3步：查漏补缺，掌握不同查漏补缺的方式也不同。");

                //错题巩固
                $(".step1").hide();

                //智能学习
                $(".step2").hide();

                //查漏补缺
                $(".step3").show();

                // 模块
                subModel = 3;

                $("#stepNext2").find('a').removeClass('unableBtn')
                $("#stepNext2").find("a").addClass("ljlactive");
            };

            //刷新滚动条
            scrollRefresh();       
        }

        //再次备课
        function Repeat() {

            shadeIndex = layer.confirm('您确认要再次备课吗？', {
                btn: ['否','是'] //按钮
            },
            function ()
            {
                layer.close(shadeIndex);
            },
            function ()
            {
                $.ajax({
                    url: '/Prepare/RepeatLesson',
                    type: "post",
                    dataType: "json",
                    data: { classId: curClassId, lessonId: curPrepare.LessonId, prepareId: curPrepare.PrepareId },
                    beforeSend: function ()
                    {
                        shadeIndex = layer.load(1, {
                            shade: [0.5, '#fff'] //0.1透明度的白色背景
                        });
                    },
                    success: function (data) {
                        if (data.code == 200) {                  

                            // 重新加载
                            loadMyClass();          
                        }
                        else
                        {
                            layer.msg(data.message);
                        }
                    },
                    error: function (errorMsg) {
                        layer.msg("Err:" + JSON.stringify(errorMsg));
                    },
                    complete: function (XMLHttpRequest, status) {
                        layer.close(shadeIndex);
                    }
                });

            });
        }

        //保存错题巩固
        function SaveMistakes()
        {
            // 未上架的课不能备
            if ($(".prepareItemMsn .contitle").text().indexOf("制作中") != -1)
            {
                layer.msg('该课时不可以进行备课')
                return;
            }

            // 获取花费时间【秒】
            validTime = saver.dateDiff();

            $.ajax({
                url: '/Prepare/SaveMistakes',
                type: "post",
                dataType: "json",
                data: { mistakesCount: $("#mistakeCount").val(), beginTime: subModelBeginTime, classId: curClassId, lessonId: curPrepare.LessonId, prepareId: curPrepare.PrepareId, packId: curPrepare.PackId, timeCounts: validTime },
                beforeSend: function () {
                    shadeIndex = layer.load(1, {
                        shade: [0.5, '#fff'] //0.1透明度的白色背景
                    });
                },
                success: function (data) {

                    // 成功
                    if (data.code == 200) {
                
                        layer.msg("保存成功", { icon: 1, time: 1000 }, function () {

                            // 重新加载内容且默认打开智能学习备课步骤
                            getLessonItem(1);

                            saver.reset();
                            layer.close(shadeIndex);
                        });                   
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
        }

        // 课时内容样式渲染
        function createLessonItemHtml(obj) {
       
            let prepareTime = pageBeginTime;
            let prepareTeacher = teacherName;
            let prepareProcess = obj.prepareProcess;

            // 还未开始备智能学习
            if (obj.prepareTime != "")
            {
                prepareTime = obj.prepareTime
                prepareTeacher = obj.prepareTeacher;
            }

            $("#prepareInfo").html(" <i>备课时间：</i>" + prepareTime.substr(0, 16) + "丨<i>备课老师：</i>" + prepareTeacher + "丨<i>备课进度：</i><span class=\"preprocess\">" + prepareProcess + "</span>");
            $("#prepareInfo1").html($("#prepareInfo").html());

            // 错题巩固
            mistake = obj.mistakes;
            $("#mistakeCount").val(mistake);

            // 课时内容
            let learnTemp = $("#lessItemTemp")[0];
            $(".step2").empty();

            let html = "";
            let data = obj.learnList;

            $(data).each(function (index, element)
            {
                var temp = learnTemp.cloneNode(true);
                $(temp).show();
                $(temp).removeAttr("id");
                $(temp).find(".conttitle").find(".fl").text("第" + (index + 1) + "部分：" + element.title);
                $(temp).find(".listbox .ccont").html(element.content);
                $(temp).find(".listbox .videobox").attr("id", "video" + element.id);

                // 题型渲染
                createQuestionTypeHtml(element.questionTypeItem, element.id, $(temp).find(".questionContent"));

                // 课时内容保存处理
                $(temp).find(".btnSaveItem").click(function ()
                {
                    let parData = new Array()
                    $(element.questionTypeItem).each(function (index, element) 
                    {
                        parData.push({ code: element.code, status: element.status })
                    });

                    SaveLearn({ itemId: element.id, selectValue: parData }, $(this))
                });

                // 设置属性【课时内容ID 视频地址】
                $(temp).attr("itemid", element.id);
                $(temp).attr("itemurl", element.video.VideoUrl);

                // 加入
                $(".step2").append($(temp)[0]);

                // 内容是否展开
                if (element.isOpen == 1)
                {
                    stepNum = index + 1;
                }
            })
     
            // 下一步按钮
            $(".step2").append(" <div class=\"ljlbtnpage\" id=\"stepNext2\"><a href=\"#\"  class=\"unableBtn\" onclick=\"Step2Next()\">下一步</a></div>");
    

            // 例题星级切换
            $('.step2 .ljltab a').click(function () {

                $(this).addClass('ljlactive').siblings().removeClass('ljlactive');
                $(this).parents('.ljltopiccnt').find('.boxcont').find('.ljllist').eq(3 - $(this).index()).show().siblings().hide();

                //提交查看星级题目点击记录
                questionTypeClick($(this).parent().attr("xitem"), $(this).parent().attr("xcode"), 5 - $(this).index());

                // 点击后隐藏显示未点击的红点
                $(this).find("i").hide();

                //刷新滚动条
                scrollRefresh();
            });


            // 查漏补缺
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
   
            // 显示隐藏智能学习的备课课时内容
            showHideLessItem();
      
            // 显示隐藏课时内容的点击处理
            $('.step2 .conttitle label').click(function () {
        
                let btn = $(this);
                let item = $(this).parents('.contbox').find('.listbox');

                // 文字变化
                if (!$(this).parents('.contbox').find('.listbox').is(":visible")) {
                    btn.hide();
                    btn.text("收起");
                    btn.fadeIn();
                }
                else {
                    btn.hide();
                    btn.text("展开");
                    btn.fadeIn();
                }

                // 内容展开收缩效果
                $(this).parents('.contbox').find('.listbox').slideToggle(500, function ()
                {
                    scrollRefresh();
                });

                // 切换展开收起的ICO
                $(this).toggleClass('degspan');

                // 加载对应的视频
                loadVideo($(this).parents('.contbox').attr("itemurl"), ("#video" + $(this).parents('.contbox').attr("itemid")), $(this).parents('.contbox').attr("itemid"))

            });

            // 题型是否学习处理
            $('.step2 .typeIsStudy').click(function () {

                // 查漏补缺备完【全部备完】 则不响应处理
                if (stepObj.learnFilling == 1) {
                    return;
                }

                // 设置样式
                $(this).parents('.cntbox').toggleClass('cntbox_1');
                $(this).toggleClass('ljlactive');

                // 选择了不学习
                if ($(this).hasClass("ljlactive")) {
                    var span = $(this);

                    shadeIndex = layer.confirm('您确认要放弃该题型学习吗？', {
                        btn: ['否', '是'] //按钮
                    },
                    function () {
                        span.parents('.cntbox').toggleClass("cntbox_1");
                        span.removeClass('ljlactive');
                        layer.close(shadeIndex);
                    },
                    function () {
                        layer.close(shadeIndex);
                    });
                }
            });
        }

        // 题型渲染
        function createQuestionTypeHtml(data, itemId, dom)
        {
            var questionTemp = $("#questionTemp")[0];

            var html = "";
            $(data).each(function (index, element) {

                var temp = questionTemp.cloneNode(true);
                $(temp).show();
                $(temp).removeAttr("id");
                $(temp).find(".ctitle").text("题型" + (index + 1) + "：" + element.name)

                if (element.status == 1)
                {
                    $(temp).find(".objconfig").find(".objcnt").find(".fl").removeClass("ljlactive");
                } else {
                    $(temp).find(".objconfig").find(".objcnt").find(".fl").addClass("ljlactive");
                }

                // 题目渲染
                createQuestionHtml(element.learnLevel, $(temp).find(".boxcont"));

                if (index == data.length - 1)
                {
                    $(temp).find(".ccont1").addClass("noborder");
                }
                else
                {
                    $(temp).find(".ccont1").removeClass("noborder");
                }
                $(temp).find(".ljltopiccnt .ljltab").attr("xcode", element.code);
                $(temp).find(".ljltopiccnt .ljltab").attr("xitem", itemId);

                if (element.status == 1)
                {
                    $(temp).removeClass("cntbox_1");
                }
                else
                {
                    $(temp).addClass("cntbox_1");
                }

                $(dom).append($(temp)[0])
            })
        }

        // 题目渲染
        function createQuestionHtml(data, dom)
        {
            var levelQuestionTemp = $("#levelQuestionTemp")[0];

            $(data).each(function (index, element) {
                var style = "";
                if (index > 0)
                {
                    style = "style=\"display:none\"";
                }
            
                var que = element.question;
                if (element.question == null)
                {
                    $(dom).append("<div class=\"ljllist\" " + style + "></div>");
                    return;
                }

                var explain = que.answerExplain;
                var temp = levelQuestionTemp.cloneNode(true);
                $(temp).show();
                $(temp).removeAttr("id");
                $(temp).find(".tt").html(que.questionTitle);

                var option = "";            
                if (que.optionA != null && que.optionA != "")
                {

                    option = "<div class=\"ljlitem\">A：" + que.optionA + "</div>";
                }

                if (que.optionB != null && que.optionB != "")
                {
                    option = option + "<div class=\"ljlitem\">B：" + que.optionB + "</div>";
                }

                if (que.optionC != null && que.optionC != "")
                {
                    option = option + "<div class=\"ljlitem\">C：" + que.optionC + "</div>";
                }

                if (que.optionD != null && que.optionD != "")
                {
                    option = option + "<div class=\"ljlitem\">D：" + que.optionD + "</div>";
                }
        
                $(temp).find(".tcontent").html(option);
                $(temp).find(".texec").html(explain)

                $(dom).append($(temp)[0])
            })
        }

        // 显示隐藏智能学习的备课课时内容
        function showHideLessItem() {

            // 遍历课时内容
            $('.step2 .contbox').each(function () {

                // 已经备过的默认显示展开按钮并隐藏备课内容
                if ($(this).index() < stepNum)
                {
                    $(this).find('.conttitle label').show();            
                    $(this).find('.conttitle label').text("展开");
                    $(this).find('.listbox').hide();

                    //视频暂停
                    videoPause($(this).attr("itemid"));
                }
                else
                {
                    // 还没备到的内容隐藏掉展开按钮
                    $(this).find('.conttitle label').hide();

                    // 正在备的当前内容显示展开按钮备课内容
                    if ($(this).index() == stepNum)
                    {
                        $(this).find('.conttitle label').show();
                        $(this).find('.conttitle label').text("收起");
                        $(this).find('.listbox').show();

                        //加载视频
                        loadVideo($(this).attr("itemurl"), ("#video" + $(this).attr("itemid")), $(this).attr("itemid"))
                    }               
                }
            })

            // 设置展开收起的默认的IOC
            $.each($(".step2 .listbox"), function () {
                if ($(this).is(":visible")) {
                    $(this).parents(".contbox").find(".conttitle").find("label").removeClass('degspan');
                } else {
                    $(this).parents(".contbox").find(".conttitle").find("label").addClass('degspan');
                }
            });

            scrollRefresh();      
        }

        // 加载视频
        function loadVideo(videoUrl, container, id)
        {
            var newVideoObject = {
                container: container, //容器的ID或className
                variable: 'player', //播放函数名称
                loop: true, //播放结束是否循环播放
                config: '', //指定配置函数
                debug: true, //是否开启调试模式
                drag: 'start', //拖动的属性
                seek: 0, //默认跳转的时间
                videoId: id,
                videoList:videoList,
                video: videoUrl,
                stopOther: function () {
            
                    // 停止其他视频播放
                    let curVid = id;
                    if (videoList == null || videoList.length == 0)
                    {
                        return;
                    }

                    $(videoList).each(function (index, element)
                    {
                        if (element.id != curVid) {
                            var player = element.player;
                            player.videoPause();
                        }
                    })
                }
            }

            let player = new ckplayer(newVideoObject);
            let obj = {};
            obj.id = id;
            obj.player = player;
            videoList.push(obj)
        }

        //视频暂停
        function videoPause(id)
        {
            $(videoList).each(function (index, element)
            {
                if (element.id == id)
                {
                    let player = element.player;
                    player.videoPause();
                }
            })
        }

        //展示第二步
        function Step2Next() {
 
            // 没有备完智能学习
            if (stepObj.learnFinish == 0)
            {
                layer.msg("请先全部保存完智能学习，再进行下一步");
                return;
            }

            showStepContent(2)
        }


        //保存题型点击记录
        function questionTypeClick(itemId, code, level) {

            // 查漏补缺备完【全部备完】 则不响应处理
            if (stepObj.learnFilling == 1) {
                return;            
            }

            alert(5555);

            $.ajax({
                url: '/Prepare/SaveQuestionTypeLog',
                type: "post",
                dataType: "json",
                data: { prepareId: curPrepare.PrepareId, itemId: itemId, code: code, level: level },
                async: true,
                success: function (data) {
                 
                },
                error: function (errorMsg) {
                },
                complete: function (XMLHttpRequest, status) {
                }
            });
        }


        //保存智能学习
        function SaveLearn(data, dom) {
      
            // 查漏补缺备完【全部备完】 则不响应处理
            if (stepObj.learnFilling == 1) {
                return;
            }

            // 题型状态【学习不学习】
            let typeList = new Array()

            var confirmHtml = "";
            var isPass = false;

            $(data.selectValue).each(function (index, element) {

                // 课时内容的题型展示区域
                var itemTypeContext = $(dom).parent().parent().find(".questionContent .cntbox").eq(index);

                var isStudy = 1;
                var questionTypeHtml = "";

                // 查看是否选择了不学习题型
                if (itemTypeContext.find(".typeIsStudy").eq(0).hasClass("ljlactive") > 0) {

                    // 不学习
                    isStudy = 0;

                    var temp = "<div class=\"ljllist\">{0}<span class=\"notstudy\">(不学习)</span></div>";
                    temp = temp.replace("{0}", itemTypeContext.find(".ctitle").html() + ":" + itemTypeContext.find(".ltitle").html());
                    $.each(itemTypeContext.find(".ljltab a"), function ()
                    {
                        if ($(this).find("i").length > 0 && !$(this).find("i").is(':hidden')) {
                            var qtTemp = "<div class=\"ljllist\">{0}<span class=\"notstudy\">(未浏览)</span></div>";
                            qtTemp = qtTemp.replace("{0}", $(this).text());
                            questionTypeHtml = qtTemp + questionTypeHtml;
                        }
                    });

                    confirmHtml = confirmHtml + temp;
                }
                else
                {
                    $.each(itemTypeContext.find(".ljltab a"), function () {
                        if ($(this).find("i").length > 0 && !$(this).find("i").is(':hidden')) {
                            var qtTemp = "<div class=\"ljllist\">{0}<span class=\"notstudy\">(未浏览)</span></div>";
                            qtTemp = qtTemp.replace("{0}", $(this).text());
                            questionTypeHtml = qtTemp + questionTypeHtml;
                        }
                    })
                    if (questionTypeHtml != "") {
                        var temp = "<div class=\"ljllist\">{0}<span>(学习)</span></div>";
                        temp = temp.replace("{0}", itemTypeContext.find(".ctitle").html() + ":" + itemTypeContext.find(".ltitle").html());
                        confirmHtml = confirmHtml + temp;
                    }
                }

                confirmHtml = confirmHtml + questionTypeHtml;

                // 只要有选择一个题型要学习 则可以通过备课
                if (isStudy == 1) {
                    isPass = true;
                }

                // 添加到题型列表
                typeList.push({ code: element.code, status: isStudy })
            });

            // 一个题型都没有选择学习
            if (!isPass) {
                layer.msg('必须要选择一个题型来进行备课');
                return;
            }

            // 重置 并检测星级下的例题
            $(dom).parents('.contbox').find(".ljllist").each(function () {
                if ($(this).text() == '')
                {
                    isPass = false;
                }
            });

            // 题型例题缺失
            if (!isPass) {
                layer.msg('有星级难度缺少例题');
                return;
            }

            // 题型例题缺失
            if ($(dom).parents('.contbox').find(".ljllist").length < 4) {
                layer.msg('有星级难度缺少例题');
                return;
            }

            // 有需要提示的内容
            if (confirmHtml != "")
            {
                // 组合弹出的HTML代码
                confirmHtml = $("#confirmPanTemp").html().replace("{0}", $(dom).parent().parent().parent().find(".conttitle .lable").html()).replace("{1}", confirmHtml);
                $(".confirmPan .listbox").html(confirmHtml);

                // 弹出框的取消按钮处理
                $(".confirmPan .ljlbtnpage").find('a').eq(0).off('click').on("click", function ()
                {
                    layer.closeAll();
                });

                // 弹出框的保存
                $(".confirmPan .ljlactive").off('click').on("click", function () {
                    postLearn(data.itemId, typeList);
                    layer.closeAll();
                });

                // 弹出
                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    title: '备课学习内容',
                    area: ['600px'],
                    content: $('.confirmPan') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
                });
            }
            else
            {
                postLearn(data.itemId, typeList);
            }
        }

        // 提交课时内容备课
        function postLearn(itemId, typeList) {

            //获取可用时间
            validTime = saver.dateDiff();

            $.ajax({
                url: '/Prepare/SaveLearning',
                type: "post",
                dataType: "json",
                data: { itemId: itemId, selectValue: typeList, classId: curClassId, lessonId: curPrepare.LessonId, prepareId: curPrepare.PrepareId, packId: curPrepare.PackId, timeCounts: validTime },
                beforeSend: function () {
                    shadeIndex = layer.load(1, {
                        shade: [0.5, '#fff'] //0.1透明度的白色背景
                    });
                },
                success: function (data) {
                    if (data.code == 200) {                    

                        layer.msg("保存成功", { icon: 1, time: 1000 }, function () {
                            saver.reset();

                            //刷出状态栏
                            $(".preprocess").text(data.data.PrepareProgress + "%");
                            $("#prepareInfo1").html($("#prepareInfo").html());

                            stepObj = JSON.parse(data.data.PrepareStep)

                            var learning = stepObj.learning;
                            var t = 1;
                            $(stepObj.learning).each(function (index, element)
                            {
                                if (element.status == 0)
                                {
                                    t = element.index - 1;
                                    return false;
                                }
                            });
                      
                            //更新本地
                            stepNum = t;
                            if (stepObj.learnFinish == 1) {
                                stepNum = stepObj.learning.length
                                $("#stepNext2").find('a').removeClass('unableBtn')
                                $("#stepNext2").find("a").addClass("ljlactive");
                            }

                            // 显示隐藏智能学习的备课课时内容
                            showHideLessItem();

                            // 重设滚动条
                            $('#mathArea .niceScrollbox').animate({ scrollTop: 0 }, 300); 
                        });
                    }
                    else
                    {
                        layer.msg(data.message);
                    }
                },
                error: function (errorMsg) {
                    layer.msg("Err:" + JSON.stringify(errorMsg));
                },
                complete: function (XMLHttpRequest, status) {
                    layer.close(shadeIndex);
                }
            });
        }


        //保存查漏补缺
        function SaveLearnFilling() {

            // 查漏补缺备完【全部备完】 则不响应处理
            if (stepObj.learnFilling == 1) {
                return;
            }

            validTime = saver.dateDiff();
        
            shadeIndex = layer.confirm('确定完成备课吗？', {
                btn: ['否', '是'] //按钮
            },
            function ()
            {
                layer.close(shadeIndex);
            },
            function ()
            {
                layer.close(shadeIndex);

                $.ajax({
                    url: '/Prepare/SaveLearnFilling',
                    type: "post",
                    dataType: "json",
                    data: { classId: curClassId, lessonId: curPrepare.LessonId, prepareId: curPrepare.PrepareId, packId: curPrepare.PackId, timeCounts: validTime },
                    beforeSend: function () {
                        shadeIndex = layer.load(1, {
                            shade: [0.5, '#fff'] //0.1透明度的白色背景
                        });
                    },
                    success: function (data) {

                        // 备课完成
                        if (data.code == 200) {
                            saver.reset();
                            layer.msg("备课完成", { icon: 1, time: 1500 }, function () {

                                // 重新加载
                                loadMyClass();

                            });
                        } else
                        {
                            layer.msg(data.message);
                        }
                    },
                    error: function (errorMsg) {
                        layer.msg("Err:" + JSON.stringify(errorMsg));
                    },
                    complete: function (XMLHttpRequest, status) {
                        layer.close(shadeIndex);
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
    log.packId = curPrepare.PackId;
    log.lessonId = curPrepare.LessonId;
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

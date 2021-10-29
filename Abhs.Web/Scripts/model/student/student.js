$(function () {
    //刷新人数
    setInterval(function () {
        refreshStudent()
    }, 3000)
    $('.content4 .niceScrollbox').niceScroll({
        cursorcolor: "#000000", //#CC0071 光标颜色
        cursoropacitymax: .3, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
        cursorwidth: "3px", //像素光标的宽度
        cursorborder: "3px solid #000000", // 游标边框css定义
        cursorborderradius: "3px", //以像素为光标边界半径
        autohidemode: true, //是否隐藏滚动条
        railpadding: {
            top: 0,
            right: 18,
            left: 0,
            bottom: 0
        }, //滚动条的位置
    });
    $('.content51 .niceScrollbox').niceScroll({
        cursorcolor: "#000000", //#CC0071 光标颜色
        cursoropacitymax: .3, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
        cursorwidth: "3px", //像素光标的宽度
        cursorborder: "3px solid #000000", // 游标边框css定义
        cursorborderradius: "3px", //以像素为光标边界半径
        autohidemode: true, //是否隐藏滚动条
        railpadding: {
            top: 0,
            right: 18,
            left: 0,
            bottom: 0
        }, //滚动条的位置
    });
    $('.content48 li').click(function () {
        $(this).addClass('ljlactive').siblings().removeClass('ljlactive');
        $(".content50 .ftitle em").text($(this).find(".studenttype1 span").attr("user"));
        $(".content50 .ftitle i span").text($(this).find(".studenttype1 em").attr("user"));
        $(".content49 .content7 .label").text($(this).find(".studenttype").text() + "列表")
        if ($(this).find(".studenttype").text().indexOf("已分班") >= 0) {
            allot = 1;
        } else {
            allot = 0;
        }
        $('#search').click();
        $.each($('.content48 li'), function () {
            if ($(this).hasClass('ljlactive')) {
                $(this).find(".studenttype1 span").html($(this).find(".studenttype1 span").text().replace("(", "").replace(")", ""));
                $(this).find(".studenttype1 em").html($(this).find(".studenttype1 em").text().replace("(", "").replace(")", ""))

            } else {
                var all = "(" + $(this).find(".studenttype1 span").text() + ")";
                var other = "(" + $(this).find(".studenttype1 em").text() + ")";
                $(this).find(".studenttype1 span").html(all.replace("((", "(").replace("))", ")"));
                $(this).find(".studenttype1 em").html(other.replace("((", "(").replace("))", ")"))

            }
        })

    })
    $('.content7 a').click(function () {
        if ($('.content6').hasClass('fx')) {
            $('.content6').removeClass('fx');
            //$(this).html('全屏备课');
            setTimeout(function () {
                $('.content8 .niceScrollbox').getNiceScroll().resize();
            }, 310);
        } else {
            setTimeout(function () {
                $('.content8 .niceScrollbox').getNiceScroll().resize();
            }, 310);
            $('.content6').addClass('fx');
            //$(this).html('退出全屏')
        }
    });
    $('.content50 .vselect input').click(function () {
        $('.content50 .layui-anim-upbit').removeClass('layui-anim-upbit layui-anim');
        $(this).parents('.inpbox').find('ul').addClass('layui-anim-upbit layui-anim');
    })
    $('.content50 .iconspan').click(function () {
        $('.content50 .layui-anim-upbit').removeClass('layui-anim-upbit layui-anim');
        $(this).parents('.inpbox').find('ul').addClass('layui-anim-upbit layui-anim');
    })
    $('.content50 li').click(function () {
        $(this).parents('.vselect').find('input').val($(this).html());
        $('.content50 .layui-anim-upbit').removeClass('layui-anim-upbit layui-anim');
        var name = $(this).attr("name");
        var value = $(this).attr("value");
        if (name == "grade")
            grade = value;
        if (name == "sex")
            sex = value;
        if (name == "status")
            status = value;

    })
    $('.content51 .vselect input').click(function () {
        $('.content51 .layui-anim-upbit').removeClass('layui-anim-upbit layui-anim');
        $(this).parents('.inpbox').find('ul').addClass('layui-anim-upbit layui-anim');
    })
    $('.content51 .iconspan').click(function () {
        $('.content51 .layui-anim-upbit').removeClass('layui-anim-upbit layui-anim');
        $(this).parents('.inpbox').find('ul').addClass('layui-anim-upbit layui-anim');
    })

    $('body').click(function (e) {
        if (!$(e.target).hasClass('isclick')) {
            $('.content50 .layui-anim-upbit').removeClass('layui-anim-upbit');
            $('.content51 .layui-anim-upbit').removeClass('layui-anim-upbit');
        }
    })

    $('.content51 .ftitle span').click(function () {
        $('.content51').toggleClass('content29_1');
        $('.content32').toggle();
        queryArgInit();
    })

    $('.content32').click(function () {
        $('.content51').toggleClass('content29_1');
        $('.content32').toggle();
        queryArgInit();
    })

})
//查询条件初始化
function queryArgInit() {

    $($('.content51 input')).each(function (index, element) {
        var obj = $(this).parents('.vselect').find('li').eq(0);
        $(this).val('')
    })
    //默认教材
    bookId = 0;
    //默认年级
    gradeId = 0;
    //班级选择分配
    classAllot = -1;
    studentId = 0;

}
var dropdown;
layui.config({
    base: '/Scripts/layui/lay/modules/'
}).use(['dropdown'], function () {
    dropdown = layui.dropdown;

});
layui.use(['table', 'laydate', 'dropdown','form'], function () {
    var table = layui.table;
    var laydate = layui.laydate;
    var form = layui.form;
    table.render({
        elem: '#studentList',
        url: '/Student/GetStudentList',
        height: 'full-340',
        //height: '578',
        cellMinWidth: 80,
        limit: 15,
        //even: true,
        method: 'post',
        page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
            layout: ['prev', 'page', 'next', 'count'], //自定义分页布局
            curr: 1, //设定初始在第 5 页
            groups: 5, //只显示 1 个连续页码
            //first: false, //不显示首页
            //last: false, //不显示尾页
            next: '下一页',
            prev: '上一页'

        },
        cols: [
            [  {
                field: 'studentNo',
                width: 90,
                title: '学籍号',
                align: 'center'
            }, {
                field: 'userAccount',
                width: 150,
                title: '账号',
                align: 'center'
            }, {
                field: 'userName',
                width: 100,
                title: '姓名',
                align: 'center'
            }, {
                field: 'sexName',
                width: 60,
                title: '性别',
                align: 'center'
            }, {
                field: 'grade',
                title: '学段',
                width: 80,
                align: 'center'
            }, {
                field: 'className',
                cellMinWidth: 130,
                title: '班级',
                align: 'center'
            }, {
                field: 'coin',
                width: 80,
                title: '金币',
                hide: true,
                align: 'center'
            }, {
                field: 'mark',
                hide: true,
                width: 80,
                title: '积分',
                align: 'center'
            }, {
                field: 'regTime',
                width: 120,
                title: '注册日期',
                align: 'center'
            }, {
                field: 'finishTime',
                width: 135,
                title: '到期日期',
                templet: function (d) {
                    if (d.finishTime == null || d.finishTime == '')
                        return '-';
                    return d.finishTime;
                },
                align: 'center'
            }, {
                field: 'lastLoginTime',
                width: 170,
                title: '最近登录',
                templet: function (d) {
                    if (d.lastLoginTime ==null|| d.lastLoginTime == '')
                        return '-';
                    return d.lastLoginTime;
                },
                align: 'center'
            }, {
                field: 'statusName',
                width: 80,
                title: '状态',
                templet: function (d) {
                    //return '<a class="statusdiv"><i></i>正常</ a>';
                    //return '<a class="statusdiv stop"><i></i>停用</ a>';
                    if (d.statusName == '正常')
                        return '<a class="statusdiv" style="color:#007EFF">正常</ a>';
                    if (d.statusName == '停用')
                        return '<a class="statusdiv" style="color:#EE2B06">停用</ a>';
                    if (d.statusName == '到期')
                        return '<a class="statusdiv" style="color:#FF9F00">到期</ a>';
                    return "";
                },
                align: 'center'
            },
            {
                field: 'isAble',
                width: 120,
                title: '计算训练',
                toolbar: '#statusTpl',
                align: 'center'
            },
           {
               title: '操作',
               cellMinWidth: 100,
               toolbar: '#barDemo',
               align: 'center'
           }]
        ],
        done: function (res, curr, count) {
            
            if (allot == 0) {
                $("[data-field='className']").css('display', 'none');
                $("[data-field='userAccount']").width($("[data-field='userAccount']").width() + $("[data-field='className']").width())
                
            }
            if (res.count > 0 && res.data.length > 0) {               
                $(".layui-table-box").removeClass('nodatatable');
            } else {
                $(".layui-table-box").addClass('nodatatable');
            }
            dropdown.suite();
        }
    });
    form.on('switch(isAble)', function (obj) {
        
        // 通过属性获取绑定的id值

        var id = $(this).attr('mid');
        
        studentId = id;
        // 判断开关的状态
        var status = obj.elem.checked ? "1" : "0";
        if (status == 1) {
            startTest();
            //var winIndex = layer.confirm('您确认要启用该学生的计算训练吗？', {
            //    btn: ['否', '是'] //按钮
            //}, function () {
            //    $(obj.elem).val(0)
            //    layer.close(winIndex);
            //    form.render();
            //}, function () {
            //    startTest();
            //    layer.close(winIndex);
            //});

        } else {
            stopTest();
            //var winIndex = layer.confirm('您确认要禁用该学生的计算训练吗？', {
            //    btn: ['否', '是'] //按钮
            //}, function () {
            //    layer.close(winIndex);
            //}, function () {
            //    stopTest();
            //    layer.close(winIndex);
            //});

        }
      
    });
 
    table.on('tool(studentList)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        studentId = data.id;
        if (layEvent === 'allotClass') { //分配班级
            
            $(".content51 .username").html(data.userName + "<em>(" + data.grade + ")</em>")
            $(".content51 .userconfig").find("span").html(data.regTime)
            $(".content51 .userconfig").find("em").html(data.finishTime)
            $(".userpic img").attr('src', data.userHead);
            
            allotClass(data.gradeId)
            getClass();
            return false;

        } else if (layEvent === 'stop') {
            var winIndex = layer.confirm('您确认要停用该学生[' + data.userName + ']吗？', {
                btn: ['否', '是'] //按钮
            }, function () {
                layer.close(winIndex);
            }, function () {
                stopStudent();
                layer.close(winIndex);
            });
           
        } else if (layEvent === 'start') {
            var winIndex = layer.confirm('您确认要启用该学生[' + data.userName + ']吗？', {
                btn: ['否', '是'] //按钮
            }, function () {
                layer.close(winIndex);
            }, function () {
                startStudent();
                layer.close(winIndex);
            });
        } else if (layEvent === 'startTest') {
            var winIndex = layer.confirm('您确认要启用该学生[' + data.userName + ']的计算训练吗？', {
                btn: ['否', '是'] //按钮
            }, function () {
                layer.close(winIndex);
            }, function () {
                startTest();
                layer.close(winIndex);
            });
        } else if (layEvent === 'stopTest') {
            var winIndex = layer.confirm('您确认要禁用该学生[' + data.userName + ']的计算训练吗？', {
                btn: ['否', '是'] //按钮
            }, function () {
                layer.close(winIndex);
            }, function () {
                stopTest();
                layer.close(winIndex);
            });
        }

    });
    laydate.render({
        elem: '#registerdate',
        range: true,
        done: function (value) {
            $('#registerdate').val(value);
        }
    });
    laydate.render({
        elem: '#expiredate',
        range: true,
        done: function (value) {
            $('#expiredate').val(value);
        }
    });

    // 搜索
    $('#search').on('click', function () {

        // 搜索条件
        //alert($("#registerdate").val()) -
        var regBeginDate = "";
        var regEndDate = "";
        var finishBeginDate = "";
        var finishEndDate = "";
        var key = "";
        if ($.trim($("#registerdate").val()) != "") {
            var reg = $.trim($("#registerdate").val()).split(" - ");
            if (reg.length > 1) {
                regBeginDate = reg[0];
                regEndDate = reg[1];
            }
        }
        if ($.trim($("#expiredate").val()) != "") {
            var finish = $.trim($("#expiredate").val()).split(" - ");
            if (finish.length > 1) {
                finishBeginDate = finish[0];
                finishEndDate = finish[1];
            }
        }
        if ($.trim($("#key").val()) != "") {
            key = $.trim($("#key").val());
        };
        table.reload('studentList', {
            method: 'post'
          , where: {
              'regBeginDate': regBeginDate,
              'regEndDate': regEndDate,
              'finishBeginDate': finishBeginDate,
              'finishEndDate': finishEndDate,
              'key': key,
              'grade': grade,
              'sex': sex,
              'status': status,
              'isAllot': allot
          }
          , page: {
              curr: table.currentPage
          },
          done: function (res, curr, count) {
              dropdown.suite();
                if (allot == 0) {
                    $("[data-field='className']").css('display', 'none');
                    $("[data-field='userAccount']").width($("[data-field='userAccount']").width() + $("[data-field='className']").width())
                }
                if (res.count > 0 && res.data.length > 0) {
                    $(".layui-table-box").removeClass('nodatatable');
                    if (allot == 1) {
                        if (res.data[0].classId == null || res.data[0].classId == '') {
                            $.each($(".layui-table tr"), function (index, v) {
                                if (index > 0)
                                    $(this).hide();
                            })
                        }
                    } else {
                        if (res.data[0].classId != null && res.data[0].classId != '') {
                            $.each($(".layui-table tr"), function (index, v) {

                                if (index > 0)
                                    $(this).hide();
                            })
                        }
                    }
                } else {
                    $(".layui-table-box").addClass('nodatatable');
                }
              
            }
        });
    });

});
//弹出窗口
function allotClass(grade) {
    var max = getMax(grade)
 
    $("#gradeul>li").not(":eq(0)").remove();
    //$("#gradeul").append('<li class="isclick" name="gradeId">全部年级</li>');
    $.each(gradeData, function (index, ele) {
        if (index < max) {
            $("#gradeul").append('<li class="isclick" name="gradeId" value="' + ele.gradeYearValue + '">' + ele.gradeYearName + '</li>');
        }
    })
    $('.content51').toggleClass('content29_1');
    $('.content32').toggle();
}
function getMax(grade) {
    if (grade ==3)
        return 12;
    if (grade ==2)
        return 9;
    return 6;
}
//获取所有班级
function getClass() {
    var data = {};
    data.bookId = bookId;
    data.gradeId = gradeId;
    data.classAllot = classAllot;
    data.studentId = studentId;

    $.ajax({
        url: '/Class/GetClass',
        type: "post",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.code == 200) {
                var tmp = $("#classListTemp").html();
                var classData = data.data;
                var html = "";
                $(data.data).each(function (index, element) {
                    var temp = tmp;
                    temp = temp.replace("{0}", element.classId);
                    temp = temp.replace("{1}", element.className);
                    temp = temp.replace("{2}", element.beginDate);
                    temp = temp.replace("{3}", element.endDate);
                    var teacher = element.teacher.split(',');
                    var t = "";
                    $(teacher).each(function (v, z) {
                        t=t+"<span>"+z+"</span>"
                    })
                    temp = temp.replace("{4}", t);
                    temp = temp.replace("{5}", element.courseName);
                    temp = temp.replace("{6}", element.courseItemCount);//多少课时
                    temp = temp.replace("{7}", element.bookName);//教材
                    temp = temp.replace("{9}", element.studentCount);
                    temp = temp.replace("{10}", element.classId);
                    temp = temp.replace("{11}", element.status == 1? "emactive" : "");
                    temp = temp.replace("{12}", element.isSelect == 1 ? "已加入" : "加入班级");
                    temp = temp.replace("{13}", element.isSelect == 1 ? "classlistdef" : "");
                    temp = temp.replace("{14}", element.isSelect);
                    var table = "";
                    var tableData = JSON.parse(element.classTable);
                    for (let i in tableData) {
                        var weekName = tableData[i].weekName;
                        let elementList = tableData[i].detail;
                        for (let j in elementList) {
                            table = table + "<span>" + weekName + "" + elementList[j].start + "~" + elementList[j].end + "</span>";
                        }
                    }
                    temp = temp.replace("{8}", table);
                    html = html + temp;
                })
                $(".classbox").empty()
                if (html != "") {

                    $(".classbox").html(html);
                    $('.content51 .niceScrollbox').getNiceScroll().resize();
                } else {
                    $(".classbox").html("<div style='padding:10px; text-align: center; color:#999'>无数据</div>");
                }
                $('.content51 li').off('click').on("click", function () {
                    $(this).parents('.vselect').find('input').val($(this).html());
                    $(this).parents('.vselect').find('ul').removeClass('layui-anim-upbit layui-anim');                    

                    var name = $(this).attr("name");
                    var value = $(this).attr("value");
                    if (name == "book") {
                        bookId = value;
                    }
                    if (name == "gradeId")
                        gradeId = value;
                    if (name == "classAllot")
                        classAllot = value;

                    getClass();
                })

            } else {
                layer.msg("出错了，请刷新再尝试");
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        }
    });
}

//加入班级
function joinClass11111(classId, obj, selected) {
    if (selected == 1) return;
    var winIndex = layer.confirm('您确认要加入该班级吗？', {
        btn: ['否', '是'] //按钮
    }, function () {
        layer.close(winIndex);
    }, function () {
        confirmJoinClass(classId, obj, selected, winIndex)
    });      
}
function joinClass(classId, obj, selected) {

    //已加入
    if ($(obj).text() == "已加入")
    {
        return;
    }

    var data = {};
    data.classId = classId;
    data.studentId = studentId;
    var winIndex = 0;
    $.ajax({
        url: '/Class/StudentJoinClass',
        type: "post",
        dataType: "json",
        data: data,
        beforeSend: function () {
            winIndex = layer.load(1, {
                shade: [0.5, '#fff'] //0.1透明度的白色背景
            });
        },
        success: function (data) {
            if (data.code == 200) {
                    var type = data.data.type;                
                    var winTwoIndex = layer.confirm(data.data.message, {
                        btn: ['否', '是'] //按钮
                    }, function () {
                        layer.close(winTwoIndex);
                        layer.close(winIndex);
                    }, function () {
                        confirmJoinClass(classId, obj, selected, winTwoIndex,type)
                    });
                  

            } else {
                layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        },
        complete: function (XMLHttpRequest, status) {
            layer.close(winIndex);
        }
    });
}
function confirmJoinClass(classId, obj, selected, layIndex, type) {
    var data = {};
    data.classId = classId;
    data.studentId = studentId;
    data.isConfirm = type;
    var winIndex = 0;
    $.ajax({
        url: '/Class/StudentJoinClass',
        type: "post",
        dataType: "json",
        data: data,
        beforeSend: function () {
            winIndex = layer.load(1, {
                shade: [0.5, '#fff'] //0.1透明度的白色背景
            });
        },
        success: function (data) {
            if (data.code == 200) {
                $('#search').click();
                //$(obj).closest(".classlist").slideUp(500);
                $(obj).parents('.classlist').addClass("classlistdef");
                $(obj).parents('.classlist').find('.emactive').removeClass("emactive");
                $(obj).text('已加入');
                $(obj).parents(".infotext").find("span").html("<i>班级人数：</i>" + data.data.studentCount + "人")
                $(obj).removeAttr("onclick");
                $(obj).on('click', function () {
                    joinClass(classId, obj, 1);
                });
                layer.msg("加入成功");

            } else {
                layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        },
        complete: function (XMLHttpRequest, status) {
            layer.close(layIndex);
            layer.close(winIndex);
        }
    });
}
//停用学生
function stopStudent() {
    var data = {};
    data.studentId = studentId;
    $.ajax({
        url: '/Student/StudentStop',
        type: "post",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.code == 200) {
                $('#search').click();
                layer.msg("操作成功");

            } else {
                layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        }
    });
}
//启用学生
function startStudent() {
    var data = {};
    data.studentId = studentId;
    $.ajax({
        url: '/Student/StudentUse',
        type: "post",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.code == 200) {
                $('#search').click();
                layer.msg("操作成功");

            } else {
                layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        }
    });
}
//停用学生计算训练
function stopTest() {
    var data = {};
    data.studentId = studentId;
    $.ajax({
        url: '/Student/TestStop',
        type: "post",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.code == 200) {
                $('#search').click();
                layer.msg("操作成功");

            } else {
                layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        }
    });
}
//启用学生计算训练
function startTest() {
    var data = {};
    data.studentId = studentId;
    $.ajax({
        url: '/Student/TestStart',
        type: "post",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.code == 200) {
                $('#search').click();
                layer.msg("操作成功");

            } else {
                layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        }
    });
}
function refreshStudent() {
    $.ajax({
        url: '/Student/GetStudentCount',
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                $.each($('.content48 li'), function () {
                    if ($(this).index() == 0) {
                        if ($(this).hasClass('ljlactive')) {
                            $(this).find(".studenttype1 span").text("总共：" + data.data.allotCount + "人").attr("user", data.data.allotCount);
                            $(this).find(".studenttype1 em").text("将到期：" + data.data.allotTimeOut + "人").attr("user", data.data.allotTimeOut);
                        } else {
                            $(this).find(".studenttype1 span").text("(总共：" + data.data.allotCount + "人)").attr("user", data.data.allotCount);
                            $(this).find(".studenttype1 em").text("(将到期：" + data.data.allotTimeOut + "人)").attr("user", data.data.allotTimeOut);
                           
                        }
                        if (data.data.allotTimeOut == 0) {
                            $(this).find(".studenttype1 em").hide();
                        } else {
                            $(this).find(".studenttype1 em").show();
                        }
                    } else {
                        if ($(this).hasClass('ljlactive')) {
                            $(this).find(".studenttype1 span").text("总共：" + data.data.notAllotCount + "人").attr("user", data.data.notAllotCount);
                            $(this).find(".studenttype1 em").text("将到期：" + data.data.notAllotTimeOut + "人").attr("user", data.data.notAllotTimeOut);
                        } else {
                            $(this).find(".studenttype1 span").text("(总共：" + data.data.notAllotCount + "人)").attr("user", data.data.notAllotCount);
                            $(this).find(".studenttype1 em").text("(将到期：" + data.data.notAllotTimeOut + "人)").attr("user", data.data.notAllotTimeOut);
                        }
                        if (data.data.notAllotTimeOut == 0) {
                            $(this).find(".studenttype1 em").hide();
                        } else {
                            $(this).find(".studenttype1 em").show();
                        }
                       
                    }
                  
                   
                   
                    $(".content50 .ftitle em").text(allot == 1 ? data.data.allotCount : data.data.notAllotCount);
             
                    if (allot == 1 ? data.data.allotTimeOut > 0 : data.data.notAllotTimeOut > 0)
                        $(".content50 .ftitle i").show();
                    else
                        $(".content50 .ftitle i").hide();
                    $(".content50 .ftitle i span").text((allot == 1 ? data.data.allotTimeOut : data.data.notAllotTimeOut) + "人");
                    $(".content49 .content7 .label").text((allot == 1 ? "已分班学生" : "未分班学生") + "列表")
                })
            } else {
                //layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            //layer.msg("出错了，请刷新再尝试");
        }
    });
}
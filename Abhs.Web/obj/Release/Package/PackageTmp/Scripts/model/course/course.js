$(function () {
    //左一栏滚动条
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


    //左二栏滚动条
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
            right: 32,
            left: 0,
            bottom: 0
        }, //滚动条的位置
    });

    //右侧详情栏滚动条
    $('.content6 .niceScrollbox').niceScroll({
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

    // 创建班级栏
    $('.content56 .niceScrollbox').niceScroll({
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

    // 课程栏的版本下拉
    $('.bookListPan').niceScroll({
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

    //左二栏点击事件
    $('.content5 li').click(function () {
        $(this).addClass('ljlactive').siblings().removeClass('ljlactive');
    });

    // 版本切换列表
    $('.bookListPan').hover(function () {
        $(this).show();
    }, function () {
        $(this).hide();
    });

    // 切换具体版本
    $('.bookListPan a').click(function () {
        $('.bookListPan').hide();
    });
    $('.content5 .onlinebox').hover(function () {
        $('.bookListPan').show();
    }, function () {
        $('.bookListPan').hide();
    })
    $('.content56 .ftitle span').click(function () {
        $('.content56').toggleClass('content29_1');
        $('.content56 .content32').toggle();
    })
    $('.content56 .content32').click(function () {
        $('.content56').toggleClass('content29_1');
        $('.content56 .content32').toggle();
    })
    $(".content56").delegate(".addbtn", "click", function () {

        if ($('.setimtlist').length > 4) {
            $(this).parents('.setimtlist').remove();
        }
    });
    getGradeList()
    $(".select_box").click(function (event) {
        event.stopPropagation();
        $(this).find(".option").toggle();
        $(this).parent().siblings().find(".option").hide();
    });
    $(document).click(function (event) {
        var eo = $(event.target);
        if ($(".select_box").is(":visible") && eo.attr("class") != "option" && !eo.parent(".option").length)
            $('.option').hide();
    });
    /*赋值给文本框*/
    $(".option a").click(function () {
        var value = $(this).text();
        $(this).parent().siblings(".select_txt").text(value);
        $("#select_value").val(value)
    })
})

var max = 5
$dataTypes = $("#teacherIds");
$dataTypes.on("blur", ".xm-body", function () {
    setTimeout(() => {
        if ($dataTypes.find(".xm-search").hasClass("dis")) {
            var valueStr = xmSelectObj.getValue("valueStr");
            var arr = valueStr.split(',')

            if (arr != undefined && arr.length > max) {
                layer.msg("最多选择5个老师")
                arr.splice(max, arr.length - max);
                xmSelectObj.setValue(arr);
            }

        }
    }, 300);
});
var isCheck = false;
var curGrade = 0;
var bookId = 0;
var courseId = 0;
var lessonId = 0;

var bid = 0;
var xmSelectObj;
layui.use(['form', 'laydate', 'xmSelect'], function () {

    var laydate = layui.laydate;
    var form = layui.form;
    var xmSelect = layui.xmSelect;
    xmSelectObj = xmSelect.render({
        el: '#teacherIds',
        // tips: false,
        // toolbar:false,
        data: JSON.parse(teacherData)
    })

    form.on('select(course)', function (data) {
        courseId = $("#courseId").val();
        $("#gradeId").empty();
        $.each(courseData, function (index, element) {
            if (element.id == courseId) {
                var ids = element.gradeIds.split(',')
                $.each(ids, function (index, item) {
                    //$("#gradeId").append(" <option value=" + item + ">" + grade[parseInt(item) - 1] + "</option>");
                    $.each(grade, function (m, n) {
                        if (n.gradeYearValue == item)
                            $("#gradeId").append(" <option value=" + item + ">" + n.gradeYearName + "</option>");

                    })

                })
                return;

            }
        })
        form.render('select');
    });
    form.on('select(grade)', function (data) {
        curGrade = $("#gradeId").val();
        //$("#courseId").empty();
        //$.each(courseData, function (index, element) {
        //    if (element.id == courseId) {
        //        var ids = element.gradeIds.split(',')
        //        if ($.inArray(ids, curGrade)) {
        //            $("#courseId").append(" <option value=" + element.id + ">" + element.courseName + "</option>");
        //        }
        //        return;

        //    }
        //})
        form.render('select');
    });
    form.on('select(book)', function (data) {
        //curGrade = $("#gradeId").val();
        $("#courseId").empty();
        $.each(courseData, function (index, element) {

            var ids = element.gradeIds.split(',')

            if ($.inArray($("#gradeId").val(), ids) != -1 && ($("#bookId").val() == "" || $("#bookId").val() == element.bookId)) {
                $("#courseId").append(" <option value=" + element.id + ">" + element.courseName + "</option>");
            }
        })
        form.render('select');
    });
    laydate.render({
        elem: '#starttime',
        value: getDay(),
        format: 'yyyy-MM-dd',
        min: getDay(),
        showBottom: false,
        ready: function () {
            var elem = $(".layui-laydate-content");//获取table对象
            layui.each(elem.find('tr'), function (trIndex, trElem) {//遍历tr
                layui.each($(trElem).find('td'), function (tdIndex, tdElem) {
                    //遍历td
                    var tdTemp = $(tdElem);
                    if (tdTemp.hasClass('laydate-day-next') || tdTemp.hasClass('laydate-day-prev')) {
                        return;
                    }
                    if (!isCreate) {
                        var start = new Date($("#starttime").val());
                        var startDate = start.getTime();
                        var endTime = new Date().getTime();
                        if (endTime > startDate) {
                            tdTemp.addClass('laydate-disabled');
                        }

                    }
                    //if (tdIndex == 1) {
                    //    //此处判断，是1的加上laydate-disabled，0代表星期日
                    //    tdTemp.addClass('laydate-disabled');
                    //}
                });
            });
        },
        change: function () {
            var elem = $(".layui-laydate-content");//获取table对象
            layui.each(elem.find('tr'), function (trIndex, trElem) {//遍历tr
                layui.each($(trElem).find('td'), function (tdIndex, tdElem) {
                    //遍历td
                    var tdTemp = $(tdElem);
                    if (tdTemp.hasClass('laydate-day-next') || tdTemp.hasClass('laydate-day-prev')) {
                        return;
                    }
                    if (!isCreate) {
                        tdTemp.addClass('laydate-disabled');
                    }
                    //if (tdIndex == 1) {
                    //    //此处判断，是1的加上laydate-disabled，0代表星期日
                    //    tdTemp.addClass('laydate-disabled');
                    //}
                });
            });
        },
        //range: true,
        done: function (value) {

            var start = new Date(value);
            var startDate = start.getTime();
            var endTime = new Date($('#endtime').val()).getTime();
            if (endTime < startDate) {
                layer.msg('开课时间不能小于结束时间');
                $('#starttime').val('');
            } else {
                var dateSpan;
                dateSpan = endTime - startDate;
                var iDays = dateSpan / (24 * 3600 * 1000);
                //if (iDays < getMonthDay(start.getFullYear(), start.getMonth()) - 1)
                if (iDays < 2) {
                    layer.msg('上课最少3天');
                    $('#starttime').val('');
                } else {
                    if (iDays > 365) {
                        layer.msg('上课最多365天');
                        $('#starttime').val('');
                    } else {
                        $('#starttime').val(value);
                    }
                }
            }
        }
    });
    laydate.render({
        elem: '#endtime',
        format: 'yyyy-MM-dd',
        //value: getEndDay(),
        //min: getEndDay(),
        showBottom: false,
        //range: true,
        done: function (value) {

            var end = new Date(value);
            var startDate = new Date($('#starttime').val()).getTime();
            var endTime = end.getTime();
            var nowTime = new Date(now).getTime();

            if (endTime < nowTime) {
                layer.msg('结课时间不能小于当前时间');
                $('#endtime').val('');
                return;
            }
            if (endTime < startDate) {
                layer.msg('结课时间不能小于开始时间');
                $('#endtime').val('');
            } else {
                var dateSpan;
                dateSpan = endTime - startDate;
                var iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
                //if (iDays < getMonthDay(end.getFullYear(), end.getMonth()) - 1)
                if (iDays < 2) {
                    layer.msg('上课时间最少3天');
                    $('#endtime').val('');
                } else {
                    if (iDays > 365) {
                        layer.msg('上课最多365天');
                        $('#endtime').val('');
                    } else {
                        $('#endtime').val(value);
                    }
                }
            }
        }
    });
    function copyClassTable() {
        $("#mod_select").show();
        $.ajax({
            url: '/Class/GetClassItem',
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    $(".mod_select .option").empty();
                    $("#select_value").val('');
                    $(".select_txt").text('请选择课表模板（创建班级的时候可用）');
                    $(".select_txt").css("color", "#D9D9D9")

                    $.each(data.data, function (index, e) {
                        $(".mod_select .option").append("<a href='javascript:;' data-value='" + JSON.stringify(e.value) + "' data-flag='" + e.flag + "'>" + e.key + "</a>");
                    });
                    $(".option a").click(function () {
                        $('#editbox').find('.setimtlist').remove();
                        var value = $(this).attr("data-value");
                        var flag = $(this).attr("data-flag");
                        $(this).parent().siblings(".select_txt").text(flag);
                        var objValue = JSON.parse(value);
                        $(".select_txt").css("color", "#222")
                        var html = "";
                        $.each(objValue, function (index, v) {
                            $.each(v.detail, function (m, vv) {
                                html += '<div class="setimtlist">';
                                html += '	<div class="inpbox vselect classtime"> <div class="layui-form">';
                                //html += '	<select name="weekIndex" lay-verify="" lay-filter="week"  ' + (!isEdit ? "disabled='disabled'" : "") + '>';
                                html += '	<select name="weekIndex" lay-verify="" lay-filter="week"  disabled="disabled" >';
                                html += '<option value="0">请选择</option>';
                                html += '<option value="1" ' + (v.weekIndex == 1 ? 'selected="selected"' : '') + '>周一</option>';
                                html += '<option value="2" ' + (v.weekIndex == 2 ? 'selected="selected"' : '') + '>周二</option>';
                                html += '<option value="3" ' + (v.weekIndex == 3 ? 'selected="selected"' : '') + '>周三</option>';
                                html += '<option value="4" ' + (v.weekIndex == 4 ? 'selected="selected"' : '') + '>周四</option>';
                                html += '<option value="5" ' + (v.weekIndex == 5 ? 'selected="selected"' : '') + '>周五</option>';
                                html += '<option value="6" ' + (v.weekIndex == 6 ? 'selected="selected"' : '') + '>周六</option>';
                                html += '<option value="7" ' + (v.weekIndex == 7 ? 'selected="selected"' : '') + '>周日</option>';
                                html += ' </select>';
                                html += '</div></div>';
                                html += '<div class="inpbox vselect classtime">';
                                html += '<input class="isclick timeinput1 rangetime" name="times" value="' + vv.start + ' - ' + vv.end + '" type="text" placeholder="H点m分"   autocomplete="off"/>';
                                html += '</div>';
                                html += '<div class="addbtn"><span></span></div>';
                                html += '</div>';
                            });
                        });

                        $('#editbox .addlistt').before(html);
                        $('#editbox .timeinput1').each(function () {
                            timeRender($(this)[0]);
                        });
                        form.render();
                        $('.content56 .niceScrollbox').getNiceScroll().resize();
                    })

                } else {
                    //layer.msg("出错了，请刷新再尝试");
                }
            },
            error: function (errorMsg) {
                //layer.msg("出错了，请刷新再尝试");
            }
        });
    }
    function timeRender(obj) {
        laydate.render({
            elem: obj,
            type: 'time',
            theme:'coursedate',
            min: '06:00:00',
            max: '23:00:00',
            btns: ['clear', 'confirm'],
            trigger: 'click',
            format: 'HH:mm',
            range: true,
            done: function (value) {
                if (value != null && value != "") {
                    var arr = value.split(" - ")
                    var date1 = new Date('2020/01/01 ' + arr[0])
                    var date2 = new Date('2020/01/01 ' + arr[1])
                    var date3 = date2.getTime() - date1.getTime();//毫秒数
                    if (date3 < 1 * 60 * 60 * 1000) {
                        layer.msg('每堂课最少1小时');
                        $(this.elem).val('')
                    }
                    if (date3 > 3 * 60 * 60 * 1000) {
                        layer.msg('每堂课最多3小时');
                        //return;
                    }
                }
            }
        });
        //在每次动态生成laydate组件时, laydate框架会给input输入框增加一个lay-key="1",
        //这样就导致了多个laydate 的inpute框都有lay-key="1"这个属性。导致时间控件不起作用，
        //需要把动态生成的lay-key属性删除
        $(".timeinput1").removeAttr("lay-key");
    }
    //保存
    $(".ljlbtnpage a").eq(1).click(function () {
        saveClass()
    })
    //取消，关闭窗口
    $(".ljlbtnpage a").eq(0).click(function () {
        $('.content56 .ftitle span').click();
    })
    //创建
    $('.btn').click(function () {
        $('.content56').toggleClass('content29_1');
        $('.content56 .content32').toggle();
        $("#courseId").val(courseId);
        $('#editbox .timeinput1').each(function () {
            timeRender($(this)[0]);
        });
        $("#gradeId").empty();
        $("#bookId").val(bid);
        copyClassTable();
        $.each(courseData, function (index, element) {
            if (element.id == courseId) {
                var ids = element.gradeIds.split(',')
                $.each(ids, function (index, iten) {

                    //$("#gradeId").append(" <option value=" + iten + ">" + grade[parseInt(iten) - 1] + "</option>");
                    $.each(grade, function (m, n) {
                        if (n.gradeYearValue == iten)
                            $("#gradeId").append(" <option value=" + iten + ">" + n.gradeYearName + "</option>");


                    })

                })

                return;

            }
        })
        form.render();
    });

    lay('.timeinput1').each(function () {
        timeRender($(this)[0]);
    });
    // 搜索
    $('#search').on('click', function () {

        table.reload('studentList', {
            method: 'post'
          , where: {
              'classId': classId
          }
          , page: {
              curr: 1
          }
        });
    });
    $('.addlistt').on('click', function () {

        var lock = true;
        $.each($("#editbox input[name='times']"), function () {

            if ($(this).val().length < 1) {
                lock = false;
                return false;
            }
        })
        $.each($("#editbox select[name='weekIndex']"), function () {

            if ($(this).val().length < 1) {
                lock = false;
                return false;
            }
        })
        if (!lock) {
            layer.msg('请认真填写');
            return false;
        }
        var str = $('.content64').html();
        $(this).parents('.inpcont').find('.setimtlist:last').after(str);
        timeRender($(this).parents('.inpcont').find('.timeinput1:last')[0]);
        form.render();
        $('.content56 .niceScrollbox').getNiceScroll().resize();
    });
    function saveClass() {

        var data = {};
        data.className = $.trim($("#className").val());
        data.beginDate = $.trim($("#starttime").val());
        data.endDate = $.trim($("#endtime").val());
        data.grade = $.trim($("#gradeId").val());
        data.courseId = $("#courseId").val();
        data.teacherIds = xmSelectObj.getValue('valueStr');

        if (data.className == "") {
            layer.msg("班级名称不能为空")
            return
        }
        if (!isCheck) {
            layer.msg("班级名称不合法")
            return
        }

        if (data.beginDate == "") {
            layer.msg("开课日期不能为空")
            return
        }
        if (data.endDate == "") {
            layer.msg("结课日期不能为空")
            return
        }
        if (data.grade == "" || data.grade == "0") {
            layer.msg("年级必须选择")
            return
        }
        if (data.teacherIds == "") {
            layer.msg("请选择老师")
            return
        }
        var arr = data.teacherIds.split(',');
        if (arr != undefined && arr.length > max) {
            layer.msg("最多选择5个老师")
            arr.splice(max, arr.length - max);
            xmSelectObj.setValue(arr);
            return;
        }
        if (data.courseId == null || data.courseId == "" || data.courseId == "0") {
            layer.msg("课程必须选择")
            return
        }
        var msg = "";
        var isAble = true;
        var times = new Array();
        $.each($("input[name='times']"), function (index, ele) {
            if ($(this).val() == null || $(this).val() == '') {
                return;
            }
            var flag = checkTimes($(this).val());
            if (flag == false) {
                isAble = false;
                return
            }
            times.push($(this).val())
        })
        if (times.length == 0) {
            layer.msg("上课时间至少填一个")
            return
        }
        if (!isAble) {
            return;
        }
        console.log(JSON.stringify(times))
        msg = "";
        isAble = true;
        var weeks = new Array();
        $.each($("select[name='weekIndex']"), function (index, element) {

            var value = $(this).val();
            if (value == null || value == "" || value == "0")
                return;
            var i = index;
            $.each(weeks, function (m, ele) {
                if (ele == value && i != m) {
                    if (times[i] == undefined)
                        return;
                    var a = times[i].split(" - ");
                    var b = times[m].split(" - ");
                    if (!checkTime(a[0], a[1], b[0], b[1])) {
                        //layer.msg("时间段冲突[周"+value+"("+times[i]+")("+times[m]+")]");
                        msg = "时间段冲突[周" + value + "(" + times[i] + ")(" + times[m] + ")]";
                        isAble = false;
                        return;
                    }
                }
            })

            if (times[i] != undefined)
                weeks.push(value)
        })
        if (!isAble) {
            layer.msg(msg);
            return;
        }
        var obj = new Array();
        $.each(weeks, function (index, element) {
            var week = {};
            week.weekIndex = element;

            var time = times[index].split(" - ");
            week.beginTime = time[0];
            week.endTime = time[1];
            obj.push(week);
        })
        if (obj.length == 0) {
            layer.msg("必须选一节开课时间")
            return
        }
        data.timeList = obj;

        var winIndex = 0;
        $.ajax({
            url: '/Class/SaveClass',
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
                    layer.msg("保存成功", { icon: 1, time: 1000 }, function () {
                        $('.content56').toggleClass('content29_1');
                        $('.content56 .content32').toggle();
                    })

                } else {
                    alert(data.message);
                }
            },
            error: function (errorMsg) {
                alert("Err:" + JSON.stringify(errorMsg));
            },
            complete: function (XMLHttpRequest, status) {
                layer.close(winIndex);
            }
        });

    }

});

$("#className").blur(function () {
    var data = {};
    data.className = $.trim($("#className").val())
    data.classId = 0;
    if (data.className == "")
        return;
    $.ajax({
        url: '/Class/CheckClassName',
        type: "post",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.code == 200) {
                if (data.data == true)
                    isCheck = true;
                else
                    layer.msg("班级名字重复");

            } else {
                isCheck = false;
                layer.msg("出错了，请刷新再尝试");
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        }
    });
});
function checkTimes(value) {
    var arr = value.split(" - ")
    var date1 = new Date('2020/01/01 ' + arr[0])
    var date2 = new Date('2020/01/01 ' + arr[1])
    var date3 = date2.getTime() - date1.getTime();//毫秒数
    if (date3 < 1 * 60 * 60 * 1000) {
        layer.msg('每堂课最少1小时[' + value + ']');
        return false;
    }
    if (date3 > 3 * 60 * 60 * 1000) {
        layer.msg('每堂课最多3小时[' + value + ']');
        return false
    }
    return true;
}
function checkTime(a, b, x, y) {
    var times1 = [], times2 = [];
    if (a < b) {
        //未跨天
        times1.push([a, b]);
    } else {
        //跨天
        times1.push([a, "24:00"], ["00:00", b]);
    }

    if (x < y) {
        times2.push([x, y]);
    } else {
        times2.push([x, "24:00"], ["00:00", y]);
    }

    var flag = false;
    //循环比较时间段是否冲突
    for (var i = 0; i < times1.length; i++) {
        if (flag) break;
        for (var j = 0; j < times2.length; j++) {
            if (check(times1[i][0], times1[i][1], times2[j][0], times2[j][1])) {
                flag = true;
                break;
            }
        }
    }
    if (flag) {
        //alert("发生冲突");
        return false;
    } else {
        //alert("没有冲突");
        return true;
    }
}
function check(a, b, x, y) {
    if (y <= a || b <= x) {
        return false;
    } else {
        return true;
    }
}
function getDay() {
    var today = new Date();
    //var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    //today.setTime(targetday_milliseconds);
    var tYear = today.getFullYear();
    var tMonth = today.getMonth() + 1;
    var tDate = today.getDate();
    return tYear + "-" + tMonth + "-" + tDate;
}
function getEndDay() {
    var today = new Date();
    //var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    //today.setTime(targetday_milliseconds);
    var tYear = today.getFullYear();
    var tMonth = today.getMonth() + 2;
    var tDate = today.getDate();
    return tYear + "-" + tMonth + "-" + tDate;
}
function getGradeList() {
    $.ajax({
        url: '/Course/GetAllGradeYear',
        type: "post",
        data: { bookId: bookId },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {

                $("#gradeList").empty();

                var html = "<ul>";
                $(data.data).each(function (index, element) {
                    var temp = $("#gradeTemp").html();
                    temp = temp.replace("{0}", (curGrade == 0 ? (index == 0 ? "ljlactive" : "lihover") : (curGrade == element.gradeYearValue ? "ljlactive" : "lihover")));
                    temp = temp.replace("{1}", element.gradeYearName);
                    temp = temp.replace("{2}", "GetAllCourse('" + element.gradeYearValue + "')");
                    temp = temp.replace("{3}", element.courseCount);
                    if (curGrade == 0) {
                        curGrade = element.gradeYearValue;
                    }
                    html = html + temp;
                })
                html = html + "</ul>";
                $("#gradeList").html(html)
                //左一栏列表点击事件
                $('.content58 li').click(function () {
                    $(this).addClass('ljlactive').siblings().removeClass('ljlactive');
                })
                if (curGrade > 0) {
                    GetAllCourse(curGrade)
                }
            } else {
                alert(data.message);
            }
        },
        error: function (errorMsg) {
            alert("Err:" + JSON.stringify(errorMsg));
        }
    });
}
function GetCourse(id, obj) {
    $(".content5 .onlinebox label").text($(obj).text())
    bookId = id;
    getGradeList();
    GetAllCourse(curGrade);
}
function GetAllCourse(gradeYearValue) {
    $(".content61").hide();
    $(".content62").hide();
    curGrade = gradeYearValue;
    courseId = 0;
    var obj = {};
    obj.gradeYearValue = gradeYearValue
    obj.bookId = bookId;
    $.ajax({
        url: '/Course/GetAllCourse',
        type: "post",
        dataType: "json",
        data: obj,
        success: function (data) {
            if (data.code == 200) {
                $(".content60 .listbox").empty();
                var html = "<ul>"
                $(data.data).each(function (index, element) {
                    var temp = $("#courseTemp").html();
                    temp = temp.replace("{0}", (courseId == 0 ? (index == 0 ? "ljlactive" : "lihover") : (courseId == element.id ? "ljlactive" : "lihover")));
                    temp = temp.replace("{1}", element.courseName);
                    temp = temp.replace("{2}", element.bookName);
                    temp = temp.replace("{3}", "GetCourseInfo('" + element.id + "','" + element.bookId + "')");
                    if (courseId == 0) {
                        courseId = element.id;
                        bid = element.bookId;
                    }
                    html = html + temp;
                })

                if (data.data.length == 0) {
                    html = html + "<li class='ljldatatext'><div class=\"labelkc\">没有课程</div></li>";
                }
                html = html + "</ul>";
                $(".content60 .listbox").html(html);
                if (courseId > 0) {
                    GetCourseInfo(courseId, bid);
                } else {
                    var obj = $(".content63 .niceScrollbox").find(".content65");
                    if (obj != null)
                        obj.remove();
                    $(".content63 .niceScrollbox").append("<div class='content65'></div>");
                }
                $('.content60 .listbox li').click(function () {
                    $(this).addClass('ljlactive').siblings().removeClass('ljlactive');
                })
                $('.content5 .niceScrollbox').getNiceScroll().resize();
            } else {
                alert(data.message);
            }
        },
        error: function (errorMsg) {
            alert("Err:" + JSON.stringify(errorMsg));
        }
    });
}
function GetCourseInfo(id, book) {
    $(".content61").show();
    $(".content62").show();
    $(".content65").hide();
    bid = book;
    var obj = {};
    obj.courseId = id
    courseId = id;
    $.ajax({
        url: '/Course/GetCourseById',
        type: "post",
        dataType: "json",
        data: obj,
        success: function (data) {
            if (data.code == 200) {
                //console.log(JSON.stringify(data))
                var course = data.data;
                var content = $(".content61 .contr");
                content.find(".titl .textbox").html(course.courseName + "(共" + course.lessonList.length + "课时)")
                $("#fm").attr("src", course.cover == null || course.cover == "" ? "/Content/images/fm.png" : course.cover);
                $.each(content.find(".info  span"), function (index, element) {
                    if (index == 0) {
                        $(this).text(course.bookName);
                    }
                    if (index == 1) {
                        $(this).text(course.courseLeader);
                    }
                    if (index == 2) {
                        $(this).text(course.fitGrade);
                    }
                })
                $("#downInfo").parents('.list').show();
                if (course.fileList != null) {
                    var ht = "";
                    $.each(course.fileList, function (index, element) {
                      
                        ht = ht + "<a href=\"" + element.FileUrl + "\" class=\"divideclass\" style='border-right:0px' target='_blank'>" + element.FileName + "</a>" + "、";
                     
                    })
              
                    $("#downInfo").html(ht.substr(0,ht.length-1))
                } else {
                    $("#downInfo").parents('.list').hide();
                }
                content.find(".list .line2").html(course.courseContent)
                $.each(content.find(".info1  span"), function (index, element) {
                    if (index == 0) {
                        $(this).text(course.studentCount);
                    }
                    if (index == 1) {
                        var useClass = "未建班级";
                        if (course.useClass != null && course.useClass != "")
                            useClass = course.useClass;
                        $(this).html(useClass);
                    }
                })
                $(".content62 .contbox").empty();
                if (course.lessonList.length > 0) {
                    var html = '';
                    $.each(course.lessonList, function (index, element) {
                        var status = element.statusName;
                        if (index == 0) {
                            html = html + '<div class="list userlist active"><div class="objname"><div class="nametext line1">' + "第" + element.index + "课时&nbsp;&nbsp;" + element.lessonName + status + '</div> 12345</div></div>';
                        } else {
                            html = html + '<div class="list"><div class="objname"><div class="nametext">' + "第" + element.index + "课时&nbsp;&nbsp;" + element.lessonName + status+'</div> 12345</div></div>';
                        }
                    })
                    $(".content62 .contbox").html(html);
                    $('.content63 .niceScrollbox').getNiceScroll().resize();
                }
            } else {
                alert(data.message);
            }
        },
        error: function (errorMsg) {
            alert("Err:" + JSON.stringify(errorMsg));
        }
    });
}
function getMonthDay(year, month) {
    let days = new Date(year, month, 0).getDate()
    return days
}
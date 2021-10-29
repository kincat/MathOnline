$(function () {
    $("#studentBtn").click(function () {
        selectStudent();
    })
    $("#studentCancle").click(function () {
        $('.content73 .ftitle span').click();
    })
    $('.content73 .maskbox').click(function () {
        $('.content73').toggleClass('content73_1');
        $('.content73 .maskbox').toggle();
    })
    $('.content73 .ftitle span').click(function () {
        $('.content73').toggleClass('content73_1');
        $('.content73 .maskbox').toggle();
    });
    $('.content73 thead span.selspan').click(function () {
        if ($(this).hasClass('activepsan')) {
            $('.content73 span.selspan').removeClass('activepsan');
        } else {
            $('.content73 span.selspan').addClass('activepsan');
        }
    });
    $('.content73 td .selspan').click(function () {
        $(this).toggleClass('activepsan');
        if ($('.content73 tbody span.activepsan').length < $('.content73 tbody span.selspan').length) {
            $('.content73 thead span.selspan').removeClass('activepsan');
        } else {
            $('.content73 thead span.selspan').addClass('activepsan');
        }
    })
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
    $('.content53 li').click(function () {
        $(this).addClass('ljlactive').siblings().removeClass('ljlactive');
    })
    $('.content55 .ftitle span').click(function () {
        $('.content55').toggleClass('content29_1');
        $('.content55 .content32').toggle();
    })
    $('.content55 .content55').click(function () {
        $('.content55').toggleClass('content29_1');
        $('.content55 .content32').toggle();
    })
    $('.content55 .content32').click(function () {
        $('.content55').toggleClass('content29_1');
        $('.content55 .content32').toggle();
    })
    $('.content54 .tabbox a').click(function () {
        $(this).addClass('ljlactive').siblings().removeClass('ljlactive');
        $('.tabcont').find('.tablist').eq(1 - $(this).index()).show().siblings().hide();
    })


    $(".content56").delegate(".addbtn", "click", function () {
        var max = 4;
        if (!isCreate)
            max = 2;
        if ($('.setimtlist').length > max) {
            $(this).parents('.setimtlist').remove();
        }
    });

    $('.content4 .allclasslist a').click(function () {
        $('.content4 .allclasslist').hide();
    })
    $('.content4 .allclass').hover(function () {
        $('.content4 .allclasslist').show();
    }, function () {
        $('.content4 .allclasslist').hide();
    })

    $('.content56 .ftitle span').click(function () {
        $('.content56').toggleClass('content29_1');
        $('.content56 .content32').toggle();
    })
    $('.content56 .content32').click(function () {
        $('.content56').toggleClass('content29_1');
        $('.content56 .content32').toggle();
    })
    $(".ljlbtnpage a").eq(1).click(function () {
        saveClass()
    })
    $(".ljlbtnpage a").eq(0).click(function () {
        $('.content56').toggleClass('content29_1');
        $('.content56 .content32').toggle();
    })
    getClass();

    $(".contentTempClass  .contbox .inpbox em").off('click').on('click',function () {
        if ($("#tempClassName").attr('isedit') == '1')
            return;
        $(".contentTempClass  .contbox .inpbox em").removeClass('ljlactive');
        $(this).addClass('ljlactive');
        $(".weekData").text($(this).attr('week'));
        $('#courseTime').text($(this).attr('time'));
        timeInputInit();
        tempTimeRender($('#temptime'));
    })
    $(".contentTempClass  .contbox .inpbox span").off('click').on('click',function () {
        $(this).prev().click();
    })
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
function timeInputInit() {
    $('#temptimeinput').empty();
    $('#temptimeinput').html('<input class="isclick timeinput1 rangetime" type="text" name="times" id="temptime" placeholder="H点m分" autocomplete="off" />');
}

var max = 5

var xmSelectObj;
var studentSelectObj = xmSelect.render({
    el: '#studentIds',
    data: []
})
var xmSelect;
var form;
var laydate;
var dropdown;
layui.config({
    base: '/Scripts/layui/lay/modules/'
}).use(['dropdown'], function () {
      dropdown = layui.dropdown;
    
});
layui.use(['form', 'table', 'laydate', 'xmSelect', 'dropdown'], function () {

    var table = layui.table;
    laydate = layui.laydate;
    form = layui.form;
    xmSelect = layui.xmSelect;
  
    form.render('select');
    xmSelectObj = xmSelect.render({
        el: '#teacherIds',
        max: 5,
        maxMethod(seles, item) {
            //console.log(item.name+"------------")
            alert(`${item.name}不能选了,最多选择5个老师`)
            ///if (item.name!=undefined)
              //layer.msg(`${item.name}不能选了,最多选择5个老师`)
        },
        model: {
            label: {
                type: 'block',
                block: {
                    //最大显示数量, 0:不限制
                    showCount: 3,
                    //是否显示删除图标
                    showIcon: true,
                }
            }
        },
        // tips: false,
        // toolbar:false,
        data: JSON.parse(teacherData)
    })
   
    table.render({
        elem: '#studentList',
        url: '/Student/GetClassStudentList',
        height: 'full-340',
        cellMinWidth: 80,
        method: 'post',
        limit: 15,
        page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
            layout: ['prev', 'page', 'next', 'count'], //自定义分页布局
            curr: 1, //设定初始在第 5 页
            groups: 5, //只显示 1 个连续页码
            //first: true, //不显示首页
            //last: true, //不显示尾页
            next: '下一页',
            prev: '上一页'

        },
        done: function (res, curr, count) {
            now = res.serverTime;
            userCount = count;
            if (res.count > 0 && res.data.length > 0) {
                $(".layui-table-box").removeClass('nodatatable');
                if (res.data[0].classId != classId)
                    $(".layui-table tr").hide();
            } else {
                $(".layui-table-box").addClass('nodatatable');
            }
           //var tableData1 = res;
            dropdown.suite();
            //for (var i = 0; i < tableData1.data.length; i++) {
            //    dropdown.onFilter("ft" + tableData1.data[i].id, function (event) {
            //        var arr = event.split("-");
            //        switch (arr[1]) {
            //            case "user":

            //                break;
            //            case "assets":

            //                break;
            //            case "target":

            //                break;
            //            case "funding":

            //                break;
            //        }
            //    });
            //}
     
        }, where: {
            classId: classId
        },
        cols: [
            [{
                //field: 'id',
                type: 'numbers',
                width: 40,
                title: '序号',
                align: 'center'

            }, {
                field: 'studentNo',
                hide: true,
                width: 110,
                title: '学号',
                align: 'center'
            }, {
                field: 'userAccount',
                cellMinWidth: 110,
                title: '账号',
                align: 'center'
            }, {
                field: 'userName',
                width: 110,
                title: '姓名',
                align: 'center'
            }, {
                field: 'sexName',
                width: 100,
                title: '性别',
                align: 'center'
            }, {
                field: 'grade',
                title: '学段',
                width: 100,
                align: 'center'
            }, {
                field: 'attendanceRate',
                width: 80,
                hide: true,
                title: '出勤率',
                align: 'center'
            }, {
                field: 'studyProcess',
                hide: true,
                cellMinWidth: 80,
                title: '学习进度',
                align: 'center'
            }, {
                field: 'coin',
                width: 100,
                title: '金币',
                align: 'center'
            }, {
                field: 'mark',
                hide: true,
                width: 80,
                title: '积分',
                align: 'center'
            }, {
                field: 'createTime',
                width: 170,
                title: '入学时间',
                align: 'center'
            }, {
                field: 'finishTime',
                width: 170,
                title: '到期时间',
                align: 'center'
            }, {
                field: 'lastLoginTime',
                width: 170,
                title: '最近登录',
                align: 'center'
            }, {
                field: 'statusName',
                width: 90,
                title: '状态',
                templet: function (d) {
                    //return '<a class="statusdiv"><i></i>正常</ a>';
                    //return '<a class="statusdiv stop outtime"><i></i>停用</ a>';
                    if (d.statusName == '正常')
                        return '<a class="statusdiv" style="color:#007EFF">正常</ a>';
                    if (d.statusName == '停用')
                        return '<a class="statusdiv" style="color:#EE2B06"><i></i>停用</ a>';
                    return "";
                },
                align: 'center'
            },
            {
                title: '操作',
                width: 210,
                toolbar: '#barDemo',
                align: 'center'
            }]
        ]
    });
    table.on('tool(studentList)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        studentId = data.id;
        if (layEvent === 'allotClass') { //调配班级    
            $(".content51 .username").html(data.userName + "<em>(" + data.grade + ")</em>")
            $(".content51 .userconfig").find("span").html(data.regTime)
            $(".content51 .userconfig").find("em").html(data.finishTime)
            $("#courseInfo").find("span").html(courseName + "(" + lessonCount + "课时)")
            allotClass();
            $(".classbox").html("");
            getOtherClass(data.classId);
            return false;

        } else if (layEvent == 'stop') {
            var winIndex = layer.confirm('您确认要禁用该学生[' + data.userName + ']吗？', {
                btn: ['否', '是'] //按钮
            }, function () {
                layer.close(winIndex);
            }, function () {
                stopStudent();
                layer.close(winIndex);
            });

        } else if (layEvent == 'start') {
            var winIndex = layer.confirm('您确认要启用该学生[' + data.userName + ']吗？', {
                btn: ['否', '是'] //按钮
            }, function () {
                layer.close(winIndex);
            }, function () {
                startStudent();
                layer.close(winIndex);
            });
        } else if (layEvent == 'remove') {
            var winIndex = layer.confirm('您确认要移除该学生[' + data.userName + ']吗？', {
                btn: ['否', '是'] //按钮
            }, function () {
                layer.close(winIndex);
            }, function () {
                removeStudent();
                layer.close(winIndex);
            });
        } else if (layEvent == 'study') {
            window.location = '/Task/Index?studentId=' + studentId + '&classId='+classId+'&flag=4';
        } else if (layEvent == 'unLock') {
            window.location = '/Task/Index?studentId=' + studentId + '&classId=' + classId + '&flag=7';
        }
    });
    form.on('select(grade)', function (data) {
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
    form.on('select(book)', function (data) {
        //curGrade = $("#gradeId").val();
        courseInit();
    });
    form.on('select(week)', function (data) {
        if (data.value == 0)
            return;
        var parent = $(data.elem).parents('.setimtlist');
        var obj = parent.find('.rangetime');
        timeRender(obj[0])
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
                //if (iDays < getMonthDay(start.getFullYear(), start.getMonth() + 1) - 1)
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
                //if (iDays < getMonthDay(new Date($('#starttime').val()).getFullYear(), new Date($('#starttime').val()).getMonth() + 1) - 1)
                if (iDays <2) {
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
    laydate.render({
        elem: '#classDate',
        value: getDay(),
        format: 'yyyy-MM-dd',
        min: getDay(),
        max: getAddDay(getDay(), 6),
        showBottom: false,
        //range: true,
        done: function (value) {

            $('#classDate').val(value);
        }
    });
    $('.content57').click(function () {
        //创建班级
        isCreate = true;
        $(".ljlbtnpage a").eq(1).text("创 建")
        $(".content56 .ftitle .fl").text("创建班级");
        $('.content56').toggleClass('content29_1');
        $('.content56 .content32').toggle();
        $("#className").val('');
        $("#starttime").val('');
        $("#endtime").val('');
        $("#endtime").val('');
        $("#gradeId").removeAttr("disabled");
        $("#courseId").removeAttr("disabled");
        $("#bookId").removeAttr("disabled");
        $("#gradeId").val(0)
        $("#bookId").val('')
        xmSelectObj.setValue([]);
        $("#courseId").val('');
        var html = "";
        $('#editbox').find('.setimtlist').remove();
        var html = $(".content64").html();
        $('#editbox .addlistt').before(html + html + html);
        $.each($("#editbox select[name='weekIndex']"), function () {
            $(this).val('');
        })
        $('#editbox .timeinput1').each(function () {
            timeRender($(this)[0]);
        });
        form.render();
        if (isCreate) {
            $("#mod_select").show();
            $.ajax({
                url: '/Class/GetClassItem',
                type: "post",
                dataType: "json",
                data: { classId: classId },
                success: function (data) {
                    if (data.code == 200) {
                        $(".mod_select .option").empty();
                        $("#select_value").val('');
                        $(".select_txt").text('请选择课表模板（创建班级的时候可用）');
                        $(".select_txt").css("color", "#D9D9D9")
                        
                        $.each(data.data, function (index, e) {
                            $(".mod_select .option").append("<a href='javascript:;' data-value='" +JSON.stringify(e.value) + "' data-flag='" + e.flag + "'>" + e.key + "</a>");
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
    })
    //lay('.timeinput1').each(function () {
    //    timeRender($(this)[0]);
    //});
    // 搜索
    $('#search').on('click', function () {
        table.reload('studentList', {
            method: 'post'
            , where: {
                'classId': classId
            }
            , page: {
                curr: 1
            }, done: function (res, curr, count) {
                 
                now = res.serverTime;
                userCount = count;
                if (res.count > 0 && res.data.length > 0) {
                    if (res.data[0].classId != classId) {
                        $.each($(".layui-table tr"), function (index, v) {
                            if (index > 0)
                                $(this).hide();
                        })
                    }
                    $(".layui-table-box").removeClass('nodatatable');
                }  else {
                    $(".layui-table-box").addClass('nodatatable');
                }
                dropdown.suite();
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
        
            if ($(this).val()==null||$(this).val().length < 1) {
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
        var index = 0;
        $.each($("#editbox .addbtn"), function () {
            if (isCreate) {
 
                if (index > 2) {
                    $(this).find('span').removeAttr("title");
                }
            }
            index++;
        });
    });

});
function editClass() {
    $.ajax({
        url: '/Class/GetClassByClassId',
        type: "post",
        dataType: "json",
        data: { classId: classId },
        success: function (data) {
            if (data.code == 200) {
                editClassInfo(data.data)

            } else {
 
                layer.msg("出错了，请刷新再尝试");
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        }
    });
}
function courseInit() {
    $("#courseId").empty();
    $.each(courseData, function (index, element) {

        var ids = element.gradeIds.split(',')

        if ($.inArray($("#gradeId").val(), ids) != -1 && ($("#bookId").val() == "" || $("#bookId").val() == element.bookId)) {
            $("#courseId").append(" <option value=" + element.id + ">" + element.courseName + "</option>");
        }
    })
    form.render('select');
}
function editClassInfo(editData) {
   
    //编辑班级
    isCreate = false;
    $(".ljlbtnpage a").eq(1).text("保 存");
    $(".content56 .ftitle .fl").text("编辑班级");
    $('.content56').toggleClass('content29_1');
    $('.content56 .content32').toggle();
    $("#className").val(editData.className);
    $("#starttime").val(editData.beginDate);
    $("#endtime").val(editData.endDate);
    $("#gradeId").val(editData.grade)
    $("#mod_select").hide();
    xmSelectObj = xmSelect.render({
        el: '#teacherIds',
        max: 6, 
        maxMethod(seles, item) {
           
        },
        model: {
            label: {
                type: 'block',
                block: {
                    //最大显示数量, 0:不限制
                    showCount: 3,
                    //是否显示删除图标
                    showIcon: true,
                }
            }
        },
        // tips: false,
        // toolbar:false,
        data: JSON.parse(teacherData)
    })
    var arr = editData.teacherIds.split(",");
    xmSelectObj.setValue(editData.teacherIds.split(","));
    xmSelect.render({
        el: '#teacherIds',
        max: 5,
        model: {
            label: {
                type: 'block',
                block: {
                    //最大显示数量, 0:不限制
                    showCount: 3,
                    //是否显示删除图标
                    showIcon: true,
                }
            }
        }      
    })
    courseInit();
    $("#courseId").val(editData.courseId);
    $.each(courseData, function (index, element) {
       
        if (editData.courseId == element.id) {
            $("#bookId").val(element.bookId)
        }
    })

    //编辑课程不允许修改课程
    $("#courseId").attr("disabled", "disabled");
    if (editData.userCount > 0) {
        $("#gradeId").attr("disabled", "disabled");
       // $("#courseId").attr("disabled", "disabled");
        $("#bookId").attr("disabled", "disabled");
    } else {
        $("#gradeId").removeAttr("disabled");
        //$("#courseId").removeAttr("disabled");
        $("#bookId").removeAttr("disabled");
    }
    var html = "";
    var tableList = JSON.parse(classData.classTable);
    if (tableList.length > 0) {
        $('#editbox').find('.setimtlist').remove();
    }
    var nowDate = new Date(now);
    var day = nowDate.getDay();
    if (day == 0)
        day = 7;
    $.each(tableList, function (k, v) {

        $.each(v.detail, function (kk, vv) {
            var isEdit = true;
            var ymh = nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate();
            var begin =ymh+" "+vv.start+":00";
            var end = ymh + " " + vv.end + ":00";
            if (day== v.weekIndex)
            {
                var df = dateDiffMinits(nowDate, begin);
                if (df < 10)
                {
                    isEdit = false;
                }
            }
            var temp = "(临时)";
            console.log(vv.isTemp);
            if (vv.isTemp == undefined || vv.isTemp == 0)
                temp = "";
            html += '<div class="setimtlist">';
            html += '	<div class="inpbox vselect classtime"> <div class="layui-form">';
            //html += '	<select name="weekIndex" lay-verify="" lay-filter="week"  ' + (!isEdit ? "disabled='disabled'" : "") + '>';
            html += '	<select name="weekIndex" lay-verify="" lay-filter="week"  disabled="disabled" >';
            html += '<option value="0">请选择</option>';
            html += '<option value="1" ' + (v.weekIndex == 1 ? 'selected="selected"' : '') + '>周一' + temp + '</option>';
            html += '<option value="2" ' + (v.weekIndex == 2 ? 'selected="selected"' : '') + '>周二' + temp + '</option>';
            html += '<option value="3" ' + (v.weekIndex == 3 ? 'selected="selected"' : '') + '>周三' + temp + '</option>';
            html += '<option value="4" ' + (v.weekIndex == 4 ? 'selected="selected"' : '') + '>周四' + temp + '</option>';
            html += '<option value="5" ' + (v.weekIndex == 5 ? 'selected="selected"' : '') + '>周五' + temp + '</option>';
            html += '<option value="6" ' + (v.weekIndex == 6 ? 'selected="selected"' : '') + '>周六' + temp + '</option>';
            html += '<option value="7" ' + (v.weekIndex == 7 ? 'selected="selected"' : '') + '>周日' + temp + '</option>';
            html += ' </select>';
            html += '</div></div>';
            html += '<div class="inpbox vselect classtime">';
            html += '<input class="isclick timeinput1 rangetime" name="times" value="' + vv.start + ' - ' + vv.end + '" type="text" placeholder="H点m分" ' + (!isEdit ? "disabled='disabled'" : "") + '  autocomplete="off"/>';
            html += '</div>';
            html += '<div class="addbtn" ' + (!isEdit? "style='display:none'" : "") + '><span></span></div>';
            html += '</div>';
        })
    })

    $('#editbox .addlistt').before(html);
    $('#editbox .timeinput1').each(function () {
        timeRender($(this)[0]);        
    });
    form.render();
    $('.content56 .niceScrollbox').getNiceScroll().resize();
}

 
function timeRender(objs) {
    var nowDate = new Date(now);
    var day = nowDate.getDay();
    if (day == 0)
        day = 7;
    var hour = "06";
    var parent = $(objs).parents('.setimtlist');
    var obj = parent.find('.rangetime');
    var newObj = obj.clone()
    obj.remove();
    parent.find('.classtime').eq(1).append(newObj);
    obj = parent.find('.rangetime');
    var select = parent.find('select');
    if (day == select.val() && isCreate==false) {
        //obj.val('');
        var h = nowDate.getHours();
        //if (h < 23)
        //    h = h + 1;
        hour = h > 9 ? h : "0" + h;
       
    }
    laydate.render({
        elem: obj[0],
        type: 'time',
        theme:'coursedate',
        min: hour + ':00:00',
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
                    obj.val('')
                }
                if (date3 > 3 * 60 * 60 * 1000) {
                    layer.msg('每堂课最多3小时');
                    obj.val('')
                }
            }
        }
    });   
    $(".timeinput1").removeAttr("lay-key");
}

function tempTimeRender(obj) {
   
    var isToday = false;
    var minTime = '06:00:00';
   
    if ($(".contentTempClass  .contbox .inpbox em").eq(0).hasClass('ljlactive') > 0) {
        isToday = true;
        var d = new Date();
        var m = d.getMinutes();
        var ms = m % 10;
        minTime = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ":" + ((m - ms) < 10 ? "0" + (m - ms) : (m - ms)) + ":00";
    }     
    laydate.render({
        elem: obj[0],
        type: 'time',
        theme: 'coursedate',
        min: minTime,
        max: '23:00:00',
        btns: ['clear', 'confirm'],
        trigger: 'click',
        format: 'HH:mm',
        range: true,
        done: function (value) {
            if (value != null && value != "") {
                var arr = value.split(" - ")
                var date1 = new Date('2020/01/01 ' + arr[0] + ":00")
                
                if (isToday) {
                    var date11 = new Date('2020/01/01 ' + minTime);
                    var date33 = date1.getTime() - date11.getTime();
        
                    if (date33 < 0) {
                        layer.msg('请选择分钟数');
                        timeInputInit();
                        $("#temptime").val("");
                        tempTimeRender($("#temptime"));                        
                        return;
                    }
                }
                var date2 = new Date('2020/01/01 ' + arr[1] + ":00")
                var date3 = date2.getTime() - date1.getTime();//毫秒数
                if (date3 < 1 * 60 * 60 * 1000) {
                    layer.msg('每堂课最少1小时');
                    timeInputInit();
                    $("#temptime").val("");
                    tempTimeRender($("#temptime"));
                    return;
                }
                if (date3 > 3 * 60 * 60 * 1000) {
                    layer.msg('每堂课最多3小时');
                    timeInputInit();
                    $("#temptime").val("");
                    tempTimeRender($("#temptime"));
                    return;
                }              
                //校验时间段 
                var timeStr = "";
                timeStr = $(".contentTempClass  .contbox .inpbox em.ljlactive").attr("time");
                if (timeStr != "暂无安排") {
                    var timeArray = timeStr.split(',');
          
                    var isOk = true;
                    for (let index = 0; index < timeArray.length; index++) {
                       
                        if (timeArray[index] == $(".oldTime").text())
                            continue;
                        var b = timeArray[index].split('~');
                        if (!checkTime(arr[0], arr[1], b[0], b[1])) {
                            layer.msg('该时间段[' + arr[0] + '~' + arr[1] + ']和已有课程[' + b[0] + '~' + b[1] + ']有冲突');
                            timeInputInit();
                            $("#temptime").val("");
                            tempTimeRender($("#temptime"));
                            isOk = false;
                            return;
                        }
                    }
                    
                    if (isOk == false) {
                        return;
                    }
                    
                }

                timeInputInit();
                $("#temptime").val(value);
                tempTimeRender($("#temptime"));
            }
        }
    });
   
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
function getAddDay(minDay,day) {
    minDay=minDay.replace(/-/g,"/");
    var today = new Date(minDay);
    today.setDate(today.getDate() + day);
    //var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    //today.setTime(targetday_milliseconds);
    var tYear = today.getFullYear();
    var tMonth = today.getMonth()+1;
    var tDate = today.getDate();
    console.log(tYear + "-" + tMonth + "-" + tDate)
    return tYear + "-" + tMonth + "-" + tDate;
}
//弹出窗口
function allotClass() {
    //alert(obj)
    // var data = JSON.parse(decodeURI(obj));
    $('.content55').toggleClass('content29_1');
    $('.content55 .content32').toggle();
}
$("#className").blur(function () {
    var data = {};
    data.className = $.trim($("#className").val())
    data.classId = classId;
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
function selectClass(n, obj) {
    //$(".allclass .allclasslist").hide();
    status = n;
    classId = 0;
    $(".content4 .allclass span").text($(obj).text())
    $(".content54 .contbox").hide();
    getClass();

}
//获取所有班级
function getClass() {
    var data = {};
    data.status = status;
    $.ajax({
        url: '/Class/GetClass',
        type: "post",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.code == 200) {
                var tmp = $("#classTemp").html();

                var cData = data.data;
                var html = "";
                var selectData = {};
                $(cData).each(function (index, element) {
                    var temp = tmp;
                    var className = "";
                    if (element.status != 1) {
                        if (element.status == 0)
                            className = "stoplist";
                        else
                            className = "endlist";
                    }
                    if (classId == 0 && index == 0)
                        classId = element.classId;
                    if (classId == element.classId) {

                        className = className + " ljlactive";
                        selectData = element;
                    }
                    temp = temp.replace("{0}", className);
                    temp = temp.replace("{1}", element.className);
                    temp = temp.replace("{2}", element.statusName);
                    temp = temp.replace("{3}", element.beginDate);
                    temp = temp.replace("{4}", element.endDate);
                    temp = temp.replace("{5}", "getClassInfo('" + encodeURI(JSON.stringify(element)) + "')");
                    html = html + temp;
                })
                $(".content53 .contbox").empty()
                if (html != "") {
                    $(".content53 .contbox").html("<ul>" + html + "</ul>");
                    $('.content53 .box .niceScrollbox').getNiceScroll().resize();
                } else {
               
                    html = "<ul><li class='ljldatatext'><div class=\"labelkc\">没有班级</div></li></ul>";
                    $(".content53 .contbox").html(html);
                    $('.content53 .box .niceScrollbox').getNiceScroll().resize();
                }
                $('.content4 .niceScrollbox').getNiceScroll().resize();
                $('.content53 li').off('click').on("click", function () {
                    $(this).addClass('ljlactive').siblings().removeClass('ljlactive');
                })
                if (cData.length > 0) {
                    getClassInfo(encodeURI(JSON.stringify(selectData)));
                    $(".content54 .contbox").show();
                    $(".content65").hide();
                } else {
                    $(".content54 .contbox").hide();
                    $(".content65").show();
         

                }


            } else {
                layer.msg("出错了，请刷新再尝试");
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        }
    });
}

//获取班级信息 
function getClassInfo(obj) {
    var data = JSON.parse(decodeURI(obj));
    classId = data.classId;
    if (!isFirst) {

        $('#search').click();
    }
    $("#editClass").hide();
    $("#addStudents").hide();    
    $("#stopClass").hide();
    $("#startClass").hide();
    isFirst = false;
    courseName = data.courseName;
    classData = data;
    lessonCount = data.courseItemCount;
    $(".content54 .clssinfo").find("em").html("ID:" + classId);
    $(".content54 .clssinfo").find("span").html(data.className + " | " + data.courseName + "");
    $('.content54 .clssinfo a').off('click').on("click", function () {
        //$(this).addClass('ljlactive').siblings().removeClass('ljlactive');
    })
    $(".content54 .dateinfo").find("em").eq(0).html(data.beginDate + "到" + data.endDate);
    $(".content54 .dateinfo").find("em").eq(1).html(data.gradeName);
    $(".content54 .dateinfo").find("em").eq(2).html(data.teacher);
    //$(".content54 .dateinfo").find("em").eq(3).html(data.statusName);
    //处理课表，默认空
    $(".schooltimetable table tr td .listbox").html('').removeClass('hasdata');
    $(".schooltimetable table tr td .listbox").append('<span></span>')
    $(".schooltimetable table tr td").removeClass('hasdata');

    if (data.status == 0) {
        $("#stopClass").hide();
        $("#startClass").show();
    }
    if (data.status == 1) {
        $("#editClass").show();
        $("#addStudents").show();
        $("#stopClass").show();
        $("#startClass").hide();
    }
    //alert(data.classTable)
    if (data.classTable == undefined)
        return;
    var tableData = JSON.parse(data.classTable);
    for (let i in tableData) {
        //获取列
        var weekIndex = tableData[i].weekIndex;
        if (weekIndex == 7)
            weekIndex = 0;
        //获取行
        let elementList = tableData[i].detail;
        for (let j in elementList) {
            var start = elementList[j].start;
            var arr = start.split(":");
            var row = 1;
            if (parseInt(arr[0]) >= 12) {
                row = 2;
            }
            var tempBtn = "";
            var type = elementList[j].isTemp;
            if (type == 1) {
                tempBtn = '[<a href="javascript:;" studentids="' + elementList[j].studentIds + '" date="' + elementList[j].tempDate + '" start="' + elementList[j].start + '" end="' + elementList[j].end + '" onclick="editTempClass(this)">编辑</a>]';
            }
            var td = $(".schooltimetable table").find("tr").eq(row).find("td").eq(weekIndex + 1);
            if (td.find("div").length > 0) {
                td.find("div").html(td.find("div").html() + "<span style='width:160px'>" + elementList[j].start + "~" + elementList[j].end + tempBtn + "</span>");
            }
            else {
                td.html('');
                td.html("<div class=\"listbox\"><span style='width:160px'>" + elementList[j].start + "~" + elementList[j].end + tempBtn + "</span></div>")
            }
            td.addClass("hasdata")
        }
    }



}
//获取所有班级
function getOtherClass(id) {
    var data = {};
    data.bookId = 0;
    data.gradeId = 0;
    data.classAllot = 0;
    data.studentId = studentId;
    data.status = 1;
    data.classId = id;

    $.ajax({
        url: '/Class/GetClass',
        type: "post",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.code == 200) {
                var tmp = $("#classListTemp").html();
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
                        t = t + "<span>" + z + "</span>"
                    })
                    temp = temp.replace("{4}", t);
                    temp = temp.replace("{5}", element.courseName);
                    temp = temp.replace("{6}", element.courseItemCount);//多少课时
                    temp = temp.replace("{7}", element.bookName);//教材
                    temp = temp.replace("{9}", element.studentCount);
                    temp = temp.replace("{10}", element.classId);
                    temp = temp.replace("{11}", element.status == 1 ? "emactive" : "");
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
                    $(".classbox").html("<div class='content65' style='margin-top:100px;height:500px'></div>");
                }

            } else {
                layer.msg("出错了，请刷新再尝试");
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        }
    });
}
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
    if (!isCreate)
        data.classId = classId;
    else {
        if (!isCheck) {
            layer.msg("班级名称不合法")
            return
        }
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
    var timesAble = new Array();
    $.each($("input[name='times']"), function (index, ele) {
        if ($(this).val() == null || $(this).val() == '') {
            return;
        }
        var flag = checkTimes($(this).val(), $("select[name='weekIndex']").eq(index).find("option:selected").text());
        if (flag == false) {
            isAble = false;
            return
        }
        times.push($(this).val())
        timesAble.push($(this).attr("disabled"))
    })
    if (times.length == 0) {
        layer.msg("上课时间至少填一个")
        return
    }
    if (!isAble) {
        return;
    }
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
        if (data.courseId > 0) {
            var nowDate = new Date(now)
            var ymh = nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate();
            var day = nowDate.getDay()
            if (day == 0)
                day = 7;
            if (element == day && timesAble[index] != "disabled" &&!isCreate) {

                var begin = ymh + " " + time[0] + ":00";
                var end = ymh + " " + time[1] + ":00";
                var df = dateDiffMinits(nowDate, begin);
                if (df < 0) {
                    //msg = "当日该时间段不可选择，[周" + week.weekIndex + "(" + time[0] + ")(" + time[1] + ")]";
                    msg = "周" + week.weekIndex + "[" + time[0] + "~" + time[1] + "]时间段不可选择，开始时间必须要大于当前时间";
                    isAble = false;
                    return;
                }
            }
        }
        week.beginTime = time[0];
        week.endTime = time[1];
        obj.push(week);
    })
    if (!isAble) {
        layer.msg(msg);
        return;
    }
    if (obj.length == 0) {
        layer.msg("必须选一节开课时间")
        return;
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
                if (isCreate) {
                    classId = data.data;
                    $('.content56').toggleClass('content29_1');
                    $('.content56 .content32').toggle();
                    getClass();
                    var saveWin = layer.confirm('班级创建成功,您可以先去备课。您的班级里还没有学生,也可以先添加学生。', {
                        btn: ['去备课', '添加学生'] //按钮
                    }, function () {
                        window.location = '/Prepare/Index?classId=' + classId;
                        layer.close(saveWin);
                    }, function () {
                        studentWin();
                        layer.close(saveWin);
                    });
                } else {
                    layer.msg("班级编辑成功", { icon: 1, time: 1000 }, function () {
                        $('.content56').toggleClass('content29_1');
                        $('.content56 .content32').toggle();
                        getClass();
                    });
                }
                //layer.msg("保存成功", { icon: 1, time: 1000 }, function () {
                //    $('.content56').toggleClass('content29_1');
                //    $('.content56 .content32').toggle();
                //    getClass();
                //});

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
function checkTimes(value,attr) {
    var arr = value.split(" - ");
    var date1 = new Date('2020/01/01 ' + arr[0]);
    var date2 = new Date('2020/01/01 ' + arr[1]);
    var date3 = date2.getTime() - date1.getTime();//毫秒数
    if (date3 < 1 * 60 * 60 * 1000 && attr.indexOf('临时')<0) {
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
//调班
function adjustClass(id, obj) {
    var winIndex = layer.confirm('您确认要调整班级吗？', {
        btn: ['否', '是'] //按钮
    }, function () {
        layer.close(winIndex);
    }, function () {
        confirmAdjustClass(id, obj, winIndex);

    });

}
function confirmAdjustClass(id, obj, layIndex) {
    var data = {};
    data.oldClassId = classId;
    data.classId = id;
    data.studentId = studentId;
    $.ajax({
        url: '/Class/AdjustClass',
        type: "post",
        dataType: "json",
        data: data,
        success: function (data) {
            layer.close(layIndex);
            if (data.code == 200) {
                $('#search').click();
                $(obj).closest(".classlist").slideUp(500);
                layer.msg("调整成功");

            } else {
                layer.msg(data.message);
            }
        },
        error: function (errorMsg) {
            layer.close(layIndex);
            layer.msg("出错了，请刷新再尝试");

        },
        complete: function (XMLHttpRequest, status) {
        }
    });
}
//移除学生
function removeStudent() {
    var data = {};
    data.classId = classId;
    data.studentId = studentId;
    $.ajax({
        url: '/Student/ClassStudentRemove',
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
//停用学生
function stopStudent() {
    var data = {};
    data.classId = classId;
    data.studentId = studentId;
    $.ajax({
        url: '/Student/ClassStudentStop',
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
    data.classId = classId;
    data.studentId = studentId;
    $.ajax({
        url: '/Student/ClassStudentUse',
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
//停用班级
function stopClass() {
    var data = {};
    data.classId = classId;
    var win = layer.confirm('您确认要停用该班级吗？', {
        btn: ['否', '是'] //按钮
    }, function () {
        layer.close(win);
    }, function () {
        layer.close(win);
        $.ajax({
            url: '/Class/StopClass',
            type: "post",
            dataType: "json",
            data: data,
            success: function (data) {
                if (data.code == 200) {
                    layer.msg("停用成功", { icon: 1, time: 1000 }, function () {
                        if (status == 1)
                            classId = 0;
                        getClass();
                    })
                } else {
                    layer.msg(data.message);
                }
            },
            error: function (errorMsg) {
                layer.msg("出错了，请刷新再尝试");
            },
            complete: function (XMLHttpRequest, status) {


            }
        });

    });

}
//启用班级
function startClass() {
    var data = {};
    data.classId = classId;
    var win = layer.confirm('您确认要启用该班级吗？', {
        btn: ['否', '是'] //按钮
    }, function () {
        layer.close(win);
    }, function () {
        layer.close(win);
        $.ajax({
            url: '/Class/StartClass',
            type: "post",
            dataType: "json",
            data: data,
            success: function (data) {
                if (data.code == 200) {
                    layer.msg("启用成功", { icon: 1, time: 1000 }, function () {
                        if (status == 0)
                            classId = 0;
                        getClass();
                    })
                } else {
                    layer.msg(data.message);
                }
            },
            error: function (errorMsg) {
                layer.msg("出错了，请刷新再尝试");
            },
            complete: function (XMLHttpRequest, status) {


            }
        });

    });

}
function getMonthDay(year, month) {
    let days = new Date(year, month, 0).getDate()
    return days
}
function dateDiffMinits(beginTime, endTime) {
    var beginDate = new Date(beginTime);
    var endDate = new Date(endTime);
    var diff = endDate.getTime() - beginDate.getTime();//时间差的毫秒数
    return Math.floor(diff / (60 * 1000));
}
function getStudents() {
    $("#myscorll .layui-table tbody tr").empty();
    $("#myscorll .selspan").removeClass('activepsan');
    var sex = 0;
    if ($("#sex").val() != '')
        sex = $("#sex").val();
    var grade = 0;
    if ($("#grade").val() != '')
        grade = $("#grade").val();
    var level = 0;
    if ($("#level").val() != '')
        level = $("#level").val();
    var key = $("#key").val();
    $.ajax({
        url: '/Student/GetOtherStudents',
        type: "post",
        dataType: "json",
        data: { classId: classId, sex: sex, grade: grade, level: level, key: key, isClass: 0 },
        success: function (data) {
            if (data.code == 200) {

                $(data.data).each(function (index, element) {
                    var level = "";
                    for (var i = 1; i <= 5; i++) {
                        if (i <= element.level)
                            level = level + ' <img src="/Content/images/actstar.png" />';
                        else
                            level = level + ' <img src="/Content/images/actstar1.png" />';

                    }
                    //defspan
                    var txt = $("<tr>"
                    + "<td><span   " + (element.status == "正常" ? "" : "style='display:none'") + " class=\"" + (element.status == "正常" ? "selspan" : "defspan") + "\" studentid=\"" + (element.status == "正常" ? element.studentId : 0) + "\"></span></td>"
                    + "<td>" + element.studentId + "</td>"
                    + "<td>" + element.studentName + "</td>"
                    + "<td>" + element.sex + "</td>"
                    + "<td>" + element.grade + "</td>"
                    + "<td>" + level + "</td>"
                     + "<td>" + element.status + "</td>"
                    + "</tr>");
                    $("#myscorll .layui-table tbody").append(txt);
                })               
            }
            //绑定任务学生
            StudentListBind();
        }
    })
}
function studentWin() {
    $("#sex").val('');
    $("#grade").val('');
    $("#level").val('');
    $("#key").val('');
    form.render('select');

    studentView()
}
function studentView() {
    getStudents();
    $('.content73 thead span.selspan').removeClass('activepsan');
    $('.content73').toggleClass('content73_1');
    $('.content73 .maskbox').toggle();
    $('.content73 .ftitle span').off('click').on('click', function () {
        $('.content73').toggleClass('content73_1');
        $('.content73 .maskbox').toggle();
    });
    $('.content73 .maskbox').off('click').on('click', function () {
        $('.content73').toggleClass('content73_1');
        $('.content73 .maskbox').toggle();
    })
    $('#myscorll thead span.selspan').off('click').on('click', function () {
       
        if ($(this).hasClass('activepsan') > 0) {
            $('.content73    .selspan').removeClass('activepsan');
        } else {
            $(this).addClass('activepsan');
            $('.content73    .selspan').addClass('activepsan');
        }
    });
}
//学生事件绑定
function StudentListBind() {  
    $('.content73 .maskbox').off('click').on('click',function () {
        $('.content73').toggleClass('content73_1');
        $('.content73 .maskbox').toggle();
    });
    $('.content73  .ftitle span').off('click').on('click', function () {
        $('.content73').toggleClass('content73_1');
        $('.content73 .maskbox').toggle();
    });   
    $('.content73 tbody td .selspan').off('click').on('click', function () {
        
        if ($(this).attr('studentid') == 0)
            return;
        $(this).toggleClass('activepsan');
        if ($('.content73 tbody span.activepsan').length < $('.content73 tbody span.selspan').length) {
            $('.content73 thead span.selspan').removeClass('activepsan');
        } else {
            $('.content73 thead span.selspan').addClass('activepsan');
        }
    })
}
//选择学生
function selectStudent() {
    var trs = $("#myscorll .layui-table tbody tr")
    var studentIds = new Array();
    $(trs).each(function () {
        var span = $(this).find('td span');
        var td = $(this).find('td');
        if (span.hasClass("activepsan") > 0) {
            studentIds.push(span.attr("studentid"));
        }
    })
    if (studentIds.length == 0) {
        layer.msg("请选择学生");
        return;
    }
    $.ajax({
        url: '/Class/StudentsJoinClass',
        type: "post",
        dataType: "json",
        data: { classId: classId, studentIds:studentIds},
        success: function (data) {
            if (data.code == 200) {
                $('.content73 .ftitle span').click();
                if (data.data == 1) {
                    //提示备课
                    var saveWin = layer.confirm(data.message, {
                        btn: ['关闭', '去备课'] //按钮
                    }, function () {
                        $('#search').click();
                        layer.close(saveWin);                    
                    }, function () {
                        window.location = '/Prepare/Index?classId=' + classId;
                        layer.close(saveWin);
                    });
                } else {
                    //无需备课
                    $('#search').click();
                    layer.msg(data.message);
    
                }


               
            } else {
                layer.msg("出错了，请刷新再尝试");
            }
        },
        error: function (errorMsg) {
            layer.msg("出错了，请刷新再尝试");
        }
    });       
}
function tempClassView(n) {
    var tableList = JSON.parse(classData.classTable);
    var classDay = $(".contentTempClass  .contbox .inpbox em");    
    var weekIndex = classDay.attr("week");
    if (weekIndex < 0)
        weekIndex=7
    if (weekIndex == 0)
        weekIndex = 7;
    
    var nextDay = parseInt(weekIndex) + 1;
    if (nextDay > 7)
        nextDay = 1;
    var time = "";
    var nextTime = "";
    console.log("weekIndex", weekIndex);
    console.log("nextDay", nextDay);
    $.each(tableList, function (k, v) {
        if (v.weekIndex == weekIndex) {
            $.each(v.detail, function (kk, vv) {
                time = time + (kk == 0 ? "" : ",") + vv.start + "~" + vv.end;
            })
            return;
        }
        if (v.weekIndex == nextDay) {
            $.each(v.detail, function (kk, vv) {
                nextTime = nextTime + (kk == 0 ? "" : ",") + vv.start + "~" + vv.end;
            })
            return;
        }
    })
    if (time == "")
        time = "暂无安排";
    if (nextTime == "")
        nextTime = "暂无安排";
    classDay.eq(0).attr("time", time);
    classDay.eq(1).attr("time", nextTime);
    $('#tempClassName').text($(".content53 ul .ljlactive .studenttype .myspan").text());
    

    $('.contentTempClass').toggleClass('contentTempClass_1');
    $('.contentTempClass .maskbox').toggle();
    $('.contentTempClass .ftitle span').off('click').on('click', function () {
        $('.contentTempClass').toggleClass('contentTempClass_1');
        $('.contentTempClass .maskbox').toggle();
    });
    $('.contentTempClass .maskbox').off('click').on('click', function () {
        $('.contentTempClass').toggleClass('contentTempClass_1');
        $('.contentTempClass .maskbox').toggle();
    })
    var btn = $(".contentTempClass  .contbox .inpbox em");
    btn.removeClass('ljlactive');
    btn.eq(n).addClass('ljlactive');
    $(".weekData").text(btn.eq(n).attr('week'));
    
    $('#courseTime').text(btn.eq(n).attr('time'));
}
 
function saveTempClass() {
    var temptime = $('#temptime').val();
    if (temptime=='') {
        layer.msg("请选择上课时间");
        return;
    }
    var studentIds = studentSelectObj.getValue('value');
    if (studentIds.length==0) {
        layer.msg("请选择班级学生");
        return;
    }
    $.ajax({
        url: '/Class/SaveTempClassTable',
        type: "post",
        dataType: "json",
        data: { classId: classId, times: temptime, studentIds: studentIds, week: $(".weekData").text() ,oldTime:$(".oldTime").text()},
        success: function (res) {
            if (res.code == 200) {                
                layer.msg("保存成功", { icon: 1, time: 1000 }, function () {
                    cancleTempClass();
                    getClass();
                })
            } else {

                layer.msg(res.message);
            }
        },
        error: function (errorMsg) {
            //layer.msg("出错了，请刷新再尝试");
        }
    });
}
function classWin() {
    $("#tempClassName").attr("isedit", 0);
    $("#temptime").removeAttr("disabled");
    $("#temptime").val('')
    $(".oldTime").text('')
    tempClassView(0);
    $(".contentTempClass  .contbox .inpbox em").eq(0).click();
    $.ajax({
        url: '/Student/GetStudentByClassId',
        type: "post",
        dataType: "json",
        data: { classId: classId },
        success: function (res) {
            if (res.code == 200) {
                studentSelectObj.update({
                    data: res.data
                });

            } else {

                //layer.msg("出错了，请刷新再尝试");
            }
        },
        error: function (errorMsg) {
            //layer.msg("出错了，请刷新再尝试");
        }
    });
}
function cancleTempClass() {
    $('.contentTempClass .ftitle span').click();
}
function editTempClass(obj) {
    $("#tempClassName").attr("isedit", "1");
 
    var temp = $(obj);
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var dateString = year + "/" + month + "/" + day;
    var start = new Date(temp.attr("date") + " " + temp.attr("start") + ":00");
    var end = new Date(temp.attr("date") + " " + temp.attr("end") + ":00");
    var arr = temp.attr("studentids").split(',');
    var dateDiff = end.getTime() - start.getTime();//时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (60 * 1000));//计算出相差天数
    if (date.getTime() - end.getTime() > 0) {
        layer.msg("不可以编辑");
        return;
    }
    if (dateString != temp.attr("date")) {
        tempClassView(1);
    } else {
        tempClassView(0);
       
    }
    timeInputInit();
    tempTimeRender($('#temptime'));
    if (dateString == temp.attr("date")) {
        if (date.getTime() - start.getTime() > 0) {
            $("#temptime").attr('disabled', 'disabled');
        }
    }
    
    $("#temptime").val(temp.attr("start") + ' - ' + temp.attr("end"));
    $(".oldTime").text(temp.attr("start") + '~' + temp.attr("end"))
    $.ajax({
        url: '/Student/GetStudentByClassId',
        type: "post",
        dataType: "json",
        data: { classId: classId },
        success: function (res) {
            if (res.code == 200) {
                var student = res.data;
                if (date.getTime() - start.getTime() > 0) {                   
                    $.each(student, function (k, v) {
                        if (arr.indexOf(v.value+"") != -1) {
                            v.disabled = true;
                        }
                    })
                }
                studentSelectObj.update({
                    data: student
                });
                studentSelectObj.setValue(arr);
            } else {

                //layer.msg("出错了，请刷新再尝试");
            }
        },
        error: function (errorMsg) {
            //layer.msg("出错了，请刷新再尝试");
        }
    });
}
function goPrepare() {
    window.location = '/Prepare/Index?classId=' + classId;
}
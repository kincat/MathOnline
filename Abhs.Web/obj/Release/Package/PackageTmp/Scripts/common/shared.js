function getTask() {
    $.ajax({
        url: '/Home/GetTask',
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                addTask(0, data.data.prepareCount);
                addTask(1, data.data.attendClassCount);
                addTask(2, data.data.classFinishCount);
                addTask(3, data.data.classManageCount);


            } else {
                //alert(data.message);
            }
        },
        error: function (errorMsg) {
            //alert("Err:" + JSON.stringify(errorMsg));
        },
        complete: function (XMLHttpRequest, status) {
            //layer.close(winIndex);
        }
    });
}
function addTask(n, count) {
    $(".headernav .lessonscont a").eq(n).find(".msgnum").remove();
    if (count > 0)
        $(".headernav .lessonscont a").eq(n).append('<div class="msgnum">' + count + '</div>');
}
$(function () {
    if (functionCode != '') {
        feedBackInits();
    }
    $('#quitLogin').click(function () {
        $.ajax({
            url: '/Home/LoginOut',
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    layer.msg('退出成功', {
                        icon: 4,
                        time: 1500 //2秒关闭（如果不配置，默认是3秒）
                    }, function () {
                        window.location = '/Home/Index';
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
    })
    setInterval(function () {
        getTask();
    }, 60000);
})

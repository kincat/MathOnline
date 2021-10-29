
document.write("<link href='/Content/css/base.css' rel='stylesheet'/>");


var $a = function (obj) {
    var tempObj = CreateObject();
    tempObj.currOjb = obj;
    tempObj.charArray = window.charPlace;
    return tempObj;
}

function CreateObject()
{
    var abhsObject = {

        // 当前绑定的控件
        currOjb: null,

        // 替换字符
        charArray: null,

        // 判断正确与否
        isRight: function () {

            var control = this.currOjb;

            // 标准答案
            var stanAnswer = AES.Decrypt($(control).attr("answer"));
            this.charArray.forEach(function (val) {
                stanAnswer = stanAnswer.replace(new RegExp(val.split("and")[0], 'g'), val.split("and")[1]);
            });


            // 学生答案
            var studentAnswer = this.simpleStudnetAnswer();

            var result = false;

            studentAnswer = studentAnswer.replace(/<img[^>]+?data-latex="([^"]+?)"[^>]*?>/gi, "$$$1$$").replace(/<sup[^>]*?>(.*?)<\/sup>/gi, "^$1").replace(/<sub[^>]*?>(.*?)<\/sub>/gi, "_$1");
            stanAnswer = stanAnswer.replace(/<img[^>]+?data-latex="([^"]+?)"[^>]*?>/gi, "$$$1$$").replace(/<sup[^>]*?>(.*?)<\/sup>/gi, "^$1").replace(/<sub[^>]*?>(.*?)<\/sub>/gi, "_$1");

            studentAnswer = studentAnswer.toUpperCase();
            stanAnswer = stanAnswer.toUpperCase();

            var arrInput = studentAnswer.split(/;|；/);
            var arrAnswer = stanAnswer.split(/;|；/);

            for (var i = 0; i < arrInput.length; i++) {
                for (var j = 0; j < arrAnswer.length; j++) {
                    if (arrInput[i] != "" && arrInput[i].replace(/\s+/g, "").toUpperCase() == arrAnswer[j].replace(/\s+/g, "").toUpperCase()) {
                        result = true;
                    }
                }
            }

            return result;
        },

        // 清洗过的学生答案
        simpleStudnetAnswer: function () {
            // 学生答案
            var inVal;
            if (this.currOjb.tagName == "INPUT") {
                inVal = $(this.currOjb).val().trim();
            }
            else {
                inVal = $(this.currOjb).html().trim();
            }

            inVal = inVal.replace(/<img[^>]+?data-latex="([^"]+?)"[^>]*?>/gi, "$$$1$$");
            inVal = inVal.replace(/<sub>/gi, "#sub#")
            .replace(/<\/sub>/gi, "#/sub#")
            .replace(/<sup>/gi, "#sup#")
            .replace(/<\/sup>/gi, "#/sup#")
            .replace(/(<[^<>]+?>)|(&nbsp;)| /gi, "")
            .replace(/#sub#/gi, "<sub>").replace(/#\/sub#/gi, "</sub>")
            .replace(/#sup#/gi, "<sup>").replace(/#\/sup#/gi, "</sup>");

            // 替换全角半角的字符
            // 替换字符集
            this.charArray.forEach(function (val) {
                inVal = inVal.replace(new RegExp(val.split("and")[0], 'g'), val.split("and")[1]);
            });

            return inVal;
        },

        // 正确答案 去除无效字符
        rightAnswer: function () {

            return AES.Decrypt($(this.currOjb).attr("answer"));
        },

        // 显示对错
        showRight: function()
        {
            if(this.isRight())
            {
                $(this.currOjb).addClass("inputRight");
            }
            else
            {
                $(this.currOjb).addClass("inputError");
            }

            this.setDisable();
        },

        // 不显示对错
        noShowRight: function () {
            $(this.currOjb).removeClass("inputRight");
            $(this.currOjb).removeClass("inputError");
            this.setNoDisable();
        },

        // 取消点击切换答案
        noClickShowAnswer: function () {
            $(this.currOjb).removeClass("clickChangeA");
            $(this.currOjb).css("cursor", "");
            this.setNoDisable();
        },

        // 禁止编辑
        setDisable: function () {
            if (this.currOjb.tagName == "INPUT") {
                this.currOjb.readOnly = true;
            }
            else {
                this.currOjb.setAttribute("contenteditable", "false");
            }
        },

        // 允许编辑
        setNoDisable: function () {
            if (this.currOjb.tagName == "INPUT") {
                this.currOjb.readOnly = false;
            }
            else {
                this.currOjb.setAttribute("contenteditable", "true");
            }
        },

        // 设置内容
        setValue: function(val)
        {
            if (this.currOjb.tagName === "INPUT") {
                $(this.currOjb).val(val);
            } else {
                $(this.currOjb).html(val);
            }
        },

        // 在输入框内按回车执行的动作
        enterNext: function () { }
    };
    return abhsObject;
}


//点击显示答案[填空题]...
function clickShowAnswer(lianxi) {            

    lianxi.find(".inputError").css("cursor", "pointer");
    lianxi.find(".inputError").addClass("clickChangeA");   

    lianxi.off('click');
    lianxi.on('click', ".clickChangeA", function () {
        $this = $(this);

        if ($this.get(0).tagName.toLowerCase() == "div" && $this.hasClass("inputError")) {
            $this.attr("InputValue", AES.Encrypt($this.html()));
            $this.html(AES.Decrypt($this.attr("answer")).replace("；", ";").split(";")[0]);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, $this[0]]);
            $this.removeClass("inputError").addClass("inputRight");

        } else if ($this.get(0).tagName.toLowerCase() == "input" && $this.hasClass("inputError")) {
            $this.attr("InputValue", AES.Encrypt($this.val()));
            $this.val(AES.Decrypt($this.attr("answer")).replace("；", ";").split(";")[0]);
            $this.val($this.val().replace("&gt", ">").replace("&lt", "<"));

            $this.removeClass("inputError").addClass("inputRight");
        } else if ($this.get(0).tagName.toLowerCase() == "div" && $this.hasClass("inputRight")) {
            $this.html(AES.Decrypt($this.attr("InputValue")));
            $this.removeClass("inputRight").addClass("inputError");
        } else {
            $this.val(AES.Decrypt($this.attr("InputValue")));
            $this.removeClass("inputRight").addClass("inputError");
        }
    });
}


// 需要替换的字符集
var charPlace = [
        "ＡandA", "ＢandB", "ＣandC", "ＤandD", "ＥandE", "ＦandF", "ＧandG", "ＨandH", "ＩandI", "ＪandJ", "ＫandK", "ＬandL", "ＭandM", "ＮandN", "ＯandO",
        "ＰandP", "ＱandQ", "ＲandR", "ＳandS", "ＴandT", "ＵandU", "ＶandV", "ＷandW", "ＸandX", "ＹandY", "ＺandZ", "ａanda", "ｂandb", "ｃandc", "ｄandd",
        "ｅande", "ｆandf", "ｇandg", "ｈandh", "ｉandi", "ｊandj", "ｋandk", "ｌandl", "ｍandm", "ｎandn", "ｏando", "ｐandp", "ｑandq", "ｒandr", "ｓands",
        "ｔandt", "ｕandu", "ｖandv", "ｗandw", "ｘandx", "ｙandy", "ｚandz", "１and1", "２and2", "３and3", "４and4", "５and5", "６and6", "７and7", "８and8",
        "９and9", "０and0", "＞and>", "&gt;and>", "＜and<", "&lt;and<", "％and%", "＝and=", "＋and+", "－and-", "：and:", "∶and:", "）and)", "（and(", "，and,", "−and-"];



// 检测客户端系统
function clientOs() {
    //return false;
    var os = function () {
        var ua = navigator.userAgent,
            isWindowsPhone = /(?:Windows Phone)/.test(ua),
            isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
            isAndroid = /(?:Android)/.test(ua),
            isFireFox = /(?:Firefox)/.test(ua),
            isChrome = /(?:Chrome|CriOS)/.test(ua),
            isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
            isPhone = /(?:iPhone)/.test(ua) && !isTablet,
            isPc = !isPhone && !isAndroid && !isSymbian;
        return {
            isTablet: isTablet,
            isPhone: isPhone,
            isAndroid: isAndroid,
            isPc: isPc
        };
    }();
    if (os.isAndroid || os.isPhone) {
        // 手机
        return "isPhone";
    } else if (os.isTablet) {
        // 平板
        return "isTablet";
    } else if (os.isPc) {
        // pc
        return "isPc";
    }
}



// 渲染蓝框
function BindInput() {

    // 将公式内的输入位置转换为可输入的INPUT（蓝色输入框） 并绑定特殊字符输入框
    $(".spanflagAnswers").each(function () {
        var alist = $(this).text().split(",");
        var ob = $(this).parent();

        var index = 1;
        alist.forEach(function (item) {
            findInput(ob, item, index);
            index++;
        });
    });

    // 修正蓝色筐宽度
    $(".fillblanks.quizPutTag").each(function () {
        //$(this).width($(this).parents(".math").css("width"));
    });
}

// 显示蓝框
function ShowBlues()
{
    // 将公式内的输入位置转换为可输入的INPUT（蓝色输入框） 并绑定特殊字符输入框
    $(".spanflagAnswers").each(function () {
        var alist = $(this).text().split(",");
        var ob = $(this).parent();

        var index = 1;
        alist.forEach(function (item) {
            findInput(ob, item, index);
            index++;
        });
    });
}

// 将占位符换成输入框
function findInput(ob, dt, index) {
    ob.find(".mrow").each(function () {
        if ((/^\[:[^:]+?:\]$/).test($(this).text()) && $(this).html().indexOf("input type") == -1) {
            var tmp = "";
            if (index < 10) {
                tmp = "00" + index;
            }
            else if (index < 100) {
                tmp = "0" + index;
            }
            else {
                tmp = index.ToString();
            }

            if ($(this).text().indexOf(tmp + "∗") > -1) {
                var w = $(this).width();
                if (w == 0) {
                    w = 60;
                }

                $(this).html("<input type='text' answer='{0}' class='fillblanks quizPutTag' style='width:{1}px;' />".format(dt, w));

                return false;
            }
        }
    });
}


// 绑定输入框的公式编辑面板mathjax3.0
function BindInputKeyup3() {

    //在输入框中使用Ctrl键，显示和隐藏公式编辑器...
    $("div.quizPutTag").keydown(function (event) {
        if (event.ctrlKey && event.which == 81) {

            if ($("#divGSInput:hidden").length > 0) {
                var h = $(this).height();
                var p = $(this).offset();
                $("#divGSInput").css({ "left": p.left, "top": p.top + h + 5, "background-color": $(this).css("background-color") }).slideDown();

                $("div.quizPutTag").attr("FocusInput", false);
                $(this).attr("FocusInput", true);
                UE.getEditor("myEditorContent").setContent($(this).html());
                UE.getEditor('myEditorContent').focus();
            } else {
                $("#divGSInput").slideUp();
            }
        }

        if (event.which == 27)
            $("#divGSInput").slideUp();
    }).click(function () {

        if ($(this).attr("FocusInput") == "false")
            $("#divGSInput").slideUp();

    });

    // 将公式内的输入位置转换为可输入的INPUT（蓝色输入框） 并绑定特殊字符输入框
    ShowInput3();

    // 蓝色输入框绑定字符选择面板
    if (inChar == null) {
        inChar = CharPanel(_Grade);
        inChar.id = "#in_char";

        // 初始化
        inChar.InItPanel();

        // 嵌入外部函数
        if (typeof window.selectAction === "function") {
            inChar.selectAction = selectAction;
        }
    }

    $("input.fillblanks").each(function () {
        inChar.Register($(this));
    });
}



//点击显示答案 mathjax3.0 [填空题]...
function clickShowAnswer3(lianxi) {

    lianxi.find(".inputError").css("cursor", "pointer");
    lianxi.find(".inputError").addClass("clickChangeA");

    lianxi.off('click');
    lianxi.on('click', ".clickChangeA", function () {
        $this = $(this);

        if ($this.get(0).tagName.toLowerCase() == "div" && $this.hasClass("inputError")) {
            $this.attr("InputValue", AES.Encrypt($this.html()));
            $this.html(AES.Decrypt($this.attr("answer")).replace("；", ";").split(";")[0]);
            MathJax.typeset();
            //MathJax.Hub.Queue(["Typeset", MathJax.Hub, $this[0]]);
            $this.removeClass("inputError").addClass("inputRight");

        } else if ($this.get(0).tagName.toLowerCase() == "input" && $this.hasClass("inputError")) {
            $this.attr("InputValue", AES.Encrypt($this.val()));
            $this.val(AES.Decrypt($this.attr("answer")).replace("；", ";").split(";")[0]);
            $this.val($this.val().replace("&gt", ">").replace("&lt", "<"));

            $this.removeClass("inputError").addClass("inputRight");
        } else if ($this.get(0).tagName.toLowerCase() == "div" && $this.hasClass("inputRight")) {
            $this.html(AES.Decrypt($this.attr("InputValue")));
            $this.removeClass("inputRight").addClass("inputError");
        } else {
            $this.val(AES.Decrypt($this.attr("InputValue")));
            $this.removeClass("inputRight").addClass("inputError");
        }
    });
}

// 显示蓝框mathjax3.0
function ShowInput3() {

    // 将公式内的输入位置转换为可输入的INPUT（蓝色输入框） 并绑定特殊字符输入框
    $(".spanflagAnswers").each(function () {
        var alist = $(this).text().split(",");
        var ob = $(this).parent();

        var index = 0;
      
        // 找到空格
        ob.find(".mjx-n").each(function () {

            if ($(this).text() == "₧") {
                
                let pattern = new RegExp("[\u4E00-\u9FA5]+");
                let len = 0;
                let val = AES.Decrypt(alist[index]).split(";")[0];
                for (i = 0; i < val.length; i++)
                {
                    let str = val.charAt(i);

                    // 中文
                    if (pattern.test(str)) {
                        len += 2;
                    }
                    else
                    {
                        len += 1;
                    }
                }


                let w = 40 + (len - 2) * 10;
                w = w < 40 ? 40 : w;

                $(this).html("<input type='text' answer='" + alist[index] + "' class='fillblanks quizPutTag' style='width:" + w + "px; margin-left:5px;margin-right:5px;' maxlength='" + (val.length + 5) + "'/>");
                index++;
            }
        });
    });
}
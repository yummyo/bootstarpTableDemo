//扩展时间方法
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,         //月份
        "d+": this.getDate(),          //日
        "h+": this.getHours(),          //小时
        "m+": this.getMinutes(),         //分
        "s+": this.getSeconds(),         //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()       //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//设置默认时间
function setDefaultDate(DOM, type) {
    //type 1开始时间 2 结束时间
    if (DOM) {
        let time = "", dateFormat = judgeDateFormat()['value'];
        if (dateFormat == "datetime") {
            if (type == 1) {
                time = new Date().Format("yyyy-MM-dd") + " 00:00:00"
            } else {
                time = new Date().Format("yyyy-MM-dd") + " 23:59:59"
            }
        } else if (dateFormat == "time") {
            if (type == 1) {
                time = "00:00:00"
            } else {
                time = "23:59:59"
            }
        } else {
            time = new Date().Format(dateFormat)
        }
        DOM.val(time);
    }
}
//封装ajax请求函数
function _call(url, sendObj, fun, type) {
    //type  如果存在为get请求 不存在默认post
    $.ajax({
        url: url,
        data: sendObj ? sendObj : "",
        type: type ? "GET" : "POST",
        success: res => {
            if (fun) fun(res);
        },
        error: (a, b, c) => {
            console.warn(a)
            console.warn(b)
            console.warn(c)
        }
    })
}
// 判断页面的日期格式
function judgeDateFormat() {
    // layer 日期格式
    let Format = {
            year: "yyyy",
            month: "yyyy-MM",
            date: "yyyy-MM-dd",
            time: "HH:mm:ss",
            datetime: "yyyy-MM-dd hh:mm:ss"
        },
        a = $("#fstartTime").attr("Format") ? $("#fstartTime").attr("Format") : "datetime";
    return {
        "name": a,
        "value": Format[a]
    };
}
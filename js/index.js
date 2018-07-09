var config = {
    "dataUrl" : "/api/history/GetHistoryHourByDate",
    "pageSize" : "20",
    "pagination" : false,
    "dateType" : "date",
    "title":[
        {
            "title" : "事件日期",
            "field" : "cadddate",
        },
        {
            "title" : "事件时间",
            "field" : "caddtime",
        },
        {
            "title" : "事件内容",
            "field" : "cbz",
        },
        {
            "title" : "所处泵房",
            "field" : "cpumpnamecc",
        },
        {
            "title" : "所属区域",
            "field" : "NAME",
        },
        {
            "title" : "事件类型",
            "field" : "calarmtypename",
        },
        {
            "title" : "事件级别",
            "field" : "ialarmlavel",
        },
        {
            "title" : "处置状态",
            "field" : "cstate",
            "formatter" : function(a){
                if(a ==1){
                    return `<span style="color: green;">已处理</span>`;
                }else if(a==0){
                    return `<span style="color: red;">未处理</span>`;
                }
            }
        },
        {
            "title" : "处置人",
            "field" : "handleOpera",
        },
        {
            "title" : "确认时间",
            "field" : "confirmdate",
            formatter:function (val) {
                if(!val){
                    return "-"
                }
                return numToDate(val)

            }
        },
        {
            "title" : "短信上报",
            "field" : "issms",
            "formatter" : function(a){
                if(a ==1){
                    return `<span style="color: green;">已上报</span>`;
                }else if(a==0){
                    return `<span style="color: red;">未上报</span>`;
                }
            }
        },
        // {
        //     "title" : "现场处理人员",
        //     "field" : "kk",
        // },
        {
            "title" : "进入泵站",
            "field" : "ll",
            formatter:function () {
                return `<button class="btn btn-warning d_search">进入泵站</button>`
            }
        }
    ],
},
    tableOption = {};
//设置默认时间格式
$("#fstartTime").attr("format",config['dateType']);
$(document).ready(function () {
    //默认时间
    setDefaultDate($("#fstartTime"),1);
    setDefaultDate($("#fendTime"),2);
    tableOption = {
        "url":config["dataUrl"],
        "pageSize":config['pageSize'],
        "title":config['title'],
        "pagination":config['pagination'],
    }
    new setTable($("#table_01"),tableOption).init();
});
"use strict"

class setTable {
    constructor(DOM, option = {}) {
        this.defaultOtion = {
            pageSize: 20
        };
        this.DOM = DOM;
        this.option = $.extend({}, this.defaultOtion, option);
    }

    init() {
        //默认查询
        // this.searchData();
        this.setTableDate();
        //绑定查询事件
        this.bindClick();
    }

    setTableDate(data) {
        let that = this;
        that.DOM.bootstrapTable({
            method: 'get',
            url: this.option.url,
            ajax: that.searchData.bind(that),
            dataType: 'json',
            striped: false,
            height: $("body").height() * 1 - $(".titlePadding").outerHeight() * 1-20,
            cache: false,
            pagination: this.option.pagination ? this.option.pagination : false,
            pageSize: this.option.pageSize,
            pageNumber: 1,
            pageList: ["All"],
            sortable: true,
            sortOrder: "asc",
            queryParamsType: 'limit',
            queryParams: params => {
                let value = null;
                if(!$("#fendTime").length > 0){
                    value= {
                        cpumpcode: $("#cpump").val(),
                        ddatetime: $("#fstartTime").val()
                    }
                }else{
                    value= {
                        cpumpcode: $("#cpump").val(),
                        starttime: $("#fstartTime").val(),
                        endtime: $("#fendTime").val(),
                    }
                }
                if($("#assetsManage").length > 0){
                    value= {
                        districtId: $("#district").val(),
                        startDate: $("#fstartTime").val(),
                        endDate: $("#fendTime").val(),
                        pageSize:24,
                        queryValue:$("#keyWord").val()
                    }
                }
                if (that.option.pagination) {
                    console.log(params)
                    value['pageSize'] = that.option.pageSize;
                    value['pageIndex'] = params.pageNumber ? params.pageNumber : 1;
                }
                return value
            },
            sidePagination: this.option.pagination ? 'server' : 'client',
            minimumCountColumns: 2,
            uniqueId: "ID",
            locale: 'zh-CN',
            columns: that.setColumnsData(that.option.title)
        });
    }
    //设置每列数据
    setColumnsData(data) {
        let that = this,
            Obj = [],
            defaultOption = {
                valign: 'middle',
                align: 'center'
            };
        $.each(data, (i, v) => {
            Obj.push($.extend({}, defaultOption, v))
    })
        return Obj;
    }
    //绑定单击事件
    bindClick() {
        //绑定查询事件
        let that = this;
        $(".d_search").click(() => {
            that.DOM.bootstrapTable('refresh', {
            url: that.option.url,
            pageNumber: 1
        })
        // that.searchData();
    });
    }
    //查询数据
    searchData(res) {
        //查询数据
        let that = this;
        _call(res['url'] + "?queryJson=" + JSON.stringify(res.data), {}, val => {
            if (val.Success) {
                //分页和不分页所传数据不同
                if(that.option.pagination){
                    let _val = {};
                    _val['rows'] = val['rows'];
                    _val['total'] = val['totalCount'];
                    _val['page'] = val['pageIndex'];
                    res.success(_val);
                }else{
                    res.success(val['rows']);
                }
            }
        }, 1)
    }
}

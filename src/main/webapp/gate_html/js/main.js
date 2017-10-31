/*加载左侧导航*/
function showLeft(){

    $('.content-left').load("tel/nav.html",function(){
        var currentPage = window.location.href.split("/lanlyc/gate_html/")[1];
        $(".content-left a").each(function(index, element) {
            var href = $(this).attr('href');
            if (href.indexOf(currentPage) >= 0) {
                $(this).parent("li").parent("ul").parent("li").addClass("open").addClass("opens");
                $(this).parent("li").parent("ul").show();
                $(this).addClass("active");
            }
        });
        if(currentPage.split('?')[0]=="gatePloe.html"){
        	$('ul#accordion').children('li').eq(2).addClass("open").addClass("opens")
        	$('ul#accordion').children('li').eq(2).children('ul').show();
        	$('ul#accordion ').children('li').eq(2).find("a").addClass("active");
            
        }
        var Accordion = function(el, multiple) {
            this.el = el || {};
            this.multiple = multiple || false;

            // Variables privadas
            var links = this.el.find('.link');
            // Evento
            links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
        };
        Accordion.prototype.dropdown = function(e) {
            var $el = e.data.el;
            $this = $(this),
                $next = $this.next();

            $next.slideToggle();
            $this.parent().toggleClass('open');

            if (!e.data.multiple) {
                $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
            };
        };

        var accordion = new Accordion($('#accordion'), false);
    });
}
// 加载头部
function showHeader(){
    $('.header').load("tel/header.html",function(){
    	
    	var img_path=getCookie("img").indexOf('http')!=-1?getCookie("img"):(urlpath+getCookie("img"));
    	$('#userImg').attr("src",img_path);
    	$('.admin_user').html(getCookie("user_name"));
        $('.header-imgs').click(function(){

            // 如果是小屏点击不响应
            if($('body').width()>=991) {
                //如果是大导航变成小导航
                if($('.content-right').hasClass("col-md-10")){
                    $(".header-logo").hide();
                    $(".header-imgs").css("margin-left",50);
                    $('.content-right').removeClass("col-md-10").addClass("col-md-11");
                    $('.content-left').removeClass("col-md-2").addClass("col-md-1");

                    $('.accordion>li>i').css("left","35%");
                    $('div.link span').hide();
                    $('div.link i').hide();
                    $('ul.submenu').addClass("small");

                }else {
                    $(".header-logo").show();
                    $(".header-imgs").css("margin-left",0);
                    $('.content-right').removeClass("col-md-11").addClass("col-md-10");
                    $('.content-left').removeClass("col-md-1").addClass("col-md-2");

                    $('.accordion>li>i').css("left",15);
                    $('div.link span').show();
                    $('div.link i').show();
                    $('ul.submenu').removeClass("small");
                }
            }else if($('body').width()<=768){
                //$(".header-logo").show();
                $('#accordion').toggle();

                if($('body').width()<=676) {
                    $(".content-right").removeClass("col-xs-12");
                    $('.content-left').css('width', 200);
                    $(".content-right").toggleClass("rightClick");

                }
            }

            $('.dataTables_scrollHeadInner').width("100%");;
            $('.dataTables_scrollHeadInner table').width("100%");
        });



        // 个人资料
        $('.dropdown img').click(function(){
            if($('li.dropdown').hasClass("open")){
                $("li.dropdown").removeClass('click');
            }else {
                $("li.dropdown").addClass('click');
            }
        });
        //任意地点的单击事件 取消其click class属性
        $(document).click(function(){
            if(!$('li.dropdown').hasClass("open")){
                $("li.dropdown").removeClass('click');
            }
        });

    });
}

var server=window.location.host+"/lanlyc/";

var urlpath = "http://"+server;


//cookie操作
function setCookie(name,value){
	var Days = 100000;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+ ";path=/lanlyc/";
}
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null){
		document.cookie= name + "="+''+";expires="+exp.toGMTString();
	}
}
//退出登录
function loginOut(){
	$.post(urlpath+'User/logout',{
		"token": getCookie('token')
	},function(res){
		if(res.code==200){
			location.href="login.html";
		}else if(res.code==2) {
			location.href="login.html";
		}
	});
} 



// datatables 默认参数
var CONSTANT = {
    DATA_TABLES : {
        DEFAULT_OPTION : { //DataTables初始化选项
            "scrollY": false,//dt高度
            //"lengthMenu": [
            //    [10, 2, 10, -1],
            //    [1, 2, 10, "All"]
            //],//每页显示条数设置
            "lengthChange": false,//是否允许用户自定义显示数量
            "bPaginate": true, //翻页功能
            "bFilter": false, //列筛序功能
            "searching": false,//本地搜索
            "ordering": false, //排序功能
//            "Info": true,//页脚信息
            "paging": true,
            "serverSide": true,   //启用服务器端分页

            "autoWidth": true,//自动宽度
            "bDestroy": true,
            "oLanguage": {//国际语言转化
                "oAria": {
                    "sSortAscending": " 以升序排列此列",
                    "sSortDescending": " 以降序排列此列"
                },
                "sLengthMenu": "显示 _MENU_ 记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sEmptyTable": "未有相关数据",
                "sLoadingRecords": "正在加载数据-请等待...",
                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。",
                "sInfoEmpty": "当前显示0到0条，共0条记录",
                "sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
                "sProcessing": "<img src='../resources/user_share/row_details/select2-spinner.gif'/> 正在加载数据...",
                "sSearch": "模糊查询：",
                "sUrl": "",
                //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": " 上一页 ",
                    "sNext": " 下一页 ",
                    "sLast": " 尾页 ",
                    "sJump": "跳转"
                }
            },
            "order": [
                [0, null]
            ],//第一列排序图标改为默认
        },
        COLUMN: {
            CHECKBOX: {	//复选框单元格
                className: "td-checkbox",
                orderable: false,
                width: "30px",
                data: null,
                render: function (data, type, row, meta) {
                    return '<input type="checkbox" class="iCheck" name="checkList">';
                }
            },
            // 全局按钮列样式
            BUTTONS: {
                orderable: false,
                data: null,
                render: function (data, type, row, meta) {
                    return ' <button type="button" class="btn btn-small btn-danger btn-del" onclick="del()">删除</button>';
                }
            }
        },
        RENDER: {	//常用render可以抽取出来，如日期时间、头像等
            ELLIPSIS: function (data, type, row, meta) {
                data = data||"";
                return '<span title="' + data + '">' + data + '</span>';
            },
            // 常用编辑按钮
            BUTTONDS: function(data, type, row, meta){
                data = data||"";
                return '<span title="' + data + '">' + data + '</span>';
            }


        }
    }
};
//操作提示
function tool(flag,sume,errme){
	if(flag){
		$('.alert-success').html(sume);
		$('.alert-success').show(300).delay(1000).hide(300);
		table.ajax.reload(null,false);
	}else {
		$('.alert-danger').html(errme);
		$('.alert-danger').show(300).delay(1000).hide(300);
	}
}
function tool2(flag,id,sume,errme){
	if(flag){
		$('#'+id).modal("hide");
		$('.alert-success').html(sume);
		$('.alert-success').show(300).delay(1000).hide(300);
		table.ajax.reload(null,false);
	}else {
		alertTool(errme);
	}
}

//alert 提示
function alertTool(mess){
	$.alert({
        title: false,
        content: mess,
        opacity: 0.5,
        confirmButton: '好',
    });
}

//　确认提示
function sureTool(mes,name,fun,id,status){
	$.confirm({
        title: false,
        content: mes+': '+name+'  ?',
        confirmButton: '确定',
        confirmButtonClass: 'btn-primary',
        //autoClose: 'cancel|5000',
        cancelButton: '取消',
        icon: 'fa fa-question-circle',
        animation: 'scale',
        animationClose: 'top',
        opacity: 0.5,
        confirm: function () {
        	fun(id,status);
        }
    });
}
//删除确认提示
function delTool(name,fun,id,status){
	$.confirm({
        title: false,
        content: '确定删除: '+name+'  ?',
        confirmButton: '确定',
        confirmButtonClass: 'btn-primary',
        //autoClose: 'cancel|5000',
        cancelButton: '取消',
        icon: 'fa fa-question-circle',
        animation: 'scale',
        animationClose: 'top',
        opacity: 0.5,
        confirm: function () {
        	fun(id,status);
        }
    });
}



















//**************************************************************************************
//函数/方法集合 - 开始
//**************************************************************************************
/**
 * 格式化一次JSON数据
 */
function json(data) {
    var start = data.indexOf(">");
    if (start != -1) {
        var end = data.indexOf("<", start + 1);
        if (end != -1) {
            data = data.substring(start + 1, end);
        }
    }
    eval("data = " + data);
    return data;
}

/*
 * 批量替换
 */
String.prototype.replaceAll=function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
};

/*
 * 添加循环计时器，结合框架，可自动销毁
 */
function oSetInterval(func,t){
    gboInterval[gboInterval.length]=setInterval(func,t);
}

/*
 * 添加倒计时器，结合框架，可自动销毁
 */
function oSetTimeout(func,t){
    gboTimeout[gboTimeout.length]=setTimeout(func,t);
}

/*
 * 销毁所有计时器
 */
function clearTimers(){
    try{
        for(var timeri=0;timeri<gboInterval.length;timeri++){
            try{clearInterval(gboInterval[timeri]);}catch(e){}
        }
        for(var timeri=0;timeri<gboTimeout.length;timeri++){
            try{clearInterval(gboTimeout[timeri]);}catch(e){}
        }
    } catch(e){}
}

/*
 * 显示/隐藏loading层
 */
function showLoading(){
    loadingLayout.css({opacity:1,zIndex:200});
}
function hideLoading(){
    setTimeout(function(){loadingLayout.css({opacity:0});},400);
    setTimeout(function(){loadingLayout.css({zIndex:0});},600);
}

/*
 * pjax oLoad
 * url: ajax加载的页面URL
 * method: ajax提交方法get/post
 * data: 提交的json数据
 * way: 覆盖内容的切入效果 0表示直接替换，1表示上方切入，2表示右边切入，3表示下边切入，4表示左边切入
 * easing: animate动作路径
 * beforeFunc: 替换前执行的方法
 * afterFunc: 替换后执行的方法
 */
globalurl='';
function oLoad(url,method,data,way,historyflag,beforeFunc,afterFunc){
    if(!url || url==='#')
        return false;
    showLoading();
    globalurl=url;
    $.ajax({
        url :url,
        type : method,
        data : data,
        cache : false,
        dataType : 'html',
        success : function(html) {
            //ajax获取内容成功
            try{
                //替换列表和分页
                var reg=/<!--pjaxstart-->[\s\S]*?<!--pjaxend-->/;
                var result=html.match(reg);
                if(result!=null && result.length>0){
                    //返回为页面，则根据way使用指定方法更新
                    clearTimers();
                    try{beforeFunc();}catch(e){}
                    if(way===0){
                        //直接替换
                        $('#MainShow').html(result[0]);
                    }
                    else if(way===1){
                        //上方切入
                        var newPage=document.createElement('div');
                        newPage.id='ComingShow';
                        document.body.appendChild(newPage);
                        var $newPage=$(newPage);
                        $newPage.css({top:'-110%'});
                        $newPage.html(result[0]);
                        setTimeout(function(){$('#ComingShow').css({left:'0px',top:'0px'});},50);
                        setTimeout(function(){$('#MainShow').remove();document.body.scrollTop=0;$('#ComingShow').attr('id','MainShow');},450);
                    }
                    else if(way===2){
                        //右方切入
                        var newPage=document.createElement('div');
                        newPage.id='ComingShow';
                        document.body.appendChild(newPage);
                        var $newPage=$(newPage);
                        $newPage.css({left:'110%'});
                        $newPage.html(result[0]);
                        setTimeout(function(){$('#ComingShow').css({left:'0px',top:'0px'});},50);
                        setTimeout(function(){$('#MainShow').remove();document.body.scrollTop=0;$('#ComingShow').attr('id','MainShow');},450);
                    }
                    else if(way===3){
                        //下方切入
                        var newPage=document.createElement('div');
                        newPage.id='ComingShow';
                        document.body.appendChild(newPage);
                        var $newPage=$(newPage);
                        $newPage.css({top:'110%'});
                        $newPage.html(result[0]);
                        setTimeout(function(){$('#ComingShow').css({left:'0px',top:'0px'});},50);
                        setTimeout(function(){$('#MainShow').remove();document.body.scrollTop=0;$('#ComingShow').attr('id','MainShow');},450);
                    }
                    else if(way===4){
                        //左方切入
                        var newPage=document.createElement('div');
                        newPage.id='ComingShow';
                        document.body.appendChild(newPage);
                        var $newPage=$(newPage);
                        $newPage.css({left:'-110%'});
                        $newPage.html(result[0]);
                        setTimeout(function(){$('#ComingShow').css({left:'0px',top:'0px'});},50);
                        setTimeout(function(){$('#MainShow').remove();document.body.scrollTop=0;$('#ComingShow').attr('id','MainShow');},450);
                    }
                    if(!historyflag){
                        try{
                            var state = {title : globalurl,url : globalurl};
                            history.pushState(state, globalurl, globalurl);
                        }catch(e){}
                    }
                    try{afterFunc();}catch(e){}
                }
                else{
                    //返回不是页面，则检查是否json
                    var ojson;
                    try{
                        ojson=json(html);
                    }catch(e){
                        ojson=false;
                    }
                    if(ojson!==false){
                        //处理json结果
                        var data = ojson;
                        if (1*data.Result === 0){
                            alert(data.Message);
                        }
                        else if(1*data.Result === 1){
                            oReload();
                        }
                        else if(1*data.Result === 2){
                            //oLoad(data.Redirect);
                        }
                        else if(1*data.Result === 3){
                            alert(data.Message);
                        }
                        else{
                            alert('错误的返回值');
                        }
                    }
                    else
                        alert('页面动态加载不成功，请与管理员联系');
                }
            } catch(e){
                //遇到异常，则强制跳转
                location.href=globalurl;
                return true;
            }
        },
        error : function(){
            alert('系统出错，请与管理员联系！');
        },
        complete : function(){
            hideLoading();
        }
    });
    //阻止冒泡
    return false;
}

/*
 * pjax oReload
 */
function oReload(){
    //console.log('pjax reload');
    var nowurl=location.href;
    return oLoad(nowurl,'get',{},0,false,null,null);
}

/*
 * pjax oGoback
 */
function oGoback(url){
    return oLoad(url,'get',{},4,true,null,null);
}

/*
 * 搜索框开关
 */
function showsearch(){
    $('.msearchbox').toggle();
    return false;
}

/*
 * 搜索框提交
 */
function dosearch(){
    return oLoad('index.html','get',{},0,false,null,null);
}
//**************************************************************************************
//函数/方法集合 - 结束
//**************************************************************************************

//**************************************************************************************
//非JQ预处理部分 - 开始
//**************************************************************************************
/*
 * 定义全局变量保存所有计时器，伪刷新时清除计时器
 */
gboInterval=new Array();
gboTimeout=new Array();
//**************************************************************************************
//非JQ预处理部分 - 结束
//**************************************************************************************

//**************************************************************************************
//框架重点delegate监控集合 - 开始
//**************************************************************************************
/*
 * 特殊链接采用pjax方式取得
 */
$(document).on('click','a.pjwrap',function(){
    var url=$(this).attr('href');
    return oLoad(url,'get',{},0,false,null,null);
});
$(document).on('click','a.pjtop',function(){
    var url=$(this).attr('href');
    return oLoad(url,'get',{},1,false,null,null);
});
$(document).on('click','a.pjright',function(){
    var url=$(this).attr('href');
    return oLoad(url,'get',{},2,false,null,null);
});
$(document).on('click','a.pjbottom',function(){
    var url=$(this).attr('href');
    return oLoad(url,'get',{},3,false,null,null);
});
$(document).on('click','a.pjleft',function(){
    var url=$(this).attr('href');
    return oLoad(url,'get',{},4,false,null,null);
});
//**************************************************************************************
//框架重点delegate监控集合 - 结束
//**************************************************************************************

//**************************************************************************************
//首次打开时加载一次的监控 - 开始
//**************************************************************************************
$(function(){
    /*
     * 插入历史记录
     */
    var state = {title : document.title,url : location.href};
    history.pushState(state, document.title, location.href);
    
    /*
     * 监听前进/后退按钮
     */
    window.onpopstate = function(event){
        if(event && event.state){
            oGoback(event.state.url);
        }
    };
    
    /*
     * 定义全局变量
     */
    loadingLayout = $('#OLoading');
    hideLoading();
});
//**************************************************************************************
//首次打开时加载一次的监控 - 结束
//**************************************************************************************
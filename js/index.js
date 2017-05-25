/**
 * Created by MJ on 2017/5/7.
 */
(function(){
    var nanList=document.getElementsByClassName("navList")[0];
    var bannerList=document.getElementsByClassName("bannerList")[0];
    var main_contents=document.getElementsByClassName("main_content");
    var wrap=document.getElementsByClassName("wrap")[0];
    var header=document.getElementById("header");
    var scrollBar=document.getElementsByClassName("scrollBar")[0];
    var searchArea=document.getElementsByClassName("searchArea")[0];
    Tmove(nanList,true,false,false,false,true,false,false);
    Tmove(bannerList,false,true,false,true,true,false,false);
    for(var i=0,len=main_contents.length; i<len; i++){
        Tmove(main_contents[i],true,false,true,false,true,false,false);
    }
    Tmove(wrap,false,false,false,false,false,true,true,true);
    function Tmove(ele,isBorder,isCircel,isMovingSwitch,isAuto,isX,isY,isBar,isCallBack){
        document.addEventListener("touchstart",function (e){
            e.preventDefault();
        })
        var touchStartPointX=0;
        var touchStartPointY=0;
        var touchStartTime=0;
        var eleStartPointX=0;
        var eleStartPointY=0;
        var everyTimeTouchMoved=0
        var everyTimeTouchUseTime=1;
        var canMoveX=true;
        var canMoveY=true;
        var isFirstTimeTouchMove=true;
        var moveScale=1;
        var ele_ParentEle=ele.parentElement;
        var ele_ParentEleWidth = ele_ParentEle.clientWidth;
        ele_ParentEle.style.WebkiteTransformStyle = ele_ParentEle.style.transformStyle = "preserve-3d";
        ele.style.WebkiteTransformStyle = ele.style.transform = "translateZ(0.1px)";
        ele.style.WebkiteBackfaceVisibility = ele.style.backfaceVisibility = "hidden";
        if(isX) {
            var ele_childEles = ele.children;
            var ele_childElesCount = ele_childEles.length;
            var eleWidth = 0;
            for (var i = 0, len = ele_childEles.length; i < len; i++) {
                eleWidth += ele_childEles[i].offsetWidth;
            }
            ele.style.width = eleWidth + "px";
            var leftBorder = 0;
            var rightBorder = ele_ParentEleWidth - eleWidth;
            /*别忘记放在isX全局*/
            var currentActiveIndex = 0;
            if (isCircel) {
                ele.innerHTML += ele.innerHTML;
                var ele_tips = ele.nextElementSibling.children;
                var ele_tipsCount = ele_tips.length;
                var ele_childEleWidth = ele_childEles[0].offsetWidth;
                ele_childEles = ele.children;
                ele_childElesCount = ele_childEles.length;
                for (var i = 0, len = ele_childEles.length; i < len; i++) {
                    ele_childEles[i].style.width = 1 / ele_childElesCount * 100 + "%";
                }
                ele.style.width = ele_childElesCount * 100 + "%";
                var ele_childEleWidth = ele_childEles[0].offsetWidth;
                var timer = null;
            }
            if (isMovingSwitch) {
                for (var i = 0, len = ele_childEles.length; i < len; i++) {
                    ele_childEles[i].style.width = 1 / ele_childElesCount * 100 + "%";
                }
                var ele_childEleWidth = ele_childEles[0].offsetWidth;
                var ele_prev_childs = ele.previousElementSibling.children;
                var ele_tip = ele_prev_childs[ele_prev_childs.length - 1];
                var ele_tipWidth = ele_tip.offsetWidth;
            }
        }
        if(isY){
            var eleHeight=ele.offsetHeight;
            var ele_ParentEleHeight=ele_ParentEle.clientHeight;
            var headerHeight=header.clientHeight;
            var bottomBorder=ele_ParentEleHeight-eleHeight-headerHeight;
            var everyTimeTouchMovedY=0;
            var everyTimeTouchUseTimeY=1;
        }
        /*t：已经执行次数
         * b：当前位置
         * c：目标位置与当前位置差值
         * d：总次数*/
        var Tween = {
            easeOut: function(t, b, c, d){
                return -c * ((t=t/d-1)*t*t*t - 1) + b;
            },
            backOut: function(t, b, c, d, s){
                if (typeof s == 'undefined') {
                    s = 1.70158;
                }
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
            }
        };
        if(isCallBack){
            var callBack={};
            var scrollBarStartPoint=0;
            var scrollBarScale=ele_ParentEleHeight/eleHeight;
            callBack.moveStart=function (){
                scrollBar.style.height=scrollBarScale*ele_ParentEleHeight+"px";
                scrollBar.style.opacity=1;
                scrollBarStartPoint=cssTransform(scrollBar,"translateY");
            }
            callBack.moveIng=function (){
                scrollBar.style.opacity=1;
                var scrollBarStartShouldMove=-cssTransform(ele,"translateY")*scrollBarScale
                cssTransform(scrollBar,"translateY",scrollBarStartShouldMove);
                if(scrollBarStartShouldMove>0){
                    searchArea.style.display="none";
                }
            }
            callBack.moveEnd=function (){
                var scrollBarStartShouldMove=-cssTransform(ele,"translateY")*scrollBarScale
                cssTransform(scrollBar,"translateY",scrollBarStartShouldMove);
                scrollBar.style.opacity=0;
                if(scrollBarStartShouldMove==0){
                    searchArea.style.display="block"
                }
            }
        }
        function JSmove(target,time,type){
            var t=0;
            var b=cssTransform(ele,"translateY");
            var c=target-b;
            var d=Math.ceil(time/20);
            clearInterval(ele.scroll);
            ele.scroll=setInterval(function (){
                t++;
                if(t>d){
                    clearInterval(timer);
                    if(callBack&&callBack.moveEnd){
                        callBack.moveEnd()
                    }
                }else{
                    var top=Tween[type](t,b,c,d);
                    cssTransform(ele,"translateY",top);
                    if(callBack&&callBack.moveIng){
                        callBack.moveIng();
                    }
                }
            },20);
        }
        function init(){
            ele.style.transition="none";
            canMoveX=true;
            canMoveY=true;
            isFirstTimeTouchMove=true;
            moveScale=1;
            /*防止Y向回退*/
            clearInterval(ele.scroll);
            everyTimeTouchMoved=0
            everyTimeTouchUseTime=1;
            everyTimeTouchMovedY=0;
            everyTimeTouchUseTimeY=1;
        }
        var transformTarget=0;
        var transitionTime=0;
        var cubicBezier="";
        ele.addEventListener("touchstart",function (e){
            touchStartPointX=e.changedTouches[0].pageX;
            touchStartPointY=e.changedTouches[0].pageY;
            touchStartTime=new Date().getTime();
            eleStartPointX=cssTransform(ele,"translateX");
            eleStartPointY=cssTransform(ele,"translateY");
            init();
            if(isCircel&&isAuto){
                clearInterval(timer);
                changeStartPage(eleStartPointX);
                eleStartPointX=cssTransform(ele,"translateX");
            }
            if(callBack&&callBack.moveStart){
                callBack.moveStart();
            }
        })
        /*用于修改显示图片位置，保证无限循环*/
        function changeStartPage(){
            if(currentActiveIndex===0){
                currentActiveIndex=ele_tipsCount;
            }else if(currentActiveIndex===ele_childElesCount-1){
                currentActiveIndex=ele_tipsCount-1;
            }
            cssTransform(ele,"translateX",-currentActiveIndex*ele_childEleWidth);
        }
        ele.addEventListener("touchmove",function (e){
            if(isX&&!canMoveX){
                return;
            }
            if(isY&&!canMoveY){
                return;
            }
            var touchNowPointX=e.changedTouches[0].pageX;
            var touchNowPointY=e.changedTouches[0].pageY;
            var touchMovedX=touchNowPointX-touchStartPointX;
            var touchMovedY=touchNowPointY-touchStartPointY;
            var eleShouldMoveX=eleStartPointX+touchMovedX;
            var eleShouldMoveY=eleStartPointY+touchMovedY;
            if(isFirstTimeTouchMove){
                isFirstTimeTouchMove=false;
                if(Math.abs(touchMovedX)<Math.abs(touchMovedY)){
                    canMoveX=false;
                }else if(Math.abs(touchMovedX)>Math.abs(touchMovedY)){
                    canMoveY=false;
                }
            }
            var eleCurrentPointX=cssTransform(ele,"translateX");
            if(isBorder){
                var touchNowTime=new Date().getTime();
                everyTimeTouchMoved=touchNowPointX-touchStartPointX;
                everyTimeTouchUseTime=touchNowTime-touchStartTime;
                if(eleCurrentPointX>leftBorder){
                    var over=eleShouldMoveX;
                    moveScale=1-over/ele_ParentEleWidth;
                    moveScale=moveScale<0?0:moveScale;
                    over=parseInt(over*moveScale^2);
                    eleShouldMoveX=leftBorder+over;
                    /*禁止回弹*/
                    eleShouldMoveX=eleShouldMoveX<eleCurrentPointX?eleCurrentPointX:eleShouldMoveX;
                }else if(eleCurrentPointX<rightBorder){
                    var over=rightBorder-eleShouldMoveX;
                    moveScale=1-over/ele_ParentEleWidth;
                    over=parseInt(over*moveScale^2);
                    eleShouldMoveX=rightBorder-over;
                    /*禁止回弹*/
                    eleShouldMoveX=eleShouldMoveX>eleCurrentPointX?eleCurrentPointX:eleShouldMoveX;
                }
            }
            if(isY){
                var touchNowTimeY=new Date().getTime();
                everyTimeTouchMovedY=touchNowPointY-touchStartPointY;
                everyTimeTouchUseTimeY=touchNowTimeY-touchStartTime;
            }
            /*必须同时满足isX&&canMoveX，不然所有元素X和Y都会移动*/
            if(isX&&canMoveX) {
                cssTransform(ele, "translateX", eleShouldMoveX);
            }
            if(isY&&canMoveY){
                cssTransform(ele, "translateY", eleShouldMoveY);
            }
            /*必须放置于canMoveX下面，
             不然会被canMoveX的cssTransform()覆盖;*/
            if (isX&&canMoveX&&isMovingSwitch) {
                if(Math.abs(touchMovedX)>ele_ParentEleWidth/1.9){
                    currentActiveIndex = -Math.round(eleCurrentPointX / ele_ParentEleWidth);
                    tipActive();
                }
            }
            if(callBack&&callBack.moveIng){
                callBack.moveIng();
            }
            return false;
        })
        ele.addEventListener("touchend",function (e){
            var eleEndPointX=cssTransform(ele,"translateX");
            if(isX&&isBorder&&!isMovingSwitch){
                var speedX=everyTimeTouchMoved/everyTimeTouchUseTime*100;
                transformTarget=speedX+eleEndPointX;
                transitionTime=Math.abs(speedX*3);
                transitionTime=transitionTime<400?400:transitionTime;
                cubicBezier="cubic-bezier(.02,.49,.51,.98)";
                border(transformTarget);
            }
            if(isX&&isCircel&isAuto){
                currentActiveIndex=-Math.round(eleEndPointX/ele_ParentEleWidth);
                tipActive();
                autoPlay();
            }
            if(isX&&isBorder&&isMovingSwitch){
                border(eleEndPointX);
                tipActive();
            }
            if(isY){
                var eleEndPointY=cssTransform(ele,"translateY");
                var speedY=everyTimeTouchMovedY/everyTimeTouchUseTimeY*100;
                var Target=speedY+eleEndPointY;
                var Time=Math.abs(speedY*2);
                var type="easeOut";
                if(Target>0){
                    Target=0;
                    type="backOut";
                }else if(Target<bottomBorder){
                    Target=bottomBorder;
                    type="backOut";
                }
                JSmove(Target,Time,type);
            }
            if(callBack&&callBack.moveEnd){
                callBack.moveEnd();
            }
            return false;
        })
        function border(transformTarget){
            if(transformTarget>0){
                transformTarget=0;
                transitionTime=500;
                cubicBezier ="cubic-bezier(.08,1.44,.6,1.46)";
            }else if(transformTarget<rightBorder){
                transformTarget=rightBorder;
                transitionTime=500;
                cubicBezier ="cubic-bezier(.08,1.44,.6,1.46)";
            }
            ele.style.transition=transitionTime+"ms "+cubicBezier;
            cssTransform(ele,"translateX",transformTarget);
        }
        function tipActive(){
            ele.style.transition="0.5s";
            cssTransform(ele,"translateX",-currentActiveIndex*ele_childEleWidth);
            if(isCircel){
                for(var i=0,len=ele_tips.length; i<len; i++){
                    ele_tips[i].className="";
                }
                ele_tips[currentActiveIndex%ele_tips.length].className="active";
            }else if(isMovingSwitch){
                ele_tip.style.transition="0.5s";
                cssTransform(ele_tip,"translateX",currentActiveIndex*ele_tipWidth)
            }
        }
        if(isCircel&&isAuto){
            autoPlay();
        }
        function autoPlay(){
            timer=setInterval(function (){
                /*直接切换不需要时间*/
                if(currentActiveIndex===ele_childElesCount-1){
                    currentActiveIndex=ele_tipsCount-1;
                }
                ele.style.transition="none";
                cssTransform(ele,"translateX",-currentActiveIndex*ele_childEleWidth);
                /*切换完成后，才进行平移*/
                setTimeout(function (){
                    currentActiveIndex++;
                    tipActive();
                },50);
            },2000);
        }

    }

})();
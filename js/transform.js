/**
 * Created by MJ on 2017/5/7.
 */
function cssTransform(ele,attr,val){
    if(!ele.transform){
        ele.transform={}
    }
    if(arguments.length>2){
        ele.transform[attr]=val;
        var allAttr="";
        for (var attr in ele.transform) {
            switch(attr){
                case "rorate":
                case "skewX":
                case "skewY":
                    allAttr+=attr+"("+ele.transform[attr]+ "deg) ";
                    break;
                case "translateX":
                case "translateY":
                case "translateZ":
                    allAttr+=attr+"("+ele.transform[attr]+"px) ";
                    break;
                case "scaleX":
                case "scaleY":
                case "scale":
                    allAttr+=attr+"("+ele.transform[attr]+") ";
                    break;
            }
            ele.style.transform=ele.style.WebkitTransform=allAttr;
        }
    }else{
        val=ele.transform[attr];
        if(typeof val==="undefined"){
            if(attr==="scaleX"||attr==="scaleY"||attr==="scale"){
                val =1;
            }else{
                val=0;
            }
        }
        return val;
    }
}
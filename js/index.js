
    var ulLis = document.getElementsByTagName('li'); 
    var bodyItems = document.getElementsByClassName('body');
    var isClick = false;

    for(var i = 0; i < ulLis.length; i ++) {
        (function (index) {
            var ulLi = ulLis[index];
            ulLi.onclick = function () {
                isClick = true;
                for(var j = 0; j < ulLis.length; j ++){
                    ulLis[j].className = '';
                }
                this.className = 'current';
                // document.documentElement.scrollTop = index * client().height
                buffer(document.documentElement, {scrollTop: index * client().height}, function () {
                    isClick = false;
                })
            }
        })(i)
    }

    window.onscroll = function () {
        if (!isClick) {
            var roll = Math.ceil(scroll().top);
            for (var i = 0; i < ulLis.length; i++) {
                if (roll >= bodyItems[i].offsetTop) {
                    for (var j = 0; j < ulLis.length; j++) {
                        ulLis[j].className = '';
                    }
                    ulLis[i].className = 'current';
                }
            }
        }
    }

    

    //获取窗口尺寸
    function client() {
        if(window.innerWidth){ // ie9+ 最新的浏览器
            return {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }else if(document.compatMode === "CSS1Compat"){ // W3C
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
        }
    
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        }
    }

    //页面滚动动画函数
    function buffer(obj, json, fn) {
        // 1.1 清除定时器
        clearInterval(obj.timer);
    
        // 1.2 设置定时器
        var begin = 0, target = 0, speed = 0;
        obj.timer = setInterval(function () {
            // 1.3.0 旗帜
            var flag = true;
            for(var k in json){
                // 1.3 获取初始值
                if("opacity" === k){ // 透明度
                    begin =  Math.round(parseFloat(getCSSAttrValue(obj, k)) * 100) || 100;
                    target = parseInt(json[k] * 100);
                }else if("scrollTop" === k){
                    begin = Math.ceil(obj.scrollTop);
                    target = parseInt(json[k]);
                }else { // 其他情况
                    begin = parseInt(getCSSAttrValue(obj, k)) || 0;
                    target = parseInt(json[k]);
                }
    
                // 1.4 求出步长
                speed = (target - begin) * 0.2;
    
                // 1.5 判断是否向上取整
                speed = (target > begin) ? Math.ceil(speed) : Math.floor(speed);
    
                // 1.6 动起来
                if("opacity" === k){ // 透明度
                    // w3c的浏览器
                    obj.style.opacity = (begin + speed) / 100;
                    // ie 浏览器
                    obj.style.filter = 'alpha(opacity:' + (begin + speed) +')';
                }else if("scrollTop" === k){
                    obj.scrollTop = begin + speed;
                }else {
                    obj.style[k] = begin + speed + "px";
                }
    
                // 1.5 判断
                if(begin !== target){
                    flag = false;
                }
            }
    
            // 1.3 清除定时器
            if(flag){
                clearInterval(obj.timer);   
                // 判断有没有回调函数
                if(fn){
                    fn();
                }
            }
        }, 20);
    }

/*
 * 获取滚动的头部距离和左边距离
 * scroll().top scroll().left
 */
function scroll() {
    if(window.pageYOffset !== null){
        return {
            top: window.pageYOffset,
            left: window.pageXOffset
        }
    }else if(document.compatMode === "CSS1Compat"){ // W3C
        return {
            top: document.documentElement.scrollTop,
            left: document.documentElement.scrollLeft
        }
    }

    return {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
    }
}
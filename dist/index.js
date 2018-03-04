'use strict';

var extend = require('zhf.extend');
var getDomArray = require('zhf.get-dom-array');
var offset = require('zhf.offset');

// 延迟加载
function LazyLoad(json) {
    this.opts = extend({
        element: '.g-lazy-load', // 哪些元素进行懒加载
        srcAttr: 'data-src', // 默认获取哪里的属性值当做src
        moreHeight: 0, // 多加载一部分高度的图片
        interval: 80, // 函数节流时间(延迟时间)
        isInitRender: true, // 是否初始化的时候就进行render
        currentClass: 'g-lazy-load',
        activeClass: 'g-lazy-load-active'
    }, json);
    this.clientHeight = document.documentElement.clientHeight;
    this.init();
}

LazyLoad.prototype.init = function () {
    if (this.opts.isInitRender) {
        this.render();
    }
    this.power();
};
LazyLoad.prototype.render = function () {
    var self = this;
    var opts = this.opts;
    var moreHeight = opts.moreHeight;
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var minTop = scrollTop - moreHeight;
    var maxTop = this.clientHeight + minTop + moreHeight;
    var src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUCB1jYAACAAAFAAGNu5vzAAAAAElFTkSuQmCC';
    var aDom = getDomArray(opts.element);
    var currentClass = opts.currentClass;
    var activeClass = opts.activeClass;
    aDom.forEach(function (v) {
        if (v.tagName.toLowerCase() === 'img') {
            if (!v.getAttribute('src')) {
                v.src = src;
            }
            v.setAttribute('height', '100%');
            v.setAttribute('width', '100%');
        }
    });
    aDom.forEach(function (v) {
        // 排除那些被none掉的元素(被none掉的元素,通过offsetWidth和offsetHeight获取到的值是0)
        if (v.offsetWidth) {
            var elementTop = offset(v).top;
            var elementBottom = elementTop + v.offsetHeight;
            // 出现在可视区才进行处理
            if (elementBottom >= minTop && elementTop <= maxTop) {
                if (v.tagName.toLowerCase() === 'img') {
                    if (v.getAttribute(self.opts.srcAttr)) {
                        v.src = v.getAttribute(self.opts.srcAttr);
                    }
                    v.removeAttribute('height');
                    v.removeAttribute('width');
                } else if (v.getAttribute(self.opts.srcAttr)) {
                    v.style.backgroundImage = 'url(' + v.getAttribute(self.opts.srcAttr) + ')';
                }
                v.classList.remove(currentClass);
                v.classList.add(activeClass);
            }
        }
    });
};
LazyLoad.prototype.power = function () {
    var self = this;
    var timer = null;
    window.addEventListener('scroll', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            self.render();
        }, self.opts.interval);
    });
};

module.exports = LazyLoad;
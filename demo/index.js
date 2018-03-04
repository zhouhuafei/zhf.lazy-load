const LazyLoad = require('../dist/index.min');

new LazyLoad({
    element: '.g-lazy-load', // 哪些元素进行懒加载
    srcAttr: 'data-src', // 默认获取哪里的属性值当做src
    moreHeight: 0, // 多加载一部分高度的图片
    interval: 80, // 函数节流时间(延迟时间)
    isInitRender: true, // 是否初始化的时候就进行render
    currentClass: 'g-lazy-load', // 加载完之后就移除这个class 建议和element的class保持一致，可以防止重复获取
    activeClass: 'g-lazy-load-active', // 加载完之后就增加这个class
});

/** *rem处理 */"use strict";
(function () {function fontScale() {
    var beApple = (/iphone|ipad|ipod/ig).test(window.navigator.userAgent),
        innerWidth = beApple ? window.screen.availWidth : Math.max(document.documentElement.clientWidth,window.innerWidth);
    if (!innerWidth) {return false;}innerWidth = innerWidth > 640 ? 640 : innerWidth;window._rootFontSize = (20 * innerWidth / 320);
    document.documentElement.style.fontSize = _rootFontSize + 'px';}fontScale();window.addEventListener('pageshow', fontScale, false);
    window.addEventListener('resize', fontScale, false);
})();

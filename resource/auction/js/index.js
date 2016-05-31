'use strict';
var data = [
    {
        lotName: "李可染·万山红遍",
        auction: "中国嘉德",
        auctionTime: "20151115",
        dealPrice: "18400",
        price: "10000",
        extendPrice: "1000",
        imgSrc: "lot1.jpg"
    },
    {
        lotName: "莫迪利安尼·侧卧的裸女",
        auction: "纽约佳士得",
        auctionTime: "20151109",
        dealPrice: "108207",
        price: "100000",
        extendPrice: "1000",
        imgSrc: "lot2.jpg"
    },
    {
        lotName: "潘天寿·鹰石山花图",
        auction: "中国嘉德",
        auctionTime: "20150517",
        dealPrice: "27945",
        price: "18000",
        extendPrice: "1000",
        imgSrc: "lot3.jpg"
    },
    {
        lotName: "吴冠中《新巴黎》",
        auction: "中国嘉德",
        auctionTime: "20160514",
        dealPrice: "2242.5",
        price: "1500",
        extendPrice: "100",
        imgSrc: "lot4.jpg"
    },
    {
        lotName: "十四世纪-释迦牟尼",
        auction: "中国嘉德",
        auctionTime: "20151115",
        dealPrice: "9315",
        price: "3000",
        extendPrice: "500",
        imgSrc: "lot5.jpg"
    },
    {
        lotName: "吴冠中·周庄",
        auction: "香港保利",
        auctionTime: "20160404",
        dealPrice: "19700",
        price: "10000",
        extendPrice: "1000",
        imgSrc: "lot6.jpg"
    },
    {
        lotName: "张大千·桃源图",
        auction: "香港苏富比",
        auctionTime: "20160405",
        dealPrice: "22500",
        price: "8000",
        extendPrice: "1000",
        imgSrc: "lot7.jpg"
    }
];

!(function (win, doc, undefined, data) {

    var biddingResult = {
        buyCount: 0,
        profitMoney: 0,
    };
    var constant = {
        pBiddingCountdown: 5,//人物拍卖倒计时
        cBiddingCountdown: 5, //系统拍卖倒计时
        productCount: 5
    };
    var initialFn = {
        produceNum: 0,
        dataIndexArray: [],
        pages: doc.querySelectorAll('.page'),
        //page1
        loading: function (oLoad) {
            var oBody = doc.getElementById('body');
            //oBody.style.display = 'block';

            setTimeout(function () {
                oLoad.parentNode.removeChild(oLoad);
                oBody.children[0].classList.add('active');
            }, 800);
        },
        //page2
        enter: function (oEnter) {
            var _this = this;
            oEnter.addEventListener('webkitAnimationEnd', function () {
                //var pages = doc.querySelectorAll('.page'),
                var page1 = _this.pages[1];

                this.addEventListener('click', function () {
                    //page1.classList.add('active');
                    page1.parentNode.removeChild(_this.pages[0]);
                    initialFn.showDeal();
                }, false);
            }, false);
        },
        showDeal: function () {
            var _this = initialFn;
            if (_this.dataIndexArray.length < constant.productCount) {
                var len = data.length;
                var dataIndex = _this.getRandom(len);
                while (_this.findRepeat(_this.dataIndexArray, dataIndex)) {
                    dataIndex = _this.getRandom(len);
                }
                _this.dataIndexArray.push(dataIndex);
                bidding.init(data[dataIndex])
            } else {

                _this.dealResults();
            }
            return false;
        },
        //page3
        dealResults: function () {
            var _this = this;
            var page2 = _this.pages[2];
            var weixinImg = document.getElementById('weixinImg');
            if (_this.pages[1]) {
                page2.parentNode.removeChild(_this.pages[1]);
            }
            page2.classList.add('active');
            var X = biddingResult.profitMoney,
                count = biddingResult.buyCount,
                num = 0,
                resultsObj = doc.querySelector('.results');
            if (count) {
                //num=X>=0?parseInt((95567-X)/1000):0;
                if (X >= 0) {
                    num = parseInt((39067 - X) / 500);
                    resultsObj.innerHTML = '您在拍卖会共赚<span>' + X + '</span>万荣登福布斯藏家名人榜第<span>' + num + '</span>位';
                    document.title = '我在拍卖会共赚' + X + '万荣登福布斯藏家名人榜第' + num + '位'
                } else {
                    resultsObj.innerHTML = 'Sorry，您已在福布斯名人榜道路上渐行渐远，输的连裤衩都没了… …';
                    document.titl = 'Sorry，我已在福布斯名人榜道路上渐行渐远，输的连裤衩都没了… …';
                }
            } else {
                resultsObj.innerHTML = '一件都没有拍到，这不像我的风格，我会再回来的… …';
                document.title = '拍卖会竟然没有一件合我意的，看你的了';
            }
            weixinImg.src = "../resource/auction/imgs/weixin.png";
        },
        weixinShare: function (shareBtn) {
            var shareMask = document.getElementById('guaid_weixin');
            shareBtn.addEventListener('click', function () {
                shareMask.style.display = 'block';
                shareMask.addEventListener('touchstart', touchFn, false);
                weixinCheck();
            }, false);
            function touchFn() {
                this.style.display = 'none';
                shareMask.removeEventListener('touchstart', touchFn, false);
            }

            function weixinCheck() {
                if ((/micromessenger/ig).test(win.navigator.userAgent)) {
                    shareMask.querySelector('.text').style.display = 'block';
                    shareMask.querySelector('.qrCode').style.display = 'none';
                } else {
                    shareMask.querySelector('.qrCode').style.display = 'block';
                    shareMask.querySelector('.text').style.display = 'none';
                }
            }

        },
        //获得0 - max-1 的随机数
        getRandom: function (max) {
            return parseInt(Math.random() * (max - 1));
        },
        findRepeat: function (indexArray, index) {
            for (var i = 0; i < indexArray.length; i++) {
                if (index == indexArray[i]) {
                    return true;
                }
            }
            return false;
        }
    };
    //竞价
    var bidding = {
        pTimer: null,
        cTimer: null,
        currActiveObj: null,//当前活动对象 person or computer
        title: doc.querySelector('.title h2'),
        monkeyL: doc.querySelector('.monkeyLeft'),
        monkeyR: doc.querySelector('.monkeyRight'),
        cPriceObj: doc.querySelector('.monkeyLeft .price p'),
        pPriceObj: doc.querySelector('.monkeyRight .price p'),
        timeObj: doc.querySelector('.time'),
        btnLeft: doc.querySelector('.btnLeft'),
        btnRight: doc.querySelector('.btnRight'),
        lightsObj: doc.querySelector('.lights'),
        mouseObj: doc.querySelector('.buttons'),
        lotsObj: doc.querySelector('.lots'),
        titleObj: doc.querySelector('.title h2'),
        startPriceObj: doc.querySelector('.monkeyBox span'),
        addPriceObjR: doc.querySelector('.btn .right'),
        addPriceObjL: doc.querySelector('.btn .left'),
        meObj:doc.querySelector('.me'),
        currPrice: 0,
        clickEnable:false,
        running: false,
        init: function (data) {
            this.clearAll();
            this.data = data;
            this.titleObj.innerHTML = this.data.lotName;
            this.lotsObj.style.backgroundImage = 'url("../resource/auction/imgs/works/' + this.data.imgSrc + '")';
            this.lightAct();
            this.mouseMove();
            this.listenBtn();
            this.extendPrice();
            this.startPrice = this.getInitPrice();
            this.startPriceObj.style.display = "block";
            this.meObj.style.display='block';
            this.currPrice = this.startPrice;
            this.comMaxActCount =  Math.ceil(Math.random() * 3) + 1;
            this.comActCount = 0;
            this.running = true;
            this.personActCount = 0;
            setTimeout(function () {
                bidding.cAct();
                bidding.startPriceFn();
            }, 500);
        },
        //加价幅度
        extendPrice: function () {
            this.addPriceObjL.innerHTML = '+' + this.data.extendPrice + 'W';
            this.addPriceObjR.innerHTML = '+' + this.data.extendPrice + 'W';
        },
        //起拍价
        startPriceFn: function () {
            this.startPriceObj.innerHTML = this.startPrice + '万';
        },
        //add class
        addClass: function (obj, className) {
            obj.classList.add(className);
        },
        //remove class
        removeClass: function (obj, className) {
            obj.classList.remove(className);
        },
        //灯光闪烁
        lightAct: function () {
            var _this = this;
            setTimeout(function () {
                _this.lightsObj.classList.add('active');
            }, 100);

        },
        //人出价
        pAct: function () {
            var _this = bidding;
            if (_this.running) {
                var countdown = constant.pBiddingCountdown;
                this.timeObj.style.display = "block";
                _this.currActiveObj = 'person';
                if (_this.personActCount > 0) {
                    clearInterval(_this.pTimer);
                    _this.pTimer = setInterval(function () {

                        _this.timeObj.innerHTML = countdown + "";
                        if (countdown < 1) {
                            //人放弃出价换下一张图片
                            _this.abandonProduce();

                        }
                        countdown--;
                    }, 1000);
                }
            }

        },
        //计算机出价
        cAct: function () {
            var _this = bidding;
            if (_this.running) {
                _this.currActiveObj = 'computer';
                _this.timeObj.style.display = 'none';
                if (_this.comActCount < _this.comMaxActCount) {
                    setTimeout(function () {
                        _this.timeObj.style.display = 'none';
                        _this.timeObj.style.display = 'none';
                        _this.toLarge(_this.monkeyL);
                        _this.toSmall(_this.monkeyR);
                        setTimeout(function () {
                            _this.addClass(_this.startPriceObj, 'cur');
                        }, 500);
                        //if(_this.comActCount > 0){
                        //    _this.cPriceObj.innerHTML = _this.currPrice + '万';
                        //}
                        setTimeout(function () {
                            _this.addClass(_this.addPriceObjL, 'cur');
                            setTimeout(function(){
                                _this.startPriceObj.style.display = "none";
                                _this.removeClass(_this.startPriceObj, 'cur');
                                _this.removeClass(_this.addPriceObjR, 'cur');
                                _this.currPrice += parseInt(_this.data.extendPrice);
                                _this.cPriceObj.innerHTML = _this.currPrice + '万';
                                _this.pPriceObj.innerHTML = "";
                                _this.comActCount ++;
                                _this.timeObj.innerHTML = '';
                                bidding.pAct();
                                _this.clickEnable="true";
                                _this.btnLeft.style.opacity='1';
                                _this.btnRight.style.opacity='1';
                            },500);
                        }, 1200);
                        return false;
                    }, 1000)
                } else {
                    /* 拍卖成功*/
                    _this.clickEnable="false";
                    _this.btnLeft.style.opacity='.75';
                    _this.btnRight.style.opacity='.75';
                    setTimeout(function () {
                        _this.showSuccess();
                        _this.toNormal(_this.monkeyL);
                        _this.toNormal(_this.monkeyR);
                    }, 1000);
                }
            }
        },
        //猴子变大
        toLarge: function (obj) {
            obj.classList.remove('small');
            obj.classList.add('large');
        },
        //猴子变小
        toSmall: function (obj) {
            obj.classList.remove('large');
            obj.classList.add('small')
        },
        //猴子正常大小
        toNormal: function (obj) {
            obj.classList.remove('large');
            obj.classList.remove('small');
        },
        //手指移动
        mouseMove: function () {
            this.mouseObj.classList.add('active');
        },
        //监听按钮
        listenBtn: function () {
            var _this = bidding;
            _this.btnRight.removeEventListener('click', _this.buyHandler, false);
            _this.btnRight.addEventListener('click', _this.buyHandler, false);
            _this.btnLeft.removeEventListener('click', _this.abandonHandler, false);
            _this.btnLeft.addEventListener('click', _this.abandonHandler, false);

        },
        //放弃处理
        abandonHandler: function () {
            if (bidding.clickEnable == 'true'&&bidding.currActiveObj == 'person') {
                bidding.abandonProduce();
            }
        },
        //出价处理
        buyHandler: function () {
            var _this = bidding;
            clearInterval(_this.pTimer);
            if (_this.currActiveObj == 'person') {
                if(_this.clickEnable==false){
                    _this.btnLeft.style.opacity='.75';
                    _this.btnRight.style.opacity='1';
                    return false;
                }
                _this.toLarge(_this.monkeyR);
                _this.meObj.style.display='none';
                _this.toSmall(_this.monkeyL);
                //_this.pPriceObj.innerHTML = _this.currPrice + '万';
                _this.removeClass(_this.addPriceObjL, 'cur');
                _this.clickEnable=false;
                _this.btnLeft.style.opacity='.75';
                _this.btnRight.style.opacity='.75';
                setTimeout(function () {
                    _this.addClass(_this.addPriceObjR, 'cur');
                    setTimeout(function(){
                        _this.currPrice += parseInt(_this.data.extendPrice);
                        _this.pPriceObj.innerHTML = _this.currPrice + '万';
                        _this.cPriceObj.innerHTML = '';
                        _this.personActCount++;
                        _this.cAct();
                    },500);
                }, 1000);
            }
        },
        //计算价格
        getInitPrice: function () {
            var num = Math.floor(Math.random()*(5-1+1)+1);
            return parseInt(this.data.price) + parseInt(this.data.extendPrice * num);
        },
        //放弃此商品
        abandonProduce: function () {
            this.removeClass(this.startPriceObj, 'cur');
            bidding.removeClass(bidding.addPriceObjL, 'cur');
            bidding.toNormal(bidding.monkeyL);
            bidding.toNormal(bidding.monkeyR);
            bidding.clickEnable=false;
            bidding.btnRight.style.opacity='.75';
            bidding.btnLeft.style.opacity='.75';
            this.running = false;
            this.clearAll();
            initialFn.showDeal();
        },
        //竞买成功,弹出遮罩
        showSuccess: function () {
            this.timeObj.innerHTML = "";
            var mask = doc.querySelector('.mask'),
                succEle = doc.getElementById('dealSuccess');
            //setTimeout(function(){mask.style.display = 'block';},1500);
            biddingResult.buyCount++;
            biddingResult.profitMoney += this.data.dealPrice - this.currPrice;
            mask.style.display = 'block';
            succEle.innerHTML = this.getSuccHtml(this.data, this.currPrice);
            mask.addEventListener('touchstart', touchFn, false);

            function touchFn() {
                this.style.display = 'none';
                initialFn.showDeal();
                mask.removeEventListener('touchstart', touchFn, false);
            }
        },
        //遮罩内容数据绑定
        getSuccHtml: function (data, currentPrice) {
            var html = '';
            html += '<span class="close">X</span>';
            html += ' <div class="success">';
            html += ' <p>恭喜您以 ' + currentPrice + '万元 拍得该藏品</p>';
            html += ' </div>';
            html += ' <div class="box">';
            html += ' <div class="monkeyCenter"></div>';
            html += ' <div class="stars"></div>';
            html += ' <p class="deal">历史成交记录</p>';

            html += ' <div class="messagesBox">';
            html += ' <div class="messages">';
            html += ' <ul>';
            html += ' <li><span class="circle"></span>拍品：<p>' + data.lotName + '</p></li>';
            html += ' <li><span class="circle"></span>拍卖机构：<p>' + data.auction + '</p></li>';
            html += ' <li><span class="circle"></span>拍卖时间：<p>' + data.auctionTime + '</p></li>';
            html += ' <li><span class="circle"></span>成交价： <p>' + data.dealPrice + '</p>万RMB</li>';
            html += ' </ul>';
            html += ' </div>';
            html += ' </div>';
            html += '</div>';
            return html;
        },
        clearAll: function () {
            clearInterval(this.cTimer);
            clearInterval(this.pTimer);
            bidding.lightsObj.classList.remove('active');
            this.cPriceObj.innerHTML = '';
            this.pPriceObj.innerHTML = '';
            this.timeObj.style.display = 'none';
        }
    };
    window.addEventListener('load', loadFn, false);
    function loadFn() {
        var oLoad = document.getElementById('loading'),
            oEnter = document.getElementById('enter'),
            shareBtn = document.querySelector('.share');

        oLoad && setTimeout(function () {
            initialFn.loading(oLoad);
            oEnter && initialFn.enter(oEnter);
            shareBtn && initialFn.weixinShare(shareBtn);
        }, 2000);
    };
})(window, document, undefined, data);

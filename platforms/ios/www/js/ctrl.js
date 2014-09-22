// 全局——控制层
angularApp.controller("appCtrl", function ($scope, $ionicPopover, $ionicPopup, cartService) {
    $scope.cartDomains = cartService.getCart();

    $scope.$on('cart.update', function () {
        $scope.cartDomains = cartService.getCart();
    });

    $scope.showAlert = function (title, content) {
        var alertPopup = $ionicPopup.alert({
            title   : title,
            template: content,
            okType  : "button-positive"
        });
        alertPopup.then(function (res) {
            console.log('popup' + res);
        });
    };

    $scope.scanCode = function () {
        barcode.scan(onSuccess, onFail);
    };

    var onSuccess = function (result) {
        if (result.cancelled) {
            $scope.showAlert("提示", "用户取消！");
            return;
        }

        $scope.showAlert('扫描结果', result.text);
    };

    var onFail = function (result) {
        $scope.showAlert("出错了", "扫描码太深奥，扫不动了！");
    };

    $ionicPopover.fromTemplateUrl('pages/inbox.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.inbox = popover;
    });
    $scope.openInbox = function ($event) {
        $scope.inbox.show($event);
        $('div.popover-backdrop').css("z-index", "9999");
    };
    $scope.closeInbox = function () {
        $scope.inbox.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.inbox.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
        // Execute action
    });
});

// 介绍页面——控制层
angularApp.controller('introCtrl', function ($scope, $state, $ionicSlideBoxDelegate) {

    $scope.startApp = function () {
        $state.go('main.search');
    };
    $scope.next = function () {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function () {
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function (index) {
        $scope.slideIndex = index;
    };
});
// 快捷注册——控制层
angularApp.controller('searchCtrl', function ($scope, $ionicPopup, $ionicLoading, searchService, cartService) {

    $scope.searchDomains = [ ];
    $scope.showView = '';

    // Trigger the loading indicator
    $scope.showLoading = function () {
        $ionicLoading.show({
            content     : '查询中……',
            animation   : 'fade-in',
            showBackdrop: true,
            maxWidth    : 300,
            showDelay   : 500
        });
    };
    // Hide the loading indicator
    $scope.hideLoading = function () {
        $ionicLoading.hide();
    };

    $scope.goSearch = function (searchText) {
        $('input.searchInput').blur();
        console.log(searchText);
        if (typeof(searchText) == "undefined" || searchText == "") {
            $scope.showAlert("提示", "请输入域名或域名标签");
            return;
        }

        searchText = searchText.toLowerCase();
        if (searchText.indexOf('.') > 0) {
            searchText = searchText.substring(0, searchText.indexOf('.'))
        }

        var re = /^[\w]{1}[\w-\.]{0,}$/;

        if (!re.test(searchText)) {
            $scope.showAlert("提示", "请输入正确的英文域名或域名标签");
            return;
        }
        console.log(searchText);

        $scope.showLoading();
        searchService.search(searchText);
    };

    $scope.onTouch = function () {
        console.log("onTouch");
        console.log(event);
    };

    $scope.onRelease = function () {
        console.log("onRelease");
    };

    $scope.whois = function (domain) {
        console.log(domain);
        $scope.showView = 'whois';
        $scope.whoisDomain = domain;
        for (var i = 0; i < $scope.searchDomains.length; i++) {
            if ($scope.searchDomains[i].domain == domain) {
                $scope.whoisDomainInfo = $scope.searchDomains[i].whois;
                break;
            }
        }
    };

    $scope.$on('search.done', function () {
        $scope.hideLoading();
        $scope.searchDomains = searchService.getSearch();
        $scope.showView = 'result';

    });

    $scope.$on('search.error', function () {
        $scope.hideLoading();
        $scope.showAlert("提示", "超时了，网络不太好哦！");
        $scope.showView = '';

    });

    $scope.hideWhois = function () {
        $scope.showView = 'result';
        $scope.whoisDomain = "";
        $scope.whoisDomainInfo = "";
    };

    $scope.addCart = function (domainItem) {
        cartService.addItem(domainItem.domain);
        domainItem.isAdded = true;
        console.log(domainItem.domain);
    };

    // An alert dialog
    $scope.showAlert = function (title, content) {
        var alertPopup = $ionicPopup.alert({
            title   : title,
            template: content,
            okType  : "button-positive"
        });
        alertPopup.then(function (res) {
            console.log('popup' + res);
        });
    };
});

// 购物车——控制层
angularApp.controller('cartCtrl', function ($scope, $state, $ionicPopup, cartService) {
    $scope.cartItems = cartService.getCart();
    $scope.selectedItemLength = 0;
    $scope.allChecked = false;

    for (var i = 0; i < $scope.cartItems.length; i++) {
        if ($scope.cartItems[i].isSelected) {
            $scope.selectedItemLength += 1;
        }
    }

    $scope.allChecked = ($scope.selectedItemLength == $scope.cartItems.length);


    $scope.checkAll = function () {
        for (var i = 0, j = $scope.cartItems.length; i < j; i++) {
            if ($scope.allChecked) {
                $scope.cartItems[i].isSelected = false;
                $scope.allChecked = false;
            }
            else {
                $scope.cartItems[i].isSelected = true;
                $scope.allChecked = true;
            }
        }

        cartService.saveAll($scope.cartItems);
    };

    // An alert dialog
    $scope.showAlert = function (title, content) {
        var alertPopup = $ionicPopup.alert({
            title   : title,
            template: content,
            okType  : "button-dark"
        });
        alertPopup.then(function (res) {
            console.log('popup' + res);
        });
    };

    $scope.$on('cart.update', function () {
        $scope.cartItems = cartService.getCart();
        $scope.selectedItemLength = 0;
        for (var i = 0; i < $scope.cartItems.length; i++) {
            if ($scope.cartItems[i].isSelected) {
                $scope.selectedItemLength += 1;
                $scope.totalMoney += $scope.cartItems[i].years * 30;
            }
        }
        $scope.allChecked = ($scope.selectedItemLength == $scope.cartItems.length);

    });

    $scope.selectedChange = function (item) {
        cartService.updateItem(item);
    };

    $scope.deleteItem = function (item) {
        $scope.showConfirm(item.name);
    };

    $scope.showConfirm = function (name) {
        var confirmPopup = $ionicPopup.confirm({
            title     : '确认删除？',
            template  : '你确认要从购物车中删除' + name + '域名嘛？',
            okType    : 'button-positive',
            okText    : '确认',
            cancelText: '取消'
        });
        confirmPopup.then(function (res) {
            if (res) {
                cartService.removeItem(name);
            }
        });
    };

    $scope.orderDomains = function () {
        var preOrderItems = [];
        var tmp = {};
        for (var i = 0; i < $scope.cartItems.length; i++) {
            if ($scope.cartItems[i].isSelected) {
                tmp = {"name": $scope.cartItems[i].name, "years": 1};
                preOrderItems.push(tmp);
            }
        }
        cartService.saveOrder(preOrderItems);
        $state.go('main.pay');
    };
});

// 我的域名——控制层
angularApp.controller('myCtrl', function ($scope, $state, $ionicPopup, myService) {
    console.log('myCtrl');
    $scope.my = {};
    $scope.my.isRealname = false;
    $scope.my.name = "";
    $scope.my.phone = "";
    $scope.my.email = "";
    $scope.myPhoto = "img/bg.png";

    var my = myService.getMyInfo();
    if (my) {
        $scope.my = my;
    }

    var photo = myService.getPhoto();
    if (photo) {
        $scope.myPhoto = "data:image/jpeg;base64," + photo;
        $scope.my.isRealname = true;
        $scope.my = myService.getMyInfo();
    }

    var myDomains = myService.getMyDomain();
    if (myDomains) {
        $scope.myDomains = myDomains;
    }


//    $scope.closeTip = function () {
//        $("div.myBar").fadeOut("slow");
//    };

    $scope.goRealname = function () {
        if (!$scope.my.isRealname) {
            $state.go("main.realname");
        }
    };

    $scope.isShowTip = function () {
        return !$scope.my.isRealname;
    };

    $scope.$on("myphoto.change", function () {
        $('#myLogoImg').src = "data:image/jpeg;base64," + myService.getPhoto();
        $scope.my.isRealname = true;
    });
});

angularApp.controller('payCtrl', function ($scope, $state, $ionicPopup, cartService, myService) {
    console.log('payCtrl');
    $scope.totalMoney = 0;
    $scope.order = cartService.getOrder();

    for (var i = 0; i < $scope.order.length; i++) {
        $scope.totalMoney += $scope.order[i].years * 30;
    }

    $scope.updateYears = function (item, years) {
        for (var i = 0; i < $scope.order.length; i++) {
            if ($scope.order[i].name == item.name) {
                if (years == -1) {
                    $scope.order[i].years = $scope.order[i].years <= 1 ? $scope.order[i].years : $scope.order[i].years - 1;
                }
                else if (years == 1) {
                    $scope.order[i].years = $scope.order[i].years >= 10 ? $scope.order[i].years : $scope.order[i].years + 1;
                }
            }
        }
        cartService.saveOrder($scope.order);
    };

    $scope.$on('order.update', function () {
        $scope.order = cartService.getOrder();
        $scope.totalMoney = 0;
        for (var i = 0; i < $scope.order.length; i++) {
            $scope.totalMoney += $scope.order[i].years * 30;
        }
    });

    $scope.pay = function () {
        for (var i = 0; i < $scope.order.length; i++) {
            cartService.removeItem($scope.order[i].name);
            myService.addMyDomain($scope.order[i]);
        }
        $scope.showAlert("支付成功")
    };

    // An alert dialog
    $scope.showAlert = function (title, content) {
        var alertPopup = $ionicPopup.alert({
            title   : title,
            template: content,
            okType  : "button-positive"
        });
        alertPopup.then(function () {
            $state.go("main.my");
        });
    };
});

angularApp.controller('realnameCtrl', function ($scope, $state, $ionicActionSheet, $ionicPopup, myService) {
    console.log('realnameCtrl');
    $scope.myPhoto = "img/bg.png";
    $scope.tmpPhoto = null;
    $scope.my = {};

    $scope.canSubmit = function () {
        return !(
            (typeof($scope.my) == "undefined") ||
            ($scope.tmpPhoto === null) ||
            (typeof($scope.my.name) == "undefined") ||
            (typeof($scope.my.idcard) == "undefined") ||
            (typeof($scope.my.phone) == "undefined")
            );
    };

    $scope.goRealName = function () {
        $scope.my.isRealname = true;
        myService.saveMyInfo($scope.my);
        myService.savePhoto($scope.tmpPhoto);
        $state.transitionTo('main.my');
    };

    $scope.choosePhoto = function () {
        $ionicActionSheet.show({
            titleText               : '请选择照片',
            buttons                 : [
                { text: '拍照 <i class="icon ion-ios7-camera"></i>' },
                { text: '从相册选取 <i class="icon ion-ios7-albums"></i>' },
            ],
            destructiveText         : '取消',
            buttonClicked           : function (index) {
                console.log('BUTTON CLICKED', index);
                switch (index) {
                    case 0:
                        $scope.takePhoto();
                        break;
                    case 1:
                        $scope.browsePhoto();
                        break;
                    default:
                        break;
                }
                return true;
            },
            destructiveButtonClicked: function () {
                return true;
            }
        });
    };

    $scope.takePhoto = function () {
        if (!camera.capturePhoto(onSuccess, onFail)) {
            $scope.showAlert('错误', '无法打开摄像头');
        }
    };

    $scope.browsePhoto = function () {
        if (!camera.browsePhoto(onSuccess, onFail)) {
            $scope.showAlert('错误', '无法打开相册');
        }
    };

    var onSuccess = function (imageData) {
        $scope.$apply(function () {
            $scope.myPhoto = "data:image/jpeg;base64," + imageData;
            $scope.tmpPhoto = imageData;
            $scope.my.name = "测试用户";
            $scope.my.idcard = "111111190012011234";
        });
    };

    var onFail = function (message) {
        $scope.showAlert('错误', message);
    };

    // An alert dialog
    $scope.showAlert = function (title, content) {
        var alertPopup = $ionicPopup.alert({
            title   : title,
            template: content,
            okType  : "button-positive"
        });
        alertPopup.then(function (res) {
            console.log('popup' + res);
        });
    };
});

angularApp.controller('domainCtrl', function ($scope, $stateParams, myService) {
    console.log('domainCtrl');
    console.log($stateParams.domain);
    $scope.domainInfo = myService.getMyDomainByName($stateParams.domain);


    var chartoption = {
        chart      : {
            type           : 'column',
            backgroundColor: 'rgba(255,255,255,0.8)'
        },
        title      : {
            text : '近一周解析量',
            style: {
                color   : "#4a87ee",
                fontSize: "1em"
            }
        },
        xAxis      : {
            categories: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
        },
        yAxis      : {
            min  : 0,
            title: {
                text: ''
            }
        },
        credits    : {
            enabled: false
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth : 0
            }
        },
        series     : [
            {
                name: '递归',
                data: [ 3000, 4000, 3000, 5000, 4000, 10000, 12000 ]
            },
            {
                name: '权威',
                data: [ 1000, 3000, 4000, 3000, 3000, 5000, 4000 ]
            }
        ]
    };

    $scope.onChart = function () {
        console.log("onChart");
        $('#chart').highcharts(chartoption);
    };

    $scope.onChart();
});


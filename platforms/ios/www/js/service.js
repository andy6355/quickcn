angularApp.factory("cartService", ['$rootScope', function ($rootScope) {
    var cart = [];
    var order = [];
    var addItem = function (item) {
        var tmp = {"name": item, "isSelected": true};
        cart = JSON.parse(localStorage.getItem("cart"));
        if (cart == null) {
            cart = [];
            cart.unshift(tmp);
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        else {
            cart.unshift(tmp);
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        $rootScope.$broadcast('cart.update');
    };

    var updateItem = function (itemObj) {
        cart = JSON.parse(localStorage.getItem("cart"));
        if (cart == null) {
            return;
        } else {
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].name == itemObj.name) {
                    cart[i].isSelected = itemObj.isSelected;
                    cart[i].years = itemObj.years;
                    break;
                }
            }
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        $rootScope.$broadcast('cart.update');
    };

    var removeItem = function (item) {
        cart = JSON.parse(localStorage.getItem("cart"));
        if (cart == null) {
            return;
        }
        else {
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].name == item) {
                    cart.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        $rootScope.$broadcast('cart.update');
    };

    var findCartByItem = function (item) {
        cart = JSON.parse(localStorage.getItem("cart"));
        if (cart == null) {
            return false;
        }
        else {
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].name == item) {
                    return true;
                }
            }
            return false;
        }
    };

    var saveAll = function (cart) {
        if (cart == null) {
            return;
        }
        else {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        $rootScope.$broadcast('cart.update');
    };

    var getCart = function () {
        cart = JSON.parse(localStorage.getItem("cart"));
        if (cart == null) {
            return [];
        }
        return cart;
    };

    var saveOrder = function (order) {
        if (order == null) {
            return;
        }
        else {
            localStorage.setItem("order", JSON.stringify(order));
        }
        $rootScope.$broadcast('order.update');
    };

    var getOrder = function () {
        order = JSON.parse(localStorage.getItem("order"));
        if (order == null) {
            return [];
        }
        return order;
    };

    return {
        addItem       : addItem,
        getCart       : getCart,
        removeItem    : removeItem,
        findCartByItem: findCartByItem,
        updateItem    : updateItem,
        saveAll       : saveAll,
        saveOrder     : saveOrder,
        getOrder      : getOrder
    };
}]);

angularApp.factory('myService', ['$rootScope', 'cartService', function ($rootScope) {
    var myDomain = [];
    var addMyDomain = function (domain) {
        var now = new Date();
        var tmp = {"name": domain.name, "years": domain.years, "regDate": now.toLocaleDateString() };

        myDomain = JSON.parse(localStorage.getItem("myDomain"));
        if (myDomain == null) {
            myDomain = [];
            myDomain.unshift(tmp);
            localStorage.setItem("myDomain", JSON.stringify(myDomain));
        }
        else {
            myDomain.unshift(tmp);
            localStorage.setItem("myDomain", JSON.stringify(myDomain));
        }
        $rootScope.$broadcast('myDomain.update');
    };

    var removeMyDomain = function (domain) {
        myDomain = JSON.parse(localStorage.getItem("myDomain"));
        if (myDomain == null) {
            return;
        }
        else {
            for (var i = 0; i < myDomain.length; i++) {
                if (myDomain[i].name == domain) {
                    myDomain.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem("myDomain", JSON.stringify(myDomain));
        }
        $rootScope.$broadcast('myDomain.update');
    };

    var saveMyInfo = function (myInfo) {
        if (myInfo) {
            localStorage.setItem("myInfo", JSON.stringify(myInfo));
        }
    };

    var getMyInfo = function () {
        var myInfo = localStorage.getItem("myInfo");
        if (myInfo) {
            return JSON.parse(myInfo);
        }
        return null;
    };

    var findMyDomainByName = function (item) {
        myDomain = JSON.parse(localStorage.getItem("myDomain"));
        if (myDomain == null) {
            return false;
        }
        else {
            for (var i = 0; i < myDomain.length; i++) {
                if (myDomain[i].name == item) {
                    return true;
                }
            }
            return false;
        }
    };

    var getMyDomainByName = function (item) {
        myDomain = JSON.parse(localStorage.getItem("myDomain"));
        if (myDomain == null) {
            return {};
        }
        else {
            for (var i = 0; i < myDomain.length; i++) {
                if (myDomain[i].name == item) {
                    return myDomain[i];
                }
            }
            return {};
        }
    };

    var getMyDomain = function () {
        myDomain = JSON.parse(localStorage.getItem("myDomain"));
        if (myDomain == null) {
            return [];
        }
        return myDomain;
    };

    var savePhoto = function (photo) {
        localStorage.setItem("myPhoto", photo);
        $rootScope.$broadcast("myphoto.change");
    };

    var getPhoto = function () {
        return localStorage.getItem("myPhoto");
    };

    return {
        addMyDomain       : addMyDomain,
        removeMyDomain    : removeMyDomain,
        findMyDomainByName: findMyDomainByName,
        getMyDomainByName : getMyDomainByName,
        getMyDomain       : getMyDomain,
        saveMyInfo        : saveMyInfo,
        getMyInfo         : getMyInfo,
        savePhoto         : savePhoto,
        getPhoto          : getPhoto
    };
}])
;

angularApp.factory('searchService', ['$rootScope', 'cartService', 'myService', function ($rootScope, cartService, myService) {
    var suffix = [
        '.cn',
        '.com.cn',
        '.net.cn',
        '.org.cn',
        '.gov.cn',
        '.ac.cn',
        '.bj.cn',
        '.sh.cn',
        '.tj.cn',
        '.cq.cn'
    ];


    var searchDomains = [];
    var whoisDoing = false;

    var search = function (domain) {
        for (var i = 0; i < suffix.length; i++) {
            var theDomain = domain + suffix[i];
            var isAdded = false;

            if (cartService.findCartByItem(theDomain) || myService.findMyDomainByName(theDomain)) {
                isAdded = true;
            }
            searchDomains[i] = {domain: theDomain, isreg: false, isAdded: isAdded, whois: []};
        }
        whois(JSON.stringify(searchDomains));
    };

    var whois = function (domain) {
        console.log("whois service");

        $.ajax({
            type         : "get",
            async        : false,
            url          : "http://oswho.com/whois",
            data         : {label: domain},
            dataType     : "jsonp",
            jsonp        : "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: "success_jsonpCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            success      : function (json) {
                console.log(json);
                searchDomains = json;
                whoisDoing = false;
                $rootScope.$broadcast('search.done');
            },
            error        : function () {
                $rootScope.$broadcast('search.error');
                whoisDoing = false;
            }
        });


        setTimeout(function () {
            if (whoisDoing) {
                $rootScope.$broadcast('search.error');
                whoisDoing = false;
            }
        }, 3000);
    };

    var getSearch = function () {
        return searchDomains;
    };

    return {
        search   : search,
        getSearch: getSearch
    };
}]);


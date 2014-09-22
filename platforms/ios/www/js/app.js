angularApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('intro', {
            url: '/',
            templateUrl: 'pages/intro.html',
            controller: 'introCtrl'
        })
        .state('main', {
            url: '/main',
            abstract: true,
            templateUrl: 'pages/main.html'
        })
        .state('main.search', {
            url: '/search',
            views: {
                "search-tab": {
                    templateUrl: 'pages/main/search.html',
                    controller: 'searchCtrl'
                }
            }
        })
        .state('main.cart', {
            url: '/cart',
            views: {
                "cart-tab": {
                    templateUrl: 'pages/main/cart.html',
                    controller: 'cartCtrl'
                }
            }
        })
        .state('main.pay', {
            url: '/cart/pay',
            views: {
                "cart-tab": {
                    templateUrl: 'pages/main/cart/pay.html',
                    controller: 'payCtrl'
                }
            }
        })
        .state('main.my', {
            url: '/my',
            views: {
                "my-tab": {
                    templateUrl: 'pages/main/my.html',
                    controller: 'myCtrl'
                }
            }
        })
        .state('main.realname', {
            url: '/realname',
            views: {
                "my-tab": {
                    templateUrl: 'pages/main/my/realname.html',
                    controller: 'realnameCtrl'
                }
            }
        })
        .state('main.domain', {
            url: '/my/domain/:domain',
            views: {
                "my-tab": {
                    templateUrl: 'pages/main/my/domain.html',
                    controller: 'domainCtrl'
                }
            }
        });
    $urlRouterProvider.otherwise("/");
});
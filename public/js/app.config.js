angular.module('eduhopApp').config(function($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/main');

    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: '/views/main.html',
            controller: 'MainCtrl'
        })
//        .state('card', {
//            url: '/card',
//            templateUrl: '/views/_card.html',
//            controller: 'CardController'
//        })

});
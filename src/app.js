'use strict';

/**
 * Routing
 */
angular
    .module('photoFrameApp', [
        'ngRoute',
        'ngCookies',
        'photoFrameAppControllers',
        'photoFrameAppServices'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/browse-playlists', {
                templateUrl: 'tpl/browser.html',
                controller: 'BrowserController'
            })
            .when('/play/:playlistId', {
                templateUrl: 'tpl/slideshow.html',
                controller: 'SlideshowController'
            })
            .otherwise({
                redirectTo: '/browse-playlists'
            });
    }]);

/**
 * Modules declaration
 */
angular.module('photoFrameAppControllers', ['ngAnimate']);
angular.module('photoFrameAppServices', []);

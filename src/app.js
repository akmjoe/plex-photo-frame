'use strict';

/**
 * Routing
 */
angular
    .module('photoFrameApp', [
        'ngRoute',
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
                templateUrl: 'tpl/slideshow.html?v=1',
                controller: 'SlideshowController'
            })
            .when('/download-playlists', {
                templateUrl: 'tpl/download-browser.html',
                controller: 'PlaylistController'
            })
            .when('/download/:playlistId', {
                templateUrl: 'tpl/slideshow.html',
                controller: 'DownloadController'
            })
            .otherwise({
                redirectTo: '/browse-playlists'
            });
    }]);

/**
 * Modules declaration
 */
angular.module('photoFrameAppControllers', ['ngAnimate']);
angular.module('photoFrameAppServices', ['ngAnimate']);

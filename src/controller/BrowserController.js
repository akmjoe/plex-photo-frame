'use strict';

/**
 * Photo browser controller
 */
angular
    .module('photoFrameAppControllers')
    .controller('BrowserController',
        ['$scope', '$window', 'PlexPlaylist', '$timeout', '$rootScope', function ($scope, $window, PlexPlaylist, $timeout, $rootScope) {
            var SETTINGS_KEY = 'slideshowSettings';

            $scope.cfg = $window.Config;
            $scope.cfg.slideshow = localStorage.getItem(SETTINGS_KEY) ? JSON.parse(localStorage.getItem(SETTINGS_KEY)) : $window.Config.slideshow;

            /**
             * Saves slideshow settings (time, randomization) to the cookie
             */
            $scope.saveSlideshowSettings = function() {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify($scope.cfg.slideshow));
            };

            PlexPlaylist.getPlaylists().then(function(playlists) {
                $scope.playlists = playlists;
            });

            (function asdf() {
                $timeout(function() {
                    $rootScope.$emit('message', 'saskldjh laksjd hkasj dkljah sdkjfhas kdj sd jksd js d sad asd dsajkfhskdjfhals sak jdaskdj hsakdj askdj ');
                    asdf();
                }, 2000);
            })();
        }]);

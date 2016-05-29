'use strict';

/**
 * Photo browser controller
 */
angular
    .module('photoFrameAppControllers')
    .controller('BrowserController',
        ['$scope', '$cookies', '$window', 'PlexPlaylist', function ($scope, $cookies, $window, PlexPlaylist) {
            var SETTINGS_KEY = 'slideshowSettings';

            $scope.cfg = $window.Config;
            $scope.cfg.slideshow = $cookies.getObject(SETTINGS_KEY) || $window.Config.slideshow;

            /**
             * Saves slideshow settings (time, randomization) to the cookie
             */
            $scope.saveSlideshowSettings = function() {
                $cookies.putObject(SETTINGS_KEY, $scope.cfg.slideshow);
            };

            PlexPlaylist.getPlaylists().then(function(playlists) {
                $scope.playlists = playlists;
            });
        }]);

'use strict';

/**
 * Photo browser controller
 */
angular
    .module('photoFrameAppControllers')
    .controller('BrowserController',
        ['$scope', '$cookies', 'PlexPlaylist', function ($scope, $cookies, PlexPlaylist) {
            var SETTINGS_KEY = 'slideshowSettings';

            $scope.cfg = Config;
            $scope.cfg.slideshow = $cookies.getObject(SETTINGS_KEY) || Config.slideshow;

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

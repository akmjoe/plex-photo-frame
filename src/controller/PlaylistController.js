'use strict';

/**
 * Photo and music playlist browse for download controller
 */
angular
    .module('photoFrameAppControllers')
    .controller('PlaylistController',
        ['$scope', '$window', '$sce', 'PlexPlaylist', function ($scope, $window, $sce, PlexPlaylist) {
            var SETTINGS_KEY = 'downloadSettings';

            $scope.cfg = $window.Config;
            $scope.cfg.slideshow = localStorage.getItem(SETTINGS_KEY) ? JSON.parse(localStorage.getItem(SETTINGS_KEY)) : $window.Config.slideshow;

            /**
             * Saves slideshow settings (time, randomization) to the cookie
             */
            $scope.saveSlideshowSettings = function() {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify($scope.cfg.slideshow));
            };

            PlexPlaylist.getDownloadPlaylists().then(function(playlists) {
                playlists.forEach(function(element) {
                    PlexPlaylist.getPhotos(element.id).then(function (response) {
                        element.files = response.photos
                    });
                });
                $scope.playlists = playlists;
                $scope.formUrl = $sce.trustAsResourceUrl($scope.cfg.plexPathRoot);
                $scope.formSubmit = function($event) {
                    $event.preventDefault();
                };
            });
        }]);

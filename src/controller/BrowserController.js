'use strict';

/**
 * Photo browser controller
 */
angular
    .module('photoFrameAppControllers')
    .controller('BrowserController',
        ['$scope', 'PlexPlaylist', function ($scope, PlexPlaylist) {
            $scope.cfg = Config;

            PlexPlaylist.getPlaylists().then(function(playlists) {
                $scope.playlists = playlists;
                playlists.forEach(function(playlist) {
                    PlexPlaylist.getPhotos(playlist.id).then(function(response) {
                        console.log(response);
                    });
                });
            });
            console.log()
        }]);

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
                $scope.playlists = playlists
                    .concat(playlists)
                    .concat(playlists)
                    .concat(playlists)
                    .concat(playlists)
                    .concat(playlists)
                    .concat(playlists)
                    .concat(playlists)
                    .concat(playlists)
                    .concat(playlists)
                    .concat(playlists);
            });
        }]);

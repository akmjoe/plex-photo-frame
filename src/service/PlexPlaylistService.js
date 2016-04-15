'use strict';

angular
    .module('photoFrameAppServices')
    .factory('PlexPlaylist', ['Config', function(Config) {

        return {
            getPlaylists: function() {
                return {};
            },
            getPhotos: function(playlistId) {
                return {};
            }
        };
    }]);

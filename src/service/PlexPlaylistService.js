'use strict';

/**
 * Service for obtaining the data from the PLEX
 */
angular
    .module('photoFrameAppServices')
    .factory('PlexPlaylist', ['$http', function ($http) {

        /**
         * Retrieves document object from xml response
         * @param path path to query
         * @returns promise
         */
        var doGetXml = function (path) {
            return $http.get(Config.plexPathRoot + path, {
                transformResponse: $.parseXML
            }).then(function (response) {
                return response.data;
            });
        };

        /**
         * Maps playlists to the list of JSON objects. Filters only photo playlists.
         * @param xmlResponse xml object from server
         * @returns {Array.<JSON>} playlist objects
         */
        var mapPlaylistsToJson = function (xmlResponse) {
            var playlistKeyRegExp = /\/playlists\/(\d+)\/items/g;
            var playlists = xmlResponse.getElementsByTagName('Playlist');
            return [].slice.call(playlists) // HTMLCollection -> Array
                .map(function (node) {
                    return {
                        absolutePath: Config.plexPathRoot + node.getAttribute('key'),
                        path: node.getAttribute('key'),
                        type: node.getAttribute('playlistType'),
                        size: node.getAttribute('leafCount'),
                        title: node.getAttribute('title'),
                        viewCount: node.getAttribute('viewCount'),
                        thumbnail: Config.plexPathRoot + node.getAttribute('composite'),
                        id: Number(playlistKeyRegExp.exec(node.getAttribute('key'))[1])
                    };
                }).filter(function (playlist) {
                    return playlist.type === 'photo';
                });

        };

        return {
            /**
             * Gets list of all photo playlists
             * @returns promise, which returns list of
             */
            getPlaylists: function () {
                return doGetXml('/playlists/all')
                    .then(mapPlaylistsToJson);
            },
            getPhotos: function (playlistId) {
                return doGetXml('/playlists/' + playlistId + '/items');
            }
        };
    }]);

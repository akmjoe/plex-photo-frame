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

        /**
         * Maps single playlist to object containing list of photos
         * @param xmlResponse xml object from server
         * @returns {{title: string, photos: Array}} playlist object
         */
        var mapSinglePlaylistToJson = function (xmlResponse) {
            var mediaContainer = xmlResponse.getElementsByTagName('MediaContainer');
            var playlistTitle = mediaContainer[0].getAttribute('title');
            var photos = [].slice.call(mediaContainer[0].getElementsByTagName('Photo')) // HTMLCollection -> Array
                .map(function (node) {
                    var parts = node.getElementsByTagName('Part');
                    var part = parts[0];
                    parts.length === 1 || console.error('Multiple part photo! Not implemented feature!');
                    var mediaList = node.getElementsByTagName('Media');
                    mediaList.length === 1 || console.error('Multiple media! Not implemented feature!');
                    var media = mediaList[0],
                        height = Number(media.getAttribute('height')),
                        width = Number(media.getAttribute('width'));
                    return {
                        parentTitle: node.getAttribute('parentTitle'),
                        title: node.getAttribute('title'),
                        year: Number(node.getAttribute('year')),
                        url: Config.plexPathRoot + part.getAttribute('key'),
                        size: Number(part.getAttribute('size')),
                        orientation: Number(part.getAttribute('orientation')),
                        height: height,
                        width: width,
                        aspectRatio: width / height
                    };
                });
            return {
                title: playlistTitle,
                photos: photos
            };
        };

        /**
         * Returns image as a blob
         * @param url image url to retrieve
         * @returns {Blob} image blob
         */
        var getPhotoAsBlob = function(url) {
            return $http({
                url: url,
                method: 'GET',
                responseType: 'blob'
            }).then(function(response) {
                return response.data;
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
                return doGetXml('/playlists/' + playlistId + '/items')
                    .then(mapSinglePlaylistToJson);
            },
            getPhotoAsBlob: getPhotoAsBlob
        };
    }]);

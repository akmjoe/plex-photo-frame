'use strict';

/**
 * Maps playlists to the list of JSON objects. Filters only photo playlists.
 * @param response json response from server
 * @returns {Array.<JSON>} playlist objects
 */
function mapPlaylistsToJson(response) {
    return response.MediaContainer.Metadata
        .map(function (node) {
            return {
                absolutePath: Config.plexPathRoot + node.key,
                path: node.key,
                type: node.playlistType,
                size: node.leafCount,
                title: node.title,
                viewCount: node.viewCount,
                thumbnail: Config.plexPathRoot + node.composite,
                id: Number(node.ratingKey)
            };
        }).filter(function (playlist) {
            return playlist.type === 'photo';
        });

}

/**
 * Maps single playlist to object containing list of photos
 * @param response json response from server
 * @returns {{title: string, photos: Array}} playlist object
 */
function mapSinglePlaylistToJson(response) {
    var mediaContainer = response.MediaContainer;
    var playlistTitle = mediaContainer.title;
    var photos = mediaContainer.Metadata
        .map(function (node) {
            var mediaList = node.Media,
                media = mediaList[0];
            mediaList.length === 1 || console.error('Multiple media! Not implemented feature!');
            var parts = media.Part,
                part = parts[0];
            parts.length === 1 || console.error('Multiple part photo! Not implemented feature!');
            var height = Number(media.height),
                width = Number(media.width);
            return {
                parentTitle: node.parentTitle,
                title: node.title,
                year: Number(node.year),
                relativeUrl: part.key,
                size: Number(part.size),
                orientation: Number(part.orientation),
                height: height,
                width: width,
                aspectRatio: width / height
            };
        });
    return {
        title: playlistTitle,
        photos: photos
    };
}


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
        function doGet(path) {
            return $http
                .get(Config.plexPathRoot + path)
                .then(function (response) {
                    return response.data;
                });
        }

        return {
            /**
             * Gets list of all photo playlists
             * @returns promise, which returns list of
             */
            getPlaylists: function () {
                return doGet('/playlists/all')
                    .then(mapPlaylistsToJson);
            },
            getPhotos: function (playlistId) {
                return doGet('/playlists/' + playlistId + '/items')
                    .then(mapSinglePlaylistToJson);
            }
        };
    }]);

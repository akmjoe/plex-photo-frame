'use strict';

angular
    .module('photoFrameAppControllers')
    .controller('BrowserController',
        ['$scope', 'PlexPlaylist', function ($scope, PlexPlaylist) {
            $scope.browser = 'browse me';
        }]);

'use strict';

angular
    .module('photoFrameAppControllers')
    .controller('SlideshowController',
        ['$scope', 'PlexPlaylist', function ($scope, PlexPlaylist) {
            $scope.foo = '';
        }]);

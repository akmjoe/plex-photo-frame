'use strict';

angular
    .module('photoFrameAppServices')
    .factory('Config', ['$resource', function ($resource) {
        return $resource('/config.json');
    }]);

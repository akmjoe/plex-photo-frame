'use strict';

/**
 * Controls display of the messages
 */
angular
    .module('photoFrameAppControllers')
    .controller('MessagesController',
        ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.messages = [];

            $rootScope.$on('message', function(event, message) {
               $scope.messages.push({ text: message, time: new Date() });
            });


        }]);

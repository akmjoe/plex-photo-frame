'use strict';

/**
 * Custom animation service
 * It's only aim is to override leave() method in angular's $animate. Using solution from:
 * http://www.fngtps.com/2010/mobile-safari-image-resource-limit-workaround/
 * It allows to remove images from DOM not causing a memory leak.
 */
angular
    .module('photoFrameAppServices')
    .factory('CustomAnimationService', [
        '$$animateQueue',
        '$animate',
        '$timeout',
        function ($$animateQueue,
                  $animate,
                  $timeout) {
            /**
             * Overwrites image with small gif and removes it after 60 seconds
             * @param {HTMLElement} img element to be removed without memory leak
             */
            function removeImage(element) {
                element.parentNode.removeChild(element);
                // set source to the empty gif
                element.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                $timeout(function () {
                    element = null; // GC plx
                }, 60000);
            }

            function prepareAnimateOptions(options) {
                return angular.isObject(options)
                    ? options
                    : {};
            }

            $animate.leave = function (element, options) {
                return $$animateQueue.push(element, 'leave', prepareAnimateOptions(options), function () {
                    if (element[0].tagName.toLowerCase() === 'img') {
                        removeImage(element[0]);
                    } else {
                        element.remove();
                    }
                });
            };

            return {};
        }]);

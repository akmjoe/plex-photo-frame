'use strict';

angular
    .module('photoFrameAppControllers')
    .controller('SlideshowController', [
        '$http',
        '$scope',
        '$interval',
        '$routeParams',
        '$window',
        'PlexPlaylist',
        'CustomAnimationService',
        function ($http, $scope,
                  $interval,
                  $routeParams,
                  $window,
                  PlexPlaylist) {

            /**
             * Calculates target dimensions of the photo to fit whole photo inside the viewport
             * @param photo
             * @returns {{width: number, height: Number}}
             */
            function calculateDimensions(photo) {
                var width = $window.innerHeight * photo.aspectRatio,
                    height = $window.innerHeight;
                if(width > $window.innerWidth) {
                    width = $window.innerWidth;
                    height = width / photo.aspectRatio;
                }
                return {
                    width: Math.round(width),
                    height: Math.round(height)
                }
            }

            /**
             * Transforms photo relative URL to the URL with the rescaled photo to the target dimensions
             * @param photoRelativeUrl
             * @param dimensions
             * @returns {string}
             */
            function getRescaledUrl(photoRelativeUrl, dimensions) {
                return '/photo/:/transcode?width=' + dimensions.width + '&height=' + dimensions.height + '&minSize=1&url='
                    + encodeURIComponent(photoRelativeUrl);
            }

            /**
             * Photo rotator object - rotates photos from the list
             * @param scope - scope to which rotator will be applied
             * @param photosObject - photos object, see PlexPlaylistService#mapSinglePlaylistToJson()
             * @param isShuffled - true to shuffle the list
             * @returns {{changePhoto: changePhoto}} - rotator object which has changePhoto method
             * @constructor
             */
            function PhotoRotator(scope, photosObject, isShuffled) {
                var photosList = [];

                return {
                    changePhoto: function() {
                        if(photosList.length === 0) {
                            photosList = photosObject.photos.copy();
                            if(isShuffled) {
                                photosList.shuffle()
                            }
                        }
                        var photo = photosList.shift();
                        var dimensions = calculateDimensions(photo);
                        scope.imageSrc = Config.plexPathRoot + getRescaledUrl(photo.relativeUrl, dimensions);
                        scope.imageWidth = dimensions.width;
                        scope.imageHeight = dimensions.height;
                    }
                };
            }

            $scope.cfg = $window.Config;
            $scope.imageSrc = '';
            $scope.currentDate = new Date();

            PlexPlaylist.getPhotos($routeParams.playlistId).then(function (response) {
                var photoRotator = new PhotoRotator($scope, response, $scope.cfg.slideshow.shuffle);
                photoRotator.changePhoto();
                $interval(photoRotator.changePhoto, $scope.cfg.slideshow.time * 1000);
                $interval(function() {
                    $scope.currentDate = new Date();
                }, 1000);
            });
        }]);

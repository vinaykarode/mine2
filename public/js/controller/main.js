'use strict';

angular.module('eduhopApp')
    .controller('MainCtrl', ['$scope', '$timeout', 'ModalService', '$upload', 'ngAudio',
        function($scope, $timeout, ModalService, $upload, ngAudio) {

            //     ['$scope', '$timeout', 'ModalService', '$upload','ngAudio ',

            $scope.textbutton = true;
            $scope.imagebutton = true;
            $scope.soundbutton = true;
            $scope.soundUploaded = false;

            $scope.frontcardText = ' ';

            $scope.modalShow = false;

            $scope.toggleModal = function() {
                $scope.modalShow = !$scope.modalShow;
            };

            //angular modal service
            $scope.display = false;

            $scope.showCustom = function() {
                $scope.display = true;

                //        ModalService.showModal({
                //          templateUrl: "views/custom.html",
                //          controller: "MainCtrl"
                //        }).then(function(modal) {
                //          modal.close.then(function(result) {
                //            $scope.customResult = "All good!";
                //          });
                //        });

            };



            //angular modal service

            $scope.showimagebutton = function() {
                $scope.imagebutton = !$scope.imagebutton;
            }

            //==============ngimg crop===================
            //==============ngimg crop===================
            //==============ngimg crop===================

            $scope.close = function() {
                //            console.log($scope.imagefile);
                console.log($scope.myCroppedImage);
                $scope.finalcroppedimaged = $scope.myCroppedImage;
                $scope.display = false;
                var blob = dataURItoBlob($scope.finalcroppedimaged);

                console.log(blob);

                var file = blob;
                $scope.upload = $upload.upload({
                    url: '/upload/image', // upload.php script, node.js route, or servlet url
                    method: 'POST',
                    //headers: {'Authorization': 'xxx'}, // only for html5
                    //withCredentials: true,
                    data: {
                        myObj: $scope.myModelObj
                    },
                    file: file,
                }).progress(function(evt) {
                    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :');
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);

                });
            };

            $scope.clickImageUpload = function() {
                $timeout(function() {
                    angular.element('#fileInput').trigger('click');
                }, 10).then(function() {
                    console.log('clicked image upload');
                    $scope.display = true;
                    $scope.showimagebutton();
                });
            };

            $scope.myImage = '';
            $scope.myCroppedImage = '';

            var handleFileSelect = function(evt) {
                var file = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function(evt) {
                    $scope.$apply(function($scope) {
                        $scope.myImage = evt.target.result;
                    });
                };
                reader.readAsDataURL(file);
            };
            angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);



            //        function dataURItoBlob(dataURI) {
            //            // convert base64/URLEncoded data component to raw binary data held in a string
            //            var byteString;
            //            if (dataURI.split(',')[0].indexOf('base64') >= 0)
            //                byteString = atob(dataURI.split(',')[1]);
            //            else
            //                byteString = unescape(dataURI.split(',')[1]);
            //
            //            // separate out the mime component
            //            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            //
            //            // write the bytes of the string to a typed array
            //            var ia = new Uint8Array(byteString.length);
            //            for (var i = 0; i < byteString.length; i++) {
            //                ia[i] = byteString.charCodeAt(i);
            //            }
            //
            //            return new Blob([ia], {
            //                type: mimeString
            //            });
            //        }

            var dataURItoBlob = function(dataURI) {
                var binary = atob(dataURI.split(',')[1]);
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {
                    type: mimeString
                });
            };



            //==============ngimg crop===================
            //==============ngimg crop===================
            //==============ngimg crop===================



            //===================ngfileupload=================
            //===================ngfileupload=================
            //===================ngfileupload=================


            $scope.$watch('myFiles', function() {
                var file = $scope.myFiles;
                $scope.upload = $upload.upload({
                    url: '/upload/audio', // upload.php script, node.js route, or servlet url
                    method: 'POST',
                    //headers: {'Authorization': 'xxx'}, // only for html5
                    //withCredentials: true,
                    data: {
                        myObj: $scope.myModelObj
                    },
                    file: file, // single file or a list of files. list is only for html5
                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                    //fileFormDataName: myFile, // file formData name ('Content-Disposition'), server side request form name
                    // could be a list of names for multiple files (html5). Default is 'file'
                    //formDataAppender: function(formData, key, val){}  // customize how data is added to the formData. 
                    // See #40#issuecomment-28612000 for sample code

                }).progress(function(evt) {
                    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :');
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
                    var data1 = data.replace(/"/g, "");
                    $scope.sounduploadedLocation = "http://localhost:3000/audio/".concat(data1);
                    $scope.audio = ngAudio.load($scope.sounduploadedLocation); // returns NgAudioObject
                    console.log($scope.audio);
                }).then(function() {
                    $scope.soundUploaded = true;
                    console.log($scope.sounduploadedLocation);

                });
                //.error(...)
                //.then(success, error, progress); // returns a promise that does NOT have progress/abort/xhr functions
                //.xhr(function(xhr){xhr.upload.addEventListener(...)}) // access or attach event listeners to 
                //the underlying XMLHttpRequest

                /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request. 
       Note that the whole file will be loaded in browser first so large files could crash the browser.
       You should verify the file size before uploading with $upload.http().
    */
                // $scope.upload = $upload.http({...})  // See 88#issuecomment-31366487 for sample code.

            });



            //===================ngfileupload============
            //===================ngfileupload=================
            //===================ngfileupload=================
            //===================ngfileupload=================



            //====================== audio playback =======================
            //====================== audio playback =======================
            //====================== audio playback =======================

            $scope.showSoundInputButton = function() {
                $scope.soundUploaded = !$scope.soundUploaded;
                $scope.soundbutton = !$scope.soundbutton;
            }

            $scope.clickSoundUpload = function() {
                $timeout(function() {
                    angular.element('#soundInput').trigger('click');
                }, 10).then(function() {
                    console.log('clicked sound upload');
                    $scope.showSoundInputButton();
                });
            };

            //        $scope.audio = ngAudio.load("http://localhost:3000/audio/snd_thunder.mp3"); // returns NgAudioObject
            //        console.log($scope.audio);


            //            $scope.sounduploadedLocation = data;
            //
            //            $scope.config = {
            //                sources: [{
            //                    src: $sce.trustAsResourceUrl(data),
            //                    //                    type: "audio/mpeg"
            //                    type: "audio/mpeg"
            //                }, {
            //                    src: $sce.trustAsResourceUrl("http://localhost:3000/audio/" + $scope.sounduploadedLocation),
            //                    type: "audio/ogg"
            //                }],
            //
            //            };


            //====================== audio playback =======================
            //====================== audio playback =======================
            //====================== audio playback =======================





            //    canvas for image zoom and crop

            //    $scope.zoomIn = function() {
            //      $scope.scale *= 1.2;
            //    };
            //
            //    $scope.zoomOut = function() {
            //      $scope.scale /= 1.2;
            //    };
            //
            //    $scope.crop = function() {
            //      var maxSize = {
            //        width: 1500,
            //        height: 1500
            //      };
            //
            //      var canvasData = apImageHelper.cropImage($scope.image, $scope.frame, maxSize);
            //    };
            //
            //    $scope.crop = function() {
            //      var maxSize = {
            //        width: 1500,
            //        height: 1500
            //      };
            //
            //      var canvasData = apImageHelper.cropImage($scope.image, $scope.frame, maxSize);
            //    };
            //    $scope.download = function($event) {
            //      var filename = new Date().getTime() + '.png';
            //      return apImageHelper.downloadImageHandler($scope.src, filename, $event);
            //    }



            //    canvas for image zoom and crop



            //    $scope.clicked=function(){
            //        console.log('clickced');
            //      $scope.showtextbutton = true;
            //
            //        console.log($scope.showtextbutton);
            //    }
            $scope.item = {
                subitems: []
            };

            $scope.addNewSubItem = function() {
                $scope.item.subitems.push({});
            };

            $scope.removeSubItemAt = function(index) {
                $scope.item.subitems.splice(index, 1);
            };


            $scope.showtextbutton = function() {
                $scope.textbutton = !$scope.textbutton;
                $scope.focusText = true;
            };


        }
    ])

.directive('focusMe', function() {
    return {
        scope: {
            trigger: '=focusMe'
        },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if (value === true) {
                    element[0].focus();
                    scope.trigger = false;
                }
            })
        }
    };
})




//
//.directive('modalDialog', function() {
//    return {
//        restrict: 'E',
//        scope: {
//            show: "="
//        },
//        //        replace:true,
//        transclude: true,
//        link: function(scope, element, attrs) {
//            scope.dialogStyle = {};
//            if (attrs.width)
//                scope.dialogStyle.width = attrs.width;
//            if (attrs.height)
//                scope.dialogStyle.height = attrs.height;
//
//            scope.hideModal = function() {
//                scope.show = false;
//            };
//
//        },
//        template: '<div class="ng-modal" ng-show="show"> <div class="ng-modal-overlay" ng-click="hideModal()"></div> <div class="ng-modal-dialog" ng-style="dialogStyle"> <div class="ng-modal-close" ng-click="hideModal()">X</div> <div class="ng-modal-dialog-content" ng-transclude></div> </div> </div>'
//    };
//
//});
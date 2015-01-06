'use strict';

angular.module('eduhopApp').directive('subItemPartial', function() {
    return {
        restrict: "E",
        templateUrl: "/views/main.html",
        scope: {
            subitem: "="
        }
    };
});
((window, angular) => {
  "use strict";

  angular.module('app.controller.Disclaimer', [])
    .controller('DisclaimerController', ($scope, $mdDialog) => {

      $scope.openUrl = (url) => {
        var open = require("open");
        open(url);
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

    })
})(window, window.angular);
((window, angular) => {
  "use strict";


  angular.module('app.controller.Main', [])
  .controller('MainController', ($scope, $rootScope, $state, $timeout, $mdSidenav,
                                 $mdMedia, $mdDialog, ThaiCvRisk) => {

    $scope.go = (state) => {
      $state.go(state)
    };

    $scope.sbp = 120;
    $scope.useLab = true;
    $scope.totalCholesterol = 135;
    $scope.ldl = 130;
    $scope.hdl = 45;
    $scope.height = 165;
    $scope.waist = 30;

    $scope.ages = [];
    for(let i = 35; i <= 70; i++) {
      let name = `${i} ปี`;
      $scope.ages.push({val: i, name: name});
    }

    $scope.sexes = [
      {val: 1, name: 'ชาย'},
      {val: 0, name: 'หญิง'}
    ];

    //
    //$scope.$watch('useLab', () => {
    //  console.log($scope.useLab);
    //});

    $scope.doCal = () => {
      let tc = {};
      tc.age = $scope.age;
      tc.sex = $scope.sex;
      tc.smoke = $scope.isSmoke ? 1 : 0;
      tc.dm = $scope.isDm ? 1 : 0;
      tc.sbp = $scope.sbp;
      tc.tc = $scope.totalCholesterol;
      tc.ldl = $scope.ldl;
      tc.hdl = $scope.hdl;
      tc.whr = 0;
      tc.wc = $scope.waist * 2.5;
      tc.height = $scope.height;

      if (tc.wc > 0 && tc.height > 0) { tc.whr = tc.wc / tc.height }

      if (!$scope.useLab) {
        tc.tc = 0;
        tc.ldl = 0;
        tc.hdl = 0;
      } else {
        tc.waist = 0;
        tc.height = 0;
        tc.whr = 0;
      }

      $rootScope.tc = tc;

      let sum_risk = ThaiCvRisk.doCalculate(
        tc.age, tc.smoke, tc.dm, tc.sbp, tc.sex,
        tc.tc, tc.ldl, tc.hdl, tc.whr, tc.waist
      );

      $rootScope.sumRisk = sum_risk;
    };


    $scope.about = () => {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('เกี่ยวกับโปรแกรม')
          .textContent('พัฒนาโดย นายสถิตย์ เรียนพิศ นักวิชาการคอมพิวเตอร์ โรงพยาบาลกันทรวิชัย')
          .ariaLabel('About')
          .ok('ตกลง')
      );
    };

    $scope.showDisclaimer = (ev) => {
      $mdDialog.show({
        controller: 'DisclaimerController',
        templateUrl: 'dialog_disclaimer.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: false
      });
    };
    // show dialog
    $scope.showResult = (ev) => {

      if (!$scope.age && !$scope.sex) {

        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('เกิดข้อผิดพลาด')
            .textContent('กรุณาระบุ เพศ และ อายุของคุณ')
            .ariaLabel('Alert')
            .ok('ตกลง')
        );

      } else {
        $scope.doCal();

        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'dialog_result.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: false
        });
      }
    };

    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
          args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            //$log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            //$log.debug("toggle " + navID + " is done");
          });
      }
    }

  })
})(window, window.angular);
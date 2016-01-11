((window, angular) => {
  "use strict";

  angular.module('app', [
    'ngMaterial', 'app.controller.Main', 'app.service.ThaiCvRisk', 'app.controller.Batch',
    'app.controller.Dialog', 'app.controller.Disclaimer', 'ui.router', 'md.data.table'
  ])
  .config(($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
      .state('main', {
        url: "/",
        templateUrl: "partials/main.html",
        controller: 'MainController'
      })
      .state('batch', {
        url: "/batch",
        templateUrl: "partials/batch.html",
        controller: 'BatchController'
      });
  })

})(window, window.angular);
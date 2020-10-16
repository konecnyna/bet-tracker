app.controller("cardsCtrl", function ($scope, $timeout, $http) {
  (function tick() {
    $http
      .get("api/v1/scores")
      .success(function (data, status, headers, config) {
        $scope.picks = data;
        $scope.lost = [];

        //Hack. :)
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
            if (data[i][j].panel_class) {
              $scope.lost[i] = data[i][j].panel_class;
              break;
            }
          }
        }

        //15 sex
        $timeout(tick, 60000 * 1);
      }).
      error(function (data, status, headers, config) { });

  })();

});

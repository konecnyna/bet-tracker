app.controller('cardsCtrl', function($scope, $timeout, $http){
	    (function tick() {
        $http.get('api/v1/scores').
          success(function(data, status, headers, config) {
            $scope.picks = data;
            //15 sex
            $timeout(tick, 1000*15);

          }).
          error(function(data, status, headers, config) {});

    })();

});

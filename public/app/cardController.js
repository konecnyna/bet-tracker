app.controller('cardsCtrl', function($scope, $timeout, $http){

	$scope.message = "BOOBS!!!!!";

	    (function tick() {
        $http.get('api/v1/scores').
          success(function(data, status, headers, config) {
            
            $scope.cards = data;
            //15 sex
            $timeout(tick, 1000*15*60);

          }).
          error(function(data, status, headers, config) {});

    })();

});

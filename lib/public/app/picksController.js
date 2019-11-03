app.controller('picksCtrl', function($scope, $http){
    $http.get('api/v1/picks').success(function(data, status, headers, config) {        
        $scope.picks = data;        
      }).
      error(function(data, status, headers, config) {
        $scope.picks = "Error: Couldn't get picks!";
      });
});

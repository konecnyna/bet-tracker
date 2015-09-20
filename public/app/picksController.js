app.controller('picksCtrl', function($scope, $http){
    $scope.message = "BOOBS!!!!!"; 
    
    $http.get('api/v1/get_picks').success(function(data, status, headers, config) {        
        $scope.picks = data;        
      }).
      error(function(data, status, headers, config) {
        $scope.picks = "Error: Couldn't get picks!";
      });
});

app.controller('streamCtrl', function($scope, $http){
    $scope.message = "BOOBS!!!!!"; 
    $http.get('api/v1/streams').success(function(data, status, headers, config) {        
        console.log("got picks!");
        $scope.state  = "hidden";
        $scope.steams = data;        
      }).
      error(function(data, status, headers, config) {
        $scope.picks = "Error: Couldn't get picks!";
      });
});

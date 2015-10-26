app.controller('streamCtrl', function($scope, $http){
    $scope.message = "BOOBS!!!!!"; 
    $http.get('api/v1/streams').success(function(data, status, headers, config) {        
        console.log("got picks!");
        if(data.length > 0){
        	$scope.steams = data;        	
        }else{
        	$scope.error_msg = "No games are in progress.";	
        }
        $scope.state  = "hidden";
        	
      }).
      error(function(data, status, headers, config) {
        $scope.error_msg = "Error: Couldn't get streams!!!!";
      });
});

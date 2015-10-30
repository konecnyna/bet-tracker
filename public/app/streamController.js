app.controller('streamCtrl', function($scope, $http){
    $scope.message = "BOOBS!!!!!"; 
    $scope.type = "nfl";

    $http.get('api/v1/streams').success(function(data, status, headers, config) {        
        console.log("got picks!");
        if(data.length > 0){
        	$scope.streams = data;        	
        }else{
        	$scope.error_msg = "No games are in progress.";	
        }
        $scope.state  = "hidden";
        	
      }).
      error(function(data, status, headers, config) {
        $scope.error_msg = "Error: Couldn't get streams!!!!";
      });

    $scope.update = function(item) {
      $scope.state  = "";
      $scope.error_msg = "";
       
      $http.get('api/v1/streams?type='+item).success(function(data, status, headers, config) {        
        console.log("got picks!");
        if(data.length > 0){
          $scope.streams = data;          
        }else{
          $scope.error_msg = "No games are in progress."; 
        }
        $scope.state  = "hidden";
          
      }).
      error(function(data, status, headers, config) {
        $scope.error_msg = "Error: Couldn't get streams!!!!";
      });
    }
});

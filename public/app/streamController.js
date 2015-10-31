app.controller('streamCtrl', function($scope, $http){
  $scope.type = "nfl";
  $scope.message = ""; 

  $scope.update = function(item) {
    getStreams(item);
  };

  function getStreams(item){
    $scope.streams = [];
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

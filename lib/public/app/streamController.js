app.controller('streamCtrl', function($scope, $http){
  $scope.type = "nfl";
  $scope.message = ""; 
  getStreams($scope.type);


  $scope.update = function(item) {
    getStreams(item);
  };

  function getStreams(item){
    $scope.streams = [];
    $scope.state  = "";
    $scope.error_msg = "";
     
    $http.get('api/v1/streams?type='+item).success(function(data, status, headers, config) {        
      if(data.length > 0){
        $scope.streams = data;          
      }else{
        $scope.error_msg = "No games are in progress."; 
        console.log(data.err_link);
        $scope.error_link = data.err_link;
      }
      $scope.state  = "hidden";
        
    }).
    error(function(data, status, headers, config) {
      $scope.error_msg = "Error: Couldn't get streams!!!!";
      $scope.state  = "hidden";
    });
  }


});

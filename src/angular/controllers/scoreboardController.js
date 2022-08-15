angular.module('blackjack').controller('scoreboardController', function($scope, userAPI){
    function loadData(){
        userAPI.readPlayers()
        .then((res) => {
           $scope.users = res.data
           $scope.oc = 'wins'
           $scope.op = true
        })

        const player = localStorage['player']
        if(player != ''){
            $scope.player = player
        }
    }
    
    loadData()
})
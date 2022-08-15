angular.module('blackjack').controller('achievmentsController', function($scope, userAPI){
    $scope.achievments = []
    $scope.achievmentsIncomplete = []
    
    function loadData(){
        const player = localStorage['player']
        if(player != ''){
            $scope.player = player
            loadAchievments(player)
        }
    }

    function loadAchievments(player){
        userAPI.readOne(player)
        .then((res) => {
            const user = res.data[0]

            user.achievments.forEach(achievment => {
                if(achievment.done){
                    $scope.achievments.push(achievment)
                }
                else{
                    $scope.achievmentsIncomplete.push(achievment)
                }
            });
        })
    }
    
    loadData()
})
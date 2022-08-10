angular.module('blackjack').controller('accountController', function($scope){

    function checkAnyPlayer(){
        if(localStorage['player'] != ''){
            $scope.isUserOff = false
        }
        else{
            $scope.isUserOff = true
        }
    }

    $scope.logout = function(){
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você tem certeza que deseja fazer logout?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim!',
            cancelButtonText: 'Cancelar!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage['player'] = ''
                $scope.isUserOff = true
                Swal.fire(
                    'Sucesso!',
                    'A operação foi realizada com sucesso!',
                    'success'
                )
            }
        })
    }

    $scope.login = function(user){
        
    }

    checkAnyPlayer()
})
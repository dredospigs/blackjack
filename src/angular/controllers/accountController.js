angular.module('blackjack').controller('accountController', function($scope, userAPI){

    function checkAnyPlayer(){
        if(localStorage['player'] != ''){
            $scope.isUserOff = false
            $scope.loggedUser = localStorage['player']
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
                $scope.loggedUser = ''
                Swal.fire(
                    'Sucesso!',
                    'A operação foi realizada com sucesso!',
                    'success'
                )
            }
        })
    }

    $scope.login = function(user){
        localStorage['player'] = user.name
        let hasPlayer = false
        const player = localStorage['player']

        userAPI.readPlayers()
        .then((res) => {
            res.data.forEach(user => {
                if(user.name === player){
                    hasPlayer = true
                }
            });

            if(!hasPlayer){
                let newUser = {
                    'name' : player, 
                    'matches' : 0, 
                    'wins' : 0, 
                    'achievments' : [
                        {"done" : false, "desc": "Ganhe sua primeira partida", "title" : "A new player arrives", "icon" : "fa-solid fa-plane"},
                        {"done" : false, "desc": "Consiga um blackjack", "title" : "Blackjack!", "icon" : "fa-solid fa-gem"},
                        {"done" : false, "desc": "Jogue uma partida multiplayer", "title" : "New opponents", "icon" : "fa-solid fa-masks-theater"},
                        {"done" : false, "desc": "Empate 2 partidas seguidas", "title" : "Neither you nor me...", "icon" : "fa-solid fa-dove"},
                        {"done" : false, "desc": "Perca 10 vezes seguidas", "title" : "A.I. revolution", "icon" : "fa-solid fa-robot"},
                        {"done" : false, "desc": "Vença 3 vezes seguidas", "title" : "The rising of the champ", "icon" : "fa-solid fa-award"},
                        {"done" : false, "desc": "Vença 5 vezes seguidas", "title" : "Blackjack Master!", "icon" : "fa-solid fa-diamond"},
                        {"done" : false, "desc": "Consiga 2 blackjacks seguidos", "title": "No hacks required", "icon" : "fa-solid fa-clover"},
                        {"done" : false, "desc": "Vença uma partida tendo 15 pontos ou menos", "title": "I don't need much to defeat you, fool!", "icon": "fa-solid fa-martini-glass"}
                    ]
                }

                userAPI.createPlayer(newUser)
                .then(() => {
                    Swal.fire(
                        'Logado!',
                        'Agora seu progresso será salvo!',
                        'success'
                    )
                })
            }
            else{
                Swal.fire(
                    'Logado!',
                    'Agora seu progresso será salvo!',
                    'success'
                )
            }

            $scope.user.name = ''
            $scope.loggedUser = player
            checkAnyPlayer()
        })
    }

    checkAnyPlayer()
})
angular.module('blackjack').controller('multiplayerController', function($scope, $http, $timeout, userAPI){ 
    var p1Value = []
    var p2Value = []
    var idDeck
    var sideToast1 = new bootstrap.Toast(document.getElementById("sideToast1"))
    var sideToast2 = new bootstrap.Toast(document.getElementById("sideToast2"))
    var acvmToast = new bootstrap.Toast(document.getElementById("acvmToast"))

    $scope.newDeck = () => {
        $http({
            url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
            method: 'GET'
        })
        .then((res) => {
            $scope.isPlaying = true
            idDeck = res.data.deck_id
            $scope.reset()
            p1Value = []
            p2Value = []
            $('#resultModal').modal('hide');
            inicialCards()
        })
    }

    $scope.newCard = (whichPlayer) => {
        let hasAce
        let count = 0;
        $http({
            url: 'https://deckofcardsapi.com/api/deck/'+idDeck+'/draw/?count=1',
            method: 'GET'
        })
        .then((res) => {
            if(whichPlayer === 'p1'){
                $scope.p1Cards.push(res.data.cards[0].images.png)  
                p1Value.push(valueCalculator(res.data.cards[0].value)) 

                p1Value.forEach(card => {
                    count += card
    
                    if(card == 1){
                        hasAce = true
                    }
                });
                if(hasAce && count <= 11){
                    count += 10
                }    

                $scope.p1Points = count
                if($scope.p1Points > 21){
                    $scope.stop('p1')
                    
                    $scope.toastTitle1 = 'Estorou!'
                    $scope.toastText1 = 'Player 1 estorou!'
                    $scope.toastHeader1 = 'toast-header hardRed text-bg-danger'
                    $scope.toastBody1 = {'--bs-bg-opacity': '.9', 'background-color': '#c42446'}
                    $scope.toastIcon1 = 'fa-regular fa-circle-xmark'

                    sideToast1.show();                
                    $timeout(() => {
                        sideToast1.hide()
                    }, 1700);
                }
            }         
            else{
                $scope.p2Cards.push(res.data.cards[0].images.png)     
                p2Value.push(valueCalculator(res.data.cards[0].value))      
                
                p2Value.forEach(card => {
                    count += card
    
                    if(card == 1){
                        hasAce = true
                    }
                });
                if(hasAce && count <= 11){
                    count += 10
                }  

                $scope.p2Points = count
                if($scope.p2Points > 21){
                    $scope.stop('p2')

                    $scope.toastTitle2 = 'Estorou!'
                    $scope.toastText2 = 'Player 2 estorou!'
                    $scope.toastHeader2 = 'toast-header hardRed text-bg-danger'
                    $scope.toastBody2 = {'--bs-bg-opacity': '.9', 'background-color': '#c42446'}
                    $scope.toastIcon2 = 'fa-regular fa-circle-xmark'

                    sideToast2.show();                
                    $timeout(() => {
                        sideToast2.hide()
                    }, 1700);
                }
            }
        })
    }

    $scope.stop = function(player){
        if(player == 'p1'){ $scope.out1 = true }
        else{ $scope.out2 = true }

        if( $scope.out1 && $scope.out2){
            checkScore()
        }
    }

    function checkScore(){
        if(($scope.p1Points > 21 && $scope.p2Points > 21) || $scope.p1Points == $scope.p2Points){
            $scope.modalResult = 'EMPATE'
            $scope.modalHeader = 'empateColor'
            $scope.modalBody = 'empateBdColor'
            $scope.modalButton = 'empateButton'
        }
        else{
            if($scope.p1Points > $scope.p2Points){
                if($scope.p1Points > 21){
                    $scope.modalResult = 'JOGADOR 2 VENCEU!'
                    $scope.modalHeader = 'vitoriaColor'
                    $scope.modalBody = 'vitoriaBdColor'
                    $scope.modalButton = 'vitoriaButton'
                }
                else{
                    $scope.modalResult = 'JOGADOR 1 VENCEU!'
                    $scope.modalHeader = 'vitoriaColor'
                    $scope.modalBody = 'vitoriaBdColor'
                    $scope.modalButton = 'vitoriaButton'
                }
            }
            else{
                if($scope.p2Points > 21){
                    $scope.modalResult = 'JOGADOR 1 VENCEU!'
                    $scope.modalHeader = 'vitoriaColor'
                    $scope.modalBody = 'vitoriaBdColor'
                    $scope.modalButton = 'vitoriaButton'
                }
                else{
                    $scope.modalResult = 'JOGADOR 2 VENCEU!'
                    $scope.modalHeader = 'vitoriaColor'
                    $scope.modalBody = 'vitoriaBdColor'
                    $scope.modalButton = 'vitoriaButton'
                }
            }
        }

        $timeout(() => {
            $scope.results = true
            $('#resultModal').modal('show');
        }, 800);

        const player = localStorage['player']
        if(player != ''){
            userAPI.readOne(player)
            .then((res) => {
                const user = res.data[0]

                if(!user.achievments[2].done){
                    achievmentsUpdate(user, 2)
                }
            })
        }
    }

    function valueCalculator(value){
        if(value === 'KING' || value === 'QUEEN' || value === 'JACK'){
            return Number(10)
        }
        else if(value === 'ACE'){
            return Number(1)
        }
        else{
            return Number(value)
        }     
    }

    function inicialCards(){
        $http({
            url: 'https://deckofcardsapi.com/api/deck/'+idDeck+'/draw/?count=4',
            method: 'GET'
        })
        .then((res) => {
            //player1
            $scope.p1Cards.push(res.data.cards[0].images.png)
            $scope.p1Cards.push(res.data.cards[1].images.png)

            let p11 = valueCalculator(res.data.cards[0].value)
            let p21 = valueCalculator(res.data.cards[1].value)

            let hasAce1
            if(p11 == 1 || p21 == 1){
                hasAce1 = true;
            }

            p1Value.push(p11)
            p1Value.push(p21)

            $scope.p1Points += (p11 + p21)
            if(hasAce1 && $scope.p1Points == 11){
                $scope.p1Points = 21  
                $scope.toastTitle1 = 'BlackJack!'
                $scope.toastText1 = 'Player 1 conseguiu um blackjack!'
                $scope.toastHeader1 = 'toast-header hardGreen text-bg-success'
                $scope.toastBody1 = {'--bs-bg-opacity': '.9', 'background-color': '#34eb43'}
                $scope.toastIcon1 = 'fa-solid fa-crown'

                sideToast1.show();                
                $timeout(() => {
                    sideToast1.hide()
                }, 1700);
            }

            //player2
            $scope.p2Cards.push(res.data.cards[2].images.png)
            $scope.p2Cards.push(res.data.cards[3].images.png)

            let p12 = valueCalculator(res.data.cards[2].value)
            let p22 = valueCalculator(res.data.cards[3].value)

            let hasAce2
            if(p12 == 1 || p22 == 1){
                hasAce2 = true;
            }

            p2Value.push(p12)
            p2Value.push(p22)

            $scope.p2Points += (p12 + p22)
            if(hasAce2 && $scope.p2Points == 11){
                $scope.p2Points = 21  
                $scope.toastTitle2 = 'BlackJack!'
                $scope.toastText2 = 'Player 2 conseguiu um blackjack!'
                $scope.toastHeader2 = 'toast-header hardGreen text-bg-success'
                $scope.toastBody2 = {'--bs-bg-opacity': '.9', 'background-color': '#34eb43'}
                $scope.toastIcon2 = 'fa-solid fa-crown'

                sideToast2.show();                
                $timeout(() => {
                    sideToast2.hide()
                }, 1700);
            }
        })
    }

    function achievmentsUpdate(player, code){
        let acvm = []
        player.achievments.forEach(achievment => {
            var obj = {}

            if(achievment === player.achievments[code]){
                obj = {
                    "title" : achievment.title,
                    "desc" : achievment.desc,
                    "done" : !achievment.done,
                    "icon" : achievment.icon
                }
            }
            else{
                obj = {
                    "title" : achievment.title,
                    "desc" : achievment.desc,
                    "done" : achievment.done,
                    "icon" : achievment.icon
                }
            }

            acvm.push(obj)
        });

        userAPI.updatePlayer(player._id, {"achievments" : acvm})
        .then(() => {
            $scope.toastTitleAcvm = player.achievments[code].title
            $scope.toastTextAcvm = player.achievments[code].desc
            acvmToast.show()
        })
    }

    $scope.reset = function(){
        $scope.p1Cards = []
        $scope.p2Cards = []
        $scope.p1Points = 0
        $scope.p2Points = 0
        $scope.out1= false
        $scope.out2= false
    }
    $scope.reset()
})
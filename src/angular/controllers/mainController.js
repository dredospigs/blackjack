angular.module('blackjack').controller('mainController', function($scope, $http, $timeout, userAPI){
    var emp = 0, vit = 0, der = 0, bj = 0, botCards = 2
    var botCardsValue = []
    var cardsValue = []
    var botInitialCard, botInitialValue, idDeck

    var sideToastDf = new bootstrap.Toast(document.getElementById("sideToastDf"))
    var sideToastBj = new bootstrap.Toast(document.getElementById("sideToastBj"))
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
            $('#resultModal').modal('hide');
            inicialCards()
        })
    }

    $scope.newCard = () => {
        $http({
            url: 'https://deckofcardsapi.com/api/deck/'+idDeck+'/draw/?count=1',
            method: 'GET'
        })
        .then((res) => {
            $scope.cartas.push(res.data.cards[0].images.png)
            cardsValue.push(valueCalculator(res.data.cards[0].value))

            let hasAce
            let count = 0;
            cardsValue.forEach(card => {
                count += card

                if(card == 1){
                    hasAce = true
                }
            });

            if(hasAce && count <= 11){
                count += 10
            }

            $scope.points = count
            if($scope.points > 21){
                $scope.toastTitleDf = 'Estorou!'
                $scope.toastTextDf = 'Sua pontuação estorou!'
                
                sideToastDf.show();                
                $timeout(() => {
                    sideToastDf.hide()
                }, 1400);

                $scope.stop()
            }
        })
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

    function checkScore(){
        if(($scope.botPoints > 21 && $scope.points > 21) || ($scope.botPoints == $scope.points)){
            $scope.modalResult = 'EMPATE'
            $scope.modalHeader = 'empateColor'
            $scope.modalBody = 'empateBdColor'
            $scope.modalButton = 'empateButton'
            emp++
            der = 0
            vit = 0
            saveOnDb(false)
        }
        else{
            if($scope.points > $scope.botPoints){
                if($scope.points > 21){
                    $scope.modalResult = 'DERROTA'
                    $scope.modalHeader = 'derrotaColor'
                    $scope.modalBody = 'derrotaBdColor'
                    $scope.modalButton = 'derrotaButton'
                    saveOnDb(false)
                    der++
                    emp = 0
                    vit = 0
                }
                else{
                    $scope.modalResult = 'VITÓRIA'
                    $scope.modalHeader = 'vitoriaColor'
                    $scope.modalBody = 'vitoriaBdColor'
                    $scope.modalButton = 'vitoriaButton'
                    saveOnDb(true)
                    vit++ 
                    der = 0
                    emp = 0
                }
            }
            else{
                if($scope.botPoints > 21){
                    $scope.toastTitleDf = 'Estorou!'
                    $scope.toastTextDf = 'A pontuação do B.O.T. estorou!'
                    sideToastDf.show();
                    $timeout(() => {
                        sideToastDf.hide()
                    }, 1400);    

                    $scope.modalResult = 'VITÓRIA'
                    $scope.modalHeader = 'vitoriaColor'
                    $scope.modalBody = 'vitoriaBdColor'
                    $scope.modalButton = 'vitoriaButton'
                    saveOnDb(true)
                    vit++
                    der = 0
                    emp = 0
                }
                else{
                    $scope.modalResult = 'DERROTA'
                    $scope.modalHeader = 'derrotaColor'
                    $scope.modalBody = 'derrotaBdColor'
                    $scope.modalButton = 'derrotaButton'
                    saveOnDb(false)
                    der++
                    emp = 0
                    vit = 0
                }
            }
            
        }

        $timeout(() => {
            $scope.results = true
            $('#resultModal').modal('show');
        }, 800);

        checkPoint()
    }

    $scope.stop = () => {
        $scope.cartasBot[1] = botInitialCard
        botCardsValue.push(botInitialValue)

        let botHasAce = false
        if(botInitialValue == 1 || botCardsValue[0] == 1){
            botHasAce = true
        }

        $scope.botPoints += botInitialValue
        if(botHasAce && $scope.botPoints == 11){
            $scope.botPoints += 10

            $scope.toastTitleBj= 'Blackjack!'
            $scope.toastTextBj = 'B.O.T. conseguiu um blackjack!'
            sideToastBj.show(); 
            $timeout(() => {
                sideToastBj.hide()
            }, 1400);  

            checkScore()
        }
        else if($scope.botPoints < 16 && $scope.botPoints < $scope.points){
            newCardBot()
        } 
        else{
            checkScore()
        }
    }

    function newCardBot(){
        $http({
            url: 'https://deckofcardsapi.com/api/deck/'+idDeck+'/draw/?count=1',
            method: 'GET'
        })
        .then((res) => {
            $scope.cartasBot.push(res.data.cards[0].images.png)

            botCardsValue.push(valueCalculator(res.data.cards[0].value))
            botCards++;
            
            let botHasAce
            let count = 0;
            botCardsValue.forEach(card => {
                count += card

                if(card == 1){
                    botHasAce = true
                }
            });

            if(botHasAce && count <= 11){
                count += 10
            }

            $scope.botPoints = count    
            if($scope.botPoints > $scope.points && $scope.botPoints <= 21){
                checkScore()
            }        
            else if((($scope.botPoints - (botCards * 2)) <= 11) && botCards < 6 && $scope.botPoints < 21 && $scope.botPoints < $scope.points && $scope.points <= 21){
                newCardBot()
            }else{
                checkScore()
            }
        })
    }

    function inicialCards(){
        $http({
            url: 'https://deckofcardsapi.com/api/deck/'+idDeck+'/draw/?count=4',
            method: 'GET'
        })
        .then((res) => {
            //player
            $scope.cartas.push(res.data.cards[0].images.png)
            $scope.cartas.push(res.data.cards[1].images.png)

            let p1 = valueCalculator(res.data.cards[0].value)
            let p2 = valueCalculator(res.data.cards[1].value)

            let hasAce
            if(p1 == 1 || p2 == 1){
                hasAce = true;
            }

            cardsValue.push(p1)
            cardsValue.push(p2)

            $scope.points += (p1 + p2)
            if(hasAce && $scope.points == 11){
                $scope.points = 21  
                bj++

                $scope.toastTitleBj = 'Blackjack!'
                $scope.toastTextBj = 'Você conseguiu um blackjack!'
                sideToastBj.show(); 
                $timeout(() => {
                    sideToastBj.hide()
                }, 1400);   
                
                const player = localStorage['player']
                if(player != ''){
                    userAPI.readOne(player)
                    .then((res) => {
                        const user = res.data[0]

                        if(!user.achievments[1].done){
                            achievmentsUpdate(user, 1)
                        }

                        if(!user.achievments[7].done && bj >= 2){
                            achievmentsUpdate(user, 7)
                        }
                    })
                }
            }  
            else{
                bj = 0
            }

            //bot
            $scope.cartasBot.push(res.data.cards[2].images.png)
            $scope.cartasBot.push("./img/cardBot.png")
            botInitialCard = res.data.cards[3].images.png

            let v1 = valueCalculator(res.data.cards[2].value)
            let v2 = valueCalculator(res.data.cards[3].value)

            botCardsValue.push(v1)
            botInitialValue = v2

            $scope.botPoints = v1
        })
    }

    function saveOnDb(result){
        const player = localStorage['player']

        if(player != ''){
            userAPI.readOne(player)
            .then((res) => {
                const user = res.data[0]

                let v = 0
                if(result){
                    v = 1
                    if(!user.achievments[0].done){
                        achievmentsUpdate(user, 0)
                    }
                }

                const update = {
                    "matches" : (Number(user.matches) + 1),
                    "wins" : (Number(user.wins) + v)
                }

                userAPI.updatePlayer(user._id, update)
            })
        }
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

    function checkPoint(){
        const player = localStorage['player']
        if(player != ''){
            userAPI.readOne(player)
            .then((res) => {
                const user = res.data[0]

                if(!user.achievments[3].done && emp >= 2){
                    achievmentsUpdate(user, 3)
                }

                if(!user.achievments[4].done && der >= 10){
                    achievmentsUpdate(user, 4)
                }

                if(!user.achievments[5].done && vit >= 3){
                    achievmentsUpdate(user, 5)
                }

                if(!user.achievments[6].done && vit >= 5){
                    achievmentsUpdate(user, 6)
                }

                if(!user.achievments[8].done && $scope.points <= 15 && vit != 0){
                    achievmentsUpdate(user, 8)
                }
            })
        }
    }

    $scope.reset = function(){
        $scope.botPoints = 0
        $scope.points = 0
        botCards = 2;
        $scope.cartas = []
        $scope.cartasBot = []
        botCardsValue = []
        cardsValue = []
    }
    $scope.reset()
})
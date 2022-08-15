angular.module("blackjack").factory("userAPI", ($http, config)=>{
    const _get = function(){
        return $http({
            url: config.baseUrl + '/user',
            method: 'GET'
        })
    }

    const _getOne = function(name){
        return $http({
            url: config.baseUrl + '/user/' + name,
            method: 'GET'
        })
    }

    const _post = function(player){
        return $http.post(config.baseUrl + "/user", player)
    }

    const _put = function(playerID, update){
        return $http.put(config.baseUrl + "/user/" + playerID, update)
    }

    return {
        readPlayers : _get,
        createPlayer : _post,
        updatePlayer : _put,
        readOne : _getOne
    }
})
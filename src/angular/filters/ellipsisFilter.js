angular.module("blackjack").filter("ellipsis", function(){
    return function(input, size){
        if(input != null){
            if(input.length <= size) return input
            var output = input.substring(0, (size || 2)) + "..."
            return output
        }
        else{
            return output
        }
    }
})
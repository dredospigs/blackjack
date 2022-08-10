angular.module('blackjack').config(function($routeProvider){
  $routeProvider.when("/play",{
    templateUrl: "angular/views/quickPlay.html",
    controller: "mainController"
  })

  $routeProvider.when("/rules", {
    templateUrl: "angular/views/rules.html"
  })

  $routeProvider.when("/multiplayer", {
    templateUrl: "angular/views/multiplayer.html",
    controller: "multiplayerController"
  })

  // $routeProvider.when("/account", {
  //   templateUrl: "angular/views/account.html",
  //   controller: "accountController"
  // })

  $routeProvider.otherwise({redirectTo: "/play"});
})
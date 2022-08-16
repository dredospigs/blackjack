require('angular');
require('angular-mocks');
require('angular-route')
require('../app');
require('./mainController');
require('./multiplayerController')
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');

describe('Controllers', function () {

    class LocalStorageMock {
        constructor() {
          this.store = {};
        }
      
        clear() {
          this.store = {};
        }
      
        getItem(key) {
          return this.store[key] || null;
        }
      
        setItem(key, value) {
          this.store[key] = String(value);
        }
      
        removeItem(key) {
          delete this.store[key];
        }
    }      
    global.localStorage = new LocalStorageMock;
    beforeEach(function () {
        angular.mock.module('blackjack');
    });
    const fakePromise = () => new Promise((resolve) => resolve)
    const _userAPI = {
        readPlayers: fakePromise,
        createPlayer: fakePromise,
        readOne: fakePromise,
        updatePlayer: fakePromise,
    }
    let controller;
    let rootScope
   beforeEach(inject(($controller, $rootScope) => {
        rootScope = $rootScope
        controller = $controller
    }));
  
    describe('Quick Play controller', function (){    
        it('should initialize with the default informations', function (){
            const vm = newControllerInstance('mainController')
            
            expect(vm.botPoints).toEqual(0)
            expect(vm.points).toEqual(0)
            expect(vm.cartas).toEqual([])
            expect(vm.cartasBot).toEqual([])
        })

        it('should change all data to the received information', function (){
          const vm = newControllerInstance('mainController')
          vm.botPoints = 10
          vm.points = 12
          vm.cartas = ['as', '8']
          vm.cartasBot = ['king', '6']

          expect(vm.botPoints).toEqual(10)
          expect(vm.points).toEqual(12)
          expect(vm.cartas).toEqual(['as', '8'])
          expect(vm.cartasBot).toEqual(['king', '6'])
      })

        it('should reset all data to the default informations', function (){
          const vm = newControllerInstance('mainController')
          vm.botPoints = 10
          vm.points = 12
          vm.cartas = ['as', '8']
          vm.cartasBot = ['king', '6']

          vm.reset()
          expect(vm.botPoints).toEqual(0)
          expect(vm.points).toEqual(0)
          expect(vm.cartas).toEqual([])
          expect(vm.cartasBot).toEqual([])
      })
    })

    describe('Multiplayer controller', function(){
      it('should initialize with the default informations', function(){
        const vm = newControllerInstance('multiplayerController')

        expect(vm.p1Points).toEqual(0)
        expect(vm.p2Points).toEqual(0)
        expect(vm.p1Cards).toEqual([])
        expect(vm.p2Cards).toEqual([])
        expect(vm.out1).toEqual(false)
        expect(vm.out2).toEqual(false)
      })

      it('should reset all data to the default informations', function(){
        const vm = newControllerInstance('multiplayerController')

        vm.reset()
        expect(vm.p1Points).toEqual(0)
        expect(vm.p2Points).toEqual(0)
        expect(vm.p1Cards).toEqual([])
        expect(vm.p2Cards).toEqual([])
        expect(vm.out1).toEqual(false)
        expect(vm.out2).toEqual(false)
      })

      it('should change all data to the received ones', function(){
        const vm = newControllerInstance('multiplayerController')
        vm.p1Points = 5
        vm.p2Points = 15
        vm.p1Cards = ['12']
        vm.p2Cards = ['8']
        vm.out1 = true
        vm.out2 = false

        expect(vm.p1Points).toEqual(5)
        expect(vm.p2Points).toEqual(15)
        expect(vm.p1Cards).toEqual(['12'])
        expect(vm.p2Cards).toEqual(['8'])
        expect(vm.out1).toEqual(true)
        expect(vm.out2).toEqual(false)
      })

      it('should check if the user out correctly', function(){
        const vm = newControllerInstance('multiplayerController')
        vm.stop('p1')

        expect(vm.out1).toEqual(true)
        expect(vm.out2).toEqual(false)
      })
    })

    function newControllerInstance (controllerName) {
        const scope = rootScope.$new()
        controller(`${controllerName}`, {
        $scope: scope,
        userAPI: _userAPI
        })

        return scope
    }
});


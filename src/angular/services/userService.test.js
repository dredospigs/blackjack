const { expect } = require('chai');

require('angular');
require('angular-mocks');
require('angular-route')
require('../app');
require('../config/valueConfig');
require('./userService');

describe('Player Service', function () {

  beforeEach(function () {
    angular.mock.module('blackjack');
  });

  var _userService;
  var configs, httpBackend, rootScope

  beforeEach(inject((userAPI, $httpBackend, config, $rootScope) => {
    _userService = userAPI
    httpBackend = $httpBackend
    rootScope = $rootScope
    configs = config
  }));

  describe('User Service', function () {
    it('should get all players', async function () {
      httpBackend.whenGET(configs.baseUrl + '/user')
      .respond(200, [{
        name: 'Elaina',
        matches: 10,
        wins: 5
      },{
        name: 'Hero',
        matches: 15,
        wins: 10
      }])

      var res = _userService.readPlayers()
      httpBackend.flush()

      res.then(function (response) {
        const result = response.data
        expect(result[0].name).toEqual('Elaina')
        expect(result[0].matches).toEqual(10)
        expect(result[0].wins).toEqual(5)
        expect(result[1].name).toEqual('Hero')
        expect(result[1].matches).toEqual(15)
        expect(result[1].wins).toEqual(10)
      })
    })

    it('should check if the post service was called', async function(){
      httpBackend.whenPOST(configs.baseUrl + '/user').respond(200)

      var res = _userService.createPlayer()
      httpBackend.flush()

      res.then(function(response) {
        const result = response.data
        expect(result.status).toEqual(200)
      })
    })
  })
});

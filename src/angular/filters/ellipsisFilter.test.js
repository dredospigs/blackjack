require('angular');
require('angular-mocks');
require('angular-route')
require('../app');
require('./ellipsisFilter');

describe('Ellipsis Filter', function () {

  beforeEach(function () {
    angular.mock.module('blackjack');
  });

  var _filter;
  var configs, httpBackend, rootScope

  beforeEach(inject(($filter) => {
    _filter = $filter
  }));

  describe('Ellipsis Filter', function () {
    it('should put ellipsis in the end of string when this string has more than two characters', function () {
      const result = _filter('ellipsis')('string', 2)
      expect(result).toEqual('st...')
    })

    it('should put ellipsis in the end of string when this string has more than ten characters', function () {
      const result = _filter('ellipsis')('averylongword', 10)
      expect(result).toEqual('averylongw...')
    })

    it('should not put ellipsis in the end of string because the string is smaller than the size limit', function () {
      const result = _filter('ellipsis')('kel', 5)
      expect(result).toEqual('kel')
    })
  })
});
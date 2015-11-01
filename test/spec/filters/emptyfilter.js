'use strict';

describe('Filter: emptyFilter', function () {

  // load the filter's module
  beforeEach(module('markovApp'));

  // initialize a new instance of the filter before each test
  var emptyFilter;
  beforeEach(inject(function ($filter) {
    emptyFilter = $filter('emptyFilter');
  }));

  it('should return the input prefixed with "emptyFilter filter:"', function () {
    var text = 'angularjs';
    expect(emptyFilter(text)).toBe('emptyFilter filter: ' + text);
  });

});

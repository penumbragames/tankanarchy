/**
 * @fileoverview This file contains unit tests for /shared/Constants.js
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Constants = require('../shared/Constants');

describe('The Constants constructor', function() {
  it('should throw an error', function() {
    expect(function() {
      var constants = new Constants();
    }).toThrow();
  });
});

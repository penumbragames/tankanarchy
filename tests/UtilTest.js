/**
 * @fileoverview This file contains unit tests for /shared/Util.js
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Util = require('../shared/Util');

describe('The Util constructor', function() {
  it('should throw an error', function() {
    expect(function() {
      var util = new Util();
    }).toThrow();
  });
});

describe('The truncate() function', function() {
  it('should truncate properly', function() {
    expect(Util.truncate(12.32)).toBe(12);
    expect(Util.truncate(45.345345)).toBe(45);
    expect(Util.truncate(-23.4)).toBe(-23);
  });
});

describe('The getSign() function', function() {
  it('should return 1', function() {
    expect(Util.getSign(45)).toBe(1);
  });
  it('should return 0', function() {
    expect(Util.getSign(0)).toBe(0);
  });
  it('should return -1', function() {
    expect(Util.getSign(-234)).toBe(-1);
  });
});

describe('The getManhattanDistance() function', function() {
  it('should calculate the correct distance', function() {
    expect(Util.getManhattanDistance(0, 0, 3, 4)).toBe(7);
    expect(Util.getManhattanDistance(5, -3, 4, 10)).toBe(14);
  });
});

describe('The getEuclideanDistance2() function', function() {
  it('should calculate the correct distance', function() {
    expect(Util.getEuclideanDistance2(0, 0, 3, 4)).toBe(25);
    expect(Util.getEuclideanDistance2(2, -2, 6, -8)).toBe(52);
  });
});

describe('The getEuclideanDistance() function', function() {
  it('should calculate the correct distance', function() {
    expect(Util.getEuclideanDistance(0, 0, 3, 4)).toBe(5);
    expect(Util.getEuclideanDistance(2, -5, 8, -2)).toBeCloseTo(6.708, 0.001);
  });
});

describe('The inBound() function', function() {
  it('should bound correctly', function() {
    expect(Util.inBound(5, -1, 10)).toBe(true);
    expect(Util.inBound(-4, 6, 9)).toBe(false);
    expect(Util.inBound(2.3, 1.7, 6.3243)).toBe(true);
  });
  it('should work with flipped bound parameters', function() {
    expect(Util.inBound(4, 10, 2)).toBe(true);
    expect(Util.inBound(-5, 20, -10)).toBe(true);
    expect(Util.inBound(2, -20, -4)).toBe(false);
  });
  it('should work at the edge cases', function() {
    expect(Util.inBound(5, 5, 5)).toBe(true);
    expect(Util.inBound(4, 4, 6)).toBe(true);
    expect(Util.inBound(6, 3, 6)).toBe(true);
    expect(Util.inBound(3.1, 3, 3)).toBe(false);
  });
});

describe('The bound() function', function() {
  it('should bound correctly', function() {
    expect(Util.bound(5, 0, 40)).toBe(5);
    expect(Util.bound(41, 0, 40)).toBe(40);
    expect(Util.bound(-4, 5, 20)).toBe(5);
    expect(Util.bound(-1.56, 4.6, 20.4)).toBe(4.6);
  });
  it('should work with flipped bound parameters', function() {
    expect(Util.bound(5, 40, 0)).toBe(5);
    expect(Util.bound(41, 40, 0)).toBe(40);
    expect(Util.bound(-4, 25, 0)).toBe(0);
    expect(Util.bound(-1.56, 44.6, 20.4)).toBe(20.4);
  });
});

describe('The randRange() function', function() {
  it('should be defined', function() {
    expect(Util.randRange()).toBeDefined();
  });
});

describe('The randRangeInt() function', function() {
  it('should be defined', function() {
    expect(Util.randRange()).toBeDefined();
  });
});

describe('The choiceArray() function', function() {
  it('should select a random element from an array', function() {
    var array = [1, 2, 6, "asdf", "your mom", 34, 69, 420];
    expect(array).toContain(Util.choiceArray(array));
  });
});

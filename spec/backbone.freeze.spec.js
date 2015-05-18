'use strict';

var Backbone = require('backbone');
var Freeze = require('../src/backbone.freeze');

describe('Freeze', function () {
  it('should attach itself to the Backbone global', function () {
    expect(Backbone.Freeze).to.equal(Freeze);
  });
});

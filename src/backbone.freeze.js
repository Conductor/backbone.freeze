"use strict";

var FreezeCollection = require('./backbone.freeze.collection');
var FreezeModel = require('./backbone.freeze.model');
var Backbone = require('backbone');
var originalFreeze = Backbone.Freeze;

var Freeze = {
    Collection: FreezeCollection,
    Model: FreezeModel,

    noConflict: function () { 
        Backbone.Freeze = originalFreeze;
        return Freeze;
    }
};

Backbone.Freeze = Freeze;
module.exports = Freeze;

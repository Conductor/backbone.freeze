"use strict";

var Backbone = require('backbone');
var _ = require('underscore');
var FreezeModel = require('./backbone.freeze.model');

var errorFunction = function(action) {
    throw new Error('Attempting to ' + action + ' a collection that is immutable. ' +
    'Please clone this for a mutable version.');
};

/** METHODS THAT NEED TO BE INSERTED AFTER CONSTRUCTION */

/**
 * Methods that just throw an error. They all throw an error because the action is not
 * allowed on an immutable collection. These methods are inserted after construction because
 * they're used during the construction of the collection.
 */
var postConstructErroringMethods = {
    set:                'set elements in',
    add:                'add items to',
    remove:             'remove items from',
    trigger:            'trigger events on',
    reset:              'reset',
    _reset:             'reset',
    _prepareModel:      'prepare the model of',
    _addReference:      'add a reference to',
    _removeReference:   'remove a reference to',
    _onModelEvent:      'listen to a model event'
};

/**
 * Returns a sorted copy of the collection in mutable form.
 *
 * @param options
 */
var sortFunction = function(options) {
    var clone = this.clone();
    // If the user set a comparator on this collection, make sure it's used for the sort.
    clone.comparator = this.comparator;
    return clone.sort(options);
};

/** END POST CONSTRUCT METHODS */

/** METHODS THAT JUST THROW AN ERROR */

/**
 * Methods that just throw an error. There all throw an error because the action is not
 * allowed on an immutable collection.
 */
var erroringMethods = {
    sync:           'call sync on',
    push:           'push items to',
    pop:            'pop items from',
    unshift:        'unshift items to',
    shift:          'shift items from',
    fetch:          'fetch',
    create:         'create items in',
    on:             'listen to',
    once:           'listen to',
    off:            'listen to',
    stopListening:  'listen to'
};

/** END ERROR METHODS */

var FreezeCollection = Backbone.Collection.extend({

    /**
     * Use an immutable model, otherwise people can mess with the model itself.
     */
    model: FreezeModel,

    /**
     * Constructor for the immutable collection.
     *
     * Uses all the default backbone collection constructor mechanisms, and then
     * replaces all the methods it uses with the immutable versions.
     *
     * @param models
     * @param options
     */
    constructor: function (models, options) {
        // Call the normal backbone collection constructor
        Backbone.Collection.prototype.constructor.call(this, models, options);

        // Set the functions that the constructor needs to work to no longer work if they would
        // be modifying the collection, after the constructor is done using it
        _.each(postConstructErroringMethods, function(message, methodName) {
            this[methodName] = function() {
                errorFunction(message);
            }
        }, this);
        this.sort = sortFunction;
    },

    /**
     * Returns a mutable collection that is a copy of this immutable one.
     *
     * @returns {Backbone.Collection}
     */
    clone: function() {
        return new Backbone.Collection(this.models);
    }

    /* Methods to leave alone, because they don't affect the contents of the collection:
     initialize,
     toJSON,
     slice,
     get,
     at,
     where,
     findWhere,
     pluck,
     parse
     */

});

_.each(erroringMethods, function(message, methodName) {
    FreezeCollection.prototype[methodName] = function() {
        errorFunction(message);
    }
});

module.exports = FreezeCollection;

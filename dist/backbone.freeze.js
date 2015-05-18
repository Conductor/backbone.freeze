(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["backbone", "underscore"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("backbone"), require("underscore")) : factory(root["Backbone"], root["_"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var FreezeCollection = __webpack_require__(2);
	var FreezeModel = __webpack_require__(3);
	var Backbone = __webpack_require__(1);
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Backbone = __webpack_require__(1);
	var _ = __webpack_require__(4);
	var FreezeModel = __webpack_require__(3);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Backbone = __webpack_require__(1);
	var _ = __webpack_require__(4);

	var errorFunction = function(action) {
	    throw new Error('Attempting to ' + action + ' a model that is immutable. ' +
	    'Please clone this for a mutable version.');
	};

	/** METHODS THAT NEED TO BE INSERTED AFTER CONSTRUCTION */

	/**
	 * Methods that just throw an error. They all throw an error because the action is not
	 * allowed on an immutable model. These methods are inserted after construction because
	 * they're used during the construction of the model.
	 */
	var postConstructErroringMethods = {
	    set:        'set attributes on',
	    trigger:    'trigger events on'
	};

	/** END POST CONSTRUCT METHODS */

	/** METHODS THAT JUST THROW AN ERROR */

	/**
	 * Methods that just throw an error. There all throw an error because the action is not
	 * allowed on an immutable model.
	 */
	var erroringMethods = {
	    sync:               'call sync on',
	    unset:              'unset properties on',
	    clear:              'clear',
	    hasChanged:         'view change events on',
	    changedAttributes:  'view changed attributes of',
	    previous:           'view previous values of',
	    previousAttributes: 'view previous values of',
	    fetch:              'fetch',
	    save:               'save',
	    destroy:            'destroy',
	    url:                'get the server url of',
	    isNew:              'isNew',
	    isValid:            'isValid',
	    once:               'listen to',
	    stopListening:      'listen to'
	};

	var FreezeModel = Backbone.Model.extend({

	    /**
	     * Constructor for the immutable model.
	     *
	     * Uses all the default backbone model constructor mechanisms, and then
	     * replaces all the methods it uses with the immutable versions.
	     *
	     * @param attributes
	     * @param options
	     */
	    constructor: function (attributes, options) {
	        // Call the normal backbone collection constructor
	        Backbone.Model.prototype.constructor.call(this, attributes, options);

	        // Set the functions that the constructor needs to work to no longer work if they would 
	        // be modifying the model, after the constructor is done using it
	        _.each(postConstructErroringMethods, function(message, methodName) {
	            this[methodName] = function() {
	                errorFunction(message);
	            }
	        }, this);
	    },

	    /**
	     * Returns a mutable model that is a copy of this immutable one.
	     *
	     * @returns {Backbone.Model}
	     */
	    clone: function() {
	        return new Backbone.Model(this.attributes);
	    },

	    /**
	     * On is a no op because the construction of a collection uses on after
	     * construction of the model. 
	     */
	    on: function() {},


	    /**
	     * Off is a no op because the construction of a collection uses off after
	     * construction of the model. 
	     */
	    off: function() {}


	    /* Methods to leave alone, because they don't affect the contents of the model:
	     initialize,
	     toJSON,
	     get,
	     escape,
	     parse,
	     _validate
	     */

	});

	_.each(erroringMethods, function(message, methodName) {
	    FreezeModel.prototype[methodName] = function() {
	        errorFunction(message);
	    }
	});

	module.exports = FreezeModel;




/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }
/******/ ])
});

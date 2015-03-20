'use strict';

var Backbone = require('backbone');
var Collection = require('../src/backbone.freeze.collection');
var Model = require('../src/backbone.freeze.model');
var _ = require('underscore');

describe('Freeze Collection', function() {
    var collection = new Collection([
        { id: 1, name: "a", value: "apple" },
        { id: 2, name: "c", value: "carnival" },
        { id: 3, name: "b", value: "banana" }
    ]);
    
    describe('erroring methods', function() {
        var methods = [
            { name: 'sync',              error: 'call sync on'},
            { name: 'push',              error: 'push items to'},
            { name: 'pop',               error: 'pop items from'},
            { name: 'unshift',           error: 'unshift items to'},
            { name: 'shift',             error: 'shift items from'},
            { name: 'fetch',             error: 'fetch'},
            { name: 'create',            error: 'create items in'},
            { name: 'on',                error: 'listen to'},
            { name: 'once',              error: 'listen to'},
            { name: 'off',               error: 'listen to'},
            { name: 'stopListening',     error: 'listen to'},
            { name: 'set',               error: 'set elements in'},
            { name: 'add',               error: 'add items to'},
            { name: 'remove',            error: 'remove items from'},
            { name: 'trigger',           error: 'trigger events on'},
            { name: 'reset',             error: 'reset'},
            { name: '_reset',            error: 'reset'},
            { name: '_prepareModel',     error: 'prepare the model of'},
            { name: '_addReference',     error: 'add a reference to'},
            { name: '_removeReference',  error: 'remove a reference to'},
            { name: '_onModelEvent',     error: 'listen to a model event'}
        ];
        
        var error = function(action) {
            return 'Attempting to ' + action + ' a collection that is immutable. ' +
                'Please clone this for a mutable version.';
        };
        
        _.each(methods, function(method) {
            it(method.name + ' throws an error', function() {
                expect(collection[method.name]).to.throw(Error, new RegExp(error(method.error)));
            })
        })
    });
    
    describe('changed methods', function() {
        
        it('responds to clone correctly', function() {
            var clone = collection.clone();
            expect(clone).to.be.an.instanceof(Backbone.Collection);
            expect(clone.toJSON()).to.deep.equal([
                { id: 1, name: "a", value: "apple" },
                { id: 2, name: "c", value: "carnival" },
                { id: 3, name: "b", value: "banana" }
            ]);
        });
        
        it('responds to sort correctly', function() {
            collection.comparator = 'name';
            var sorted = collection.sort();
            expect(sorted).to.be.an.instanceof(Backbone.Collection);
            expect(sorted.toJSON()).to.deep.equal([
                { id: 1, name: "a", value: "apple" },
                { id: 3, name: "b", value: "banana" },
                { id: 2, name: "c", value: "carnival" }
            ]);
        });
        
    });
    
    describe('left alone methods', function() {
        
        it('can toJSON', function() {
            expect(collection.toJSON()).to.deep.equal([
                { id: 1, name: "a", value: "apple" },
                { id: 2, name: "c", value: "carnival" },
                { id: 3, name: "b", value: "banana" }
            ]);
        });

        it('can slice', function() {
            var arr = collection.slice(0,1);
            expect(arr).to.be.instanceof(Array);
            expect(arr.length).to.equal(1);
            expect(arr[0]).to.be.instanceof(Model);
            expect(arr[0].toJSON()).to.deep.equal({ id: 1, name: "a", value: "apple"});
        });

        it('can get', function() {
            var model = collection.get(1);
            expect(model).to.be.instanceof(Model);
            expect(model.toJSON()).to.deep.equal({ id: 1, name: "a", value: "apple"});
        });

        it('can at', function() {
            var model = collection.at(0);
            expect(model).to.be.instanceof(Model);
            expect(model.toJSON()).to.deep.equal({ id: 1, name: "a", value: "apple"});
        });

        it('can where', function() {
            collection = new Collection([
                { id: 1, name: "a", value: "apple", type: "fruit" },
                { id: 3, name: "b", value: "banana", type: "fruit"  },
                { id: 2, name: "c", value: "carnival", type: "event"  }
            ]);
            var arr = collection.where({type: "fruit"});
            expect(arr).to.be.instanceof(Array);
            expect(arr.length).to.equal(2);
            expect(arr[0]).to.be.instanceof(Model);
            expect(arr[1]).to.be.instanceof(Model);
            expect(arr[0].toJSON()).to.deep.equal({ id: 1, name: "a", value: "apple", type: "fruit" });
            expect(arr[1].toJSON()).to.deep.equal({ id: 3, name: "b", value: "banana", type: "fruit" });
        });

        it('can findWhere', function() {
            collection = new Collection([
                { id: 1, name: "a", value: "apple", type: "fruit" },
                { id: 3, name: "b", value: "banana", type: "fruit"  },
                { id: 2, name: "c", value: "carnival", type: "event"  }
            ]);
            var arr = collection.findWhere({type: "fruit"});
            expect(arr).to.be.instanceof(Model);
            expect(arr.toJSON()).to.deep.equal({ id: 1, name: "a", value: "apple", type: "fruit" });
        });

        it('can pluck', function() {
            var arr = collection.pluck('name');
            expect(arr).to.be.instanceof(Array);
            expect(arr.length).to.equal(3);
            expect(arr).to.deep.equal(['a', 'b', 'c']);
        });
    });
    
});

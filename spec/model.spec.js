'use strict';

var Backbone = require('backbone');
var Model = require('../src/backbone.freeze.model');
var _ = require('underscore');

describe('Freeze Model', function() {
    var model = new Model({
        value: "attribute"
    });
    
    describe('erroring methods', function() {
        var methods = [
            { name: 'sync',               error: 'call sync on'},
            { name: 'unset',              error: 'unset properties on'},
            { name: 'clear',              error: 'clear'},
            { name: 'hasChanged',         error: 'view change events on'},
            { name: 'changedAttributes',  error: 'view changed attributes of'},
            { name: 'previous',           error: 'view previous values of'},
            { name: 'previousAttributes', error: 'view previous values of'},
            { name: 'fetch',              error: 'fetch'},
            { name: 'save',               error: 'save'},
            { name: 'destroy',            error: 'destroy'},
            { name: 'url',                error: 'get the server url of'},
            { name: 'isNew',              error: 'isNew'},
            { name: 'isValid',            error: 'isValid'},
            { name: 'once',               error: 'listen to'},
            { name: 'stopListening',      error: 'listen to'},
            { name: 'set',                error: 'set attributes on'},
            { name: 'trigger',            error: 'trigger events on'}
        ];
        
        var error = function(action) {
            return 'Attempting to ' + action + ' a model that is immutable. ' +
                'Please clone this for a mutable version.';
        };
        
        _.each(methods, function(method) {
            it(method.name + ' throws an error', function() {
                expect(model[method.name]).to.throw(Error, new RegExp(error(method.error)));
            })
        })
    });
    
    describe('changed methods', function() {
        
        it('responds to clone correctly', function() {
            var clone = model.clone();
            expect(clone).to.be.an.instanceof(Backbone.Model);
            expect(clone.get('value')).to.equal("attribute");
        });

        it("doesn't do anything when on is called", function() {
            model.on('event', function() { called = true; });
            expect(model._events).to.be.undefined;
        });
        
        it("doesn't do anything when off is called", function() {
            model.off('event', function() { called = true; });
            expect(model._events).to.be.undefined;
        });
        
    });
    
    describe('left alone methods', function() {
        
        it('can get', function() {
            expect(model.get('value')).to.equal("attribute");
        });
        
        it('can toJSON', function() {
            expect(model.toJSON()).to.deep.equal({
                value: "attribute"
            });
        })
    });
    
});

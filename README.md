[![Build Status](https://travis-ci.org/Conductor/backbone.freeze.svg)](https://travis-ci.org/Conductor/backbone.freeze)

# backbone.freeze
Immutable Collections and Models for Backbone.js. Freeze is designed to hold collections/models that will never change during the lifespan of your JS. 

Freeze follows the principle of Fail Loudly; when you attempt to modify a collection or model it will throw an error.

#Installing

Freeze is available on npm bower as "backbone.freeze"
```
bower install backbone.freeze

OR

npm install backbone.freeze
```

#Examples
Freeze.Collection:
```js
// List of usable countries should never change
var usableCountries = [
    { id: 1, name: "United States" },
    { id: 2, name: "Canada" },
    { id: 3, name: "England" }
];
var usableCountriesImmutable = new Backbone.Freeze.Collection(usableCountries);

usableCountriesImmutable.add({ id: 4, name: "Mexico"}); // This will throw an error!
```

Freeze.Model:
```js
// The description of a rectangle should never change after construction, or that would make area incorrect 
// TODO - make area calculate on change
var rectangle = new Backbone.Freeze.Model({
    color: "red",
    width: 7,
    height: 5,
    area: 35
});

rectangle.set('height', 10); // This will throw an error!
```

#Requirements
* Backbone 1.0.0 - 1.1.2
* Underscore 1.4.4 - 1.7.0

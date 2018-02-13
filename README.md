# State.js

[![Build Status](https://travis-ci.org/mohitvirli/state.js.svg?branch=master)](https://travis-ci.org/mohitvirli/state.js) [![Coverage Status](https://coveralls.io/repos/github/mohitvirli/state.js/badge.svg?branch=master)](https://coveralls.io/github/mohitvirli/state.js?branch=master)

# Get Started
A user can access the library the following ways:
 - ES2015 module. i.e. `import State from 'State'`.
 - CommonJS module. i.e. `require('State')`.
 - Global variable `State` when included through script tag. `<script src='state.min.js'></script>`

# Methods
State.js has the following API methods
### Create
This method returns a new object as a state instance which can be used to observe property change.
```
let myState = State.create({
    range: {
        start: 1,
        end: 5
    },
    visible: true
});
```

Create can also be used to append property in the existing state (mutates the original state). The is called using two parameters. The first parameter is where to append the state and the second being what property to append.

```
myState.create('range.type', {
    absolute: true
});
```

So the state becomes
```
{
    range: {
        start: 1,
        end: 5,
        type: {
            absolute: true
        }
    },
    visible: true
}
```

## getState
This method returs the observable state as normal JavaScript object.

```
myState.getState();
```
Returns the object
```
{
    range: {
        start: 1,
        end: 5,
        type: {
            absolute: true
        }
    },
    visible: true
}
```

## prop
This acts as getter and setter. If the function is called by passing only one argument, it retrieve the value associated with the property.
```
myState.prop('range.type');
```
Gives the result
```
{
    absolute: true
}
```

You can also set the property passing a second arguement.

```
myState.prop('visible`, true)
```

## on
This function takes a single property and handler which is called when any of the properties are changed. When a single property is changed the handler is called with two parameter, what was the old value of the state property and what is the new value.

```
const onChange = (oldValue, newValue) => {
    console.log('Value before prop change', oldValue);
    console.log('Value after prop change', newValue);
}
myState.on('range.start', onChange);
```

The function `onChange` is called everytime `range.start` is changed.

`on` also returns a function which is when called the listener registered gets unregistered.

```
let unsubscribe = myState.on('range.start', onChange);
unsubsribe(); // unsubscribes the function on Change

```

## lock and unlock
This helps control the call of handler when a property is changed. If the state is locked, the following state changes occur all at once and the listener if assigned is called only once after the state has been unlocked;

```
myState
    .lock()
    .prop('range.start', 13)
    .prop('range.end', 14)
    .unlock();

// Handler(onChange) gets called once.
```

Once lock() is called the state caches all the change that comes after this. When unlock() is called it applies all the changes to the state and the handler is called.
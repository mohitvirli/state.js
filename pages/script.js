
const myState = State.create({a: {a: 2}});

// const b = State.create({b: {b: 1}});

myState.create('c', {b: 1});
// b.create('b.b', 4);
console.log(myState.prop('d', 1));
console.log(myState.getState());
// console.log(b.getState());
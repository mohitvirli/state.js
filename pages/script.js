let myState = State.create({
	range: {
		start: 1,
		end: 5
	},
	visible: true
});

myState.create('range.type',    {
	absolute: true
});

myState.create({ focus: null });;
//
myState.on('range', (oldValue, newValue) => {
	console.log('Value before prop change', oldValue);
	console.log('Value after prop change', newValue);
});

myState.prop('range.end', 11);

console.log(myState.getState());

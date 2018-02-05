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

myState.create({ focus: null });


//
const unsubscribe = myState.on('range', (oldValue, newValue) => {
	console.log('Value before prop change', oldValue);
	console.log('Value after prop change', newValue);
});

myState
	.lock()
	.prop('range.type.absolute', 3)
	.prop('range.end', 3)
	.unlock();

console.log(myState.prop('range.type.absolute'));

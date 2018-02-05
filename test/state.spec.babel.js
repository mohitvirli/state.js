import { expect } from 'chai';
import State from '../target/state';

const stateObj = {
	range: {
		start: 1,
		end: 5
	},
	visible: true
};

const myState = State.create(stateObj);

describe('State Module', () => {

	it('should be able to create a state', () => {
		expect(State).to.respondsTo('create');
	});

	it('should be able to get the current state', () => {
		expect(myState.getState()).to.deep.equal(stateObj);
	});

	it('should be able to append to the state using create with value given', () => {
		myState.create('range.type', {
			absolute: true
		});

		expect(myState.prop('range')).to.have.property('type').that.is.deep.equal({
			absolute: true
		});
	});

	it('should be able to append to the state using create without value given', () => {
		myState.create({ focus: null });

		expect(myState.getState()).to.have.property('focus', null);
	});

	it('should get the property value using prop', () => {

		expect(myState).to.respondsTo('prop');
		expect(myState.prop('range.type')).to.deep.equal({
			absolute: true
		});
	});

	it('should set the property value using prop', () => {
		myState.prop('visible', true);
		expect(myState.getState()).to.have.property('visible', true);
	});

	it('should be able to attach a listener to a property', () => {

		myState.prop('range.start', 6);

		const unsubscibe = myState.on('range.start', (oldValue, newValue) => {
			expect(oldValue).to.equal(6);
			expect(newValue).to.equal(9);
		});

		myState.prop('range.start', 9);

		expect(myState).to.respondsTo('on');

		unsubscibe();
	});

	it('listener should work with nested properties', () => {

		myState.prop('range.end', 10);

		const unsubscribeRangeStart = myState.on('range.end', (oldValue, newValue) => {
			expect(oldValue).to.equal(10);
			expect(newValue).to.equal(9);
		});

		const unsubscribeRange = myState.on('range', (oldValue, newValue) => {
			expect(oldValue.end).to.equal(10);
			expect(newValue.end).to.equal(9);
		});

		myState.prop('range.end', 9);

		unsubscribeRangeStart();
		unsubscribeRange();
	});

	it('should return unsubscribe when onchange listener is attached', () => {

		let ctr = 0;

		myState.prop('range.start', 10);

		const unsubscribeRangeStart = myState.on('range.start', (oldValue, newValue) => {
			ctr++;
		});

		myState.prop('range.start', 9);
		unsubscribeRangeStart();
		myState.prop('range.start', 11);

		expect(ctr).to.equal(1);
	});

	it('should be lock and unlock the state', () => {

		const unsubscribeRange = myState.on('range', (oldValue, newValue) => {

			expect(oldValue).to.deep.equal({
				start: 11,
				end: 9,
				type: {
					absolute: true
				}
			});

			expect(newValue).to.deep.equal({
				start: 13,
				end: 9,
				type: {
					absolute: false
				}
			});

		});

		myState
			.lock()
			.prop('range.start', 13)
			.prop('range.type', {
				absolute: false
			})
			.unlock();

	});



});
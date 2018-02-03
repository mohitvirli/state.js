class StateClass {
	constructor(initialState = {}) {
		let _state = initialState;

		this.getState = () => _state;

		this.create = (initial, append) => {
			if (typeof append === 'undefined') {
				if (Object.keys(_state).length === 0) return new StateClass(initial);
				else {
					Object.assign(_state, initial);
				}
			} else _state = this.appendObject(initial, append, _state);
		};

		this.prop = (keys, value) => {
			if (typeof value === 'undefined') {
				let temp = _state;
				keys.split('.')
					.filter(key => key)
					.forEach(key => {
						if (typeof temp[key] === 'undefined') throw Error("Key doesn't exist");
						temp = temp[key];
					});
				return temp;
			} else {
				_state = this.appendObject(keys, value, _state);
			}
		}
	}

	appendObject(keys, append, state) {
		let temp = state;
		keys = keys.split('.');

		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i];
			if (typeof temp[key] === 'undefined') temp[key] = {};
			temp = temp[key];
		}

		temp[keys[keys.length - 1]] = append;

		return state;
	}
}

const State = new StateClass();
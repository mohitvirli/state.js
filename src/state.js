class StateClass {
	constructor(initialState = {}) {
		const _state = initialState;

		this.getState = () => _state;

		this.create = (initial, append) => {
			if (typeof append === 'undefined') {
				if (Object.keys(_state).length === 0) return new StateClass(initial);
				else {
					Object.assign(_state, initial);
				}
			} else appendObject(initial, append);
		};

		const appendObject = (keys, append) => {
			let temp = _state;
			keys = keys.split('.');

			for (let i = 0; i < keys.length - 1; i++) {
				const key = keys[i];
				if (!temp[key]) temp[key] = {};
				temp = temp[key];
			}

			temp[keys[keys.length - 1]] = append;
		};
	}
}

const State = new StateClass();
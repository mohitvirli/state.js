class StateClass {
	constructor(initialState = {}) {
		let _state = initialState;

		this.getState = () => this.truncateObject(_state);

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
		};


		this.on = (keys, callback) => {

			let temp = _state;
			const keysArray = keys.split('.');

			for (let i = 0; i < keysArray.length - 1; i++) {
				temp = temp[keysArray[i]];
			}

			Object.defineProperty(temp, `_${keysArray[keysArray.length - 1]}`, {
				set: (val) => {
					callback(temp[keysArray[keysArray.length - 1]], val);
					temp[keysArray[keysArray.length - 1]] = val;
				},
				get: () => {
					return temp[keysArray[keysArray.length - 1]];
				},
				enumerable: true,
				configurable: true,
			});

			return () => {
				Object.defineProperty(temp, `_${keysArray[keysArray.length - 1]}`, {
					set: undefined,
					get: undefined,
					enumerable: false
				});
			};
		}
	}

	appendObject(keys, append, state) {
		let temp = state;
		keys = keys.split('.');

		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i];
			if (Object.keys(temp).indexOf(`_${key}`) !== -1) {
				let parentCopy = this.copyObject(this.truncateObject(temp[key])); // TODO: make nested check
				for (let j = i + 1; j < keys.length - 1; j++) {
					parentCopy = parentCopy[keys[j]];
				}
				parentCopy[keys[keys.length - 1]] = append;
				temp[`_${key}`] = parentCopy;
			}
			temp = temp[key];
		}

		if (Object.keys(temp).indexOf(`_${keys[keys.length - 1]}`) !== -1) {
			temp[`_${keys[keys.length - 1]}`] = append;
		} else {
			temp[keys[keys.length - 1]] = append;
		}

		return state;
	}

	truncateObject(state) {
		const visibleObject = this.copyObject(state);
		const setObject = (obj) => {
			Object.keys(obj).forEach(key => {
				if(key.charAt(0) === '_') delete obj[key];
				if (typeof obj[key] === 'object' && obj[key] !== null) {
					setObject(obj[key]);
				}
			});
		};
		setObject(visibleObject);
		return visibleObject;
	}

	copyObject(obj){
		return JSON.parse(JSON.stringify(obj));
	}
}

const State = new StateClass();
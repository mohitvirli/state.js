/**
 * State.js v1.0
 */

class State {

  /**
   * Constructor initialises the state with the
   * given argument (Object)
   * @param initialState (Object)
   */
	constructor(initialState = {}) {

    /**
     * @type {{}}
     * @private property _state
     */
		let _state = initialState;

    /**
     * For locking unlocking state.
     */
		let callbackArray = [];
		let _lock = false;

    /**
     * Returns the current State.
     */
		this.getState = () => this.truncateObject(_state);

    /**
     *
     * @param initial (Object), initial State.
     * @param append (Any), the object or value to be appended
     * @returns {State}
     */
		this.create = (initial, append) => {
			if (typeof append === 'undefined') {
				if (Object.keys(_state).length === 0) return new State(initial);
				else {
					Object.assign(_state, initial);
				}
			} else _state = this.appendObject(initial, append, _state);
		};

    /**
     *
     * @param keys (String), keys with dotted notation
     * @param value (Any)
     * @returns Object or Value of the key if second argument is not provided
     */
		this.prop = (keys, value) => {
			if (typeof value === 'undefined') {
				let temp = _state;
				keys.split('.')
					.filter(key => key)
					.forEach(key => {
						if (typeof temp[key] === 'undefined') throw Error("Key doesn't exist");
						temp = temp[key];
					});
				return typeof temp === 'object' ? this.truncateObject(temp) : temp;
			} else {
				_state = this.appendObject(keys, value, _state);
			}

			if (_lock) return this;
		};

    /**
     * Internal function to handle 'on' and 'lock' feature
     * @param keys (String), keys with dotted notation
     * @param callback, listener to be attached on changing the given key
     * @param type, internal functionality for 'on' and 'lock' feature
     * @returns unsubscribe function to detach the listener.
     */
		const onChange = (keys, callback, type) => {
			let temp = _state;
			const keysArray = keys.split('.');

			for (let i = 0; i < keysArray.length - 1; i++) {
				temp = temp[keysArray[i]];
			}

			Object.defineProperty(temp, `_${keysArray[keysArray.length - 1]}`, {
				set: (val) => {
					if (type === 'on' && !_lock) {
						callback(temp[keysArray[keysArray.length - 1]], val);
					} else {

            // For .next() functionality

						// call.value = !call.first ? temp[keysArray[keysArray.length - 1]] : call.value;
						// call.first = true;
						//
						// setTimeout(() => {
						// 	if (!call.last) {
						// 		callback(call.value, temp[keysArray[keysArray.length - 1]]);
						// 		call.last = true;
						// 	}
						// }, 0);  // TODO: devise some other method

						if(_lock){
							callbackArray.push({
								callback,
								args: [temp[keysArray[keysArray.length - 1]], val]
							});
						}
					}


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
		};


    /**
     * To attach the listener to a property
     * @param keys (String), keys with dotted notation
     * @param callback, listener to be attached on changing the given key
     * @returns unsubscribe function
     */
		this.on = (keys, callback) => {
			return onChange(keys, callback, 'on');
		};

    /**
     * To be implemented yet.
     * @param keys
     * @param callback
     * @returns {unsubscribe}
     */
		this.next = (keys, callback) => {
			return onChange(keys, callback, 'next');
		};

    /**
     * 'lock' to lock the State till unlock is called
     * @returns State to chain the functions
     */
		this.lock = () => {
			_lock = true;
			return this;
		};

    /**
     * 'unlock' to unlock the State and call the onChange listener
     */
		this.unlock = () => {
			_lock = false;
			let initialArgs = callbackArray[0].args[0],
				finalArgs = callbackArray.pop().args[1];

			initialArgs = typeof initialArgs === 'object' ? this.truncateObject(initialArgs) : initialArgs;
			finalArgs = typeof finalArgs === 'object' ? this.truncateObject(finalArgs) : finalArgs;

			callbackArray[0].callback(initialArgs, finalArgs);
			callbackArray = [];
		}
	}

  /**
   * Utility function to append the given argument
   * @param keys (String), keys with dotted notation
   * @param append, the value to appended
   * @param state, the internal State
   * @returns Modified state
   */
	appendObject(keys, append, state) {
		let temp = state;
		keys = keys.split('.');

		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i];
			if (Object.keys(temp).indexOf(`_${key}`) !== -1) {
				const parentCopy = this.copyObject(temp[key]);
				let tempParent = parentCopy;
				for (let j = i + 1; j < keys.length - 1; j++) {
					tempParent = tempParent[keys[j]];
				}
				tempParent[keys[keys.length - 1]] = append;
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

  /**
   * To strip the object of the getter setter functions.
   * Needed for getState.
   * @param obj (Object)
   */
	truncateObject(obj) {
		const visibleObject = this.copyObject(obj);
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

  /**
   * Deep cloning the object with getters and setters
   * @param obj, object to be cloned
   * @returns {*} Cloned object
   */
	copyObject(obj){
		if (obj === null || typeof(obj) !== 'object') return obj;

		const clone = Object.create(Object.getPrototypeOf(obj));

		const props = Object.getOwnPropertyNames(obj);
		props.forEach((key) => {
			const desc = Object.getOwnPropertyDescriptor(obj, key);
			if (typeof desc.value === "object") desc.value = this.copyObject(desc.value);
			Object.defineProperty(clone, key, desc);
		});

		return clone;
	}
}

export default new State();
/**
 * State.js v1.0
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var State = (function () {

	/**
  * Constructor initialises the state with the
  * given argument (Object)
  * @param initialState (Object)
  */

	function State() {
		var _this = this;

		var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, State);

		/**
   * @type {{}}
   * @private property _state
   */
		var _state = initialState;

		/**
   * For locking unlocking state.
   */
		var callbackArray = [];
		var _lock = false;

		/**
   * Returns the current State.
   */
		this.getState = function () {
			return _this.truncateObject(_state);
		};

		/**
   *
   * @param initial (Object), initial State.
   * @param append (Any), the object or value to be appended
   * @returns {State}
   */
		this.create = function (initial, append) {
			if (typeof append === 'undefined') {
				if (Object.keys(_state).length === 0) return new State(initial);else {
					Object.assign(_state, initial);
				}
			} else _state = _this.appendObject(initial, append, _state);
		};

		/**
   *
   * @param keys (String), keys with dotted notation
   * @param value (Any)
   * @returns Object or Value of the key if second argument is not provided
   */
		this.prop = function (keys, value) {
			if (typeof value === 'undefined') {
				var _ret = (function () {
					var temp = _state;
					keys.split('.').filter(function (key) {
						return key;
					}).forEach(function (key) {
						if (typeof temp[key] === 'undefined') throw Error("Key doesn't exist");
						temp = temp[key];
					});
					return {
						v: typeof temp === 'object' ? _this.truncateObject(temp) : temp
					};
				})();

				if (typeof _ret === 'object') return _ret.v;
			} else {
				_state = _this.appendObject(keys, value, _state);
			}

			if (_lock) return _this;
		};

		/**
   * Internal function to handle 'on' and 'lock' feature
   * @param keys (String), keys with dotted notation
   * @param callback, listener to be attached on changing the given key
   * @param type, internal functionality for 'on' and 'lock' feature
   * @returns unsubscribe function to detach the listener.
   */
		var onChange = function onChange(keys, callback, type) {
			var temp = _state;
			var keysArray = keys.split('.');

			for (var i = 0; i < keysArray.length - 1; i++) {
				temp = temp[keysArray[i]];
			}

			Object.defineProperty(temp, '_' + keysArray[keysArray.length - 1], {
				set: function set(val) {
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

						if (_lock) {
							callbackArray.push({
								callback: callback,
								args: [temp[keysArray[keysArray.length - 1]], val]
							});
						}
					}

					temp[keysArray[keysArray.length - 1]] = val;
				},
				get: function get() {
					return temp[keysArray[keysArray.length - 1]];
				},
				enumerable: true,
				configurable: true
			});

			return function () {
				Object.defineProperty(temp, '_' + keysArray[keysArray.length - 1], {
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
		this.on = function (keys, callback) {
			return onChange(keys, callback, 'on');
		};

		/**
   * To be implemented yet.
   * @param keys
   * @param callback
   * @returns {unsubscribe}
   */
		this.next = function (keys, callback) {
			return onChange(keys, callback, 'next');
		};

		/**
   * 'lock' to lock the State till unlock is called
   * @returns State to chain the functions
   */
		this.lock = function () {
			_lock = true;
			return _this;
		};

		/**
   * 'unlock' to unlock the State and call the onChange listener
   */
		this.unlock = function () {
			_lock = false;
			var initialArgs = callbackArray[0].args[0],
			    finalArgs = callbackArray.pop().args[1];

			initialArgs = typeof initialArgs === 'object' ? _this.truncateObject(initialArgs) : initialArgs;
			finalArgs = typeof finalArgs === 'object' ? _this.truncateObject(finalArgs) : finalArgs;

			callbackArray[0].callback(initialArgs, finalArgs);
			callbackArray = [];
		};
	}

	/**
  * Utility function to append the given argument
  * @param keys (String), keys with dotted notation
  * @param append, the value to appended
  * @param state, the internal State
  * @returns Modified state
  */

	_createClass(State, [{
		key: 'appendObject',
		value: function appendObject(keys, append, state) {
			var temp = state;
			keys = keys.split('.');

			for (var i = 0; i < keys.length - 1; i++) {
				var key = keys[i];
				if (Object.keys(temp).indexOf('_' + key) !== -1) {
					var parentCopy = this.copyObject(temp[key]);
					var tempParent = parentCopy;
					for (var j = i + 1; j < keys.length - 1; j++) {
						tempParent = tempParent[keys[j]];
					}
					tempParent[keys[keys.length - 1]] = append;
					temp['_' + key] = parentCopy;
				}
				temp = temp[key];
			}

			if (Object.keys(temp).indexOf('_' + keys[keys.length - 1]) !== -1) {
				temp['_' + keys[keys.length - 1]] = append;
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
	}, {
		key: 'truncateObject',
		value: function truncateObject(obj) {
			var visibleObject = this.copyObject(obj);
			var setObject = function setObject(obj) {
				Object.keys(obj).forEach(function (key) {
					if (key.charAt(0) === '_') delete obj[key];
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
	}, {
		key: 'copyObject',
		value: function copyObject(obj) {
			var _this2 = this;

			if (obj === null || typeof obj !== 'object') return obj;

			var clone = Object.create(Object.getPrototypeOf(obj));

			var props = Object.getOwnPropertyNames(obj);
			props.forEach(function (key) {
				var desc = Object.getOwnPropertyDescriptor(obj, key);
				if (typeof desc.value === "object") desc.value = _this2.copyObject(desc.value);
				Object.defineProperty(clone, key, desc);
			});

			return clone;
		}
	}]);

	return State;
})();

exports['default'] = new State();
module.exports = exports['default'];
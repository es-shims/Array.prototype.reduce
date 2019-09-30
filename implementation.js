'use strict';

var ES = require('es-abstract/es2019');
var bind = require('function-bind');
var isString = require('is-string');

// Check failure of by-index access of string characters (IE < 9) and failure of `0 in boxedString` (Rhino)
var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var strSplit = bind.call(Function.call, String.prototype.split);

module.exports = function reduce(callbackfn) {
	var O = ES.ToObject(this);
	var self = splitString && isString(O) ? strSplit(O, '') : O;
	var len = ES.ToUint32(ES.Get(self, 'length'));

	// If no callback function or if callback is not a callable function
	if (!ES.IsCallable(callbackfn)) {
		throw new TypeError('Array.prototype.reduce callback must be a function');
	}

	if (len === 0 && arguments.length < 2) {
		throw new TypeError('reduce of empty array with no initial value');
	}

	var k = 0;

	var accumulator;
	var Pk, kPresent;
	if (arguments.length > 1) {
		accumulator = arguments[1];
	} else {
		kPresent = false;
		while (!kPresent && k < len) {
			Pk = ES.ToString(k);
			kPresent = ES.HasProperty(O, Pk);
			if (kPresent) {
				accumulator = ES.Get(O, Pk);
			}
			k += 1;
		}
	}

	while (k < len) {
		Pk = ES.ToString(k);
		kPresent = ES.HasProperty(O, Pk);
		if (kPresent) {
			var kValue = ES.Get(O, Pk);
			accumulator = ES.Call(callbackfn, void undefined, [accumulator, kValue, k, O]);
		}
		k += 1;
	}

	return accumulator;
};

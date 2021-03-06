'use strict';

var Call = require('es-abstract/2020/Call');
var Get = require('es-abstract/2020/Get');
var HasProperty = require('es-abstract/2020/HasProperty');
var IsCallable = require('es-abstract/2020/IsCallable');
var ToObject = require('es-abstract/2020/ToObject');
var ToString = require('es-abstract/2020/ToString');
var ToUint32 = require('es-abstract/2020/ToUint32');
var callBound = require('call-bind/callBound');
var isString = require('is-string');

// Check failure of by-index access of string characters (IE < 9) and failure of `0 in boxedString` (Rhino)
var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var strSplit = callBound('%String.prototype.split%');

module.exports = function reduce(callbackfn) {
	var O = ToObject(this);
	var self = splitString && isString(O) ? strSplit(O, '') : O;
	var len = ToUint32(Get(self, 'length'));

	// If no callback function or if callback is not a callable function
	if (!IsCallable(callbackfn)) {
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
			Pk = ToString(k);
			kPresent = HasProperty(O, Pk);
			if (kPresent) {
				accumulator = Get(O, Pk);
			}
			k += 1;
		}
	}

	while (k < len) {
		Pk = ToString(k);
		kPresent = HasProperty(O, Pk);
		if (kPresent) {
			var kValue = Get(O, Pk);
			accumulator = Call(callbackfn, void undefined, [accumulator, kValue, k, O]);
		}
		k += 1;
	}

	return accumulator;
};

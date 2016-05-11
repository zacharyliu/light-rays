var BasicShader =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var assign = __webpack_require__(1);

	module.exports = function (THREE) {
	  return function (opt) {
	    opt = opt || {};
	    var thickness = typeof opt.thickness === 'number' ? opt.thickness : 0.1;
	    var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1.0;
	    var diffuse = opt.diffuse !== null ? opt.diffuse : 0xffffff;

	    // remove to satisfy r73
	    delete opt.thickness;
	    delete opt.opacity;
	    delete opt.diffuse;
	    delete opt.precision;

	    var ret = assign({
	      uniforms: {
	        thickness: { type: 'f', value: thickness },
	        opacity: { type: 'f', value: opacity },
	        diffuse: { type: 'c', value: new THREE.Color(diffuse) }
	      },
	      vertexShader: [
	        'uniform float thickness;',
	        'attribute float lineMiter;',
	        'attribute vec2 lineNormal;',
	        'void main() {',
	        'vec3 pointPos = position.xyz + vec3(lineNormal * thickness / 2.0 * lineMiter, 0.0);',
	        'gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);',
	        '}'
	      ].join('\n'),
	      fragmentShader: [
	        'uniform vec3 diffuse;',
	        'uniform float opacity;',
	        'void main() {',
	        'gl_FragColor = vec4(diffuse, opacity);',
	        '}'
	      ].join('\n')
	    }, opt);

	    var threeVers = (parseInt(THREE.REVISION, 10) || 0) | 0;
	    if (threeVers < 72) {
	      // Old versions need to specify shader attributes
	      ret.attributes = {
	        lineMiter: { type: 'f', value: 0 },
	        lineNormal: { type: 'v2', value: new THREE.Vector2() }
	      };
	    }
	    return ret;
	  };
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ }
/******/ ]);
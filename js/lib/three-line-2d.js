var threeLine2d =
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

	var inherits = __webpack_require__(1);
	var getNormals = __webpack_require__(2);
	var VERTS_PER_POINT = 2;

	module.exports = function createLineMesh (THREE) {
	  function LineMesh (path, opt) {
	    if (!(this instanceof LineMesh)) {
	      return new LineMesh(path, opt);
	    }
	    THREE.BufferGeometry.call(this);

	    if (Array.isArray(path)) {
	      opt = opt || {};
	    } else if (typeof path === 'object') {
	      opt = path;
	      path = [];
	    }

	    opt = opt || {};

	    this.addAttribute('position', new THREE.BufferAttribute(null, 3));
	    this.addAttribute('lineNormal', new THREE.BufferAttribute(null, 2));
	    this.addAttribute('lineMiter', new THREE.BufferAttribute(null, 1));
	    if (opt.distances) {
	      this.addAttribute('lineDistance', new THREE.BufferAttribute(null, 1));
	    }
	    if (typeof this.setIndex === 'function') {
	      this.setIndex(new THREE.BufferAttribute(null, 1));
	    } else {
	      this.addAttribute('index', new THREE.BufferAttribute(null, 1));
	    }
	    this.update(path, opt.closed);
	  }

	  inherits(LineMesh, THREE.BufferGeometry);

	  LineMesh.prototype.update = function (path, closed) {
	    path = path || [];
	    var normals = getNormals(path, closed);

	    if (closed) {
	      path = path.slice();
	      path.push(path[0]);
	      normals.push(normals[0]);
	    }

	    var attrPosition = this.getAttribute('position');
	    var attrNormal = this.getAttribute('lineNormal');
	    var attrMiter = this.getAttribute('lineMiter');
	    var attrDistance = this.getAttribute('lineDistance');
	    var attrIndex = typeof this.getIndex === 'function' ? this.getIndex() : this.getAttribute('index');

	    if (!attrPosition.array ||
	        (path.length !== attrPosition.array.length / 3 / VERTS_PER_POINT)) {
	      var count = path.length * VERTS_PER_POINT;
	      attrPosition.array = new Float32Array(count * 3);
	      attrNormal.array = new Float32Array(count * 2);
	      attrMiter.array = new Float32Array(count);
	      attrIndex.array = new Uint16Array(Math.max(0, (path.length - 1) * 6));

	      if (attrDistance) {
	        attrDistance.array = new Float32Array(count);
	      }
	    }

	    attrPosition.needsUpdate = true;
	    attrNormal.needsUpdate = true;
	    attrMiter.needsUpdate = true;
	    if (attrDistance) {
	      attrDistance.needsUpdate = true;
	    }

	    var index = 0;
	    var c = 0;
	    var dIndex = 0;
	    var indexArray = attrIndex.array;

	    path.forEach(function (point, pointIndex, list) {
	      var i = index;
	      indexArray[c++] = i + 0;
	      indexArray[c++] = i + 1;
	      indexArray[c++] = i + 2;
	      indexArray[c++] = i + 2;
	      indexArray[c++] = i + 1;
	      indexArray[c++] = i + 3;

	      attrPosition.setXYZ(index++, point[0], point[1], 0);
	      attrPosition.setXYZ(index++, point[0], point[1], 0);

	      if (attrDistance) {
	        var d = pointIndex / (list.length - 1);
	        attrDistance.setX(dIndex++, d);
	        attrDistance.setX(dIndex++, d);
	      }
	    });

	    var nIndex = 0;
	    var mIndex = 0;
	    normals.forEach(function (n) {
	      var norm = n[0];
	      var miter = n[1];
	      attrNormal.setXY(nIndex++, norm[0], norm[1]);
	      attrNormal.setXY(nIndex++, norm[0], norm[1]);

	      attrMiter.setX(mIndex++, -miter);
	      attrMiter.setX(mIndex++, miter);
	    });
	  };

	  return LineMesh;
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(3)

	var lineA = [0, 0]
	var lineB = [0, 0]
	var tangent = [0, 0]
	var miter = [0, 0]

	module.exports = function(points, closed) {
	    var curNormal = null
	    var out = []
	    if (closed) {
	        points = points.slice()
	        points.push(points[0])
	    }

	    var total = points.length
	    for (var i=1; i<total; i++) {
	        var last = points[i-1]
	        var cur = points[i]
	        var next = i<points.length-1 ? points[i+1] : null

	        util.direction(lineA, cur, last)
	        if (!curNormal)  {
	            curNormal = [0, 0]
	            util.normal(curNormal, lineA)
	        }

	        if (i === 1) //add initial normals
	            addNext(out, curNormal, 1)

	        if (!next) { //no miter, simple segment
	            util.normal(curNormal, lineA) //reset normal
	            addNext(out, curNormal, 1)
	        } else { //miter with last
	            //get unit dir of next line
	            util.direction(lineB, next, cur)

	            //stores tangent & miter
	            var miterLen = util.computeMiter(tangent, miter, lineA, lineB, 1)
	            addNext(out, miter, miterLen)
	        }
	    }

	    //if the polyline is a closed loop, clean up the last normal
	    if (points.length > 2 && closed) {
	        var last2 = points[total-2]
	        var cur2 = points[0]
	        var next2 = points[1]

	        util.direction(lineA, cur2, last2)
	        util.direction(lineB, next2, cur2)
	        util.normal(curNormal, lineA)
	        
	        var miterLen2 = util.computeMiter(tangent, miter, lineA, lineB, 1)
	        out[0][0] = miter.slice()
	        out[total-1][0] = miter.slice()
	        out[0][1] = miterLen2
	        out[total-1][1] = miterLen2
	        out.pop()
	    }

	    return out
	}

	function addNext(out, normal, length) {
	    out.push([[normal[0], normal[1]], length])
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var add = __webpack_require__(4)
	var set = __webpack_require__(5)
	var normalize = __webpack_require__(6)
	var subtract = __webpack_require__(7)
	var dot = __webpack_require__(8)

	var tmp = [0, 0]

	module.exports.computeMiter = function computeMiter(tangent, miter, lineA, lineB, halfThick) {
	    //get tangent line
	    add(tangent, lineA, lineB)
	    normalize(tangent, tangent)

	    //get miter as a unit vector
	    set(miter, -tangent[1], tangent[0])
	    set(tmp, -lineA[1], lineA[0])

	    //get the necessary length of our miter
	    return halfThick / dot(miter, tmp)
	}

	module.exports.normal = function normal(out, dir) {
	    //get perpendicular
	    set(out, -dir[1], dir[0])
	    return out
	}

	module.exports.direction = function direction(out, a, b) {
	    //get unit dir of two lines
	    subtract(out, a, b)
	    normalize(out, out)
	    return out
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = add

	/**
	 * Adds two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function add(out, a, b) {
	    out[0] = a[0] + b[0]
	    out[1] = a[1] + b[1]
	    return out
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = set

	/**
	 * Set the components of a vec2 to the given values
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} out
	 */
	function set(out, x, y) {
	    out[0] = x
	    out[1] = y
	    return out
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = normalize

	/**
	 * Normalize a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to normalize
	 * @returns {vec2} out
	 */
	function normalize(out, a) {
	    var x = a[0],
	        y = a[1]
	    var len = x*x + y*y
	    if (len > 0) {
	        //TODO: evaluate use of glm_invsqrt here?
	        len = 1 / Math.sqrt(len)
	        out[0] = a[0] * len
	        out[1] = a[1] * len
	    }
	    return out
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = subtract

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function subtract(out, a, b) {
	    out[0] = a[0] - b[0]
	    out[1] = a[1] - b[1]
	    return out
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = dot

	/**
	 * Calculates the dot product of two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	function dot(a, b) {
	    return a[0] * b[0] + a[1] * b[1]
	}

/***/ }
/******/ ]);
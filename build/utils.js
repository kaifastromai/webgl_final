"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const THREE = require("three");
function resize_canvas(canvas) {
    var cssToRealPixels = 1;
    var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
    var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}
exports.resize_canvas = resize_canvas;
function randomPos(max, min) {
    let pos = [3];
    let range = max - min;
    pos[0] = Math.random() * (range + 1) + min;
    pos[1] = Math.random() * (range + 1) + min;
    pos[2] = Math.random() * (range + 1) + min;
    return pos;
}
function controlledRandomPos(x_range, y_range, z_range) {
    let pos = [3];
    let lx_range = x_range.max - x_range.min;
    let yx_range = y_range.max - y_range.min;
    let zx_range = z_range.max - z_range.min;
    pos[0] = Math.random() * (lx_range + 1) + x_range.min;
    pos[1] = Math.random() * (yx_range + 1) + y_range.min;
    pos[2] = Math.random() * (zx_range + 1) + z_range.min;
    return pos;
}
function randomObjects(x_range, y_range, z_range, count, shapes, displacement) {
    var group = new THREE.Group;
    for (let i = 0; i < count; i++) {
        let selector = Math.floor(Math.random() % shapes.length);
        let object = shapes[selector].clone();
        object.position.fromArray(controlledRandomPos(x_range, y_range, z_range));
        object.position.add(displacement);
        object.scale.fromArray(controlledRandomPos({ min: 0.1, max: 0.2 }, { min: 0.1, max: 0.2 }, { min: 0.1, max: 0.2 }));
        group.add(object);
    }
    return group;
}
exports.randomObjects = randomObjects;
//Linear interpolation
function ArrayLerp(old, newvals, t) {
    let rarray = [old.length];
    for (let i = 0; i < old.length; i++) {
        rarray[i] = Lerp(old[i], newvals[i], t);
    }
    return rarray;
}
exports.ArrayLerp = ArrayLerp;
//Cubic interpolation
function ArrayCerp(old, newvals, t) {
    let rarray = [old.length];
    for (let i = 0; i < old.length; i++) {
        rarray[i] = SimpleCerp(old[i], newvals[i], t);
    }
    return rarray;
}
exports.ArrayCerp = ArrayCerp;
function Lerp(a, b, t) {
    return a + (b - a) * t;
}
exports.Lerp = Lerp;
function SimpleCerp(a, b, t) {
    return a + (b - a) * t * t;
}
exports.SimpleCerp = SimpleCerp;
function Smooth(old, newvals, speed) {
}
function array_corout(f) {
    var o = f(); // instantiate the coroutine
    o.next(); // execute until the first yield
    return function (old_ar, new_ar, t) {
        return o.next(old_ar, new_ar, t).value;
    };
}
var LerpCo = array_corout(function* () {
    var k = 0;
    while (true) {
        for (k = 0; k < 1; k += app_1.dt) {
            yield ArrayLerp([0], [0], k);
            // console.log(Lerp(0, 10, t / 29));
        }
        yield [0, 0, 0];
        k = 0;
    }
});
exports.LerpCo = LerpCo;
function* foo(al) {
    while (al < 3) {
        yield al++;
    }
}
const it = foo(0);
function cofoo(ar) {
    console.log(it.next().value);
}
exports.cofoo = cofoo;
function lerp_coroutine(fn) {
    return function () {
        let gen = fn(...arguments);
        next();
        function next(result) {
            let yielded = gen.next(result);
            if (!yielded.done) {
                next(yielded.value);
            }
        }
    };
}
var simple_func = lerp_coroutine(function* (first, last) {
    yield first[0]++;
});
exports.simple_func = simple_func;
//# sourceMappingURL=utils.js.map
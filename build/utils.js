"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
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
function randomPos(range) {
    let pos = [3];
    pos[0] = Math.random() % range;
    pos[1] = Math.random() % range;
    pos[2] = Math.random() % range;
    return pos;
}
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
        t = 0;
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
function coroutine(fn) {
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
var simple_func = coroutine(function* (n) {
    yield n;
});
exports.simple_func = simple_func;
//# sourceMappingURL=utils.js.map
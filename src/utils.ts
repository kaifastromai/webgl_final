import { dt } from "./app";
import { Vector3 } from "three";
import THREE = require("three");
import { debug } from "console";


function resize_canvas(canvas: HTMLCanvasElement) {
    var cssToRealPixels = 1;
    var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
    var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {

        canvas.width = displayWidth;
        canvas.height = displayHeight;

    }
}
function randomPos(max: number, min: number): Array<number> {
    let pos = [3];
    let range = max - min;
    pos[0] = Math.random() * (range + 1) + min;
    pos[1] = Math.random() * (range + 1) + min;
    pos[2] = Math.random() * (range + 1) + min;
    return pos;
}
function controlledRandomPos(x_range: Range, y_range: Range, z_range: Range): Array<number> {
    let pos = [3];
    let lx_range = x_range.max - x_range.min;
    let yx_range = y_range.max - y_range.min;
    let zx_range = z_range.max - z_range.min;
    pos[0] = Math.random() * (lx_range + 1) + x_range.min;
    pos[1] = Math.random() * (yx_range + 1) + y_range.min;
    pos[2] = Math.random() * (zx_range + 1) + z_range.min;
    return pos;
}
interface Range {
    min: number;
    max: number;
}
function randomObjects(x_range: Range, y_range: Range, z_range: Range, count: number, shapes: THREE.Object3D[], displacement: Vector3): THREE.Group {
    var group = new THREE.Group;
    for (let i = 0; i < count; i++) {
        let selector = Math.floor(Math.random() % shapes.length);
        let object = shapes[selector].clone();
        object.position.fromArray(controlledRandomPos(x_range, y_range, z_range));
        object.position.add(displacement);
        object.scale.fromArray(controlledRandomPos({ min: 0.1, max: 0.2 }, { min: 0.1, max: 0.2 }, { min: 0.1, max: 0.2 }))
        group.add(object);
    }
    return group;
}
//Linear interpolation
function ArrayLerp(old: Array<number>, newvals: Array<number>, t: number): Array<number> {

    let rarray = [old.length];
    for (let i = 0; i < old.length; i++) {
        rarray[i] = Lerp(old[i], newvals[i], t);
    }
    return rarray;


}
//Cubic interpolation
function ArrayCerp(old: Array<number>, newvals: Array<number>, t: number): Array<number> {

    let rarray = [old.length];
    for (let i = 0; i < old.length; i++) {
        rarray[i] = SimpleCerp(old[i], newvals[i], t);
    }
    return rarray;


}
function Lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}
function SimpleCerp(a: number, b: number, t: number) {
    return a + (b - a) * t * t;
}
function Smooth(old: Array<number>, newvals: Array<number>, speed: number): Array<number> {


}
function array_corout(f: any) {
    var o = f(); // instantiate the coroutine
    o.next(); // execute until the first yield
    return function (old_ar: Array<number>, new_ar: Array<number>, t: number) {
        return o.next(old_ar, new_ar, t).value;


    };
}
var LerpCo = array_corout(function* () {
    var k = 0;
    while (true) {
        for (k = 0; k < 1; k += dt) {
            yield ArrayLerp([0], [0], k);
            // console.log(Lerp(0, 10, t / 29));

        }

        yield [0, 0, 0];
        k = 0;

    }
});

function* foo(al: number) {
    while (al < 3) {
        yield al++;
    }
}
const it = foo(0);
function cofoo(ar: number) {
    console.log(it.next().value);
}
function lerp_coroutine(fn: Generator<any, any, any>) {
    return function () {
        let gen = fn(...arguments);
        next();
        function next(result: any) {
            let yielded = gen.next(result);

            if (!yielded.done) {
                next(yielded.value);
            }

        }
    };
}
var simple_func = lerp_coroutine(function* (first: Array<number>, last: Array<number>) {
    yield first[0]++;

});


export { resize_canvas, Lerp, SimpleCerp, ArrayCerp, ArrayLerp, LerpCo, cofoo, simple_func, randomObjects };
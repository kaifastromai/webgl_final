import { dt } from "./app";

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
function randomPos(range: number): Array<number> {
    let pos = [3];
    pos[0] = Math.random() % range;
    pos[1] = Math.random() % range;
    pos[2] = Math.random() % range;
    return pos;
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
        return o.next(old_ar, new_ar, t).value


    }
}
var LerpCo = array_corout(function* () {
    var k = 0;
    while (true) {
        for (k = 0; k < 1; k += dt) {
            yield ArrayLerp([0], [0], k);
            // console.log(Lerp(0, 10, t / 29));

        }

        yield [0, 0, 0];
        t = 0;

    }
})

function* foo(al: number) {
    while (al < 3) {
        yield al++;
    }
}
const it = foo(0);
function cofoo(ar: number) {
    console.log(it.next().value);
}
function coroutine(fn: Generator<any, any, any>) {
    return function () {
        let gen = fn(...arguments);
        next();
        function next(result: any) {
            let yielded = gen.next(result);
            
            if (!yielded.done) {
                next(yielded.value)
            }
            
        }
    }
}
var simple_func = coroutine(function* (n: number) {
    yield n
});


export { resize_canvas, Lerp, SimpleCerp, ArrayCerp, ArrayLerp, LerpCo, cofoo, simple_func };
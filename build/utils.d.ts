declare function resize_canvas(canvas: HTMLCanvasElement): void;
declare function ArrayLerp(old: Array<number>, newvals: Array<number>, t: number): Array<number>;
declare function ArrayCerp(old: Array<number>, newvals: Array<number>, t: number): Array<number>;
declare function Lerp(a: number, b: number, t: number): number;
declare function SimpleCerp(a: number, b: number, t: number): number;
declare var LerpCo: (old_ar: number[], new_ar: number[], t: number) => any;
declare function cofoo(ar: number): void;
declare var simple_func: () => void;
export { resize_canvas, Lerp, SimpleCerp, ArrayCerp, ArrayLerp, LerpCo, cofoo, simple_func };

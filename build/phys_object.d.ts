import { Object3D } from "three";
import { Body } from "cannon";
declare class PhyObj {
    /**@param  */
    obj: Object3D;
    phys_body: Body;
    constructor(obj: Object3D, body: Body);
    setPos(x: number, y: number, z: number): void;
    setQuat(x: number, y: number, z: number, w: number): void;
    update(): void;
}
export { PhyObj };

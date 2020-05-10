import { Object3D } from "three";
import { Body } from "cannon";
class PhyObj {

    /**@param  */
    obj: Object3D;
    phys_body: Body;

    constructor(obj: Object3D, body: Body) {
        if (obj != undefined) {
            this.obj = obj;
        }
        else {
            this.obj = new Object3D();
        }
        if (body != undefined) {
            this.phys_body = body;
        }
        else {
            this.phys_body = new Body();
        }
    }
    setPos(x: number, y: number, z: number) {
        this.phys_body.position.set(x, y, z);
        this.obj.position.set(this.phys_body.position.x, this.phys_body.position.y, this.phys_body.position.z);

    }
    setQuat(x: number, y: number, z: number, w: number) {
        this.phys_body.quaternion.set(x, y, z, w);
        this.obj.quaternion.set(x, y, z, w);

    }

    update() {
        this.obj.position.set(this.phys_body.position.x, this.phys_body.position.y, this.phys_body.position.z);
        this.obj.quaternion.set(this.phys_body.quaternion.x, this.phys_body.quaternion.y, this.phys_body.quaternion.z, this.phys_body.quaternion.w);
    }

}

export { PhyObj }
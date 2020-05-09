"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
const cannon_1 = require("cannon");
class PhyObj {
    constructor(obj, body) {
        if (obj != undefined) {
            this.obj = obj;
        }
        else {
            this.obj = new three_1.Object3D();
        }
        if (body != undefined) {
            this.phys_body = body;
        }
        else {
            this.phys_body = new cannon_1.Body();
        }
    }
    setPos(x, y, z) {
        this.phys_body.position.set(x, y, z);
        this.obj.position.set(this.phys_body.position.x, this.phys_body.position.y, this.phys_body.position.z);
    }
    setQuat(x, y, z, w) {
        this.phys_body.quaternion.set(x, y, z, w);
        this.obj.quaternion.set(x, y, z, w);
    }
    update() {
        this.obj.position.set(this.phys_body.position.x, this.phys_body.position.y, this.phys_body.position.z);
        this.obj.quaternion.set(this.phys_body.quaternion.x, this.phys_body.quaternion.y, this.phys_body.quaternion.z, this.phys_body.quaternion.w);
    }
}
exports.PhyObj = PhyObj;
//# sourceMappingURL=phys_object.js.map
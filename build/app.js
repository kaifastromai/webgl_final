"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const three_1 = require("three");
const CNN = require("cannon");
const GLTFLoader_1 = require("three/examples/jsm/loaders/GLTFLoader");
const FBXLoader_1 = require("three/examples/jsm/loaders/FBXLoader");
const hotkeys_js_1 = require("hotkeys-js");
const phys_object_1 = require("./phys_object");
const dat = require("dat.gui");
const gui = new dat.GUI();
var ship = function () {
    let message = 'dat.gui';
    let speed = 0.8;
    let displayOutline = false;
    // Define render logic ...
};
//Global Delta t
var dt = 0;
exports.dt = dt;
hotkeys_js_1.default('*', (event, handler) => {
    if (event.keyCode == 39) {
        console.log(event.key);
        ApplyForce(new CNN.Vec3(-1, 0, 0), 80);
        event.preventDefault();
    }
    else if (event.keyCode == 37) {
        event.preventDefault();
        console.log(event.key);
        ApplyForce(new CNN.Vec3(1, 0, 0), 80);
    }
    else if (event.keyCode == 38) {
        event.preventDefault();
        ApplyForce(new CNN.Vec3(0, 0, 1), 80);
    }
    else if (event.keyCode == 40) {
        event.preventDefault();
        ApplyForce(new CNN.Vec3(0, 0, -1), 80);
    }
});
//CANNON world setup
var fixedTimeStep = 1.0 / 60.0;
var maxSubSteps = 3;
var world = new CNN.World();
world.gravity.set(0, 0, 0);
world.broadphase = new CNN.NaiveBroadphase();
world.solver.iterations = 10;
var colliderSize = [0.8, 2, 3];
var boxBody = new CNN.Body({
    mass: 5,
    position: new CNN.Vec3(0, 1, 0),
    shape: new CNN.Box(new CNN.Vec3(colliderSize[0] / 2, colliderSize[1] / 2, colliderSize[2] / 2))
});
boxBody.quaternion.setFromAxisAngle(new CNN.Vec3(0, 1, 0), -Math.PI / 2);
world.addBody(boxBody);
var groundBody = new CNN.Body({
    mass: 0 //zero mass means mesh is static
});
var groundShape = new CNN.Plane();
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
groundBody.position.set(0, -1, 0);
groundBody.addShape(groundShape);
world.addBody(groundBody);
let drag_vec = new THREE.Vector2();
let drag_src = new THREE.Vector2();
let drag = false;
document.addEventListener('mousedown', (e) => { drag = true; drag_src = new THREE.Vector2(e.offsetX, e.offsetY); });
document.addEventListener('mousemove', (e) => {
    if (drag) {
        drag_vec = new THREE.Vector2(10 * (e.offsetX - drag_src.x) / window.innerWidth, 10 * (-e.offsetY + drag_src.y) / window.innerHeight);
        console.log("Offset X: " + 10 * (e.offsetX - drag_src.x) / window.innerWidth + " ,Offset Y: " + 10 * (-e.offsetY + drag_src.y) / window.innerHeight);
    }
});
document.addEventListener('mouseup', () => drag = false);
//---------Scene and render setup----------//
var scene = new THREE.Scene();
const color = 0xFFFFFF; // white
const near = 30;
const far = 40;
scene.fog = new THREE.Fog(color, near, far);
scene.background = new THREE.Color(0xFFFFFF);
const light_color = 0xFFFFFF;
const intensity = 1;
const dir_light = new THREE.DirectionalLight(color, intensity);
dir_light.position.set(0, 0, 0);
dir_light.target.position.set(0, -1, 0);
dir_light.castShadow = true;
scene.add(dir_light);
scene.add(dir_light.target);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// var glcanvas = <HTMLCanvasElement>document.getElementById('glcanvas');
// const gl = glcanvas.getContext('webgl2', { alpha: false });
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.append(renderer.domElement);
//---------------------------------------//
//Lights
var amb_light = new THREE.AmbientLight(0x505050);
var point_light = new THREE.PointLight();
point_light.position.set(0, 2, 0);
//Imported Geo
const loader = new GLTFLoader_1.GLTFLoader();
const url = "/models/stormracer.glb";
//Geo
async function load_glb_model(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, (gltf) => {
            let mdl = gltf.scene;
            mdl.scale.set(0.5, 0.5, 0.5);
            resolve(mdl);
        }, (xhr) => {
            // called while loading is progressing
            console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
        }, (error) => {
            reject(new Error("Could not load: " + error.message));
        });
    });
}
const fbx_loader = new FBXLoader_1.FBXLoader();
const road_url = '/models/road.fbx';
async function FBXLoad() {
    return new Promise((resolve, reject) => {
        fbx_loader.load(road_url, (fbx) => {
            let road = fbx;
            fbx.scale.set(1, 1, 1);
            resolve(road);
        }, (xhr) => {
            console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
        }, (error) => {
            reject(new Error("Could not load: " + error.message));
        });
    });
}
var Ship = new phys_object_1.PhyObj(undefined, undefined);
var geo = new THREE.BoxGeometry(colliderSize[0], colliderSize[1], colliderSize[2]);
var mat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
mat.wireframe = true;
var model = new THREE.Mesh(geo, mat);
var plane_geo = new THREE.PlaneBufferGeometry(10, 10);
var plane_mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
var plane_mesh = new THREE.Mesh(plane_geo, plane_mat);
var point_geo = new THREE.Geometry().setFromPoints([new THREE.Vector3(0, 0, 0)]);
var point_mat = new THREE.PointsMaterial({ color: 0xFF0000, size: 0.1 });
var point_mesh = new THREE.Points(point_geo, point_mat);
model.position.set(0, 0, 0);
model.scale.set(1, 0.1, 0.5);
point_mesh.position.set(0.1, 0, 0);
plane_mesh.position.set(0, 0, 0);
plane_mesh.quaternion.fromArray(groundBody.quaternion.toArray());
camera.position.set(5, 3, 0);
camera.lookAt(new three_1.Vector3(0, 0, 0));
scene.add(amb_light);
var debug_items = Array();
//DrawLine(new Vector3(0, 0.5, 0), new Vector3(0.5, 1, 0.5), scene);
//DrawLine(new Vector3(0, 0, 0), new Vector3(0.1, 0.5, 1), scene);
var ship_mdl = new THREE.Group();
point_mesh.position.set(0, 1.1, 0);
var raycast = new THREE.Raycaster();
var object_probe = new THREE.Raycaster();
var then = 0;
scene.add(point_mesh);
scene.add(point_light);
//scene.add(plane_mesh);
var xtdt = 1;
scene.add(model);
var worldGroup = new THREE.Group();
var road_mdl = new THREE.Group();
async function main() {
    ship_mdl = await load_glb_model(url);
    road_mdl = await load_glb_model("/models/roadglb2.glb");
    road_mdl.quaternion.setFromAxisAngle(new three_1.Vector3(0, 1, 0), Math.PI / 2);
    road_mdl.position.set(0, 0, 0);
    road_mdl.scale.set(2, 2, 2);
    var road_mdl2 = road_mdl.clone();
    road_mdl2.position.x -= 24;
    road_mdl2.name = "road2";
    worldGroup.add(road_mdl, road_mdl2);
    worldGroup.receiveShadow = true;
    ship_mdl.castShadow = true;
    scene.add(ship_mdl);
    scene.add(worldGroup);
    FixedUpdate();
    Ship.obj = ship_mdl;
    Ship.phys_body = boxBody;
    Ship.phys_body.angularDamping = 0.5;
    setInterval(createNewSection, 4000 * xtdt);
}
main();
function ApplyForce(dir, magnitude) {
    boxBody.applyLocalForce(dir.mult(magnitude), new CNN.Vec3(0, 0, 0));
}
let intresults = new Float32Array(1);
let oldpos = [0, 0];
let npos = [1, 1];
let can_add_lateral = true;
function FixedUpdate(now = 0) {
    if (then != 0) {
        if (then > 0) {
            exports.dt = dt = (now - then) / 1000;
            xtdt = dt;
            // console.log("Here it is: " + LerpCo([0, 0, 0], [2, 3, 4], 1));
            //console.log(simple_func(10));
            world.step(fixedTimeStep, dt, maxSubSteps);
            model.quaternion.set(boxBody.quaternion.x, boxBody.quaternion.y, boxBody.quaternion.z, boxBody.quaternion.w);
            model.position.set(boxBody.position.x, boxBody.position.y, boxBody.position.z);
            Ship.update();
            camera.lookAt(model.position);
            camera.position.z = Ship.obj.position.z;
            // console.log(secs);
            var forceLocs = Array();
            forceLocs.push(model.localToWorld(new three_1.Vector3(-0.5, 0, 1)), model.localToWorld(new three_1.Vector3(0.5, 0, 1)), model.localToWorld(new three_1.Vector3(0.5, 0, -1)), model.localToWorld(new three_1.Vector3(-0.5, 0, -1)));
            console.log(model.position.toArray());
            var shipDown = new three_1.Vector3(0, -1, 0);
            var cbquat = new THREE.Quaternion();
            model.getWorldQuaternion(cbquat);
            shipDown.applyQuaternion(cbquat);
            object_probe.set(model.position, shipDown);
            var hit = object_probe.intersectObject(worldGroup, true);
            DrawRay(model.position, shipDown.multiplyScalar(4), scene, new THREE.Color("green"));
            if (hit.length > 0) {
                let posdelta = model.position.z - hit[0].object.localToWorld(new three_1.Vector3(0, 0, 0)).z;
                if (Math.abs(posdelta) > 1)
                    if (Math.sign(posdelta) == 1 && can_add_lateral) {
                        var nroad = worldGroup.children[worldGroup.children.length - 1].clone();
                        worldGroup.add(nroad);
                        nroad.position.z += 24;
                        worldGroup.add(nroad);
                        can_add_lateral = !can_add_lateral;
                    }
            }
            for (let i = 0; i < 4; i++) {
                raycast.set(forceLocs[i], shipDown);
                //DrawRay(forceLocs[i], cubeDown, scene);
                var hits = raycast.intersectObject(worldGroup, true);
                if (hits.length != 0) {
                    //console.log("Hit point: " + hits[0].point.toArray());
                    ApplyHoverForce(new three_1.Vector3(hits[0].point.x, hits[0].point.y, hits[0].point.z), forceLocs[i]);
                    DrawLine(forceLocs[i], new three_1.Vector3(hits[0].point.x, hits[0].point.y, hits[0].point.z), scene);
                    point_mesh.position.set(hits[0].point.x, hits[0].point.y, hits[0].point.z);
                }
                DrawRay(model.position, shipDown.multiplyScalar(0.4), scene, new three_1.Color("green"));
                worldGroup.position.add(new three_1.Vector3(0.05, 0, 0));
                //console.log("Speed per second:" + 0.05 / dt);
            }
            renderer.render(scene, camera);
            cleanDebugItems();
        }
    }
    requestAnimationFrame(FixedUpdate);
    then = now;
}
var createNewSection = coroutine(function* () {
    while (true) {
        yield;
        //console.log('Created new section');
        var nroad = worldGroup.children[worldGroup.children.length - 1].clone();
        worldGroup.add(nroad);
        nroad.position.x -= 24;
        nroad = worldGroup.children[worldGroup.children.length - 1].clone();
        worldGroup.add(nroad);
        nroad.position.x -= 24;
        if (worldGroup.children.length > 5) {
            worldGroup.remove(worldGroup.children[0]);
        }
    }
});
// var LerpCo = coroutine(function* () {
//     var t = 0;
//     while (true) {
//         for (t = 0; t < 30; t++) {
//             yield;
//             console.log("Lerp is: " + Lerp(0, 10, t / 29));
//         }
//         yield;
//         t = 0;
//     }
// })
function coroutine(f) {
    var o = f(); // instantiate the coroutine
    o.next(); // execute until the first yield
    return function (x) {
        o.next(x);
    };
}
function DrawRay(origin, direction, scene, color = new THREE.Color()) {
    var nmat = new THREE.LineBasicMaterial({ color: color });
    var points = Array();
    points.push(origin);
    var end = new three_1.Vector3(direction.x + origin.x, direction.y + origin.y, direction.z + origin.z);
    points.push(end);
    var ngeo = new THREE.BufferGeometry().setFromPoints(points);
    var line = new THREE.Line(ngeo, nmat);
    line.name = "debug_line";
    scene.add(line);
    debug_items.push(line);
}
function DrawLine(origin, end, scene, color = new THREE.Color()) {
    var nmat = new THREE.LineBasicMaterial({ color: color });
    var points = Array();
    points.push(origin);
    var end = new three_1.Vector3(end.x, end.y, end.z);
    points.push(end);
    var ngeo = new THREE.BufferGeometry().setFromPoints(points);
    var line = new THREE.Line(ngeo, nmat);
    line.name = "debug_line";
    scene.add(line);
    debug_items.push(line);
}
function cleanDebugItems() {
    scene.remove(...debug_items);
}
function ApplyHoverForce(ground, forceLoc) {
    var attraction_coef = 10;
    var hover_height = 1;
    //  ground.set(ground.x + cube.localToWorld(new Vector3(0, 1, 0)).normalize().x * hover_height,
    //     ground.y + cube.localToWorld(new Vector3(0, 1, 0)).normalize().y * hover_height,
    //      ground.z + cube.localToWorld(new Vector3(0, 1, 0)).normalize().z * hover_height);
    let lcl_q = model.quaternion;
    let up = new three_1.Vector3(0, 1, 0);
    up.applyQuaternion(lcl_q);
    up.normalize();
    ground.addScaledVector(up, hover_height);
    DrawRay(model.position, up, scene);
    var r = new three_1.Vector3(ground.x - forceLoc.x, ground.y - forceLoc.y, ground.z - forceLoc.z);
    boxBody.applyForce(new CNN.Vec3(r.x * attraction_coef, r.y * attraction_coef, r.z * attraction_coef), new CNN.Vec3(forceLoc.x, forceLoc.y, forceLoc.z));
    boxBody.linearDamping = 0.6;
}
function ManageRoad() {
    var nroad = worldGroup.children[0].clone();
    nroad.position.x -= 23;
    worldGroup.remove(worldGroup.children[worldGroup.children.length - 1]);
}
//animate();
//# sourceMappingURL=app.js.map
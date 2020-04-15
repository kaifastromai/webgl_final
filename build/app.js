"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const three_1 = require("three");
const CNN = require("cannon");
//CANNON world setup
var fixedTimeStep = 1.0 / 60.0;
var maxSubSteps = 3;
var world = new CNN.World();
world.gravity.set(0, -9.82, 0);
var boxBody = new CNN.Body({
    mass: 5,
    position: new CNN.Vec3(0, 0, 0),
    shape: new CNN.Box(new CNN.Vec3(0.5, 0.5, 0.5))
});
world.addBody(boxBody);
var groundBody = new CNN.Body({
    mass: 0 //zero mass means mesh is static
});
var groundShape = new CNN.Plane();
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
groundBody.position.set(0, -2, 0);
groundBody.addShape(groundShape);
world.addBody(groundBody);
//---------Scene and render setup----------//
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// var glcanvas = <HTMLCanvasElement>document.getElementById('glcanvas');
// const gl = glcanvas.getContext('webgl2', { alpha: false });
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);
//---------------------------------------//
//Lights
var amb_light = new THREE.AmbientLight(0x505050);
var point_light = new THREE.PointLight();
point_light.position.set(0, 2, 0);
//Imported Geo
// const loader = new GLTFLoader();
// const url = "/models/stormracer.glb";
// loader.load(url, (gltf) => {
//     const root = gltf.scene;
//     scene.add(root);
// }, (xhr) => {
//     // called while loading is progressing
//     console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
// },
//     (error) => {
//         // called when loading has errors
//         console.error('An error happened', error);
//     });
//Geo
var geo = new THREE.BoxGeometry();
var mat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geo, mat);
var plane_geo = new THREE.PlaneBufferGeometry(10, 10);
var plane_mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
var plane_mesh = new THREE.Mesh(plane_geo, plane_mat);
var point_geo = new THREE.Geometry().setFromPoints([new THREE.Vector3(0, 0, 0)]);
var point_mat = new THREE.PointsMaterial({ color: 0xFF0000, size: 0.1 });
var point_mesh = new THREE.Points(point_geo, point_mat);
cube.position.set(0, 0, 0);
cube.scale.set(0.5, 0.5, 0.5);
point_mesh.position.set(0.1, 0, 0);
plane_mesh.position.fromArray(groundBody.position.toArray());
plane_mesh.quaternion.fromArray(groundBody.quaternion.toArray());
camera.position.set(2, 2, 2);
camera.lookAt(new three_1.Vector3(0, 0, 0));
scene.add(amb_light);
var debug_items = Array();
//scene.add(cube);
scene.add(point_light);
scene.add(plane_mesh);
//DrawLine(new Vector3(0, 0.5, 0), new Vector3(0.5, 1, 0.5), scene);
//DrawLine(new Vector3(0, 0, 0), new Vector3(0.1, 0.5, 1), scene);
var group = new THREE.Group();
point_mesh.position.set(0, 1.1, 0);
//group.add(cube);
scene.add(cube);
var raycast = new THREE.Raycaster();
var then = 0;
// function animate(now: number = 0) {
//     group.rotateY(2 * Math.PI / 240);
//     requestAnimationFrame(animate);
// };
scene.add(point_mesh);
var secs = 0;
var isNextFrame = false;
function FixedUpdate(now = 0) {
    if (then != 0) {
        if (then > 0) {
            var dt = (now - then) / 1000;
            secs += dt;
            // console.log(secs);
            if (secs > 0.02) {
                raycast.set(new three_1.Vector3(0, 1, 0), new three_1.Vector3(0, -1, 0));
                var hits = raycast.intersectObject(cube);
                //console.log(hits[0].point);
                if (hits.length != 0) {
                    DrawLine(new three_1.Vector3(0.1, 1, 0), hits[0].point, scene);
                    console.log(hits[0].point);
                    point_mesh.position.set(hits[0].point.x, hits[0].point.y, hits[0].point.z);
                }
                if (isNextFrame) {
                    scene.children.forEach((obj) => {
                        if (obj.name == "debug_line") {
                            scene.remove(obj);
                        }
                    });
                    isNextFrame = !isNextFrame;
                }
                boxBody.applyLocalForce(new CNN.Vec3(0, boxBody.mass * 7, 0), new CNN.Vec3(1, 0, 0));
                console.log("Local to world:" + cube.localToWorld(new three_1.Vector3(1, 0, 0)).toArray());
                //world.step(fixedTimeStep, secs, maxSubSteps);
                cube.quaternion.set(boxBody.quaternion.x, boxBody.quaternion.y, boxBody.quaternion.z, boxBody.quaternion.w);
                cube.position.set(boxBody.position.x, boxBody.position.y, boxBody.position.z);
                secs = 0;
                cleanDebugItems();
                // camera.lookAt(cube.position);
            }
        }
    }
    renderer.render(scene, camera);
    then = now;
    requestAnimationFrame(FixedUpdate);
}
FixedUpdate();
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
    debug_items.push(ngeo);
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
    debug_items.push(ngeo);
}
function cleanDebugItems() {
    debug_items.forEach((geo) => {
        geo.dispose();
    });
}
//animate();
//# sourceMappingURL=app.js.map
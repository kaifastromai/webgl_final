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
groundBody.quaternion.setFromEuler(-Math.PI / 3, 0, 0);
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
//Geo
var geo = new THREE.BoxGeometry();
var mat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geo, mat);
var plane_geo = new THREE.PlaneBufferGeometry(10, 10);
var plane_mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
var plane_mesh = new THREE.Mesh(plane_geo, plane_mat);
var point_geo = new THREE.Geometry().setFromPoints([new THREE.Vector3(0, 0, 0)]);
var point_mat = new THREE.PointsMaterial({ color: 0xFF0000, size: 7 });
var point_mesh = new THREE.Points(point_geo, point_mat);
cube.position.set(0, 0, 0);
plane_mesh.position.fromArray(groundBody.position.toArray());
plane_mesh.quaternion.fromArray(groundBody.quaternion.toArray());
camera.position.set(2, 2, 2);
camera.lookAt(new three_1.Vector3(0, 0, 0));
scene.add(amb_light);
scene.add(cube);
scene.add(point_light);
scene.add(plane_mesh);
var then = 0;
(function animate(now = 0) {
    cube.rotateY(2 * Math.PI / 240);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (then != 0) {
        var dt = (now - then) / 1000;
        world.step(fixedTimeStep, dt, maxSubSteps);
        cube.quaternion.set(boxBody.quaternion.x, boxBody.quaternion.y, boxBody.quaternion.z, boxBody.quaternion.w);
        cube.position.set(boxBody.position.x, boxBody.position.y, boxBody.position.z);
        camera.lookAt(cube.position);
    }
    then = now;
})();
//# sourceMappingURL=app.js.map
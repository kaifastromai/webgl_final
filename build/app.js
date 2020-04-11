"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const three_1 = require("three");
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
var point_geo = new THREE.Geometry().setFromPoints([new THREE.Vector3(0, 0, 0)]);
var point_mat = new THREE.PointsMaterial({ color: 0xFF0000, size: 7 });
var point_mesh = new THREE.Points(point_geo, point_mat);
cube.position.set(0, 0, 0);
camera.position.set(2, 2, 2);
camera.lookAt(new three_1.Vector3(0, 0, 0));
scene.add(amb_light);
scene.add(cube);
scene.add(point_light);
(function animate() {
    cube.rotateY(2 * Math.PI / 240);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
})();
//# sourceMappingURL=app.js.map
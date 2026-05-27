import * as THREE from 'three';

import init from './init';

import './style.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const { sizes, camera, scene, canvas, controls, renderer } = init();

camera.position.set(10, 5, 0)

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: 'gray',
		metalness:0,
		roughness: 0.5,
	})
);

floor.receiveShadow = true;
floor.rotation.x = -Math.PI  * 0.5;

scene.add(floor);
const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
light.position.set(0,50,0)
scene.add( light );


const loader = new GLTFLoader();

loader.load('/models/avacado/Avocado.gltf',
	(gltf)=>{
		console.log('succses');
		console.log(gltf);
		const avacadoModel = gltf.scene.children[0];
		avacadoModel.scale.set(50,50,50);
		avacadoModel.position.set(0,2,0);
		avacadoModel.rotation.y = 180;
		scene.add(gltf.scene.children[0]);
	});

loader.load('/models/fox/Fox.gltf',
	(gltf)=>{
		console.log('succses');
		console.log(gltf);
		const foxModel = gltf.scene.children[0];
		foxModel.scale.set(0.05,0.05,0.05);
		foxModel.position.set(2,0,0);
		foxModel.rotation.y = 0;
		scene.add(gltf.scene);
	});

let mixer = null;

loader.load('/models/man/CesiumMan.gltf',
	(gltf)=>{
		console.log('succses');


		//получаем анимацию 
		mixer = new THREE.AnimationMixer(gltf.scene);
		const action = mixer.clipAction(gltf.animations[0]);
		//запускаем анимацию
		action.play();
		console.log(gltf);
		const manModel = gltf.scene;
		manModel.scale.set(5,5,5);
		manModel.position.set(-3,0,0);
		manModel.rotation.y = 0;
		scene.add(gltf.scene);
	});


// (progress)=>{
	// 	console.log('progress');
	// 	console.log(progress);
	// },
	// (error)=>{
	// 	console.log('error');
	// 	console.log(error);
	// }

const clock = new THREE.Clock();


const tick = () => {
	const delta = clock.getDelta();
	controls.update();
	renderer.render(scene, camera);
	//Зобновляем анимацию
	if(mixer){
		mixer.update(delta);
	}
	window.requestAnimationFrame(tick);
};
tick();

/** Базовые обпаботчики событий длы поддержки ресайза */
window.addEventListener('resize', () => {
	// Обновляем размеры
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Обновляем соотношение сторон камеры
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Обновляем renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

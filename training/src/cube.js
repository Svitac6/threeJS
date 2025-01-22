// Importation de la bibliothèque principale Three.js
import * as THREE from 'three';

// Importation du module OrbitControls pour permettre le contrôle de la caméra via la souris
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Initialisation de la scène, de la caméra, et du renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight,0.5, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Dimensions des sous-cubes
const cubeSize = 1; // Taille d'un sous-cube
const spacing = 0.1; // Espacement entre les sous-cubes
const mainGroup = new THREE.Group(); // Groupe principal contenant tous les cubes
scene.add(mainGroup); // Ajouter le groupe principal à la scène

// Création des 27 sous-cubes du Rubik's Cube
const cubes = []; // Liste pour stocker les sous-cubes
for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            // Créer une géométrie et des matériaux pour chaque face
            const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const materials = [
                new THREE.MeshBasicMaterial({ color: x === 1 ? 0xff0000 : 0x000000 }), // Face droite (rouge)
                new THREE.MeshBasicMaterial({ color: x === -1 ? 0x0000ff : 0x000000 }), // Face gauche (bleu)
                new THREE.MeshBasicMaterial({ color: y === 1 ? 0x00ff00 : 0x000000 }), // Face haut (vert)
                new THREE.MeshBasicMaterial({ color: y === -1 ? 0xffff00 : 0x000000 }), // Face bas (jaune)
                new THREE.MeshBasicMaterial({ color: z === 1 ? 0xffffff : 0x000000 }), // Face avant (blanc)
                new THREE.MeshBasicMaterial({ color: z === -1 ? 0xffa500 : 0x000000 }), // Face arrière (orange)
            ];

            const cube = new THREE.Mesh(geometry, materials);

            // Positionnement du cube
            cube.position.set(
                x * (cubeSize + spacing),
                y * (cubeSize + spacing),
                z * (cubeSize + spacing)
            );

            cubes.push(cube); // Ajouter le cube à la liste
            mainGroup.add(cube); // Ajouter le cube au groupe principal
        }
    }
}

// Positionner la caméra pour qu'elle voie le Rubik's Cube
camera.position.z = 6;

// Fonction pour grouper les cubes d'une tranche
function getCubesInSlice(axis, value) {
    return cubes.filter((cube) => Math.abs(cube.position[axis] - value) < 0.01);
}
const controls = new OrbitControls(camera, renderer.domElement);

// Variables pour les rotations automatiques
let lastRotationTime = 0;
const rotationInterval = 2000; // Temps entre les rotations (en millisecondes)

// Fonction d'animation principale
function animate() {
    requestAnimationFrame(animate);

    // Rotation globale du Rubik's Cube
    mainGroup.rotation.y += 0.01; // Rotation autour de l'axe Y
    mainGroup.rotation.x += 0.005; // Rotation autour de l'axe X

    // Gérer les rotations automatiques des tranches
    const currentTime = performance.now();
    if (currentTime - lastRotationTime > rotationInterval) {
        lastRotationTime = currentTime;

        // Effectuer une rotation aléatoire d'une tranche
        const axes = ['x', 'y', 'z']; // Axes possibles
        const axis = axes[Math.floor(Math.random() * axes.length)]; // Choisir un axe aléatoire
        const value = [-1, 0, 1][Math.floor(Math.random() * 3)]; // Choisir une tranche aléatoire
        const angle = Math.PI / 2; // Angle de 90 degrés
        const duration = 1000; // Durée de l'animation (en millisecondes)

        //rotateSlice(axis, value, angle, duration);
    }
    controls.update();

    renderer.render(scene, camera); // Rendu de la scène
}

animate(); // Lancer l'animation de la scène

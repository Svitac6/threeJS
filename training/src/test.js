// Importation de la bibliothèque principale Three.js
import * as THREE from 'three';

// Importation du module OrbitControls pour permettre le contrôle de la caméra via la souris
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Création de la scène principale, qui contient tous les objets, la caméra et les lumières
const scene = new THREE.Scene();

// Création d'une caméra en perspective
// - 75 : champ de vision vertical en degrés
// - window.innerWidth / window.innerHeight : ratio d'aspect pour éviter les distorsions
// - 0.1 : distance minimale visible (clipping plan)
// - 1000 : distance maximale visible (clipping plan)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Positionnement initial de la caméra pour qu'elle soit un peu éloignée des objets
camera.position.z = 5;

// Création du moteur de rendu qui dessine la scène dans un élément <canvas>
const renderer = new THREE.WebGLRenderer();

// Définition de la taille du canvas à celle de la fenêtre
renderer.setSize(window.innerWidth, window.innerHeight);

// Ajout du canvas généré par le moteur de rendu dans le DOM
document.body.appendChild(renderer.domElement);

// Création d'une géométrie simple : un cube
const geometry = new THREE.BoxGeometry();

// Création d'un matériau standard, qui réagit à la lumière
// - color : couleur verte pour le cube
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// Création d'un maillage (objet 3D) en combinant la géométrie et le matériau
const cube = new THREE.Mesh(geometry, material);

// Ajout du cube à la scène
scene.add(cube);

// Ajout d'une lumière ambiante
// - 0xffffff : couleur blanche
// - 0.5 : intensité de la lumière
// Cette lumière éclaire toute la scène de manière uniforme et adoucit les ombres
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

// Ajout d'une lumière ponctuelle (pointLight), qui émet depuis un point dans toutes les directions
// - 0xffffff : couleur blanche
// - 1 : intensité de la lumière
// - 100 : distance maximale d'éclairage
const pointLight = new THREE.PointLight(0xffffff, 1, 100);

// Positionnement de la lumière ponctuelle à un endroit spécifique dans l'espace
pointLight.position.set(10, 10, 10);

// Ajout de la lumière ponctuelle à la scène
scene.add(pointLight);

// Création des contrôles pour la caméra, permettant de la déplacer avec la souris
// - camera : la caméra à contrôler
// - renderer.domElement : l'élément HTML sur lequel les événements de la souris seront capturés
const controls = new OrbitControls(camera, renderer.domElement);

// Fonction d'animation, appelée à chaque frame
function animate() {
  // Demande au navigateur d'appeler cette fonction à chaque rafraîchissement de l'écran
  requestAnimationFrame(animate);

  // Rotation du cube à chaque frame
  cube.rotation.x += 0.01; // Rotation autour de l'axe X
  cube.rotation.y += 0.01; // Rotation autour de l'axe Y

  // Mise à jour des contrôles de la caméra (nécessaire pour OrbitControls)
  controls.update();

  // Rendu de la scène à partir de la caméra
  renderer.render(scene, camera);
}

// Appel initial de la fonction d'animation
animate();

// Ajout d'un écouteur d'événement pour redimensionner le canvas si la fenêtre change de taille
window.addEventListener('resize', () => {
  // Mise à jour de l'aspect de la caméra pour correspondre aux nouvelles dimensions de la fenêtre
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // Nécessaire après toute modification de l'aspect

  // Redimensionnement du moteur de rendu
  renderer.setSize(window.innerWidth, window.innerHeight);
});

import * as THREE from 'three';

// Initialisation de la scène, de la caméra, et du renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

// Fonction pour effectuer une rotation sur une tranche
function rotateSlice(axis, value, angle, duration) {
    const sliceGroup = new THREE.Group(); // Groupe temporaire pour la tranche

    // Obtenir les cubes de la tranche
    const sliceCubes = getCubesInSlice(axis, value);

    // Ajouter les cubes de la tranche au groupe temporaire
    sliceCubes.forEach((cube) => {
        mainGroup.remove(cube); // Retirer du groupe principal
        sliceGroup.add(cube); // Ajouter au groupe temporaire
    });

    // Ajouter le groupe temporaire à la scène
    scene.add(sliceGroup);

    // Animation de la rotation
    const startTime = performance.now();

    function animateRotation() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1); // Normaliser le temps entre 0 et 1

        sliceGroup.rotation[axis] = t * angle; // Appliquer une rotation proportionnelle au temps

        if (t < 1) {
            requestAnimationFrame(animateRotation); // Continuer l'animation
        } else {
            // Une fois la rotation terminée, réintégrer les cubes dans le groupe principal
            sliceCubes.forEach((cube) => {
                sliceGroup.remove(cube); // Retirer du groupe temporaire
                mainGroup.add(cube); // Réintégrer dans le groupe principal
            });
            scene.remove(sliceGroup); // Supprimer le groupe temporaire
        }
    }

    animateRotation(); // Lancer l'animation
}

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

        rotateSlice(axis, value, angle, duration);
    }

    renderer.render(scene, camera); // Rendu de la scène
}

animate(); // Lancer l'animation de la scène

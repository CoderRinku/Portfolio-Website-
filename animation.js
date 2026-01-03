// Three.js Animation (Global THREE variable)

// Setup
const heroSection = document.getElementById('hero');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// Add canvas to hero section
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '-1';
heroSection.insertBefore(renderer.domElement, heroSection.firstChild);

// Objects (Neural Network / Nodes)
const geometry = new THREE.BufferGeometry();
const particlesCount = 70;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    // Spread particles across the hero section width
    posArray[i] = (Math.random() - 0.5) * 15; // X
    if (i % 3 === 1) posArray[i] = (Math.random() - 0.5) * 10; // Y
    if (i % 3 === 2) posArray[i] = (Math.random() - 0.5) * 10; // Z
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material
const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x009688, // Teal accent
    transparent: true,
    opacity: 0.8,
});

// Mesh
const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

// Lines connecting particles
const linesMaterial = new THREE.LineBasicMaterial({
    color: 0x009688,
    transparent: true,
    opacity: 0.15
});

// We'll create lines dynamically or use a predefined wired frame. 
// For a "Network" effect, let's use a simpler approach: A rotating wireframe sphere or icosahedron
const networkGeometry = new THREE.IcosahedronGeometry(6, 1);
const networkMaterial = new THREE.MeshBasicMaterial({
    color: 0x009688,
    wireframe: true,
    transparent: true,
    opacity: 0.08
});
const networkMesh = new THREE.Mesh(networkGeometry, networkMaterial);
scene.add(networkMesh);


// Camera Position
camera.position.z = 5;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate the network slowly
    networkMesh.rotation.y = elapsedTime * 0.05;
    networkMesh.rotation.x = elapsedTime * 0.03;

    // Particles gentle movement
    particlesMesh.rotation.y = -elapsedTime * 0.02;
    particlesMesh.rotation.x = mouseY * 0.5;
    particlesMesh.rotation.y += mouseX * 0.5;

    // Gentle parallax
    networkMesh.rotation.y += mouseX * 0.1;
    networkMesh.rotation.x += mouseY * 0.1;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

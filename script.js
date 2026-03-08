let scene, camera, renderer, particles;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < 3000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        vertices.push(x, y, z);

        const color = new THREE.Color();
        const hue = 0.6 + Math.random() * 0.3;
        color.setHSL(hue, 0.8, 0.5 + Math.random() * 0.3);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const centerGeometry = new THREE.SphereGeometry(2, 32, 32);
    const centerMaterial = new THREE.MeshBasicMaterial({
        color: 0x667eea,
        transparent: true,
        opacity: 0.3
    });
    const centerSphere = new THREE.Mesh(centerGeometry, centerMaterial);
    scene.add(centerSphere);

    const ringGeometry = new THREE.TorusGeometry(5, 0.2, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x764ba2,
        transparent: true,
        opacity: 0.2
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = Date.now() * 0.0005;
    scene.add(ring);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (particles) {
        particles.rotation.y += 0.0002;
        particles.rotation.x += 0.0001;
    }

    camera.position.x = Math.sin(Date.now() * 0.0005) * 10;
    camera.position.y = Math.sin(Date.now() * 0.0003) * 5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('DOMContentLoaded', () => {
    init();
    
    const pcMode = document.getElementById('pcMode');
    const mobileMode = document.getElementById('mobileMode');
    const pcInterfaces = document.querySelectorAll('.pc-interface');
    const mobileInterfaces = document.querySelectorAll('.mobile-interface');
    
    function setInterface(mode) {
        if (mode === 'pc') {
            pcInterfaces.forEach(el => el.classList.remove('hidden'));
            mobileInterfaces.forEach(el => el.classList.add('hidden'));
            pcMode.classList.add('active');
            mobileMode.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else {
            pcInterfaces.forEach(el => el.classList.add('hidden'));
            mobileInterfaces.forEach(el => el.classList.remove('hidden'));
            mobileMode.classList.add('active');
            pcMode.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    pcMode.addEventListener('click', () => setInterface('pc'));
    mobileMode.addEventListener('click', () => setInterface('mobile'));
    
    if (window.innerWidth <= 768) {
        setInterface('mobile');
    }
});

const mouseMove = (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    if (particles) {
        particles.rotation.y += mouseX * 0.0005;
        particles.rotation.x += mouseY * 0.0005;
    }
};

document.addEventListener('mousemove', mouseMove);

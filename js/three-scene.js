/* ============================================================
   THREE.JS HERO SCENE — Neural network wireframe mesh
   ============================================================ */

(function () {
  'use strict';

  // Wait for Three.js to load
  function init() {
    if (typeof THREE === 'undefined') {
      setTimeout(init, 50);
      return;
    }

    const canvas  = document.getElementById('hero-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 3.5;

    // ── Neural-net node geometry ──────────────────────────────
    const NODE_COUNT  = 80;
    const EDGE_THRESH = 1.4; // max dist to draw an edge

    // Random points on a sphere
    const positions = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.2 + Math.random() * 0.5;
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }

    // Nodes (points)
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x00FFD1,
      size: 0.045,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodes);

    // Edges
    const edgeVerts = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const ax = positions[i*3], ay = positions[i*3+1], az = positions[i*3+2];
        const bx = positions[j*3], by = positions[j*3+1], bz = positions[j*3+2];
        const dist = Math.sqrt((ax-bx)**2 + (ay-by)**2 + (az-bz)**2);
        if (dist < EDGE_THRESH) {
          edgeVerts.push(ax, ay, az, bx, by, bz);
        }
      }
    }

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgeVerts, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x00FFD1,
      transparent: true,
      opacity: 0.15,
    });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(edges);

    // Inner glow sphere
    const glowGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00FFD1,
      transparent: true,
      opacity: 0.03,
      wireframe: false,
    });
    scene.add(new THREE.Mesh(glowGeo, glowMat));

    // ── Mouse influence ───────────────────────────────────────
    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;

    window.addEventListener('mousemove', (e) => {
      targetRY = ((e.clientX / window.innerWidth)  - 0.5) * 1.2;
      targetRX = ((e.clientY / window.innerHeight) - 0.5) * -0.8;
    });

    // ── Resize ────────────────────────────────────────────────
    function resize() {
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Animate ───────────────────────────────────────────────
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.004;

      // Lerp rotation toward mouse
      currentRX += (targetRX - currentRX) * 0.05;
      currentRY += (targetRY - currentRY) * 0.05;

      // Auto slow rotation + mouse influence
      nodes.rotation.y = t * 0.3 + currentRY;
      nodes.rotation.x = Math.sin(t * 0.2) * 0.15 + currentRX;
      edges.rotation.y = nodes.rotation.y;
      edges.rotation.x = nodes.rotation.x;

      // Pulse opacity
      edgeMat.opacity = 0.12 + Math.sin(t * 2) * 0.04;
      nodeMat.opacity = 0.85 + Math.sin(t * 3) * 0.1;

      renderer.render(scene, camera);
    }
    animate();
  }

  // Reduced motion — skip Three.js
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const canvas = document.getElementById('hero-canvas');
    if (canvas) canvas.style.display = 'none';
    return;
  }

  init();
})();

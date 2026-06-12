/* ============================================================
   SKILLS ORBIT — Solar-system canvas animation
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const panel  = document.getElementById('panel-detail');
  const dflt   = document.getElementById('panel-default');
  const pIcon  = document.getElementById('panel-icon');
  const pName  = document.getElementById('panel-name');
  const pFill  = document.getElementById('panel-bar-fill');
  const pPct   = document.getElementById('panel-pct');
  const pYears = document.getElementById('panel-years');
  const pUsed  = document.getElementById('panel-used-in');

  // ── Skill data ─────────────────────────────────────────────
  const CENTER = {
    name: 'Python', icon: '🐍', color: '#00FFD1',
    proficiency: 95, years: '4 years',
    usedIn: 'Every project',
    category: 'core',
  };

  const ORBITS = [
    // orbit 1 — closest, 4 nodes
    {
      radius: 110,
      speed: 0.25,
      nodes: [
        { name: 'PyTorch',     icon: '🔥', color: '#EE4C2C', proficiency: 90, years: '3 years', usedIn: '8 projects', category: 'ml'    },
        { name: 'TensorFlow',  icon: '🧮', color: '#FF6F00', proficiency: 80, years: '2 years', usedIn: '4 projects', category: 'ml'    },
        { name: 'NumPy',       icon: '🔢', color: '#4DABCF', proficiency: 93, years: '4 years', usedIn: '12 projects', category: 'core'  },
        { name: 'Pandas',      icon: '🐼', color: '#150458', proficiency: 88, years: '3 years', usedIn: '10 projects', category: 'core'  },
      ],
    },
    // orbit 2 — mid, 5 nodes
    {
      radius: 180,
      speed: 0.15,
      nodes: [
        { name: 'HuggingFace', icon: '🤗', color: '#FFD21E', proficiency: 88, years: '2 years', usedIn: '6 projects', category: 'ml'    },
        { name: 'scikit-learn',icon: '🌱', color: '#F7931E', proficiency: 85, years: '3 years', usedIn: '7 projects', category: 'ml'    },
        { name: 'FastAPI',     icon: '⚡', color: '#05998B', proficiency: 82, years: '2 years', usedIn: '5 projects', category: 'tools' },
        { name: 'Docker',      icon: '🐳', color: '#2496ED', proficiency: 75, years: '2 years', usedIn: '6 projects', category: 'tools' },
        { name: 'LangChain',   icon: '🔗', color: '#00D4AA', proficiency: 80, years: '1 year',  usedIn: '3 projects', category: 'ml'    },
      ],
    },
    // orbit 3 — outer, 6 nodes
    {
      radius: 255,
      speed: 0.09,
      nodes: [
        { name: 'GCP',         icon: '☁️', color: '#4285F4', proficiency: 72, years: '2 years', usedIn: '4 projects', category: 'cloud' },
        { name: 'Kubernetes',  icon: '⚙️', color: '#326CE5', proficiency: 65, years: '1 year',  usedIn: '2 projects', category: 'tools' },
        { name: 'PostgreSQL',  icon: '🐘', color: '#336791', proficiency: 78, years: '2 years', usedIn: '5 projects', category: 'tools' },
        { name: 'W&B',         icon: '📊', color: '#FFBE00', proficiency: 85, years: '2 years', usedIn: '6 projects', category: 'tools' },
        { name: 'ONNX',        icon: '📦', color: '#00AEEF', proficiency: 70, years: '1 year',  usedIn: '3 projects', category: 'tools' },
        { name: 'Redis',       icon: '🗃️', color: '#DC382D', proficiency: 68, years: '1 year',  usedIn: '2 projects', category: 'tools' },
      ],
    },
  ];

  const CATEGORY_COLORS = {
    core:  '#00FFD1',
    ml:    '#7B61FF',
    tools: '#FFA500',
    cloud: '#FF3264',
  };

  // Flatten all nodes with orbit info
  const allNodes = [];
  ORBITS.forEach(orbit => {
    orbit.nodes.forEach((node, i) => {
      allNodes.push({
        ...node,
        orbitRadius: orbit.radius,
        orbitSpeed:  orbit.speed,
        angleOffset: (i / orbit.nodes.length) * Math.PI * 2,
        currentAngle: (i / orbit.nodes.length) * Math.PI * 2,
      });
    });
  });

  // ── Canvas sizing ──────────────────────────────────────────
  let CX, CY, DPR;

  function resize() {
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth, 600);
    DPR = Math.min(window.devicePixelRatio, 2);
    canvas.width  = size * DPR;
    canvas.height = size * DPR;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';
    CX = canvas.width  / 2;
    CY = canvas.height / 2;
    ctx.scale(DPR, DPR);
  }
  resize();
  window.addEventListener('resize', () => { ctx.setTransform(1,0,0,1,0,0); resize(); });

  // ── Hit-test ───────────────────────────────────────────────
  let hoveredNode = null;
  let selectedNode = null;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx   = (e.clientX - rect.left) * DPR;
    const my   = (e.clientY - rect.top)  * DPR;

    hoveredNode = null;
    for (const node of allNodes) {
      const dx = node._drawX - mx;
      const dy = node._drawY - my;
      if (Math.sqrt(dx*dx + dy*dy) < 18 * DPR) {
        hoveredNode = node;
        break;
      }
    }
    // Check center
    const dcx = CX - mx, dcy = CY - my;
    if (Math.sqrt(dcx*dcx + dcy*dcy) < 26 * DPR) {
      hoveredNode = CENTER;
    }

    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  });

  canvas.addEventListener('click', () => {
    if (hoveredNode) {
      selectedNode = hoveredNode;
      showPanel(hoveredNode);
    }
  });

  canvas.addEventListener('mouseleave', () => { hoveredNode = null; });

  function showPanel(node) {
    if (!panel || !dflt) return;
    dflt.classList.add('hidden');
    panel.classList.remove('hidden');
    pIcon.textContent  = node.icon;
    pName.textContent  = node.name;
    pPct.textContent   = node.proficiency + '%';
    pYears.textContent = '⏱ ' + node.years + ' experience';
    pUsed.textContent  = '🚀 Used in: ' + node.usedIn;
    // Animate bar
    pFill.style.width = '0%';
    requestAnimationFrame(() => {
      pFill.style.width = node.proficiency + '%';
    });
  }

  // ── Draw ───────────────────────────────────────────────────
  let t = 0;

  function draw() {
    requestAnimationFrame(draw);
    t += 0.008;

    const W = canvas.width / DPR;
    const H = canvas.height / DPR;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;

    // ── Orbit rings ──
    ORBITS.forEach(orbit => {
      ctx.beginPath();
      ctx.arc(cx, cy, orbit.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // ── Nodes ──
    allNodes.forEach(node => {
      node.currentAngle = node.angleOffset + t * node.orbitSpeed;
      const x = cx + Math.cos(node.currentAngle) * node.orbitRadius;
      const y = cy + Math.sin(node.currentAngle) * node.orbitRadius;

      // Store for hit-test (in CSS pixel space)
      node._drawX = x * DPR;
      node._drawY = y * DPR;

      const isHovered  = hoveredNode === node;
      const isSelected = selectedNode === node;
      const catColor   = CATEGORY_COLORS[node.category] || '#fff';
      const r          = isHovered || isSelected ? 16 : 13;

      // Glow
      if (isHovered || isSelected) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
        grad.addColorStop(0, catColor + '55');
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = isHovered || isSelected ? catColor : 'rgba(10,10,15,0.95)';
      ctx.fill();
      ctx.strokeStyle = catColor;
      ctx.lineWidth = isHovered || isSelected ? 2 : 1.5;
      ctx.stroke();

      // Icon
      ctx.font = `${isHovered ? 13 : 11}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.icon, x, y);

      // Label
      if (isHovered || isSelected) {
        ctx.font = `bold 10px Inter, sans-serif`;
        ctx.fillStyle = catColor;
        ctx.fillText(node.name, x, y + r + 12);
      }
    });

    // ── Connection lines to hovered node ──
    if (hoveredNode && hoveredNode !== CENTER) {
      const hx = hoveredNode._drawX / DPR;
      const hy = hoveredNode._drawY / DPR;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(hx, hy);
      ctx.strokeStyle = CATEGORY_COLORS[hoveredNode.category] + '44';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ── Central Python node ──
    const pulse = 1 + Math.sin(t * 3) * 0.06;
    const cr    = 26 * pulse;
    const isCenter = hoveredNode === CENTER || selectedNode === CENTER;

    // Glow
    const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 3);
    cGrad.addColorStop(0, 'rgba(0,255,209,0.25)');
    cGrad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, cr * 3, 0, Math.PI * 2);
    ctx.fillStyle = cGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fillStyle = isCenter ? '#00FFD1' : 'rgba(0,255,209,0.15)';
    ctx.fill();
    ctx.strokeStyle = '#00FFD1';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '18px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐍', cx, cy);

    ctx.font = `bold 10px Inter, sans-serif`;
    ctx.fillStyle = '#00FFD1';
    ctx.fillText('Python', cx, cy + cr + 14);

    // Store center hit area
    CENTER._drawX = cx * DPR;
    CENTER._drawY = cy * DPR;
  }

  draw();
})();

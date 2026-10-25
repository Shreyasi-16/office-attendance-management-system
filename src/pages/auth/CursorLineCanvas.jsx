import React, { useEffect, useRef } from 'react';

/**
 * CursorLineCanvas
 * High-performance interactive canvas supporting multiple cursor-line visual effects:
 * - 'hex': Interactive Hexagonal Grid Scanner & Laser Tracer (matches the background)
 * - 'ribbon': Neon Fluid Silk Trail (flowing multi-band luminous ribbon)
 * - 'circuit': Cyber Matrix & Angled Circuit Traces (high-tech PCB aesthetic)
 */
export default function CursorLineCanvas({ mode = 'hex' }) {
  const canvasRef = useRef(null);
  const modeRef = useRef(mode);

  // Keep modeRef synchronized with prop
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates & state
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      vx: 0,
      vy: 0,
      isActive: false,
      lastMoveTime: 0
    };

    // Shared trail history
    const trail = [];
    const MAX_TRAIL = 40;

    // Active Hexagons trail for 'hex' mode
    const activeHexes = new Map(); // key -> { x, y, life, maxLife }
    const HEX_RADIUS = 38;
    const HEX_H = HEX_RADIUS * Math.sqrt(3);

    // Helper: draw regular hexagon
    const drawHexagon = (cx, cy, r, strokeStyle, fillStyle, lineWidth = 1.2) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const hx = cx + r * Math.cos(angle);
        const hy = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    };

    // Shared floating ambient nodes
    const NODE_COUNT = Math.min(Math.floor((width * height) / 20000), 55);
    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1.2
      });
    }

    // Circuit mode branches
    const circuitBranches = [];

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Mouse handlers
    const handleMouseMove = (e) => {
      const prevX = mouse.targetX;
      const prevY = mouse.targetY;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.vx = e.clientX - prevX;
      mouse.vy = e.clientY - prevY;
      mouse.isActive = true;
      mouse.lastMoveTime = Date.now();

      // Add to general trail
      trail.push({
        x: e.clientX,
        y: e.clientY,
        vx: mouse.vx,
        vy: mouse.vy,
        time: Date.now()
      });
      if (trail.length > MAX_TRAIL) {
        trail.shift();
      }

      // Add to Hex Grid cache if in 'hex' mode
      if (modeRef.current === 'hex') {
        const hexW = HEX_RADIUS * 1.5;
        const q = Math.round(e.clientX / hexW);
        const r = Math.round((e.clientY - (q % 2 ? HEX_H / 2 : 0)) / HEX_H);

        // Activate central and neighboring hexes
        const offsets = [
          [0, 0], [1, 0], [-1, 0], [0, 1], [0, -1],
          [1, -1], [-1, 1], [1, 1], [-1, -1]
        ];

        offsets.forEach(([dq, dr], idx) => {
          const nq = q + dq;
          const nr = r + dr;
          const key = `${nq},${nr}`;
          const hx = nq * hexW;
          const hy = nr * HEX_H + (nq % 2 ? HEX_H / 2 : 0);
          const dist = Math.hypot(e.clientX - hx, e.clientY - hy);

          if (dist < 180) {
            const initialLife = Math.max(0.2, 1 - dist / 220);
            activeHexes.set(key, {
              x: hx,
              y: hy,
              life: initialLife,
              maxLife: initialLife,
              isCenter: idx === 0
            });
          }
        });
      }

      // Add circuit branch if in 'circuit' mode
      if (modeRef.current === 'circuit' && Math.random() < 0.6) {
        const angle = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2][
          Math.floor(Math.random() * 7)
        ];
        const segLen = 25 + Math.random() * 45;
        circuitBranches.push({
          x1: e.clientX,
          y1: e.clientY,
          x2: e.clientX + Math.cos(angle) * segLen,
          y2: e.clientY + Math.sin(angle) * segLen,
          life: 1.0
        });
        if (circuitBranches.length > 50) {
          circuitBranches.shift();
        }
      }
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let frame = 0;

    // ==========================================
    // RENDER LOOP
    // ==========================================
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse position interpolation
      if (mouse.isActive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.35;
        mouse.y += (mouse.targetY - mouse.y) * 0.35;

        // Auto-fade mouse if idle
        if (Date.now() - mouse.lastMoveTime > 3000) {
          mouse.isActive = false;
        }
      }

      const currentMode = modeRef.current;

      // ------------------------------------------
      // 1. HEX GRID SCANNER EFFECT (DEFAULT)
      // ------------------------------------------
      if (currentMode === 'hex') {
        // Draw active lit hexagons
        activeHexes.forEach((hex, key) => {
          if (hex.life <= 0) {
            activeHexes.delete(key);
            return;
          }

          const alpha = hex.life * 0.7;
          const strokeColor = `rgba(2, 132, 199, ${alpha})`;
          const fillColor = hex.isCenter 
            ? `rgba(56, 189, 248, ${alpha * 0.18})` 
            : `rgba(2, 132, 199, ${alpha * 0.08})`;

          // Draw hexagon
          ctx.shadowColor = 'rgba(2, 132, 199, 0.45)';
          ctx.shadowBlur = 8 * hex.life;
          drawHexagon(hex.x, hex.y, HEX_RADIUS - 2, strokeColor, fillColor, 1.4);
          ctx.shadowBlur = 0;

          // Connecting laser line to cursor if cursor is active and near
          if (mouse.isActive && mouse.x > 0) {
            const dist = Math.hypot(mouse.x - hex.x, mouse.y - hex.y);
            if (dist < 170) {
              const laserAlpha = (1 - dist / 170) * hex.life * 0.75;
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(hex.x, hex.y);
              ctx.strokeStyle = `rgba(2, 132, 199, ${laserAlpha})`;
              ctx.lineWidth = 1 + (1 - dist / 170) * 1.5;
              ctx.stroke();

              // Vertex pulse dots
              ctx.beginPath();
              ctx.arc(hex.x, hex.y, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(56, 189, 248, ${laserAlpha + 0.2})`;
              ctx.fill();
            }
          }

          // Fade out hexagon
          hex.life -= 0.016;
        });

        // Rotating Holographic Hexagon Target around cursor
        if (mouse.isActive && mouse.x > 0) {
          const reticleRadius = 24 + Math.sin(frame * 0.06) * 3;
          ctx.save();
          ctx.translate(mouse.x, mouse.y);
          ctx.rotate(frame * 0.025);

          drawHexagon(0, 0, reticleRadius, 'rgba(2, 132, 199, 0.65)', null, 1.6);
          drawHexagon(0, 0, reticleRadius * 0.55, 'rgba(56, 189, 248, 0.45)', null, 1.0);

          ctx.restore();

          // Center glowing dot
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#0284C7';
          ctx.shadowColor = 'rgba(2, 132, 199, 0.8)';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // ------------------------------------------
      // 2. NEON FLUID SILK RIBBON EFFECT
      // ------------------------------------------
      else if (currentMode === 'ribbon') {
        if (trail.length > 2) {
          const bands = [
            { offset: 0, color: 'rgba(2, 132, 199, ', width: 3.5 },
            { offset: -7, color: 'rgba(56, 189, 248, ', width: 2.0 },
            { offset: 7, color: 'rgba(14, 165, 233, ', width: 2.0 },
            { offset: -14, color: 'rgba(6, 182, 212, ', width: 1.2 },
            { offset: 14, color: 'rgba(96, 165, 250, ', width: 1.2 }
          ];

          bands.forEach((band) => {
            ctx.beginPath();
            for (let i = 0; i < trail.length - 1; i++) {
              const p1 = trail[i];
              const p2 = trail[i + 1];

              // Normal vector perpendicular to trajectory
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const len = Math.hypot(dx, dy) || 1;
              const nx = -dy / len;
              const ny = dx / len;

              // Wave oscillation harmonic
              const wave = Math.sin(frame * 0.1 + i * 0.35) * (band.offset * 0.6);
              const bx = p1.x + nx * (band.offset + wave);
              const by = p1.y + ny * (band.offset + wave);

              if (i === 0) ctx.moveTo(bx, by);
              else {
                // Smooth quadratic curve through midpoints
                const midX = (bx + p2.x + nx * (band.offset + wave)) / 2;
                const midY = (by + p2.y + ny * (band.offset + wave)) / 2;
                ctx.quadraticCurveTo(bx, by, midX, midY);
              }
            }

            const alpha = 0.75;
            ctx.strokeStyle = `${band.color}${alpha})`;
            ctx.lineWidth = band.width;
            ctx.lineCap = 'round';
            ctx.shadowColor = band.color + '0.6)';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
          });

          // Head glow particle
          if (mouse.isActive && mouse.x > 0) {
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#0284C7';
            ctx.shadowColor = '#38BDF8';
            ctx.shadowBlur = 14;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        // Slowly trim trail
        if (trail.length > 0 && (!mouse.isActive || Date.now() - mouse.lastMoveTime > 300)) {
          trail.shift();
        }
      }

      // ------------------------------------------
      // 3. CYBER CIRCUIT TRACES & MATRIX NODES
      // ------------------------------------------
      else if (currentMode === 'circuit') {
        // Draw and age circuit branches
        for (let i = circuitBranches.length - 1; i >= 0; i--) {
          const branch = circuitBranches[i];
          const alpha = branch.life * 0.8;

          ctx.beginPath();
          ctx.moveTo(branch.x1, branch.y1);
          ctx.lineTo(branch.x2, branch.y2);
          ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
          ctx.lineWidth = 1.6;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
          ctx.shadowBlur = 6;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Solder joint terminal pad
          ctx.beginPath();
          ctx.arc(branch.x2, branch.y2, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.fill();

          branch.life -= 0.02;
          if (branch.life <= 0) {
            circuitBranches.splice(i, 1);
          }
        }

        // Crosshair laser grid intersecting at cursor
        if (mouse.isActive && mouse.x > 0) {
          const guideAlpha = 0.25;
          // Horizontal guide
          ctx.beginPath();
          ctx.moveTo(0, mouse.y);
          ctx.lineTo(width, mouse.y);
          ctx.strokeStyle = `rgba(2, 132, 199, ${guideAlpha})`;
          ctx.setLineDash([6, 6]);
          ctx.lineWidth = 1;
          ctx.stroke();

          // Vertical guide
          ctx.beginPath();
          ctx.moveTo(mouse.x, 0);
          ctx.lineTo(mouse.x, height);
          ctx.stroke();
          ctx.setLineDash([]); // Reset dash

          // Reticle square
          const sqSize = 14;
          ctx.strokeStyle = '#0284C7';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(mouse.x - sqSize, mouse.y - sqSize, sqSize * 2, sqSize * 2);

          // Center coordinate dot
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#0284C7';
          ctx.fill();
        }
      }

      // Shared ambient node motion for subtle background life
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(2, 132, 199, 0.22)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="login-cursor-canvas" />;
}

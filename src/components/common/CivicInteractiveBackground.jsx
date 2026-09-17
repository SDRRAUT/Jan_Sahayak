import React, { useEffect, useRef, useState } from 'react';

/**
 * CivicInteractiveBackground
 * High-performance HTML5 Canvas interactive civic infrastructure background.
 * Visualizes:
 * - Public Water distribution feeder nodes (DJB)
 * - Road transit corridors & intersections (PWD)
 * - Power & streetlight illumination pillars
 * - Live Citizen signal beacons & sensor telemetry
 * - Interactive cursor magnetic mesh with live asset identification pills
 */
export default function CivicInteractiveBackground({ className = '', style = {} }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Track mouse position relative to canvas
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170,
      active: false
    };

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initNodes();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
      setHoveredNode(null);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Civic asset definitions
    const ASSET_TYPES = [
      {
        type: 'water',
        label: 'Water Feeder Node (DJB)',
        code: 'DJB-VALVE',
        color: '#0284C7',
        glow: 'rgba(2, 132, 199, 0.35)',
        icon: '💧'
      },
      {
        type: 'signal',
        label: 'Citizen Signal Beacon',
        code: 'SIG-VERIFIED',
        color: '#10B981',
        glow: 'rgba(16, 185, 129, 0.40)',
        icon: '📡'
      },
      {
        type: 'road',
        label: 'Arterial Transit Corridor',
        code: 'PWD-ROAD',
        color: '#0E5E3A',
        glow: 'rgba(14, 94, 58, 0.35)',
        icon: '🛣️'
      },
      {
        type: 'power',
        label: 'Streetlight Feeder Pillar',
        code: 'ELEC-GRID',
        color: '#F59E0B',
        glow: 'rgba(245, 158, 11, 0.35)',
        icon: '💡'
      },
      {
        type: 'civic_hub',
        label: 'Ward Civic Intelligence Hub',
        code: 'WARD-HUB',
        color: '#4F46E5',
        glow: 'rgba(79, 70, 229, 0.40)',
        icon: '🏛️'
      }
    ];

    let nodes = [];
    let pulses = [];
    let packets = [];

    // Initialize nodes
    const initNodes = () => {
      nodes = [];
      const nodeCount = Math.max(24, Math.floor((width * height) / 28000));

      for (let i = 0; i < nodeCount; i++) {
        const asset = ASSET_TYPES[i % ASSET_TYPES.length];
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: 0,
          baseY: 0,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: asset.type === 'civic_hub' ? 5.5 : asset.type === 'signal' ? 4.8 : 3.8,
          asset,
          pulseTimer: Math.random() * Math.PI * 2,
          pulseSpeed: 0.025 + Math.random() * 0.02,
          identifier: `${asset.code}-${Math.floor(10 + Math.random() * 90)}`
        });
      }

      // Pre-seed packets traveling between nodes
      packets = [
        { fromIdx: 0, toIdx: 1, progress: 0.1, speed: 0.008, color: '#10B981' },
        { fromIdx: 2, toIdx: 3, progress: 0.5, speed: 0.006, color: '#0284C7' },
        { fromIdx: 4, toIdx: 5, progress: 0.8, speed: 0.007, color: '#4F46E5' }
      ];
    };

    initNodes();

    // Radar scan wave generator
    let radarPulseTimer = 0;

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background city-grid lines
      ctx.save();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 64;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Periodic Radar Wavefront (Simulates city-wide infrastructure scan)
      radarPulseTimer += 0.006;
      if (radarPulseTimer > 1) {
        radarPulseTimer = 0;
        // spawn pulse at center hub
        const hub = nodes.find(n => n.asset.type === 'civic_hub') || nodes[0];
        if (hub) {
          pulses.push({
            x: hub.x,
            y: hub.y,
            radius: 5,
            maxRadius: Math.min(width, height) * 0.65,
            alpha: 0.4
          });
        }
      }

      // Draw and update radar pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += 2.2;
        p.alpha = Math.max(0, 0.35 * (1 - p.radius / p.maxRadius));

        if (p.radius >= p.maxRadius || p.alpha <= 0.01) {
          pulses.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${p.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Connect nodes with utility corridor lines
      const maxConnectDist = 135;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const opacity = (1 - dist / maxConnectDist) * 0.16;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(14, 94, 58, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 4. Update and draw nodes + interactive mouse field
      let closestNodeToMouse = null;
      let minMouseDist = Infinity;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Drift motion
        n.x += n.vx;
        n.y += n.vy;

        // Bounce on boundaries
        if (n.x < 20 || n.x > width - 20) n.vx *= -1;
        if (n.y < 20 || n.y > height - 20) n.vy *= -1;

        // Interactive mouse magnetic pull & repulsion
        if (mouse.active) {
          const mdx = mouse.x - n.x;
          const mdy = mouse.y - n.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius) {
            // Draw interactive energy connection line to cursor
            const lineAlpha = (1 - mdist / mouse.radius) * 0.45;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.restore();

            // Gentle elastic pull towards cursor
            const force = (1 - mdist / mouse.radius) * 0.035;
            n.x += mdx * force;
            n.y += mdy * force;

            if (mdist < minMouseDist) {
              minMouseDist = mdist;
              closestNodeToMouse = n;
            }
          }
        }

        // Node pulsation
        n.pulseTimer += n.pulseSpeed;
        const pulseScale = 1 + Math.sin(n.pulseTimer) * 0.22;

        // Draw soft ambient halo
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 2.8 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = n.asset.glow;
        ctx.fill();

        // Draw node core
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.asset.color;
        ctx.fill();

        // White inner jewel
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();
      }

      // 5. Draw cursor indicator ring if active
      if (mouse.active) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 22, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(14, 94, 58, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0E5E3A';
        ctx.fill();
        ctx.restore();
      }

      // 6. Draw interactive hover pill for the closest civic node
      if (closestNodeToMouse && minMouseDist < 75) {
        const cn = closestNodeToMouse;
        const pillText = `${cn.asset.icon} ${cn.asset.label} • ${cn.identifier}`;
        
        ctx.save();
        ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
        const textMetrics = ctx.measureText(pillText);
        const pillWidth = textMetrics.width + 20;
        const pillHeight = 24;
        const pillX = Math.min(width - pillWidth - 10, Math.max(10, cn.x - pillWidth / 2));
        const pillY = cn.y - 34 > 10 ? cn.y - 34 : cn.y + 16;

        // Draw pill bubble
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 12);
        ctx.fill();

        // Border
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = cn.asset.color;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Text
        ctx.fillStyle = '#0F172A';
        ctx.fillText(pillText, pillX + 10, pillY + 16);
        ctx.restore();
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

  return (
    <div
      ref={containerRef}
      className={`civic-interactive-bg-wrapper ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        ...style
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  );
}

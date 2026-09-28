import React, { useEffect, useRef, useState, memo } from 'react';

interface Node3D {
  label: string;
  service: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  detail: string;
}

export interface MemoryCore3DProps {
  className?: string;
}

export const MemoryCore3D: React.FC<MemoryCore3DProps> = memo(({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    // Check for user's reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse parallax tracking
    let targetRotationX = 0.2;
    let targetRotationY = 0;
    let currentRotationX = 0.2;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / width - 0.5;
      const ny = (e.clientY - rect.top) / height - 0.5;
      targetRotationY = nx * 0.8;
      targetRotationX = 0.2 + ny * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Orbital Nodes representing Retained Experience Units in Hindsight
    const nodes: Node3D[] = [
      {
        label: 'INC-8041',
        service: 'PaymentService',
        x: -180,
        y: 40,
        z: 80,
        radius: 6,
        color: '#10b981',
        detail: 'HikariCP Pool Sizing',
      },
      {
        label: 'INC-9102',
        service: 'OrderService',
        x: 160,
        y: -50,
        z: -60,
        radius: 6,
        color: '#f59e0b',
        detail: '504 Precedent Matched',
      },
      {
        label: 'INC-7230',
        service: 'AuthService',
        x: -90,
        y: -130,
        z: -120,
        radius: 5,
        color: '#34d399',
        detail: 'JWT Token Rotation',
      },
      {
        label: 'INC-6541',
        service: 'API Gateway',
        x: 140,
        y: 110,
        z: 110,
        radius: 5,
        color: '#fbbf24',
        detail: 'Ingress Buffer Tuning',
      },
      {
        label: 'CLUSTER-DB',
        service: 'DatabaseCluster',
        x: 0,
        y: 160,
        z: -140,
        radius: 5,
        color: '#10b981',
        detail: '50 Connection Rule',
      },
    ];

    let angle = 0;
    let isTabVisible = true;

    const handleVisibility = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 3D Perspective Projection Function
    const fov = 420;
    const project = (x: number, y: number, z: number, cx: number, cy: number) => {
      // Rotate Y
      const cosY = Math.cos(currentRotationY + angle);
      const sinY = Math.sin(currentRotationY + angle);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // Rotate X
      const cosX = Math.cos(currentRotationX);
      const sinX = Math.sin(currentRotationX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const scale = fov / (fov + z2 + 250);
      return {
        px: cx + x1 * scale,
        py: cy + y2 * scale,
        scale,
        depth: z2,
      };
    };

    // Render loop
    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.48;

      // Smooth camera interpolation
      if (!prefersReducedMotion) {
        currentRotationX += (targetRotationX - currentRotationX) * 0.05;
        currentRotationY += (targetRotationY - currentRotationY) * 0.05;
        angle += 0.0035; // gentle slow rotation
      }

      // Draw faint background orbital ellipses
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, 210, 68, currentRotationY * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, cy, 270, 85, -0.4 + currentRotationY * 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.setLineDash([6, 8]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Project all nodes
      const projectedNodes = nodes.map((node) => {
        const p = project(node.x, node.y, node.z, cx, cy);
        return { ...node, ...p };
      });

      // Sort by depth (painter's algorithm)
      projectedNodes.sort((a, b) => a.depth - b.depth);

      // Draw lines connecting nodes to central Hindsight core
      projectedNodes.forEach((node) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(node.px, node.py);
        const grad = ctx.createLinearGradient(cx, cy, node.px, node.py);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0.15)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(0.8, node.scale * 1.4);
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Render Central Hindsight 3D Core Sphere
      const coreRadius = 38;
      // Ambient core glow
      const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 110);
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
      glowGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.12)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 110, 0, Math.PI * 2);
      ctx.fill();

      // Core 3D Dark Glass Sphere with Specular Highlight
      const sphereGrad = ctx.createRadialGradient(
        cx - coreRadius * 0.35,
        cy - coreRadius * 0.4,
        2,
        cx,
        cy,
        coreRadius
      );
      sphereGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      sphereGrad.addColorStop(0.2, 'rgba(16, 185, 129, 0.35)');
      sphereGrad.addColorStop(0.65, '#0b1319');
      sphereGrad.addColorStop(1, '#04070b');

      ctx.save();
      ctx.shadowColor = 'rgba(16, 185, 129, 0.45)';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.stroke();
      ctx.restore();

      // Inner Gold Memory Nucleus
      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw projected experience nodes
      projectedNodes.forEach((node) => {
        const r = Math.max(3.5, node.radius * node.scale);

        // Node Glow
        ctx.beginPath();
        ctx.arc(node.px, node.py, r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = node.color === '#10b981' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(245, 158, 11, 0.18)';
        ctx.fill();

        // Node Body
        ctx.beginPath();
        ctx.arc(node.px, node.py, r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label above node (responsive font size)
        const fontSize = Math.max(9, Math.round(11 * node.scale));
        ctx.font = `600 ${fontSize}px "Fira Code", monospace`;
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(node.label, node.px + r + 5, node.py - 2);

        ctx.font = `400 ${Math.max(8, fontSize - 2)}px system-ui, sans-serif`;
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(node.service, node.px + r + 5, node.py + fontSize - 1);
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full opacity-35" />
      {/* Background vignette fog */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#080a0f_85%)] pointer-events-none" />
    </div>
  );
});

MemoryCore3D.displayName = 'MemoryCore3D';

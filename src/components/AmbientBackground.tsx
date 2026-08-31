import { useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Full-page fixed backdrop: slow-moving gradient mesh, a spotlight that
// follows the cursor, and softly drifting embers. Pure CSS/SVG — no canvas,
// so it stays cheap even on low-end phones.
export function AmbientBackground() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Respect users who've asked for reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEnabled(!mq.matches);

    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my]);

  const embers = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 10 + Math.random() * 14,
        delay: Math.random() * -20,
        drift: (Math.random() - 0.5) * 80,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Slow-moving gradient mesh */}
      <div className="absolute inset-0 opacity-70">
        <div className="absolute -left-1/4 -top-1/4 h-[70vh] w-[70vh] rounded-full bg-orange-600/20 blur-[120px] animate-float-slow" />
        <div
          className="absolute -right-1/4 top-1/3 h-[60vh] w-[60vh] rounded-full bg-red-600/15 blur-[130px] animate-float-slow"
          style={{ animationDelay: '-3s', animationDuration: '9s' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[55vh] w-[55vh] rounded-full bg-amber-500/10 blur-[110px] animate-float-slow"
          style={{ animationDelay: '-5s', animationDuration: '11s' }}
        />
      </div>

      {/* Cursor-follow spotlight */}
      {enabled && (
        <motion.div
          className="absolute h-[420px] w-[420px] rounded-full opacity-[0.15]"
          style={{
            left: sx,
            top: sy,
            translateX: '-50%',
            translateY: '-50%',
            background: 'radial-gradient(circle, rgba(255,120,40,0.9), transparent 70%)',
          }}
        />
      )}

      {/* Drifting embers */}
      {enabled &&
        embers.map((e) => (
          <span
            key={e.id}
            className="absolute rounded-full bg-orange-400/70"
            style={{
              left: `${e.left}%`,
              bottom: '-10px',
              width: e.size,
              height: e.size,
              boxShadow: '0 0 6px 1px rgba(255,140,50,0.6)',
              animation: `ember-rise ${e.duration}s linear infinite`,
              animationDelay: `${e.delay}s`,
              // @ts-expect-error custom property used by keyframes
              '--drift': `${e.drift}px`,
            }}
          />
        ))}
    </div>
  );
}

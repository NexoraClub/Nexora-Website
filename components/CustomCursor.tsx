'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { setCursorMode, subscribeCursorMode, type CursorMode } from '@/hooks/useCursorMode';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';

let lastX = 0;
let lastY = 0;
let initialized = false;

const RING_SPRING = { stiffness: 220, damping: 20, mass: 0.6 };
const HOVER_SELECTOR = 'a, button, [role="button"], input, select, textarea, [data-cursor]';

export default function CustomCursor() {
  const pathname = usePathname();
  const hidden = useIsTouchDevice();
  const [hovering, setHovering] = useState(false);
  const [mode, setMode] = useState<CursorMode>('');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ringX = useSpring(mouseX, RING_SPRING);
  const ringY = useSpring(mouseY, RING_SPRING);

  useEffect(() => {
    if (hidden) return;

    if (!initialized) {
      lastX = window.innerWidth / 2;
      lastY = window.innerHeight / 2;
      initialized = true;
    }
    mouseX.set(lastX);
    mouseY.set(lastY);

    let rafId: number | null = null;
    const onMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      mouseX.set(lastX);
      mouseY.set(lastY);

      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const target = document.elementFromPoint(lastX, lastY);
        setHovering(!!target?.closest(HOVER_SELECTOR));

        const cursorEl = target?.closest<HTMLElement>('[data-cursor]');
        setCursorMode(cursorEl?.dataset.cursor ?? '');
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [hidden, mouseX, mouseY]);

  useEffect(() => subscribeCursorMode(setMode), []);

  useEffect(() => {
    queueMicrotask(() => {
      setHovering(false);
      setCursorMode('');
    });
  }, [pathname]);

  if (hidden) return null;

  return (
    <>
      {/* Center Dot Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999999]"
        style={{
          x: mouseX,
          y: mouseY,
          translate: '-50% -50%',
          width: 8,
          height: 8,
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
        animate={{ scale: hovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Spring Ring Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999998]"
        style={{
          x: ringX,
          y: ringY,
          translate: '-50% -50%',
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '2px solid var(--theme-accent, #00f0ff)',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
        animate={{
          scale: hovering ? 2.2 : 1,
          opacity: 0.85,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Action / Tooltip Badge (e.g., "Explore", "Recompile", "Play") */}
      <AnimatePresence>
        {mode && (
          <motion.div
            key={mode}
            className="fixed top-0 left-0 pointer-events-none z-[999999] whitespace-nowrap
              rounded-full border border-sky-400/40 bg-[#060913] px-2.5 py-1
              text-[11px] font-bold uppercase tracking-[0.15em] text-[#00f0ff] shadow-lg"
            style={{ x: mouseX, y: mouseY, translate: '16px 16px', willChange: 'transform' }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
          >
            {mode}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';

type Opts = { stiffness?: number; damping?: number; precision?: number };

export function useSpring(target: number, opts: Opts = {}): number {
  const { stiffness = 170, damping = 26, precision = 0.01 } = opts;
  const [value, setValue] = useState(target);
  const ref = useRef({ v: target, vel: 0, raf: 0, lastT: 0 });

  useEffect(() => {
    const state = ref.current;
    state.lastT = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - state.lastT) / 1000, 0.064);
      state.lastT = now;

      const dx = target - state.v;
      const acceleration = stiffness * dx - damping * state.vel;
      state.vel += acceleration * dt;
      state.v += state.vel * dt;

      const epsilon = Math.max(precision, Math.abs(target) * 0.0005);
      if (Math.abs(dx) < epsilon && Math.abs(state.vel) < epsilon) {
        state.v = target;
        state.vel = 0;
        setValue(target);
        return;
      }
      setValue(state.v);
      state.raf = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(state.raf);
  }, [target, stiffness, damping, precision]);

  return value;
}

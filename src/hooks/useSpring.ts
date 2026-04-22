import { useEffect, useRef, useState } from 'react';

type Opts = { stiffness?: number; damping?: number; precision?: number };

export function useSpring(target: number, opts: Opts = {}): number {
  const { stiffness = 170, damping = 22, precision = 0.01 } = opts;
  const [value, setValue] = useState(target);
  const ref = useRef({ v: target, vel: 0, raf: 0 });

  useEffect(() => {
    const state = ref.current;
    const tick = () => {
      const dx = target - state.v;
      state.vel += dx * stiffness * 0.001 - state.vel * damping * 0.001;
      state.v += state.vel;
      if (Math.abs(dx) < precision && Math.abs(state.vel) < precision) {
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

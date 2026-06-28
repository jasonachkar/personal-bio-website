'use client';

import { RefObject, useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function useStoryProgress(
  sectionRef: RefObject<HTMLElement | null>,
  visualRef: RefObject<HTMLDivElement | null>,
  steps: number,
) {
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(prefersReducedMotion ? 1 : 0);
  const [activeStep, setActiveStep] = useState(prefersReducedMotion ? steps - 1 : 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isNarrow = window.matchMedia('(max-width: 1023px)').matches;
    if (prefersReducedMotion || isNarrow) {
      setProgress(1);
      setActiveStep(steps - 1);
      return;
    }

    let trigger: { kill: () => void } | undefined;
    let cancelled = false;

    async function setup() {
      const [{ gsap }, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled || !sectionRef.current) return;

      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top+=72',
        end: 'bottom bottom',
        scrub: 0.5,
        pin: visualRef.current ?? false,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          const nextProgress = self.progress;
          setProgress(nextProgress);
          setActiveStep(Math.min(steps - 1, Math.floor(nextProgress * steps)));
        },
      });
    }

    setup();

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [prefersReducedMotion, sectionRef, steps, visualRef]);

  return { progress, activeStep };
}

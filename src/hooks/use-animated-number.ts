import * as React from "react";

const ANIMATION_DURATION = 300;

export function useAnimatedNumber(value: number) {
  const [displayedValue, setDisplayedValue] = React.useState(value);
  const currentValue = React.useRef(value);

  React.useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const startValue = currentValue.current;
    const startedAt = performance.now();
    let frameId: number | undefined;

    const updateValue = (nextValue: number) => {
      currentValue.current = nextValue;
      setDisplayedValue(nextValue);
    };

    const animate = (now: number) => {
      const progress = Math.min(Math.max((now - startedAt) / ANIMATION_DURATION, 0), 1);
      const eased = 1 - (1 - progress) ** 3;
      updateValue(
        progress === 1 ? value : startValue * (1 - eased) + value * eased,
      );
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    const onMotionChange = () => {
      if (reducedMotion.matches) {
        if (frameId !== undefined) cancelAnimationFrame(frameId);
        updateValue(value);
      }
    };

    reducedMotion.addEventListener("change", onMotionChange);
    if (reducedMotion.matches || startValue === value) {
      updateValue(value);
    } else {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      if (frameId !== undefined) cancelAnimationFrame(frameId);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, [value]);

  return displayedValue;
}

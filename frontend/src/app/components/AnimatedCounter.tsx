import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedCounter({
  end,
  suffix = "+",
  duration = 1800,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [showSuffix, setShowSuffix] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const startAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = easeOutCubic(progress);
        setCount(Math.round(eased * end));

        if (progress < 1) {
          requestAnimationFrame(tick);
          return;
        }

        setCount(end);
        setShowSuffix(true);
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [duration, end]);

  return (
    <span ref={ref} className={className}>
      {count}
      {showSuffix ? suffix : ""}
    </span>
  );
}

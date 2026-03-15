'use client';

import React, { useRef, useState, useEffect } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  duration?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if element is already in viewport (prevents flash for above-fold content)
    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight - 100 && rect.bottom > 100;

    if (inViewport) {
      setIsVisible(true);
    }

    // Batch with isMounted so React updates both in one render
    setIsMounted(true);

    if (!inViewport) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: '-100px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, []);

  const getTransform = (): string => {
    switch (direction) {
      case 'up': return 'translateY(50px)';
      case 'down': return 'translateY(-50px)';
      case 'left': return 'translateX(50px)';
      case 'right': return 'translateX(-50px)';
      case 'fade': return 'scale(0.95)';
      default: return 'translateY(50px)';
    }
  };

  // Before mount: content visible (SSR-safe, no hydration mismatch)
  // After mount + visible: content visible (animated in)
  // After mount + not visible: content hidden (will animate when scrolled into view)
  const showContent = !isMounted || isVisible;

  return (
    <div
      ref={ref}
      className={className}
      style={isMounted ? {
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'none' : getTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.25, 0.25, 0.25, 0.75) ${delay}s, transform ${duration}s cubic-bezier(0.25, 0.25, 0.25, 0.75) ${delay}s`,
      } : undefined}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

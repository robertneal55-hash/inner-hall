'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ThresholdTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export function ThresholdTransition({ isActive, onComplete }: ThresholdTransitionProps) {
  const [stage, setStage] = useState<'idle' | 'opening' | 'moving' | 'fading' | 'complete'>('idle');

  useEffect(() => {
    if (!isActive) {
      setStage('idle');
      return;
    }

    setStage('opening');

    const movingTimer = setTimeout(() => {
      setStage('moving');
    }, 2000);

    const fadingTimer = setTimeout(() => {
      setStage('fading');
    }, 3500);

    const completeTimer = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(movingTimer);
      clearTimeout(fadingTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, onComplete]);

  if (stage === 'idle') return null;

  return (
    <div
      className={`fixed inset-0 z-50 ${
        stage === 'fading' || stage === 'complete' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        transition: 'opacity 1500ms ease-out',
      }}
    >
      <div className="absolute inset-0 bg-black" />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: stage === 'moving' || stage === 'fading' ? 'scale(1.3)' : 'scale(1)',
          transition: 'transform 2000ms ease-in',
        }}
      >
        <div
          className="absolute inset-y-0 w-1/2"
          style={{
            left: 0,
            transform: stage === 'opening' || stage === 'moving' || stage === 'fading' ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 2000ms ease-in-out',
          }}
        >
          <div className="relative w-[200vw] h-full">
            <Image
              src="/door_entry.jpeg"
              alt=""
              fill
              className="object-cover"
              style={{ objectPosition: 'center' }}
              priority
            />
          </div>
        </div>

        <div
          className="absolute inset-y-0 w-1/2"
          style={{
            right: 0,
            transform: stage === 'opening' || stage === 'moving' || stage === 'fading' ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform 2000ms ease-in-out',
          }}
        >
          <div className="relative w-[200vw] h-full -ml-[100vw]">
            <Image
              src="/door_entry.jpeg"
              alt=""
              fill
              className="object-cover"
              style={{ objectPosition: 'center' }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';

interface DustProps {
  progress: number; // 0.0 to 4.0
}

interface Particle {
  id: number;
  left: number;
  offsetY: number;
  speed: number;
  size: number;
  rotate: number;
  color: string;
}

export default function BackgroundDust({ progress }: DustProps) {
  // Generate stable random debris flakes
  const particles = useMemo(() => {
    const list: Particle[] = [];
    const colors = [
      'bg-amber-800/40', // Soil brown
      'bg-[#bae6fd]/40', // Ice blue
      'bg-red-800/40',   // Cretaceous crimson
      'bg-emerald-800/40', // Jurassic warm green
      'bg-orange-600/40',  // Molten lava gold
      'bg-neutral-400/40'  // Ash grey
    ];

    for (let i = 0; i < 40; i++) {
      list.push({
        id: i,
        left: Math.random() * 100, // percentage
        offsetY: Math.random() * 100, // initial Y position percentage
        speed: 1.2 + Math.random() * 2.5, // movement multiplier
        size: 5 + Math.random() * 14, // size in px
        rotate: Math.random() * 360,
        color: colors[i % colors.length]
      });
    }
    return list;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((p) => {
        // Calculate dynamic relative Y based on the continuous depth progress
        // As the elevator goes down, particles drift UPWARD
        const progressShift = progress * 100 * p.speed;
        const currentY = (p.offsetY - progressShift) % 100;
        const adjustedY = currentY < 0 ? currentY + 100 : currentY;

        return (
          <div
            key={p.id}
            className={`absolute rounded-xs ${p.color}`}
            style={{
              left: `${p.left}%`,
              top: `${adjustedY}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: `rotate(${p.rotate + progress * 50}deg)`,
              transition: 'transform 0.1s linear',
              boxShadow: '1px 1px 3px rgba(0,0,0,0.15)'
            }}
          />
        );
      })}
    </div>
  );
}

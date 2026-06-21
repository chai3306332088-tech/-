/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { GeologicLayer, FossilItem } from '../types';
import { ArrowDown, HelpCircle, HardHat } from 'lucide-react';
import { soundSynth } from '../utils/audio';

interface LayerModernProps {
  layer: GeologicLayer;
  progress: number; // 0.0 to 1.0 (local progress within layer modern)
  onFossilClick: (fossil: FossilItem) => void;
}

export default function LayerModern({ layer, progress, onFossilClick }: LayerModernProps) {
  // progress goes from 0.0 (fully active) to 1.0 (scrolled past)
  // Split Earth animations:
  // The split opens as progress goes from 0.0 to 0.4
  const splitPercent = Math.min(progress / 0.45, 1); // 0 to 1
  const leftX = -splitPercent * 55; // translate percentage
  const rightX = splitPercent * 55; // translate percentage

  // Arrow pulse animations
  const handleArrowClick = () => {
    soundSynth.playClick();
    // Hint toward user to scroll down
  };

  const campItem = layer.fossils.find(f => f.id === 'modern-camp');
  const sonarItem = layer.fossils.find(f => f.id === 'modern-sonar');

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#7dd3fc] to-[#bae6fd] select-none text-white">
      {/* Decorative Sky Clouds */}
      <div className="absolute top-8 left-10 opacity-30 animate-pulse [animation-duration:8s]">
        <div className="w-24 h-8 bg-white rounded-full" />
        <div className="w-16 h-8 bg-white rounded-full -mt-4 ml-6" />
      </div>
      <div className="absolute top-16 right-16 opacity-45 animate-pulse [animation-duration:12s]">
        <div className="w-32 h-10 bg-white rounded-full" />
        <div className="w-20 h-10 bg-white rounded-full -mt-6 ml-8" />
      </div>

      {/* Main Title Banner (fades out as we scroll) */}
      <motion.div
        style={{ opacity: 1 - progress * 2.2, y: -progress * 80 }}
        className="w-full text-center pt-16 px-4 z-10"
      >
        <span className="text-xs font-mono font-black tracking-[0.3em] uppercase bg-emerald-900/10 text-emerald-900 px-3 py-1 rounded-full border border-emerald-900/20">
          交互科普动效 · 时间电梯
        </span>
        <h1 className="text-4xl md:text-5xl font-black mt-3 text-amber-950 drop-shadow-sm tracking-tighter">
          地层深潜：穿越恐龙时代
        </h1>
        <p className="text-xs text-amber-900/80 mt-2 max-w-sm md:max-w-md mx-auto font-medium leading-relaxed">
          向下缓慢滑动鼠标或拖拽手指，启动地壳时间梯，向下开凿百万年的演变大峡谷。
        </p>

        {/* Start Guide Indicator Arrow (Pulsing bounce with animated fissure) */}
        {progress < 0.15 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex flex-col items-center justify-center gap-1 cursor-pointer"
            onClick={handleArrowClick}
          >
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [0.3, 0.9, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="bg-amber-955/2 w-10 h-10 rounded-full flex items-center justify-center border-2 border-amber-900/20 shadow-md text-amber-900 bg-white"
            >
              <ArrowDown className="w-5 h-5" />
            </motion.div>
            <span className="text-[10px] font-mono tracking-widest text-amber-900/60 font-black uppercase">
              下滑开掘地表
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Modern Camp archaeology components at the top ground level */}
      <div className="relative w-full h-[50vh] flex items-end justify-center z-10">
        {/* Archaeology tent silhouette + click spot */}
        <motion.div
          style={{ 
            opacity: 1 - progress * 1.5,
            y: -progress * 40,
            scale: 1 - progress * 0.2
          }}
          className="absolute bottom-20 left-[15%] md:left-[22%] z-20 flex flex-col items-center"
        >
          {/* Tents Outline (Handmade papercut-like SVG) */}
          <svg className="w-24 h-16 fill-[#3f2115]/90 hover:fill-amber-900 transition-colors cursor-pointer" viewBox="0 0 100 60" onClick={() => campItem && onFossilClick(campItem)}>
            <polygon points="10,50 50,10 90,50" />
            <polygon points="10,50 30,50 50,25" fill="#583120" />
          </svg>
          <button
            onClick={() => {
              soundSynth.playClick();
              if (campItem) onFossilClick(campItem);
            }}
            className="mt-1 px-2.5 py-0.5 bg-emerald-800 text-stone-100 hover:bg-emerald-700 text-[10px] font-mono rounded-full font-bold shadow-sm border border-emerald-600/40 cursor-pointer flex items-center gap-1"
          >
            <HardHat className="w-3 h-3" />
            考古现场站
          </button>
        </motion.div>

        {/* Standing Geologists outline */}
        <motion.div
          style={{ opacity: 1 - progress * 1.8, y: -progress * 50 }}
          className="absolute bottom-20 right-[20%] md:right-[28%] z-20 flex flex-col items-center"
        >
          <svg className="w-12 h-16 fill-[#3f2115]/90" viewBox="0 0 60 100">
            {/* Simple silhouette of researcher holding tools */}
            <circle cx="30" cy="20" r="10" />
            <path d="M15,35 C15,35 20,30 30,30 C40,30 45,35 45,35 L40,80 L20,80 Z" />
            <line x1="15" y1="40" x2="3" y2="85" stroke="#3f2115" strokeWidth="4" />
          </svg>
          <span className="text-[10px] font-mono text-amber-950 font-bold bg-amber-100 px-1.5 py-0.5 rounded shadow">
            古生物科考员
          </span>
        </motion.div>
      </div>

      {/* SPLIT EARTH: Ground cardboard chunks */}
      <div className="absolute inset-x-0 bottom-0 h-[35vh] w-full z-20 pointer-events-none">
        
        {/* Underlayer Pit reveal (reveals deep ice elements underneath) */}
        <div className="absolute bottom-0 inset-x-0 h-full bg-[#1e293b]/70 border-t-4 border-amber-950" />

        {/* Left Cardboard Earth Block */}
        <motion.div
          animate={{ x: `${leftX}%` }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.1 }}
          className="absolute left-0 bottom-0 h-full w-[50%] bg-[#d2b48c] border-r border-[#855e42] relative pointer-events-auto"
          style={{
            clipPath: 'polygon(0% 0%, 100% 25%, 100% 100%, 0% 100%)',
            boxShadow: 'inset -8px 0px 10px rgba(0,0,0,0.3)',
          }}
        >
          {/* Surface Grass layer */}
          <div className="absolute top-0 inset-x-0 h-6 bg-emerald-600 border-b-4 border-emerald-800" style={{ clipPath: 'polygon(0% 0%, 100% 80%, 100% 100%, 0% 100%)' }} />
          
          {/* Earth root silhouettes */}
          <div className="absolute top-10 right-6 opacity-30 text-[#855e42]">
            <svg className="w-8 h-12 fill-current" viewBox="0 0 20 40">
              <path d="M10,0 Q18,15 12,30 T5,40" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M10,12 Q4,22 1,35" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </motion.div>

        {/* Right Cardboard Earth Block */}
        <motion.div
          animate={{ x: `${rightX}%` }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.1 }}
          className="absolute right-0 bottom-0 h-full w-[50%] bg-[#d2b48c] border-l border-[#855e42] relative pointer-events-auto"
          style={{
            clipPath: 'polygon(0% 25%, 100% 0%, 100% 100%, 0% 100%)',
            boxShadow: 'inset 8px 0px 10px rgba(0,0,0,0.3)',
          }}
        >
          {/* Surface Grass layer */}
          <div className="absolute top-0 inset-x-0 h-6 bg-emerald-600 border-b-4 border-emerald-800" style={{ clipPath: 'polygon(0% 80%, 100% 0%, 100% 100%, 0% 100%)' }} />

          {/* Subsurface Radar scanning equipment */}
          {sonarItem && (
            <div className="absolute top-10 left-12 z-30 scale-90">
              <button
                onClick={() => {
                  soundSynth.playClick();
                  onFossilClick(sonarItem);
                }}
                className="p-2 bg-amber-900 border border-amber-950/20 shadow-md rounded-md hover:bg-amber-800 flex flex-col items-center gap-0.5 cursor-pointer text-amber-50"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[9px] font-mono font-bold leading-none">透地雷达</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Fissure shadow overlap detailing */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-70">
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="w-1.5 h-20 bg-amber-950 shadow-[0_0_12px_rgba(120,53,4,0.6)]"
            style={{ 
              opacity: progress > 0.05 ? 0 : 1,
              transition: 'opacity 0.2s'
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GeologicLayer, FossilItem } from '../types';
import { soundSynth } from '../utils/audio';
import { Shield, Sparkles, Activity } from 'lucide-react';

interface LayerPrecambrianProps {
  layer: GeologicLayer;
  isActive: boolean;
  onFossilClick: (fossil: FossilItem) => void;
}

export default function LayerPrecambrian({ layer, isActive, onFossilClick }: LayerPrecambrianProps) {
  // Cell division stages: 'single', 'elongating', 'pinching', 'split_complete'
  const [mitosisState, setMitosisState] = useState<string>('single');
  const [showEdgeGlow, setShowEdgeGlow] = useState(false);

  const lucaItem = layer.fossils.find(f => f.id === 'luca');
  const bubbleItem = layer.fossils.find(f => f.id === 'primordial-soup');

  const handleLucaClick = () => {
    if (mitosisState !== 'single') return;

    soundSynth.playPrimordialHeartbeat();
    setMitosisState('elongating');
    setShowEdgeGlow(true);

    // Fade edge glow after 2 seconds
    setTimeout(() => setShowEdgeGlow(false), 2000);

    // Phase 1: Elongate nucleus (0.5s)
    setTimeout(() => {
      setMitosisState('pinching');
      soundSynth.playLavaBubble();
    }, 600);

    // Phase 2: Complete split into two daughter cells (1.2s)
    setTimeout(() => {
      setMitosisState('split_complete');
    }, 1200);

    // Phase 3: Trigger card popup modal at 1.5s
    setTimeout(() => {
      if (lucaItem) {
        onFossilClick(lucaItem);
      }
    }, 1600);

    // Phase 4: Reset back to single cell for infinite replay after 6 seconds
    setTimeout(() => {
      setMitosisState('single');
    }, 6500);
  };

  const handleBubbleClick = (item: FossilItem) => {
    soundSynth.playLavaBubble();
    setShowEdgeGlow(true);
    setTimeout(() => setShowEdgeGlow(false), 1200);
    onFossilClick(item);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#160606] select-none text-red-100 relative overflow-hidden">
      
      {/* MAGMA RIVER CONCRETE (Boiling background glowing cracks) */}
      <div className="absolute inset-x-0 bottom-0 top-[20%] opacity-20 pointer-events-none">
        <svg className="w-full h-full fill-current text-red-900/30" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Dynamic volcanic winding pathways */}
          <path d="M10,0 Q30,50 60,70 T90,100" fill="none" stroke="red" strokeWidth="8" strokeOpacity="0.4" />
          <path d="M80,0 Q60,30 20,60 T40,100" fill="none" stroke="orange" strokeWidth="4" strokeOpacity="0.3" />
        </svg>
      </div>

      {/* Primordial hot particles floating */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 550, x: Math.random() * 600, opacity: 0.1 }}
              animate={{ y: -50, opacity: [0.1, 0.4, 0.1] }}
              transition={{ repeat: Infinity, duration: 6 + Math.random() * 8, ease: 'linear' }}
              className="absolute w-3 h-3 rounded-full bg-orange-500/30 filter blur-xs"
              style={{ left: `${i * 9}%` }}
            />
          ))}
        </div>
      )}

      {/* EDGE GLOW GOLDEN AURA ON MITOSIS/BUBBLE TRIPPED */}
      <AnimatePresence>
        {showEdgeGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 border-[16px] border-amber-500/30 pointer-events-none shadow-[inset_0_0_80px_rgba(245,158,11,0.65)] z-40"
          />
        )}
      </AnimatePresence>

      {/* Layer metadata title */}
      <div className="absolute top-6 left-6 z-30 bg-red-950/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-900/20">
        <p className="text-[10px] font-mono tracking-widest uppercase font-bold text-orange-400">
          底层 · 深度 -3000米
        </p>
        <h2 className="text-lg font-black text-orange-100">
          前寒武纪底层 (地球诞生)
        </h2>
      </div>

      {/* Cavern margins */}
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-red-950 to-transparent opacity-85" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-red-950 to-transparent opacity-85" />

      {/* Microscopic Cell Mitosis Area */}
      <div className="w-full h-full flex flex-col items-center justify-center relative p-6 z-20">
        
        {/* Secondary Primordial Bubble Pop clicker */}
        {bubbleItem && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="absolute right-12 top-[24%] flex flex-col items-center"
          >
            <div
              onClick={() => handleBubbleClick(bubbleItem)}
              className="w-16 h-16 rounded-full bg-orange-900/40 border-2 border-orange-500/50 flex items-center justify-center shadow-lg hover:border-amber-400 cursor-pointer group hover:bg-orange-950/65"
            >
              {/* Organic Bubble nodes */}
              <div className="relative w-8 h-8">
                <span className="absolute inset-1 rounded-full border-2 border-orange-400/40 animate-ping" />
                <span className="absolute top-0 left-0 w-4 h-4 rounded-full bg-orange-400/30" />
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-amber-400/40 animate-pulse" />
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold bg-red-950/90 text-orange-400 px-2.0 py-0.5 rounded-full mt-2 border border-orange-900/30">
              太初原始汤气泡 🧪
            </span>
          </motion.div>
        )}

        {/* PRIMARY LUCA CELL MITOSIS CELL APPARATUS */}
        <div className="flex flex-col items-center relative">
          
          {/* Circular Microscopic Specimen Circle Frame */}
          <div className="relative w-56 h-56 rounded-full border-4 border-dashed border-red-500/20 bg-black/40 flex items-center justify-center shadow-inner z-10">
            
            {/* Ambient microscope glass grid overlay */}
            <div className="absolute inset-6 border border-white/5 rounded-full pointer-events-none" />
            
            {/* Mitosis Assembly */}
            <div 
              onClick={handleLucaClick}
              className="absolute inset-0 flex items-center justify-center cursor-pointer group"
              title="触碰点击：启动生物始祖分裂复制"
            >
              
              {/* CELL DYNAMICS VISUALS SIMULATING NUCLEAR DIVISION */}
              <AnimatePresence mode="popLayout">
                {mitosisState === 'single' && (
                  <motion.div
                    key="single"
                    className="w-20 h-20 rounded-full bg-orange-500/10 border-4 border-orange-400/70 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    {/* Pulsing Core Nucleus */}
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="w-7 h-7 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                    />
                  </motion.div>
                )}

                {mitosisState === 'elongating' && (
                  <motion.div
                    key="elongating"
                    animate={{ width: 110, height: 75 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-full bg-orange-500/15 border-4 border-orange-400/70 shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center relative"
                  >
                    {/* Elongated split nucleus */}
                    <motion.div
                      animate={{ width: 44, height: 20, borderRadius: '12px' }}
                      className="w-7 h-7 bg-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.7)]"
                    />
                  </motion.div>
                )}

                {mitosisState === 'pinching' && (
                  <motion.div
                    key="pinching"
                    animate={{ scale: [1, 0.95, 1] }}
                    className="w-28 h-18 flex items-center justify-between relative bg-orange-500/5"
                  >
                    {/* Left pinch node */}
                    <div className="w-12 h-12 rounded-full border-4 border-orange-400/80 bg-orange-500/10 flex items-center justify-center shadow-lg">
                      <div className="w-4 h-4 rounded-full bg-amber-400 shadow-sm" />
                    </div>
                    {/* Connection bridge thread */}
                    <div className="w-4 h-2 bg-orange-400/80 shrink-0" />
                    {/* Right pinch node */}
                    <div className="w-12 h-12 rounded-full border-4 border-orange-400/80 bg-orange-500/10 flex items-center justify-center shadow-lg">
                      <div className="w-4 h-4 rounded-full bg-amber-400 shadow-sm" />
                    </div>
                  </motion.div>
                )}

                {mitosisState === 'split_complete' && (
                  <motion.div
                    key="split_complete"
                    className="w-36 h-20 flex gap-4 items-center justify-center relative"
                  >
                    {/* Cell 1 */}
                    <motion.div
                      initial={{ scale: 0.1, x: -12 }}
                      animate={{ scale: 1, x: 0 }}
                      className="w-14 h-14 rounded-full bg-orange-500/15 border-4 border-orange-400/70 shadow-md flex items-center justify-center"
                    >
                      <div className="w-4 h-4 rounded-full bg-amber-400" />
                    </motion.div>
                    
                    {/* Cell 2 */}
                    <motion.div
                      initial={{ scale: 0.1, x: 12 }}
                      animate={{ scale: 1, x: 0 }}
                      className="w-14 h-14 rounded-full bg-orange-500/15 border-4 border-orange-400/70 shadow-md flex items-center justify-center"
                    >
                      <div className="w-4 h-4 rounded-full bg-amber-400" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Little mitosis touch reminder badge */}
            <div className="absolute -bottom-2 bg-orange-600 text-white border border-orange-400 rounded-full p-1 shadow z-20 hover:scale-110 active:scale-95">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
          </div>

          {/* Life heart details */}
          <div className="text-center px-4 max-w-sm mt-5 z-20">
            <h3 className="text-sm font-black text-orange-300 flex items-center justify-center gap-1.5">
              <span>LUCA 生物始祖始原细胞</span>
            </h3>
            <p className="text-xs text-orange-400/80 mt-1 leading-normal">
              {mitosisState === 'single' && '👈 触碰点击本生命之囊，启动地球史上最古老的细胞分裂机制。'}
              {mitosisState === 'elongating' && '🧬 氨基酸与核酸拉长，分裂信号传递中...'}
              {mitosisState === 'pinching' && '🌋 脂质外膜开始内凹合龙，生命一分为二！'}
              {mitosisState === 'split_complete' && '✨ 分裂成功！生而平等，地球生命圣火已经燃起。'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

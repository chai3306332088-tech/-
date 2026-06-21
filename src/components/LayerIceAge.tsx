/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GeologicLayer, FossilItem } from '../types';
import { soundSynth } from '../utils/audio';
import { Snowflake, RefreshCw, Star } from 'lucide-react';

interface LayerIceAgeProps {
  layer: GeologicLayer;
  isActive: boolean; // Is current screen active
  onFossilClick: (fossil: FossilItem) => void;
}

export default function LayerIceAge({ layer, isActive, onFossilClick }: LayerIceAgeProps) {
  // Skeleton printing stages
  // 0: Unassembled, 1: Legs, 2: Spine/Ribs, 3: Skull, 4: Giant Tusks, 5: Fully Complete glowing
  const [buildStage, setBuildStage] = useState(0);

  useEffect(() => {
    if (isActive) {
      // Trigger bone reconstruction stagger
      setBuildStage(0);
      const timers = [
        setTimeout(() => { setBuildStage(1); soundSynth.playIceCrack(); }, 400),
        setTimeout(() => { setBuildStage(2); soundSynth.playIceCrack(); }, 900),
        setTimeout(() => { setBuildStage(3); soundSynth.playIceCrack(); }, 1400),
        setTimeout(() => { setBuildStage(4); soundSynth.playIceCrack(); }, 1900),
        setTimeout(() => { setBuildStage(5); soundSynth.playIceCrack(); }, 2400),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setBuildStage(0);
    }
  }, [isActive]);

  const handleRebuild = () => {
    soundSynth.playClick();
    setBuildStage(0);
    const timers = [
      setTimeout(() => { setBuildStage(1); soundSynth.playIceCrack(); }, 200),
      setTimeout(() => { setBuildStage(2); soundSynth.playIceCrack(); }, 600),
      setTimeout(() => { setBuildStage(3); soundSynth.playIceCrack(); }, 1000),
      setTimeout(() => { setBuildStage(4); soundSynth.playIceCrack(); }, 1400),
      setTimeout(() => { setBuildStage(5); soundSynth.playIceCrack(); }, 1800),
    ];
    return () => timers.forEach(clearTimeout);
  };

  const mammothItem = layer.fossils.find(f => f.id === 'mammoth');
  const tigerItem = layer.fossils.find(f => f.id === 'sabertooth');

  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#bae6fd] to-[#38bdf8] select-none overflow-hidden relative text-sky-900">
      {/* Frozen Frosty Cracked background textures */}
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      
      {/* Decorative Floating Snowflakes */}
      <div className="absolute top-12 left-[10%] animate-spin [animation-duration:15s] opacity-25">
        <Snowflake className="w-10 h-10 text-white" />
      </div>
      <div className="absolute bottom-24 right-[12%] animate-pulse opacity-20">
        <Snowflake className="w-16 h-16 text-white animate-spin [animation-duration:25s]" />
      </div>

      {/* Layer Label Overlay */}
      <div className="absolute top-6 left-6 z-10 bg-sky-200/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30">
        <p className="text-[10px] font-mono tracking-widest uppercase font-bold text-sky-800">
          第二地层 · 深度 -50米
        </p>
        <h2 className="text-lg font-black text-sky-950">
          第四纪冰期 (更新世)
        </h2>
      </div>

      {/* Ice Cave Framing (剪纸进深感 - overlapping glaciers with inner shadows) */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-sky-400 to-transparent border-r-2 border-sky-300 opacity-65" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-sky-400 to-transparent border-l-2 border-sky-300 opacity-65" />

      {/* Main Interactive Work Area */}
      <div className="w-full h-full flex flex-col items-center justify-center px-6 relative z-10">
        
        {/* Saber-toothed cat skull fragment trigger */}
        {tigerItem && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="absolute right-12 top-[24%] z-20 flex flex-col items-center"
          >
            <div
              onClick={() => {
                soundSynth.playIceCrack();
                onFossilClick(tigerItem);
              }}
              className="w-16 h-16 rounded-full bg-sky-100/45 border-2 border-sky-200 bg-opacity-70 flex items-center justify-center shadow-lg hover:shadow-sky-300/40 cursor-pointer hover:border-sky-300 group"
            >
              {/* Tiger Skull Vector Illustration */}
              <svg className="w-10 h-10 fill-current text-sky-800 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 100 100">
                <path d="M20,40 C20,30 50,20 80,40 L80,70 L60,65 L50,45 L40,45 L35,70 Z" />
                <path d="M42,45 L44,85 C44,85 47,88 48,80 L50,45 Z" fill="#fff" />
                <path d="M33,45 L35,80 C35,80 38,83 39,75 L41,45 Z" fill="#fff" />
                <circle cx="28" cy="40" r="3" fill="#fff" />
              </svg>
            </div>
            <span className="text-[10px] font-mono font-bold bg-sky-900 text-sky-100 px-2 py-0.5 rounded-full mt-2 shadow">
              毁灭刃齿虎 🦴
            </span>
          </motion.div>
        )}

        {/* Mammoth Fossil Area */}
        {mammothItem && (
          <div className="w-full max-w-lg bg-sky-50/30 backdrop-blur-xs border-2 border-sky-100/50 rounded-2xl p-6 mt-12 shadow-lg flex flex-col items-center relative gap-4">
            
            <div className="absolute -top-3 left-4 bg-sky-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 shadow">
              <span className="shrink-0 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
              化石骨架微机重建中
            </div>

            {/* Replay Grow Button */}
            <button
              onClick={handleRebuild}
              className="absolute top-3 right-3 p-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg shadow-md transition-all active:scale-90 cursor-pointer"
              title="重新装配化石骨架"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* MAMMOTH BONE LAYER CONSTRUCT - 3D Printing Style Assembly */}
            <div 
              onClick={() => {
                if (buildStage >= 5) {
                  soundSynth.playIceCrack();
                  onFossilClick(mammothItem);
                }
              }}
              className={`w-full h-44 bg-sky-950/20 border-2 border-dashed border-sky-400/30 rounded-xl flex items-center justify-center relative cursor-pointer overflow-hidden group transition-all duration-300 ${buildStage >= 5 ? 'hover:bg-sky-400/20 hover:border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.2)]' : 'opacity-90'}`}
            >
              {/* Ambient Glowing Rings if finished */}
              {buildStage >= 5 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="w-32 h-32 rounded-full border border-sky-400"
                  />
                  <motion.div
                    animate={{ scale: [1.1, 0.8, 1.1], opacity: [0.2, 0.05, 0.2] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-48 h-48 rounded-full border border-sky-300"
                  />
                </div>
              )}

              {/* Dynamic bone parts assembly rendering */}
              <div className="relative w-72 h-32 flex items-center justify-center">
                
                {/* Stage 1: Leg Bones (下肢腿骨) */}
                {buildStage >= 1 && (
                  <motion.svg
                    initial={{ y: 20, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    className="absolute inset-0 w-full h-full text-sky-250 fill-current pointer-events-none"
                    viewBox="0 0 100 50"
                  >
                    {/* Rear legs skeleton */}
                    <rect x="25" y="32" width="4" height="15" rx="1.5" />
                    <rect x="34" y="31" width="4.5" height="16" rx="1.5" />
                    {/* Front legs skeleton */}
                    <rect x="65" y="28" width="5.5" height="19" rx="2" />
                    <rect x="74" y="27" width="5" height="20" rx="1.8" />
                  </motion.svg>
                )}

                {/* Stage 2: Spine, Pelvis, and Rib Cage (脊柱骨、肋骨、骨盆) */}
                {buildStage >= 2 && (
                  <motion.svg
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 w-full h-full text-sky-200 fill-current pointer-events-none"
                    viewBox="0 0 100 50"
                  >
                    {/* Spine line connecting tail to neck */}
                    <path d="M15,22 Q50,12 80,18" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                    {/* Pelvis bone */}
                    <ellipse cx="28" cy="24" rx="6" ry="4" transform="rotate(-15 28 24)" />
                    {/* rib bones cages */}
                    <path d="M40,20 Q35,32 40,35 M46,18 Q41,32 46,36 M52,17 Q47,33 52,36 M58,17 Q54,34 58,35 M64,18 Q60,34 64,34 M70,19 Q66,32 70,32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </motion.svg>
                )}

                {/* Stage 3: Skull Craniun (颅骨) */}
                {buildStage >= 3 && (
                  <motion.svg
                    initial={{ y: -15, opacity: 0, rotate: -20 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    className="absolute inset-0 w-full h-full text-sky-100 fill-current pointer-events-none"
                    viewBox="0 0 100 50"
                  >
                    {/* Massive giant head skull */}
                    <path d="M74,15 C76,12 85,10 88,18 C90,24 88,30 82,32 C78,33 74,28 74,20 Z" />
                    {/* Eye socket hollow */}
                    <circle cx="82" cy="18" r="1.5" fill="#1e293b" />
                    {/* Jaw base outline */}
                    <path d="M72,24 L78,28 L82,27" stroke="currentColor" strokeWidth="2" fill="none" />
                  </motion.svg>
                )}

                {/* Stage 4: Curved Majestic Tusks (弯曲象牙骨) */}
                {buildStage >= 4 && (
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full text-amber-120 pointer-events-none"
                    viewBox="0 0 100 50"
                  >
                    {/* Golden/white long spiral tusks */}
                    <path d="M82,26 Q98,28 92,44 C90,48 80,48 76,42" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    <path d="M84,24 Q100,22 95,38 C91,44 82,44 78,38" fill="none" stroke="#e0f2fe" strokeWidth="2.2" strokeLinecap="round" />
                  </motion.svg>
                )}

                {/* Loading / Complete Prompt Overlay inside container */}
                <div className="absolute inset-x-0 bottom-1 flex justify-center">
                  <span className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full ${buildStage >= 5 ? 'bg-sky-500 text-white animate-bounce' : 'bg-black/30 text-sky-200'}`}>
                    {buildStage === 0 && '等待装配中...'}
                    {buildStage === 1 && '1. 正在构建承重下肢支撑层...'}
                    {buildStage === 2 && '2. 正在拼接主干脊椎肋骨层...'}
                    {buildStage === 3 && '3. 正在契合超重颅骨前颌...'}
                    {buildStage === 4 && '4. 正在熔炼核心防御螺旋弯牙...'}
                    {buildStage === 5 && '✅ 骨架装配成功！点击化石唤醒名片'}
                  </span>
                </div>
              </div>
            </div>

            {/* Fossil Description label */}
            <div className="text-center px-4">
              <h3 className="text-sm font-black text-sky-950 flex items-center justify-center gap-1">
                {buildStage >= 5 && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                真猛犸象全身骨骼标本
              </h3>
              <p className="text-xs text-sky-800/80 mt-1">
                采用古生态地质重建雷达探测描绘，揭密生活在更新世极地苔原上的冰原巨兽。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GeologicLayer, FossilItem } from '../types';
import { soundSynth } from '../utils/audio';
import { Flame, AlertTriangle, Skull, RotateCcw } from 'lucide-react';

interface LayerCretaceousProps {
  layer: GeologicLayer;
  isActive: boolean;
  onFossilClick: (fossil: FossilItem) => void;
  meteorTriggered: boolean;
  setMeteorTriggered: (val: boolean) => void;
}

export default function LayerCretaceous({
  layer,
  isActive,
  onFossilClick,
  meteorTriggered,
  setMeteorTriggered
}: LayerCretaceousProps) {
  // Local animation state: 'idle', 'descending', 'flash', 'shaking', 'ashy'
  const [apocalypseStage, setApocalypseStage] = useState<string>(meteorTriggered ? 'completed-ashy' : 'idle');
  const [shakeOffset, setShakeOffset] = useState({ x: 0, y: 0 });

  const handleLaunchMeteor = () => {
    if (apocalypseStage !== 'idle' && apocalypseStage !== 'completed-ashy') return;
    
    soundSynth.playClick();
    setApocalypseStage('descending');

    // Step A: Trigger descending whistle audio and meteor glide
    soundSynth.playMeteorStrike(
      // Step B: Blinding White Flash Callback (at 1.1s)
      () => {
        setApocalypseStage('flash');
      },
      // Step C: Structural Shake Tremor Callback (immediately after flash)
      () => {
        setApocalypseStage('shaking');
        setMeteorTriggered(true);

        // Execute 3 distinct jarring physical shocks
        const shakeSequence = [
          { x: -15, y: 15 },
          { x: 18, y: -18 },
          { x: -12, y: 10 },
          { x: 10, y: -8 },
          { x: -5, y: 5 },
          { x: 0, y: 0 }
        ];

        shakeSequence.forEach((offset, index) => {
          setTimeout(() => {
            setShakeOffset({ x: offset.x, y: offset.y });
            if (index === shakeSequence.length - 1) {
              setApocalypseStage('completed-ashy');
            }
          }, index * 95);
        });
      }
    );
  };

  const handleResetCretaceous = () => {
    soundSynth.playClick();
    setMeteorTriggered(false);
    setApocalypseStage('idle');
  };

  const triceratopsItem = layer.fossils.find(f => f.id === 'triceratops');
  const trexItem = layer.fossils.find(f => f.id === 'tyrannosaurus');

  const isAshy = apocalypseStage === 'completed-ashy' || meteorTriggered;

  return (
    <div 
      className={`absolute inset-0 w-full h-full transition-colors duration-1000 select-none overflow-hidden text-amber-50 relative ${
        isAshy 
          ? 'bg-neutral-900 border-red-950' 
          : 'bg-gradient-to-b from-[#2e0804] to-[#120201] border-red-900'
      }`}
      style={{
        transform: `translate(${shakeOffset.x}px, ${shakeOffset.y}px)`,
        transition: 'background-color 1.2s ease-out'
      }}
    >
      {/* Primeval Volcanic Background silhouettes */}
      <div className="absolute inset-x-0 bottom-0 h-40 opacity-20 pointer-events-none">
        <svg className="w-full h-full fill-current text-red-950" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <polygon points="0,200 150,110 300,200 450,80 650,200 800,120 1000,200" />
        </svg>
      </div>

      {/* Layer Label Header */}
      <div className="absolute top-6 left-6 z-30 bg-red-950/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-900/30">
        <p className="text-[10px] font-mono tracking-widest uppercase font-bold text-red-400">
          第三地层 · 深度 -500米
        </p>
        <h2 className="text-lg font-black text-red-200">
          白垩纪末期 (6600万年前)
        </h2>
      </div>

      {/* Extreme Fern Leaves frame */}
      <div className="absolute top-4 right-4 text-emerald-950/30 opacity-70 pointer-events-none z-10">
        <svg className="w-28 h-28 transform rotate-90 fill-current" viewBox="0 0 100 100">
          <path d="M10,90 Q90,10 95,5 C95,5 82,30 50,55 M10,90 C10,90 28,60 40,40 M40,40 Q45,20 60,15" />
        </svg>
      </div>

      {/* Main Interaction Stage */}
      <div className="w-full h-full flex flex-col items-center justify-center relative p-6 z-20">
        
        {/* Triceratops dinosaur bubble */}
        {triceratopsItem && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className={`absolute left-[15%] md:left-[24%] top-[25%] flex flex-col items-center z-13`}
          >
            <div
              onClick={() => {
                soundSynth.playClick();
                onFossilClick(triceratopsItem);
              }}
              className={`w-20 h-20 rounded-full border-2 bg-opacity-75 flex flex-col items-center justify-center shadow-2xl cursor-pointer hover:scale-105 transition-all group ${
                isAshy 
                  ? 'bg-neutral-800 border-neutral-700 hover:border-red-500/50 text-neutral-400' 
                  : 'bg-[#5c2d25] border-red-800 hover:border-red-500 hover:shadow-red-900/50 text-amber-50'
              }`}
            >
              {isAshy ? (
                <Skull className="w-8 h-8 text-neutral-500 animate-pulse" />
              ) : (
                <svg className="w-14 h-10 fill-current text-orange-200 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 100 60">
                  <path d="M10,45 C20,45 35,30 50,30 C65,30 85,38 90,48 C95,54 85,55 70,55 L30,55 Z" />
                  <path d="M35,32 L20,10 L30,28 L5,15 L25,32 L25,40 Z" fill="currentColor" />
                  <circle cx="28" cy="42" r="2" fill="#1e293b" />
                </svg>
              )}
            </div>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full mt-2 shadow ${
              isAshy ? 'bg-neutral-900 text-red-500 line-through' : 'bg-red-900 text-red-100'
            }`}>
              三角龙 {isAshy ? '💀 [ EXTINCT ]' : '🦕 (活体观测)'}
            </span>
          </motion.div>
        )}

        {/* Tyrannosaurus rex fossil jaw fragment bubble */}
        {trexItem && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="absolute right-[12%] md:right-[22%] bottom-[25%] flex flex-col items-center z-15"
          >
            <div
              onClick={() => {
                soundSynth.playClick();
                onFossilClick(trexItem);
              }}
              className={`w-20 h-20 rounded-full border-2 bg-opacity-75 flex flex-col items-center justify-center shadow-2xl cursor-pointer hover:scale-105 transition-all group ${
                isAshy 
                  ? 'bg-neutral-800 border-neutral-700 hover:border-neutral-500 text-neutral-450' 
                  : 'bg-[#5c2d25] border-red-900 hover:border-red-600 hover:shadow-orange-950/40 text-amber-100'
              }`}
            >
              <svg className="w-12 h-10 fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 100 80">
                <path d="M15,40 L75,40 C85,40 90,50 90,65 L10,65 Z" />
                <path d="M15,40 C15,40 30,10 50,15 L70,40 Z" />
                <path d="M22,40 L24,46 L26,40 L28,46 L30,40" stroke="currentColor" strokeWidth="2.5" fill="none" />
              </svg>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-950 text-orange-200 px-2.5 py-0.5 rounded-full mt-2 shadow border border-red-900/30">
              霸王龙下颚化石 🦴
            </span>
          </motion.div>
        )}

        {/* METEOR APOCALYPSE ACTION MODULE */}
        <div className="absolute bottom-6 w-full flex flex-col items-center text-center px-4 max-w-sm z-30">
          {isAshy ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full bg-neutral-950/80 border-2 border-red-900/40 backdrop-blur-md rounded-xl p-3.5 flex flex-col items-center gap-1.5 shadow-lg"
            >
              <div className="flex items-center gap-1.5 text-red-500 font-extrabold text-xs">
                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                <span>希克苏鲁伯大撞击已发生</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-normal">
                陨石尘埃阻挡了阳光，环境转为严酷的毁灭冬夜。所有的恐龙将被封印上 ☠️ EXTINCT 印章。
              </p>
              <button
                onClick={handleResetCretaceous}
                className="mt-1 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-200 flex items-center gap-1 text-[10px] uppercase font-mono font-black rounded-lg cursor-pointer max-w-max transition-transform active:scale-95 shadow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                重置历史节点
              </button>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLaunchMeteor}
              className={`w-full py-3 bg-gradient-to-r from-red-700 to-amber-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-red-900/50 cursor-pointer group ${apocalypseStage !== 'idle' ? 'pointer-events-none opacity-40' : ''}`}
            >
              <Flame className="w-4 h-4 text-orange-200 animate-bounce" />
              <span>
                {apocalypseStage === 'descending' ? '💥 陨石撕裂大气中...' : '☄️ 触碰召唤陨石大撞击'}
              </span>
            </motion.div>
          )}
        </div>

        {/* METEOR INCOMING ANIMATION */}
        <AnimatePresence>
          {apocalypseStage === 'descending' && (
            <motion.div
              initial={{ x: 500, y: -450, scale: 1.5, opacity: 0 }}
              animate={{ x: -400, y: 350, scale: 0.8, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.15, ease: 'easeIn' }}
              className="absolute top-0 right-0 pointer-events-none z-41"
            >
              {/* Giant Meteor SVG */}
              <svg className="w-56 h-28" viewBox="0 0 200 100">
                {/* Long Blazing Trail */}
                <defs>
                  <linearGradient id="fireTrail" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="rgba(239, 68, 68, 0)" />
                    <stop offset="60%" stopColor="rgb(239, 68, 68)" />
                    <stop offset="100%" stopColor="rgb(245, 158, 11)" />
                  </linearGradient>
                </defs>
                <polygon points="0,50 160,25 180,50 160,75" fill="url(#fireTrail)" />
                {/* Rocky core */}
                <circle cx="165" cy="50" r="16" fill="#3f1e1e" stroke="#ef4444" strokeWidth="4" />
                <ellipse cx="158" cy="45" rx="4" ry="2" fill="#ef4444" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FULL SCREEN WHITE FLASH OVERLAY */}
        <AnimatePresence>
          {apocalypseStage === 'flash' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.1, times: [0, 0.15, 0.65, 1], ease: 'easeInOut' }}
              className="fixed inset-0 bg-white pointer-events-none z-50"
            />
          )}
        </AnimatePresence>

        {/* GENTLE FLOATING WHITE ASHES LAYER IN DISASTER WINTER */}
        {isAshy && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -50, 
                  x: Math.random() * 500, 
                  opacity: 0.15 + Math.random() * 0.4, 
                  scale: 0.4 + Math.random() * 0.8 
                }}
                animate={{ 
                  y: 600, 
                  x: `calc(${Math.random() * 500}px + ${Math.sin(i) * 30}px)` 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5 + Math.random() * 7, 
                  ease: 'linear' 
                }}
                className="absolute w-2 h-2 rounded-xs bg-[#f4f4f5]/65"
                style={{ 
                  left: `${(i * 5) + 3}%`, 
                  boxShadow: '0 0 4px rgba(255,255,255,0.2)' 
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

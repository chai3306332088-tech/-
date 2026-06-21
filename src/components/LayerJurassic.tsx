/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GeologicLayer, FossilItem } from '../types';
import { soundSynth } from '../utils/audio';
import { Sparkles, Trees, Music4 } from 'lucide-react';

interface LayerJurassicProps {
  layer: GeologicLayer;
  isActive: boolean;
  onFossilClick: (fossil: FossilItem) => void;
}

interface Leaf {
  id: number;
  left: number;
  rotate: number;
}

interface Ripple {
  id: number;
}

export default function LayerJurassic({ layer, isActive, onFossilClick }: LayerJurassicProps) {
  const [isChewing, setIsChewing] = useState(false);
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [rippleCounter, setRippleCounter] = useState(0);
  const [leafCounter, setLeafCounter] = useState(0);

  const brachioItem = layer.fossils.find(f => f.id === 'brachiosaurus');
  const pteroItem = layer.fossils.find(f => f.id === 'pterosaur');

  const handleBrachioClick = () => {
    if (isChewing) return;
    setIsChewing(true);
    soundSynth.playLeafCrunch();

    // Trigger Sauropod bellow after minor chewing delay
    setTimeout(() => {
      soundSynth.playSauropodRoar();
      
      // Spawn acoustic resonance sound ripples
      const newRipples = [
        { id: rippleCounter },
        { id: rippleCounter + 1 },
        { id: rippleCounter + 2 }
      ];
      setRippleCounter(prev => prev + 3);
      setRipples(newRipples);

      // Clear ripples after animation
      setTimeout(() => setRipples([]), 2000);
    }, 450);

    // Spawn falling leaves
    const list: Leaf[] = [];
    for (let i = 0; i < 8; i++) {
      list.push({
        id: leafCounter + i,
        left: 20 + Math.random() * 55, // percent width center
        rotate: Math.random() * 360
      });
    }
    setLeafCounter(prev => prev + 8);
    setLeaves(list);

    // Reset chewing state after eating animation completes
    setTimeout(() => {
      setIsChewing(false);
      setLeaves([]);
    }, 2800);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#123524] to-[#041e12] select-none text-emerald-250 relative overflow-hidden">
      
      {/* Dynamic Pterosaur shadow gliding diagonally across the screen in the background */}
      {isActive && (
        <motion.div
          initial={{ x: -200, y: 150, opacity: 0, scale: 0.6 }}
          animate={{ x: 1200, y: 50, opacity: [0, 0.4, 0.4, 0], scale: 1.1 }}
          transition={{ duration: 16, repeat: Infinity, repeatDelay: 4, ease: 'linear' }}
          className="absolute z-10 text-emerald-900 pointer-events-none filter blur-xs"
        >
          {/* Flat Pterosaur Shadow */}
          <svg className="w-48 h-20 fill-current opacity-30" viewBox="0 0 100 40">
            <path d="M10,20 C40,0 60,35 90,20 C70,30 50,30 10,20 Z" />
            <path d="M50,22 L45,40 L55,40 Z" />
            <polygon points="12,18 2,15 10,24" />
          </svg>
        </motion.div>
      )}

      {/* Layer metadata badge */}
      <div className="absolute top-6 left-6 z-30 bg-emerald-900/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-800/20">
        <p className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-400">
          第四地层 · 深度 -800米
        </p>
        <h2 className="text-lg font-black text-emerald-100">
          侏罗纪全盛季 (1.5亿年前)
        </h2>
      </div>

      {/* Papercut Tropical Cycads / Trees Silhouettes framing sides */}
      <div className="absolute bottom-0 left-0 w-32 h-[45%] bg-gradient-to-t from-emerald-950 to-transparent opacity-80 pointer-events-none z-10">
        <svg className="w-full h-full fill-current text-emerald-960" viewBox="0 0 100 150">
          <path d="M0,150 L20,60 L40,150" />
          {/* Large fan leaf blades */}
          <path d="M20,60 C4,40 -10,80 5,90" />
          <path d="M20,60 C35,40 50,75 35,90" />
          <path d="M20,60 C20,20 0,10 -5,35" />
          <path d="M20,60 C30,20 45,15 48,45" />
        </svg>
      </div>
      
      <div className="absolute bottom-0 right-0 w-32 h-[35%] bg-gradient-to-t from-emerald-950 to-transparent opacity-80 pointer-events-none z-10">
        <svg className="w-full h-full fill-current text-emerald-960 transform scale-x-[-1]" viewBox="0 0 100 150">
          <path d="M0,150 L20,80 L30,150" />
          <path d="M20,80 C5,60 -5,95 8,105" />
          <path d="M20,80 C35,60 45,95 32,105" />
        </svg>
      </div>

      {/* Forest Canopy Overhead details */}
      <div className="absolute top-0 inset-x-0 h-16 bg-[#092215] border-b border-emerald-900 opacity-90 z-20 flex items-center justify-center">
        {/* Soft tropical ambient glowing shafts */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />
      </div>

      <div className="w-full h-full flex flex-col items-center justify-center relative p-6 z-20">
        
        {/* Clickable Pterosaur in active flight silhouette */}
        {pteroItem && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="absolute left-[15%] md:left-[22%] bottom-[33%] flex flex-col items-center"
          >
            <div
              onClick={() => {
                soundSynth.playClick();
                onFossilClick(pteroItem);
              }}
              className="w-16 h-16 rounded-full bg-emerald-900/60 border-2 border-emerald-800 flex items-center justify-center shadow-lg hover:border-emerald-500 hover:shadow-emerald-500/30 cursor-pointer group"
            >
              <svg className="w-10 h-6 fill-current text-teal-200 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 100 50">
                <path d="M10,25 C40,-5 60,30 90,25 C70,35 60,35 10,25 Z" />
                <path d="M50,28 L45,45 L55,45 Z" />
              </svg>
            </div>
            <span className="text-[9px] font-mono font-bold bg-emerald-950 text-teal-200 px-2 py-0.5 rounded-full mt-1.5 shadow">
              无齿翼龙 🦅
            </span>
          </motion.div>
        )}

        {/* BRACHIOSAURUS LARGE SEED INTERACTION CENTER */}
        <div className="flex flex-col items-center mt-6">
          
          {/* Brachiosaurus Neck & Body Container */}
          <div className="relative w-72 h-56 flex items-center justify-center">
            
            {/* Visual acoustic resonance circles radiating during bellow */}
            <AnimatePresence>
              {ripples.map((ripple, idx) => (
                <motion.div
                  key={ripple.id}
                  initial={{ scale: 0.2, opacity: 0.8 }}
                  animate={{ scale: 1.6 + idx * 0.4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  className="absolute w-28 h-28 rounded-full border-4 border-dashed border-emerald-300 pointer-events-none z-10"
                  style={{
                    // Centered of the throat/chest of the brachiosaurus graphics
                    left: '20%',
                    top: '25%'
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Brachiosaurus Illustrator with motion.path rotation for stretch-chewing neck */}
            <div 
              onClick={handleBrachioClick}
              className={`relative cursor-pointer transition-transform group ${isChewing ? 'scale-98' : 'hover:scale-102'}`}
              title="点击抚摸腕龙并喂食树叶"
            >
              <svg className="w-64 h-52 fill-current text-[#16422b]" viewBox="0 0 250 200">
                {/* 4 Massive Heavy Quadruped legs */}
                {/* Back Rear Legs */}
                <path d="M75,140 L70,195 C70,195 72,198 78,198 L85,195 L84,140 Z" fill="#092617" />
                {/* Front Rear Legs */}
                <path d="M150,140 L160,198 C160,198 165,200 172,198 L175,195 L165,140 Z" fill="#092617" />

                {/* Main Torso Body */}
                <path d="M60,140 Q40,110 65,90 Q90,75 140,80 Q175,85 180,120 Q180,145 155,145 Q120,140 85,140 Z" />

                {/* Head, Crown crest and Neck (which rotates/stretches during chew) */}
                <motion.g
                  animate={isChewing 
                    ? { rotate: [-5, 12, -8, 0], y: [0, 10, -5, 0] } 
                    : {}
                  }
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                  style={{ originX: '115px', originY: '90px' }}
                >
                  {/* Long neck extending up left */}
                  <path d="M115,90 C110,60 90,25 78,10 Q74,3 85,3 C92,3 102,15 120,50 L128,90 Z" />
                  {/* Tiny head with crown ridge on top */}
                  <path d="M78,10 Q70,4 62,5 C55,6 55,14 65,18 L78,12 Z" />
                  <path d="M74,6 Q74,0 80,0 L81,5 Z" /> {/* Crest dome */}
                  {/* Eye socket */}
                  <circle cx="67" cy="11" r="1.5" fill="#faf6ee" />
                </motion.g>

                {/* Fore legs in frontend layer */}
                <path d="M92,140 L90,198 C90,198 94,200 100,198 L104,195 L102,140 Z" />
                <path d="M140,140 L145,198 C145,198 150,200 156,198 L158,195 L150,140 Z" />
              </svg>

              {/* Little Glowing Sparkles overlay feedback indicator */}
              <div className="absolute top-2 left-6 bg-emerald-500 text-[#faf4ee] border border-emerald-400 p-1.5 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform active:scale-95 z-30">
                <Music4 className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Fall-Leaf Particles Animation */}
          <div className="absolute top-[20%] inset-x-0 w-full h-[55%] pointer-events-none overflow-hidden">
            <AnimatePresence>
              {leaves.map((leaf) => (
                <motion.div
                  key={leaf.id}
                  initial={{ y: -20, x: `${leaf.left}%`, rotate: leaf.rotate, opacity: 0.9 }}
                  animate={{ y: 250, x: `${leaf.left + (Math.sin(leaf.id) * 12)}%`, rotate: leaf.rotate + 180, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.5, ease: 'easeOut' }}
                  className="absolute w-4 h-2.5 rounded-br-full bg-emerald-400 border border-emerald-600/30 shadow-xs"
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Interactive details */}
          <div className="text-center px-4 max-w-sm mt-3">
            <h3 className="text-sm font-black text-emerald-300 flex items-center justify-center gap-1.5">
              <span>高耸腕龙</span>
              <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-normal">
                植食性巨型龙
              </span>
            </h3>
            <p className="text-xs text-emerald-400/80 mt-1 leading-normal">
              {isChewing ? '🦖 正在贪婪地啃食针叶林，发出雷鸣胸鸣音波！' : '🌿 触碰点击腕龙，喂食多汁森林顶冠，呼唤生命长啸音律。'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

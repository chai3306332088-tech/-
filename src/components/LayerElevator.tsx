/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundSynth } from '../utils/audio';
import { Volume2, VolumeX, ArrowUp, Briefcase, Award, ShieldAlert, Zap, Compass } from 'lucide-react';
import { FossilItem } from '../types';

interface LayerElevatorProps {
  progress: number; // 0.0 to 4.0
  unlockedList: string[]; // List of unlocked fossil IDs
  allFossils: FossilItem[];
  onOpenJournalItem: (item: FossilItem) => void;
  onJumpToProgress: (target: number) => void;
  onResetAll: () => void;
}

// Piecewise depth translation (0m to -3000m)
export function getInterpDepth(p: number): number {
  if (p <= 0) return 0;
  if (p <= 1) return p * 50; // 0m to 50m
  if (p <= 2) return 50 + (p - 1) * 450; // 50m to 500m
  if (p <= 3) return 500 + (p - 2) * 300; // 500m to 800m
  if (p <= 4) return 800 + (p - 3) * 2200; // 800m to 3000m
  return 3000;
}

// Piecewise geologic timeline year translation
export function getInterpEra(p: number): string {
  if (p <= 0.02) return "现在 (文明全新世)";
  if (p <= 1) {
    const yrs = p * 20000;
    return `${Math.floor(yrs).toLocaleString()} 年前 (第四纪冰期)`;
  }
  if (p <= 2) {
    const yrs = 20000 + (p - 1) * 65980000;
    return `${(yrs / 1000000).toFixed(2)} 百万年前 (中生代白垩纪)`;
  }
  if (p <= 3) {
    const yrs = 66050000 + (p - 2) * 83950000;
    return `${(yrs / 1000000).toFixed(1)} 百万年前 (中生代侏罗纪)`;
  }
  if (p <= 4) {
    const yrs = 150000000 + (p - 3) * 4450000000;
    if (yrs >= 1000000000) {
      return `${(yrs / 1000000000).toFixed(2)} 十亿年前 (太古前寒武纪)`;
    }
    return `${(yrs / 1000000).toFixed(1)} 百万年前 (太古前寒武纪)`;
  }
  return "46亿年前 (冥古宙太初)";
}

// Identify Period Name
export function getPeriodName(p: number): string {
  if (p <= 0.5) return "现代全新世";
  if (p <= 1.5) return "更新世冰河期";
  if (p <= 2.5) return "晚白垩纪";
  if (p <= 3.5) return "中晚侏罗纪";
  return "太古前寒武纪";
}

export default function LayerElevator({
  progress,
  unlockedList,
  allFossils,
  onOpenJournalItem,
  onJumpToProgress,
  onResetAll
}: LayerElevatorProps) {
  const [isMuted, setIsMuted] = useState(soundSynth.getMuteStatus());
  const [backpackOpen, setBackpackOpen] = useState(false);

  // sound toggle
  const handleToggleMute = () => {
    const muted = soundSynth.toggleMute();
    setIsMuted(muted);
    soundSynth.playClick();
  };

  // One-click back to surface
  const handleScrollToTop = () => {
    soundSynth.playElevatorWhoosh();
    onJumpToProgress(0);
  };

  // Left-gauge pointer coordinates calculation (from 5% at top to 90% at bottom)
  const capsuleY = 5 + (progress / 4.0) * 85;

  // Digital metrics
  const currentDepth = getInterpDepth(progress);
  const currentEraText = getInterpEra(progress);
  const periodLabel = getPeriodName(progress);

  // Resistance value simulation based on layers
  // Modern: 0.1MPa, Ice: 12MPa, Cretaceous: 145MPa, Jurassic: 280MPa, Precambrian: 980MPa
  const getFrictionVal = (p: number) => {
    if (p <= 1) return (p * 11.9 + 0.1).toFixed(1);
    if (p <= 2) return (12 + (p - 1) * 133).toFixed(0);
    if (p <= 3) return (145 + (p - 2) * 135).toFixed(0);
    return (280 + (p - 3) * 700).toFixed(0);
  };

  return (
    <>
      {/* ================= LEFT SIDE: DEEP STRATUM GAUGE ================= */}
      <div 
        id="elevator-depth-gauge" 
        className="fixed left-4 top-[18%] bottom-[12%] w-10 md:w-14 bg-black/45 border-2 border-[#fefcf8]/10 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(0,0,0,0.55)] z-40 flex flex-col items-center py-5 select-none"
      >
        {/* Scale labels alongside */}
        <div className="absolute right-[-24px] top-4 text-[9px] font-mono opacity-50 font-bold hidden md:block text-[#faf6ee]">0m</div>
        <div className="absolute right-[-32px] top-[26%] text-[9px] font-mono opacity-50 font-bold hidden md:block text-[#faf6ee]">-50m</div>
        <div className="absolute right-[-36px] top-[48%] text-[9px] font-mono opacity-50 font-bold hidden md:block text-[#faf6ee]">-500m</div>
        <div className="absolute right-[-36px] top-[70%] text-[9px] font-mono opacity-50 font-bold hidden md:block text-[#faf6ee]">-800m</div>
        <div className="absolute right-[-42px] bottom-4 text-[9px] font-mono opacity-50 font-bold hidden md:block text-[#faf6ee]">-3000m</div>

        {/* Dynamic Elevator Car graphic capsule sliding down */}
        <div 
          className="absolute w-7 h-9 md:w-9 md:h-11 bg-orange-500 rounded-lg flex flex-col items-center justify-center border-2 border-amber-200 shadow-md shadow-orange-950/40 z-10 text-[9px] font-mono text-amber-950 font-extrabold"
          style={{ 
            top: `${capsuleY}%`,
            transition: 'top 0.12s linear, transform 0.08s ease-out',
            transform: `translateY(-50%) scale(${progress > 0.05 ? 1.05 : 1})`
          }}
        >
          {/* Pulsing beacon red light on bottom */}
          <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
          <Compass className="w-4 h-4 text-white animate-pulse" />
          <span className="text-[7px] text-white/90 leading-none mt-0.5">H5</span>
        </div>

        {/* Track Line */}
        <div className="w-1 h-full bg-stone-700/60 rounded-full relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-orange-400 to-amber-600 rounded-full" style={{ height: `${(progress / 4.0) * 100}%` }} />
        </div>
      </div>

      {/* ================= RIGHT SIDE: DOCK CONTROL CABIN (DASHBOARD) ================= */}
      <div 
        id="elevator-control-cabin" 
        className="fixed top-4 right-4 z-40 flex flex-col items-end gap-3 select-none pointer-events-none"
      >
        
        {/* Dynamic Digital Metrics Card (Interactive cockpit) */}
        <div className="bg-black/60 border border-amber-100/10 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl min-w-[210px] md:min-w-[240px] flex flex-col gap-2 border-r-4 border-r-orange-500 pointer-events-auto text-[#faf6ee]">
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-orange-400 font-extrabold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              科考时间电梯 HUD
            </span>
            {/* Status Beacon dot */}
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="text-[8px] font-mono text-emerald-400">CONNECT</span>
            </div>
          </div>

          {/* Piecewise Digital Readouts */}
          <div className="border-y border-white/5 py-1.5 flex flex-col gap-1">
            {/* Meter depth */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-white/55 font-mono">当下挖掘深度:</span>
              <span className="text-xl font-mono font-black tracking-tighter text-[#faf6ee]">
                -{currentDepth.toFixed(1)} 米
              </span>
            </div>
            {/* Geochron years ago */}
            <div className="flex flex-col text-right">
              <span className="text-[11px] font-mono font-medium text-orange-200">
                {currentEraText}
              </span>
              <span className="text-[9px] text-[#faf6ee]/40 font-mono mt-0.5">
                分界期位: {periodLabel}
              </span>
            </div>
          </div>

          {/* Digging indicators logs */}
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-white/40">阻力负载:</span>
            <span className="text-orange-300 font-bold">{getFrictionVal(progress)} GPa</span>
          </div>

          {/* Quick-select jump points for user convenience */}
          <div className="flex justify-between gap-1 border-t border-white/5 pt-2">
            {[
              { label: '地表', p: 0 },
              { label: '冰期', p: 1 },
              { label: '白垩', p: 2 },
              { label: '侏罗', p: 3 },
              { label: '太古', p: 4 }
            ].map((btn, idx) => {
              const active = Math.round(progress) === btn.p;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    soundSynth.playClick();
                    onJumpToProgress(btn.p);
                  }}
                  className={`text-[9px] font-sans px-1.5 py-0.5 rounded transition ${active ? 'bg-orange-500 text-black font-extrabold' : 'bg-[#e5e7eb]/10 hover:bg-white/10 text-white'}`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action controls button column */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* MUTE AMBIENT AUDIO BUTTON */}
          <button
            onClick={handleToggleMute}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-lg border transition duration-200 flex items-center justify-center cursor-pointer ${
              isMuted 
                ? 'bg-red-950/65 border-red-500/30 text-red-400 hover:bg-red-900/50' 
                : 'bg-black/45 border-white/10 text-[#faf6ee] hover:bg-neutral-800'
            }`}
            title={isMuted ? '开声音音效' : '静音模式'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
          </button>

          {/* BACKPACK Discovery Journal DOCK TRIGGER */}
          <button
            onClick={() => {
              soundSynth.playClick();
              setBackpackOpen(prev => !prev);
            }}
            className={`px-3 py-2.5 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer transition ${
              backpackOpen 
                ? 'bg-amber-600 border-amber-400 text-black' 
                : 'bg-black/55 border-amber-100/10 text-[#faf6ee] hover:bg-neutral-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span className="hidden md:inline">科考标本志</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-950 text-amber-200 text-[9px] leading-none">
              {unlockedList.length}
            </span>
          </button>

          {/* EXTREMELY IMPORTANT: ONE-KEY RETURN TO SURFACE */}
          {progress > 0.05 && (
            <motion.button
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.1, opacity: 0 }}
              onClick={handleScrollToTop}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 border border-orange-400 text-black font-extrabold text-xs uppercase shadow-xl hover:from-amber-400 hover:to-orange-400 transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              title="升空返回现代地表"
            >
              <ArrowUp className="w-4 h-4 animate-bounce" />
              <span>回到地表</span>
            </motion.button>
          )}

        </div>
      </div>

      {/* ================= DETAILED SPECIMEN BACKPACK DIALOG PANEL ================= */}
      <AnimatePresence>
        {backpackOpen && (
          <div className="fixed inset-0 z-45 bg-black/60 backdrop-blur-xs select-none flex items-center justify-center p-4">
            
            {/* Modal close overlay */}
            <div className="absolute inset-0" onClick={() => setBackpackOpen(false)} />

            {/* Specimen Box */}
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="w-full max-w-md bg-[#faf6ee] rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.45)] border-4 border-[#e5dfd3] flex flex-col p-6 z-10 text-amber-950 relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="flex items-center justify-between border-b border-amber-900/10 pb-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-amber-700" />
                  <span className="font-extrabold text-base tracking-tight">地层科考：已发掘标本志</span>
                </div>
                <button
                  onClick={() => {
                    soundSynth.playClick();
                    setBackpackOpen(false);
                  }}
                  className="px-2.5 py-1 bg-amber-95/10 hover:bg-amber-95/20 border border-amber-900/20 text-xs font-mono font-bold rounded-lg cursor-pointer"
                >
                  关闭
                </button>
              </div>

              {/* Description progress ratio */}
              <div className="bg-amber-95/15 p-3 rounded-xl border border-amber-900/5 mb-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 font-black">全球恐龙科考解密进度</span>
                  <span className="text-xs text-amber-900/80 font-medium">
                    已搜寻解锁 {unlockedList.length} / {allFossils.length} 处关键物种标本
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-black text-amber-900">
                    {Math.round((unlockedList.length / allFossils.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-amber-900/10 rounded-full mb-5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${(unlockedList.length / allFossils.length) * 100}%` }}
                />
              </div>

              {/* Grid List fossils */}
              <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[45vh] pr-1.5">
                {allFossils.map((item) => {
                  const unlocked = unlockedList.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (unlocked) {
                          onOpenJournalItem(item);
                        } else {
                          soundSynth.playClick();
                          // hint
                        }
                      }}
                      className={`p-3 rounded-xl border-2 transition flex flex-col justify-between min-h-[90px] relative ${
                        unlocked 
                          ? 'border-amber-800/25 bg-[#f4ece0] hover:border-amber-600 hover:bg-[#ebdcc5] cursor-pointer' 
                          : 'border-amber-95/10 bg-amber-95/5 opacity-55 saturate-50'
                      }`}
                    >
                      <div>
                        {unlocked ? (
                          <div className="flex items-center gap-1 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-mono text-emerald-700 font-bold uppercase">UNLOCKED</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                            <span className="text-[9px] font-mono text-neutral-500">LOCKED</span>
                          </div>
                        )}
                        <h4 className="text-xs font-black leading-tight text-amber-950">
                          {unlocked ? item.name : '未知古生物标本'}
                        </h4>
                        <p className="text-[9px] font-mono text-amber-700/80 mt-1">
                          储存位置：-{item.depth}m
                        </p>
                      </div>

                      {unlocked && (
                        <div className="text-right mt-1">
                          <span className="text-[9px] text-amber-900 font-bold bg-amber-950/5 px-1.5 py-0.5 rounded-full inline-block">
                            查看 spec 📄
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-amber-95/10 pt-4 mt-4 flex justify-between gap-2.5">
                <button
                  onClick={() => {
                    if (window.confirm("确定重设所有解锁进度吗？")) {
                      soundSynth.playClick();
                      onResetAll();
                      setBackpackOpen(false);
                    }
                  }}
                  className="px-3 py-1.5 text-[10px] text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer font-bold uppercase tracking-wider"
                >
                  重置收集进度
                </button>
                <button
                  onClick={() => setBackpackOpen(false)}
                  className="px-5 py-1.5 text-[10px] text-amber-950 bg-amber-95/30 border border-amber-900/20 hover:bg-amber-95/40 rounded-lg cursor-pointer font-extrabold uppercase tracking-widest flex-1 text-center"
                >
                  好的
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

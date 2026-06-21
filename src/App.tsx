/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GEOLOGIC_LAYERS } from './utils/layersConfig';
import { FossilItem, GeologicLayer } from './types';
import { soundSynth } from './utils/audio';

// Subcomponents imports
import LayerModern from './components/LayerModern';
import LayerIceAge from './components/LayerIceAge';
import LayerCretaceous from './components/LayerCretaceous';
import LayerJurassic from './components/LayerJurassic';
import LayerPrecambrian from './components/LayerPrecambrian';
import BackgroundDust from './components/BackgroundDust';
import CardModal from './components/CardModal';
import LayerElevator from './components/LayerElevator';

import { Sparkles, HelpCircle, Volume2, Compass, ArrowDown } from 'lucide-react';

export default function App() {
  // Master state variables
  const [targetProgress, setTargetProgress] = useState<number>(0); // 0.0 to 4.0
  const [smoothProgress, setSmoothProgress] = useState<number>(0);
  
  // App initialization states
  const [started, setStarted] = useState<boolean>(false);
  const [unlockedFossils, setUnlockedFossils] = useState<string[]>([]);
  const [activeSpecimen, setActiveSpecimen] = useState<FossilItem | null>(null);
  const [meteorTriggered, setMeteorTriggered] = useState<boolean>(false);

  // Touch tracking refs
  const touchStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const animationFrameId = useRef<number | null>(null);

  // Collect list of all fossils/dinosaurs for backpack spec-sheet indexes
  const allFossils = GEOLOGIC_LAYERS.reduce<FossilItem[]>((acc, layer) => {
    return [...acc, ...layer.fossils];
  }, []);

  // Hydrate unlocked progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('deep_stratum_unlocked_specimens');
    if (saved) {
      try {
        setUnlockedFossils(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleUnlockSpecimen = (id: string) => {
    setUnlockedFossils((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem('deep_stratum_unlocked_specimens', JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetCollects = () => {
    setUnlockedFossils([]);
    localStorage.removeItem('deep_stratum_unlocked_specimens');
    setMeteorTriggered(false);
  };

  // spring-damping loop to interpolate targetProgress to smoothProgress
  useEffect(() => {
    const updateSmoothProgress = () => {
      setSmoothProgress((prev) => {
        // Linear interpolation feedback
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.0005) {
          return targetProgress;
        }
        // Small step sizes create the solid, physical "digging resistance"
        return prev + diff * 0.095;
      });
      animationFrameId.current = requestAnimationFrame(updateSmoothProgress);
    };

    animationFrameId.current = requestAnimationFrame(updateSmoothProgress);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [targetProgress]);

  // Synchronize active background ambient loops when boundary crosses
  const lastActiveIdx = useRef<number>(0);
  useEffect(() => {
    if (!started) return;
    
    // Determine the active layer card index using nearest round
    const activeIndex = Math.min(Math.max(Math.round(smoothProgress), 0), 4);
    if (activeIndex !== lastActiveIdx.current) {
      const activeLayerId = GEOLOGIC_LAYERS[activeIndex].id;
      soundSynth.startAmbientLoop(activeLayerId);
      
      // Minor sound feedback thud when crossing borders
      soundSynth.playClick();
      lastActiveIdx.current = activeIndex;
    }
  }, [smoothProgress, started]);

  // Handle system launch initial cockpit click
  const handleStartApp = () => {
    setStarted(true);
    soundSynth.playElevatorWhoosh();
    // Start play first layer ambient loops
    setTimeout(() => {
      soundSynth.startAmbientLoop('modern');
    }, 700);
  };

  // Wheel event listener for desktop
  const handleWheelScroll = (e: React.WheelEvent) => {
    if (!started) return;
    // Scale wheel scroll inputs to progress steps
    const sensitivity = 0.0012;
    const delta = e.deltaY * sensitivity;
    setTargetProgress((prev) => Math.min(Math.max(prev + delta, 0), 4.0));
  };

  // Touch event listeners for mobile devices swipe-digging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!started) return;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!started || !isDragging.current) return;
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;
    
    // Convert px offset to progress change (1 screen heights corresponds to 1 interval)
    const containerHeight = window.innerHeight;
    const sensitivityMultiplier = 1.35; // Custom drag resistance modifier
    const deltaProgress = (deltaY / containerHeight) * sensitivityMultiplier;
    
    setTargetProgress((prev) => Math.min(Math.max(prev + deltaProgress, 0), 4.0));
    touchStartY.current = currentY;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Master method to navigate to explicit progress point
  const handleJumpToProgress = (p: number) => {
    setTargetProgress(p);
  };

  return (
    <div 
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-zinc-950 font-sans select-none"
      onWheel={handleWheelScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ================= GORGEOUS CABIN LAUNCH SPLASH BANNER ================= */}
      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-[#150a06] text-amber-50 p-6 flex flex-col items-center justify-center relative overflow-hidden"
          >
            {/* Ambient hot glowing background flare */}
            <div className="absolute top-[30%] w-96 h-96 rounded-full bg-red-950/20 filter blur-3xl" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="text-center max-w-md flex flex-col items-center z-10">
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] font-extrabold bg-orange-950/60 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-full px-4 text-center">
                地球极秘地学沉浸交互 H5
              </span>
              
              <h1 className="text-3xl md:text-4xl font-extrabold mt-4 tracking-tight leading-none text-[#faf6ee] flex flex-col gap-1">
                <span>《地层深潜》</span>
                <span className="text-lg md:text-xl text-orange-200 mt-1 font-semibold">穿越恐龙时代的时间电梯</span>
              </h1>
              
              <p className="text-xs text-amber-100/70 mt-4 leading-relaxed px-4">
                欢迎乘坐科考“时间仓”。通过滑动屏幕，您将开凿数千米地质巨岩。从现代地表深度沉入，跨越冰河更新世、陨石笼罩的白垩纪、巨型腕龙呼啸的侏罗纪，直至地球太初生命本源。
              </p>

              {/* Instructions checklist */}
              <div className="w-full bg-amber-95/5 border border-amber-900/10 rounded-xl p-4 mt-6 text-left space-y-2 text-xs text-amber-200/90 leading-relaxed">
                <div className="flex gap-2">
                  <span className="text-orange-400 font-bold shrink-0">· 交互方式：</span>
                  <span>使用鼠标滚轮向下划动，或用手指轻拖屏幕向上，挖掘阻力感显著。</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-orange-400 font-bold shrink-0">· 科学搜寻：</span>
                  <span>点击各层微亮的化石骨骼或生物汤，即可解锁收录入<b>背包标本志</b>。</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-orange-400 font-bold shrink-0">· 听觉变迁：</span>
                  <span>本系统内置先进音频粒子合成，戴上耳机效果最佳。</span>
                </div>
              </div>

              {/* Enter Capsule button */}
              <button
                onClick={handleStartApp}
                className="mt-8 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-450 hover:to-amber-550 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-2xl transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Compass className="w-4 h-4 animate-spin [animation-duration:8s]" />
                启动时间仓 · 开始深潜
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= CONTINUOUS GEOLOGICAL STRIP CANVAS ================= */}
      {started && (
        <div id="master-shaft-frame" className="relative w-full h-full">

          {/* BACKGROUND DRIFT DEBRIS (彩色剪纸卡纸碎屑) */}
          <BackgroundDust progress={smoothProgress} />

          {/* LAYER OVERLAY VIEWS STACKED VERTICALLY */}
          <div className="w-full h-full relative">
            
            {/* Layer 0: Modern Surface (0.0 to 1.0) */}
            <div 
              className="absolute inset-x-0 w-full h-full z-20"
              style={{
                top: `${(0 - smoothProgress) * 100}vh`,
                // Adding nice box-shadow border simulating paper depth
                boxShadow: '0 25px 40px rgba(0,0,0,0.4)'
              }}
            >
              <LayerModern 
                layer={GEOLOGIC_LAYERS[0]} 
                progress={Math.min(Math.max(smoothProgress, 0), 1.0)} 
                onFossilClick={setActiveSpecimen}
              />
            </div>

            {/* Layer 1: Pleistocene Ice Age (1.0 to 2.0) */}
            <div 
              className="absolute inset-x-0 w-full h-full z-18"
              style={{
                top: `${(1 - smoothProgress) * 100}vh`,
                boxShadow: '0 25px 40px rgba(0,0,0,0.45)'
              }}
            >
              <LayerIceAge 
                layer={GEOLOGIC_LAYERS[1]} 
                isActive={Math.round(smoothProgress) === 1}
                onFossilClick={setActiveSpecimen}
              />
            </div>

            {/* Layer 2: Cretaceous Extinction Period (2.0 to 3.0) */}
            <div 
              className="absolute inset-x-0 w-full h-full z-16"
              style={{
                top: `${(2 - smoothProgress) * 100}vh`,
                boxShadow: '0 25px 40px rgba(0,0,0,0.5)'
              }}
            >
              <LayerCretaceous 
                layer={GEOLOGIC_LAYERS[2]}
                isActive={Math.round(smoothProgress) === 2}
                onFossilClick={setActiveSpecimen}
                meteorTriggered={meteorTriggered}
                setMeteorTriggered={setMeteorTriggered}
              />
            </div>

            {/* Layer 3: Jurassic Golden Era (3.0 to 4.0) */}
            <div 
              className="absolute inset-x-0 w-full h-full z-14"
              style={{
                top: `${(3 - smoothProgress) * 100}vh`,
                boxShadow: '0 25px 40px rgba(0,0,0,0.55)'
              }}
            >
              <LayerJurassic 
                layer={GEOLOGIC_LAYERS[3]}
                isActive={Math.round(smoothProgress) === 3}
                onFossilClick={setActiveSpecimen}
              />
            </div>

            {/* Layer 4: Precambrian Magma Dawn (4.0) */}
            <div 
              className="absolute inset-x-0 w-full h-full z-12"
              style={{
                top: `${(4 - smoothProgress) * 100}vh`,
                boxShadow: '0 25px 40px rgba(0,0,0,0.6)'
              }}
            >
              <LayerPrecambrian 
                layer={GEOLOGIC_LAYERS[4]}
                isActive={Math.round(smoothProgress) === 4}
                onFossilClick={setActiveSpecimen}
              />
            </div>

          </div>

          {/* ================= FIXED CONTROLLER CABINET DOCK ================= */}
          <LayerElevator 
            progress={smoothProgress}
            unlockedList={unlockedFossils}
            allFossils={allFossils}
            onOpenJournalItem={setActiveSpecimen}
            onJumpToProgress={handleJumpToProgress}
            onResetAll={handleResetCollects}
          />

          {/* ================= DETAILED SPEC SPECIMEN SPEC SHEET CARD ================= */}
          <CardModal 
            item={activeSpecimen}
            onClose={() => setActiveSpecimen(null)}
            meteorTriggered={meteorTriggered}
            onUnlock={handleUnlockSpecimen}
          />

        </div>
      )}
    </div>
  );
}

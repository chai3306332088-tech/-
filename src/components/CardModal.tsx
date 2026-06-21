/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FossilItem } from '../types';
import { soundSynth } from '../utils/audio';
import { X, Search, Award, Info, Heart } from 'lucide-react';

interface CardModalProps {
  item: FossilItem | null;
  onClose: () => void;
  meteorTriggered: boolean;
  onUnlock: (id: string) => void;
}

export default function CardModal({ item, onClose, meteorTriggered, onUnlock }: CardModalProps) {
  const [stampActive, setStampActive] = useState(false);

  useEffect(() => {
    if (item) {
      // Auto unlock discovery
      onUnlock(item.id);

      // If cretaceous and dinosaur, trigger stamp slam after a brief artistic delay!
      if (item.id === 'triceratops' || (item.type === 'dinosaur' && meteorTriggered)) {
        const timer = setTimeout(() => {
          setStampActive(true);
          soundSynth.playExtinctStamp();
        }, 600);
        return () => clearTimeout(timer);
      } else {
        setStampActive(false);
      }
    }
  }, [item, meteorTriggered]);

  if (!item) return null;

  const isDino = item.type === 'dinosaur';
  const isFossil = item.type === 'fossil';
  const isCamp = item.type === 'archaeology';
  const isOrigin = item.type === 'origin';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
        {/* Backdrop clickable close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Card Body */}
        <motion.div
          id="fossil-card-modal"
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#faf6ee] text-amber-950 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-[#e9e1d1] overflow-hidden flex flex-col z-10"
        >
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top Vintage Card Frame Header */}
          <div className="px-6 py-4 border-b-2 border-[#e9e1d1] flex items-center justify-between bg-[#f3ecdf]">
            <div className="flex items-center gap-2">
              {isDino && <Heart className="w-5 h-5 text-red-500" />}
              {isFossil && <Search className="w-5 h-5 text-sky-600" />}
              {isCamp && <Award className="w-5 h-5 text-amber-600" />}
              {isOrigin && <Info className="w-5 h-5 text-[#f59e0b]" />}
              <span className="text-xs font-mono font-bold tracking-wider text-amber-800 uppercase">
                {isDino ? '「史前活体观测」' : isFossil ? '「化石挖掘标本」' : isCamp ? '「地表工作站」' : '「生命本源细胞」'}
              </span>
            </div>
            <button
              onClick={() => {
                soundSynth.playClick();
                onClose();
              }}
              className="p-1 hover:bg-[#ebdcc5] rounded-full transition-colors duration-200 cursor-pointer"
            >
              <X className="w-5 h-5 text-amber-900" />
            </button>
          </div>

          {/* Scrollable spec sheets */}
          <div className="p-6 overflow-y-auto max-h-[75vh] relative flex-1">
            {/* Stamp Overlay for Extinct dinos */}
            <AnimatePresence>
              {stampActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                  <motion.div
                    initial={{ scale: 3, rotate: 35, opacity: 0 }}
                    animate={{ scale: 1, rotate: -12, opacity: 0.8 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                    className="border-8 border-red-600 text-red-600 font-extrabold text-4xl px-6 py-2 rounded-xl tracking-widest uppercase shadow-md select-none transform bg-[#faf6ee]/90"
                    style={{ fontFamily: 'monospace' }}
                  >
                    EXTINCT
                    <div className="text-xs text-center border-t border-red-600 mt-1 font-sans font-bold">
                      已灭绝 · 时代终结
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Title Block */}
            <div className="mb-4">
              <h3 className="text-2xl font-black tracking-tight text-amber-950">
                {item.name}
              </h3>
              {item.scientificName && (
                <p className="text-xs font-mono italic text-amber-700/80 mt-0.5">
                  {item.scientificName}
                </p>
              )}
            </div>

            {/* Depth and Era Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-3 py-1 bg-amber-900/10 border border-amber-950/10 text-amber-900 text-xs font-mono font-bold rounded-md">
                深层位置：-{item.depth} 米
              </span>
              <span className="px-3 py-1 bg-sky-900/10 border border-sky-950/10 text-sky-950 text-xs font-mono rounded-md">
                地质年代：{item.era}
              </span>
            </div>

            {/* Render Graphic Placeholder with flat papercut aesthetics */}
            <div className="aspect-video w-full rounded-xl bg-[#ecdfcc]/60 border-2 border-[#decbb4] mb-5 overflow-hidden flex items-center justify-center relative shadow-inner">
              <div className="absolute inset-0 opacity-[0.1] bg-cardboard bg-cover bg-center" />
              {/* Graphic illustrations representing biological specimens */}
              <div className="z-10 flex flex-col items-center justify-center p-4 text-center">
                {item.id === 'mammoth' && (
                  <div className="relative w-28 h-20 text-sky-800 flex items-center justify-center">
                    {/* Mammoth visual abstraction */}
                    <div className="absolute inset-4 border-2 border-dashed border-sky-500/40 rounded-full animate-spin [animation-duration:15s]" />
                    <svg className="w-20 h-16 fill-current" viewBox="0 0 100 80">
                      <path d="M10,60 C20,30 50,20 75,35 C85,40 90,50 95,65 C95,65 92,72 85,70 C80,68 83,55 75,50 C65,45 60,65 55,75 C52,78 40,78 35,75 L20,75 L20,65 Z" />
                      <path d="M78,42 C85,44 92,30 90,15 C88,25 80,35 78,42" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                  </div>
                )}
                {item.id === 'sabertooth' && (
                  <div className="text-amber-800">
                    <svg className="w-16 h-16 fill-current" viewBox="0 0 100 100">
                      <path d="M20,30 L80,30 L80,70 L60,70 L55,45 L45,45 L40,75 L20,70 Z" opacity="0.15" />
                      {/* Long sharp fangs */}
                      <path d="M48,45 L50,85 C50,85 53,88 54,80 L56,45 Z" fill="#fff" stroke="currentColor" strokeWidth="2" />
                      <path d="M38,45 L40,82 C40,82 43,85 44,77 L46,45 Z" fill="#fff" stroke="currentColor" strokeWidth="2" />
                      <circle cx="35" cy="40" r="4" />
                    </svg>
                  </div>
                )}
                {item.id === 'triceratops' && (
                  <div className="text-amber-800">
                    <svg className="w-24 h-16 fill-current" viewBox="0 0 100 60">
                      <path d="M10,45 C20,45 35,30 50,30 C65,30 85,38 90,48 C95,54 85,55 70,55 L30,55 Z" />
                      {/* Three horns and head frill */}
                      <path d="M35,32 L20,10 L30,28 L5,15 L25,32 L25,40 Z" fill="currentColor" />
                    </svg>
                  </div>
                )}
                {item.id === 'tyrannosaurus' && (
                  <div className="text-red-900">
                    <svg className="w-18 h-18 fill-current" viewBox="0 0 100 100">
                      <path d="M15,40 L75,40 C85,40 90,50 90,65 L10,65 Z" />
                      <path d="M15,40 C15,40 30,10 50,15 L70,40 Z" />
                      {/* Sharp teeth lines */}
                      <path d="M20,40 L22,46 L24,40 L26,46 L28,40 L30,46 L32,40 L34,46 L36,40 M45,40 L47,46 L49,40 L51,46 L53,40" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                )}
                {item.id === 'brachiosaurus' && (
                  <div className="text-emerald-800">
                    <svg className="w-20 h-20 fill-current" viewBox="0 0 100 100">
                      <path d="M30,90 L40,65 L45,90 M70,90 L65,65 M40,65 C50,55 70,55 75,65" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
                      {/* Exceedingly long neck */}
                      <path d="M40,65 L25,12 C24,8 18,8 16,15 L20,35 Z" fill="currentColor" />
                    </svg>
                  </div>
                )}
                {item.id === 'pterosaur' && (
                  <div className="text-teal-800">
                    <svg className="w-24 h-12 fill-current animate-pulse" viewBox="0 0 120 60">
                      <path d="M10,25 C40,-5 60,30 110,25 C80,35 60,35 10,25 Z" />
                      <path d="M60,28 L55,50 L65,50 Z" />
                    </svg>
                  </div>
                )}
                {item.id === 'luca' && (
                  <div className="text-[#d97706]/80 flex gap-2">
                    <div className="w-10 h-10 rounded-full border-4 border-dashed border-current flex items-center justify-center animate-spin [animation-duration:10s]">
                      <div className="w-4 h-4 rounded-full bg-current" />
                    </div>
                  </div>
                )}
                {item.id === 'primordial-soup' && (
                  <div className="text-[#f59e0b] flex gap-1 items-center">
                    <span className="w-5 h-5 rounded-full bg-current/40 animate-bounce" />
                    <span className="w-8 h-8 rounded-full bg-current/30 animate-pulse" />
                    <span className="w-4 h-4 rounded-full bg-current/50" />
                  </div>
                )}

                <span className="text-xs font-mono font-bold tracking-wider mt-4 text-amber-800/60 block bg-amber-950/5 px-2 py-0.5 rounded-full">
                  [ 地层发掘：{item.graphicType.toUpperCase().replace('_', ' ')} ]
                </span>
              </div>
            </div>

            {/* Description Narrative */}
            <div className="p-4 bg-amber-950/5 rounded-xl border border-amber-900/10 mb-5 text-sm leading-relaxed text-amber-900">
              {item.description}
            </div>

            {/* Spec Sheet Details list */}
            <div>
              <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-amber-800 mb-2 border-b border-amber-900/10 pb-1">
                【 详细学术数据档案 】
              </h4>
              <ul className="space-y-2 text-xs">
                {item.details.map((detail, idx) => (
                  <li key={idx} className="flex gap-2 text-amber-900/90 leading-normal">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-800/70 shrink-0 mt-1.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card Footer controls */}
          <div className="px-6 py-4 bg-[#f3ecdf] border-t-2 border-[#e9e1d1] text-center">
            <button
              onClick={() => {
                soundSynth.playClick();
                onClose();
              }}
              className="px-6 py-2 bg-amber-900 text-[#faf6ee] rounded-lg shadow-md hover:bg-amber-800 transition-transform active:scale-95 text-xs font-mono font-bold tracking-widest uppercase cursor-pointer"
            >
              收录进标本志
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

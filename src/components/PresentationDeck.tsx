import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronLeft, ChevronRight, Download, Printer, 
  Presentation, FileText, Settings, Layers, Cpu, Database, 
  Play, Compass, ArrowRight, Check, AlertCircle, Info
} from 'lucide-react';

interface PresentationDeckProps {
  activeTheme: 'white' | 'amber' | 'green';
}

export default function PresentationDeck({ activeTheme }: PresentationDeckProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  const totalSlides = 12;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const triggerPrint = () => {
    window.print();
  };

  // SVG and Content definitions for each slide
  const renderSlideContent = (index: number) => {
    switch (index) {
      case 0: // Title Slide
        return (
          <div className="flex flex-col lg:flex-row h-full items-center justify-between gap-8 p-4 lg:p-12">
            <div className="flex-1 space-y-8 text-left max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs tracking-widest font-mono uppercase">
                <span className="w-2 h-2 bg-green-400 animate-pulse" />
                Pitch Deck
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-8 bg-green-500 inline-block" />
                  <h1 className="text-4xl lg:text-6xl font-sans font-black tracking-tight text-white uppercase leading-none">
                    Continuous <br/>
                    Fiber <br/>
                    Nonplanary <br/>
                    Fabrication
                  </h1>
                </div>
                <p className="text-lg text-neutral-400 font-sans tracking-wide">
                  Automated composites fabrication platform
                </p>
              </div>
              <div className="pt-6 border-t border-neutral-800">
                <p className="text-xl font-medium text-green-400 font-sans">
                  Pushing composite manufacturing further
                </p>
              </div>
              <div className="flex items-center text-xs text-neutral-500 font-mono space-x-4">
                <span>/ KINETRONIKA</span>
                <span>•</span>
                <span>BUILD 2026</span>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md aspect-square bg-neutral-900/50 border border-neutral-800 p-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-green-500/5 to-transparent pointer-events-none" />
              {/* Dynamic Schematics of the printer */}
              <svg viewBox="0 0 400 400" className="w-full h-full text-green-500/80 stroke-current" fill="none" strokeWidth="1.5">
                {/* Frame */}
                <rect x="50" y="50" width="300" height="300" rx="0" className="opacity-20" strokeDasharray="4 4" />
                {/* 3D printer gantry rails */}
                <line x1="50" y1="90" x2="350" y2="90" className="opacity-40" />
                <line x1="50" y1="95" x2="350" y2="95" className="opacity-20" />
                {/* Printhead carriage */}
                <g className="animate-pulse">
                  <rect x="170" y="75" width="60" height="30" rx="0" fill="#171717" />
                  <path d="M190,105 L200,125 L210,105 Z" fill="#15803d" />
                  <rect x="198.5" y="123.5" width="3" height="3" fill="#22c55e" />
                </g>
                {/* Dual Extruder feed spool lines */}
                <path d="M100,50 Q120,80 180,85" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
                <path d="M300,50 Q280,80 220,85" strokeWidth="1" strokeDasharray="2 2" className="opacity-40" />
                {/* Rotating build table */}
                <ellipse cx="200" cy="280" rx="90" ry="25" fill="#171717" className="opacity-80" />
                <ellipse cx="200" cy="280" rx="90" ry="25" strokeDasharray="5 5" />
                <ellipse cx="200" cy="285" rx="90" ry="25" className="opacity-30" />
                {/* 5-axis rotating base indicator */}
                <path d="M140,295 C140,320 260,320 260,295" strokeWidth="1" strokeDasharray="3 3" className="opacity-50" />
                <path d="M185,280 C185,270 215,270 215,280" strokeWidth="1" />
                {/* Print part representation */}
                <path d="M180,280 L185,210 Q200,200 215,210 L220,280 Z" fill="rgba(34, 197, 94, 0.15)" strokeWidth="2" strokeLinejoin="round" />
                {/* Holographic scanning grids */}
                <line x1="50" y1="210" x2="350" y2="210" strokeDasharray="1 8" className="opacity-60" />
                {/* Text specs */}
                <text x="60" y="335" className="text-[10px] font-mono fill-neutral-500 stroke-none">AXIS: X/Y/Z/U/V</text>
                <text x="250" y="335" className="text-[10px] font-mono fill-neutral-500 stroke-none text-right">RPM: 3200 MAX</text>
              </svg>
            </div>
          </div>
        );

      case 1: // Slide 2: New Way for Composites
        return (
          <div className="flex flex-col lg:flex-row h-full items-center justify-between gap-8 p-4 lg:p-12">
            <div className="flex-1 space-y-6 text-left max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-6 bg-green-500 inline-block" />
                <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                  New way for composites
                </h2>
              </div>
              <div className="space-y-4 text-neutral-300 font-sans leading-relaxed text-sm lg:text-base">
                <p className="border-l-2 border-green-500 pl-4 py-1 text-green-400 font-medium">
                  We believe that the future is built with composite materials - so we created a technology that can reveal their true potential
                </p>
                <p>
                  Introducing <strong className="text-white font-semibold">Continuous Fiber Nonplanary Fabrication (CFNF)</strong> - an additive way to create complex parts with super properties, eliminating the need for custom molds and weeks of waiting
                </p>
              </div>

              {/* Exploded annotations visual stack */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <div className="bg-neutral-900/60 p-3 border border-neutral-800">
                  <div className="text-xs text-neutral-500 font-mono mb-1">LAYER 01</div>
                  <div className="font-bold text-neutral-200 text-sm">Planar Base</div>
                  <div className="text-xs text-neutral-400 mt-1">Foundational starting platform interface layer</div>
                </div>
                <div className="bg-neutral-900/60 p-3 border border-neutral-800">
                  <div className="text-xs text-green-500 font-mono mb-1">LAYER 02</div>
                  <div className="font-bold text-green-400 text-sm">Nonplanar Fiber</div>
                  <div className="text-xs text-neutral-400 mt-1">High-strength continuous basalt/carbon reinforcement lines</div>
                </div>
                <div className="bg-neutral-900/60 p-3 border border-neutral-800">
                  <div className="text-xs text-neutral-500 font-mono mb-1">LAYER 03</div>
                  <div className="font-bold text-neutral-200 text-sm">Smooth Top Layer</div>
                  <div className="text-xs text-neutral-400 mt-1">Curved multi-axial top shell for pristine surface finish</div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md aspect-square bg-neutral-900/40 border border-neutral-800/80 p-6 flex items-center justify-center relative">
              <svg viewBox="0 0 400 400" className="w-full h-full text-green-400 stroke-current" fill="none" strokeWidth="1.5">
                {/* Background Grid */}
                <g className="opacity-10" stroke="white" strokeWidth="0.5">
                  <path d="M 0 100 L 400 100 M 0 200 L 400 200 M 0 300 L 400 300 M 100 0 L 100 400 M 200 0 L 200 400 M 300 0 L 300 400" />
                </g>
                
                {/* 3D Part illustration with three distinct layered annotations */}
                {/* 1. Planar Base */}
                <g className="opacity-35">
                  <path d="M 80 280 L 320 280 L 270 330 L 30 330 Z" fill="#1f1f1f" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="280" y="315" className="text-[10px] font-mono fill-neutral-400 stroke-none font-bold">PLANAR BASE</text>
                  <line x1="275" y1="310" x2="200" y2="305" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" />
                </g>

                {/* 2. Nonplanar Fiber Reinforcement */}
                <g>
                  {/* Curved woven fibers */}
                  <path d="M 90 220 Q 150 160 210 220 T 330 220 L 280 270 Q 200 210 140 270 Z" fill="rgba(34, 197, 94, 0.1)" stroke="#22c55e" strokeWidth="2" />
                  {/* Individual fiber lines */}
                  <path d="M 95 215 Q 150 162 205 215" stroke="#22c55e" strokeWidth="2.5" />
                  <path d="M 115 215 Q 170 162 225 215" stroke="#22c55e" strokeWidth="2.5" />
                  <path d="M 135 215 Q 190 162 245 215" stroke="#22c55e" strokeWidth="2.5" />
                  <path d="M 155 215 Q 210 162 265 215" stroke="#22c55e" strokeWidth="2.5" />
                  <text x="260" y="150" className="text-[11px] font-mono fill-green-400 stroke-none font-black uppercase">NONPLANAR FIBER</text>
                  <line x1="255" y1="155" x2="180" y2="195" stroke="#22c55e" strokeWidth="1.2" />
                  <circle cx="180" cy="195" r="3.5" fill="#22c55e" />
                </g>

                {/* 3. Nonplanar Smooth Top Layers */}
                <g className="opacity-90">
                  <path d="M 100 150 Q 160 100 220 150 T 340 150 L 330 170 Q 220 170 100 170 Z" fill="#2d2d2d" stroke="#888888" strokeWidth="1" />
                  <text x="60" y="80" className="text-[10px] font-mono fill-neutral-300 stroke-none font-bold">SMOOTH POLYMER SHELL</text>
                  <line x1="160" y1="85" x2="190" y2="120" stroke="#888888" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="190" cy="120" r="3" fill="#888888" />
                </g>
              </svg>
            </div>
          </div>
        );

      case 2: // Slide 3: Our Platform
        return (
          <div className="flex flex-col h-full justify-between p-4 lg:p-12">
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-6 bg-green-500 inline-block" />
                <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                  Our Platform
                </h2>
              </div>
              <p className="text-neutral-400 max-w-2xl text-sm">
                An end-to-end proprietary hardware & software ecosystem engineered for rapid, fully-automated continuous composite manufacturing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-auto">
              <div className="bg-neutral-900/60 p-5 border border-neutral-800/80 hover:border-green-500/30 transition-all text-left space-y-3">
                <div className="w-10 h-10 bg-green-500/10 flex items-center justify-center text-green-400">
                  <Cpu size={20} />
                </div>
                <h3 className="font-bold text-white text-base">1. Structure Design Software</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Developing proprietary algorithms to calculate and optimize a part's internal continuous fiber trajectory based on actual stress vectors
                </p>
              </div>

              <div className="bg-neutral-900/60 p-5 border border-neutral-800/80 hover:border-green-500/30 transition-all text-left space-y-3">
                <div className="w-10 h-10 bg-green-500/10 flex items-center justify-center text-green-400">
                  <Settings size={20} />
                </div>
                <h3 className="font-bold text-white text-base">2. Slicing & Simulation</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Adaptive 5-axis nonplanar slicing with precise fiber density control and mechanical structural safety simulations prior to print initiation
                </p>
              </div>

              <div className="bg-neutral-900/60 p-5 border border-neutral-800/80 hover:border-green-500/30 transition-all text-left space-y-3">
                <div className="w-10 h-10 bg-green-500/10 flex items-center justify-center text-green-400">
                  <Layers size={20} />
                </div>
                <h3 className="font-bold text-white text-base">3. Fabrication Machines</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Multi-axis 3D printers and custom kinematic robotic structures equipped with highly robust dual-feed coextrusion printheads
                </p>
              </div>

              <div className="bg-neutral-900/60 p-5 border border-neutral-800/80 hover:border-green-500/30 transition-all text-left space-y-3">
                <div className="w-10 h-10 bg-green-500/10 flex items-center justify-center text-green-400">
                  <Database size={20} />
                </div>
                <h3 className="font-bold text-white text-base">4. Digital Material Library</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Curated filaments and continuous fiber combinations (Carbon, Basalt) engineered and laboratory tested for optimal interfacial adhesion
                </p>
              </div>
            </div>

            <div className="text-xs text-neutral-500 font-mono text-left pt-4 border-t border-neutral-900">
              KINETRONIKA TECHNOLOGY STACK • LICENSED PATENTS PENDING
            </div>
          </div>
        );

      case 3: // Slide 4: Fast Composites Workflow
        return (
          <div className="flex flex-col h-full justify-between p-4 lg:p-12">
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-6 bg-green-500 inline-block" />
                <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                  Fast Composites Workflow
                </h2>
              </div>
              <p className="text-neutral-400 text-sm max-w-3xl leading-relaxed">
                Classic composite manufacturing is expensive, slow, labor-intensive, and requires costly custom steel or aluminum molds With <strong className="text-green-400">CFNF</strong>, we cut the entire part production cycle from <span className="text-white font-bold underline">weeks to mere hours</span>
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 my-auto">
              {/* Step 1 */}
              <div className="flex-1 w-full max-w-xs bg-neutral-900/50 p-6 border border-neutral-800 flex flex-col items-center text-center relative">
                <div className="absolute top-4 left-4 text-xs font-mono text-neutral-600 font-bold">STAGE 01</div>
                <div className="w-12 h-12 bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-white text-base mb-2">Design Optimization</h3>
                <p className="text-xs text-neutral-400">
                  Import standard CAD model Calculate stress-aligned internal basalt path vectors
                </p>
              </div>

              {/* Connecting arrow 1 */}
              <div className="hidden md:flex text-green-500">
                <ArrowRight size={24} />
              </div>

              {/* Step 2 */}
              <div className="flex-1 w-full max-w-xs bg-neutral-900/50 p-6 border border-neutral-800 flex flex-col items-center text-center relative">
                <div className="absolute top-4 left-4 text-xs font-mono text-neutral-600 font-bold">STAGE 02</div>
                <div className="w-12 h-12 bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-white text-base mb-2">Adaptive Slicing</h3>
                <p className="text-xs text-neutral-400">
                  Generate 5-axis multiaxial continuous trajectory paths with collision-avoidance check
                </p>
              </div>

              {/* Connecting arrow 2 */}
              <div className="hidden md:flex text-green-500">
                <ArrowRight size={24} />
              </div>

              {/* Step 3 */}
              <div className="flex-1 w-full max-w-xs bg-green-950/20 p-6 border border-green-500/30 flex flex-col items-center text-center relative">
                <div className="absolute top-4 left-4 text-xs font-mono text-green-400/50 font-bold">STAGE 03</div>
                <div className="w-12 h-12 bg-green-500 text-black flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-white text-base mb-2">Multi-Axis Printing</h3>
                <p className="text-xs text-neutral-300">
                  Autonomous 3D extrusion on 5-axis rotating stage Fully cured ready-to-use part in 24 hrs
                </p>
              </div>
            </div>

            <div className="bg-neutral-900/30 border border-neutral-800/80 p-3 text-xs text-neutral-400 text-center">
              💡 <span className="font-semibold text-white">Efficiency gains:</span> Traditional cycle requires 14-28 days CFNF average batch requires <span className="text-green-400 font-bold">less than 18 hours</span>
            </div>
          </div>
        );

      case 4: // Slide 5: Comparison 1
        return (
          <div className="flex flex-col h-full justify-between p-4 lg:p-12">
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-6 bg-green-500 inline-block" />
                <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                  Technology Comparisons
                </h2>
              </div>
              <p className="text-neutral-400 text-sm">
                How CFNF Printing stacks up against classic aerospace-grade autoclave prepreg layups and high-precision CNC metal milling
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
              {/* Prepreg */}
              <div className="bg-neutral-900/50 p-5 border border-neutral-800 space-y-4 text-left">
                <div className="inline-block px-2.5 py-0.5 bg-neutral-800 text-neutral-300 text-[10px] font-mono">
                  Fabric/Prepreg
                </div>
                <ul className="space-y-2.5 text-xs text-neutral-400">
                  <li className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span>Strength</span>
                    <strong className="text-neutral-200">Up to 1000 MPa</strong>
                  </li>
                  <li className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span>Density</span>
                    <strong className="text-neutral-200">1.5 g/cm³</strong>
                  </li>
                  <li className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span>Lead Time</span>
                    <strong className="text-red-400">1 - 4 Weeks</strong>
                  </li>
                  <li className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span>Anisotropy</span>
                    <span className="text-neutral-400 text-right">Fixed by fabric weave</span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <span>Molds</span>
                    <span className="text-red-400 text-right font-medium">Mandatory</span>
                  </li>
                </ul>
              </div>

              {/* CNC Milling */}
              <div className="bg-neutral-900/50 p-5 border border-neutral-800 space-y-4 text-left">
                <div className="inline-block px-2.5 py-0.5 bg-neutral-800 text-neutral-300 text-[10px] font-mono">
                  Metal CNC Milling
                </div>
                <ul className="space-y-2.5 text-xs text-neutral-400">
                  <li className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span>Strength</span>
                    <strong className="text-neutral-200">600 (Al) / 1400 (Fe) MPa</strong>
                  </li>
                  <li className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span>Density</span>
                    <strong className="text-red-400 font-semibold">2.7 (Al) / 7.8 (Fe) g/cm³</strong>
                  </li>
                  <li className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span>Lead Time</span>
                    <strong className="text-neutral-200">1 - 7 Days</strong>
                  </li>
                  <li className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span>Structure</span>
                    <span className="text-neutral-400 text-right">Isotropic solid metal</span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <span>Tooling</span>
                    <span className="text-neutral-400 text-right">Multiple tools required</span>
                  </li>
                </ul>
              </div>

              {/* CFNF Printing */}
              <div className="bg-green-950/20 p-5 border border-green-500/30 space-y-4 text-left">
                <div className="inline-block px-2.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-mono font-bold">
                  CFNF Printing
                </div>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex justify-between border-b border-green-500/10 pb-1.5">
                    <span>Strength</span>
                    <strong className="text-green-400">Up to 1000 MPa (multi-dir)</strong>
                  </li>
                  <li className="flex justify-between border-b border-green-500/10 pb-1.5">
                    <span>Density</span>
                    <strong className="text-green-400 font-bold">1.3 g/cm³ (2x lighter than Al)</strong>
                  </li>
                  <li className="flex justify-between border-b border-green-500/10 pb-1.5">
                    <span>Lead Time</span>
                    <strong className="text-green-400">Up to 24 Hours</strong>
                  </li>
                  <li className="flex justify-between border-b border-green-500/10 pb-1.5">
                    <span>Anisotropy</span>
                    <span className="text-green-300 text-right">Fully custom programmable</span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <span>Molds</span>
                    <span className="text-green-400 text-right font-bold">None (Fully Direct)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-xs text-neutral-500 text-center">
              Basalt fiber composite parts printed in CFNF demonstrate identical structural rigidity to aluminum while achieving a <span className="text-green-400 font-semibold">50%+ mass savings</span>.
            </div>
          </div>
        );

      case 5: // Slide 6: Automated Fiber Placement vs CFNF
        return (
          <div className="flex flex-col h-full justify-between p-4 lg:p-12">
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-6 bg-green-500 inline-block" />
                <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                  Automated Fiber Placement vs CFNF
                </h2>
              </div>
              <p className="text-neutral-400 text-sm">
                AFP is excellent for massive, simple shapes CFNF is designed for intricate structural parts with full localized control
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto">
              <div className="bg-neutral-900/40 p-6 border border-neutral-800 text-left space-y-4">
                <h3 className="font-bold text-neutral-400 text-lg border-b border-neutral-800 pb-2">
                  ❌ Traditional AFP System
                </h3>
                <ul className="space-y-2 text-xs text-neutral-400">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Requires custom-shaped structural molds or foundational base plates
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Limited strictly to simple, flat, or cylindrical panel-type geometries
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Fails to print complex intersecting features or mechanical mounting bosses
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Cannot dynamically change local fiber volume fraction density
                  </li>
                </ul>
              </div>

              <div className="bg-green-950/10 p-6 border border-green-500/20 text-left space-y-4">
                <h3 className="font-bold text-green-400 text-lg border-b border-green-500/20 pb-2">
                  ✅ Kinetronika CFNF Platform
                </h3>
                <ul className="space-y-2 text-xs text-neutral-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Requires zero custom molds or specialized tooling setups
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Completely free 5-axis multiaxial geometry printing structures
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Fully integrates mechanical mounting bosses, holes, and rib features
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Dynamic real-time software control over fiber layout density
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Reduces total print-to-deploy duration to under 24 hours
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-xs text-neutral-500 font-mono text-left">
              AFP = AEROSPACE WINGS/FUSELAGES • CFNF = HIGHLY OPTIMIZED FUNCTIONAL ENGINEERING PARTS
            </div>
          </div>
        );

      case 6: // Slide 7: CFNF in Numbers (Table)
        return (
          <div className="flex flex-col h-full justify-between p-4 lg:p-12">
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-6 bg-green-500 inline-block" />
                <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                  CFNF In Numbers
                </h2>
              </div>
              <p className="text-neutral-400 text-sm">
                Direct benchmark metrics comparison with state-of-the-art structural materials
              </p>
            </div>

            <div className="overflow-x-auto my-auto border border-neutral-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-900 text-neutral-300 border-b border-neutral-800 font-mono">
                    <th className="p-3">Material</th>
                    <th className="p-3">Tensile Strength</th>
                    <th className="p-3">Density</th>
                    <th className="p-3">Production Cost</th>
                    <th className="p-3 text-center">Multi-Directional Strength?</th>
                    <th className="p-3 text-center">Complex Geometry?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-400">
                  <tr>
                    <td className="p-3 font-medium text-neutral-200">Titanium Alloys (Ti-6Al-4V)</td>
                    <td className="p-3">1200 MPa</td>
                    <td className="p-3">4.5 g/cm³</td>
                    <td className="p-3">●●● (Very High)</td>
                    <td className="p-3 text-center text-green-400">✓</td>
                    <td className="p-3 text-center text-green-400">✓</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-neutral-200">Structural Steel</td>
                    <td className="p-3">1400 MPa</td>
                    <td className="p-3">7.8 g/cm³</td>
                    <td className="p-3">●● (Medium)</td>
                    <td className="p-3 text-center text-green-400">✓</td>
                    <td className="p-3 text-center text-green-400">✓</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-neutral-200">Aluminum 6061-T6</td>
                    <td className="p-3">600 MPa</td>
                    <td className="p-3">2.7 g/cm³</td>
                    <td className="p-3">●● (Medium)</td>
                    <td className="p-3 text-center text-green-400">✓</td>
                    <td className="p-3 text-center text-green-400">✓</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-neutral-200">Fabric/Prepreg Carbon Epoxies</td>
                    <td className="p-3">1000 MPa</td>
                    <td className="p-3">1.5 g/cm³</td>
                    <td className="p-3">●●● (Very High)</td>
                    <td className="p-3 text-center text-green-400">✓</td>
                    <td className="p-3 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-neutral-200">Printed Composites (fibreseek)</td>
                    <td className="p-3">900 MPa</td>
                    <td className="p-3">1.3 g/cm³</td>
                    <td className="p-3">● (Low)</td>
                    <td className="p-3 text-center text-red-500">✗</td>
                    <td className="p-3 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="bg-green-950/20 text-green-300 font-semibold border-t border-green-500/30">
                    <td className="p-3 text-white font-bold">CFNF Printed Polymer (Kinetronika)</td>
                    <td className="p-3 text-white font-bold">1000 MPa</td>
                    <td className="p-3 text-white font-bold">1.3 g/cm³</td>
                    <td className="p-3 text-green-400">◯ (Ultra Low)</td>
                    <td className="p-3 text-center text-green-400">✓</td>
                    <td className="p-3 text-center text-green-400">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-neutral-500 font-mono text-center">
              ◯ INDICATES LEAST EXPENSIVE • DATA ACQUIRED FROM EXPERIMENTAL RIG TESTING
            </div>
          </div>
        );

      case 7: // Slide 8: Optimised continuous fiber layout
        return (
          <div className="flex flex-col lg:flex-row h-full items-center justify-between gap-8 p-4 lg:p-12">
            <div className="flex-1 space-y-6 text-left max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-6 bg-green-500 inline-block" />
                <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                  Optimised continuous fiber layout
                </h2>
              </div>
              <div className="space-y-4 text-neutral-300 font-sans leading-relaxed text-sm lg:text-base">
                <p className="text-green-400 font-medium">
                  Composite parts are structurally anisotropic—meaning fiber directions are absolutely crucial in determining a part’s eventual load capacity
                </p>
                <p>
                  With CFNF, our slicing software generates a custom layout for every single structural part We lay down continuous basalt fibers directly along the calculated stress lines, minimizing weight and material costs while maximizing strength
                </p>
                <div className="pt-4 border-t border-neutral-800">
                  <p className="text-xs text-neutral-400 font-mono italic">
                    Presented below: nonplanar printed high-performance basalt fiber reinforced drone fuselage structure
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md aspect-square bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="text-xs font-mono text-green-500">FIBER_VOLUME_FRACTION: 45%</div>
              <svg viewBox="0 0 300 200" className="w-full h-40 text-green-400" fill="none" strokeWidth="1.5">
                {/* Simulated structural basalt fiber layout pathing */}
                <path d="M 20 100 Q 80 40, 150 100 T 280 100" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
                <path d="M 20 80 Q 80 20, 150 80 T 280 80" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
                <path d="M 20 120 Q 80 60, 150 120 T 280 120" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Compaction roller vector pathing */}
                <circle cx="150" cy="100" r="16" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth="1.5" />
                <line x1="150" y1="100" x2="150" y2="60" stroke="#22c55e" strokeWidth="1.5" />
                <text x="150" y="50" className="text-[9px] font-mono fill-green-400 stroke-none text-center" textAnchor="middle">ROLLER COMPACTION</text>
                
                {/* Basalt fiber filament coming from spool */}
                <path d="M 120 10 Q 130 50, 150 84" stroke="#888888" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
              <div className="text-xs font-mono text-neutral-500 text-right">STRESS_ALIGNMENT_INDEX: 0.982 (EXCELLENT)</div>
            </div>
          </div>
        );

      case 8: // Slide 9: Full Multiaxial layering control
        return (
          <div className="flex flex-col lg:flex-row h-full items-center justify-between gap-8 p-4 lg:p-12">
            <div className="flex-1 space-y-6 text-left max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-6 bg-green-500 inline-block" />
                <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                  Full Multiaxial layering control
                </h2>
              </div>
              <p className="text-neutral-300 font-sans text-sm lg:text-base leading-relaxed">
                Our custom nonplanar slicing engine is designed from the ground up to support highly complex multi-axis continuous fiber print runs
              </p>
              <div className="space-y-3 font-mono text-xs text-neutral-400">
                <div className="flex items-center space-x-2.5">
                  <span className="w-1.5 h-1.5 bg-green-400" />
                  <span>Real-time adaptive layer thickness variation (0.1mm - 0.8mm)</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="w-1.5 h-1.5 bg-green-400" />
                  <span>Full 5-axis collision prevention matrix modeling</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="w-1.5 h-1.5 bg-green-400" />
                  <span>Interactive nozzle pitch & roll angle adjustment on curves</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md aspect-square bg-neutral-900/60 border border-neutral-800 p-6 flex items-center justify-center relative">
              <svg viewBox="0 0 300 300" className="w-full h-full text-green-500" fill="none" strokeWidth="1.5">
                {/* 5-axis coordinates rotation sphere */}
                <circle cx="150" cy="150" r="90" className="opacity-15" strokeDasharray="3 3" />
                <ellipse cx="150" cy="150" rx="90" ry="25" className="opacity-15" strokeDasharray="3 3" />
                <ellipse cx="150" cy="150" rx="25" ry="90" className="opacity-15" strokeDasharray="3 3" />
                
                {/* Nozzle angle indicators */}
                <line x1="150" y1="150" x2="210" y2="90" stroke="#22c55e" strokeWidth="2" />
                <circle cx="210" cy="90" r="4" fill="#22c55e" />
                <text x="220" y="85" className="text-[10px] font-mono fill-green-400 stroke-none">NOZZLE ROLL: 22°</text>
                
                <line x1="150" y1="150" x2="100" y2="220" stroke="#888888" strokeWidth="1.5" />
                <circle cx="100" cy="220" r="3" fill="#888888" />
                <text x="75" y="235" className="text-[10px] font-mono fill-neutral-400 stroke-none">STAGE PITCH: 14°</text>

                {/* Center printable component */}
                <path d="M 130 150 Q 150 130, 170 150 L 160 180 Q 150 170, 140 180 Z" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        );

      case 9: // Slide 10: AUTOCOMPOSITE Printhead
        return (
          <div className="flex flex-col lg:flex-row h-full items-center justify-between gap-8 p-4 lg:p-12">
            <div className="flex-1 space-y-6 text-left max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-6 bg-green-500 inline-block" />
                <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                  AUTOCOMPOSITE
                </h2>
              </div>
              <p className="text-green-400 font-mono text-xs uppercase tracking-wider">
                Proprietary Continuous Fiber Coextrusion Printhead
              </p>
              <div className="space-y-3.5 font-sans text-sm text-neutral-300">
                <p>
                  Our high-performance hardware coextrusion system enables simultaneous multi-material deposition with dynamic curing
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs text-neutral-400">
                  <li className="flex items-center space-x-2 bg-neutral-900/60 p-2.5 border border-neutral-800">
                    <span className="text-green-400">✓</span>
                    <span>Max Printing Temp: 450°C</span>
                  </li>
                  <li className="flex items-center space-x-2 bg-neutral-900/60 p-2.5 border border-neutral-800">
                    <span className="text-green-400">✓</span>
                    <span>High-Temp Materials</span>
                  </li>
                  <li className="flex items-center space-x-2 bg-neutral-900/60 p-2.5 border border-neutral-800">
                    <span className="text-green-400">✓</span>
                    <span>Water Cooled System</span>
                  </li>
                  <li className="flex items-center space-x-2 bg-neutral-900/60 p-2.5 border border-neutral-800">
                    <span className="text-green-400">✓</span>
                    <span>Dual Gear Extrusion</span>
                  </li>
                </ul>
                <div className="bg-green-950/20 p-3 border border-green-500/20 text-xs text-neutral-300">
                  ⚡ <strong>Rotating nozzle with compaction roller:</strong> Delivers print speeds up to <strong className="text-green-400">300% faster</strong> than traditional coextrusion heads
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md aspect-square bg-neutral-900/60 border border-neutral-800 p-6 flex items-center justify-center relative">
              <svg viewBox="0 0 300 300" className="w-full h-full text-green-500" fill="none" strokeWidth="1.5">
                {/* Complex printhead internal schematic representation */}
                <rect x="100" y="40" width="100" height="120" rx="4" fill="#1b1b1b" stroke="#ffffff" strokeWidth="1" className="opacity-45" />
                <rect x="110" y="50" width="35" height="40" rx="2" stroke="#888888" strokeWidth="1" />
                <circle cx="127.5" cy="70" r="10" stroke="#888888" />
                <line x1="110" y1="70" x2="145" y2="70" stroke="#888888" />
                
                <rect x="155" y="50" width="35" height="40" rx="2" stroke="#888888" strokeWidth="1" />
                <circle cx="172.5" cy="70" r="10" stroke="#888888" />
                <line x1="155" y1="70" x2="190" y2="70" stroke="#888888" />

                {/* Hotend block */}
                <rect x="120" y="180" width="60" height="40" rx="2" fill="#bf5b00" stroke="#bf5b00" strokeWidth="1" className="opacity-80" />
                <line x1="150" y1="160" x2="150" y2="180" stroke="#ffffff" strokeWidth="2" />
                
                {/* Cooling fan channels */}
                <path d="M 80 180 L 115 195 L 115 205 L 80 200 Z" fill="#2d2d2d" stroke="#888888" />
                <path d="M 220 180 L 185 195 L 185 205 L 220 200 Z" fill="#2d2d2d" stroke="#888888" />

                {/* Rotating Nozzle */}
                <path d="M 140 220 L 145 250 L 155 250 L 160 220 Z" fill="#111111" stroke="#22c55e" strokeWidth="2" />
                <circle cx="150" cy="250" r="2" fill="#22c55e" />
                
                {/* Compaction roller tool */}
                <circle cx="170" cy="254" r="8" fill="#555" stroke="#22c55e" strokeWidth="1.5" />
                <line x1="160" y1="220" x2="170" y2="246" stroke="#22c55e" strokeWidth="1" />
                
                <text x="150" y="280" className="text-[10px] font-mono fill-neutral-400 stroke-none text-center" textAnchor="middle">DUAL FEED ACTIVE</text>
              </svg>
            </div>
          </div>
        );

      case 10: // Slide 11: Machine specifications
        return (
          <div className="flex flex-col lg:flex-row h-full items-center justify-between gap-8 p-4 lg:p-12">
            <div className="flex-1 space-y-6 text-left max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-6 bg-green-500 inline-block" />
                <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                  Machine specifications
                </h2>
              </div>
              <p className="text-neutral-400 text-sm">
                Industrial hardware built to sustain precise, continuous nonplanar extrusion cycles over extended operating windows
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-neutral-800 pb-1 font-mono">
                    <span className="text-neutral-400">Build Dimensions</span>
                    <strong className="text-white">Ø300 × 700 mm</strong>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-1 font-mono">
                    <span className="text-neutral-400">Nozzle Max Temp</span>
                    <strong className="text-white">Up to 450°C</strong>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-1 font-mono">
                    <span className="text-neutral-400">Buildplate Max Temp</span>
                    <strong className="text-white">Up to 150°C</strong>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-1 font-mono">
                    <span className="text-neutral-400">Active Chamber Temp</span>
                    <strong className="text-white">Up to 150°C</strong>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-neutral-800 pb-1 font-mono">
                    <span className="text-neutral-400">Cooling Medium</span>
                    <strong className="text-white">Water + Compressed Air</strong>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-1 font-mono">
                    <span className="text-neutral-400">Plate Leveling</span>
                    <strong className="text-white">Fully Automated Digital</strong>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-1 font-mono">
                    <span className="text-neutral-400">Dynamic Compensation</span>
                    <strong className="text-white">Active Ringing + Temp</strong>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-1 font-mono">
                    <span className="text-neutral-400">Material Storage</span>
                    <strong className="text-white">Active Heated Dry-Box</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md aspect-square bg-neutral-900/40 border border-neutral-800 p-6 flex items-center justify-center relative">
              <svg viewBox="0 0 300 300" className="w-full h-full text-green-500/40" fill="none" stroke="currentColor" strokeWidth="1">
                {/* Multi-axis frame gantry structural outline */}
                <rect x="40" y="40" width="220" height="220" strokeWidth="1.5" stroke="#444" />
                <circle cx="150" cy="150" r="90" strokeDasharray="3 3" />
                <path d="M 40 40 L 90 90 L 210 90 L 260 40" stroke="#555" />
                <path d="M 40 260 L 90 210 L 210 210 L 260 260" stroke="#555" />
                <line x1="90" y1="90" x2="90" y2="210" stroke="#888" strokeWidth="1.5" />
                <line x1="210" y1="90" x2="210" y2="210" stroke="#888" strokeWidth="1.5" />
                
                {/* Dual linear Z-axis rods */}
                <line x1="150" y1="40" x2="150" y2="260" stroke="#22c55e" strokeWidth="2" className="opacity-70" />
                <text x="150" y="30" className="text-[10px] font-mono fill-green-400 stroke-none text-center" textAnchor="middle">Ø300x700 MASSIVE BUILD VOLUME</text>
              </svg>
            </div>
          </div>
        );

      case 11: // Slide 12: Contact Us
        return (
          <div className="flex flex-col lg:flex-row h-full items-center justify-between gap-8 p-4 lg:p-12">
            <div className="flex-1 space-y-8 text-left max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-6 bg-green-500 inline-block" />
                <h2 className="text-3xl font-sans font-black text-white uppercase tracking-tight">
                  Contact Us
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-neutral-300 font-sans leading-relaxed">
                  Join us in revolutionizing composite materials production Partner with Kinetronika to accelerate your workflow
                </p>
                <div className="p-6 bg-neutral-900/80 border border-neutral-800 inline-block text-left">
                  <div className="text-xs font-mono text-neutral-500 mb-2 uppercase">Official Inquiries & Support</div>
                  <a 
                    href="mailto:kinetronika@gmail.com" 
                    className="text-2xl lg:text-3xl font-mono text-green-400 hover:text-green-300 transition-all font-bold block"
                  >
                    kinetronika@gmail.com
                  </a>
                </div>
              </div>
              <div className="text-xs text-neutral-500 font-mono">
                / KINETRONIKA INC. • ALL RIGHTS RESERVED 2026
              </div>
            </div>

            <div className="flex-1 w-full max-w-md aspect-square bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="text-xs font-mono text-green-500">READY_FOR_INTEGRATION</div>
              {/* Symbolic high-tech vector pattern */}
              <svg viewBox="0 0 200 200" className="w-full h-40 text-green-500" fill="none" strokeWidth="1">
                <circle cx="100" cy="100" r="80" strokeDasharray="2 10" />
                <circle cx="100" cy="100" r="60" strokeDasharray="4 4" />
                <polygon points="100,30 160,140 40,140" stroke="#22c55e" strokeWidth="1.5" className="opacity-80" />
                <circle cx="100" cy="100" r="10" fill="#22c55e" />
              </svg>
              <div className="text-xs font-mono text-neutral-500 text-right">Nonplanary printed basalt composite fuselage part</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentThemeButtonClass = {
    white: 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-700',
    amber: 'bg-neutral-900 hover:bg-neutral-800 text-amber-400 border-amber-500/30',
    green: 'bg-neutral-900 hover:bg-neutral-800 text-green-400 border-green-500/30'
  };

  return (
    <>
      {/* Inline interactive trigger component within Autofiber-5 card */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <a
          id="btn-watch-video"
          href="https://www.youtube.com/shorts/ewG7G2PbRfY"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center space-x-2 px-4 py-2 border text-xs font-bold tracking-wider transition-all duration-200 uppercase ${currentThemeButtonClass[activeTheme]}`}
        >
          <Play size={15} className="fill-current" />
          <span>Watch Video</span>
        </a>

        <a
          id="btn-download-deck"
          href="https://drive.google.com/file/d/1XnsaSocU2XT4R39eLhM7xH5sKIavWbsB/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 text-xs font-bold tracking-wider transition-all duration-200 uppercase"
          title="Download the official continuous composite fabrication pitch deck from Google Drive"
        >
          <Download size={15} />
          <span>Download PDF Deck</span>
        </a>
      </div>

      {/* Full-screen immersive pitch deck modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="pitch-deck-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden"
          >
            {/* Modal header with navigation/actions */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-black/80 backdrop-blur z-10">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 bg-green-500 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-neutral-400">
                  KINETRONIKA // CONTINUOUS FIBER PITCH DECK
                </span>
              </div>

              {/* Deck actions */}
              <div className="flex items-center space-x-3">
                <a
                  id="deck-btn-download"
                  href="https://drive.google.com/file/d/1XnsaSocU2XT4R39eLhM7xH5sKIavWbsB/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-neutral-300 transition-all"
                  title="Download the official PDF presentation from Google Drive"
                >
                  <Download size={13} />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>

                <button
                  id="deck-btn-print"
                  onClick={triggerPrint}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-neutral-300 transition-all"
                  title="Generate a pixel-perfect PDF using native browser printing"
                >
                  <Printer size={13} />
                  <span className="hidden sm:inline">Save as PDF</span>
                </button>

                <button
                  id="deck-btn-close"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 bg-neutral-900 hover:bg-red-500/20 hover:text-red-400 border border-neutral-800 hover:border-red-500/30 text-neutral-400 transition-all"
                  title="Close presentation [ESC]"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            {/* Slide active viewport container */}
            <main className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-neutral-950/20 relative overflow-y-auto">
              {/* Absolute background page indicators for print */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-neutral-700 text-xs font-mono select-none pointer-events-none hidden lg:block">
                SLIDE {currentSlide + 1} OF {totalSlides}
              </div>

              {/* Dynamic Animated Content wrapper */}
              <div className="w-full max-w-5xl h-full max-h-[600px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full bg-black/40 border border-neutral-900/50 p-2 lg:p-6"
                  >
                    {renderSlideContent(currentSlide)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Quick Slide Navigation Arrows */}
              <button
                id="slide-nav-prev"
                onClick={prevSlide}
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-3 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700 transition-all z-10"
                title="Previous slide [Left Arrow]"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                id="slide-nav-next"
                onClick={nextSlide}
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-3 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700 transition-all z-10"
                title="Next slide [Right Arrow]"
              >
                <ChevronRight size={20} />
              </button>
            </main>

            {/* Interactive slide timeline & keyboard guide */}
            <footer className="px-6 py-4 border-t border-neutral-900 bg-black/80 backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 transition-all duration-300 ${
                      idx === currentSlide 
                        ? 'w-8 bg-green-500' 
                        : 'w-2 bg-neutral-800 hover:bg-neutral-700'
                    }`}
                    title={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="text-[10px] font-mono text-neutral-500 flex items-center space-x-6">
                <span className="hidden md:inline">⌨️ USE LEFT/RIGHT ARROWS OR ESC</span>
                <span>PAGE {currentSlide + 1} / {totalSlides}</span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden print layout stylesheet specifically designed to convert this beautifully into a multipage A4/letter PDF deck when printed */}
      <style>{`
        @media print {
          /* Hide everything except the print-only slide containers */
          body * {
            visibility: hidden !important;
          }
          #pitch-deck-modal, #pitch-deck-modal * {
            visibility: visible !important;
          }
          #pitch-deck-modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: black !important;
            color: white !important;
          }
          header, footer, #slide-nav-prev, #slide-nav-next {
            display: none !important;
          }
          /* Ensure crisp contrast */
          svg {
            stroke: #22c55e !important;
          }
        }
      `}</style>
    </>
  );
}

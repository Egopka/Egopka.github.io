import React, { useState, useEffect } from 'react';

interface ProjectStageProps {
  projectId: string;
  activeTheme: 'white' | 'amber' | 'green';
}

interface StageConfig {
  label: string;
  trl: number;
}

const STAGE_MAP: Record<string, StageConfig> = {
  "autofiber-5": { label: "Working prototype, TRL-8", trl: 8 },
  "acse-2": { label: "Final prototype, TRL-7", trl: 7 },
  "rabbit-80": { label: "Laboratory prototype, TRL-6", trl: 6 },
  "forceps-600": { label: "Laboratory prototype, TRL-6", trl: 6 },
  "km-1200": { label: "Technical nodes testing, TRL-5", trl: 5 },
  "crv-25": { label: "Laboratory prototype, TRL-6", trl: 6 }
};

export default function ProjectStage({ projectId, activeTheme }: ProjectStageProps) {
  const config = STAGE_MAP[projectId] || { label: "Development phase, TRL-4", trl: 4 };
  const targetPct = config.trl * 10; // TRL-8 = 80%, etc.
  
  const [progress, setProgress] = useState(0);
  const [spinnerIdx, setSpinnerIdx] = useState(0);
  
  // Retro spinner characters
  const spinnerChars = ['|', '/', '-', '\\'];

  // Theme-specific colors
  const themeColors = {
    white: {
      text: 'text-neutral-200',
      label: 'text-white font-bold',
      barFilled: 'text-white',
      barEmpty: 'text-neutral-800',
      spinner: 'text-neutral-400',
      system: 'text-neutral-500',
      border: 'border-neutral-800'
    },
    amber: {
      text: 'text-amber-500/90',
      label: 'text-amber-400 font-bold',
      barFilled: 'text-amber-500',
      barEmpty: 'text-amber-950/40',
      spinner: 'text-amber-400',
      system: 'text-amber-600/60',
      border: 'border-amber-950/50'
    },
    green: {
      text: 'text-green-500/90',
      label: 'text-green-400 font-bold',
      barFilled: 'text-green-500',
      barEmpty: 'text-green-950/40',
      spinner: 'text-green-400',
      system: 'text-green-600/60',
      border: 'border-green-950/50'
    }
  };

  const currentColors = themeColors[activeTheme];

  // Animate progress counting up on mount
  useEffect(() => {
    setProgress(0);
    let start = 0;
    const duration = 600; // ms
    const startTime = performance.now();

    let animFrame: number;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const pct = Math.min(elapsed / duration, 1);
      
      // Eased progress calculation
      const easedPct = 1 - Math.pow(1 - pct, 2); // Ease out quad
      const currentVal = Math.floor(easedPct * targetPct);
      setProgress(currentVal);

      if (pct < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setProgress(targetPct);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [projectId, targetPct]);

  // Spinner rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSpinnerIdx((prev) => (prev + 1) % spinnerChars.length);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Construct the retro progress bar blocks (10 blocks total)
  const totalBlocks = 10;
  const filledBlocksCount = Math.floor(progress / 10);
  const emptyBlocksCount = totalBlocks - filledBlocksCount;

  const filledPart = '█'.repeat(filledBlocksCount);
  const emptyPart = '░'.repeat(emptyBlocksCount);

  return (
    <div className={`mt-4 font-mono text-[11px] select-none tracking-wide flex flex-col gap-1.5`}>
      <div className={`flex items-center gap-1.5 ${currentColors.system}`}>
        <span className="font-bold">// PROJECT STAGE DIAGNOSTICS:</span>
        <span className={`inline-block w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-400 animate-pulse' : activeTheme === 'amber' ? 'bg-amber-400 animate-pulse' : 'bg-green-400 animate-pulse'}`} />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 bg-neutral-950/50 border border-neutral-900/50 p-2.5">
        {/* Progress bar blocks */}
        <div className="flex items-center gap-1 font-bold">
          <span className="opacity-70 text-[10px] uppercase mr-1">SYS_TRL</span>
          <span className={currentColors.system}>[</span>
          <span className={currentColors.barFilled}>{filledPart}</span>
          <span className={currentColors.barEmpty}>{emptyPart}</span>
          <span className={currentColors.system}>]</span>
          <span className={`min-w-[28px] text-right ml-1 ${currentColors.label}`}>
            {progress}%
          </span>
        </div>

        {/* Diagnostic stage text details */}
        <div className={`flex items-center gap-1 ${currentColors.text}`}>
          <span className={currentColors.system}>::</span>
          <span className="font-semibold">{config.label}</span>
          <span className="animate-pulse font-bold ml-0.5 opacity-80">█</span>
        </div>

        {/* Animated terminal spinner */}
        <div className={`ml-auto flex items-center gap-1.5 font-bold ${currentColors.spinner}`}>
          <span>[</span>
          <span className="inline-block w-2 text-center">{spinnerChars[spinnerIdx]}</span>
          <span>]</span>
        </div>
      </div>
    </div>
  );
}

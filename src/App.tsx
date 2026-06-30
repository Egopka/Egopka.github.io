import React, { useState, useEffect } from 'react';
import { PROFILE, PROJECTS, Project } from './data/portfolioData';
import AsciiRenderer from './components/AsciiRenderer';
import PresentationDeck from './components/PresentationDeck';
import ProjectStage from './components/ProjectStage';
import { AsciiLabSettings } from './types';
import { 
  Terminal, 
  Upload, 
  Settings, 
  Sliders, 
  HelpCircle, 
  RotateCcw, 
  FolderGit, 
  Code,
  X,
  Download,
  Play,
  Youtube,
  Twitter
} from 'lucide-react';

export default function App() {
  const [isLabMode, setIsLabMode] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'white' | 'amber' | 'green'>('white');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customStlBuffer, setCustomStlBuffer] = useState<ArrayBuffer | null>(null);
  const [customFileName, setCustomFileName] = useState<string>('');

  // Lab customization settings
  const [labSettings, setLabSettings] = useState<AsciiLabSettings>({
    modelType: 'custom',
    resolution: 130,
    ramp: 'standard',
    invert: true,
    colorized: false,
    autoRotate: true,
    rotSpeedX: 0.1,
    rotSpeedY: 0.25,
    rotSpeedZ: 0,
    wireframe: false,
    lightIntensity: 1.3
  });

  // Load custom STL file
  const handleStlUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCustomFile(file);
      setCustomFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          setCustomStlBuffer(e.target.result);
          setLabSettings(prev => ({ ...prev, modelType: 'custom' }));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const themeTextClass = {
    white: 'text-white selection:bg-neutral-800 selection:text-white',
    amber: 'text-amber-500 selection:bg-amber-950 selection:text-amber-500',
    green: 'text-green-500 selection:bg-green-950 selection:text-green-500'
  };

  const headerTextClass = {
    white: 'text-white/95',
    amber: 'text-amber-400',
    green: 'text-green-400'
  };

  const bioTextClass = {
    white: 'text-neutral-300',
    amber: 'text-amber-500/85',
    green: 'text-green-500/85'
  };

  const subtextClass = {
    white: 'text-neutral-400',
    amber: 'text-amber-600/70',
    green: 'text-green-600/70'
  };

  const projectTitleClass = {
    white: 'text-white group-hover:text-neutral-200',
    amber: 'text-amber-400 group-hover:text-amber-300',
    green: 'text-green-400 group-hover:text-green-300'
  };

  const linkTextClass = {
    white: 'text-neutral-100 hover:text-white border-b border-neutral-600 hover:border-neutral-200',
    amber: 'text-amber-400 hover:text-amber-300 border-b border-amber-600/50 hover:border-amber-400',
    green: 'text-green-400 hover:text-green-300 border-b border-green-600/50 hover:border-green-400'
  };

  const currentThemeButtonClass = {
    white: 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-700',
    amber: 'bg-neutral-900 hover:bg-neutral-800 text-amber-400 border-amber-500/30',
    green: 'bg-neutral-900 hover:bg-neutral-800 text-green-400 border-green-500/30'
  };

  const borderClass = {
    white: 'border-neutral-800/80',
    amber: 'border-amber-950/60',
    green: 'border-green-950/60'
  };

  const tableHeaderBgClass = {
    white: 'bg-neutral-900/40',
    amber: 'bg-amber-950/20',
    green: 'bg-green-950/20'
  };

  const tableRowHoverBgClass = {
    white: 'hover:bg-neutral-900/20',
    amber: 'hover:bg-amber-950/10',
    green: 'hover:bg-green-950/10'
  };

  return (
    <div className={`min-h-screen bg-black ${themeTextClass[activeTheme]} font-mono relative overflow-x-hidden transition-colors duration-300`}>
      
      {/* FLOATING ACTION UTILITY: Elegant Minimal controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {/* Theme select dots */}
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 border border-neutral-800 text-[10px]">
          <button 
            onClick={() => setActiveTheme('white')}
            className={`w-2.5 h-2.5 bg-white transition-all ${activeTheme === 'white' ? 'ring-2 ring-white/50 scale-110' : 'opacity-40'}`}
            title="White Theme"
          />
          <button 
            onClick={() => setActiveTheme('amber')}
            className={`w-2.5 h-2.5 bg-amber-500 transition-all ${activeTheme === 'amber' ? 'ring-2 ring-amber-500/50 scale-110' : 'opacity-40'}`}
            title="Amber CRT Theme"
          />
          <button 
            onClick={() => setActiveTheme('green')}
            className={`w-2.5 h-2.5 bg-green-500 transition-all ${activeTheme === 'green' ? 'ring-2 ring-green-500/50 scale-110' : 'opacity-40'}`}
            title="Green Matrix Theme"
          />
        </div>
      </div>

      {/* PORTFOLIO LANDING PAGE (Exactly matching the Figma screenshot) */}
      <div className={`max-w-5xl mx-auto px-6 pt-24 pb-32 transition-opacity duration-300 ${isLabMode ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Top bio heading section */}
        <header className="mb-24 space-y-6 max-w-xl">
          <h1 className={`text-xl font-bold tracking-tight ${headerTextClass[activeTheme]}`}>
            # {PROFILE.name}
          </h1>
          <p className={`text-sm ${subtextClass[activeTheme]}`}>
            {PROFILE.title}
          </p>
          <p className={`text-sm ${bioTextClass[activeTheme]} leading-relaxed font-light whitespace-pre-line`}>
            {PROFILE.bio}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              id="link-profile-youtube"
              href="https://www.youtube.com/@EgorKinetronika"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 px-3 py-1.5 border text-xs font-bold tracking-wider transition-all duration-200 uppercase ${currentThemeButtonClass[activeTheme]}`}
              title="Egor Shatalov on YouTube"
            >
              <Youtube size={14} />
              <span>YouTube</span>
            </a>
            <a
              id="link-profile-x"
              href="https://x.com/Kinetronika"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 px-3 py-1.5 border text-xs font-bold tracking-wider transition-all duration-200 uppercase ${currentThemeButtonClass[activeTheme]}`}
              title="Egor Shatalov on X (Twitter)"
            >
              <Twitter size={14} />
              <span>X / Twitter</span>
            </a>
          </div>
        </header>

        {/* Section divider heading */}
        <div className="mb-16">
          <h2 className={`text-lg font-bold ${headerTextClass[activeTheme]}`}>
            # Projects
          </h2>
          <p className={`text-sm mt-2 ${subtextClass[activeTheme]} font-light`}>
            My main projects are listed in this section
          </p>
        </div>

        {/* List of Projects exactly formatted */}
        <div className="space-y-32">
          {PROJECTS.map((project) => (
            <div 
              key={project.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center group relative"
            >
              {/* Left Column: Markdown-style text */}
              <div className="space-y-4 pr-4">
                <h3 className={`text-lg font-bold ${projectTitleClass[activeTheme]} transition-colors`}>
                  # {project.title}
                </h3>
                <p className={`text-sm ${bioTextClass[activeTheme]} leading-relaxed font-light`}>
                  {project.description}
                  {project.id === "autofiber-5" && (
                    <>
                      {" "}
                      <a 
                        href="https://kinetronika.tech" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`font-medium transition-all inline-block ${linkTextClass[activeTheme]}`}
                      >
                        kinetronika.tech
                      </a>
                    </>
                  )}
                </p>
                {project.id === "autofiber-5" && (
                  <PresentationDeck activeTheme={activeTheme} />
                )}
                {project.id === "autofiber-5" && (
                  <p className={`text-sm ${subtextClass[activeTheme]} font-light leading-relaxed mt-1`}>
                    Creates parts with CFNF technology
                  </p>
                )}

                {/* Project development stage indicator */}
                <ProjectStage projectId={project.id} activeTheme={activeTheme} />
                {project.techSpecs && (
                  <div className="mt-6 space-y-3 max-w-md">
                    <h4 className={`text-[11px] font-bold tracking-widest uppercase ${headerTextClass[activeTheme]}`}>
                      // Technical Specifications
                    </h4>
                    <div className={`border ${borderClass[activeTheme]} overflow-hidden text-xs`}>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`${tableHeaderBgClass[activeTheme]} border-b ${borderClass[activeTheme]}`}>
                            <th className={`py-1.5 px-3 font-semibold uppercase tracking-wider text-[10px] w-1/2 ${bioTextClass[activeTheme]}`}>Parameter</th>
                            <th className={`py-1.5 px-3 font-semibold uppercase tracking-wider text-[10px] w-1/2 ${bioTextClass[activeTheme]}`}>Specification</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${borderClass[activeTheme]} font-mono text-[11px]`}>
                          {project.techSpecs.map((spec, sIdx) => (
                            <tr key={sIdx} className={`${tableRowHoverBgClass[activeTheme]} transition-colors`}>
                              <td className={`py-1.5 px-3 font-medium ${bioTextClass[activeTheme]}`}>{spec.parameter}</td>
                              <td className={`py-1.5 px-3 ${subtextClass[activeTheme]}`}>{spec.specification}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                 {project.id === "acse-2" && (
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    <a
                      id="btn-watch-extruder-video"
                      href="https://drive.google.com/file/d/1l-KbEtSTTvvHvmHF33bYTRJ_BSsOfmL7/view?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 px-4 py-2 border text-xs font-bold tracking-wider transition-all duration-200 uppercase ${currentThemeButtonClass[activeTheme]}`}
                      title="Watch ACSE-2 in action on Google Drive"
                    >
                      <Play size={15} className="fill-current" />
                      <span>Watch Video</span>
                    </a>
                  </div>
                )}
                {project.id === "rabbit-80" && (
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    <a
                      id="btn-watch-rabbit-video"
                      href="https://drive.google.com/file/d/1D98aat4KTw8VmR9qdInC8YmqOQxKL2QI/view?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 px-4 py-2 border text-xs font-bold tracking-wider transition-all duration-200 uppercase ${currentThemeButtonClass[activeTheme]}`}
                      title="Watch Rabbit 80 in action on Google Drive"
                    >
                      <Play size={15} className="fill-current" />
                      <span>Watch Video</span>
                    </a>
                  </div>
                )}
                {project.id === "forceps-600" && (
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    <a
                      id="btn-download-forceps-deck"
                      href="https://drive.google.com/file/d/1811JzBmquTm8ieZGFbk-BMXbr8uumE7c/view?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 px-4 py-2 border text-xs font-bold tracking-wider transition-all duration-200 uppercase ${currentThemeButtonClass[activeTheme]}`}
                      title="Download the official Forceps 600 pitch deck from Google Drive"
                    >
                      <Download size={15} />
                      <span>Download PDF Deck</span>
                    </a>
                  </div>
                )}
                {project.id === "km-1200" && (
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    <a
                      id="btn-download-km1200-deck"
                      href="https://drive.google.com/file/d/1aMu66zydEaY4XrYoN9J8P9qe3czrXUNy/view?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 px-4 py-2 border text-xs font-bold tracking-wider transition-all duration-200 uppercase ${currentThemeButtonClass[activeTheme]}`}
                      title="Download the official KM-1200 pitch deck from Google Drive"
                    >
                      <Download size={15} />
                      <span>Download PDF Deck</span>
                    </a>
                  </div>
                )}
                {project.id === "crv-25" && (
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    <a
                      id="btn-download-crv25-deck"
                      href="https://drive.google.com/file/d/1vhzll-M7fInF49PKDmSxdXG9XULNAfma/view?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 px-4 py-2 border text-xs font-bold tracking-wider transition-all duration-200 uppercase ${currentThemeButtonClass[activeTheme]}`}
                      title="Download the official CRV-25 pitch deck from Google Drive"
                    >
                      <Download size={15} />
                      <span>Download PDF Deck</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: Beautiful High-Resolution interactive 3D ASCII Render */}
              <div className="flex justify-center md:justify-end">
                <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
                  <AsciiRenderer
                    minimal={true}
                    settings={{
                      modelType: project.modelType,
                      resolution: 165, // Higher resolution for standard AsciiEffect density
                      ramp: 'standard',
                      invert: true,
                      colorized: activeTheme !== 'white',
                      autoRotate: true,
                      rotSpeedX: 0.04,
                      rotSpeedY: 0.16,
                      rotSpeedZ: 0,
                      wireframe: false,
                      lightIntensity: 1.35
                    }}
                    className="w-full h-full text-center"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hard Skills Section */}
        <div className="mt-32 pt-16 border-t border-neutral-900">
          <h2 className={`text-lg font-bold ${headerTextClass[activeTheme]} mb-2`}>
            # Hard Skills
          </h2>
          <p className={`text-sm ${subtextClass[activeTheme]} font-light mb-8`}>
            Core technical proficiencies and engineering tools utilized in my work
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CAD Card */}
            <div className={`border ${borderClass[activeTheme]} p-5 bg-neutral-950/40 hover:bg-neutral-950/80 transition-all duration-300`}>
              <div className="flex items-center gap-2 mb-3">
                <Code size={14} className={headerTextClass[activeTheme]} />
                <h3 className={`text-xs font-bold tracking-widest uppercase ${headerTextClass[activeTheme]}`}>
                  CAD
                </h3>
              </div>
              <ul className={`space-y-1.5 text-[11px] ${bioTextClass[activeTheme]}`}>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  Siemens NX
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  Fusion
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  Solidworks
                </li>
              </ul>
            </div>

            {/* CAM Card */}
            <div className={`border ${borderClass[activeTheme]} p-5 bg-neutral-950/40 hover:bg-neutral-950/80 transition-all duration-300`}>
              <div className="flex items-center gap-2 mb-3">
                <Code size={14} className={headerTextClass[activeTheme]} />
                <h3 className={`text-xs font-bold tracking-widest uppercase ${headerTextClass[activeTheme]}`}>
                  CAM
                </h3>
              </div>
              <ul className={`space-y-1.5 text-[11px] ${bioTextClass[activeTheme]}`}>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  Fusion
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  Esprit
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  NX CAM
                </li>
              </ul>
            </div>

            {/* CAE Card */}
            <div className={`border ${borderClass[activeTheme]} p-5 bg-neutral-950/40 hover:bg-neutral-950/80 transition-all duration-300`}>
              <div className="flex items-center gap-2 mb-3">
                <Code size={14} className={headerTextClass[activeTheme]} />
                <h3 className={`text-xs font-bold tracking-widest uppercase ${headerTextClass[activeTheme]}`}>
                  CAE
                </h3>
              </div>
              <ul className={`space-y-1.5 text-[11px] ${bioTextClass[activeTheme]}`}>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  Ansys
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  Kisssoft
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  OpenVSP
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  ADAMS
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  RecurDyn
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  NX
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  Altair
                </li>
              </ul>
            </div>

            {/* System Development Card */}
            <div className={`border ${borderClass[activeTheme]} p-5 bg-neutral-950/40 hover:bg-neutral-950/80 transition-all duration-300`}>
              <div className="flex items-center gap-2 mb-3">
                <Code size={14} className={headerTextClass[activeTheme]} />
                <h3 className={`text-xs font-bold tracking-widest uppercase ${headerTextClass[activeTheme]}`}>
                  System development
                </h3>
              </div>
              <ul className={`space-y-1.5 text-[11px] ${bioTextClass[activeTheme]}`}>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  MATLAB + Simulink
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  Wolfram
                </li>
              </ul>
            </div>

            {/* Real-world AI Development Card */}
            <div className={`border ${borderClass[activeTheme]} p-5 bg-neutral-950/40 hover:bg-neutral-950/80 transition-all duration-300 md:col-span-2 lg:col-span-2`}>
              <div className="flex items-center gap-2 mb-3">
                <Code size={14} className={headerTextClass[activeTheme]} />
                <h3 className={`text-xs font-bold tracking-widest uppercase ${headerTextClass[activeTheme]}`}>
                  Real-world AI development
                </h3>
              </div>
              <ul className={`space-y-1.5 text-[11px] ${bioTextClass[activeTheme]}`}>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  NVIDIA SDK + Jetson
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  OpenCV
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${activeTheme === 'white' ? 'bg-neutral-500' : activeTheme === 'amber' ? 'bg-amber-500/60' : 'bg-green-500/60'}`} />
                  TensorFlow
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Professional quiet footer */}
        <footer className={`mt-32 pt-12 border-t border-neutral-900 text-[11px] ${subtextClass[activeTheme]} flex flex-col sm:flex-row justify-between gap-4`}>
          <div>© {new Date().getFullYear()} EGOR SHATALOV</div>
          <div className="flex gap-6">
            <span>DRAG MODELS TO ROTATE</span>
            <span>PORT_3000 // HANDSHAKE_ESTABLISHED</span>
          </div>
        </footer>

      </div>

      {/* FLOATING STL & SETTINGS LAB DRAWER */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-neutral-950 border-l border-neutral-800 z-40 shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 flex flex-col gap-6 ${isLabMode ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
          <div className="flex items-center gap-2 text-white">
            <Sliders size={16} className="text-white" />
            <h2 className="text-sm font-bold uppercase tracking-wider">3D STL ASCII Lab</h2>
          </div>
          <button 
            onClick={() => setIsLabMode(false)}
            className="text-neutral-500 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Custom STL Drag & Drop Uploader */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">STL File Uploader</label>
          <div className="border border-dashed border-neutral-800 p-5 text-center hover:border-neutral-700 transition-colors bg-black/40 relative">
            <input 
              type="file" 
              accept=".stl" 
              onChange={handleStlUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload size={24} className="mx-auto text-neutral-500 mb-2" />
            <span className="text-xs text-neutral-300 font-medium block">
              {customFileName ? customFileName : "Drag and drop STL file here or click to choose"}
            </span>
            <span className="text-[10px] text-neutral-600 block mt-1">
              Supports binary STL models up to 15MB
            </span>
          </div>
        </div>

        {/* Live Lab Preview Viewport */}
        <div className="space-y-3 flex-1 flex flex-col">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Real-time ASCII Viewer</label>
          <div className="border border-neutral-900 bg-black overflow-hidden relative flex-1 min-h-[220px] flex items-center justify-center">
            <AsciiRenderer
              minimal={false}
              settings={labSettings}
              customStlBuffer={customStlBuffer}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Configuration sliders & controls */}
        <div className="space-y-4 border-t border-neutral-900 pt-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">ASCII Settings</label>
            <button
              onClick={() => setLabSettings({
                modelType: customStlBuffer ? 'custom' : 'printer',
                resolution: 130,
                ramp: 'standard',
                invert: true,
                colorized: false,
                autoRotate: true,
                rotSpeedX: 0.1,
                rotSpeedY: 0.25,
                rotSpeedZ: 0,
                wireframe: false,
                lightIntensity: 1.3
              })}
              title="Reset to default settings"
              className="text-neutral-500 hover:text-white flex items-center gap-1 text-[10px]"
            >
              <RotateCcw size={10} /> Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Model Type Selector */}
            <div className="space-y-1.5 col-span-2">
              <span className="text-neutral-500">Geometry Preset:</span>
              <select
                value={labSettings.modelType}
                onChange={e => setLabSettings(prev => ({ ...prev, modelType: e.target.value as any }))}
                className="w-full bg-neutral-900 text-neutral-200 border border-neutral-800 px-2.5 py-1.5 outline-none font-mono text-xs cursor-pointer focus:border-neutral-700"
              >
                <option value="printer">Autofiber-5 (Printer)</option>
                <option value="extruder">ACSE-2 (Extruder)</option>
                <option value="drone">Rabbit 80 (Drone)</option>
                <option value="airplane">Forceps 600 (Airplane)</option>
                <option value="roboticArm">KM-1200 (Robotic Arm)</option>
                <option value="cycloidalGear">CRV-25 (Cycloidal Gear)</option>
                <option value="torus">Mathematical Torus</option>
                <option value="gear">Classic Industrial Gear</option>
                <option value="satellite">Orbital Satellite</option>
                <option value="teapot">Utah Teapot</option>
                <option value="mobius">Torus Knot</option>
                {customStlBuffer && <option value="custom">Loaded STL File</option>}
              </select>
            </div>

            {/* Resolution Slider */}
            <div className="space-y-1.5">
              <span className="text-neutral-500">Resolution ({labSettings.resolution}):</span>
              <input 
                type="range" 
                min="40" 
                max="220" 
                step="5"
                value={labSettings.resolution} 
                onChange={e => setLabSettings(prev => ({ ...prev, resolution: parseInt(e.target.value) }))}
                className="w-full accent-white"
              />
            </div>

            {/* Light Intensity Slider */}
            <div className="space-y-1.5">
              <span className="text-neutral-500">Lighting ({labSettings.lightIntensity}x):</span>
              <input 
                type="range" 
                min="0.5" 
                max="2.5" 
                step="0.1"
                value={labSettings.lightIntensity} 
                onChange={e => setLabSettings(prev => ({ ...prev, lightIntensity: parseFloat(e.target.value) }))}
                className="w-full accent-white"
              />
            </div>

            {/* Character Ramp Preset */}
            <div className="space-y-1.5">
              <span className="text-neutral-500">Ramp Shader:</span>
              <select
                value={labSettings.ramp}
                onChange={e => setLabSettings(prev => ({ ...prev, ramp: e.target.value as any }))}
                className="w-full bg-neutral-900 text-neutral-200 border border-neutral-800 px-2 py-1 outline-none font-mono text-xs cursor-pointer focus:border-neutral-700"
              >
                <option value="standard">Standard Characters</option>
                <option value="detailed">Ultra Detailed</option>
                <option value="minimal">Minimalist Block</option>
                <option value="blocks">Solid Braille Blocks</option>
                <option value="binary">Binary (1s & 0s)</option>
                <option value="matrix">Matrix Hex</option>
              </select>
            </div>

            {/* Auto Rotate speed */}
            <div className="space-y-1.5">
              <span className="text-neutral-500">Auto-Rotation:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setLabSettings(prev => ({ ...prev, autoRotate: !prev.autoRotate }))}
                  className={`flex-1 py-1 px-2 border font-bold text-[10px] text-center uppercase ${labSettings.autoRotate ? 'bg-white text-black border-white' : 'border-neutral-800 text-neutral-400'}`}
                >
                  {labSettings.autoRotate ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="col-span-2 pt-2 flex flex-wrap gap-4 text-[11px] text-neutral-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={labSettings.wireframe}
                  onChange={e => setLabSettings(prev => ({ ...prev, wireframe: e.target.checked }))}
                  className="border-neutral-800 bg-neutral-900 text-white focus:ring-0"
                />
                <span>Wireframe Mode</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={labSettings.invert}
                  onChange={e => setLabSettings(prev => ({ ...prev, invert: e.target.checked }))}
                  className="border-neutral-800 bg-neutral-900 text-white focus:ring-0"
                />
                <span>Invert Lighting</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={labSettings.colorized}
                  onChange={e => setLabSettings(prev => ({ ...prev, colorized: e.target.checked }))}
                  className="border-neutral-800 bg-neutral-900 text-white focus:ring-0"
                />
                <span>Apply Matrix Colors</span>
              </label>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

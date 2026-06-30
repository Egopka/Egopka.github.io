export type SectionId = 'about' | 'projects' | 'ascii-lab' | 'resume' | 'terminal' | 'contact';

export type ColorTheme = 'amber' | 'matrix' | 'cyber' | 'monochrome' | 'dracula';

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  bg: string;
  cardBg: string;
  text: string;
  accent: string;
  accentHover: string;
  border: string;
  highlightBg: string;
  glow: string;
  asciiClass: string;
}

export interface SkillItem {
  category: string;
  skills: { name: string; level: number; info: string }[];
}

export interface Project {
  id: string;
  title: string;
  codename: string;
  category: string;
  summary: string;
  description: string;
  architecture: string[];
  techStack: string[];
  metrics: Record<string, string>;
  default3dModel: 'torus' | 'gear' | 'rocket' | 'satellite' | 'teapot' | 'mobius';
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface ResumeContent {
  summary: string;
  experience: {
    period: string;
    role: string;
    company: string;
    highlights: string[];
  }[];
  education: {
    year: string;
    degree: string;
    institution: string;
  }[];
  certifications: string[];
}

export type AsciiRampPreset = 'standard' | 'detailed' | 'binary' | 'matrix' | 'minimal' | 'blocks' | 'dots';

export interface AsciiLabSettings {
  modelType: 'torus' | 'gear' | 'rocket' | 'satellite' | 'teapot' | 'mobius' | 'custom' | 'printer' | 'extruder' | 'drone' | 'airplane' | 'roboticArm' | 'cycloidalGear';
  customFile?: File | null;
  customFileName?: string;
  resolution: number; // cols & rows, e.g. 80
  ramp: AsciiRampPreset;
  customRamp?: string;
  invert: boolean;
  colorized: boolean;
  autoRotate: boolean;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  wireframe: boolean;
  lightIntensity: number;
}

export interface TerminalLog {
  id: string;
  type: 'input' | 'output' | 'system' | 'error' | 'ascii';
  text: string;
  timestamp: string;
}

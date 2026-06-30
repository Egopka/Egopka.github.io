import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AsciiLabSettings } from '../types';

// STL files are served only from the public asset directory.
export const PUBLIC_STL_MODELS = {
  printer: { name: 'Autofiber-5.stl', path: '/models/Autofiber-5.stl' },
  extruder: { name: 'ACSE2Remeshed1.stl', path: '/models/ACSE2Remeshed1.stl' },
  drone: { name: 'Rabbit80.stl', path: '/models/Rabbit80.stl' },
  airplane: { name: 'Forceps600.stl', path: '/models/Forceps600.stl' },
  roboticArm: { name: 'KM1200.stl', path: '/models/KM1200.stl' },
  cycloidalGear: { name: 'CRV25.stl', path: '/models/CRV25.stl' }
};

// Global cache for STL model ArrayBuffers
const publicModelCache: Record<string, ArrayBuffer> = {};

// Custom drop-in replacement for AsciiEffect that forces transparency on alpha === 0
class TransparentAsciiEffect {
  domElement: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private charList: string[];
  private options: { invert?: boolean; resolution?: number; fontSize?: string };
  private oAscii: HTMLPreElement;
  private width: number = 0;
  private height: number = 0;
  private iWidth: number = 0;
  private iHeight: number = 0;
  private oCanvas: HTMLCanvasElement;
  private oCtx: CanvasRenderingContext2D;

  constructor(
    renderer: THREE.WebGLRenderer,
    charSet: string = ' .:-=+*#%@',
    options: { invert?: boolean; resolution?: number; fontSize?: string } = {}
  ) {
    this.renderer = renderer;
    this.charList = charSet.split('');
    this.options = options;

    this.domElement = document.createElement('div');
    this.domElement.style.cursor = 'default';

    this.oAscii = document.createElement('pre');
    this.domElement.appendChild(this.oAscii);

    this.oCanvas = document.createElement('canvas');
    this.oCtx = this.oCanvas.getContext('2d')!;
  }

  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.renderer.setSize(w, h);

    const fResolution = this.options.resolution || 0.15;
    this.iWidth = Math.floor(w * fResolution);
    this.iHeight = Math.floor(h * fResolution);

    this.oCanvas.width = this.iWidth;
    this.oCanvas.height = this.iHeight;

    // Calculate dynamic font size to perfectly fit the characters into the container without wrapping or clipping
    const fontWidthFactor = 0.55; 
    const lineHeightFactor = 0.78; 
    
    const maxFontSizeByWidth = w / (this.iWidth * fontWidthFactor);
    const maxFontSizeByHeight = h / ((this.iHeight / 2) * lineHeightFactor);
    
    // Choose the smaller of the two to fit perfectly in both dimensions
    const calculatedFontSize = Math.min(maxFontSizeByWidth, maxFontSizeByHeight);

    const oStyle = this.oAscii.style;
    oStyle.whiteSpace = 'pre';
    oStyle.margin = '0px';
    oStyle.padding = '0px';
    oStyle.letterSpacing = '0px';
    oStyle.fontFamily = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
    oStyle.fontSize = `${calculatedFontSize}px`;
    oStyle.lineHeight = `${lineHeightFactor}`;
    oStyle.textAlign = 'center';
    oStyle.textDecoration = 'none';
    oStyle.display = 'block';
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
    this.asciifyImage();
  }

  private asciifyImage() {
    const iWidth = this.iWidth;
    const iHeight = this.iHeight;
    const oCtx = this.oCtx;
    const oCanvasImg = this.renderer.domElement;
    const aCharList = this.charList;
    const maxIdx = aCharList.length - 1;
    const bInvert = this.options.invert || false;

    oCtx.clearRect(0, 0, iWidth, iHeight);
    oCtx.drawImage(oCanvasImg, 0, 0, iWidth, iHeight);

    const oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;
    
    // Highly optimized rendering loop with minimal string allocation
    const rows: string[] = [];
    
    for (let y = 0; y < iHeight; y += 2) {
      let rowStr = '';
      const rowOffset = y * iWidth * 4;
      
      for (let x = 0; x < iWidth; x++) {
        const iOffset = rowOffset + (x << 2);
        const iAlpha = oImgData[iOffset + 3];

        if (iAlpha !== 0) {
          const iRed = oImgData[iOffset];
          const iGreen = oImgData[iOffset + 1];
          const iBlue = oImgData[iOffset + 2];
          
          // Ultra fast integer-based luminance approximation (R * 77 + G * 150 + B * 29) >> 8
          const brightness = (iRed * 77 + iGreen * 150 + iBlue * 29) >> 8;
          let iCharIdx = Math.round((1 - brightness / 255) * maxIdx);

          if (bInvert) {
            iCharIdx = maxIdx - iCharIdx;
          }

          const char = aCharList[iCharIdx];
          rowStr += (char !== undefined && char !== ' ') ? char : ' ';
        } else {
          rowStr += ' ';
        }
      }
      rows.push(rowStr);
    }

    this.oAscii.textContent = rows.join('\n');
  }
}

interface AsciiRendererProps {
  settings: AsciiLabSettings;
  customStlBuffer?: ArrayBuffer | null;
  className?: string;
  onRotationChange?: (rx: number, ry: number) => void;
  onFrameUpdate?: () => void;
  minimal?: boolean; // If true, matches the minimalist Figma layout
}

export default function AsciiRenderer({
  settings,
  customStlBuffer,
  className = '',
  onRotationChange,
  onFrameUpdate,
  minimal = false
}: AsciiRendererProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [localCache, setLocalCache] = useState<Record<string, ArrayBuffer>>({});
  const [loadingModel, setLoadingModel] = useState<string | null>(null);
  const [failedModel, setFailedModel] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 460, height: 460 });

  // Dynamic ResizeObserver to scale container dynamically to the actual viewport without stretching
  useEffect(() => {
    if (!mountRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;

      const w = width || 460;
      const h = height || w || 460; // Default to square if height is not calculated

      setDimensions({ width: w, height: h });
    });

    resizeObserver.observe(mountRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Dynamic public asset model loader.
  useEffect(() => {
    const publicModelInfo = PUBLIC_STL_MODELS[settings.modelType as keyof typeof PUBLIC_STL_MODELS];
    if (!publicModelInfo) return;

    const modelPath = publicModelInfo.path;
    if (publicModelCache[modelPath] || localCache[modelPath]) return;

    let isMounted = true;
    setLoadingModel(settings.modelType);
    setFailedModel(null);

    const fetchModel = async () => {
      try {
        const res = await fetch(modelPath);
        if (!res.ok) {
          throw new Error(`Failed to load ${modelPath}: ${res.status} ${res.statusText}`);
        }

        const buffer = await res.arrayBuffer();
        if (buffer.byteLength < 500) {
          throw new Error(`Failed to load ${modelPath}: file is too small to be a valid STL.`);
        }

        const header = new TextDecoder().decode(buffer.slice(0, 50));
        if (header.includes('<html') || header.includes('<!DOCTYPE') || header.includes('<HTML')) {
          throw new Error(`Failed to load ${modelPath}: received HTML instead of STL data.`);
        }

        if (isMounted) {
          publicModelCache[modelPath] = buffer;
          setLocalCache(prev => ({ ...prev, [modelPath]: buffer }));
          setLoadingModel(null);
          setFailedModel(null);
        }
      } catch (e) {
        console.warn(`Public STL asset failed to load: ${modelPath}`, e);
        if (isMounted) {
          setLoadingModel(null);
          setFailedModel(settings.modelType);
        }
      }
    };

    fetchModel();

    return () => {
      isMounted = false;
    };
  }, [settings.modelType, localCache]);

  useEffect(() => {
    if (!mountRef.current) return;

    const publicModelInfo = PUBLIC_STL_MODELS[settings.modelType as keyof typeof PUBLIC_STL_MODELS];
    const publicModelBuffer = publicModelInfo
      ? publicModelCache[publicModelInfo.path] || localCache[publicModelInfo.path]
      : null;

    if (publicModelInfo && !customStlBuffer && !publicModelBuffer) {
      return;
    }

    // Sizing dynamically fetched from ResizeObserver
    const width = dimensions.width;
    const height = dimensions.height;

    // Create Scene, Camera, and WebGLRenderer with transparency
    const scene = new THREE.Scene();
    scene.background = null; // Forces WebGL background to be completely transparent

    // Dynamically calculate camera aspect ratio to cancel out ASCII monospaced character stretching
    // fontWidthFactor is 0.55, lineHeightFactor is 0.78. We sample every 2nd row (y += 2).
    const characterAspectCorrection = 2 * (0.55 / 0.78); // ≈ 1.41025
    const aspect = (width / height) * characterAspectCorrection;

    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.set(0, 0, 3.3);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, 
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump'
    });
    renderer.setSize(width, height);

    // Create high-contrast lighting for rich shading facets
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, settings.lightIntensity * 1.4);
    dirLight1.position.set(5, 8, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, settings.lightIntensity * 0.4);
    dirLight2.position.set(-5, -4, -3);
    scene.add(dirLight2);

    // Material with flat shading to make ASCII facets stand out beautifully
    const material = new THREE.MeshPhongMaterial({
      color: settings.colorized ? 0x00ff88 : 0xdddddd,
      specular: 0x555555,
      shininess: 30,
      flatShading: true,
      wireframe: settings.wireframe,
      side: THREE.DoubleSide
    });

    let currentObject: THREE.Object3D = new THREE.Group();

    // Determine target buffer (either user manual file upload or loaded public STL file)
    let activeStlBuffer = customStlBuffer;
    if (publicModelInfo && publicModelBuffer) {
      activeStlBuffer = publicModelBuffer;
    }

    let parsedSuccessfully = false;

    // Parse STL file if active buffer is available
    if (activeStlBuffer) {
      try {
        const geometry = parseBinarySTL(activeStlBuffer);
        
        // Align models to their real-life orientation (mostly Z-up CAD models to Three.js Y-up, except cycloidalGear which shows its face best in XY)
        if (settings.modelType === 'extruder') {
          // The extruder (ACSE2) nozzle tip is at positive Y in original CAD coords.
          // Rotating it 180 degrees (Math.PI) on the X-axis makes it stand upright with the nozzle pointing straight down.
          geometry.rotateX(Math.PI);
        } else if (settings.modelType === 'printer' || 
                   settings.modelType === 'drone' || 
                   settings.modelType === 'airplane' || 
                   settings.modelType === 'roboticArm') {
          geometry.rotateX(-Math.PI / 2);
        }

        const mesh = new THREE.Mesh(geometry, material);
        
        // Use high-precision bounding sphere scaling and centering to guarantee no cropping/clipping at any rotation angle
        geometry.computeBoundingSphere();
        const sphere = geometry.boundingSphere;
        if (sphere) {
          const r = sphere.radius;
          // Scale so that the bounding sphere radius is 0.95.
          // In a camera at z=3.3 with fov=40, the vertical visible height is ~2.40.
          // A sphere of radius 0.95 has a diameter of 1.90, which fits with perfect margins
          // and will never clip/crop when rotating.
          const scale = 0.95 / (r || 1);
          mesh.scale.set(scale, scale, scale);
          
          mesh.position.sub(sphere.center.clone().multiplyScalar(scale));
        }
        
        currentObject = mesh;
        parsedSuccessfully = true;
      } catch (e) {
        console.error('Failed to parse binary STL, using procedural fallback', e);
      }
    }

    // Fall back to procedurally generated shapes if no STL loaded/parsed successfully
    if (!parsedSuccessfully) {
      switch (settings.modelType) {
        case 'printer': {
          const group = new THREE.Group();
          
          // Print Bed
          const bedGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.08, 16);
          const bed = new THREE.Mesh(bedGeo, material);
          bed.position.y = -0.7;
          group.add(bed);

          // 4 corner posts
          const postPositions = [
            [-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]
          ];
          postPositions.forEach(([px, pz]) => {
            const postGeo = new THREE.BoxGeometry(0.06, 1.4, 0.06);
            const post = new THREE.Mesh(postGeo, material);
            post.position.set(px, 0, pz);
            group.add(post);
          });

          // Horizontal top frames
          const topFrameH = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.06, 0.06), material);
          topFrameH.position.set(0, 0.7, 0.6);
          group.add(topFrameH);

          const topFrameH2 = topFrameH.clone();
          topFrameH2.position.z = -0.6;
          group.add(topFrameH2);

          const topFrameV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.26), material);
          topFrameV.position.set(0.6, 0.7, 0);
          group.add(topFrameV);

          const topFrameV2 = topFrameV.clone();
          topFrameV2.position.x = -0.6;
          group.add(topFrameV2);

          // X-Y Gantry crossbar
          const gantry = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.05), material);
          gantry.position.set(0, 0.35, 0);
          group.add(gantry);

          // Extruder printhead
          const printHead = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.2), material);
          printHead.position.set(0, 0.25, 0);
          group.add(printHead);

          // Printing nozzle
          const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 8), material);
          nozzle.position.set(0, 0.1, 0);
          nozzle.rotation.x = Math.PI;
          group.add(nozzle);

          // Semi-printed item
          const item = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.08, 8, 24, Math.PI * 1.5), material);
          item.position.set(0, -0.55, 0);
          item.rotation.x = Math.PI / 2;
          group.add(item);

          currentObject = group;
          break;
        }

        case 'extruder': {
          const group = new THREE.Group();

          // Upper NEMA-17 Stepper Motor
          const motor = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), material);
          motor.position.y = 0.5;
          group.add(motor);

          const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 12), material);
          cap.position.y = 0.86;
          group.add(cap);

          // Cooling Fins body block
          const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), material);
          body.position.y = -0.15;
          group.add(body);

          // Heat-sink plates
          for (let i = 0; i < 5; i++) {
            const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.03, 16), material);
            plate.position.y = -0.05 - i * 0.09;
            group.add(plate);
          }

          // Side blower fan
          const fan = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.4, 0.4), material);
          fan.position.set(0.38, -0.15, 0);
          group.add(fan);

          // Heating block
          const heater = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.35), material);
          heater.position.y = -0.65;
          group.add(heater);

          // Nozzle
          const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 10), material);
          nozzle.position.y = -0.83;
          nozzle.rotation.x = Math.PI;
          group.add(nozzle);

          currentObject = group;
          break;
        }

        case 'airplane': {
          const group = new THREE.Group();

          // Cylindrical Fuselage
          const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.08, 1.8, 16), material);
          fuselage.rotation.x = Math.PI / 2;
          group.add(fuselage);

          // Tapered Nose cone
          const nose = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), material);
          nose.position.z = 0.9;
          nose.scale.set(1, 1, 1.5);
          group.add(nose);

          // Long wing
          const wings = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.02, 0.32), material);
          wings.position.set(0, 0.08, 0.1);
          group.add(wings);

          // Vertical tail stabilizer
          const vTail = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.32, 0.22), material);
          vTail.position.set(0, 0.18, -0.8);
          group.add(vTail);

          // Horizontal tail stabilizer
          const hTail = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.02, 0.16), material);
          hTail.position.set(0, 0.06, -0.8);
          group.add(hTail);

          // Front Propeller Spinner
          const propSpinner = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 8), material);
          propSpinner.rotation.x = Math.PI / 2;
          propSpinner.position.z = 1.15;
          group.add(propSpinner);

          const propellerBlade = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.025, 0.01), material);
          propellerBlade.position.set(0, 0.12, 1.17);
          propellerBlade.rotation.z = 0.15;
          group.add(propellerBlade);

          const propellerBlade2 = propellerBlade.clone();
          propellerBlade2.position.y = -0.12;
          group.add(propellerBlade2);

          currentObject = group;
          break;
        }

        case 'roboticArm': {
          const group = new THREE.Group();

          // Circular rotating base
          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 16), material);
          base.position.y = -0.8;
          group.add(base);

          // Shoulder turret
          const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.32, 12), material);
          shoulder.position.y = -0.56;
          group.add(shoulder);

          // Main heavy lift boom arm
          const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.85, 10), material);
          boom.position.set(0, -0.15, 0);
          boom.rotation.z = 0.32;
          group.add(boom);

          // Elbow pivot joint
          const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), material);
          elbow.position.set(-0.14, 0.24, 0);
          group.add(elbow);

          // Secondary forearm arm
          const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.75, 10), material);
          forearm.position.set(0.1, 0.58, 0);
          forearm.rotation.z = -0.62;
          group.add(forearm);

          // Wrist joint
          const wrist = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), material);
          wrist.position.set(0.35, 0.9, 0);
          group.add(wrist);

          // Surgical gripper base
          const gripperBase = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.14), material);
          gripperBase.position.set(0.45, 0.98, 0);
          gripperBase.rotation.z = -0.62;
          group.add(gripperBase);

          // Claw teeth
          const tooth1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.14, 0.03), material);
          tooth1.position.set(0.49, 1.06, 0.04);
          tooth1.rotation.z = -0.35;
          group.add(tooth1);

          const tooth2 = tooth1.clone();
          tooth2.position.z = -0.04;
          group.add(tooth2);

          currentObject = group;
          break;
        }

        case 'cycloidalGear': {
          const group = new THREE.Group();

          // Speed reducer outer main ring casing
          const outerRing = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.3, 32), material);
          outerRing.rotation.x = Math.PI / 2;
          group.add(outerRing);

          // Central input shaft sleeve
          const centralShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.38, 16), material);
          centralShaft.rotation.x = Math.PI / 2;
          group.add(centralShaft);

          // Cycloid wobble disc
          const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.1, 24), material);
          disc.position.set(0.05, 0.05, 0.1);
          disc.rotation.x = Math.PI / 2;
          group.add(disc);

          // Multi-hole cycloid reducer face holes
          const holes = 6;
          for (let i = 0; i < holes; i++) {
            const hMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.34, 12), material);
            const angle = (i / holes) * Math.PI * 2;
            hMesh.position.x = Math.cos(angle) * 0.45;
            hMesh.position.y = Math.sin(angle) * 0.45;
            hMesh.position.z = 0;
            hMesh.rotation.x = Math.PI / 2;
            group.add(hMesh);
          }

          // Outer flange studs
          const bolts = 10;
          for (let i = 0; i < bolts; i++) {
            const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.05, 6), material);
            const angle = (i / bolts) * Math.PI * 2;
            bMesh.position.x = Math.cos(angle) * 0.76;
            bMesh.position.y = Math.sin(angle) * 0.76;
            bMesh.position.z = 0.16;
            bMesh.rotation.x = Math.PI / 2;
            group.add(bMesh);
          }

          currentObject = group;
          break;
        }

        case 'torus':
          currentObject = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.32, 16, 64), material);
          break;
        case 'gear': {
          const gearGroup = new THREE.Group();
          const core = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.35, 24), material);
          core.rotation.x = Math.PI / 2;
          gearGroup.add(core);

          for (let i = 0; i < 12; i++) {
            const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.36), material);
            const angle = (i / 12) * Math.PI * 2;
            tooth.position.x = Math.cos(angle) * 0.75;
            tooth.position.y = Math.sin(angle) * 0.75;
            tooth.rotation.z = angle;
            gearGroup.add(tooth);
          }
          currentObject = gearGroup;
          break;
        }
        case 'satellite': {
          const satGroup = new THREE.Group();
          const mainBody = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), material);
          satGroup.add(mainBody);

          const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.28, 0.04), material);
          leftPanel.position.x = 1.0;
          satGroup.add(leftPanel);

          const rightPanel = leftPanel.clone();
          rightPanel.position.x = -1.0;
          satGroup.add(rightPanel);

          const dish = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.14, 12), material);
          dish.position.y = 0.55;
          dish.rotation.x = Math.PI;
          satGroup.add(dish);

          currentObject = satGroup;
          break;
        }
        case 'teapot': {
          const teapotGroup = new THREE.Group();
          const mainBody = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 24), material);
          mainBody.scale.set(1.1, 0.88, 1.1);
          teapotGroup.add(mainBody);

          const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.65, 12), material);
          spout.position.set(0.7, 0.18, 0);
          spout.rotation.z = -Math.PI / 4;
          teapotGroup.add(spout);

          const handle = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.07, 12, 24, Math.PI), material);
          handle.position.set(-0.65, 0.08, 0);
          handle.rotation.z = -Math.PI / 2;
          teapotGroup.add(handle);

          const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.14, 16), material);
          lid.position.y = 0.65;
          teapotGroup.add(lid);

          const knob = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), material);
          knob.position.y = 0.76;
          teapotGroup.add(knob);

          currentObject = teapotGroup;
          break;
        }
        case 'drone':
          // If drone fallback and no STL data loaded, bypass adding to scene (rendered as empty spacing block below)
          break;
        case 'mobius':
        default:
          currentObject = new THREE.Mesh(new THREE.TorusKnotGeometry(0.75, 0.24, 100, 16, 3, 5), material);
          break;
      }
    }

    if (settings.modelType !== 'drone' || parsedSuccessfully) {
      scene.add(currentObject);
    }

    // Initial manual angle tilt for perfect isometric product display
    currentObject.rotation.x = 0.35;
    currentObject.rotation.y = 0.45;

    // Setup character mapping ramp
    const charRamp = {
      dots: ' .·:⁚⁘⁙⠿⣿',
      standard: ' .:-=+*#%@',
      detailed: ' .`"^-+*o(L#M@',
      minimal: ' .-+*#',
      blocks: ' ░▒▓█',
      binary: ' 01',
      matrix: ' 0123456789ABCDEF'
    };

    const characters = charRamp[settings.ramp] || charRamp.dots;
    const customResolutionScale = (settings.resolution / 350);

    const effect = new TransparentAsciiEffect(renderer, characters, {
      invert: settings.invert,
      resolution: customResolutionScale
    });

    effect.setSize(width, height);

    // Apply exact visual layout styles of AndrewSink's viewer
    const effectDom = effect.domElement;
    effectDom.style.color = 'inherit';
    effectDom.style.backgroundColor = 'transparent';
    effectDom.style.fontFamily = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
    effectDom.style.fontSize = 'inherit';
    effectDom.style.lineHeight = '0.78';
    effectDom.style.letterSpacing = '0.08em';
    effectDom.style.fontWeight = 'bold';
    effectDom.style.width = '100%';
    effectDom.style.height = '100%';
    effectDom.style.display = 'flex';
    effectDom.style.alignItems = 'center';
    effectDom.style.justifyContent = 'center';
    effectDom.style.overflow = 'hidden';

    mountRef.current.appendChild(effectDom);

    // Interaction controls (Drag to rotate)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !currentObject) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x
      };

      currentObject.rotation.y += deltaMove.x * 0.012;

      if (onRotationChange) {
        onRotationChange(currentObject.rotation.x, currentObject.rotation.y);
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      isDragging = true;
      previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !currentObject || e.touches.length === 0) return;
      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x
      };

      currentObject.rotation.y += deltaMove.x * 0.015;

      if (onRotationChange) {
        onRotationChange(currentObject.rotation.x, currentObject.rotation.y);
      }

      previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const mountEl = mountRef.current;
    if (mountEl) {
      mountEl.addEventListener('mousedown', handleMouseDown);
      mountEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Animation / Rendering Loop
    let animationId: number;
    let lastTime = 0;

    const render = (time: number) => {
      animationId = requestAnimationFrame(render);

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // Smooth auto-rotation on Y-axis (single axis only)
      if (currentObject && settings.autoRotate && !isDragging) {
        currentObject.rotation.y += settings.rotSpeedY * delta;
      }

      effect.render(scene, camera);

      if (onFrameUpdate) {
        onFrameUpdate();
      }
    };

    animationId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      
      if (mountEl) {
        mountEl.removeEventListener('mousedown', handleMouseDown);
        mountEl.removeEventListener('touchstart', handleTouchStart);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      if (mountEl && effectDom.parentNode === mountEl) {
        mountEl.removeChild(effectDom);
      }
    };
  }, [settings, customStlBuffer, localCache, dimensions]);

  function parseBinarySTL(buffer: ArrayBuffer): THREE.BufferGeometry {
    const reader = new DataView(buffer);
    if (buffer.byteLength < 84) {
      throw new Error('STL corrupted: File header too short.');
    }
    const numFaces = reader.getUint32(80, true);
    const expectedSize = 84 + numFaces * 50;
    if (buffer.byteLength < expectedSize - 100) {
      throw new Error('STL corrupted: Poly count size mismatch.');
    }
    const positions = new Float32Array(numFaces * 9);
    const normals = new Float32Array(numFaces * 9);
    let offset = 84;
    for (let face = 0; face < numFaces; face++) {
      if (offset + 50 > buffer.byteLength) break;
      const nx = reader.getFloat32(offset, true);
      const ny = reader.getFloat32(offset + 4, true);
      const nz = reader.getFloat32(offset + 8, true);
      offset += 12;
      const v1x = reader.getFloat32(offset, true);
      const v1y = reader.getFloat32(offset + 4, true);
      const v1z = reader.getFloat32(offset + 8, true);
      offset += 12;
      const v2x = reader.getFloat32(offset, true);
      const v2y = reader.getFloat32(offset + 4, true);
      const v2z = reader.getFloat32(offset + 8, true);
      offset += 12;
      const v3x = reader.getFloat32(offset, true);
      const v3y = reader.getFloat32(offset + 4, true);
      const v3z = reader.getFloat32(offset + 8, true);
      offset += 12;
      offset += 2;

      const pIdx = face * 9;
      positions[pIdx] = v1x; positions[pIdx + 1] = v1y; positions[pIdx + 2] = v1z;
      positions[pIdx + 3] = v2x; positions[pIdx + 4] = v2y; positions[pIdx + 5] = v2z;
      positions[pIdx + 6] = v3x; positions[pIdx + 7] = v3y; positions[pIdx + 8] = v3z;

      for (let i = 0; i < 3; i++) {
        const nIdx = face * 9 + i * 3;
        normals[nIdx] = nx; normals[nIdx + 1] = ny; normals[nIdx + 2] = nz;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.computeVertexNormals();
    geometry.center();
    return geometry;
  }

  // Display loading status for the public asset dynamic loading flow
  const publicModelInfo = PUBLIC_STL_MODELS[settings.modelType as keyof typeof PUBLIC_STL_MODELS];
  const hasStl = customStlBuffer || (publicModelInfo && (publicModelCache[publicModelInfo.path] || localCache[publicModelInfo.path]));

  if (failedModel === settings.modelType && publicModelInfo && !hasStl) {
    return (
      <div className={`w-full max-w-[460px] aspect-square flex flex-col items-center justify-center text-xs ${className}`}>
        <div className="text-current opacity-70 font-mono tracking-wider">MODEL ASSET UNAVAILABLE</div>
        <div className="text-[10px] text-neutral-500 font-mono mt-1">{publicModelInfo.path}</div>
      </div>
    );
  }

  if ((loadingModel === settings.modelType || (publicModelInfo && !hasStl)) && publicModelInfo) {
    return (
      <div className={`w-full max-w-[460px] aspect-square flex flex-col items-center justify-center text-xs animate-pulse ${className}`}>
        <div className="text-current opacity-70 font-mono tracking-wider">LOADING HIGH-FIDELITY MODEL...</div>
        <div className="text-[10px] text-neutral-500 font-mono mt-1">Fetching public asset ({publicModelInfo?.name})</div>
      </div>
    );
  }

  // Fallback rendering condition for Drone in minimalist preview modes when STL data is not fully fetched yet
  if (settings.modelType === 'drone' && !hasStl) {
    return <div className="w-full max-w-[460px] aspect-square bg-transparent" />;
  }

  return (
    <div 
      ref={mountRef} 
      className={`w-full max-w-[460px] aspect-square select-none cursor-grab active:cursor-grabbing flex items-center justify-center ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  modelType: 'printer' | 'extruder' | 'drone' | 'airplane' | 'roboticArm' | 'cycloidalGear';
  techSpecs?: Array<{ parameter: string; specification: string }>;
}

export const PROFILE = {
  name: "Egor Shatalov",
  title: "Mechanical engineer and inventor",
  bio: "Founder of Kinetronika research. My goal is to remove modern technology limitations from building new cool stuff like robots and spaceships\nCreating machines and how they interact with real world\nAimed at fast learning and fast building"
};

export const PROJECTS: Project[] = [
  {
    id: "autofiber-5",
    title: "Autofiber-5",
    description: "World’s first nonplanar 5-axis continuous composites 3D printer",
    modelType: "printer",
    techSpecs: [
      { parameter: "Build volume", specification: "300x700mm" },
      { parameter: "Printing temperature", specification: "up to 450 degrees" },
      { parameter: "Buildplate temperature", specification: "up to 150°" },
      { parameter: "Active chamber temperature", specification: "up to 150°" }
    ]
  },
  {
    id: "acse-2",
    title: "ACSE-2",
    description: "High-temperature continuous composite planetary extruder with rotating nozzle for fast composite printing",
    modelType: "extruder",
    techSpecs: [
      { parameter: "Extrusion temperature", specification: "up to 450 °C" },
      { parameter: "Drive system", specification: "Planetary dual-drive" },
      { parameter: "Fiber compatibility", specification: "Continuous Carbon/Kevlar" },
      { parameter: "Filament diameter", specification: "1.75 / 2.85 mm" }
    ]
  },
  {
    id: "rabbit-80",
    title: "Rabbit 80",
    description: "High-speed tracked robotic platform for autonomous transporting and equipment installation",
    modelType: "drone",
    techSpecs: [
      { parameter: "Top speed", specification: "45 km/h" },
      { parameter: "Payload capacity", specification: "up to 80 kg" },
      { parameter: "Power source", specification: "Hybrid battery pack" },
      { parameter: "Autonomous guidance", specification: "LiDAR + Stereo vision" }
    ]
  },
  {
    id: "forceps-600",
    title: "Forceps 600",
    description: "Foldable high-speed reconnaissance UAV with tech vision for autonomous operations and detection",
    modelType: "airplane",
    techSpecs: [
      { parameter: "Wingspan", specification: "524 mm (80 mm folded)" },
      { parameter: "Flight time", specification: "40 minutes" },
      { parameter: "Operating range", specification: "up to 30 km" },
      { parameter: "Payload sensors", specification: "Thermal, HD + AI tracking" }
    ]
  },
  {
    id: "km-1200",
    title: "KM-1200",
    description: "High-precision 6-axis industrial robotic manipulator for CNC operations (machining/additive)",
    modelType: "roboticArm",
    techSpecs: [
      { parameter: "Axis configuration", specification: "6-axis Articulated" },
      { parameter: "Reach radius", specification: "1200 mm" },
      { parameter: "Rated payload", specification: "10 kg" },
      { parameter: "Repeatability", specification: "±0.02 mm" }
    ]
  },
  {
    id: "crv-25",
    title: "CRV-25",
    description: "Compact cycloidal speed reducer with high torque density and zero backlash",
    modelType: "cycloidalGear",
    techSpecs: [
      { parameter: "Reduction ratio", specification: "50:1 to 120:1" },
      { parameter: "Backlash index", specification: "Zero (< 1 arcmin)" },
      { parameter: "Torque density", specification: "120 Nm/kg" },
      { parameter: "Max input speed", specification: "up to 6000 RPM" }
    ]
  }
];

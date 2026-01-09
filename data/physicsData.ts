export interface Problem {
  q: string; // Question
  a: string; // Answer & Solution (Markdown/LaTeX supported)
  difficulty?: number; // 1-5 scale (Future: for filtering)
  votes?: number; // Upvotes count (Future: community feature)
}

export interface Formula {
  name: string;
  latex: string;
  votes?: number; // Future: community voting
}

export interface Chapter {
  id: string;
  title: string; // e.g., "Ch 15. Oscillations"
  summary: string; // Markdown supported
  youtubeId?: string; // e.g., "dQw4w9WgXcQ"
  problems: Problem[];
  formulas: Formula[];
  difficulty?: number; // 1-5 scale (Future: chapter difficulty rating)
}

export const physicsData: Chapter[] = [
  {
    id: "15",
    title: "Ch 15. Oscillations",
    summary: `
## Simple Harmonic Motion

Simple harmonic motion (SHM) is periodic motion where the restoring force is proportional to displacement.

**Key Concepts:**
- Period $(T)$ and Frequency $(f)$
- Angular Frequency $\\omega = 2\\pi f = \\frac{2\\pi}{T}$
- Energy in SHM: $E = \\frac{1}{2}kA^2$ (constant)
`,
    youtubeId: "dQw4w9WgXcQ", // Replace with actual video
    formulas: [
      { name: "Displacement (SHM)", latex: "x(t) = A \\cos(\\omega t + \\phi)" },
      { name: "Velocity (SHM)", latex: "v(t) = -A\\omega \\sin(\\omega t + \\phi)" },
      { name: "Acceleration (SHM)", latex: "a(t) = -A\\omega^2 \\cos(\\omega t + \\phi)" },
      { name: "Angular Frequency", latex: "\\omega = \\sqrt{\\frac{k}{m}}" },
      { name: "Period (Spring)", latex: "T = 2\\pi\\sqrt{\\frac{m}{k}}" },
      { name: "Period (Pendulum)", latex: "T = 2\\pi\\sqrt{\\frac{L}{g}}" },
      { name: "Total Energy", latex: "E = \\frac{1}{2}kA^2 = \\frac{1}{2}mv_{max}^2" },
    ],
    problems: [
      {
        q: "A 0.50 kg mass attached to a spring oscillates with an amplitude of 0.20 m and a period of 1.5 s. Calculate (a) the spring constant and (b) the maximum speed.",
        a: `
**Given:**
- $m = 0.50$ kg
- $A = 0.20$ m
- $T = 1.5$ s

**(a) Spring constant:**

$$T = 2\\pi\\sqrt{\\frac{m}{k}} \\implies k = \\frac{4\\pi^2 m}{T^2}$$

$$k = \\frac{4\\pi^2 (0.50)}{(1.5)^2} = 8.77 \\text{ N/m}$$

**(b) Maximum speed:**

$$v_{max} = A\\omega = A \\cdot \\frac{2\\pi}{T} = 0.20 \\cdot \\frac{2\\pi}{1.5} = 0.84 \\text{ m/s}$$
`,
      },
      {
        q: "A pendulum has a length of 1.0 m. What is its period on Earth $(g = 9.8 \\text{ m/s}^2)$?",
        a: `
**Given:**
- $L = 1.0$ m
- $g = 9.8$ m/s²

**Solution:**

$$T = 2\\pi\\sqrt{\\frac{L}{g}} = 2\\pi\\sqrt{\\frac{1.0}{9.8}} = 2.01 \\text{ s}$$
`,
      },
    ],
  },
  {
    id: "16",
    title: "Ch 16. Waves I",
    summary: `
## Traveling Waves

A wave is a disturbance that propagates through space and time, transferring energy without transferring matter.

**Key Concepts:**
- Wavelength $(\\lambda)$, Frequency $(f)$, Wave speed $(v)$
- Wave equation: $v = f\\lambda$
- Transverse vs Longitudinal waves
`,
    formulas: [
      { name: "Wave Speed", latex: "v = f\\lambda = \\frac{\\lambda}{T}" },
      { name: "Wave Function", latex: "y(x,t) = A \\sin(kx - \\omega t + \\phi)" },
      { name: "Wave Number", latex: "k = \\frac{2\\pi}{\\lambda}" },
      { name: "Speed on String", latex: "v = \\sqrt{\\frac{T}{\\mu}}" },
      { name: "Power Transmitted", latex: "P = \\frac{1}{2}\\mu v \\omega^2 A^2" },
    ],
    problems: [
      {
        q: "A wave has a frequency of 60 Hz and a wavelength of 0.50 m. Calculate the wave speed.",
        a: `
**Given:**
- $f = 60$ Hz
- $\\lambda = 0.50$ m

**Solution:**

$$v = f\\lambda = (60)(0.50) = 30 \\text{ m/s}$$
`,
      },
    ],
  },
  {
    id: "17",
    title: "Ch 17. Waves II",
    summary: `
## Sound Waves & Interference

Sound waves are longitudinal pressure waves. This chapter covers sound intensity, interference, and the Doppler effect.

**Key Topics:**
- Sound intensity and decibels
- Standing waves and resonance
- Doppler effect
`,
    formulas: [
      { name: "Sound Intensity", latex: "I = \\frac{P}{4\\pi r^2}" },
      { name: "Sound Level (dB)", latex: "\\beta = 10 \\log_{10}\\left(\\frac{I}{I_0}\\right)" },
      { name: "Doppler (Approaching)", latex: "f' = f\\frac{v + v_D}{v - v_S}" },
      { name: "Beat Frequency", latex: "f_{beat} = |f_1 - f_2|" },
    ],
    problems: [],
  },
  {
    id: "18",
    title: "Ch 18. Temperature, Heat, and the First Law",
    summary: "Thermodynamics basics: temperature scales, heat transfer, and the first law of thermodynamics.",
    formulas: [
      { name: "Linear Expansion", latex: "\\Delta L = L_0 \\alpha \\Delta T" },
      { name: "Heat Transfer", latex: "Q = mc\\Delta T" },
      { name: "First Law", latex: "\\Delta E_{int} = Q - W" },
    ],
    problems: [],
  },
  {
    id: "19",
    title: "Ch 19. The Kinetic Theory of Gases",
    summary: "Molecular interpretation of temperature and pressure. Ideal gas law and kinetic energy.",
    formulas: [
      { name: "Ideal Gas Law", latex: "PV = nRT" },
      { name: "Kinetic Energy", latex: "K_{avg} = \\frac{3}{2}kT" },
      { name: "RMS Speed", latex: "v_{rms} = \\sqrt{\\frac{3kT}{m}}" },
    ],
    problems: [],
  },
  {
    id: "20",
    title: "Ch 20. Entropy and the Second Law",
    summary: "Entropy, reversible/irreversible processes, and the second law of thermodynamics.",
    formulas: [
      { name: "Entropy Change", latex: "\\Delta S = \\int \\frac{dQ}{T}" },
      { name: "Carnot Efficiency", latex: "e = 1 - \\frac{T_C}{T_H}" },
    ],
    problems: [],
  },
  {
    id: "21",
    title: "Ch 21. Coulomb's Law",
    summary: "Electric charge, Coulomb's law, and electric fields.",
    formulas: [
      { name: "Coulomb's Law", latex: "F = k\\frac{|q_1 q_2|}{r^2}" },
      { name: "Electric Field", latex: "E = \\frac{F}{q} = k\\frac{Q}{r^2}" },
    ],
    problems: [],
  },
  {
    id: "22",
    title: "Ch 22. Electric Fields",
    summary: "Electric field lines, Gauss's law, and applications.",
    formulas: [
      { name: "Gauss's Law", latex: "\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{enc}}{\\epsilon_0}" },
      { name: "Field (Infinite Sheet)", latex: "E = \\frac{\\sigma}{2\\epsilon_0}" },
    ],
    problems: [],
  },
  {
    id: "23",
    title: "Ch 23. Electric Potential",
    summary: "Electric potential energy and electric potential.",
    formulas: [
      { name: "Electric Potential", latex: "V = \\frac{U}{q} = k\\frac{Q}{r}" },
      { name: "Potential Difference", latex: "\\Delta V = -\\int \\vec{E} \\cdot d\\vec{l}" },
    ],
    problems: [],
  },
  {
    id: "24",
    title: "Ch 24. Capacitance",
    summary: "Capacitors, capacitance, and energy storage.",
    formulas: [
      { name: "Capacitance", latex: "C = \\frac{Q}{V}" },
      { name: "Parallel Plate", latex: "C = \\epsilon_0 \\frac{A}{d}" },
      { name: "Energy Stored", latex: "U = \\frac{1}{2}CV^2 = \\frac{1}{2}QV" },
    ],
    problems: [],
  },
  {
    id: "25",
    title: "Ch 25. Current and Resistance",
    summary: "Electric current, resistance, and Ohm's law.",
    formulas: [
      { name: "Current", latex: "I = \\frac{dQ}{dt}" },
      { name: "Ohm's Law", latex: "V = IR" },
      { name: "Resistance", latex: "R = \\rho \\frac{L}{A}" },
      { name: "Power", latex: "P = IV = I^2R = \\frac{V^2}{R}" },
    ],
    problems: [],
  },
  {
    id: "26",
    title: "Ch 26. Circuits",
    summary: "DC circuits, Kirchhoff's laws, and RC circuits.",
    formulas: [
      { name: "Series Resistance", latex: "R_{eq} = R_1 + R_2 + ..." },
      { name: "Parallel Resistance", latex: "\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2} + ..." },
      { name: "RC Time Constant", latex: "\\tau = RC" },
    ],
    problems: [],
  },
  {
    id: "27",
    title: "Ch 27. Magnetic Fields",
    summary: "Magnetic fields, forces on moving charges, and magnetic materials.",
    formulas: [
      { name: "Magnetic Force", latex: "\\vec{F} = q\\vec{v} \\times \\vec{B}" },
      { name: "Force on Wire", latex: "F = ILB\\sin\\theta" },
      { name: "Cyclotron Radius", latex: "r = \\frac{mv}{qB}" },
    ],
    problems: [],
  },
  {
    id: "28",
    title: "Ch 28. Magnetic Fields Due to Currents",
    summary: "Biot-Savart law, Ampère's law, and magnetic fields from currents.",
    formulas: [
      { name: "Biot-Savart Law", latex: "d\\vec{B} = \\frac{\\mu_0}{4\\pi}\\frac{Id\\vec{l} \\times \\hat{r}}{r^2}" },
      { name: "Field (Long Wire)", latex: "B = \\frac{\\mu_0 I}{2\\pi r}" },
      { name: "Ampère's Law", latex: "\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{enc}" },
    ],
    problems: [],
  },
  {
    id: "29",
    title: "Ch 29. Induction and Inductance",
    summary: "Faraday's law, Lenz's law, and inductance.",
    formulas: [
      { name: "Faraday's Law", latex: "\\mathcal{E} = -\\frac{d\\Phi_B}{dt}" },
      { name: "Inductance", latex: "L = \\frac{\\Phi_B}{I}" },
      { name: "Self-Induced EMF", latex: "\\mathcal{E}_L = -L\\frac{dI}{dt}" },
      { name: "Energy Stored", latex: "U = \\frac{1}{2}LI^2" },
    ],
    problems: [],
  },
  {
    id: "30",
    title: "Ch 30. Electromagnetic Oscillations",
    summary: "LC circuits, RLC circuits, and AC circuits.",
    formulas: [
      { name: "LC Frequency", latex: "\\omega = \\frac{1}{\\sqrt{LC}}" },
      { name: "Capacitive Reactance", latex: "X_C = \\frac{1}{\\omega C}" },
      { name: "Inductive Reactance", latex: "X_L = \\omega L" },
    ],
    problems: [],
  },
  {
    id: "31",
    title: "Ch 31. Electromagnetic Waves",
    summary: "Maxwell's equations and electromagnetic wave propagation.",
    formulas: [
      { name: "Wave Speed", latex: "c = \\frac{1}{\\sqrt{\\mu_0\\epsilon_0}}" },
      { name: "Intensity", latex: "I = \\frac{E_0^2}{2\\mu_0 c}" },
      { name: "Radiation Pressure", latex: "p_r = \\frac{I}{c}" },
    ],
    problems: [],
  },
  {
    id: "32",
    title: "Ch 32. Images",
    summary: "Reflection, refraction, and image formation by mirrors and lenses.",
    formulas: [
      { name: "Mirror Equation", latex: "\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}" },
      { name: "Magnification", latex: "m = -\\frac{d_i}{d_o} = \\frac{h_i}{h_o}" },
      { name: "Snell's Law", latex: "n_1\\sin\\theta_1 = n_2\\sin\\theta_2" },
    ],
    problems: [],
  },
  {
    id: "33",
    title: "Ch 33. Interference",
    summary: "Wave interference, Young's double-slit experiment, and thin films.",
    formulas: [
      { name: "Double-Slit (Bright)", latex: "d\\sin\\theta = m\\lambda" },
      { name: "Double-Slit (Dark)", latex: "d\\sin\\theta = (m + \\frac{1}{2})\\lambda" },
      { name: "Thin Film", latex: "2nt = m\\lambda" },
    ],
    problems: [],
  },
  {
    id: "34",
    title: "Ch 34. Diffraction and Polarization",
    summary: "Single-slit diffraction, diffraction gratings, and polarization.",
    formulas: [
      { name: "Single-Slit (Dark)", latex: "a\\sin\\theta = m\\lambda" },
      { name: "Grating", latex: "d\\sin\\theta = m\\lambda" },
      { name: "Malus's Law", latex: "I = I_0\\cos^2\\theta" },
    ],
    problems: [],
  },
];

// Helper function to get chapter by ID
export function getChapterById(id: string): Chapter | undefined {
  return physicsData.find(ch => ch.id === id);
}

// Get all formulas (for search)
export function getAllFormulas() {
  return physicsData.flatMap(ch => 
    ch.formulas.map(f => ({ ...f, chapterId: ch.id, chapterTitle: ch.title }))
  );
}

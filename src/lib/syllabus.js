export const SYL = {
  math: [
    "Sets, Relations & Functions",
    "Complex Numbers & Quadratic Equations",
    "Matrices & Determinants",
    "Permutations & Combinations",
    "Binomial Theorem",
    "Sequences & Series",
    "Limits, Continuity & Differentiability",
    "Integral Calculus",
    "Differential Equations",
    "Coordinate Geometry",
    "3D Geometry",
    "Vector Algebra",
    "Statistics & Probability",
    "Trigonometry"
  ].map((n, i) => ({ id: `m${i + 1}`, n })),
  phys: [
    "Units & Measurements",
    "Kinematics",
    "Laws of Motion",
    "Work, Energy & Power",
    "Rotational Motion",
    "Gravitation",
    "Properties of Solids & Liquids",
    "Thermodynamics",
    "Kinetic Theory of Gases",
    "Oscillations & Waves",
    "Electrostatics",
    "Current Electricity",
    "Magnetic Effects & Magnetism",
    "Electromagnetic Induction & AC",
    "Electromagnetic Waves",
    "Optics",
    "Dual Nature of Matter",
    "Atoms & Nuclei",
    "Electronic Devices",
    "Experimental Skills"
  ].map((n, i) => ({ id: `p${i + 1}`, n })),
  chem: [
    "Basic Concepts in Chemistry",
    "Atomic Structure",
    "Chemical Bonding & Molecular Structure",
    "Chemical Thermodynamics",
    "Solutions",
    "Equilibrium",
    "Redox Reactions & Electrochemistry",
    "Chemical Kinetics",
    "Classification of Elements",
    "p-Block Elements",
    "d & f-Block Elements",
    "Coordination Compounds",
    "Purification of Organic Compounds",
    "Basic Principles of Organic Chemistry",
    "Hydrocarbons",
    "Organic Compounds with Halogens",
    "Organic Compounds with Oxygen",
    "Organic Compounds with Nitrogen",
    "Biomolecules",
    "Practical Chemistry"
  ].map((n, i) => ({ id: `c${i + 1}`, n }))
};

export const TOT = { math: 14, phys: 20, chem: 20 };

export const QUOTES = [
  "Every expert was once a beginner. Keep going! 🌟",
  "25 days of pure focus can rewrite your entire story. 💫",
  "The pain of discipline is far less than the pain of regret. 🔥",
  "You've survived 100% of your hard days so far. 💪",
  "One topic at a time. One day at a time. You've got this. 🎯",
  "Champions are made in the quiet hours nobody sees. ⚡",
  "Study hard. Stay consistent. Trust the process. 🚀"
];

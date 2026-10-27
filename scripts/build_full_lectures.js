const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const publicDir = path.join(__dirname, '..', 'public');

// Complete courses catalog covering all 4 Years and 8 Semesters
const existingData = JSON.parse(fs.readFileSync(path.join(dataDir, 'lectures.json'), 'utf8'));

// Supplementary courses for complete coverage of all 8 semesters
const supplementaryCourses = [
  // Semester 2
  {
    id: "sem2-chem",
    title: "Engineering Chemistry (Group A)",
    code: "BAS-202",
    channelId: "multiatoms",
    channelName: "MultiAtoms",
    channelBadge: "MultiAtoms",
    icon: "🧪",
    year: "1st Year",
    semester: 2,
    playlistUrl: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s1698CXH-iBOAFYGWUcHaG",
    marathonUrl: "https://www.youtube.com/watch?v=2r7i1kzb2ch",
    units: [
      { unit: "Unit 1", title: "Unit 1: Molecular Structure & Bonding One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s1698CXH-iBOAFYGWUcHaG" },
      { unit: "Unit 2", title: "Unit 2: Spectroscopic Techniques One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s1698CXH-iBOAFYGWUcHaG" },
      { unit: "Unit 3", title: "Unit 3: Electrochemistry & Battery Tech One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s1698CXH-iBOAFYGWUcHaG" },
      { unit: "Unit 4", title: "Unit 4: Water Analysis & Treatment One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s1698CXH-iBOAFYGWUcHaG" },
      { unit: "Unit 5", title: "Unit 5: Polymers, Organometallics & Nanomaterials One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s1698CXH-iBOAFYGWUcHaG" }
    ]
  },
  {
    id: "sem2-electronics",
    title: "Fundamentals of Electronics (Group A)",
    code: "BEC-201",
    channelId: "multiatoms",
    channelName: "MultiAtoms",
    channelBadge: "MultiAtoms",
    icon: "📡",
    year: "1st Year",
    semester: 2,
    playlistUrl: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s5G_BlPJeheBxZfBMts3Vz",
    units: [
      { unit: "Unit 1", title: "Unit 1: Semiconductor Diodes & Power Supplies One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s5G_BlPJeheBxZfBMts3Vz" },
      { unit: "Unit 2", title: "Unit 2: Transistor Amplifiers (BJT) One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s5G_BlPJeheBxZfBMts3Vz" },
      { unit: "Unit 3", title: "Unit 3: Field Effect Transistors (JFET/MOSFET) One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s5G_BlPJeheBxZfBMts3Vz" },
      { unit: "Unit 4", title: "Unit 4: Operational Amplifiers (Op-Amps) One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s5G_BlPJeheBxZfBMts3Vz" },
      { unit: "Unit 5", title: "Unit 5: Digital Logic, Flip-Flops & Instruments One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8s5G_BlPJeheBxZfBMts3Vz" }
    ]
  },
  {
    id: "sem2-evs",
    title: "Environment & Ecology (Group A)",
    code: "BAS-204",
    channelId: "multiatoms",
    channelName: "MultiAtoms",
    channelBadge: "MultiAtoms",
    icon: "🌱",
    year: "1st Year",
    semester: 2,
    playlistUrl: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8uoXjVVrLlVhq0CS8tBh7ru",
    units: [
      { unit: "Unit 1", title: "Unit 1: Ecosystems & Biodiversity One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8uoXjVVrLlVhq0CS8tBh7ru" },
      { unit: "Unit 2", title: "Unit 2: Natural Energy Resources One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8uoXjVVrLlVhq0CS8tBh7ru" },
      { unit: "Unit 3", title: "Unit 3: Pollution Control & Solid Waste One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8uoXjVVrLlVhq0CS8tBh7ru" },
      { unit: "Unit 4", title: "Unit 4: Environmental Protection Laws & EIA One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8uoXjVVrLlVhq0CS8tBh7ru" },
      { unit: "Unit 5", title: "Unit 5: Climate Change & Sustainable Growth One Shot", type: "oneshot", url: "https://www.youtube.com/playlist?list=PL49mRA0Y_C8uoXjVVrLlVhq0CS8tBh7ru" }
    ]
  },
  // Semester 4 additional
  {
    id: "sem4-maths4",
    title: "Engineering Mathematics IV (Complex & Stats)",
    code: "BAS-403",
    channelId: "gateway-classes",
    channelName: "Gateway Classes",
    channelBadge: "Gateway Classes",
    icon: "📐",
    year: "2nd Year",
    semester: 4,
    playlistUrl: "https://www.youtube.com/@GatewayClasses/search?query=Maths+4+AKTU+One+Shot",
    units: [
      { unit: "Unit 1", title: "Unit 1: Partial Differential Equations One Shot", type: "oneshot", url: "https://www.youtube.com/@GatewayClasses/search?query=Maths+4+Unit+1+One+Shot" },
      { unit: "Unit 2", title: "Unit 2: Applications of PDE & Wave Equation One Shot", type: "oneshot", url: "https://www.youtube.com/@GatewayClasses/search?query=Maths+4+Unit+2+One+Shot" },
      { unit: "Unit 3", title: "Unit 3: Statistical Techniques & Moments One Shot", type: "oneshot", url: "https://www.youtube.com/@GatewayClasses/search?query=Maths+4+Unit+3+One+Shot" },
      { unit: "Unit 4", title: "Unit 4: Probability & Sampling Distributions One Shot", type: "oneshot", url: "https://www.youtube.com/@GatewayClasses/search?query=Maths+4+Unit+4+One+Shot" },
      { unit: "Unit 5", title: "Unit 5: Hypothesis Testing & ANOVA One Shot", type: "oneshot", url: "https://www.youtube.com/@GatewayClasses/search?query=Maths+4+Unit+5+One+Shot" }
    ]
  },
  // Semester 6 additional
  {
    id: "sem6-ml",
    title: "Machine Learning (ML)",
    code: "BCS-063",
    channelId: "ah-tutorials",
    channelName: "AH Tutorials",
    channelBadge: "AH Tutorials",
    icon: "🤖",
    year: "3rd Year",
    semester: 6,
    playlistUrl: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Machine+Learning+AKTU+One+Shot",
    units: [
      { unit: "Unit 1", title: "Unit 1: Intro to Machine Learning & Concept Learning One Shot", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Machine+Learning+Unit+1+One+Shot" },
      { unit: "Unit 2", title: "Unit 2: Decision Trees & Artificial Neural Networks One Shot", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Machine+Learning+Unit+2+One+Shot" },
      { unit: "Unit 3", title: "Unit 3: Bayesian Learning & Expectation Maximization One Shot", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Machine+Learning+Unit+3+One+Shot" },
      { unit: "Unit 4", title: "Unit 4: Computational Learning Theory & Instance-Based One Shot", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Machine+Learning+Unit+4+One+Shot" },
      { unit: "Unit 5", title: "Unit 5: Genetic Algorithms & Reinforcement Learning One Shot", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Machine+Learning+Unit+5+One+Shot" }
    ]
  },
  // Semester 7 additional
  {
    id: "sem7-cns",
    title: "Cryptography & Network Security (CNS)",
    code: "KCS-075",
    channelId: "ah-tutorials",
    channelName: "AH Tutorials",
    channelBadge: "AH Tutorials",
    icon: "🔐",
    year: "4th Year",
    semester: 7,
    playlistUrl: "https://www.youtube.com/@AHTUTORIALS2024/search?query=CNS+AKTU+One+Shot",
    units: [
      { unit: "Unit 1", title: "Unit 1: Classical Encryption & Modern Symmetric Ciphers (DES/AES)", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=CNS+Unit+1+One+Shot" },
      { unit: "Unit 2", title: "Unit 2: Public Key Cryptography & RSA Algorithm", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=CNS+Unit+2+One+Shot" },
      { unit: "Unit 3", title: "Unit 3: Key Management, Diffie-Hellman & Elliptic Curves", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=CNS+Unit+3+One+Shot" },
      { unit: "Unit 4", title: "Unit 4: Message Authentication, SHA & Digital Signatures", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=CNS+Unit+4+One+Shot" },
      { unit: "Unit 5", title: "Unit 5: Network Security Protocols (IPSec, SSL/TLS, Firewalls)", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=CNS+Unit+5+One+Shot" }
    ]
  },
  // Semester 8 additional
  {
    id: "sem8-distributed",
    title: "Distributed Systems",
    code: "KCS-082",
    channelId: "ah-tutorials",
    channelName: "AH Tutorials",
    channelBadge: "AH Tutorials",
    icon: "🌐",
    year: "4th Year",
    semester: 8,
    playlistUrl: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Distributed+Systems+AKTU+One+Shot",
    units: [
      { unit: "Unit 1", title: "Unit 1: Distributed Models & IPC One Shot", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Distributed+Systems+Unit+1+One+Shot" },
      { unit: "Unit 2", title: "Unit 2: Logical Clocks & Synchronization One Shot", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Distributed+Systems+Unit+2+One+Shot" },
      { unit: "Unit 3", title: "Unit 3: Distributed Mutual Exclusion & Election One Shot", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Distributed+Systems+Unit+3+One+Shot" },
      { unit: "Unit 4", title: "Unit 4: Fault Tolerance & Consensus Protocols One Shot", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Distributed+Systems+Unit+4+One+Shot" },
      { unit: "Unit 5", title: "Unit 5: Distributed File Systems (NFS/HDFS) One Shot", type: "oneshot", url: "https://www.youtube.com/@AHTUTORIALS2024/search?query=Distributed+Systems+Unit+5+One+Shot" }
    ]
  },
  {
    id: "sem8-entrepreneurship",
    title: "Entrepreneurship Development",
    code: "KOE-082",
    channelId: "gateway-classes",
    channelName: "Gateway Classes",
    channelBadge: "Gateway Classes",
    icon: "💼",
    year: "4th Year",
    semester: 8,
    playlistUrl: "https://www.youtube.com/@GatewayClasses/search?query=Entrepreneurship+Development+AKTU+One+Shot",
    units: [
      { unit: "Unit 1", title: "Unit 1: Concept & Definition of Entrepreneurship One Shot", type: "oneshot", url: "https://www.youtube.com/@GatewayClasses/search?query=Entrepreneurship+Unit+1+One+Shot" },
      { unit: "Unit 2", title: "Unit 2: Business Opportunities & Project Selection One Shot", type: "oneshot", url: "https://www.youtube.com/@GatewayClasses/search?query=Entrepreneurship+Unit+2+One+Shot" },
      { unit: "Unit 3", title: "Unit 3: Project Appraisal & Financing Methods One Shot", type: "oneshot", url: "https://www.youtube.com/@GatewayClasses/search?query=Entrepreneurship+Unit+3+One+Shot" },
      { unit: "Unit 4", title: "Unit 4: MSME Regulations & Enterprise Management One Shot", type: "oneshot", url: "https://www.youtube.com/@GatewayClasses/search?query=Entrepreneurship+Unit+4+One+Shot" },
      { unit: "Unit 5", title: "Unit 5: Industrial Support Institutions & Policies One Shot", type: "oneshot", url: "https://www.youtube.com/@GatewayClasses/search?query=Entrepreneurship+Unit+5+One+Shot" }
    ]
  }
];

// Merge without duplicates
const existingIds = new Set(existingData.courses.map(c => c.id));
supplementaryCourses.forEach(c => {
  if (!existingIds.has(c.id)) {
    existingData.courses.push(c);
    existingIds.add(c.id);
  }
});

// Sort by semester (1 to 8), then by title
existingData.courses.sort((a, b) => {
  if (a.semester !== b.semester) return a.semester - b.semester;
  return a.title.localeCompare(b.title);
});

fs.writeFileSync(path.join(dataDir, 'lectures.json'), JSON.stringify(existingData, null, 2), 'utf8');
console.log('✓ lectures.json saved with ' + existingData.courses.length + ' total courses covering Sem 1 to Sem 8!');

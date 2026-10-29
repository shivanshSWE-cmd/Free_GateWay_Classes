const fs = require('fs');
const path = require('path');

const lecturesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'lectures.json'), 'utf8'));

// Specific known playlists
const knownPlaylists = {
  'sem1-bee': {
    multiatoms: 'https://www.youtube.com/playlist?list=PLh11ucJN276LVQCgcc6ps_NtaaOMBbEIv',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=BEE+Basic+Electrical+Engineering+AKTU+One+Shot',
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=BEE+Electrical+Engineering+AKTU+One+Shot'
  },
  'sem1-chemistry': {
    multiatoms: 'https://www.youtube.com/playlist?list=PL49mRA0Y_C8s1698CXH-iBOAFYGWUcHaG',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Engineering+Chemistry+AKTU+One+Shot',
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Engineering+Chemistry+AKTU+One+Shot'
  },
  'sem1-maths1': {
    gateway: 'https://www.youtube.com/playlist?list=PL49mRA0Y_C8vXKy_Vz7YwXrBm7e2cIceO',
    multiatoms: 'https://www.youtube.com/@MultiAtoms/search?query=Engineering+Mathematics+1+AKTU+One+Shot',
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Engineering+Mathematics+1+AKTU+One+Shot'
  },
  'sem1-physics': {
    multiatoms: 'https://www.youtube.com/playlist?list=PLh11ucJN276KQV0jrDM3883tvArRJwB7v',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Engineering+Physics+AKTU+One+Shot',
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Engineering+Physics+AKTU+One+Shot'
  },
  'sem1-evs': {
    multiatoms: 'https://www.youtube.com/playlist?list=PL49mRA0Y_C8uoXjVVrLlVhq0CS8tBh7ru',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Environment+and+Ecology+AKTU+One+Shot',
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Environment+and+Ecology+AKTU+One+Shot'
  },
  'sem1-electronics': {
    multiatoms: 'https://www.youtube.com/playlist?list=PL49mRA0Y_C8s5G_BlPJeheBxZfBMts3Vz',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Fundamentals+of+Electronics+Engineering+AKTU+One+Shot',
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Fundamentals+of+Electronics+Engineering+AKTU+One+Shot'
  },
  'sem1-pps': {
    multiatoms: 'https://www.youtube.com/playlist?list=PL49mRA0Y_C8sCqx21iu0EnfFgQGL5U19l',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Programming+for+Problem+Solving+PPS+AKTU+One+Shot',
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=PPS+C+Programming+AKTU+One+Shot'
  },
  'sem2-maths2': {
    multiatoms: 'https://www.youtube.com/playlist?list=PL49mRA0Y_C8vzwDx1luAhJLUIWqzbVa-H',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Engineering+Mathematics+2+AKTU+One+Shot',
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Engineering+Mathematics+2+AKTU+One+Shot'
  },
  'sem3-dsa': {
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=DSA+Data+Structures+AKTU+One+Shot',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Data+Structures+DSA+AKTU+One+Shot',
    multiatoms: 'https://www.youtube.com/@MultiAtoms/search?query=Data+Structures+DSA+AKTU+One+Shot'
  },
  'sem3-coa': {
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=AKTU+COA+PYQ+Oneshot',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Computer+Organization+COA+AKTU+One+Shot',
    multiatoms: 'https://www.youtube.com/@MultiAtoms/search?query=Computer+Organization+COA+AKTU+One+Shot'
  },
  'sem3-dstl': {
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=DSTL+AKTU+One+Shot',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Discrete+Structures+DSTL+AKTU+One+Shot',
    multiatoms: 'https://www.youtube.com/@MultiAtoms/search?query=DSTL+AKTU+One+Shot'
  },
  'sem3-uhv': {
    multiatoms: 'https://www.youtube.com/playlist?list=PLh11ucJN276LBBbvmFsopt4Lphrxwqlg1',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Universal+Human+Values+UHV+AKTU+One+Shot',
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Universal+Human+Values+UHV+AKTU+One+Shot'
  },
  'sem4-os': {
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Operating+System+OS+AKTU+One+Shot',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Operating+System+OS+AKTU+One+Shot',
    multiatoms: 'https://www.youtube.com/@MultiAtoms/search?query=Operating+System+OS+AKTU+One+Shot'
  },
  'sem4-java': {
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=OOP+with+Java+AKTU+One+Shot',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=OOP+Java+AKTU+One+Shot',
    multiatoms: 'https://www.youtube.com/@MultiAtoms/search?query=OOP+Java+AKTU+One+Shot'
  },
  'sem4-cyber': {
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Cyber+Security+AKTU+One+Shot',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Cyber+Security+AKTU+One+Shot',
    multiatoms: 'https://www.youtube.com/@MultiAtoms/search?query=Cyber+Security+AKTU+One+Shot'
  },
  'sem5-daa': {
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=DAA+Design+and+Analysis+of+Algorithms+AKTU+One+Shot',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=DAA+Algorithms+AKTU+One+Shot',
    multiatoms: 'https://www.youtube.com/@MultiAtoms/search?query=DAA+Algorithms+AKTU+One+Shot'
  },
  'sem5-dbms': {
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=DBMS+Database+Management+AKTU+One+Shot',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=DBMS+AKTU+One+Shot',
    multiatoms: 'https://www.youtube.com/@MultiAtoms/search?query=DBMS+AKTU+One+Shot'
  },
  'sem5-wt': {
    multiatoms: 'https://www.youtube.com/playlist?list=PL49mRA0Y_C8tzOlGXnZyxvtQLvYZ7Fykm',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Web+Technology+AKTU+One+Shot',
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Web+Technology+AKTU+One+Shot'
  },
  'sem6-compiler': {
    multiatoms: 'https://youtube.com/playlist?list=PLh11ucJN276J4uv6uwawDr3mNHTdx9n43',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Compiler+Design+AKTU+One+Shot',
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Compiler+Design+AKTU+One+Shot'
  },
  'sem7-ai': {
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Artificial+Intelligence+AI+AKTU+One+Shot',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Artificial+Intelligence+AI+AKTU+One+Shot',
    multiatoms: 'https://www.youtube.com/@MultiAtoms/search?query=Artificial+Intelligence+AI+AKTU+One+Shot'
  },
  'sem8-deep-learning': {
    ah: 'https://www.youtube.com/@AHTUTORIALS2024/search?query=Deep+Learning+AKTU+One+Shot',
    gateway: 'https://www.youtube.com/@GatewayClasses/search?query=Deep+Learning+AKTU+One+Shot',
    multiatoms: 'https://www.youtube.com/@MultiAtoms/search?query=Deep+Learning+AKTU+One+Shot'
  }
};

lecturesData.courses.forEach(c => {
  const query = encodeURIComponent(c.title + ' AKTU One Shot');
  const kp = knownPlaylists[c.id] || {};

  c.playlists = {
    gateway: kp.gateway || `https://www.youtube.com/@GatewayClasses/search?query=${query}`,
    ah: kp.ah || `https://www.youtube.com/@AHTUTORIALS2024/search?query=${query}`,
    multiatoms: kp.multiatoms || `https://www.youtube.com/@MultiAtoms/search?query=${query}`
  };
});

fs.writeFileSync(path.join(__dirname, '..', 'data', 'lectures.json'), JSON.stringify(lecturesData, null, 2), 'utf8');
console.log(`✓ Updated all ${lecturesData.courses.length} courses in data/lectures.json with playlists for all 3 channels!`);

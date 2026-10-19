const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rawDir = path.join(__dirname, '..', 'raw_data');
const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Extracting data from raw files...');

// 1. Extract 1year.html (links, subjectMeta)
try {
  const content = fs.readFileSync(path.join(rawDir, '1year.html'), 'utf-8');
  
  // Find `const links = { ... };` and `const subjectMeta = { ... };`
  const linksMatch = content.match(/const\s+links\s*=\s*(\{[\s\S]*?\n\s*\});/);
  const metaMatch = content.match(/const\s+subjectMeta\s*=\s*(\{[\s\S]*?\n\s*\});/);

  let links = {};
  let subjectMeta = {};

  if (linksMatch) {
    const sandbox = {};
    vm.runInNewContext('links = ' + linksMatch[1], sandbox);
    links = sandbox.links;
  }
  if (metaMatch) {
    const sandbox = {};
    vm.runInNewContext('meta = ' + metaMatch[1], sandbox);
    subjectMeta = sandbox.meta;
  }

  // Format 1year data
  const year1Formatted = {
    title: 'AKTU B.Tech 1st Year Notes & PYQ',
    subjectMeta: subjectMeta,
    subjects: links
  };
  fs.writeFileSync(path.join(dataDir, 'year1.json'), JSON.stringify(year1Formatted, null, 2), 'utf-8');
  console.log(`✓ 1year.json saved (${Object.keys(links).length} subjects)`);
} catch (e) {
  console.error('Error extracting 1year.html:', e);
}

// 2. Extract 2ndyear.html (data, subjectMeta)
try {
  const content = fs.readFileSync(path.join(rawDir, '2ndyear.html'), 'utf-8');
  const dataMatch = content.match(/const\s+data\s*=\s*(\{[\s\S]*?\n\s*\});/);
  const metaMatch = content.match(/const\s+subjectMeta\s*=\s*(\{[\s\S]*?\n\s*\});/);

  let data = {};
  let subjectMeta = {};

  if (dataMatch) {
    const sandbox = {};
    vm.runInNewContext('data = ' + dataMatch[1], sandbox);
    data = sandbox.data;
  }
  if (metaMatch) {
    const sandbox = {};
    vm.runInNewContext('meta = ' + metaMatch[1], sandbox);
    subjectMeta = sandbox.meta;
  }

  const year2Formatted = {
    title: 'AKTU B.Tech 2nd Year Notes & PYQ',
    subjectMeta: subjectMeta,
    subjects: data
  };
  fs.writeFileSync(path.join(dataDir, 'year2.json'), JSON.stringify(year2Formatted, null, 2), 'utf-8');
  console.log(`✓ year2.json saved (${Object.keys(data).length} subjects)`);
} catch (e) {
  console.error('Error extracting 2ndyear.html:', e);
}

// 3. Extract 3year.html (subjectsData)
try {
  const content = fs.readFileSync(path.join(rawDir, '3year.html'), 'utf-8');
  const match = content.match(/const\s+subjectsData\s*=\s*(\[[\s\S]*?\]);/);
  if (match) {
    const sandbox = {};
    vm.runInNewContext('data = ' + match[1], sandbox);
    fs.writeFileSync(path.join(dataDir, 'year3.json'), JSON.stringify({
      title: 'AKTU B.Tech 3rd Year Notes',
      subjects: sandbox.data
    }, null, 2), 'utf-8');
    console.log(`✓ year3.json saved (${sandbox.data.length} subjects)`);
  }
} catch (e) {
  console.error('Error extracting 3year.html:', e);
}

// 4. Extract multiatom.html (2nd year multiatom)
try {
  const content = fs.readFileSync(path.join(rawDir, 'multiatom.html'), 'utf-8');
  const match = content.match(/const\s+subjectsData\s*=\s*(\[[\s\S]*?\]);/);
  if (match) {
    const sandbox = {};
    vm.runInNewContext('data = ' + match[1], sandbox);
    fs.writeFileSync(path.join(dataDir, 'multiatom_year2.json'), JSON.stringify({
      title: 'MultiAtoms 2nd Year Notes',
      subjects: sandbox.data
    }, null, 2), 'utf-8');
    console.log(`✓ multiatom_year2.json saved (${sandbox.data.length} subjects)`);
  }
} catch (e) {
  console.error('Error extracting multiatom.html:', e);
}

// 5. Extract 3year-multiatom.html
try {
  const content = fs.readFileSync(path.join(rawDir, '3year-multiatom.html'), 'utf-8');
  const match = content.match(/const\s+subjectsData\s*=\s*(\[[\s\S]*?\]);/);
  if (match) {
    const sandbox = {};
    vm.runInNewContext('data = ' + match[1], sandbox);
    fs.writeFileSync(path.join(dataDir, 'multiatom_year3.json'), JSON.stringify({
      title: 'MultiAtoms 3rd Year Notes',
      subjects: sandbox.data
    }, null, 2), 'utf-8');
    console.log(`✓ multiatom_year3.json saved (${sandbox.data.length} subjects)`);
  }
} catch (e) {
  console.error('Error extracting 3year-multiatom.html:', e);
}

// 6. Extract year4-data.js (fourthYearMultiAtoms, fourthYearOtherPlatforms)
try {
  const content = fs.readFileSync(path.join(rawDir, 'year4-data.js'), 'utf-8');
  const sandbox = { window: {} };
  vm.runInNewContext(content, sandbox);
  
  if (sandbox.window.fourthYearMultiAtoms) {
    fs.writeFileSync(path.join(dataDir, 'multiatom_year4.json'), JSON.stringify({
      title: 'MultiAtoms 4th Year Notes',
      subjects: sandbox.window.fourthYearMultiAtoms
    }, null, 2), 'utf-8');
    console.log(`✓ multiatom_year4.json saved (${sandbox.window.fourthYearMultiAtoms.length} subjects)`);
  }

  if (sandbox.window.fourthYearOtherPlatforms) {
    fs.writeFileSync(path.join(dataDir, 'year4_other.json'), JSON.stringify({
      title: 'AKTU B.Tech 4th Year Notes (All Platforms)',
      subjects: sandbox.window.fourthYearOtherPlatforms
    }, null, 2), 'utf-8');
    console.log(`✓ year4_other.json saved (${sandbox.window.fourthYearOtherPlatforms.length} subjects)`);
  }
} catch (e) {
  console.error('Error extracting year4-data.js:', e);
}

// 7. Video lectures (preserve expanded AH Tutorials & MultiAtoms database)
try {
  if (!fs.existsSync(path.join(dataDir, 'lectures.json'))) {
    const content = fs.readFileSync(path.join(rawDir, 'lectindex.html'), 'utf-8');
    const match = content.match(/videoData\s*=\s*(\{[\s\S]*?\});\s*(?:const|let|var|function|<\/script)/);
    if (match) {
      const data = JSON.parse(match[1]);
      fs.writeFileSync(path.join(dataDir, 'lectures.json'), JSON.stringify({
        title: 'Gateway Classes Video Lectures',
        courses: data
      }, null, 2), 'utf-8');
      console.log(`✓ lectures.json saved (${Object.keys(data).length} courses)`);
    }
  } else {
    console.log(`✓ Preserved rich multi-channel lectures.json database`);
  }
} catch (e) {
  console.error('Error handling lectindex.html:', e);
}

// 8. Extract under.html (RAW_PAPERS)
try {
  const content = fs.readFileSync(path.join(rawDir, 'under.html'), 'utf-8');
  const match = content.match(/const\s+RAW_PAPERS\s*=\s*(\[[\s\S]*?\]);/);
  if (match) {
    const sandbox = {};
    vm.runInNewContext('data = ' + match[1], sandbox);
    const papers = sandbox.data.map(p => ({
      id: p[0],
      code: p[1],
      title: p[2],
      semester: p[3],
      session: p[4],
      nonce: p[5]
    }));
    fs.writeFileSync(path.join(dataDir, 'pyq_bank.json'), JSON.stringify({
      title: 'AKTU B.Tech PYQ Bank',
      totalPapers: papers.length,
      papers: papers
    }, null, 2), 'utf-8');
    console.log(`✓ pyq_bank.json saved (${papers.length} question papers)`);
  }
} catch (e) {
  console.error('Error extracting under.html:', e);
}

// 9. Build Global Search Index
try {
  const searchIndex = [];

  // Helper to add search items
  function addSearch(title, category, subCategory, url, type = 'note', extra = {}) {
    searchIndex.push({
      title,
      category,
      subCategory,
      url,
      type,
      ...extra
    });
  }

  // Load year 1
  if (fs.existsSync(path.join(dataDir, 'year1.json'))) {
    const y1 = JSON.parse(fs.readFileSync(path.join(dataDir, 'year1.json'), 'utf-8'));
    for (const [subjKey, units] of Object.entries(y1.subjects)) {
      const meta = y1.subjectMeta[subjKey] || { title: subjKey, badge: '1st Year' };
      for (const [unitKey, lecs] of Object.entries(units)) {
        if (typeof lecs === 'string') {
          addSearch(`${meta.title} - ${unitKey}`, '1st Year', meta.badge, lecs, 'pdf');
        } else if (typeof lecs === 'object' && lecs !== null) {
          for (const [lecKey, url] of Object.entries(lecs)) {
            addSearch(`${meta.title} - ${unitKey} ${lecKey}`, '1st Year', meta.badge, url, 'pdf');
          }
        }
      }
    }
  }

  // Load year 2
  if (fs.existsSync(path.join(dataDir, 'year2.json'))) {
    const y2 = JSON.parse(fs.readFileSync(path.join(dataDir, 'year2.json'), 'utf-8'));
    for (const [subjKey, subjVal] of Object.entries(y2.subjects)) {
      const meta = y2.subjectMeta[subjKey] || { title: subjKey, badge: '2nd Year' };
      if (subjVal.units) {
        for (const [unitKey, unitVal] of Object.entries(subjVal.units)) {
          if (unitVal.lectures) {
            for (const [lecKey, url] of Object.entries(unitVal.lectures)) {
              addSearch(`${meta.title} - ${unitKey} ${lecKey.replace(/_/g, ' ')}`, '2nd Year', meta.badge, url, 'pdf');
            }
          }
        }
      }
    }
  }

  // Load year 3
  if (fs.existsSync(path.join(dataDir, 'year3.json'))) {
    const y3 = JSON.parse(fs.readFileSync(path.join(dataDir, 'year3.json'), 'utf-8'));
    for (const s of y3.subjects) {
      for (const n of s.notes || []) {
        addSearch(`${s.title} - ${n.title}`, '3rd Year', s.title, n.url, 'pdf');
      }
    }
  }

  // Load year 4
  if (fs.existsSync(path.join(dataDir, 'year4_other.json'))) {
    const y4 = JSON.parse(fs.readFileSync(path.join(dataDir, 'year4_other.json'), 'utf-8'));
    for (const s of y4.subjects) {
      for (const n of s.notes || []) {
        const driveUrl = n.id ? `https://drive.google.com/file/d/${n.id}/view` : n.url;
        addSearch(`${s.subject} - ${n.title}`, '4th Year', s.subject, driveUrl, 'pdf');
      }
    }
  }

  // Load MultiAtoms 2, 3, 4
  ['multiatom_year2.json', 'multiatom_year3.json', 'multiatom_year4.json'].forEach((file, idx) => {
    if (fs.existsSync(path.join(dataDir, file))) {
      const ma = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
      const yearName = `MultiAtoms ${idx + 2}nd/th Year`;
      for (const s of ma.subjects) {
        const subjName = s.cleanTitle || s.title || s.subject;
        for (const n of s.notes || []) {
          const url = n.url || (n.id ? `https://drive.google.com/file/d/${n.id}/view` : '');
          addSearch(`${subjName} - ${n.title}`, yearName, subjName, url, 'pdf');
        }
      }
    }
  });

  // Load PYQs
  if (fs.existsSync(path.join(dataDir, 'pyq_bank.json'))) {
    const pyq = JSON.parse(fs.readFileSync(path.join(dataDir, 'pyq_bank.json'), 'utf-8'));
    for (const p of pyq.papers) {
      addSearch(`${p.code} ${p.title} (${p.session})`, 'PYQ Bank', `Semester ${p.semester}`, `/viewer.html?id=${p.id}&nonce=${p.nonce}&code=${encodeURIComponent(p.code)}&title=${encodeURIComponent(p.title)}&sem=${p.semester}&session=${p.session}`, 'pyq', {
        id: p.id,
        code: p.code,
        semester: p.semester,
        session: p.session,
        nonce: p.nonce
      });
    }
  }

  // Load lectures
  if (fs.existsSync(path.join(dataDir, 'lectures.json'))) {
    const lec = JSON.parse(fs.readFileSync(path.join(dataDir, 'lectures.json'), 'utf-8'));
    if (Array.isArray(lec.courses)) {
      for (const course of lec.courses) {
        addSearch(`${course.title} Full Playlist (${course.channelName})`, 'Video Lectures', course.channelBadge, course.playlistUrl, 'video');
        for (const u of course.units || []) {
          addSearch(`${course.title} - ${u.title} (${course.channelName})`, 'Video Lectures', course.channelBadge, u.url, 'video');
        }
      }
    } else if (lec.courses) {
      for (const [courseName, courseVal] of Object.entries(lec.courses)) {
        const meta = courseVal.meta || { title: courseName, badge: 'Course' };
        if (courseVal.units) {
          for (const [unitName, unitVideos] of Object.entries(courseVal.units)) {
            for (const [vidTitle, vidUrl] of Object.entries(unitVideos)) {
              addSearch(`${meta.title} - ${unitName}: ${vidTitle}`, 'Video Lectures', meta.badge, vidUrl, 'video');
            }
          }
        }
      }
    }
  }

  fs.writeFileSync(path.join(dataDir, 'search_index.json'), JSON.stringify(searchIndex, null, 2), 'utf-8');
  console.log(`✓ search_index.json created with ${searchIndex.length} indexed searchable items!`);

  // Portals summary metadata
  const portalsSummary = [
    { id: '1year', title: '1st Year Gateway Classes', path: '/1year.html', count: '13 Subjects • 182 Notes', badge: '1st Year • All Branches', icon: '📚', color: '#ffffff' },
    { id: '2ndyear', title: '2nd Year Gateway Classes', path: '/2ndyear.html', count: '15 Subjects • 881 Notes', badge: '2nd Year • CSE / IT', icon: '📝', color: '#ffffff' },
    { id: '3year', title: '3rd Year Gateway Classes', path: '/3year.html', count: '34 Subjects • 323 Notes', badge: '3rd Year • All Electives', icon: '🎓', color: '#ffffff' },
    { id: '4year', title: '4th Year All Platforms', path: '/4year.html', count: '20 Subjects • 127 Notes', badge: '4th Year • All Platforms', icon: '🚀', color: '#ffffff' },
    { id: 'multiatom', title: 'Multi Atoms 2nd Year', path: '/multiatom.html', count: '11 Subjects • Fast PDF', badge: 'Multi Atoms • 2nd Year', icon: '🧪', color: '#ffffff' },
    { id: '3year-multiatom', title: 'Multi Atoms 3rd Year', path: '/3year-multiatom.html', count: '14 Subjects • 63 Notes', badge: 'Multi Atoms • 3rd Year', icon: '⚛️', color: '#ffffff' },
    { id: '4year-multiatom', title: 'Multi Atoms 4th Year', path: '/4year-multiatom.html', count: '11 Subjects • 25 Notes', badge: 'Multi Atoms • 4th Year', icon: '⚛️', color: '#ffffff' },
    { id: 'lectindex', title: 'Video Lectures Hub', path: '/lectindex.html', count: '28 Courses • One-Shots & Playlists', badge: 'AH Tutorials • MultiAtoms', icon: '🎬', color: '#ffffff' },
    { id: 'under', title: 'AKTU B.Tech PYQ Bank', path: '/under.html', count: '1,961 Papers • Sem 1-8', badge: 'Sem 1 to 8 • All Branches', icon: '🎯', color: '#ffffff' }
  ];

  fs.writeFileSync(path.join(dataDir, 'portals.json'), JSON.stringify({
    portals: portalsSummary,
    stats: {
      totalSearchItems: searchIndex.length,
      totalPYQs: 1961,
      totalCategories: 9
    }
  }, null, 2), 'utf-8');
  console.log(`✓ portals.json created with summary & stats!`);

} catch (e) {
  console.error('Error creating search index:', e);
}

console.log('All data extraction completed successfully!');

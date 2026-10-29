const fs = require('fs');
const vm = require('vm');

function evalLinksInFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const startIdx = content.indexOf('const links =');
  const endIdx = content.indexOf('const subjectMeta =', startIdx);
  if (startIdx === -1 || endIdx === -1) {
    console.log(filepath, 'could not find start/end of links');
    return null;
  }
  const code = content.substring(startIdx, endIdx);
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.links;
}

const origLinks = evalLinksInFile('original_data/1year.html');
const pubLinks = evalLinksInFile('public/1year.html');

console.log('Original 1year subjects:', origLinks ? Object.keys(origLinks) : 'error');
console.log('Public 1year subjects:', pubLinks ? Object.keys(pubLinks) : 'error');

const orig2Links = evalLinksInFile('original_data/2ndyear.html');
const pub2Links = evalLinksInFile('public/2ndyear.html');
console.log('Original 2ndyear subjects count:', orig2Links ? Object.keys(orig2Links).length : 'error');
console.log('Public 2ndyear subjects count:', pub2Links ? Object.keys(pub2Links).length : 'error');

const orig3Links = evalLinksInFile('original_data/3year.html');
const pub3Links = evalLinksInFile('public/3year.html');
console.log('Original 3year subjects count:', orig3Links ? Object.keys(orig3Links).length : 'error');
console.log('Public 3year subjects count:', pub3Links ? Object.keys(pub3Links).length : 'error');

const fs = require('fs');

let c = fs.readFileSync('public/index.html', 'utf8');

c = c.replace(/@CYBER_RAJ1/gi, '@Shiva._SWE');
c = c.replace(/title="Contact @ShivanshSWE-cmd on Telegram"/gi, 'title="Follow @Shiva._SWE on Instagram"');
c = c.replace(/href="https:\/\/github\.com\/ShivanshSWE-cmd" target="_blank" rel="noopener" class="credit-link"/gi, 'href="https://instagram.com/Shiva._SWE" target="_blank" rel="noopener" class="credit-link"');
c = c.replace(/<i class="fab fa-telegram" aria-hidden="true"><\/i>/gi, '<i class="fab fa-github" aria-hidden="true"></i>');
c = c.replace(/title="Telegram Support &amp; Community"/gi, 'title="GitHub: @ShivanshSWE-cmd"');

fs.writeFileSync('public/index.html', c, 'utf8');
console.log('✓ Successfully updated public/index.html footer branding!');

// Verify
const check = fs.readFileSync('public/index.html', 'utf8');
console.log('Contains @CYBER_RAJ1:', check.includes('CYBER_RAJ1'));
console.log('Contains @Shiva._SWE:', check.includes('@Shiva._SWE'));

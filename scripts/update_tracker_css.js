const fs = require('fs');

const files = [
  'd:/Github projects/aktu-notes-store/public/css/student-tracker.css',
  'd:/Github projects/aktu-notes-store/public/css/unit-tracker.css'
];

const target = `.note-item-wrapper,
.video-item-wrapper {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  width: 100% !important;
  position: relative;
}`;

const replacement = `.note-item-wrapper,
.video-item-wrapper {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  position: relative;
}

@media (max-width: 640px) {
  .note-item-wrapper {
    flex-wrap: wrap !important;
    gap: 6px !important;
  }
  .note-item-wrapper .note-card-link {
    width: 100% !important;
    flex: 1 1 100% !important;
  }
  .unit-check-btn {
    align-self: flex-end;
    margin-left: auto;
  }
}`;

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // Normalize newlines for replacement
    content = content.replace(/\r\n/g, '\n');
    if (content.includes(target.replace(/\r\n/g, '\n'))) {
      content = content.replace(target.replace(/\r\n/g, '\n'), replacement);
      fs.writeFileSync(f, content.replace(/\n/g, '\r\n'), 'utf8');
      console.log('Updated ' + f);
    } else {
      console.log('Target not found in ' + f);
    }
  }
});

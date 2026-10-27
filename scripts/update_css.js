const fs = require('fs');

let s = fs.readFileSync('d:/Github projects/aktu-notes-store/public/gwc-ui.css', 'utf8');

const replacement = `.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
a.note-card-link,
.note-card-link,
.note-link,
a.note-link {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 12px 14px !important;
  border-radius: 10px !important;
  background: #111c34 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #f8fafc !important;
  text-decoration: none !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  transition: all .2s ease !important;
  position: relative !important;
  box-sizing: border-box !important;
  min-width: 0 !important;
}
a.note-card-link:hover,
.note-card-link:hover,
.note-link:hover {
  background: #152445 !important;
  border-color: rgba(245, 158, 11, 0.6) !important;
  color: #ffffff !important;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45) !important;
  transform: translateY(-1px) !important;
}
.note-card-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}
.note-type-icon,
.note-icon {
  font-size: 16px;
  color: #fbbf24;
  flex-shrink: 0;
}
.note-text-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.note-name,
.note-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #ffffff !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.note-sub {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 1px;
}
.note-open-badge,
.note-action {
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  font-size: 11.5px !important;
  font-weight: 700 !important;
  color: #fbbf24 !important;
  white-space: nowrap !important;
  margin-left: 8px !important;
  background: rgba(245, 158, 11, 0.15) !important;
  border: 1px solid rgba(245, 158, 11, 0.4) !important;
  padding: 5px 12px !important;
  border-radius: 6px !important;
  transition: all .2s ease !important;
  flex-shrink: 0 !important;
}
.note-card-link:hover .note-open-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: #070b14 !important;
  border-color: #f59e0b !important;
}

/* Mobile Viewport Defenses */
@media (max-width: 680px) {
  body { overflow-x: hidden !important; }
  .main-wrap { padding: 10px 12px 40px !important; overflow-x: hidden !important; box-sizing: border-box !important; }
  .subject-card { border-radius: 10px !important; overflow: hidden !important; }
  .subject-card-header { padding: 12px 14px !important; }
  .subject-title-area h2 { font-size: 14px !important; line-height: 1.35 !important; }
  .notes-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
  .note-name { font-size: 12.5px !important; }
  .note-open-badge { padding: 4px 8px !important; font-size: 11px !important; }
  .chips-container { padding-bottom: 6px !important; scrollbar-width: none; }
}`;

const idx1 = s.indexOf('.notes-grid {');
const idx2 = s.indexOf('/* ── Support & Creator Footer');
if (idx1 !== -1 && idx2 !== -1) {
  s = s.slice(0, idx1) + replacement + '\n\n' + s.slice(idx2);
  fs.writeFileSync('d:/Github projects/aktu-notes-store/public/gwc-ui.css', s, 'utf8');
  fs.writeFileSync('d:/Github projects/aktu-notes-store/public/css/gwc-ui.css', s, 'utf8');
  console.log('Successfully updated public/gwc-ui.css and public/css/gwc-ui.css');
} else {
  console.log('Target section not found', idx1, idx2);
}

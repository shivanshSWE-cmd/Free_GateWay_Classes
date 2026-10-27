(function () {
  const config = window.notesConfig;
  const rawSubjects = window[config.dataKey] || [];
  const subjectMap = new Map();
  const seenIds = new Set();
  const seenTitles = new Set();

  rawSubjects.forEach((entry) => {
    const subjectName = entry.subject.trim();
    if (!subjectMap.has(subjectName)) subjectMap.set(subjectName, []);

    entry.notes.forEach((note) => {
      const normalizedTitle = note.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (seenIds.has(note.id) || seenTitles.has(normalizedTitle)) return;
      seenIds.add(note.id);
      seenTitles.add(normalizedTitle);
      subjectMap.get(subjectName).push(note);
    });
  });

  const subjects = Array.from(subjectMap, ([subject, notes]) => ({ subject, notes }))
    .filter((entry) => entry.notes.length > 0);
  const subjectsRoot = document.getElementById("subjects");
  const search = document.getElementById("search");
  const summary = document.getElementById("summary");
  const expandAll = document.getElementById("expandAll");
  let expanded = false;

  function driveUrl(id) {
    return "https://drive.google.com/file/d/" + encodeURIComponent(id) + "/view";
  }

  function render(query) {
    const term = query.trim().toLowerCase();
    subjectsRoot.replaceChildren();
    let visibleSubjects = 0;
    let visibleNotes = 0;

    subjects.forEach((entry) => {
      const subjectMatch = entry.subject.toLowerCase().includes(term);
      const notes = term && !subjectMatch
        ? entry.notes.filter((note) => note.title.toLowerCase().includes(term))
        : entry.notes;
      if (!notes.length) return;

      visibleSubjects += 1;
      visibleNotes += notes.length;
      const details = document.createElement("details");
      details.className = "subject";
      details.open = expanded || Boolean(term);

      const heading = document.createElement("summary");
      const name = document.createElement("span");
      name.textContent = entry.subject;
      const count = document.createElement("span");
      count.className = "count";
      count.textContent = notes.length + (notes.length === 1 ? " file" : " files");
      heading.append(name, count);

      const notesGrid = document.createElement("div");
      notesGrid.className = "notes";
      notes.forEach((note) => {
        const link = document.createElement("a");
        link.className = "note";
        link.href = driveUrl(note.id);
        link.target = "_blank";
        link.rel = "noopener";
        const title = document.createElement("span");
        title.className = "note-title";
        title.textContent = note.title;
        const action = document.createElement("span");
        action.className = "download";
        action.textContent = "⬇ Download PDF";
        link.append(title, action);
        notesGrid.appendChild(link);
      });

      details.append(heading, notesGrid);
      subjectsRoot.appendChild(details);

      // In-feed ad unit between subject blocks, gated by the ad engine.
      if (typeof window.__gwcMaybeAd === "function") {
        window.__gwcMaybeAd("subjects", visibleSubjects);
      }
    });

    if (!visibleSubjects) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No matching notes found.";
      subjectsRoot.appendChild(empty);
    }
    summary.textContent = visibleSubjects + " subjects, " + visibleNotes + " unique notes";
  }

  search.addEventListener("input", () => render(search.value));
  expandAll.addEventListener("click", () => {
    expanded = !expanded;
    document.querySelectorAll(".subject").forEach((item) => { item.open = expanded; });
    expandAll.textContent = expanded ? "Collapse all" : "Expand all";
  });

  document.querySelectorAll(".ad-slot").forEach((slot) => {
    const check = () => {
      const hasContent = slot.querySelector(
        'iframe, ins, img, a, [id*="container"], [id*="banner"], [id*="asg"]'
      );
      slot.style.display = hasContent ? "block" : "none";
    };
    check();
    new MutationObserver(check).observe(slot, { childList: true, subtree: true });
  });

  render("");
})();

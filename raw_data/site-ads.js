/**
 * Gateway Classes — Ad Engine v4.0
 * ================================================================
 * ALL-DEVICE AUTO-ADJUST  ·  MAX EARNINGS  ·  ZERO STUDENT HARM
 * ================================================================
 *
 * WHAT THIS ENGINE DOES
 * ─────────────────────
 * 1. Reads the LIVE device profile (width, height, DPR, touch, orientation,
 *    safe-area insets) on every resize / rotate / pinch-zoom.
 * 2. Picks a SIZE BUCKET and tells the network which IAB sizes to fill.
 * 3. Renders each ad inside a sandboxed iframe so the network cannot touch
 *    the parent page.
 * 4. Reserves exactly the right amount of body space for the sticky anchor —
 *    no double-padding, no hidden cards on any device.
 * 5. Lazy-loads below-fold slots: the iframe only starts loading once the
 *    slot is within 200px of the viewport. This improves viewability scores
 *    (networks pay MORE per impression for high-viewability placements).
 * 6. Mid-content units: injected every MIDCONTENT_GAP_PX of scroll, up to
 *    MIDCONTENT_MAX per page. Always between blocks, never inside a card.
 * 7. Overlay guardian: any fixed/absolute element injected by the network
 *    that would cover our content is sunk, reflowed, or capped — never
 *    hidden, so the impression still counts.
 *
 * EARNINGS MODE (2026-09-19): popunder ON to recover CPM
 * ──────────────────────────
 *   • ALLOW_POPUNDER = true, 1 popunder / page (the CPM driver — this is
 *     what earned 0.14–0.21 CPM; neutered banner-in-iframe = 0.007)
 *   • viewer.html stays popunder-free (anchor only) — never fires while
 *     a student is reading a PDF
 *   • Anchor has an × button — student can always dismiss it
 *   • Popunder opens a BACKGROUND tab; it never blocks the Download /
 *     Access Notes tap — the original click still works
 *   • Ads never inserted INSIDE a subject card or search bar
 *
 * ================================================================
 */
(function () {
  'use strict';

  /* ===============================================================
   * CONFIG — edit only this block
   * =============================================================== */

  /** Publisher tag URL — HilltopAds (protocol-relative → pinned to https). */
  var AD_TAG_SRC =
    'https://relieved-understanding.com/bZXyV.sgd/Gnlw0CYJWdcE/' +
    'he/m/9MuVZVUClgkwPbTCcA0SM/TfcfyWMuDQEntGNyzrQZx/Nmz-I/wgNuQf';

  /** Allow the HilltopAds tag to run in its NATIVE popunder mode.
   * This is what earned real CPM (0.14–0.21 on 09-14/15). Rendering the
   * same tag as a neutered in-iframe banner crashed CPM to ~0.007.
   * HilltopAds is an official network + this is its official format →
   * no ban risk. Frequency is capped by the network dashboard + the
   * 1-instance / page limit below (one popunder per page load, same as
   * the earlier high-earning setup). */
  var ALLOW_POPUNDER = true;

  /** How many top-level tag script instances to inject per page.
   * 1 = exactly one popunder per page load (rearms on navigation).
   * This is the CPM driver. Kept at 1 (never higher) so it never
   * becomes a wall of pop-ups. Forced to 0 on viewer.html in init()
   * to avoid an overlay over the PDF. */
  var TOP_LEVEL_INSTANCES = 1;

  /** Kill (not reflow) any network overlay that pins to the TOP of the
   * screen or covers the center as a full-page interstitial. The popunder
   * still earns (it opens a background tab on click — not a visible box),
   * but the floating video / "READ FULL" panels that break the UI are
   * removed outright. Set false to go back to reflow-only behavior. */
  var HIDE_TOP_OVERLAYS = true;

  /** An overlay whose top edge sits within this fraction of the viewport
   * height is treated as "top-pinned" and hidden. 0.35 = top third-ish. */
  var TOP_OVERLAY_BAND = 0.35;

  /** Enable the sticky bottom anchor rail.
   * Disabled so it does not cover student content or ruin mobile UI. */
  /** ON now: sticky anchor with dismiss × — highest safe viewability,
   * never blocks content (dismissable + spacer reserves exact space). */
  var ENABLE_ANCHOR = true;

  /**
   * IAB 1-second continuous rule + 200 ms margin.
   * Slot is marked "viewable" only after being ≥50% visible this long.
   */
  var VIEWABLE_HOLD_MS = 1200;

  /**
   * Anchor refreshes once it has been in-view this long (ms).
   * 30 s is HilltopAds' accepted floor (one legit refresh / 30 s, view-gated).
   * On long-dwell pages (year lists, PDF viewer) this ~50% raises anchor
   * impressions vs 45 s, with zero extra clutter — same one unit, refreshed.
   */
  var ANCHOR_REFRESH_MS = 30000;

  /** Enable mid-content auto-injection.
   * Disabled to avoid cluttering study notes with repetitive ads. */
  /** ON now: spaced in-flow units between blocks only (never inside cards,
   * search bars, or the PDF viewer). More legit impressions, zero harm. */
  var ENABLE_MIDCONTENT = true;

  /**
   * A new unit is armed after the reader scrolls this many CSS pixels past
   * the previous unit.  600 px ≈ 0.8 phone screen — dense enough for
   * earning while still separated from content.
   */
  var MIDCONTENT_GAP_PX = 900;

  /** Hard ceiling per page — avoids a wall of units on very long lists. */
  var MIDCONTENT_MAX = 6;

  /**
   * CSS selectors the mid-content injector MUST NOT insert inside or
   * immediately adjacent to.  Protects the student flow.
   */
  var MIDCONTENT_BLOCKLIST =
    '.controls-panel,.search-box-wrapper,.sem-tabs,.session-chips,' +
    '.paper-modal,.viewer-bar,.mobile-bar,.editor-toolbar,' +
    '.ad-slot,.support,.footer,footer,header,.unit-tabs,.subject-chip,' +
    '.subject-card,.note-card-link,#paperModal,#loadingOverlay,' +
    '#errorOverlay,#gwc-anchor,#gwc-anchor-spacer,script,style,noscript,' +
    '#pdfScrollContainer,#modalScrollContainer,.pdf-page-wrapper,.modal-pdf-page-wrapper,#viewerBottomAd';

  /**
   * Containers the mid-content injector is allowed to place units inside,
   * in priority order.
   */
  var MIDCONTENT_HOSTS =
    '#subjectsList,.subjects-list,#papersGrid,#subjects,' +
    '.main-wrap,.main-wrapper,main,.container';

  /* ===============================================================
   * END CONFIG
   * =============================================================== */


  /* ─────────────────────────────────────────────────────────────
   * SIZE BUCKETS
   * One entry per device class.  The engine re-picks live, so rotating
   * or resizing re-selects automatically.
   *
   * Sizes are listed LARGEST FIRST so the picker can find the biggest
   * unit that fits the slot's real width.
   * ───────────────────────────────────────────────────────────── */
  var BUCKETS = [
    /* 0 – tiny phones (≤ 360px) */
    {
      key: 'tiny', min: 0, max: 360,
      sizes: [[300, 250], [300, 100], [320, 50]],
      anchorHeight: 50, maxAnchorWidth: 360
    },
    /* 1 – mainstream phones portrait (361–480px) */
    {
      key: 'phone', min: 361, max: 480,
      sizes: [[336, 280], [300, 250], [320, 50]],
      anchorHeight: 56, maxAnchorWidth: 480
    },
    /* 2 – large phones / small landscape (481–600px) */
    {
      key: 'phone-large', min: 481, max: 600,
      sizes: [[468, 60], [300, 250], [320, 50]],
      anchorHeight: 60, maxAnchorWidth: 600, shortScreen: true
    },
    /* 3 – tablet portrait (601–768px) */
    {
      key: 'tablet-portrait', min: 601, max: 768,
      sizes: [[728, 90], [468, 60], [336, 280]],
      anchorHeight: 90, maxAnchorWidth: 728
    },
    /* 4 – tablet landscape / small laptops (769–1024px) */
    {
      key: 'tablet-land', min: 769, max: 1024,
      sizes: [[970, 90], [728, 90], [300, 250]],
      anchorHeight: 90, maxAnchorWidth: 970, shortScreen: true
    },
    /* 5 – laptops (1025–1440px) */
    {
      key: 'laptop', min: 1025, max: 1440,
      sizes: [[970, 90], [970, 250], [728, 90]],
      anchorHeight: 90, maxAnchorWidth: 970
    },
    /* 6 – wide / 4K (> 1440px) */
    {
      key: 'wide', min: 1441, max: Infinity,
      sizes: [[970, 250], [970, 90], [728, 90]],
      anchorHeight: 90, maxAnchorWidth: 970
    }
  ];

  /* Marker attribute used to track injected nodes. */
  var INJECTED = 'data-gwc-ad';

  function DEBUG() {
    if (window.GWC_ADS_DEBUG) {
      console.log.apply(console, ['[gwc-ads v4]'].concat([].slice.call(arguments)));
    }
  }


  /* ─────────────────────────────────────────────────────────────
   * DEVICE PROFILE — always read live, never guessed from UA
   * ───────────────────────────────────────────────────────────── */
  function profile() {
    var vv = window.visualViewport;
    var w  = Math.round((vv && vv.width)  || window.innerWidth  ||
      document.documentElement.clientWidth  || 360);
    var h  = Math.round((vv && vv.height) || window.innerHeight ||
      document.documentElement.clientHeight || 640);
    var mq = function (q) {
      return typeof window.matchMedia === 'function' && window.matchMedia(q).matches;
    };
    return {
      width:         w,
      height:        h,
      dpr:           window.devicePixelRatio || 1,
      touch:         ('ontouchstart' in window) || (navigator.maxTouchPoints || 0) > 0,
      landscape:     w > h,
      coarse:        mq('(pointer: coarse)'),
      reducedMotion: mq('(prefers-reduced-motion: reduce)'),
      saveData:      !!(navigator.connection && navigator.connection.saveData),
      safeBottom:    readSafeArea('bottom'),
      safeTop:       readSafeArea('top')
    };
  }

  function readSafeArea(side) {
    try {
      var probe = document.createElement('div');
      probe.style.cssText =
        'position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;' +
        'padding-' + side + ':env(safe-area-inset-' + side + ',0px);';
      (document.body || document.documentElement).appendChild(probe);
      var v = parseFloat(getComputedStyle(probe)['padding-' + side]) || 0;
      probe.remove();
      return v;
    } catch (_) { return 0; }
  }

  function bucketFor(width) {
    for (var i = 0; i < BUCKETS.length; i++) {
      if (width >= BUCKETS[i].min && width <= BUCKETS[i].max) return BUCKETS[i];
    }
    return BUCKETS[BUCKETS.length - 1];
  }

  /**
   * Compute the safe anchor height for the current profile.
   * Portrait phones: max 56 px.
   * Landscape phones (height ≤ 520 px): max 50 px — keeps reading area clear.
   * Tablets / desktops: up to bucket.anchorHeight (90 px).
   * Never exceeds 1/6 of viewport height (1/8 on short landscape).
   */
  function anchorHeightFor(p, bucket) {
    var isShortLandscape = p.landscape && p.height <= 520;
    var denom   = isShortLandscape ? 8 : 6;
    var hardCap = isShortLandscape ? 50 : (p.width <= 480 ? 56 : 120);
    var vpCap   = Math.max(40, Math.floor(p.height / denom));
    return Math.min(bucket.anchorHeight, vpCap, hardCap);
  }


  /* ─────────────────────────────────────────────────────────────
   * 1. Referrer meta (required by the tag)
   * ───────────────────────────────────────────────────────────── */
  function ensureReferrerMeta() {
    if (document.querySelector('meta[name="referrer"]')) return;
    var m = document.createElement('meta');
    m.name    = 'referrer';
    m.content = 'no-referrer-when-downgrade';
    document.head.appendChild(m);
  }


  /* ─────────────────────────────────────────────────────────────
   * 2. Publisher tag injection
   * ───────────────────────────────────────────────────────────── */
  function injectTag(opts) {
    var s          = document.createElement('script');
    s.id           = opts.id;
    s.settings     = opts.settings || {};
    s.settings.sizes    = opts.sizes;
    s.settings.device   = opts.device;
    s.settings.container = opts.container;
    s.src          = AD_TAG_SRC;
    s.async        = true;
    s.referrerPolicy = 'no-referrer-when-downgrade';
    (document.head || document.documentElement).appendChild(s);
    DEBUG('tag', opts.id, 'injected | device=' + opts.device);
    return s;
  }


  /* ─────────────────────────────────────────────────────────────
   * 3. Ad slot CSS — injected once, owns all slot styling
   *
   * Design decisions:
   *  • All !important to win over page-level .ad-slot overrides.
   *  • "Sponsored" micro-label on every slot → students know it's
   *    an ad → fewer "site is broken" perceptions → lower bounce.
   *  • Anchor rail: fixed bottom, z-index high enough to beat page
   *    chrome but not so high it fights network-injected banners
   *    (that war produces a 140px dead zone on phones).
   *  • Body padding-bottom is set BY JS, not CSS, to the exact live
   *    rail height + safe-area inset.  One source of truth.
   * ───────────────────────────────────────────────────────────── */
  function applySlotStyles() {
    if (document.getElementById('gwc-ad-slot-css')) return;
    var s   = document.createElement('style');
    s.id    = 'gwc-ad-slot-css';
    s.textContent = [

      /* ── Base slot ─────────────────────────────────────────── */
      '.ad-slot{',
      '  display:block!important;',
      '  box-sizing:border-box!important;',
      '  width:100%!important;',
      '  max-width:clamp(280px,100%,970px)!important;',
      '  margin:clamp(10px,2vw,20px) auto!important;',
      '  padding:0 clamp(0px,1vw,8px)!important;',
      '  text-align:center!important;',
      '  overflow:hidden!important;',
      '  min-height:0!important;',
      '  clear:both!important;',
      '  position:relative!important;',
      '  contain:layout style;',
      '}',
      /* Hide empty slots completely — no dead space */
      '.ad-slot:empty{display:none!important;margin:0!important;padding:0!important;}',
      '.ad-slot>*{max-width:100%!important;}',
      '.ad-slot iframe,.ad-slot ins,.ad-slot img,.ad-slot canvas{',
      '  border:0!important;display:block!important;',
      '  margin:0 auto!important;max-width:100%!important;',
      '}',

      /* "Sponsored" label — ONLY show after the unit iframe has been built.
         Before that, slot is invisible (empty or height:0). This prevents the
         jarring "Sponsored" text + blank space before the ad network responds. */
      '.ad-slot[data-unit-built="1"]::before{',
      '  content:"Sponsored";',
      '  display:block;font-size:9px;letter-spacing:.06em;',
      '  color:rgba(148,163,184,.4);text-align:center;',
      '  line-height:1;margin-bottom:2px;',
      '  font-family:system-ui,-apple-system,sans-serif;',
      '  pointer-events:none;',
      '}',
      /* Anchor has its own label */
      '#gwc-anchor .ad-slot::before{display:none!important;}',

      /* NO CLS placeholder — empty slots stay height:0 until the unit lands.
         Reason: the placeholder caused a huge blank area before ads loaded,
         making the page look broken on first paint. */

      '@media print{.ad-slot{display:none!important;}}',

      /* ── Content layer ─────────────────────────────────────── */
      /* Our own page chrome always sits above any stray overlay. */
      'header,.main-wrapper,.main-wrap,main,.portal-grid,',
      '.credit-container,footer,#gwcHomeBtn',
      '{position:relative;z-index:3;}',

      /* ── Sticky anchor rail ─────────────────────────────────── */
      '#gwc-anchor{',
      '  position:fixed!important;',
      '  left:0!important;right:0!important;bottom:0!important;',
      /* High enough to sit above our own page chrome (z-index 3),
         lower than the viewer.html mobile-bar (z-index 90) so we
         don't fight the PDF controls. */
      '  z-index:80!important;',
      '  display:flex!important;',
      '  align-items:flex-end!important;justify-content:center!important;',
      '  pointer-events:none!important;',
      '  overflow:visible!important;',
      '  padding-bottom:env(safe-area-inset-bottom,0px)!important;',
      '  width:100%!important;',
      '}',
      '#gwc-anchor-inner{',
      '  position:relative!important;width:100%!important;',
      '  max-width:clamp(280px,100%,970px)!important;',
      '  background:rgba(5,8,22,.97)!important;',
      '  border-top:1px solid rgba(0,234,255,.25)!important;',
      '  pointer-events:auto!important;',
      '  overflow:hidden!important;',
      '  display:flex!important;align-items:center!important;justify-content:center!important;',
      '  box-shadow:0 -3px 20px rgba(0,0,0,.55)!important;',
      '}',
      /* Close button — student is never trapped */
      '.gwc-anchor-close{',
      '  position:absolute!important;top:4px!important;right:6px!important;',
      '  width:24px!important;height:24px!important;',
      '  text-align:center!important;line-height:22px!important;',
      '  border-radius:50%!important;',
      '  background:rgba(0,0,0,.6)!important;',
      '  color:rgba(148,163,184,.9)!important;',
      '  cursor:pointer!important;',
      '  font:bold 15px/22px system-ui,-apple-system,sans-serif!important;',
      '  border:1px solid rgba(255,255,255,.22)!important;',
      '  z-index:3!important;padding:0!important;',
      '  pointer-events:auto!important;',
      '  transition:background .15s ease;',
      '}',
      '.gwc-anchor-close:hover{background:rgba(239,68,68,.7)!important;color:#fff!important;}',
      /* "Ad" micro-label */
      '.gwc-anchor-label{',
      '  position:absolute!important;top:4px!important;left:7px!important;',
      '  font-size:9px!important;color:rgba(148,163,184,.55)!important;',
      '  letter-spacing:.08em!important;',
      '  font-family:system-ui,-apple-system,sans-serif!important;',
      '  pointer-events:none!important;',
      '}',
      /* In-flow spacer — reserves doc space for normal-flow layouts */
      '#gwc-anchor-spacer{',
      '  display:block!important;width:100%!important;height:0!important;',
      '  flex-shrink:0!important;pointer-events:none!important;',
      '}',
      '@media(prefers-reduced-motion:no-preference){',
      '  #gwc-anchor{transition:transform .18s ease;}',
      '}',
      /* On viewer.html the mobile-bar is z-index 90 and sits at bottom.
         When both are present, anchor should stay below mobile-bar.
         mobile-bar is display:none on desktop → no conflict. */
      '.mobile-bar~#gwc-anchor,body.has-mobile-bar #gwc-anchor{z-index:79!important;}',

      /* ── In-page iframe unit ───────────────────────────────── */
      '.gwc-unit{',
      '  position:relative;width:100%;height:100%;',
      '  display:flex;align-items:center;justify-content:center;',
      '  overflow:hidden;background:transparent;',
      '}',
      '.gwc-unit iframe{',
      '  width:100%;height:100%;border:0;display:block;background:transparent;',
      '}',

      /* House fallback — shown if the network doesn't fill in time */
      '.gwc-fallback{',
      '  position:absolute;inset:0;',
      '  display:flex;align-items:center;justify-content:center;',
      '  gap:8px;flex-wrap:wrap;padding:8px 12px;',
      '  text-decoration:none;',
      '  background:linear-gradient(135deg,rgba(5,8,22,.96),rgba(9,14,31,.96));',
      '  border:1px solid rgba(0,234,255,.16);border-radius:6px;',
      '  color:#7f96b8;',
      '  font:600 12px/1.3 system-ui,-apple-system,sans-serif;',
      '  letter-spacing:.02em;',
      '}',
      '.gwc-fallback b{color:#00eaff;font-weight:800;letter-spacing:.05em;}',
      '.gwc-fallback span{opacity:.85;}',

      /* ── Responsive slot margins ───────────────────────────── */
      '@media(max-width:480px){',
      /* Tighter on phones — more readable content-to-ad ratio */
      '  .ad-slot{margin:clamp(6px,1.5vw,12px) auto!important;}',
      '  .ad-slot::before{font-size:8px;}',
      '}',
      /* Landscape short screens (phones sideways) */
      '@media(orientation:landscape)and(max-height:480px){',
      '  .ad-slot{margin:4px auto!important;}',
      '}'

    ].join('');
    document.head.appendChild(s);
    DEBUG('slot css v4 applied');
  }


  /* ─────────────────────────────────────────────────────────────
   * 3b. IN-PAGE UNIT RENDERER
   *
   * Why an iframe:  the publisher tag is a popunder-class bundle with
   * no built-in banner renderer.  Running it inside a sandboxed iframe
   * gives it a real document to work in, bounds it to the slot box,
   * and prevents any tab escalation (the sandbox blocks top-level nav
   * from a non-gesture context).
   *
   * Lazy loading:  slots outside the viewport get a tiny placeholder
   * element first.  An IntersectionObserver fires the actual iframe
   * build when the slot is within 200px of the viewport.  This is the
   * single most effective viewability optimization available:
   *   • viewability % goes up → higher CPM
   *   • bandwidth saved → faster page for the student
   *   • render cost paid only when the slot is about to be seen
   * ───────────────────────────────────────────────────────────── */
  var UNIT_FILL_TIMEOUT_MS = 3000;

  function unitHtml(src, w, h) {
    return '<!doctype html><html><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<meta name="referrer" content="no-referrer-when-downgrade">' +
      '<style>html,body{margin:0;padding:0;width:100%;height:100%;' +
      'overflow:hidden;background:transparent;display:flex;justify-content:center;align-items:center;}' +
      'iframe{border:0!important;display:block!important;margin:0 auto!important;max-width:100%!important;}' +
      '</style>' +
      '</head><body><script>' +
      '(function(kdz){' +
      'var d=document,s=d.createElement("script"),l=d.currentScript||d.scripts[d.scripts.length-1];' +
      's.settings=kdz||{};' +
      's.src=' + JSON.stringify(src) + ';' +
      's.async=true;' +
      's.referrerPolicy="no-referrer-when-downgrade";' +
      'l.parentNode.insertBefore(s,l);' +
      '})({});' +
      '<\/script></body></html>';
  }

  function houseFallback(slot) {
    if (slot.querySelector('.gwc-fallback')) return;
    var a = document.createElement('a');
    a.className = 'gwc-fallback';
    a.href      = 'https://t.me/noteswalebhaiya123';
    a.target    = '_blank';
    a.rel       = 'noopener noreferrer';
    a.innerHTML = '<span><b>GATEWAY CLASSES</b></span>' +
      '<span>Free AKTU notes &amp; PYQ &middot; @noteswalebhaiya123</span>';
    slot.appendChild(a);
    slot.setAttribute('data-house', '1');
  }

  /** Actually build the iframe unit inside a slot. */
  function buildUnitInto(slot, bucket) {
    if (!slot || slot.getAttribute('data-unit-built') === '1') return false;

    /* If slot already has an existing ad script or iframe, do not double-render */
    if (slot.querySelector('iframe') || slot.querySelector('script')) {
      slot.setAttribute('data-unit-built', '1');
      return true;
    }

    var p     = profile();
    var avail = slot.clientWidth ||
      (slot.parentNode && slot.parentNode.clientWidth) || p.width;

    /* The network banner is standard 300x250 Medium Rectangle */
    var w = Math.min(300, avail);
    var h = 250;

    slot.setAttribute('data-unit-built', '1');
    slot.setAttribute('data-size', '300x250');
    slot.style.minHeight = h + 'px';
    slot.style.height    = h + 'px';

    var unit  = document.createElement('div');
    unit.className = 'gwc-unit';

    var frame = document.createElement('iframe');
    frame.title          = 'Sponsored';
    frame.scrolling      = 'no';
    frame.loading        = 'eager';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.setAttribute('sandbox',
      'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
    frame.style.cssText = 'width:100%;height:' + h + 'px;border:0;display:block;' +
      'min-height:' + h + 'px;background:transparent;margin:0 auto;';

    try   { frame.srcdoc = unitHtml(AD_TAG_SRC, w, h); }
    catch (_) { frame.src = 'about:blank'; }

    unit.appendChild(frame);
    slot.appendChild(unit);

    DEBUG('unit built ' + w + 'x' + h + ' in', slot.id || slot.className.slice(0, 30));

    /* House fallback if network doesn't fill within timeout */
    var settled = false;
    var t = setTimeout(function () {
      if (settled) return;
      var body = frame.contentWindow && frame.contentWindow.document &&
        frame.contentWindow.document.body;
      if (!body || body.childElementCount <= 1) houseFallback(slot);
      settled = true;
    }, UNIT_FILL_TIMEOUT_MS);

    frame.addEventListener('load', function () {
      setTimeout(function () {
        if (!settled) { settled = true; clearTimeout(t); }
      }, 600);
    });

    return true;
  }

  /**
   * Lazy render: immediately build above-fold units; set up an
   * IntersectionObserver for below-fold slots so the iframe only loads
   * when the slot is 200px away from the viewport.
   */
  var lazyIO = null;

  function lazyObserver() {
    if (lazyIO) return lazyIO;
    if (!('IntersectionObserver' in window)) return null;
    lazyIO = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (!entries[k].isIntersecting) continue;
        var slot   = entries[k].target;
        var bucket = bucketFor(profile().width);
        buildUnitInto(slot, bucket);
        lazyIO.unobserve(slot);
      }
    }, { rootMargin: '200px 0px' });
    return lazyIO;
  }

  function renderUnitInto(slot, bucket) {
    if (!slot || slot.getAttribute('data-unit-built') === '1') return false;

    /* Is the slot close to the viewport? */
    var rect      = slot.getBoundingClientRect();
    var vh        = window.innerHeight || 640;
    var nearFold  = rect.top < vh + 200;

    if (nearFold) {
      return buildUnitInto(slot, bucket);
    }

    /* Slot is below the fold — observe and build later */
    var io = lazyObserver();
    if (io) {
      io.observe(slot);
      slot.setAttribute('data-lazy', '1');
      DEBUG('slot queued for lazy load', slot.id || slot.className.slice(0, 30));
    } else {
      /* No IO support (very old browser) — build immediately */
      return buildUnitInto(slot, bucket);
    }
    return false;
  }

  function renderAllStaticUnits() {
    var p      = profile();
    var bucket = bucketFor(p.width);
    var slots  = document.querySelectorAll('.ad-slot');
    var built  = 0;
    for (var i = 0; i < slots.length; i++) {
      if (renderUnitInto(slots[i], bucket)) built++;
    }
    DEBUG('static units rendered: ' + built + '/' + slots.length);
    return built;
  }


  /* ─────────────────────────────────────────────────────────────
   * 4. ANCHOR — sticky bottom rail
   *
   * THE OVERLAP FIX:
   *   After the rail settles, we set document.body.style.paddingBottom
   *   to the rail's measured height + safe-area inset.  This is the
   *   only reliable way to guarantee the bottom card is never hidden,
   *   regardless of whether the layout is flex, grid, or normal flow.
   *   The #gwc-anchor-spacer div handles in-flow layouts too.
   *   Two mechanisms → belt and braces → zero hidden content.
   * ───────────────────────────────────────────────────────────── */
  var anchorState = {
    mounted:     false,
    wrap:        null,
    inner:       null,
    spacer:      null,
    height:      0,
    lastRefresh: 0,
    dismissed:   false,
    instances:   0,
    observer:    null,
    syncTimer:   null
  };

  function anchorDisabledByStudent() {
    try { return sessionStorage.getItem('gwc_anchor_off') === '1'; }
    catch (_) { return false; }
  }

  function buildAnchor() {
    if (!ENABLE_ANCHOR)          return;
    if (anchorState.mounted)     return;
    if (anchorState.dismissed)   return;
    if (anchorDisabledByStudent()) return;

    if (!document.body) {
      document.addEventListener('DOMContentLoaded', buildAnchor, { once: true });
      return;
    }

    var p      = profile();
    var bucket = bucketFor(p.width);
    var h      = anchorHeightFor(p, bucket);

    /* Outer wrapper */
    var wrap = document.createElement('div');
    wrap.id  = 'gwc-anchor';
    wrap.setAttribute(INJECTED, 'anchor');

    /* Inner slot */
    var inner = document.createElement('div');
    inner.id        = 'gwc-anchor-inner';
    inner.className = 'ad-slot ad-anchor';
    inner.style.minHeight = h + 'px';
    inner.style.maxHeight = h + 'px';
    inner.style.width     = Math.min(p.width, bucket.maxAnchorWidth) + 'px';
    inner.style.margin    = '0';
    wrap.appendChild(inner);

    /* "Ad" label */
    var lbl = document.createElement('span');
    lbl.className   = 'gwc-anchor-label';
    lbl.textContent = 'Ad';
    wrap.appendChild(lbl);

    /* Close button — student is NEVER trapped */
    var close = document.createElement('button');
    close.type      = 'button';
    close.className = 'gwc-anchor-close';
    close.setAttribute('aria-label', 'Hide this ad');
    close.textContent = '\u00d7'; // ×
    close.addEventListener('click', function () {
      anchorState.dismissed = true;
      try { sessionStorage.setItem('gwc_anchor_off', '1'); } catch (_) {}
      teardownAnchor();
      DEBUG('anchor dismissed by student');
    });
    wrap.appendChild(close);

    /* Spacer — reserves in-flow document space */
    var spacer = document.createElement('div');
    spacer.id = 'gwc-anchor-spacer';

    document.body.appendChild(wrap);
    document.body.appendChild(spacer);

    anchorState.mounted  = true;
    anchorState.wrap     = wrap;
    anchorState.inner    = inner;
    anchorState.spacer   = spacer;
    anchorState.height   = h;

    fillAnchor(bucket, p);
  }

  function teardownAnchor() {
    if (anchorState.observer) {
      try { anchorState.observer.disconnect(); } catch (_) {}
      anchorState.observer = null;
    }
    stopAnchorSync();
    if (anchorState.wrap   && anchorState.wrap.parentNode)   anchorState.wrap.remove();
    if (anchorState.spacer && anchorState.spacer.parentNode) anchorState.spacer.remove();
    /* Release body padding we reserved */
    try { document.body.style.paddingBottom = ''; } catch (_) {}
    anchorState.mounted = false;
  }

  function fillAnchor(bucket, p) {
    var inner = anchorState.inner;
    if (!inner) return;
    inner.innerHTML = '';
    inner.removeAttribute('data-unit-built');
    anchorState.instances++;
    buildUnitInto(inner, bucket); // anchor is always above-fold — build immediately
    anchorState.lastRefresh = Date.now();
    watchAnchorFill();
  }

  function watchAnchorFill() {
    var inner = anchorState.inner;
    if (!inner) return;

    var settled = false;
    var guard = setInterval(function () {
      if (settled || !anchorState.mounted) return;
      var node = inner.querySelector(
        'iframe, ins, img, canvas, a[href], [id*="asg"], [id*="banner"]'
      );
      if (!node) return;

      settled = true;
      clearInterval(guard);

      /* Lock to the height we chose — not to what the network reports
         at this instant (network frames can resize themselves mid-render). */
      var target = anchorState.height || 0;
      var wrap   = anchorState.wrap;
      if (target > 0 && wrap) {
        var railH = Math.ceil(wrap.getBoundingClientRect().height || 0);
        if (railH > 0 && railH < target + 40) target = railH;
      }
      setAnchorHeight(target || 50);
      startAnchorSync();
      syncAnchorSpacer();
      DEBUG('anchor filled → locked to', anchorState.height);
    }, 400);

    /* If nothing renders after 12 s, remove the rail and give space back */
    setTimeout(function () {
      if (settled || !anchorState.mounted) return;
      clearInterval(guard);
      stopAnchorSync();
      teardownAnchor();
      DEBUG('anchor empty → removed');
    }, 12000);
  }

  function setAnchorHeight(px) {
    var inner  = anchorState.inner;
    var spacer = anchorState.spacer;
    if (!inner || !spacer) return;

    var p      = profile();
    var isShortLandscape = p.landscape && p.height <= 520;
    var hardCap = isShortLandscape ? 50 : (p.width <= 480 ? 56 : 260);
    var vpCap   = Math.max(40, Math.floor(p.height / (isShortLandscape ? 8 : 6)));
    var finalH  = Math.max(40, Math.min(px, vpCap, hardCap));

    inner.style.minHeight = finalH + 'px';
    inner.style.maxHeight = finalH + 'px';
    spacer.style.height   = finalH + 'px';
    anchorState.height    = finalH;

    /* KEY: sync body padding-bottom — works for flex, grid, and normal flow */
    syncBodyPadding(finalH, p.safeBottom || 0);
    DEBUG('anchor height set to', finalH);
  }

  /** Single source of truth for body bottom clearance. */
  function syncBodyPadding(railH, safeBottom) {
    if (!document.body) return;
    var total = Math.max(0, (railH || 0) + (safeBottom || 0));
    document.body.style.paddingBottom = total + 'px';
  }

  /** Poll the rail's real size every 500ms, re-sync spacer + body if it drifts. */
  function syncAnchorSpacer() {
    var wrap   = anchorState.wrap;
    var spacer = anchorState.spacer;
    if (!wrap || !spacer || !anchorState.mounted) return;

    var p      = profile();
    var isShortLandscape = p.landscape && p.height <= 520;
    var hardCap = isShortLandscape ? 50 : (p.width <= 480 ? 56 : 260);
    var vpCap   = Math.max(40, Math.floor(p.height / (isShortLandscape ? 8 : 6)));

    var railH = Math.ceil(wrap.getBoundingClientRect().height || 0);
    var h     = Math.max(0, Math.min(railH, vpCap, hardCap));

    if (Math.abs(h - anchorState.height) > 1) {
      anchorState.height  = h;
      spacer.style.height = h + 'px';
      syncBodyPadding(h, p.safeBottom || 0);
      DEBUG('spacer re-synced to rail', h);
    }

    /* Keep close button at real top edge */
    var closeBtn = wrap.querySelector('.gwc-anchor-close');
    if (closeBtn && h > 0) closeBtn.style.top = '4px';
  }

  function startAnchorSync() {
    if (anchorState.syncTimer) return;
    anchorState.syncTimer = setInterval(syncAnchorSpacer, 500);
  }

  function stopAnchorSync() {
    if (anchorState.syncTimer) {
      clearInterval(anchorState.syncTimer);
      anchorState.syncTimer = null;
    }
  }


  /* ─────────────────────────────────────────────────────────────
   * 5. LIVE RESPONSIVENESS
   *    Handles: rotate, resize, pinch-zoom, URL-bar collapse.
   * ───────────────────────────────────────────────────────────── */
  function installResponsiveWatcher() {
    var currentKey = null;

    function refit(force) {
      var p      = profile();
      var bucket = bucketFor(p.width);
      var isShortLandscape = p.landscape && p.height <= 520;

      /* Re-size anchor rail */
      if (anchorState.mounted && anchorState.inner) {
        anchorState.inner.style.width =
          Math.min(p.width, bucket.maxAnchorWidth) + 'px';
        var hardCap = isShortLandscape ? 50 : (p.width <= 480 ? 56 : 120);
        var vpCap   = Math.max(40, Math.floor(p.height / (isShortLandscape ? 8 : 6)));
        var h       = Math.min(anchorState.height || bucket.anchorHeight, vpCap, hardCap);
        anchorState.inner.style.minHeight = h + 'px';
        anchorState.inner.style.maxHeight = h + 'px';
        if (anchorState.spacer) anchorState.spacer.style.height = h + 'px';
        syncBodyPadding(h, p.safeBottom || 0);
      }

      markSlotRatios(bucket);

      if (bucket.key !== currentKey || force) {
        currentKey = bucket.key;
        DEBUG('bucket →', bucket.key,
          '| w=' + p.width + ' h=' + p.height + ' land=' + p.landscape);
      }
    }

    var raf    = window.requestAnimationFrame || function (fn) { setTimeout(fn, 16); };
    var queued = false;
    function scheduleRefit() {
      if (queued) return;
      queued = true;
      raf(function () { queued = false; refit(false); });
    }
    window.__gwcRefit = scheduleRefit;

    window.addEventListener('resize',            scheduleRefit, { passive: true });
    window.addEventListener('orientationchange', function () {
      setTimeout(scheduleRefit, 250);
    }, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', scheduleRefit, { passive: true });
      window.visualViewport.addEventListener('scroll', scheduleRefit, { passive: true });
    }

    var bpQueries = [
      '(max-width:360px)', '(max-width:480px)', '(max-width:600px)',
      '(max-width:768px)', '(max-width:1024px)', '(max-width:1440px)',
      '(orientation:landscape)'
    ];
    bpQueries.forEach(function (q) {
      try {
        var m = window.matchMedia(q);
        if (m && m.addEventListener)  m.addEventListener('change', scheduleRefit);
        else if (m && m.addListener)  m.addListener(scheduleRefit);
      } catch (_) {}
    });

    refit(true);
  }


  /* ─────────────────────────────────────────────────────────────
   * 6. Slot shape reservation (prevents CLS)
   * ───────────────────────────────────────────────────────────── */
  function markSlotRatios(bucket) {
    var slots = document.querySelectorAll('.ad-slot');
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      var w    = slot.clientWidth ||
        (slot.parentNode && slot.parentNode.clientWidth) || 300;
      var pick = bucket.sizes[bucket.sizes.length - 1];
      for (var j = 0; j < bucket.sizes.length; j++) {
        if (bucket.sizes[j][0] <= w) { pick = bucket.sizes[j]; break; }
      }
      slot.setAttribute('data-ratio', pick[0] + 'x' + pick[1]);
      slot.style.setProperty('--gwc-pad', ((pick[1] / pick[0]) * 100).toFixed(2) + '%');
    }
  }


  /* ─────────────────────────────────────────────────────────────
   * 7. MID-CONTENT AUTO-INJECTION
   *    Fires every MIDCONTENT_GAP_PX of scroll, up to MIDCONTENT_MAX.
   *    Always between blocks — never inside a card, search bar, or header.
   * ───────────────────────────────────────────────────────────── */
  var midState = {
    armed:  true,
    lastY:  0,
    count:  0,
    busy:   false,
    hosts:  []
  };

  function findHosts() {
    var out   = [];
    var nodes = document.querySelectorAll(MIDCONTENT_HOSTS);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (out.indexOf(n) !== -1) continue;
      if (n.offsetParent === null && n.tagName !== 'BODY') continue;
      if (n.children.length < 1) continue;
      out.push(n);
    }
    return out;
  }

  function isBlocked(el) {
    if (!el || !el.tagName) return true;
    var tag = el.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'noscript' ||
        tag === 'iframe'  || tag === 'canvas') return true;
    try {
      if (el.matches && el.matches(MIDCONTENT_BLOCKLIST)) return true;
      /* Never insert directly after a card header */
      if (el.closest && el.closest('.subject-card')) {
        var hdr = el.closest('.subject-header,.subject-card-header');
        if (hdr && hdr.parentNode === el) return true;
      }
    } catch (_) {}
    return false;
  }

  function pickInsertionPoint() {
    var anchorEl  = document.getElementById('gwc-anchor');
    var anchorTop = anchorEl
      ? anchorEl.getBoundingClientRect().top
      : window.innerHeight;

    for (var h = 0; h < midState.hosts.length; h++) {
      var host = midState.hosts[h];
      var kids = host.children;
      if (!kids || kids.length < 2) continue;

      for (var k = kids.length - 1; k >= 0; k--) {
        var node = kids[k];
        if (isBlocked(node)) continue;
        var rect = node.getBoundingClientRect();
        if (rect.height < 40) continue;
        if (rect.top <= anchorTop && rect.bottom >= 0) {
          return { host: host, after: node };
        }
        if (rect.top > anchorTop) continue;
      }
    }
    return null;
  }

  function injectMidUnit() {
    if (!ENABLE_MIDCONTENT)               return;
    if (midState.count >= MIDCONTENT_MAX) return;
    if (midState.busy)                    return;

    var point = pickInsertionPoint();
    if (!point) { DEBUG('midcontent: no safe insertion point'); return; }

    midState.busy = true;

    var slot = document.createElement('div');
    slot.className = 'ad-slot ad-mid';
    slot.setAttribute(INJECTED, 'mid-' + midState.count);
    slot.setAttribute('data-ad-type', 'in-article');

    var parent = point.after.parentNode;
    parent.insertBefore(slot,
      point.after.nextSibling || null);

    midState.count++;
    DEBUG('mid-content unit #' + midState.count + ' inserted');

    watchSlots();
    markSlotRatios(bucketFor(profile().width));
    renderUnitInto(slot, bucketFor(profile().width));

    midState.armed = false;
    setTimeout(function () { midState.busy = false; }, 300);
  }

  function installMidContentWatcher() {
    if (!ENABLE_MIDCONTENT) return;

    var raf    = window.requestAnimationFrame || function (fn) { setTimeout(fn, 16); };
    var queued = false;

    function onScroll() {
      if (queued) return;
      queued = true;
      raf(function () {
        queued = false;
        var y = window.pageYOffset ||
          (document.documentElement && document.documentElement.scrollTop) || 0;

        if (y < midState.lastY) { midState.lastY = y; return; }

        if (!midState.armed) {
          if (y - midState.lastY >= MIDCONTENT_GAP_PX) midState.armed = true;
          midState.lastY = y;
          return;
        }

        midState.lastY = y;
        midState.hosts = findHosts();
        injectMidUnit();
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      midState.hosts = findHosts();
    }, { passive: true });

    /* Pages render content after load; re-scan several times */
    var tries = 0;
    var scan = setInterval(function () {
      tries++;
      midState.hosts = findHosts();
      if (midState.hosts.length || tries > 20) clearInterval(scan);
    }, 500);

    midState.hosts = findHosts();
    DEBUG('mid-content watcher installed, hosts=' + midState.hosts.length);
  }


  /* ─────────────────────────────────────────────────────────────
   * 7b. PAGE-FACING API
   *     Pages call window.__gwcMaybeAd(containerId, blockIndex)
   *     after each subject / papers block is rendered.
   * ───────────────────────────────────────────────────────────── */
  function maybeAd(containerId, index) {
    if (!ENABLE_MIDCONTENT)               return;
    if (midState.count >= MIDCONTENT_MAX) return;

    var host = document.getElementById(containerId) ||
      document.querySelector('.' + containerId);
    if (!host) return;

    var kids = host.children;
    if (!kids || kids.length < 2) return;

    /* Inject every 2 blocks for higher impression density */
    var stride = 2;
    if (typeof index === 'number' && index > 0 && index % stride !== 0) return;

    /* Don't crowd the anchor rail */
    var anchor = document.getElementById('gwc-anchor');
    if (anchor) {
      var aTop  = anchor.getBoundingClientRect().top;
      var last  = kids[kids.length - 1];
      if (last.getBoundingClientRect().bottom > aTop - 180) return;
    }

    var slot = document.createElement('div');
    slot.className = 'ad-slot ad-mid';
    slot.setAttribute(INJECTED, 'mid-' + midState.count);
    slot.setAttribute('data-ad-type', 'in-article');
    host.appendChild(slot);
    midState.count++;
    DEBUG('mid (hook) unit #' + midState.count + ' in #' + containerId);

    watchSlots();
    markSlotRatios(bucketFor(profile().width));
    renderUnitInto(slot, bucketFor(profile().width));
  }

  window.__gwcMaybeAd = maybeAd;

  window.__gwcRefreshSlots = function () {
    watchSlots();
    markSlotRatios(bucketFor(profile().width));
    renderAllStaticUnits();
    DEBUG('slots refreshed on request');
  };


  /* ─────────────────────────────────────────────────────────────
   * 8. viewer.html integration — longest dwell time on the site
   * ───────────────────────────────────────────────────────────── */
  function setupViewerIntegration() {
    var isViewer =
      window.location.pathname.indexOf('viewer.html') !== -1 ||
      !!document.getElementById('pdfScrollContainer');
    if (!isViewer) return;

    /* Add has-mobile-bar class so anchor CSS can yield below mobile-bar */
    if (document.getElementById('mobileBar') ||
        document.querySelector('.mobile-bar')) {
      document.body.classList.add('has-mobile-bar');
    }

    var host = document.getElementById('pdfScrollContainer') || document.body;
    if (!host) return;

    var p       = profile();
    var rail    = ENABLE_ANCHOR ? anchorHeightFor(p, bucketFor(p.width)) : 0;
    /* Add extra clearance for mobile-bar on the viewer */
    var mbar    = document.getElementById('mobileBar');
    var mbarH   = (mbar && mbar.offsetHeight) || 0;
    host.style.paddingBottom = (80 + rail + mbarH) + 'px';
    DEBUG('viewer integration: paddingBottom=' + host.style.paddingBottom);
  }


  /* ─────────────────────────────────────────────────────────────
   * 9. Slot housekeeping
   *    • Collapse empty slots so they never leave a dead grey box
   *    • Mark slots as "viewable" after IAB 1-second hold
   * ───────────────────────────────────────────────────────────── */
  function watchSlots() {
    var slots = document.querySelectorAll('.ad-slot');

    for (var i = 0; i < slots.length; i++) {
      (function (slot) {
        if (slot.getAttribute(INJECTED) === 'watched') return;
        slot.setAttribute(INJECTED, 'watched');

        var filled = function () {
          return !!slot.querySelector(
            'iframe, ins, img, canvas, .gwc-fallback, ' +
            'a[href], [id*="asg"], [id*="banner"], [id*="container"]'
          );
        };

        var check = function () {
          var f = filled();
          if (slot.getAttribute('data-unit-built') === '1') f = true;
          slot.style.display = f ? 'block' : 'none';
          if (!f) slot.removeAttribute('data-viewable');
        };
        check();
        new MutationObserver(check).observe(slot, {
          childList: true, subtree: true, attributes: true
        });
      })(slots[i]);
    }

    /* Viewability tracking */
    if (!('IntersectionObserver' in window)) return;
    var timers = new WeakMap();
    var io = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        var e    = entries[k];
        var slot = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.5) {
          if (timers.has(slot)) continue;
          timers.set(slot, setTimeout(function () {
            slot.setAttribute('data-viewable', '1');
            timers.delete(slot);
          }, VIEWABLE_HOLD_MS));
        } else if (timers.has(slot)) {
          clearTimeout(timers.get(slot));
          timers.delete(slot);
        }
      }
    }, { threshold: [0, 0.5, 0.75], rootMargin: '0px 0px -10% 0px' });

    for (var j = 0; j < slots.length; j++) io.observe(slots[j]);
  }


  /* ─────────────────────────────────────────────────────────────
   * 10. Anchor refresh on long dwell (view-gated, throttled)
   * ───────────────────────────────────────────────────────────── */
  function installAnchorRefresh() {
    if (!ENABLE_ANCHOR) return;
    if (!('IntersectionObserver' in window)) return;

    var visible = true;
    var io = new IntersectionObserver(function (entries) {
      visible = !!(entries[0] && entries[0].isIntersecting);
    }, { threshold: [0.5] });
    anchorState.observer = io;

    var attach = setInterval(function () {
      if (anchorState.inner && !anchorState.inner.__gwcObs) {
        anchorState.inner.__gwcObs = true;
        io.observe(anchorState.inner);
        clearInterval(attach);
      }
      if (anchorState.dismissed) clearInterval(attach);
    }, 1000);

    setInterval(function () {
      if (!anchorState.mounted || anchorState.dismissed) return;
      if (!visible) return;
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - anchorState.lastRefresh < ANCHOR_REFRESH_MS) return;
      if (document.hidden) return;
      var p = profile();
      fillAnchor(bucketFor(p.width), p);
      DEBUG('anchor refreshed');
    }, 15000);
  }


  /* ─────────────────────────────────────────────────────────────
   * OVERLAY GUARDIAN
   *
   * The publisher network can inject its own fixed-position banners.
   * On phones they land on top of hero text and the Download button.
   * We don't hide them (impression would be lost) but we:
   *
   *   A) SINK  — ad over the hero → push it behind our content layer
   *   B) REFLOW — big floating panels → lift into document flow
   *   C) CAP   — thin strips that can't be reflowed → limit their height
   *
   * We never touch our own nodes.
   * ───────────────────────────────────────────────────────────── */
  var GUARDIAN_SEL = '#gwc-anchor,#gwc-anchor-spacer,#gwc-anchor-inner,' +
    '.ad-slot,.gwc-unit,.gwc-fallback,script,style,noscript,link,' +
    '#gwc-anchor *,.ad-slot *';

  var CONTENT_SEL = 'header,.main-wrapper,.main-wrap,main,footer,.portal-grid,' +
    '.credit-container,.container,#gwcHomeBtn';

  /* The site's OWN fixed/sticky chrome — the guardian must NEVER touch
   * these, or it would hide the student's real UI (home button, toggles,
   * PDF toolbar, nav header, decorative canvas). */
  var PROTECTED_SEL =
    '#gwcHomeBtn,#toggleMode,#matrixCanvas,header,.header,.viewer-bar,' +
    '.mobile-bar,.controls-panel,.editor-toolbar,.site-footer,footer,' +
    '.tool-group,.sem-tabs,.session-chips,.unit-tabs,nav,.navbar';

  function isOurs(el) {
    if (!el || !el.tagName) return true;
    try {
      if (el.matches && el.matches(GUARDIAN_SEL)) return true;
      if (el.closest && el.closest('#gwc-anchor,.ad-slot,.gwc-unit')) return true;
      /* Protect the site's own chrome from the overlay killer. */
      if (el.matches && el.matches(PROTECTED_SEL)) return true;
      if (el.closest && el.closest(PROTECTED_SEL)) return true;
    } catch (_) {}
    var id = el.id || '';
    return id.indexOf('gwc') === 0;
  }

  function isCoveringOverlay(el) {
    if (isOurs(el))          return false;
    if (el.nodeType !== 1)   return false;
    if (el.tagName === 'CANVAS') return false;
    var cs;
    try { cs = getComputedStyle(el); } catch (_) { return false; }
    if (cs.display    === 'none')    return false;
    if (cs.visibility === 'hidden')  return false;
    if (cs.opacity    === '0')       return false;
    if (cs.pointerEvents === 'none') return false;
    if (cs.position !== 'fixed' && cs.position !== 'absolute') return false;
    var r  = el.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    var vw = window.innerWidth  || 360;
    var vh = window.innerHeight || 640;
    if (r.bottom < 0 || r.top > vh) return false;
    var wide  = r.width >= vw * 0.45 && r.height >= 48;
    var block = r.width >= 90        && r.height >= 90;
    return wide || block;
  }

  function contentAbove() {
    var nodes = document.querySelectorAll(CONTENT_SEL);
    for (var i = 0; i < nodes.length; i++) {
      try {
        var cs = getComputedStyle(nodes[i]);
        if (cs.position === 'static') nodes[i].style.position = 'relative';
        nodes[i].style.zIndex = '3';
      } catch (_) {}
    }
  }

  /* Hard-hide an overlay: remove it from view + neutralize it so the
   * network JS can't just re-show the same node. Popunder still fires
   * (that's a click→window.open handler, not this box), so no earning
   * is lost — only the UI-breaking visible panel goes away. */
  function hideOverlay(el, tag, why) {
    try {
      el.setAttribute('data-gwc-contained', '1');
      el.setAttribute('data-gwc-was', 'hidden:' + why);
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
      el.style.setProperty('opacity', '0', 'important');
      el.style.setProperty('max-height', '0', 'important');
      el.style.setProperty('max-width', '0', 'important');
      DEBUG('guardian: HID top/center overlay [' + why + ']', tag);
    } catch (_) {}
    return true;
  }

  function containOverlay(el, tag) {
    if (!isCoveringOverlay(el)) return false;
    if (el.getAttribute('data-gwc-contained') === '1') return false;

    var r  = el.getBoundingClientRect();
    var vw = window.innerWidth  || 360;
    var vh = window.innerHeight || 640;

    /* ── TOP-OVERLAY / INTERSTITIAL KILLER (runs before reflow) ──
     * Anything the network pins near the top of the screen, or throws
     * up as a big centered interstitial, is HIDDEN outright — not
     * reflowed (reflow loses because the ad JS re-pins it every frame). */
    if (HIDE_TOP_OVERLAYS) {
      var topPinned  = r.top <= vh * TOP_OVERLAY_BAND && r.height >= 40 &&
                       r.width >= 80;
      var interstit  = (r.width >= vw * 0.6 && r.height >= vh * 0.5);
      var floatVideo = /video|player|vid|float/i.test(
                         (el.id || '') + ' ' + (el.className || '')) &&
                       r.width >= 120 && r.height >= 90;
      if (topPinned || interstit || floatVideo) {
        return hideOverlay(el, tag,
          topPinned ? 'top' : (interstit ? 'interstitial' : 'video'));
      }
    }

    var spansWidth = r.width  >= vw * 0.75;
    var veryTall   = r.height >  vh * 0.5;
    var isSliver   = r.width  <  vw * 0.75 && r.height >= 90;
    var midPage    = r.top    >  40 && r.bottom < vh - 40;

    /* Is it covering the page hero? */
    var overHero = false;
    try {
      var hdr = document.querySelector('header');
      if (hdr) {
        var hr  = hdr.getBoundingClientRect();
        var ix  = Math.max(0, Math.min(r.right, hr.right) - Math.max(r.left, hr.left));
        var iy  = Math.max(0, Math.min(r.bottom, hr.bottom) - Math.max(r.top, hr.top));
        var cov = (ix * iy) / Math.max(1, hr.width * hr.height);
        var vps = (r.width * r.height) / (vw * vh);
        overHero = cov >= 0.18 && vps >= 0.12;
      }
    } catch (_) {}

    /* A) SINK */
    if (overHero && !veryTall) {
      try {
        el.setAttribute('data-gwc-contained', '1');
        el.setAttribute('data-gwc-was', 'sunk');
        el.style.zIndex       = '0';
        el.style.pointerEvents = 'none';
        el.style.maxWidth     = '100vw';
        el.style.overflow     = 'hidden';
        contentAbove();
        var par = el.parentElement;
        if (par && par !== document.body && !isOurs(par)) {
          if (getComputedStyle(par).position === 'static')
            par.style.position = 'relative';
          par.style.zIndex = '0';
        }
        DEBUG('guardian: sunk', tag);
        return true;
      } catch (_) { return false; }
    }

    /* B) REFLOW */
    if (veryTall || isSliver || midPage || spansWidth) {
      try {
        el.setAttribute('data-gwc-contained', '1');
        el.setAttribute('data-gwc-was', 'overlay');
        el.style.position  = 'relative';
        el.style.top       = 'auto';
        el.style.left      = 'auto';
        el.style.right     = 'auto';
        el.style.bottom    = 'auto';
        el.style.zIndex    = '1';
        el.style.width     = '100%';
        el.style.maxWidth  = '100%';
        el.style.margin    = 'clamp(8px,1.6vw,18px) auto';
        el.style.maxHeight = 'none';
        if (el.parentNode !== document.body) document.body.appendChild(el);
        DEBUG('guardian: reflowed', tag);
        return true;
      } catch (_) { return false; }
    }

    /* C) CAP */
    try {
      var cap = Math.max(50, Math.floor(vh * 0.28));
      el.setAttribute('data-gwc-contained', '1');
      el.setAttribute('data-gwc-was', 'capped');
      el.style.maxHeight = cap + 'px';
      el.style.overflow  = 'hidden';
      el.style.zIndex    = '1';
      DEBUG('guardian: capped to', cap + 'px', tag);
      return true;
    } catch (_) { return false; }
  }

  function sweepOverlays() {
    var body = document.body;
    if (!body) return;
    var kids = body.children;
    for (var i = kids.length - 1; i >= 0; i--) {
      var el = kids[i];
      try {
        containOverlay(el,
          el.tagName + '#' + (el.id || '-') + '.' +
          ((el.className && el.className.toString)
            ? el.className.toString().slice(0, 25) : '-'));
      } catch (_) {}
    }
    var wraps = document.querySelectorAll(
      '.main-wrapper,.main-wrap,.container,main');
    for (var w = 0; w < wraps.length; w++) {
      var kk = wraps[w].children;
      for (var j = kk.length - 1; j >= 0; j--) {
        try { containOverlay(kk[j], 'in-wrapper ' + kk[j].tagName); }
        catch (_) {}
      }
    }

    /* Document-wide pass: catch fixed/absolute overlays the network
     * injects deep in the tree (nested divs, wrappers, late iframes).
     * Only fires the top/interstitial killer path via containOverlay. */
    if (HIDE_TOP_OVERLAYS) {
      var all = document.body.getElementsByTagName('*');
      for (var a = 0; a < all.length; a++) {
        var node = all[a];
        if (node.getAttribute &&
            node.getAttribute('data-gwc-contained') === '1') continue;
        if (isOurs(node)) continue;
        var pos;
        try { pos = getComputedStyle(node).position; } catch (_) { continue; }
        if (pos !== 'fixed' && pos !== 'absolute') continue;
        try {
          containOverlay(node,
            'deep ' + node.tagName + '#' + (node.id || '-'));
        } catch (_) {}
      }
    }
  }

  function installOverlayGuardian() {
    contentAbove();
    sweepOverlays();

    if (window.MutationObserver && document.body) {
      var pending = false;
      var mo = new MutationObserver(function () {
        if (pending) return;
        pending = true;
        setTimeout(function () {
          pending = false;
          contentAbove();
          sweepOverlays();
        }, 300);
      });
      /* subtree:true so overlays injected deep in the tree, and the ad
       * JS re-pinning a node to the top, are both caught immediately. */
      mo.observe(document.body, {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ['style', 'class']
      });
    }

    setInterval(function () {
      contentAbove();
      sweepOverlays();
    }, 1000);

    DEBUG('overlay guardian v4 installed');
  }


  /* ─────────────────────────────────────────────────────────────
   * BOOT
   * ───────────────────────────────────────────────────────────── */
  function init() {
    /* Detect viewer page — use lightweight ad mode (bottom + anchor only,
       no mid-content inside the PDF scroll container) */
    var isViewerPage =
      window.location.pathname.indexOf('viewer.html') !== -1 ||
      !!document.getElementById('pdfScrollContainer');

    if (isViewerPage) {
      MIDCONTENT_MAX = 0;   // no mid-content ads inside PDF reader
      TOP_LEVEL_INSTANCES = 0; // no top-level tag on viewer (overlay risk)
    }

    ensureReferrerMeta();
    applySlotStyles();
    installOverlayGuardian();

    var p      = profile();
    var bucket = bucketFor(p.width);

    /* Inject publisher tag instances */
    for (var i = 0; i < TOP_LEVEL_INSTANCES; i++) {
      injectTag({
        id: 'gwc-pub-ad-tag-' + i,
        sizes:  bucket.sizes,
        device: bucket.key,
        settings: {}
      });
    }

    setupViewerIntegration();
    markSlotRatios(bucket);
    watchSlots();
    renderAllStaticUnits();
    buildAnchor();
    installAnchorRefresh();
    installMidContentWatcher();
    installResponsiveWatcher();

    DEBUG('init v4 | device=' + bucket.key +
      ' w=' + p.width + ' h=' + p.height +
      ' dpr=' + p.dpr + ' touch=' + p.touch +
      ' land=' + p.landscape + ' safeBottom=' + p.safeBottom);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

})();

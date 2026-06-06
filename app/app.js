/* ============================================================
   Interview Prep Wiki — app logic
   Renders window.WIKI_NOTES (generated from your .md files by build.py).
   ============================================================ */
(function () {
  "use strict";

  // ---- Domain metadata: display order + icon, keyed by domain name.
  //      Domains are derived from the notes themselves, so adding a new
  //      folder/phase just works. Unknown domains get a book icon + sort last.
  const DOMAIN_META = {
    "DSA & Coding":     { order: 0, icon: icoCode },
    "Coding / DSA":     { order: 0, icon: icoCode },
    "ML Fundamentals":  { order: 1, icon: icoFlask },
    "Deep Learning":    { order: 2, icon: icoLayers },
    "LLMs / GenAI":     { order: 3, icon: icoSpark },
    "System Design":    { order: 4, icon: icoGrid },
    "ML System Design": { order: 4, icon: icoGrid },
    "MLOps & Infra":    { order: 6, icon: icoServer },
    "Math Foundations": { order: 7, icon: icoSigma },
    "Behavioral":       { order: 8, icon: icoChat },
    "Recruiter & HM":   { order: 9, icon: icoBriefcase },
  };
  function domainIcon(name) { return (DOMAIN_META[name] && DOMAIN_META[name].icon) || icoBook; }
  function domainOrder(name) { return DOMAIN_META[name] ? DOMAIN_META[name].order : 99; }

  const STATUSES = [
    { key: "new",       label: "New" },
    { key: "learning",  label: "Learning" },
    { key: "reviewing", label: "Reviewing" },
    { key: "mastered",  label: "Mastered" },
  ];
  // review interval (days) before a note becomes "due" again
  const REVIEW_DAYS = { new: 0, learning: 2, reviewing: 5, mastered: 16 };
  const DAY = 86400000;

  // ---- State ----
  const NOTES = (window.WIKI_NOTES || []).slice();
  const byId = {};
  const titleMap = {};
  const slugMap = {};
  NOTES.forEach((n) => {
    byId[n.id] = n;
    titleMap[n.title.toLowerCase()] = n.id;
    slugMap[n.id.toLowerCase()] = n.id;
  });

  function activeDomains() {
    const seen = [];
    NOTES.forEach((n) => { if (seen.indexOf(n.domain) === -1) seen.push(n.domain); });
    seen.sort((a, b) => (domainOrder(a) - domainOrder(b)) || a.localeCompare(b));
    return seen.map((name) => ({ name: name, icon: domainIcon(name) }));
  }

  // ---- Sub-groups (sub-folders within a domain) ----
  // Notes carry a `group` (their sub-folder, e.g. "Arrays"). Notes with no
  // sub-folder fall into this bucket; a domain that has ONLY this bucket renders
  // flat (no sub-headers), so single-folder domains stay clean.
  const GROUP_FALLBACK = "Core Concepts";
  function groupOf(n) { return (n.group && n.group.trim()) ? n.group : GROUP_FALLBACK; }
  function orderedGroups(items) {
    const names = [];
    items.forEach((n) => { const g = groupOf(n); if (names.indexOf(g) === -1) names.push(g); });
    names.sort((a, b) => {
      if (a === GROUP_FALLBACK) return 1;     // keep the catch-all last
      if (b === GROUP_FALLBACK) return -1;
      return a.localeCompare(b);
    });
    return names;
  }

  const LS = {
    progress: "ipw:progress",
    last: "ipw:last",
    theme: "ipw:theme",
    collapsed: "ipw:collapsed",
  };

  let collapsed = load(LS.collapsed, {});     // { domain: true }
  let searchTerm = "";

  function load(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  // status precedence: your saved progress > the note's frontmatter status > "new"
  function statusOf(id) {
    var p = window.IPWStore && window.IPWStore.get(id);
    if (p && p.status) return p.status;
    return (byId[id] && byId[id].status) || "new";
  }
  function reviewedAt(id) {
    var p = window.IPWStore && window.IPWStore.get(id);
    return (p && p.reviewed) || 0;
  }
  function dueAt(id) {
    const st = statusOf(id);
    if (st === "new") return 0;
    return reviewedAt(id) + REVIEW_DAYS[st] * DAY;
  }
  function isDue(id) { return dueAt(id) <= Date.now(); }

  // ============================================================
  // Markdown
  // ============================================================
  function renderMarkdown(src) {
    // resolve [[Wikilinks]] -> internal anchors before marked runs.
    // matches by slug (filename) OR by title, case-insensitive.
    const pre = src.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (_, target, label) {
      const key = target.trim().toLowerCase();
      const id = slugMap[key] || titleMap[key];
      const text = (label || target).trim();
      if (id) return `<a class="xlink" href="#/note/${id}">${esc(text)}</a>`;
      return `<a class="xlink dead" title="No page yet">${esc(text)}</a>`;
    });
    let html;
    if (window.marked) {
      window.marked.setOptions({ breaks: false, gfm: true });
      html = window.marked.parse(pre);
    } else {
      html = "<pre>" + pre.replace(/</g, "&lt;") + "</pre>";
    }
    return html;
  }

  // ============================================================
  // Sidebar
  // ============================================================
  function buildSidebar() {
    const nav = document.getElementById("nav");
    nav.innerHTML = "";

    // top links
    const top = el("div", "nav-top");
    top.appendChild(navLink("home", "Overview", icoHome(), countAll()));
    top.appendChild(navLink("review", "Review queue", icoRepeat(), countDue()));
    nav.appendChild(top);

    const q = searchTerm.trim().toLowerCase();
    let any = false;

    activeDomains().forEach((dom) => {
      let items = NOTES.filter((n) => n.domain === dom.name);
      if (q) {
        items = items.filter((n) =>
          n.title.toLowerCase().includes(q) ||
          (n.tags || []).some((t) => t.toLowerCase().includes(q)) ||
          (n.body || "").toLowerCase().includes(q)
        );
      }
      if (!items.length) return;
      any = true;

      const wrap = el("div", "domain");
      const isColl = q ? false : !!collapsed[dom.name];
      if (isColl) wrap.classList.add("collapsed");

      const head = el("div", "domain-head");
      head.innerHTML = `<span class="chev">${icoChevron()}</span><span class="dh-title">${esc(dom.name)}</span>`;
      const prog = el("span", "dh-prog");
      const mastered = items.filter((n) => statusOf(n.id) === "mastered").length;
      prog.textContent = `${mastered}/${items.length}`;
      head.appendChild(prog);
      head.addEventListener("click", () => {
        collapsed[dom.name] = !collapsed[dom.name];
        save(LS.collapsed, collapsed);
        wrap.classList.toggle("collapsed");
      });
      wrap.appendChild(head);

      const list = el("div", "domain-items");
      const groups = orderedGroups(items);
      const flat = groups.length === 1 && groups[0] === GROUP_FALLBACK;

      if (flat) {
        // domain has no sub-folders -> render notes directly (original behavior)
        items.forEach((n) => list.appendChild(noteLink(n)));
      } else {
        groups.forEach((g) => {
          const gitems = items.filter((n) => groupOf(n) === g);
          if (!gitems.length) return;

          const sg = el("div", "subgroup");
          const sgKey = dom.name + "▸" + g;
          if (!q && collapsed[sgKey]) sg.classList.add("collapsed");

          const sgHead = el("div", "subgroup-head");
          sgHead.innerHTML = `<span class="chev">${icoChevron()}</span><span class="sg-title">${esc(g)}</span>`;
          const sgProg = el("span", "sg-prog");
          const sgMastered = gitems.filter((n) => statusOf(n.id) === "mastered").length;
          sgProg.textContent = `${sgMastered}/${gitems.length}`;
          sgHead.appendChild(sgProg);
          sgHead.addEventListener("click", () => {
            collapsed[sgKey] = !collapsed[sgKey];
            save(LS.collapsed, collapsed);
            sg.classList.toggle("collapsed");
          });
          sg.appendChild(sgHead);

          const sgItems = el("div", "subgroup-items");
          gitems.forEach((n) => sgItems.appendChild(noteLink(n)));
          sg.appendChild(sgItems);
          list.appendChild(sg);
        });
      }

      wrap.appendChild(list);
      nav.appendChild(wrap);
    });

    if (!any) {
      const msg = NOTES.length
        ? "No notes match “" + searchTerm + "”"
        : "No notes yet — run build.py";
      nav.appendChild(el("div", "no-results", msg));
    }
    markActive();
  }

  function navLink(route, label, icon, count) {
    const a = el("a", "nav-link");
    a.href = "#/" + route;
    a.dataset.route = route;
    a.innerHTML = `<span class="ico">${icon}</span>${label}`;
    if (count != null) {
      const c = el("span", "count");
      c.textContent = count;
      a.appendChild(c);
    }
    return a;
  }

  function noteLink(n) {
    const a = el("a", "note-link");
    a.href = "#/note/" + n.id;
    a.dataset.note = n.id;
    a.innerHTML = `<span class="dot ${statusOf(n.id)}"></span><span class="nl-title">${esc(n.title)}</span>`;
    return a;
  }

  function markActive() {
    const route = currentRoute();
    document.querySelectorAll(".nav-link").forEach((a) => a.classList.toggle("active", a.dataset.route === route.name));
    document.querySelectorAll(".note-link").forEach((a) => a.classList.toggle("active", route.name === "note" && a.dataset.note === route.arg));
  }

  // ============================================================
  // Routing
  // ============================================================
  function currentRoute() {
    const h = location.hash.replace(/^#\/?/, "");
    const parts = h.split("/");
    if (parts[0] === "note" && parts[1]) return { name: "note", arg: decodeURIComponent(parts[1]) };
    if (parts[0] === "domain" && parts[1]) return { name: "domain", arg: decodeURIComponent(parts[1]) };
    if (parts[0] === "review") return { name: "review" };
    if (parts[0] === "all") return { name: "all" };
    return { name: "home" };
  }

  function router() {
    const r = currentRoute();
    const main = document.getElementById("main");
    main.scrollTop = 0;
    if (r.name === "note") {
      if (byId[r.arg]) { renderNote(byId[r.arg]); save(LS.last, r.arg); }
      else renderHome();
    } else if (r.name === "review") renderReview();
    else if (r.name === "domain") renderList("domain", r.arg);
    else if (r.name === "all") renderList("all");
    else renderHome();
    markActive();
    document.body.classList.remove("nav-open");
  }

  // Re-render the current view in place (no scroll reset). Called when progress
  // changes — from your own click or from a synced change on another device.
  function refresh() {
    const r = currentRoute();
    if (r.name === "note" && byId[r.arg]) renderNote(byId[r.arg]);
    else if (r.name === "review") renderReview();
    else if (r.name === "domain") renderList("domain", r.arg);
    else if (r.name === "all") renderList("all");
    else renderHome();
    buildSidebar();
  }

  // ============================================================
  // Note view
  // ============================================================
  function renderNote(n) {
    setCrumbs([
      { label: "Overview", href: "#/home" },
      { label: n.domain, href: "#/domain/" + encodeURIComponent(n.domain) },
      { cur: n.title },
    ]);

    const reader = el("article", "reader");
    const diff = n.difficulty ? `<span class="diff">${esc(n.difficulty)}</span>` : "";
    const tags = (n.tags || []).map((t) => `<span class="tag">#${esc(t)}</span>`).join("");
    const upd = n.updated ? `<span class="updated">updated ${esc(n.updated)}</span>` : "";

    const head = el("header", "note-head");
    head.innerHTML =
      `<div class="note-eyebrow">${esc(n.domain)} ${diff}</div>` +
      `<h1 class="note-title">${esc(n.title)}</h1>` +
      `<div class="note-meta"><div class="status-picker">${STATUSES.map((s) =>
        `<button data-st="${s.key}" class="${s.key} ${statusOf(n.id) === s.key ? "sel" : ""}"><span class="pip"></span>${s.label}</button>`
      ).join("")}</div>${upd}</div>` +
      (tags ? `<div class="tags" style="margin-top:14px">${tags}</div>` : "");
    reader.appendChild(head);

    const prose = el("div", "prose");
    prose.innerHTML = renderMarkdown(n.body || "*No content yet.*");
    reader.appendChild(prose);

    // related
    const rel = (n.related || []).map((id) => byId[id]).filter(Boolean);
    if (rel.length) {
      const r = el("div", "related");
      r.innerHTML = `<h4>Related pages</h4>`;
      const grid = el("div", "rel-grid");
      rel.forEach((m) => {
        const c = el("a", "rel-card");
        c.href = "#/note/" + m.id;
        c.innerHTML = `<span class="dot ${statusOf(m.id)}"></span><div class="rc-body"><div class="rc-title">${esc(m.title)}</div><div class="rc-dom">${esc(m.domain)}</div></div>`;
        grid.appendChild(c);
      });
      r.appendChild(grid);
      reader.appendChild(r);
    }

    setContent(reader);

    // status picker handlers — setStatus triggers the store's change event,
    // which re-renders the sidebar + this view (see refresh()), so the picker
    // and dots update for both local clicks and remote (synced) changes.
    reader.querySelectorAll(".status-picker button").forEach((b) => {
      b.addEventListener("click", () => {
        setStatus(n.id, b.dataset.st);
        toast(statusToast(b.dataset.st));
      });
    });
  }

  function statusToast(st) {
    return ({
      new: "Marked as new",
      learning: "Now learning — keep at it",
      reviewing: "Moved to reviewing — back in 5 days",
      mastered: "Mastered ✨ — review in ~16 days",
    })[st];
  }

  function setStatus(id, st) {
    window.IPWStore.setStatus(id, st);
  }

  // ============================================================
  // Home / dashboard
  // ============================================================
  function renderHome() {
    setCrumbs([{ cur: "Overview" }]);

    // first-run empty state
    if (!NOTES.length) {
      const fr = el("div", "firstrun");
      fr.innerHTML =
        `<h2>Your wiki is empty</h2>
         <p>Add notes as markdown files under the domain folders (e.g. <code>dsa/</code>,
         <code>ml-fundamentals/</code>), then run <code>python build.py</code> from the repo
         root to regenerate the data this app reads. Refresh and they'll appear here.</p>`;
      setContent(fr);
      return;
    }

    const total = NOTES.length;
    const counts = { new: 0, learning: 0, reviewing: 0, mastered: 0 };
    NOTES.forEach((n) => counts[statusOf(n.id)]++);
    const due = NOTES.filter((n) => isDue(n.id) && statusOf(n.id) !== "new");
    const started = total - counts.new;

    const home = el("div", "home");
    const hr = new Date().getHours();
    const greet = hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";

    home.innerHTML =
      `<div class="home-hero">
        <div class="greet">${greet}</div>
        <h2>Your interview prep, compounding.</h2>
        <p>A living knowledge base of ${total} page${total === 1 ? "" : "s"} across AI &amp; coding. Read, mark what you know, and let the review queue bring it back before you forget.</p>
      </div>
      <div class="stat-row">
        <div class="stat"><div class="num">${started}<span class="of">/${total}</span></div><div class="lbl">Pages started</div></div>
        <div class="stat mastered"><div class="num">${counts.mastered}</div><div class="lbl">Mastered</div></div>
        <div class="stat review"><div class="num">${due.length}</div><div class="lbl">Due for review</div></div>
        <div class="stat"><div class="num">${counts.learning + counts.reviewing}</div><div class="lbl">In progress</div></div>
      </div>`;

    // study next
    const block1 = el("div", "home-block");
    block1.innerHTML = `<div class="section-h"><h3>Study next</h3><span class="hint">due for review or not yet started</span><a class="more" href="#/review">Full queue →</a></div>`;
    const queue = buildStudyQueue().slice(0, 5);
    block1.appendChild(renderQueue(queue, "You’re all caught up. Nothing due right now — explore a domain below."));
    home.appendChild(block1);

    // domains
    const block2 = el("div", "home-block");
    block2.innerHTML = `<div class="section-h"><h3>Domains</h3><span class="hint">your coverage by area</span><a class="more" href="#/all">All pages →</a></div>`;
    const grid = el("div", "dom-grid");
    activeDomains().forEach((dom) => {
      const items = NOTES.filter((n) => n.domain === dom.name);
      if (!items.length) return;
      const c = counts2(items);
      const card = el("a", "dom-card");
      card.href = "#/domain/" + encodeURIComponent(dom.name);
      const pct = (k) => (c[k] / items.length) * 100;
      card.innerHTML =
        `<div class="dc-top"><span class="dc-ico">${dom.icon()}</span><span class="dc-title">${esc(dom.name)}</span><span class="dc-count">${c.mastered}/${items.length}</span></div>
         <div class="bar">
           <span class="b-mastered" style="width:${pct("mastered")}%"></span>
           <span class="b-reviewing" style="width:${pct("reviewing")}%"></span>
           <span class="b-learning" style="width:${pct("learning")}%"></span>
         </div>
         <div class="dc-legend">
           <span><i style="background:var(--st-mastered)"></i>${c.mastered} mastered</span>
           <span><i style="background:var(--st-learning)"></i>${c.learning + c.reviewing} learning</span>
           <span><i style="background:var(--st-new)"></i>${c.new} new</span>
         </div>`;
      grid.appendChild(card);
    });
    block2.appendChild(grid);
    home.appendChild(block2);

    setContent(home);
  }

  function counts2(items) {
    const c = { new: 0, learning: 0, reviewing: 0, mastered: 0 };
    items.forEach((n) => c[statusOf(n.id)]++);
    return c;
  }

  function buildStudyQueue() {
    // due (non-new) first by overdue-ness, then untouched new notes
    const due = NOTES.filter((n) => statusOf(n.id) !== "new" && isDue(n.id))
      .sort((a, b) => dueAt(a.id) - dueAt(b.id));
    const fresh = NOTES.filter((n) => statusOf(n.id) === "new");
    return due.concat(fresh);
  }

  function renderQueue(list, emptyMsg) {
    if (!list.length) return el("div", "empty-note", emptyMsg);
    const wrap = el("div", "queue");
    list.forEach((n) => {
      const st = statusOf(n.id);
      const a = el("a", "queue-item");
      a.href = "#/note/" + n.id;
      let dueLabel, dueCls = "";
      if (st === "new") { dueLabel = "not started"; dueCls = "due"; }
      else if (!reviewedAt(n.id)) {
        // status seeded from frontmatter but never reviewed in-app yet
        dueLabel = "ready"; dueCls = "due";
      } else {
        const d = Math.round((Date.now() - dueAt(n.id)) / DAY);
        if (d >= 0) { dueLabel = d === 0 ? "due today" : `${d}d overdue`; dueCls = "due"; }
        else dueLabel = `in ${-d}d`;
      }
      a.innerHTML =
        `<span class="dot ${st}"></span>
         <div class="qi-body"><div class="qi-title">${esc(n.title)}</div><div class="qi-meta">${esc(n.domain)} · ${cap(st)}</div></div>
         <span class="qi-due ${dueCls}">${dueLabel}</span>`;
      wrap.appendChild(a);
    });
    return wrap;
  }

  // ============================================================
  // Review queue view
  // ============================================================
  function renderReview() {
    setCrumbs([{ label: "Overview", href: "#/home" }, { cur: "Review queue" }]);
    const list = buildStudyQueue();
    const lv = el("div", "listview");
    lv.innerHTML =
      `<div class="lv-head"><div class="lv-eyebrow">Spaced review</div>
       <h2>Review queue</h2>
       <div class="lv-sub">${list.length} page${list.length === 1 ? "" : "s"} ready — due reviews first, then pages you haven’t opened. Mark a page <strong>Reviewing</strong> or <strong>Mastered</strong> and it cycles back automatically.</div></div>`;
    lv.appendChild(renderQueue(list, "Nothing to review right now. Beautiful."));
    setContent(lv);
  }

  // ============================================================
  // List view (domain / all)
  // ============================================================
  function renderList(kind, arg) {
    let items, title, eyebrow, sub;
    if (kind === "domain") {
      items = NOTES.filter((n) => n.domain === arg);
      title = arg; eyebrow = "Domain";
      const c = counts2(items);
      sub = `${items.length} page${items.length === 1 ? "" : "s"} · ${c.mastered} mastered · ${c.learning + c.reviewing} in progress`;
      setCrumbs([{ label: "Overview", href: "#/home" }, { cur: arg }]);
    } else {
      items = NOTES.slice();
      title = "All pages"; eyebrow = "Index";
      sub = `${items.length} page${items.length === 1 ? "" : "s"} across ${activeDomains().length} domain${activeDomains().length === 1 ? "" : "s"}`;
      setCrumbs([{ label: "Overview", href: "#/home" }, { cur: "All pages" }]);
    }
    const lv = el("div", "listview");
    lv.innerHTML = `<div class="lv-head"><div class="lv-eyebrow">${eyebrow}</div><h2>${esc(title)}</h2><div class="lv-sub">${sub}</div></div>`;
    const q = el("div", "queue");
    items.forEach((n) => {
      const st = statusOf(n.id);
      const a = el("a", "queue-item");
      a.href = "#/note/" + n.id;
      const tagline = (n.tags || []).slice(0, 3).map((t) => "#" + t).join("  ");
      a.innerHTML =
        `<span class="dot ${st}"></span>
         <div class="qi-body"><div class="qi-title">${esc(n.title)}</div><div class="qi-meta">${esc(tagline || n.domain)}</div></div>
         <span class="qi-due">${cap(st)}</span>`;
      q.appendChild(a);
    });
    lv.appendChild(q);
    setContent(lv);
  }

  // ============================================================
  // helpers
  // ============================================================
  function countAll() { return NOTES.length; }
  function countDue() { return buildStudyQueue().length; }

  function setContent(node) {
    const c = document.getElementById("content");
    c.innerHTML = "";
    c.appendChild(node);
  }
  function setCrumbs(parts) {
    const c = document.getElementById("crumbs");
    c.innerHTML = parts.map((p, i) => {
      const sep = i ? `<span class="sep">/</span>` : "";
      if (p.cur) return sep + `<span class="cur">${esc(p.cur)}</span>`;
      return sep + `<a href="${p.href}">${esc(p.label)}</a>`;
    }).join(" ");
  }

  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  let toastT;
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // ---- theme ----
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    save(LS.theme, t);
    const btn = document.getElementById("theme-btn");
    if (btn) btn.innerHTML = t === "dark" ? icoSun() : icoMoon();
  }

  // ============================================================
  // init
  // ============================================================
  function init() {
    buildSidebar();

    const search = document.getElementById("search");
    search.addEventListener("input", () => { searchTerm = search.value; buildSidebar(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== search) { e.preventDefault(); search.focus(); }
      if (e.key === "Escape" && document.activeElement === search) { search.value = ""; searchTerm = ""; buildSidebar(); search.blur(); }
    });

    applyTheme(load(LS.theme, "light"));
    document.getElementById("theme-btn").addEventListener("click", () =>
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"));

    document.getElementById("menu-btn").addEventListener("click", () => document.body.classList.toggle("nav-open"));
    document.querySelector(".scrim").addEventListener("click", () => document.body.classList.remove("nav-open"));

    document.getElementById("reset-btn").addEventListener("click", () => {
      if (confirm("Reset all your learning progress (statuses + review history)? Notes are not deleted.")) {
        window.IPWStore.clearAll();
        toast("Progress reset");
      }
    });

    // re-render whenever progress changes (own click OR a synced change)
    if (window.IPWStore) window.IPWStore.subscribe(refresh);
    setupAuthUI();
    registerServiceWorker();

    window.addEventListener("hashchange", router);
    router();
  }

  // ---- cross-device sync button (in the TOP BAR so it's always visible,
  //      including on mobile where the sidebar footer can sit behind the
  //      browser's bottom toolbar). Only shown when a sync backend is configured. ----
  function setupAuthUI() {
    if (!window.IPWStore || !window.IPWStore.auth.available()) return; // local-only mode
    const bar = document.querySelector(".topbar");
    const themeBtn = document.getElementById("theme-btn");
    if (!bar || !themeBtn) return;
    const btn = el("button", "auth-btn");
    btn.type = "button";
    bar.insertBefore(btn, themeBtn);
    function paint(u) {
      const label = u ? "Synced" : "Sync";
      btn.innerHTML = `<span class="ico">${icoCloud()}</span><span class="auth-label">${label}</span>`;
      btn.title = u ? "Synced across your devices — tap to sign out" : "Sign in to sync progress across your devices";
      btn.classList.toggle("on", !!u);
    }
    paint(window.IPWStore.auth.current());
    window.IPWStore.auth.onChange(paint);
    btn.addEventListener("click", () => {
      const u = window.IPWStore.auth.current();
      const p = u ? window.IPWStore.auth.signOut() : window.IPWStore.auth.signIn();
      if (p && p.catch) p.catch((e) => toast("Sign-in error: " + ((e && e.code) || e)));
    });
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  }

  // ============================================================
  // Inline SVG icons (1.7 stroke, currentColor)
  // ============================================================
  function svg(p, size) { return `<svg width="${size||17}" height="${size||17}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`; }
  function icoHome() { return svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>'); }
  function icoRepeat() { return svg('<path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'); }
  function icoChevron() { return svg('<path d="M6 9l6 6 6-6"/>', 15); }
  function icoFlask() { return svg('<path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7 15h10"/>'); }
  function icoLayers() { return svg('<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 13l9 5 9-5"/>'); }
  function icoSpark() { return svg('<path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l2.5 2.5M18 18l-2.5-2.5M6 18l2.5-2.5M18 6l-2.5 2.5"/>'); }
  function icoGrid() { return svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'); }
  function icoCode() { return svg('<path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/>'); }
  function icoServer() { return svg('<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>'); }
  function icoSigma() { return svg('<path d="M18 5H7l6 7-6 7h11"/>'); }
  function icoChat() { return svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>'); }
  function icoBriefcase() { return svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>'); }
  function icoBook() { return svg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>'); }
  function icoCloud() { return svg('<path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.3 9.5 4 4 0 0 0 7 17.5"/><path d="M8 17h9.5"/>', 13); }
  function icoMoon() { return svg('<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>'); }
  function icoSun() { return svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>'); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

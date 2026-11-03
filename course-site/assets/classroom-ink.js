/* ECTE471 Ink Mode: Apple Pencil, pen and mouse annotations over the live page. */
(() => {
  let activeDialog = null;
  const surface = () => [...document.querySelectorAll('dialog[open]')].at(-1) || null;
  const contextId = () => {
    const d = surface();
    const title = d?.querySelector('h2')?.textContent || '';
    return `${location.pathname}${location.hash}${d ? '::'+d.id+'::'+title : ''}`;
  };
  let inkContext = contextId();
  let STORAGE_KEY = `ecte471-classroom-ink:${inkContext}:v1`;
  const scrollOffset = () => activeDialog ? activeDialog.scrollTop : window.scrollY;
  const canvas = document.createElement('canvas');
  canvas.className = 'ink-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'ink-launcher';
  launcher.setAttribute('aria-pressed', 'false');
  launcher.setAttribute('aria-label', 'Enter Ink Mode');
  launcher.innerHTML = '<span aria-hidden="true">✎</span><b>Ink</b>';
  document.body.appendChild(launcher);

  const toolbar = document.createElement('section');
  toolbar.className = 'ink-toolbar';
  toolbar.setAttribute('aria-label', 'Ink tools');
  toolbar.setAttribute('aria-hidden', 'true');
  toolbar.innerHTML = `
    <div class="ink-toolbar__mode"><strong>Ink Mode</strong><span>Apple Pencil writes · one finger scrolls</span></div>
    <div class="ink-tool-group" role="group" aria-label="Drawing tool">
      <button type="button" data-ink-tool="pen" class="is-active" aria-pressed="true">Pen</button>
      <button type="button" data-ink-tool="highlighter" aria-pressed="false">Highlight</button>
      <button type="button" data-ink-tool="eraser" aria-pressed="false">Eraser</button>
    </div>
    <div class="ink-colours" role="group" aria-label="Ink colour">
      <button type="button" class="ink-colour is-active" data-ink-colour="#155EEF" style="--swatch:#155EEF" aria-label="Blue" aria-pressed="true"></button>
      <button type="button" class="ink-colour" data-ink-colour="#D92D20" style="--swatch:#D92D20" aria-label="Red" aria-pressed="false"></button>
      <button type="button" class="ink-colour" data-ink-colour="#101828" style="--swatch:#101828" aria-label="Black" aria-pressed="false"></button>
      <button type="button" class="ink-colour" data-ink-colour="#067647" style="--swatch:#067647" aria-label="Green" aria-pressed="false"></button>
    </div>
    <div class="ink-tool-group" role="group" aria-label="Edit annotations">
      <button type="button" data-ink-action="undo" title="Undo (Command Z)" disabled>Undo</button>
      <button type="button" data-ink-action="redo" title="Redo (Shift Command Z)" disabled>Redo</button>
      <button type="button" data-ink-action="visibility" aria-pressed="true">Hide</button>
    </div>
    <details class="ink-more"><summary>More</summary><div>
      <button type="button" data-ink-action="export">Export notes</button>
      <button type="button" data-ink-action="import">Import notes</button>
      <button type="button" data-ink-action="clear" class="ink-danger">Clear page</button>
    </div></details>
    <button type="button" class="ink-done" data-ink-action="done">Done</button>
    <input class="ink-import" type="file" accept="application/json,.json" tabindex="-1" aria-hidden="true">
  `;
  document.body.appendChild(toolbar);

  const liveStatus = document.createElement('div');
  liveStatus.className = 'ink-status';
  liveStatus.setAttribute('role', 'status');
  liveStatus.setAttribute('aria-live', 'polite');
  document.body.appendChild(liveStatus);

  const context = canvas.getContext('2d');
  const state = { active: false, visible: true, drawing: false, tool: 'pen', colour: '#155EEF', strokes: [], redo: [], current: null };
  let statusTimer;
  let redrawFrame;

  function announce(message) {
    window.clearTimeout(statusTimer);
    liveStatus.textContent = message;
    liveStatus.classList.add('is-visible');
    statusTimer = window.setTimeout(() => liveStatus.classList.remove('is-visible'), 1800);
  }

  function updateCanvasSize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function applyStrokeStyle(stroke) {
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
    context.strokeStyle = stroke.colour;
    context.globalAlpha = stroke.tool === 'highlighter' ? 0.32 : 1;
    context.lineWidth = stroke.tool === 'eraser' ? 30 : stroke.tool === 'highlighter' ? 18 : 3.2;
  }

  function drawStroke(stroke) {
    if (!stroke?.points?.length) return;
    applyStrokeStyle(stroke);
    context.beginPath();
    const first = stroke.points[0];
    context.moveTo(first.x * window.innerWidth, first.y - scrollOffset());
    if (stroke.points.length === 1) context.lineTo(first.x * window.innerWidth + 0.01, first.y - scrollOffset() + 0.01);
    for (let index = 1; index < stroke.points.length; index += 1) {
      const point = stroke.points[index];
      context.lineTo(point.x * window.innerWidth, point.y - scrollOffset());
    }
    context.stroke();
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
  }

  function redraw() {
    updateCanvasSize();
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (state.visible) {
      state.strokes.forEach(drawStroke);
      drawStroke(state.current);
    }
  }

  function requestRedraw() {
    if (redrawFrame) return;
    redrawFrame = window.requestAnimationFrame(() => { redrawFrame = null; redraw(); });
  }

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, page: inkContext, savedAt: new Date().toISOString(), strokes: state.strokes }));
      announce('Ink saved on this device');
    } catch (_error) { announce('Ink could not be saved'); }
  }

  function load() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
      state.strokes = saved.version === 1 && Array.isArray(saved.strokes) ? saved.strokes : [];
    } catch (_error) { state.strokes = []; }
  }

  function updateButtons() {
    toolbar.querySelector('[data-ink-action="undo"]').disabled = state.strokes.length === 0;
    toolbar.querySelector('[data-ink-action="redo"]').disabled = state.redo.length === 0;
    const visibility = toolbar.querySelector('[data-ink-action="visibility"]');
    visibility.textContent = state.visible ? 'Hide' : 'Show';
    visibility.setAttribute('aria-pressed', String(state.visible));
  }

  function setTool(tool) {
    state.tool = tool;
    toolbar.querySelectorAll('[data-ink-tool]').forEach((button) => {
      const selected = button.dataset.inkTool === tool;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    canvas.classList.toggle('is-eraser', tool === 'eraser');
  }

  function setActive(active) {
    state.active = active;
    document.body.classList.toggle('ink-mode', active);
    launcher.classList.toggle('is-active', active);
    launcher.setAttribute('aria-pressed', String(active));
    launcher.setAttribute('aria-label', active ? 'Exit Ink Mode' : 'Enter Ink Mode');
    launcher.querySelector('b').textContent = active ? 'Drawing' : 'Ink';
    toolbar.setAttribute('aria-hidden', String(!active));
    if (active) {
      document.querySelectorAll('video').forEach((video) => video.pause());
      announce('Ink Mode on — use Apple Pencil to write');
    } else {
      state.drawing = false;
      state.current = null;
      announce('Ink Mode off — links and videos are active');
    }
    requestRedraw();
  }

  const pointerPoint = (event) => ({ x: event.clientX / Math.max(1, window.innerWidth), y: event.clientY + scrollOffset() });
  const canDraw = (event) => state.active && (event.pointerType === 'pen' || event.pointerType === 'mouse');

  canvas.addEventListener('pointerdown', (event) => {
    if (!canDraw(event) || event.button > 0) return;
    event.preventDefault();
    state.drawing = true;
    state.current = { tool: state.tool, colour: state.colour, points: [pointerPoint(event)] };
    canvas.setPointerCapture(event.pointerId);
    requestRedraw();
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!state.drawing || !state.current || !canDraw(event)) return;
    event.preventDefault();
    const coalesced = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [];
    const events = coalesced.length ? coalesced : [event];
    events.forEach((item) => state.current.points.push(pointerPoint(item)));
    requestRedraw();
  });
  function finishStroke(event) {
    if (!state.drawing || !state.current) return;
    if (event && canDraw(event)) state.current.points.push(pointerPoint(event));
    state.strokes.push(state.current);
    state.redo = [];
    state.current = null;
    state.drawing = false;
    updateButtons();
    requestRedraw();
    save();
  }
  canvas.addEventListener('pointerup', finishStroke);
  canvas.addEventListener('pointercancel', finishStroke);
  canvas.addEventListener('lostpointercapture', finishStroke);

  toolbar.addEventListener('click', (event) => {
    const toolButton = event.target.closest('[data-ink-tool]');
    if (toolButton) { setTool(toolButton.dataset.inkTool); return; }
    const colourButton = event.target.closest('[data-ink-colour]');
    if (colourButton) {
      state.colour = colourButton.dataset.inkColour;
      toolbar.querySelectorAll('[data-ink-colour]').forEach((button) => {
        const selected = button === colourButton;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      if (state.tool === 'eraser') setTool('pen');
      return;
    }
    const actionButton = event.target.closest('[data-ink-action]');
    if (!actionButton) return;
    const action = actionButton.dataset.inkAction;
    if (action === 'done') setActive(false);
    if (action === 'undo' && state.strokes.length) { state.redo.push(state.strokes.pop()); updateButtons(); requestRedraw(); save(); }
    if (action === 'redo' && state.redo.length) { state.strokes.push(state.redo.pop()); updateButtons(); requestRedraw(); save(); }
    if (action === 'visibility') { state.visible = !state.visible; updateButtons(); requestRedraw(); }
    if (action === 'clear' && state.strokes.length && window.confirm('Clear all ink from this page?')) { state.strokes = []; state.redo = []; updateButtons(); requestRedraw(); save(); }
    if (action === 'export') {
      const payload = JSON.stringify({ version: 1, page: inkContext, exportedAt: new Date().toISOString(), strokes: state.strokes }, null, 2);
      const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `ECTE471-ink-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      announce('Ink notes exported');
    }
    if (action === 'import') toolbar.querySelector('.ink-import').click();
  });

  toolbar.querySelector('.ink-import').addEventListener('change', async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      if (imported.version !== 1 || !Array.isArray(imported.strokes)) throw new Error('Invalid ink file');
      state.strokes = imported.strokes;
      state.redo = [];
      updateButtons(); requestRedraw(); save();
      announce('Ink notes imported');
    } catch (_error) { announce('This ink file could not be opened'); }
    event.target.value = '';
  });

  launcher.addEventListener('click', () => setActive(!state.active));
  window.addEventListener('scroll', requestRedraw, { passive: true });
  window.addEventListener('resize', requestRedraw, { passive: true });
  window.addEventListener('orientationchange', requestRedraw, { passive: true });
  document.querySelectorAll('details').forEach((details) => details.addEventListener('toggle', requestRedraw));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.active) { event.preventDefault(); event.stopImmediatePropagation(); setActive(false); return; }
    if (event.key === 'Escape' && state.active) setActive(false);
    if (!state.active || !(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'z') return;
    event.preventDefault();
    toolbar.querySelector(`[data-ink-action="${event.shiftKey ? 'redo' : 'undo'}"]`).click();
  });

  function syncSurface() {
    const nextContext = contextId();
    const nextDialog = surface();
    if (nextContext !== inkContext) {
      finishStroke();
      inkContext = nextContext;
      STORAGE_KEY = `ecte471-classroom-ink:${inkContext}:v1`;
      state.current = null; state.drawing = false; state.redo = [];
      load(); updateButtons();
      if (state.active) setActive(false);
    }
    activeDialog = nextDialog;
    const parent = nextDialog || document.fullscreenElement || document.querySelector('.frame-wide') || document.body;
    for (const el of [canvas, launcher, toolbar, liveStatus]) if (el.parentElement !== parent) parent.appendChild(el);
    requestRedraw();
  }
  let syncQueued = false;
  new MutationObserver(() => {
    if (syncQueued) return;
    syncQueued = true;
    queueMicrotask(() => { syncQueued = false; syncSurface(); });
  }).observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['open','class']});
  document.addEventListener('scroll', requestRedraw, {capture:true,passive:true});
  document.addEventListener('fullscreenchange', syncSurface);
  window.addEventListener('hashchange', syncSurface);
  document.addEventListener('cancel', e => {if(state.active){e.preventDefault();setActive(false);}},true);
  load(); updateButtons(); syncSurface();
})();

document.addEventListener("DOMContentLoaded", () => {
  const face = document.querySelector(".face");
  const glasses = document.getElementById("glasses");
  const thumbsWrap = document.getElementById("thumbnails");
  const thumbImgs = Array.from(thumbsWrap.querySelectorAll("img"));

  // Collect available frames from thumbnails
  const frames = thumbImgs.map(img => img.dataset.src);
  let currentIndex = 0;

  // ---- Persistence (per frame) ----
  const LS_KEY = "glassesPositionsV2";
  const positions = JSON.parse(localStorage.getItem(LS_KEY) || "{}");

  function saveCurrent() {
    const src = frames[currentIndex];
    positions[src] = {
      left: glasses.style.left || "140px",
      top:  glasses.style.top  || "160px",
      width: glasses.style.width || "280px"
    };
    localStorage.setItem(LS_KEY, JSON.stringify(positions));
  }

  function applyFor(src) {
    const p = positions[src];
    if (p) {
      glasses.style.left  = p.left;
      glasses.style.top   = p.top;
      glasses.style.width = p.width || glasses.style.width || "280px";
    } else {
      // Defaults tuned for the larger face image
      glasses.style.left  = "140px";
      glasses.style.top   = "160px";
      glasses.style.width = "280px";
    }
  }

  // ---- Frame switching (no transition) ----
  function setGlasses(src) {
    const idx = frames.indexOf(src);
    currentIndex = idx >= 0 ? idx : 0;
    glasses.src = src;
    applyFor(src);
    thumbImgs.forEach(t => t.classList.toggle("selected", t.dataset.src === src));
  }
  window.setGlasses = setGlasses; // for onclick in HTML (thumbnails)

  // Top arrows (prev/next frame)
  document.getElementById("framePrev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + frames.length) % frames.length;
    setGlasses(frames[currentIndex]);
  });
  document.getElementById("frameNext").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % frames.length;
    setGlasses(frames[currentIndex]);
  });

  // Gallery arrows (scroll only)
  document.getElementById("galleryPrev").addEventListener("click", () => {
    thumbsWrap.scrollBy({ left: -220, behavior: "smooth" });
  });
  document.getElementById("galleryNext").addEventListener("click", () => {
    thumbsWrap.scrollBy({ left:  220, behavior: "smooth" });
  });

  // Clicking a thumbnail selects that frame
  thumbImgs.forEach(img => {
    img.addEventListener("click", () => setGlasses(img.dataset.src));
  });

  // ---- Drag & Save (mouse + touch) ----
  let dragging = false, offsetX = 0, offsetY = 0;

  function startDrag(clientX, clientY) {
    dragging = true;
    // position relative to face container
    const rect = glasses.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
  }
  function doDrag(clientX, clientY) {
    if (!dragging) return;
    const parentRect = document.querySelector(".face-container").getBoundingClientRect();
    const newLeft = clientX - parentRect.left - offsetX;
    const newTop  = clientY - parentRect.top  - offsetY;
    glasses.style.left = Math.round(newLeft) + "px";
    glasses.style.top  = Math.round(newTop) + "px";
  }
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    saveCurrent(); // persist for this frame
  }

  // Mouse
  glasses.addEventListener("mousedown", e => { e.preventDefault(); startDrag(e.clientX, e.clientY); });
  document.addEventListener("mousemove", e => doDrag(e.clientX, e.clientY));
  document.addEventListener("mouseup", endDrag);

  // Touch
  glasses.addEventListener("touchstart", e => {
    const t = e.touches[0]; e.preventDefault(); startDrag(t.clientX, t.clientY);
  }, { passive: false });
  document.addEventListener("touchmove", e => {
    const t = e.touches[0]; if (!t) return; e.preventDefault(); doDrag(t.clientX, t.clientY);
  }, { passive: false });
  document.addEventListener("touchend", endDrag);

  // Optional: resize with mouse wheel (saves per frame)
  glasses.addEventListener("wheel", e => {
    e.preventDefault();
    const cur = parseFloat(getComputedStyle(glasses).width);
    const next = Math.max(80, cur + (e.deltaY < 0 ? 10 : -10)); // step 10px
    glasses.style.width = Math.round(next) + "px";
    saveCurrent();
  }, { passive: false });

  // Init
  setGlasses(frames[currentIndex]); // load first + apply saved position if any
});
document.addEventListener("DOMContentLoaded", () => {
  const glassesImg = document.getElementById("glasses");
  const thumbnails = document.querySelectorAll(".thumbnails img");

  // Store positions for each glasses image
  const glassesConfig = {
    "glasses1.png": { top: "30%", left: "50%", width: "40%" },
    "glasses2.png": { top: "30%", left: "50%", width: "40%" },
    "glasses3.png": { top: "30%", left: "50%", width: "40%" }
  };

  let activeGlasses = "glasses1.png";

  function applyConfig(src) {
    const config = glassesConfig[src];
    if (config) {
      glassesImg.style.top = config.top;
      glassesImg.style.left = config.left;
      glassesImg.style.width = config.width;
      glassesImg.style.transform = "translate(-50%, 0)";
    }
  }

  // Switch glasses
  window.setGlasses = function (src) {
    activeGlasses = src;
    glassesImg.src = src;
    applyConfig(src);

    // Update highlight
    thumbnails.forEach(thumb => thumb.classList.remove("selected"));
    const activeThumb = Array.from(thumbnails).find(thumb => thumb.src.includes(src));
    if (activeThumb) activeThumb.classList.add("selected");
  };

  // --- Dragging ---
  let isDragging = false;
  let startX, startY, startTop, startLeft;

  glassesImg.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startTop = glassesImg.offsetTop;
    startLeft = glassesImg.offsetLeft;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    glassesImg.style.top = startTop + dy + "px";
    glassesImg.style.left = startLeft + dx + "px";
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      // Save new position for this glasses
      glassesConfig[activeGlasses].top = glassesImg.style.top;
      glassesConfig[activeGlasses].left = glassesImg.style.left;
    }
    isDragging = false;
  });

  // --- Resizing with mouse wheel ---
  glassesImg.addEventListener("wheel", (e) => {
    e.preventDefault();
    let currentWidth = parseFloat(glassesImg.style.width);
    if (e.deltaY < 0) {
      currentWidth += 2; // zoom in
    } else {
      currentWidth -= 2; // zoom out
    }
    glassesImg.style.width = currentWidth + "%";

    // Save new size
    glassesConfig[activeGlasses].width = glassesImg.style.width;
  });

  // Default load
  setGlasses("glasses1.png");
});
document.addEventListener("DOMContentLoaded", () => {
  const glassesImg = document.getElementById("glasses");
  const thumbnails = document.querySelectorAll(".thumbnails img");

  // Store positions and sizes for each glasses image
  const glassesConfig = {
    "glasses1.png": { top: "160px", left: "140px", width: "250px" }, // bigger
    "glasses2.png": { top: "165px", left: "150px", width: "140px" }, // smaller
    "glasses3.png": { top: "158px", left: "145px", width: "100px" }  // medium
  };

  let activeGlasses = "glasses1.png";

  function applyConfig(src) {
    const config = glassesConfig[src];
    if (config) {
      glassesImg.style.top = config.top;
      glassesImg.style.left = config.left;
      glassesImg.style.width = config.width;
      glassesImg.style.transform = "translate(0, 0)";
    }
  }

  // Switch glasses
  window.setGlasses = function (src) {
    activeGlasses = src;
    glassesImg.src = src;
    applyConfig(src);

    // Update highlight
    thumbnails.forEach(thumb => thumb.classList.remove("selected"));
    const activeThumb = Array.from(thumbnails).find(thumb => thumb.src.includes(src));
    if (activeThumb) activeThumb.classList.add("selected");
  };

  // --- Dragging ---
  let isDragging = false;
  let startX, startY, startTop, startLeft;

  glassesImg.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startTop = glassesImg.offsetTop;
    startLeft = glassesImg.offsetLeft;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    glassesImg.style.top = startTop + dy + "px";
    glassesImg.style.left = startLeft + dx + "px";
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      // Save new position for this glasses
      glassesConfig[activeGlasses].top = glassesImg.style.top;
      glassesConfig[activeGlasses].left = glassesImg.style.left;
    }
    isDragging = false;
  });

  // --- Resizing with mouse wheel ---
  glassesImg.addEventListener("wheel", (e) => {
    e.preventDefault();
    let currentWidth = parseFloat(glassesImg.style.width);
    if (e.deltaY < 0) {
      currentWidth += 2; // zoom in
    } else {
      currentWidth -= 2; // zoom out
    }
    glassesImg.style.width = currentWidth + "%";

    // Save new size
    glassesConfig[activeGlasses].width = glassesImg.style.width;
  });

  // Default load
  setGlasses("glasses1.png");
});
document.addEventListener("DOMContentLoaded", () => {
  const glassesImg = document.getElementById("glasses");
  const thumbnails = document.querySelectorAll(".thumbnails img");
  const btnSmaller = document.getElementById("smaller");
  const btnBigger = document.getElementById("bigger");

  // Store positions and widths (width in pixels as a number)
  const glassesConfig = {
    "glasses1.png": { top: 160, left: 140, width: 280 }, // bigger
    "glasses2.png": { top: 165, left: 150, width: 180 }, // smaller
    "glasses3.png": { top: 158, left: 145, width: 220 }  // medium
  };

  let activeGlasses = "glasses1.png";

  function applyConfig(src) {
    const config = glassesConfig[src];
    if (config) {
      glassesImg.style.top = config.top + "px";
      glassesImg.style.left = config.left + "px";
      glassesImg.style.width = config.width + "px";
      glassesImg.style.transform = "translate(0, 0)";
    }
  }

  // Switch glasses
  window.setGlasses = function (src) {
    activeGlasses = src;
    glassesImg.src = src;
    applyConfig(src);

    // Update highlight
    thumbnails.forEach(thumb => thumb.classList.remove("selected"));
    const activeThumb = Array.from(thumbnails).find(thumb => thumb.src.includes(src));
    if (activeThumb) activeThumb.classList.add("selected");
  };

  // --- Dragging ---
  let isDragging = false;
  let startX, startY, startTop, startLeft;

  glassesImg.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startTop = glassesImg.offsetTop;
    startLeft = glassesImg.offsetLeft;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    glassesImg.style.top = startTop + dy + "px";
    glassesImg.style.left = startLeft + dx + "px";
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      // Save new position for this glasses
      glassesConfig[activeGlasses].top = parseInt(glassesImg.style.top);
      glassesConfig[activeGlasses].left = parseInt(glassesImg.style.left);
    }
    isDragging = false;
  });

  // --- Resize with + / - buttons ---
  function resizeGlasses(change) {
    let currentWidth = glassesConfig[activeGlasses].width;
    currentWidth += change;
    if (currentWidth < 50) currentWidth = 50; // minimum
    if (currentWidth > 600) currentWidth = 600; // maximum
    glassesConfig[activeGlasses].width = currentWidth;
    glassesImg.style.width = currentWidth + "px";
  }

  btnSmaller.addEventListener("click", () => resizeGlasses(-10));
  btnBigger.addEventListener("click", () => resizeGlasses(10));

  // Default load
  setGlasses("glasses1.png");
});












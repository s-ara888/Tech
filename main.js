document.addEventListener("DOMContentLoaded", () => {
  const faceImg = document.getElementById("face");
  const glassesImg = document.getElementById("glasses");
  const uploadInput = document.getElementById("uploadInput");
  const tryonArea = document.getElementById("tryonArea");
  const thumbnails = document.querySelectorAll(".thumbnails img");

  const defaultFaceSrc = faceImg.src;
  const defaultWidth = 400, defaultHeight = 500;

  // --- CONFIG for each glasses ---
  const glassesConfig = {
    "glasses1.png": { top: 160, left: "50%", width: 280 }, // big
    "glasses2.png": { top: 165, left: "50%", width: 180 }, // small
    "glasses3.png": { top: 158, left: "50%", width: 220 }  // medium
  };

  let activeGlasses = "glasses1.png";

  function applyConfig(src) {
    const config = glassesConfig[src];
    if (config) {
      glassesImg.src = src;
      glassesImg.style.top = config.top + "px";
      glassesImg.style.left = config.left;
      glassesImg.style.width = config.width + "px";
      glassesImg.style.transform = "translateX(-50%)"; // center horizontally
    }
  }

  // --- Switch Glasses ---
  window.setGlasses = function (src) {
    activeGlasses = src;
    applyConfig(src);

    thumbnails.forEach(thumb => thumb.classList.remove("selected"));
    const activeThumb = Array.from(thumbnails).find(thumb => thumb.dataset.frame === src);
    if (activeThumb) activeThumb.classList.add("selected");
  };

  // --- Upload Face ---
  uploadInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      faceImg.src = event.target.result;
      faceImg.style.width = defaultWidth + "px";
      faceImg.style.height = defaultHeight + "px";
      faceImg.style.top = "50%";
      faceImg.style.left = "50%";
      faceImg.style.transform = "translate(-50%, -50%)";
    };
    reader.readAsDataURL(file);
  });

  // --- Delete Face ---
  const deleteBtn = document.getElementById("deleteBtn");
  deleteBtn.addEventListener("click", () => {
    faceImg.src = defaultFaceSrc;
    faceImg.style.width = defaultWidth + "px";
    faceImg.style.height = defaultHeight + "px";
    faceImg.style.top = "50%";
    faceImg.style.left = "50%";
    faceImg.style.transform = "translate(-50%, -50%)";
    uploadInput.value = "";
  });

  // --- Resize Glasses (+/- buttons) ---
  document.getElementById("glassesPlus").addEventListener("click", () => {
    glassesConfig[activeGlasses].width += 10;
    glassesImg.style.width = glassesConfig[activeGlasses].width + "px";
  });
  document.getElementById("glassesMinus").addEventListener("click", () => {
    glassesConfig[activeGlasses].width = Math.max(50, glassesConfig[activeGlasses].width - 10);
    glassesImg.style.width = glassesConfig[activeGlasses].width + "px";
  });

  // --- Resize Face (+/- buttons) ---
  document.getElementById("facePlus").addEventListener("click", () => {
    resizeFace(1.1);
  });
  document.getElementById("faceMinus").addEventListener("click", () => {
    resizeFace(0.9);
  });

  function resizeFace(factor) {
    let currentWidth = parseFloat(faceImg.style.width);
    let currentHeight = parseFloat(faceImg.style.height);
    faceImg.style.width = currentWidth * factor + "px";
    faceImg.style.height = currentHeight * factor + "px";
  }

  // --- Drag Glasses ---
  let isDragging = false, startX, startY, startTop, startLeft;
  glassesImg.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startTop = glassesImg.offsetTop;
    startLeft = glassesImg.offsetLeft;
    e.preventDefault();
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    glassesImg.style.top = startTop + dy + "px";
    glassesImg.style.left = startLeft + dx + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    // Save updated pos
    glassesConfig[activeGlasses].top = parseInt(glassesImg.style.top);
    glassesConfig[activeGlasses].left = glassesImg.style.left;
  });

  // --- Init ---
  applyConfig(activeGlasses);
});












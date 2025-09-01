// =======================
// ELEMENTS
// =======================
const faceImg = document.getElementById("face");
const glassesImg = document.getElementById("glasses");
const uploadInput = document.getElementById("uploadInput");
const deletePhotoBtn = document.getElementById("deletePhoto");
const deleteModal = document.getElementById("deleteModal");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");
const smallerBtn = document.getElementById("smaller");
const largerBtn = document.getElementById("larger");
const glassesOptions = document.querySelectorAll(".glasses-option");
const message = document.getElementById("message");
const faceContainer = document.getElementById("faceContainer");

// =======================
// INITIAL SETUP
// =======================
window.addEventListener("DOMContentLoaded", () => {
  deleteModal.style.display = "none";
  deletePhotoBtn.style.display = "none";
  glassesImg.style.cursor = "grab";
  glassesImg.style.position = "absolute";
  // Center glasses initially
  glassesImg.style.left = (faceContainer.offsetWidth - glassesImg.offsetWidth) / 2 + "px";
  glassesImg.style.top = (faceContainer.offsetHeight - glassesImg.offsetHeight) / 2 + "px";
});

// =======================
// UPLOAD PHOTO
// =======================
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      faceImg.src = e.target.result;
      deletePhotoBtn.style.display = "inline-block";
      message.textContent = "";
      centerGlasses();
    };
    reader.readAsDataURL(file);
  }
});

// Center glasses function
function centerGlasses() {
  glassesImg.style.left = (faceContainer.offsetWidth - glassesImg.offsetWidth) / 2 + "px";
  glassesImg.style.top = (faceContainer.offsetHeight - glassesImg.offsetHeight) / 2 + "px";
}

// =======================
// DELETE PHOTO
// =======================
deletePhotoBtn.addEventListener("click", () => {
  deleteModal.style.display = "flex";
});

confirmDelete.addEventListener("click", () => {
  faceImg.src = "face.png";
  deletePhotoBtn.style.display = "none";
  deleteModal.style.display = "none";
  message.textContent = "Photo deleted!";
});

cancelDelete.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

// =======================
// GLASSES SIZE CONTROL
// =======================
let glassesWidth = 180; // default
smallerBtn.addEventListener("click", () => {
  resizeGlasses(-10);
});

largerBtn.addEventListener("click", () => {
  resizeGlasses(10);
});

function resizeGlasses(delta) {
  const containerRect = faceContainer.getBoundingClientRect();
  const currentLeft = parseFloat(glassesImg.style.left || 0);
  const currentTop = parseFloat(glassesImg.style.top || 0);
  const oldWidth = glassesImg.offsetWidth;
  const oldHeight = glassesImg.offsetHeight;
  
  glassesWidth = Math.min(400, Math.max(50, oldWidth + delta));
  const scale = glassesWidth / oldWidth;
  glassesImg.style.width = glassesWidth + "px";
  glassesImg.style.height = oldHeight * scale + "px";

  // Keep glasses centered relative to previous position
  let newLeft = currentLeft - ((glassesImg.offsetWidth - oldWidth) / 2);
  let newTop = currentTop - ((glassesImg.offsetHeight - oldHeight) / 2);

  // Keep inside container
  newLeft = Math.max(0, Math.min(newLeft, containerRect.width - glassesImg.offsetWidth));
  newTop = Math.max(0, Math.min(newTop, containerRect.height - glassesImg.offsetHeight));

  glassesImg.style.left = newLeft + "px";
  glassesImg.style.top = newTop + "px";
}

// =======================
// CHANGE GLASSES
// =======================
glassesOptions.forEach(option => {
  option.addEventListener("click", () => {
    glassesImg.src = option.dataset.frame;
    glassesOptions.forEach(opt => opt.classList.remove("active"));
    option.classList.add("active");
  });
});

// =======================
// DRAG & MOVE GLASSES (Smooth & Free with Margin)
// =======================
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
const margin = 50; // how far glasses can go outside the face container

function startDrag(clientX, clientY) {
  const rect = glassesImg.getBoundingClientRect();
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;
  isDragging = true;
}

function dragMove(clientX, clientY) {
  if (!isDragging) return;

  const containerRect = faceContainer.getBoundingClientRect();
  let newLeft = clientX - containerRect.left - offsetX;
  let newTop = clientY - containerRect.top - offsetY;

  // Constrain with margin outside the container
  newLeft = Math.max(-margin, Math.min(newLeft, containerRect.width - glassesImg.offsetWidth + margin));
  newTop = Math.max(-margin, Math.min(newTop, containerRect.height - glassesImg.offsetHeight + margin));

  glassesImg.style.left = newLeft + "px";
  glassesImg.style.top = newTop + "px";
}

function stopDrag() {
  isDragging = false;
  glassesImg.style.cursor = "grab";
}

// Mouse events
glassesImg.addEventListener("mousedown", (e) => {
  e.preventDefault();
  startDrag(e.clientX, e.clientY);
  glassesImg.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => dragMove(e.clientX, e.clientY));
document.addEventListener("mouseup", stopDrag);

// Touch events
glassesImg.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  startDrag(touch.clientX, touch.clientY);
});

document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  dragMove(touch.clientX, touch.clientY);
});
const limitedBtn = document.getElementById("limited-btn");
const techProduct = document.getElementById("tech-product");

limitedBtn.addEventListener("click", () => {
  techProduct.classList.toggle("active");
  limitedBtn.textContent = techProduct.classList.contains("active")
    ? "Close Limited Edition"
    : "Limited Edition";
});

// Carousel
const carouselImages = document.querySelectorAll(".carousel-img");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
let currentIndex = 0;

function showImage(index) {
  carouselImages.forEach(img => img.classList.remove("active"));
  carouselImages[index].classList.add("active");
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
  showImage(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % carouselImages.length;
  showImage(currentIndex);
});

// Show first image by default
showImage(currentIndex);







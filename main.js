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
      // Center glasses inside container
      glassesImg.style.left = (faceContainer.offsetWidth - glassesImg.offsetWidth) / 2 + "px";
      glassesImg.style.top = (faceContainer.offsetHeight - glassesImg.offsetHeight) / 2 + "px";
    };
    reader.readAsDataURL(file);
  }
});

// =======================
// DELETE PHOTO
// =======================
deletePhotoBtn.addEventListener("click", () => {
  deleteModal.style.display = "flex";
});

confirmDelete.addEventListener("click", () => {
  faceImg.src = "face.png"; // default image
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
  if (glassesWidth > 50) glassesWidth -= 10;
  glassesImg.style.width = glassesWidth + "px";
});

largerBtn.addEventListener("click", () => {
  if (glassesWidth < 400) glassesWidth += 10;
  glassesImg.style.width = glassesWidth + "px";
});

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
// DRAG AND MOVE GLASSES (CONSTRAINED TO FACE CONTAINER)
// =======================
let isDragging = false;
let offsetX, offsetY;

glassesImg.addEventListener("mousedown", (e) => {
  isDragging = true;
  const rect = glassesImg.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  glassesImg.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const containerRect = faceContainer.getBoundingClientRect();
  const glassesRect = glassesImg.getBoundingClientRect();

  let newLeft = e.clientX - containerRect.left - offsetX;
  let newTop = e.clientY - containerRect.top - offsetY;

  // Constrain within container
  newLeft = Math.max(0, Math.min(newLeft, containerRect.width - glassesRect.width));
  newTop = Math.max(0, Math.min(newTop, containerRect.height - glassesRect.height));

  glassesImg.style.left = newLeft + "px";
  glassesImg.style.top = newTop + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  glassesImg.style.cursor = "grab";
});


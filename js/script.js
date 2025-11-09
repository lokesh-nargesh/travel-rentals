// Floating "Book Now" button appears on scroll for mobile
window.addEventListener("scroll", () => {
  const btn = document.querySelector(".book-now");
  if (window.scrollY > 200) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
});

// Contact form (demo - no backend)
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thank you! Your message has been sent successfully.");
  e.target.reset();
});

// ===== Image Slider Logic =====
let slideIndex = 0;
let slides = document.querySelectorAll(".slider img");
let slider = document.querySelector(".slider");

function showSlide(index) {
  if (!slides.length) return;
  if (index >= slides.length) slideIndex = 0;
  else if (index < 0) slideIndex = slides.length - 1;
  slider.style.transform = `translateX(-${slideIndex * 100}%)`;
}

// Next & Prev Buttons
document.querySelector(".next")?.addEventListener("click", () => {
  slideIndex++;
  showSlide(slideIndex);
});
document.querySelector(".prev")?.addEventListener("click", () => {
  slideIndex--;
  showSlide(slideIndex);
});

// Auto Slide
setInterval(() => {
  slideIndex++;
  showSlide(slideIndex);
}, 4000); // change every 4 seconds

// Swipe (Touch) Support for mobile
let startX = 0;
slider?.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
slider?.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) {
    slideIndex++;
    showSlide(slideIndex);
  } else if (endX - startX > 50) {
    slideIndex--;
    showSlide(slideIndex);
  }
});

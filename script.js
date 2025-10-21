// Open the UPI link directly (works on mobile)
function openUPILink() {
  const upiLink = "upi://pay?pa=naniprasad49@ptyes&pn=Nani&am=49&cu=INR";
  window.location.href = upiLink;
}

// Optional subtle animation on scroll
window.addEventListener("scroll", () => {
  const reveals = document.querySelectorAll(".fade-in, .slide-up");
  reveals.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < window.innerHeight - 100) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
});

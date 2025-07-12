// Animate sections on scroll
function revealOnScroll() {
  const fadeEls = document.querySelectorAll('.motion-fade');
  const popEls = document.querySelectorAll('.motion-pop');
  const reveal = (el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  };
  fadeEls.forEach(reveal);
  popEls.forEach(reveal);
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(revealOnScroll, 100);
});

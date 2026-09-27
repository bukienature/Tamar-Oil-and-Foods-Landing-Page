/*
  Tamar Oil and Foods page interactions.
  GSAP and ScrollTrigger are loaded from CDN in index.html.
*/

(() => {
  // Keep the footer's copyright year current.
  const yearLabel = document.getElementById("year");
  if (yearLabel) {
    yearLabel.textContent = new Date().getFullYear();
  }

  // Leave content visible and skip all GSAP motion for reduced-motion users.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // If the CDN is unavailable, the default page content remains usable.
  if (!window.gsap || !window.ScrollTrigger) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Fade and slide each marked section in, then reverse it when scrolling up.
  const revealElements = gsap.utils.toArray(".reveal");

  revealElements.forEach((element) => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: 26 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 84%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  });

  // Stagger the feature cards and reverse the stagger on upward scrolling.
  gsap.fromTo(
    ".feature-card",
    { autoAlpha: 0, y: 24 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.65,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".feature-grid",
        start: "top 84%",
        toggleActions: "play reverse play reverse",
      },
    }
  );

  /*
    TODO: Enable the separate cap lift after adding matching transparent assets:
    assets/bottle-body.png and assets/bottle-cap.png. The current hero uses a
    complete bottle photo, and the supplied close-up cap does not align to it.
  */
  const bottleStage = document.querySelector(".bottle-stage");
  if (!bottleStage) {
    return;
  }

  // Skip 3D rotation on mobile for smoother performance on smaller devices.
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  // Scrub a subtle scale and tilt as the hero section scrolls away.
  const bottleTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  bottleTimeline.to(
    ".bottle-body",
    {
      scale: isMobile ? 1.04 : 1.08,
      rotateY: isMobile ? 0 : 12,
      rotateZ: isMobile ? 0 : -2,
      transformPerspective: 800,
      transformOrigin: "50% 65%",
      ease: "none",
    },
    0
  );
})();

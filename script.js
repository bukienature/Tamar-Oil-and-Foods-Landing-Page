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

  // Opt in to hidden animation start states only when GSAP is ready.
  // Without JavaScript, without GSAP, or with reduced motion enabled, content
  // stays visible using the default CSS state.
  document.documentElement.classList.add("gsap-ready");

  gsap.registerPlugin(ScrollTrigger);

  // Fade and slide each marked section in, then reverse it on scroll-up.
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

  // Stagger feature cards; reverse the stagger on upward scrolling.
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
    Rebuild the bottle tween when the viewport crosses 768px. matchMedia
    reverts the old animation before activating the new layout's animation.
  */
  ScrollTrigger.matchMedia({
    // Desktop bottle tilt: mild scale and 3D rotation.
    "(min-width: 768px)": function () {
      const bottle = document.querySelector(".bottle-body");
      if (!bottle) return;

      gsap.to(bottle, {
        scale: 1.08,
        rotateY: 12,
        rotateZ: -2,
        transformPerspective: 800,
        transformOrigin: "50% 65%",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },

    // Mobile bottle motion: scale and translate only, with no 3D rotation.
    "(max-width: 767px)": function () {
      const bottle = document.querySelector(".bottle-body");
      if (!bottle) return;

      gsap.to(bottle, {
        scale: 1.04,
        rotateY: 0,
        rotateZ: 0,
        transformOrigin: "50% 65%",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
  });

  // Debounce resize refreshes so they run after the layout settles.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });

  // Recalculate trigger positions after fonts, images, and other assets load.
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();

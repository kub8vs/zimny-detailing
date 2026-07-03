/* ============================================================
   ZIMNY DETAILING — cinematic experience
   Vanilla JS + GSAP ScrollTrigger + Lenis smooth scroll.
   Organized as small init modules invoked from boot().
   ============================================================ */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis = null;

  /* ------------------------------------------------------------
     Boot
  ------------------------------------------------------------ */
  function boot() {
    if (!window.gsap) { showEverythingStatic(); return; }
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      initStaticExperience();
      initNav();
      initForm();
      return;
    }

    initSmoothScroll();
    initNav();
    splitHeroTitle();
    initDust();
    initIdleBreathing();
    initCinema();
    initReveals();
    initMagneticButtons();
    initForm();
    initPreloader(); // last: kicks off the intro when done
  }

  /* ------------------------------------------------------------
     Fallback when JS runs but GSAP failed to load
  ------------------------------------------------------------ */
  function showEverythingStatic() {
    document.documentElement.classList.add('no-js');
    var pre = document.getElementById('preloader');
    if (pre) pre.style.display = 'none';
  }

  /* ------------------------------------------------------------
     Static experience for prefers-reduced-motion
  ------------------------------------------------------------ */
  function initStaticExperience() {
    var pre = document.getElementById('preloader');
    if (pre) pre.style.display = 'none';
    gsap.set('.car-view', { xPercent: -50, yPercent: -50 });
    gsap.set('#view-side, #view-rear', { autoAlpha: 0 });
    gsap.set('.reveal', { clearProps: 'all', opacity: 1, y: 0 });
    gsap.set('#chapters, .seq-copy', { display: 'none' });
  }

  /* ------------------------------------------------------------
     Lenis smooth scroll wired into GSAP's ticker
  ------------------------------------------------------------ */
  function initSmoothScroll() {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
    });
    lenis.stop(); // released after the preloader
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.ZD = { lenis: lenis }; // small public handle (also used by e2e checks)
  }

  /* ------------------------------------------------------------
     Navigation: glass on scroll + smooth anchors
  ------------------------------------------------------------ */
  function initNav() {
    var nav = document.getElementById('site-nav');

    function onScroll(y) { nav.classList.toggle('is-scrolled', y > 40); }
    if (lenis) lenis.on('scroll', function (e) { onScroll(e.scroll); });
    else window.addEventListener('scroll', function () { onScroll(window.scrollY); }, { passive: true });

    document.querySelectorAll('.nav-anchor').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        ev.preventDefault();
        if (lenis) lenis.scrollTo(target, { duration: 1.6 });
        else target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ------------------------------------------------------------
     Split the hero title into animatable characters
  ------------------------------------------------------------ */
  function splitHeroTitle() {
    ['hero-title', 'preloader-word'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach(function (word, wi) {
        var w = document.createElement('span');
        w.className = 'word';
        Array.prototype.forEach.call(word, function (ch) {
          var span = document.createElement('span');
          span.className = 'char';
          span.textContent = ch;
          w.appendChild(span);
        });
        el.appendChild(w);
        if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  }

  /* ------------------------------------------------------------
     Floating dust particles for the studio finale
  ------------------------------------------------------------ */
  function initDust() {
    var wrap = document.getElementById('dust');
    if (!wrap) return;
    for (var i = 0; i < 16; i++) {
      var p = document.createElement('i');
      var x = 8 + Math.random() * 84;
      var y = 18 + Math.random() * 60;
      var s = 0.4 + Math.random() * 1.1;
      p.style.left = x + '%';
      p.style.top = y + '%';
      p.style.transform = 'scale(' + s + ')';
      p.style.opacity = String(0.25 + Math.random() * 0.5);
      wrap.appendChild(p);
      gsap.to(p, {
        y: -30 - Math.random() * 50,
        x: (Math.random() - 0.5) * 60,
        duration: 6 + Math.random() * 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * -12,
      });
    }
  }

  /* ------------------------------------------------------------
     Gentle idle "breathing" of the car (independent from scrub)
  ------------------------------------------------------------ */
  function initIdleBreathing() {
    gsap.to('#rig-idle', { y: 7, duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }

  /* ------------------------------------------------------------
     THE CINEMATIC SCROLL EXPERIENCE
     One master scrubbed timeline, pinned on #stage.
  ------------------------------------------------------------ */
  function initCinema() {
    var mm = gsap.matchMedia();

    mm.add(
      {
        desktop: '(min-width: 768px)',
        mobile: '(max-width: 767px)',
      },
      function (ctx) {
        var isMobile = ctx.conditions.mobile;

        // camera settings tuned per breakpoint
        var cam = isMobile
          ? { doorZoom: 2.3, doorX: -8, doorY: 4, baZoom: 2.6, baX: 50, baY: 3, trunkZoom: 1.75, trunkY: 2 }
          : { doorZoom: 1.55, doorX: -12, doorY: 6, baZoom: 1.75, baX: 22, baY: 4, trunkZoom: 1.42, trunkY: 2 };

        // --- initial states ---------------------------------------
        gsap.set('.car-view', { xPercent: -50, yPercent: -50 });
        gsap.set('#view-side, #view-rear', { autoAlpha: 0 });
        gsap.set('#seq-1, #seq-2, #seq-3, #seq-4', { autoAlpha: 0 });
        gsap.set('#sv-ba', { opacity: 0 });
        gsap.set('#sv-ba-divider', { x: 690 });
        gsap.set('#sv-ba-dirtyrect', { attr: { width: 450 } });
        gsap.set('#sv-sheen', { x: -900, opacity: 0 });
        gsap.set('#chapters', { autoAlpha: 0 });

        var chapters = gsap.utils.toArray('.chapter');
        function setChapter(n) {
          chapters.forEach(function (c, i) { c.classList.toggle('is-active', i === n - 1); });
        }

        var tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: '#stage',
            start: 'top top',
            end: '+=5600',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
              var p = self.progress;
              if (p < 0.115) setChapter(0);
              else if (p < 0.3) setChapter(1);
              else if (p < 0.52) setChapter(2);
              else if (p < 0.74) setChapter(3);
              else setChapter(4);
            },
          },
        });

        /* ===== PHASE A — hero dissolves, orbit to the side [0..3] ===== */
        tl.to('#hero-copy', { autoAlpha: 0, y: -70, scale: 0.96, duration: 1.1, ease: 'power2.in' }, 0)
          .to('#scroll-hint', { autoAlpha: 0, duration: 0.5 }, 0)
          .to('#view-front', { scale: 1.24, duration: 2.0 }, 0)
          .to('#chapters', { autoAlpha: 1, duration: 0.6 }, 0.8)
          .to('#view-front', { autoAlpha: 0, scaleX: 0.72, scale: 1.3, duration: 1.0, ease: 'power2.in' }, 1.4)
          .fromTo('#view-side',
            { autoAlpha: 0, scaleX: 0.74, scale: 1.06, x: '6%' },
            { autoAlpha: 1, scaleX: 1, scale: 1, x: '0%', duration: 1.4, ease: 'power2.out' }, 2.0);

        /* ===== PHASE B — SEQ 1: the front door opens [3..8] ===== */
        tl.to('#rig-cam', { scale: cam.doorZoom, xPercent: cam.doorX, yPercent: cam.doorY, duration: 1.6 }, 3.0)
          .to('#sv-door', { scaleX: 0.13, svgOrigin: '1082 380', duration: 1.9 }, 3.7)
          .to('#sv-door-shade', { opacity: 0.6, duration: 1.4 }, 3.8)
          .to('#sv-dooredge', { opacity: 0.9, duration: 0.9 }, 4.0)
          .to('#sv-doorshadow', { opacity: 0.5, duration: 1.2 }, 3.9)
          .to('#sv-puddle', { opacity: 1, duration: 1.4 }, 4.0)
          .to('#sv-cabin-glow', { opacity: 1, duration: 1.4 }, 4.0)
          .fromTo('#seq-1', { autoAlpha: 0, x: -46 }, { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power2.out' }, 4.4)
          .to('#seq-1', { autoAlpha: 0, x: -24, duration: 0.7, ease: 'power2.in' }, 7.1);

        /* ===== PHASE C — door closes, pan to the rear door: SEQ 2 [8..13.5] ===== */
        tl.to('#sv-door', { scaleX: 1, svgOrigin: '1082 380', duration: 1.2 }, 8.0)
          .to('#sv-door-shade', { opacity: 0, duration: 0.9 }, 8.0)
          .to('#sv-dooredge', { opacity: 0, duration: 0.6 }, 8.0)
          .to('#sv-doorshadow, #sv-puddle', { opacity: 0, duration: 0.8 }, 8.0)
          .to('#sv-cabin-glow', { opacity: 0.5, duration: 0.8 }, 8.0)
          .to('#rig-cam', { scale: cam.baZoom, xPercent: cam.baX, yPercent: cam.baY, duration: 1.7 }, 8.6)
          .to('#sv-ba', { opacity: 1, duration: 0.5 }, 9.7)
          .fromTo('#seq-2', { autoAlpha: 0, x: 46 }, { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power2.out' }, 9.9)
          .to('#sv-ba-divider', { x: 254, duration: 2.6, ease: 'power1.inOut' }, 10.2)
          .to('#sv-ba-dirtyrect', { attr: { width: 14 }, duration: 2.6, ease: 'power1.inOut' }, 10.2)
          .to('#sv-ba-spark', { keyframes: [
              { scale: 1.4, opacity: 0.95, duration: 0.55 },
              { scale: 0.7, opacity: 0.4, duration: 0.5 },
              { scale: 1.25, opacity: 0.9, duration: 0.6 },
              { scale: 0.9, opacity: 0, duration: 0.7 },
            ], svgOrigin: '0 328' }, 10.4)
          .to('#sv-ba', { opacity: 0, duration: 0.6 }, 13.0)
          .to('#seq-2', { autoAlpha: 0, x: 24, duration: 0.7, ease: 'power2.in' }, 13.0);

        /* ===== PHASE D — orbit to the rear, the trunk pops open: SEQ 3 [13.5..19] ===== */
        tl.to('#rig-cam', { scale: 1.12, xPercent: 0, yPercent: 0, duration: 1.1 }, 13.6)
          .to('#view-side', { autoAlpha: 0, scaleX: 0.66, x: '-5%', duration: 1.0, ease: 'power2.in' }, 14.2)
          .fromTo('#view-rear',
            { autoAlpha: 0, scaleX: 0.68, scale: 1.05, x: '4%' },
            { autoAlpha: 1, scaleX: 1, scale: 1, x: '0%', duration: 1.2, ease: 'power2.out' }, 14.9)
          .to('#rig-cam', { scale: cam.trunkZoom, yPercent: cam.trunkY, duration: 1.4 }, 15.6)
          .to('#rv-lid', { scaleY: 0.16, y: -10, svgOrigin: '620 300', duration: 1.7 }, 16.0)
          .to('#rv-lid-open', { opacity: 1, duration: 0.9 }, 16.7)
          .fromTo('#seq-3', { autoAlpha: 0, x: -46 }, { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power2.out' }, 16.6)
          .to('#seq-3', { autoAlpha: 0, x: -24, duration: 0.7, ease: 'power2.in' }, 18.6);

        /* ===== PHASE E — full reveal under studio lights: SEQ 4 [19..26] ===== */
        tl.to('#rv-lid-open', { opacity: 0, duration: 0.6 }, 19.3)
          .to('#rv-lid', { scaleY: 1, y: 0, svgOrigin: '620 300', duration: 1.0 }, 19.5)
          .to('#rig-cam', { scale: 1, xPercent: 0, yPercent: 0, duration: 1.4 }, 20.2)
          .to('#view-rear', { autoAlpha: 0, scaleX: 0.7, scale: 1.08, duration: 0.7, ease: 'power2.in' }, 20.5)
          .fromTo('#view-side',
            { autoAlpha: 0, scaleX: 1.26, scale: 1.12, x: '0%' },
            { autoAlpha: 1, scaleX: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 21.3)
          .to('#sv-keylight', { opacity: 0.5, duration: 1.6 }, 21.8)
          .to('#sv-reflection', { opacity: 0.46, duration: 1.6 }, 21.8)
          .to('#studio-lights', { opacity: 1, duration: 1.6 }, 21.6)
          .fromTo('.light-cone', { scaleY: 0 }, { scaleY: 1, duration: 1.4, stagger: 0.15, ease: 'power2.out' }, 21.6)
          .to('#dust', { opacity: 1, duration: 1.5 }, 22.0)
          .to('#sv-sheen', { opacity: 0.7, duration: 0.5 }, 22.4)
          .to('#sv-sheen', { x: 1500, duration: 2.6, ease: 'power1.inOut' }, 22.4)
          .to('#sv-headglow', { opacity: 0.85, duration: 1.2 }, 22.8)
          .fromTo('#seq-4', { autoAlpha: 0, scale: 0.94, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 22.6)
          .to('#seq-4', { autoAlpha: 0, y: -18, duration: 0.8, ease: 'power2.in' }, 25.4)
          .to('#chapters', { autoAlpha: 0, duration: 0.6 }, 25.6)
          .to({}, { duration: 0.6 }); // settle beat at the end

        return function () { setChapter(0); };
      }
    );
  }

  /* ------------------------------------------------------------
     Scroll reveals for the sections below the stage
  ------------------------------------------------------------ */
  function initReveals() {
    gsap.utils.toArray('.reveal').forEach(function (el) {
      var d = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
      gsap.fromTo(el,
        { autoAlpha: 0, y: 46 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          delay: d * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
    });
  }

  /* ------------------------------------------------------------
     Subtle magnetic hover on primary buttons
  ------------------------------------------------------------ */
  function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.querySelectorAll('.btn-ice, .btn-ghost').forEach(function (btn) {
      var setX = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
      var setY = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        setX((e.clientX - r.left - r.width / 2) * 0.18);
        setY((e.clientY - r.top - r.height / 2) * 0.3);
      });
      btn.addEventListener('mouseleave', function () { setX(0); setY(0); });
    });
  }

  /* ------------------------------------------------------------
     Concierge booking form (front-end demo behaviour)
  ------------------------------------------------------------ */
  function initForm() {
    var form = document.getElementById('booking-form');
    if (!form) return;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (document.getElementById('f-company').value) return; // honeypot

      var invalid = [];
      ['f-name', 'f-phone', 'f-car', 'f-service'].forEach(function (id) {
        var el = document.getElementById(id);
        var bad = !el.value || (el.tagName === 'SELECT' && !el.value);
        el.style.borderColor = bad ? 'rgba(255, 92, 112, 0.75)' : '';
        if (bad) invalid.push(el);
      });

      if (invalid.length) {
        if (window.gsap) {
          gsap.fromTo(form, { x: 0 }, { keyframes: [{ x: -7 }, { x: 7 }, { x: -4 }, { x: 4 }, { x: 0 }], duration: 0.4, ease: 'power2.out' });
        }
        invalid[0].focus();
        return;
      }

      var success = document.getElementById('form-success');
      success.classList.add('is-visible');
      if (window.gsap) {
        var check = document.getElementById('success-check');
        var len = check.getTotalLength();
        gsap.set(check, { strokeDasharray: len, strokeDashoffset: len });
        gsap.fromTo(success, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' });
        gsap.fromTo('.success-ring', { scale: 0.6 }, { scale: 1, duration: 0.7, ease: 'back.out(2)', delay: 0.1 });
        gsap.to(check, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut', delay: 0.35 });
      }
      form.reset();
    });
  }

  /* ------------------------------------------------------------
     Preloader → hero intro
  ------------------------------------------------------------ */
  function initPreloader() {
    var pre = document.getElementById('preloader');

    var tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo('#preloader-word .char',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.028, ease: 'power2.out' }, 0)
      .fromTo('#preloader-fill', { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power2.inOut' }, 0.1)
      .to(pre, {
        yPercent: -100,
        duration: 0.85,
        ease: 'expo.inOut',
        onComplete: function () { pre.style.display = 'none'; },
      }, 1.35)
      .add(heroIntro, 1.5);
  }

  function heroIntro() {
    if (lenis) lenis.start();

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // the car arrives
    tl.fromTo('#front-inner', { autoAlpha: 0, scale: 0.9, y: 46 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.5, ease: 'power2.out' }, 0);

    // headlight double-flash, then steady icy glow
    var lights = ['#fv-glowL', '#fv-glowR', '#fv-beamL', '#fv-beamR', '#fv-drlL', '#fv-drlR', '#fv-projL', '#fv-projR'];
    tl.set(lights.join(','), { opacity: 0 }, 0)
      .to(lights.join(','), {
        keyframes: [
          { opacity: 0.95, duration: 0.09 },
          { opacity: 0.12, duration: 0.08 },
          { opacity: 1, duration: 0.1 },
          { opacity: 0.35, duration: 0.12 },
          { opacity: 1, duration: 0.4 },
        ],
      }, 0.75);

    // typography choreography
    tl.fromTo('#hero-kicker', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.5)
      .fromTo('#hero-title .char',
        { autoAlpha: 0, y: 60, rotateX: -55 },
        { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.034, ease: 'power3.out' }, 0.62)
      .fromTo('#hero-sub', { autoAlpha: 0, letterSpacing: '0.55em' }, { autoAlpha: 1, letterSpacing: '0.34em', duration: 1.1 }, 1.25)
      .fromTo('#hero-cta > *', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.5)
      .fromTo('#hint-inner', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.9);
  }

  /* ------------------------------------------------------------ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

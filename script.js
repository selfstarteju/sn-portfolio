/* ==========================================================================
   SN CINEMATIC - PREMIUM INTERACTIVE OVERHAUL
   Awwwards Horizontal Scroll + Cursor Physics + Live Timecodes
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Select DOM Elements ---
    const loaderOverlay = document.getElementById('loader-overlay');
    const loaderProgress = document.getElementById('loader-progress');
    const loaderNum = document.getElementById('loader-num');
    const customCursor = document.getElementById('custom-cursor');
    const cursorDot = customCursor.querySelector('.cursor-dot');
    const cursorRing = customCursor.querySelector('.cursor-ring');
    const cursorText = customCursor.querySelector('.cursor-text');
    const mouseGlow = document.getElementById('mouse-glow');
    const mainHeader = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Horizontal Scroll Elements
    const horizTrack = document.getElementById('horizontal-scroll-track');
    const horizPinWrap = document.getElementById('horizontal-scroll-pin-wrap');
    const slideCards = document.querySelectorAll('.horizontal-slide-card');

    // Cinematic Lightbox Modal Elements
    const cinematicModal = document.getElementById('cinematic-modal');
    const modalVideo = document.getElementById('modal-video');
    const modalTitle = document.getElementById('modal-title');
    const modalClient = document.getElementById('modal-client');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.getElementById('modal-close');
    const showreelPlayBtn = document.getElementById('showreel-play-btn');

    // Testimonial Elements
    const testimonialsTrack = document.getElementById('testimonials-track');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const sliderPrev = document.getElementById('slider-prev');
    const sliderNext = document.getElementById('slider-next');
    const sliderDotsContainer = document.getElementById('slider-dots');

    // Forms
    const contactForm = document.getElementById('cinematic-contact-form');
    const newsletterForm = document.getElementById('newsletter-form');

    let isLoaderDone = false;

    /* ==========================================================================
       1. LUXURIOUS COUNTER PROGRESS LOADING SCREEN
       ========================================================================== */
    let loadPercentage = 0;
    const loaderInterval = setInterval(() => {
        if (loadPercentage < 100) {
            loadPercentage += Math.floor(Math.random() * 5) + 1;
            if (loadPercentage > 100) loadPercentage = 100;
            
            // Sync loader elements
            loaderProgress.style.width = `${loadPercentage}%`;
            loaderNum.textContent = `${loadPercentage}%`;
        }

        if (loadPercentage >= 100) {
            clearInterval(loaderInterval);
            finishLoading();
        }
    }, 60);

    // Fallback load safety
    window.addEventListener('load', () => {
        if (loadPercentage < 100) {
            clearInterval(loaderInterval);
            loadPercentage = 100;
            loaderProgress.style.width = '100%';
            loaderNum.textContent = '100%';
            finishLoading();
        }
    });

    function finishLoading() {
        if (isLoaderDone) return;
        isLoaderDone = true;

        setTimeout(() => {
            // Animate Loader Panel upwards
            gsap.to(loaderOverlay, {
                y: '-100%',
                duration: 1.4,
                ease: 'power4.inOut',
                onComplete: () => {
                    loaderOverlay.style.display = 'none';
                    // Trigger Hero text reveal after curtain exits
                    revealHeroText();
                }
            });
        }, 600);
    }


    /* ==========================================================================
       2. LENIS SMOOTH SCROLLING & GSAP SYNCHRONIZATION
       ========================================================================== */
    let lenis;
    try {
        lenis = new Lenis({
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            mouseMultiplier: 0.95,
            smoothTouch: false
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    } catch (e) {
        console.warn("Lenis initialization skipped. Browser utilizing default scroll frameworks.", e);
    }


    /* ==========================================================================
       3. CUSTOM MOUSE CURSOR & AMBIENT GLOW DYNAMICS
       ========================================================================== */
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Soft background ambient glow follower
        gsap.to(mouseGlow, {
            x: mouseX,
            y: mouseY,
            duration: 0.9,
            ease: 'power3.out'
        });
    });

    // Spring interpolation loop for smooth cursor tracking
    function updateCursorPosition() {
        cursorX += (mouseX - cursorX) * 0.28;
        cursorY += (mouseY - cursorY) * 0.28;

        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;

        cursorDot.style.left = `${cursorX}px`;
        cursorDot.style.top = `${cursorY}px`;

        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;

        cursorText.style.left = `${ringX}px`;
        cursorText.style.top = `${ringY}px`;

        requestAnimationFrame(updateCursorPosition);
    }
    requestAnimationFrame(updateCursorPosition);

    // Apply cursor interactions
    const applyCursorListeners = () => {
        // Standard interactive states (buttons, links, inputs)
        const interactiveElements = document.querySelectorAll('a, button, select, input, textarea, .slider-arrow');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('hovered');
            });
        });

        // VIEW text cursor hover on horizontal cards
        slideCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                customCursor.classList.add('clickable');
                cursorText.textContent = "VIEW";
            });
            card.addEventListener('mouseleave', () => {
                customCursor.classList.remove('clickable');
            });
        });

        // PLAY text cursor hover on the main showreel pulsing play trigger
        if (showreelPlayBtn) {
            showreelPlayBtn.addEventListener('mouseenter', () => {
                customCursor.classList.add('clickable');
                cursorText.textContent = "PLAY";
            });
            showreelPlayBtn.addEventListener('mouseleave', () => {
                customCursor.classList.remove('clickable');
            });
        }
    };


    /* ==========================================================================
       4. PHYSICS-BASED MAGNETIC BUTTONS AND CURSOR FUSION
       ========================================================================== */
    const applyMagneticPhysics = () => {
        const magnets = document.querySelectorAll('.magnet-target');
        
        magnets.forEach(target => {
            target.addEventListener('mousemove', (e) => {
                const rect = target.getBoundingClientRect();
                // Button absolute center coordinates
                const buttonCenterX = rect.left + rect.width / 2;
                const buttonCenterY = rect.top + rect.height / 2;

                // Distance offsets from mouse to button center
                const deltaX = e.clientX - buttonCenterX;
                const deltaY = e.clientY - buttonCenterY;

                // Pull the target towards mouse (magnetic pull coefficient 0.38)
                gsap.to(target, {
                    x: deltaX * 0.38,
                    y: deltaY * 0.38,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                // Blend/fuse custom cursor dot slightly toward button center
                gsap.to(cursorDot, {
                    x: deltaX * 0.15,
                    y: deltaY * 0.15,
                    scale: 0.6,
                    duration: 0.2
                });
            });

            target.addEventListener('mouseleave', () => {
                // Snap button back with elastic spring physics
                gsap.to(target, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1.1, 0.4)'
                });

                // Restore cursor dot to default state
                gsap.to(cursorDot, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.3
                });
            });
        });
    };


    /* ==========================================================================
       5. SMPTE TIMECODE LOOP FOR FILM VIEWFINDERS (24FPS Ticks)
       ========================================================================== */
    let frames = 0, seconds = 0, minutes = 0, hours = 0;
    
    function updateSMTETimecode() {
        frames++;
        if (frames >= 24) {
            frames = 0;
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }
        }

        // Format into 00:00:00:00 structure
        const formatted = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0'),
            frames.toString().padStart(2, '0')
        ].join(':');

        const heroTimecode = document.getElementById('hero-timecode');
        const showreelTimecode = document.getElementById('showreel-timecode');

        if (heroTimecode) heroTimecode.textContent = formatted;
        if (showreelTimecode) showreelTimecode.textContent = formatted;

        // Loop dynamic updates
        setTimeout(updateSMTETimecode, 1000 / 24); // 24 frames per second
    }
    updateSMTETimecode();


    /* ==========================================================================
       6. GSAP SCROLLTIMELINE & HORIZONTAL SCROLL ENGINES
       ========================================================================== */
    
    // Scrolled header background opacity trigger
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // 6.1 Hero Text Revealer
    function revealHeroText() {
        const tl = gsap.timeline();

        tl.to('.hero-badge', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
        .to('.hero-heading span', {
            y: 0,
            duration: 1.3,
            stagger: 0.2,
            ease: 'power4.out'
        }, '-=0.5')
        .to('.hero-subheading', {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out'
        }, '-=0.9')
        .to('.hero-buttons', {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out'
        }, '-=0.8')
        .to('.social-proof-banner', {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            onComplete: () => {
                triggerProofCounter();
            }
        }, '-=0.7');
    }

    // 6.2 Horizontal Scrolling Track & General Reveals
    const registerScrollTriggers = () => {
        if (!window.ScrollTrigger) return;

        // Netflix Headline Mask reveals triggers
        const textMasks = document.querySelectorAll('.title-reveal');
        textMasks.forEach(mask => {
            gsap.to(mask.querySelectorAll('span'), {
                y: 0,
                duration: 1.3,
                stagger: 0.18,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: mask,
                    start: 'top 82%',
                }
            });
        });

        // About section parallax image drift
        gsap.to('.portrait-img', {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // Timeline Process line progression fills
        gsap.to('#timeline-progress', {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.timeline-container',
                start: 'top 35%',
                end: 'bottom 45%',
                scrub: true
            }
        });

        // Timeline item dot glow activations
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            ScrollTrigger.create({
                trigger: item,
                start: 'top 55%',
                onEnter: () => item.classList.add('active'),
                onLeaveBack: () => item.classList.remove('active')
            });
        });

        // General slide in panels
        const genericReveals = document.querySelectorAll('.animate-on-scroll');
        genericReveals.forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: () => el.classList.add('revealed')
            });
        });

        /* ----------------------------------------------------
           THEATRICAL HORIZONTAL TRANSLATION ENGINE (DESKTOP)
           ---------------------------------------------------- */
        if (horizTrack && horizPinWrap) {
            let mm = gsap.matchMedia();

            mm.add("(min-width: 1025px)", () => {
                const trackWidth = horizTrack.scrollWidth;
                const scrollDistance = trackWidth - window.innerWidth;

                // Pin the vertical timeline and translate track horizontally
                const horizTimeline = gsap.to(horizTrack, {
                    x: -scrollDistance,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: horizPinWrap,
                        pin: true,
                        scrub: 1.1, // smooth micro-lag
                        start: 'top top',
                        end: () => `+=${scrollDistance}`,
                        invalidateOnRefresh: true
                    }
                });

                // Parallax drift applied to slide backgrounds during horizontal scroll
                slideCards.forEach(card => {
                    const img = card.querySelector('.parallax-bg-img');
                    gsap.fromTo(img, 
                        { xPercent: -15 },
                        {
                            xPercent: 15,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: card,
                                containerAnimation: horizTimeline,
                                start: 'left right',
                                end: 'right left',
                                scrub: true
                            }
                        }
                    );
                });
            });
        }
    };

    // Register GSAP ScrollTrigger structures
    setTimeout(registerScrollTriggers, 800);


    /* ==========================================================================
       7. SOCIAL PROOF STATS COUNTERS
       ========================================================================== */
    function triggerProofCounter() {
        const counters = document.querySelectorAll('.proof-numberCounter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const isK = counter.textContent.includes('K');
            const isPlus = counter.textContent.includes('+');

            let obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 2.5,
                ease: 'power3.out',
                onUpdate: () => {
                    let formatted = Math.floor(obj.val);
                    if (isK) {
                        formatted = (obj.val / 1000).toFixed(1) + 'K';
                    }
                    if (isPlus) {
                        formatted = formatted + '+';
                    }
                    counter.textContent = formatted;
                }
            });
        });
    }


    /* ==========================================================================
       8. THEATRICAL LIGHTBOX VIDEO OVERLAYS (CINEMATIC MODALS)
       ========================================================================== */
    
    function openLightboxModal(videoSrc, titleText, clientText, descriptionText) {
        if (lenis) lenis.stop();

        // Pause looping background videos to optimize system resource footprint
        const heroVideo = document.getElementById('hero-video');
        if (heroVideo) heroVideo.pause();

        modalVideo.src = videoSrc;
        modalTitle.textContent = titleText;
        modalClient.textContent = clientText;
        modalDescription.textContent = descriptionText;

        // Reveal overlay
        cinematicModal.classList.add('active');
        modalVideo.load();
        modalVideo.play().catch(e => console.log("Direct play restricted", e));

        customCursor.classList.remove('clickable');
    }

    function closeLightboxModal() {
        cinematicModal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = ''; // flush buffer

        if (lenis) lenis.start();

        const heroVideo = document.getElementById('hero-video');
        if (heroVideo) heroVideo.play().catch(e => {});
    }

    // Modal Trigger listeners for Portfolio slide cards
    const portfolioCards = document.querySelectorAll('.portfolio-item');
    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const video = card.getAttribute('data-video');
            const client = card.getAttribute('data-client');
            const desc = card.getAttribute('data-desc');
            const title = card.querySelector('.slide-title').textContent;

            openLightboxModal(video, title, client, desc);
        });
    });

    // Modal Trigger listener for official showreel click
    if (showreelPlayBtn) {
        showreelPlayBtn.addEventListener('click', () => {
            const video = "https://player.vimeo.com/external/435674703.sd.mp4?s=6f41def7581dcef08ba856eeabcdc3e02f2603c7&profile_id=164&oauth2_token_id=57447761";
            const title = "Official Cinematic Showreel";
            const client = "SN Cinematic 2026 CUT";
            const desc = "A high-octane 3-minute reel mapping professional wedding clips, luxury commercials, festival visual records, and creative editorial works designed by SN Cinematic.";

            openLightboxModal(video, title, client, desc);
        });
    }

    // Close button & backdrop triggers
    if (modalClose) {
        modalClose.addEventListener('click', closeLightboxModal);
    }

    cinematicModal.addEventListener('click', (e) => {
        if (e.target === cinematicModal) {
            closeLightboxModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cinematicModal.classList.contains('active')) {
            closeLightboxModal();
        }
    });


    /* ==========================================================================
       9. 3D CARD TILT TRANSFORM PHYSICS
       ========================================================================== */
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Center of card
            const halfW = rect.width / 2;
            const halfH = rect.height / 2;

            const mouseXOnCard = e.clientX - rect.left;
            const mouseYOnCard = e.clientY - rect.top;

            // Maximum tilt angle coordinates mapped inside a 10deg radius
            const rotX = ((mouseYOnCard - halfH) / halfH) * -10;
            const rotY = ((mouseXOnCard - halfW) / halfW) * 10;

            gsap.to(card, {
                rotateX: rotX,
                rotateY: rotY,
                scale: 1.03,
                duration: 0.45,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.7,
                ease: 'power3.out'
            });
        });
    });


    /* ==========================================================================
       10. CLIENT TESTIMONIALS SLIDER DYNAMICS
       ========================================================================== */
    let currentSlide = 0;
    const totalSlides = testimonialSlides.length;
    let autoSlideTimer;

    function buildSliderDots() {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoCycle();
            });
            sliderDotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = sliderDotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function goToSlide(slideIdx) {
        currentSlide = slideIdx;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;

        gsap.to(testimonialsTrack, {
            x: `${-currentSlide * 33.333}%`,
            duration: 0.9,
            ease: 'power3.inOut'
        });

        updateDots();
    }

    if (sliderNext) {
        sliderNext.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetAutoCycle();
        });
    }

    if (sliderPrev) {
        sliderPrev.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetAutoCycle();
        });
    }

    function startAutoCycle() {
        autoSlideTimer = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5500);
    }

    function resetAutoCycle() {
        clearInterval(autoSlideTimer);
        startAutoCycle();
    }

    if (testimonialSlides.length > 0) {
        buildSliderDots();
        startAutoCycle();
    }


    /* ==========================================================================
       11. LUXURY CUSTOM TOAST NOTIFICATION FEEDBACK
       ========================================================================== */
    function showLuxuryToast(title, body) {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '3.5rem';
        toast.style.left = '3.5rem';
        toast.style.background = 'var(--bg-panel)';
        toast.style.border = '1px solid var(--champagne)';
        toast.style.padding = '1.8rem 2.2rem';
        toast.style.boxShadow = '0 20px 50px rgba(0,0,0,0.8)';
        toast.style.zIndex = '99999';
        toast.style.maxWidth = '360px';
        toast.style.transform = 'translateY(60px)';
        toast.style.opacity = '0';
        toast.style.fontFamily = 'var(--font-body)';

        toast.innerHTML = `
            <h4 style="color:var(--champagne); margin-bottom:0.5rem; font-family:var(--font-heading); text-transform:uppercase; letter-spacing:0.08em; font-size:0.95rem;">${title}</h4>
            <p style="font-size:0.8rem; line-height:1.5; color:var(--platinum); font-weight:200;">${body}</p>
        `;

        document.body.appendChild(toast);

        gsap.to(toast, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(toast, {
                        y: 50,
                        opacity: 0,
                        duration: 0.7,
                        ease: 'power3.in',
                        onComplete: () => toast.remove()
                    });
                }, 4500);
            }
        });
    }

    // Contact Form submission handler
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const projectType = document.getElementById('form-project-type').value;

            const submitBtn = contactForm.querySelector('.btn-submit');
            const origHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'SYNCING SECURE CONNECTION... <i class="fa-solid fa-spinner fa-spin"></i>';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = origHTML;
                contactForm.reset();

                showLuxuryToast(
                    "CONNECTION SECURED",
                    `Hi ${name}, your luxury production pitch has been validated. Our creative desk will review your ${projectType} query and sync back at ${email} within 24 hours.`
                );
            }, 1800);
        });
    }

    // Newsletter Form submission handler
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const email = input.value;
            input.value = '';

            showLuxuryToast(
                "SUBSCRIPTION COMPLETED",
                `The address ${email} has been white-listed. Widescreen master clips and grading sheets will sync to your inbox.`
            );
        });
    }


    /* ==========================================================================
       12. MOBILE HAMBURGER MENU DRAWER
       ========================================================================== */
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');

            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        });
    }

    // Active Section highlighters on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -40% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // Initialize all custom interactive states
    applyCursorListeners();
    applyMagneticPhysics();

});

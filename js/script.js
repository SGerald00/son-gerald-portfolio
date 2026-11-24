
document.addEventListener("DOMContentLoaded", function () {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


    // =====================================
    // 1. STICKY HEADER SCROLL EFFECT
    // =====================================

    const header = document.querySelector(".header");

    function updateHeader() {

        if (header) {
            header.classList.toggle(
                "is-scrolled",
                window.scrollY > 20
            );
        }

    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    // =====================================
    // 2. IMAGE FALLBACK
    // =====================================

    document.querySelectorAll(
        "img[data-fallback]"
    ).forEach(function (img) {

        function hide() {
            img.classList.add("is-missing");
        }

        img.addEventListener("error", hide);

        if (
            img.complete &&
            img.naturalWidth === 0
        ) {
            hide();
        }

    });


    // =====================================
    // 3. SCROLL REVEAL ANIMATION
    // =====================================

    const targets = document.querySelectorAll(
        ".projects-heading, .project-card, " +
        ".about-heading, .about-card, " +
        ".skills-heading, .skill-card, .ai-note, " +
        ".experience-heading, .experience-card, " +
        ".seminars-heading, .seminar-card, " +
        ".contact > .container"
    );

    if (
        !reducedMotion.matches &&
        "IntersectionObserver" in window
    ) {

        targets.forEach(function (target) {
            target.classList.add("reveal-ready");
        });

        const revealer = new IntersectionObserver(
            function (entries, instance) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        instance.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        targets.forEach(function (target) {
            revealer.observe(target);
        });

    }


    // =====================================
    // 4. PROFILE PHOTO TILT AND MOUSE GLOW
    // =====================================

    const hero = document.querySelector(
        ".hero-container"
    );

    const circle = document.querySelector(
        ".profile-circle"
    );

    const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );

    if (
        hero &&
        circle &&
        canHover.matches &&
        !reducedMotion.matches
    ) {

        hero.addEventListener(
            "pointermove",
            function (event) {

                const b = hero.getBoundingClientRect();

                const x =
                    (event.clientX - b.left) / b.width;

                const y =
                    (event.clientY - b.top) / b.height;

                hero.style.setProperty(
                    "--pointer-x",
                    (x * 100) + "%"
                );

                hero.style.setProperty(
                    "--pointer-y",
                    (y * 100) + "%"
                );

                circle.style.transform =
                    "perspective(800px) " +
                    "rotateX(" +
                    ((y - 0.5) * -10) +
                    "deg) " +
                    "rotateY(" +
                    ((x - 0.5) * 10) +
                    "deg) " +
                    "scale(1.03)";

                hero.classList.add(
                    "is-pointer-active"
                );

                circle.classList.add(
                    "is-pointer-active"
                );

            }
        );

        hero.addEventListener(
            "pointerleave",
            function () {

                hero.classList.remove(
                    "is-pointer-active"
                );

                circle.classList.remove(
                    "is-pointer-active"
                );

                circle.style.transform = "";

            }
        );

    }


    // =====================================
    // 5. MOBILE NAVIGATION
    // =====================================

    const toggle = document.querySelector(
        ".nav-toggle"
    );

    const navigation = document.getElementById(
        "mainNavigation"
    );

    const links = document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

    function setMenu(open) {

        if (!toggle || !navigation) {
            return;
        }

        toggle.setAttribute(
            "aria-expanded",
            String(open)
        );

        toggle.setAttribute(
            "aria-label",
            open
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        navigation.classList.toggle(
            "is-open",
            open
        );

    }

    if (toggle && navigation) {

        toggle.addEventListener(
            "click",
            function () {

                setMenu(
                    toggle.getAttribute(
                        "aria-expanded"
                    ) !== "true"
                );

            }
        );

        links.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    setMenu(false);

                }
            );

        });

    }


    // =====================================
    // 6. ACTIVE NAVIGATION LINKS
    // =====================================

    if ("IntersectionObserver" in window) {

        const spy = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    links.forEach(function (link) {

                        const active =
                            link.getAttribute("href") ===
                            "#" + entry.target.id;

                        link.classList.toggle(
                            "active",
                            active
                        );

                        if (active) {

                            link.setAttribute(
                                "aria-current",
                                "location"
                            );

                        } else {

                            link.removeAttribute(
                                "aria-current"
                            );

                        }

                    });

                });

            },
            {
                rootMargin: "-40% 0px -55% 0px"
            }
        );

        document.querySelectorAll(
            "main section[id]"
        ).forEach(function (section) {

            spy.observe(section);

        });

    }


    // =====================================
    // 7. FULL BACKGROUND PROGRAMMING MOVEMENT
    // =====================================

    /*
        This replaces the old side-only movement.

        Symbols travel:
        - Left to right
        - Right to left
        - Through the center
        - Diagonally
        - Up and down

        They stay behind website content.

        Speed: 34 to 46 seconds per cycle.
    */


    // =====================================
    // 7.1 ANIMATION SPEED SETTINGS
    // =====================================

    // Lower number = faster movement.
    // Higher number = slower movement.

    const BASE_DURATION = 34;

    // Add a small speed variation.
    const DURATION_VARIATION = 3;


    // =====================================
    // 7.2 RANDOM NUMBER GENERATOR
    // =====================================

    // Uses repeatable values so the symbols
    // stay evenly distributed when resizing.

    function createRandom(seed) {

        let state = seed >>> 0;

        return function () {

            state = (
                Math.imul(
                    state,
                    1664525
                ) + 1013904223
            ) >>> 0;

            return state / 4294967296;

        };

    }


    // =====================================
    // 7.3 CREATE MOVEMENT PATHS
    // =====================================

    function updateProgrammingBackground() {

        const layers = document.querySelectorAll(
            "main section .code-background"
        );

        layers.forEach(function (layer, sectionIndex) {

            const allSymbols = Array.from(
                layer.querySelectorAll(
                    ".floating-symbol"
                )
            );

            // Only process visible symbols.
            // Some are hidden on small screens.

            const symbols = allSymbols.filter(
                function (symbol) {

                    return window.getComputedStyle(
                        symbol
                    ).display !== "none";

                }
            );

            const width = layer.clientWidth;
            const height = layer.clientHeight;

            if (!width || !height || !symbols.length) {
                return;
            }


            // Spread symbols evenly through section.
            const columns = width < 768 ? 3 : 4;

            const rows = Math.ceil(
                symbols.length / columns
            );


            symbols.forEach(function (symbol, index) {

                const random = createRandom(
                    (sectionIndex + 1) * 5099 +
                    (index + 1) * 1009
                );

                // Calculate boundaries.
                // Keeps symbols within the section.

                const maxX = Math.max(
                    0,
                    width - symbol.offsetWidth - 12
                );

                const maxY = Math.max(
                    0,
                    height - symbol.offsetHeight - 12
                );


                // =====================================
                // STARTING POSITION
                // =====================================

                const column = index % columns;

                const row = Math.floor(
                    index / columns
                );

                const startX = maxX * (
                    (
                        column +
                        0.2 +
                        random() * 0.6
                    ) / columns
                );

                const startY = maxY * (
                    (
                        row +
                        0.2 +
                        random() * 0.6
                    ) / rows
                );


                // =====================================
                // DESTINATION 1
                // OPPOSITE SIDE
                // =====================================

                const move1X = maxX * (
                    startX < maxX / 2
                        ? 0.65 + random() * 0.30
                        : 0.05 + random() * 0.30
                );

                const move1Y = maxY * (
                    0.08 + random() * 0.84
                );


                // =====================================
                // DESTINATION 2
                // CENTER AREA
                // =====================================

                const move2X = maxX * (
                    0.25 + random() * 0.50
                );

                const move2Y = maxY * (
                    0.20 + random() * 0.60
                );


                // =====================================
                // DESTINATION 3
                // ANOTHER RANDOM LOCATION
                // =====================================

                const move3X = maxX * (
                    0.05 + random() * 0.90
                );

                const move3Y = maxY * (
                    0.05 + random() * 0.90
                );


                // =====================================
                // SET STARTING POSITION
                // =====================================

                symbol.style.left = startX + "px";

                symbol.style.top = startY + "px";

                symbol.style.right = "auto";


                // =====================================
                // SET MOVEMENT DISTANCES
                // =====================================

                // These variables are used in
                // CSS @keyframes wanderProgramming.

                symbol.style.setProperty(
                    "--move1-x",
                    (move1X - startX) + "px"
                );

                symbol.style.setProperty(
                    "--move1-y",
                    (move1Y - startY) + "px"
                );

                symbol.style.setProperty(
                    "--move2-x",
                    (move2X - startX) + "px"
                );

                symbol.style.setProperty(
                    "--move2-y",
                    (move2Y - startY) + "px"
                );

                symbol.style.setProperty(
                    "--move3-x",
                    (move3X - startX) + "px"
                );

                symbol.style.setProperty(
                    "--move3-y",
                    (move3Y - startY) + "px"
                );


                // =====================================
                // SET AVERAGE ANIMATION SPEED
                // =====================================

                const duration =
                    BASE_DURATION +
                    (index % 5) * DURATION_VARIATION;

                symbol.style.setProperty(
                    "--duration",
                    duration + "s"
                );


                // Give each symbol a different
                // starting point in its animation.

                const delay = -(
                    (
                        index * 5 +
                        sectionIndex * 3
                    ) % duration
                );

                symbol.style.setProperty(
                    "--delay",
                    delay + "s"
                );

            });

        });

    }


    // =====================================
    // 7.4 START ANIMATION
    // =====================================

    updateProgrammingBackground();


    // =====================================
    // 7.5 HANDLE WINDOW RESIZING
    // =====================================

    let resizeTimer;

    window.addEventListener(
        "resize",
        function () {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(
                updateProgrammingBackground,
                200
            );

        },
        { passive: true }
    );


    // =====================================
    // 7.6 HANDLE MOTION PREFERENCES
    // =====================================

    if (
        typeof reducedMotion.addEventListener ===
        "function"
    ) {

        reducedMotion.addEventListener(
            "change",
            updateProgrammingBackground
        );

    }

});

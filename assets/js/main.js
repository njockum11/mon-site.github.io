document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       MENU MOBILE
    ========================================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* =========================================================
       YOUTUBE — LIGHTBOX
    ========================================================= */

    const modal = document.querySelector("#videoModal");
    const frame = document.querySelector("#youtubeFrame");
    const title = document.querySelector("#videoModalTitle");

    const videoTriggers = document.querySelectorAll(
        ".youtube-preview, .youtube-trigger"
    );


    function openVideo(videoId, videoTitle = "Vidéo") {

        if (!modal || !frame) return;

        if (title) {
            title.textContent = videoTitle;
        }

        frame.src =
            `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` +
            `?autoplay=1&rel=0&modestbranding=1`;

        frame.title = videoTitle;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    }


    function closeVideo() {

        if (!modal || !frame) return;

        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");

        /*
         * Suppression de la source :
         * la vidéo s'arrête immédiatement.
         */
        frame.src = "";
        frame.title = "";

        document.body.style.overflow = "";
    }


    videoTriggers.forEach(trigger => {

        trigger.addEventListener("click", () => {

            const videoId = trigger.dataset.youtube;
            const videoTitle = trigger.dataset.title || "Vidéo";

            if (videoId) {
                openVideo(videoId, videoTitle);
            }
        });

    });


    document.querySelectorAll("[data-close-video]").forEach(element => {

        element.addEventListener("click", closeVideo);

    });


    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            modal &&
            modal.classList.contains("is-open")
        ) {
            closeVideo();
        }

    });


    /* =========================================================
       MINIATURES YOUTUBE
       Aucun lecteur chargé avant le clic.
    ========================================================= */

    document.querySelectorAll(".youtube-preview").forEach(preview => {

        const id = preview.dataset.youtube;

        if (!id) return;

        preview.style.backgroundImage =
            `linear-gradient(135deg, rgba(7,26,45,.16), rgba(7,26,45,.72)), ` +
            `url("https://img.youtube.com/vi/${encodeURIComponent(id)}/hqdefault.jpg")`;

        preview.style.backgroundSize = "cover";
        preview.style.backgroundPosition = "center";

    });


    /* =========================================================
       PARALLAX — BANNIÈRE + SAVOIR-FAIRE
       
       Les vignettes intérieures des projets ne bougent pas.
    ========================================================= */

    const heroBg = document.querySelector(".hero-bg");
    const skillCards = document.querySelectorAll(".skill-card");

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


    if (
        finePointer.matches &&
        !reducedMotion.matches &&
        (heroBg || skillCards.length)
    ) {

        let mouseX = 0;
        let mouseY = 0;
        let animationFrame = null;


        function updateParallax() {

            animationFrame = null;

            /*
             * BANNIÈRE
             */
            if (heroBg) {

                heroBg.style.setProperty(
                    "--parallax-x",
                    `${mouseX * 10}px`
                );

                heroBg.style.setProperty(
                    "--parallax-y",
                    `${mouseY * 7}px`
                );
            }


            /*
             * CARTES SAVOIR-FAIRE
             */
            skillCards.forEach((card, index) => {

                const intensity = index % 2 === 0 ? 4 : 3;

                card.style.setProperty(
                    "--card-x",
                    `${mouseX * intensity}px`
                );

                card.style.setProperty(
                    "--card-y",
                    `${mouseY * intensity}px`
                );

            });

        }


        document.addEventListener("mousemove", event => {

            mouseX =
                event.clientX / window.innerWidth - 0.5;

            mouseY =
                event.clientY / window.innerHeight - 0.5;


            if (!animationFrame) {
                animationFrame =
                    requestAnimationFrame(updateParallax);
            }

        }, { passive: true });


        document.addEventListener("mouseleave", () => {

            if (heroBg) {

                heroBg.style.setProperty(
                    "--parallax-x",
                    "0px"
                );

                heroBg.style.setProperty(
                    "--parallax-y",
                    "0px"
                );
            }


            skillCards.forEach(card => {

                card.style.setProperty(
                    "--card-x",
                    "0px"
                );

                card.style.setProperty(
                    "--card-y",
                    "0px"
                );

            });

        });

    }


    /* =========================================================
       CARROUSEL 3D DES RÉALISATIONS
       
       Principe :
       - une carte centrale dominante
       - cartes voisines plus petites
       - cartes éloignées très discrètes
       - les cartes latérales ne sont pas directement cliquables
       - déplacement fluide à la souris
       - clic sur une carte latérale = recentrage
    ========================================================= */

    const carousel =
        document.querySelector(".projects-carousel");

    const track =
        carousel?.querySelector(".carousel-track");

    const cards =
        track
            ? Array.from(track.querySelectorAll(".carousel-card"))
            : [];


    if (carousel && track && cards.length > 0) {

        let activeIndex = 0;

        let pointerStartX = null;
        let pointerCurrentX = null;

        let isDragging = false;

        let animationFrame = null;


        /*
         * Nombre de cartes affichées autour de la carte centrale.
         */
        const visibleRange = 2;


        function updateCarousel() {

            animationFrame = null;

            cards.forEach((card, index) => {

                let offset = index - activeIndex;

                /*
                 * Gestion circulaire du carrousel.
                 * Permet de passer naturellement de la dernière
                 * carte à la première.
                 */
                if (offset > cards.length / 2) {
                    offset -= cards.length;
                }

                if (offset < -cards.length / 2) {
                    offset += cards.length;
                }


                /*
                 * Carte centrale
                 */
                if (offset === 0) {

                    card.classList.add("is-active");

                    card.classList.remove(
                        "is-prev",
                        "is-next",
                        "is-hidden"
                    );

                    card.style.setProperty(
                        "--carousel-x",
                        "0px"
                    );

                    card.style.setProperty(
                        "--carousel-z",
                        "0px"
                    );

                    card.style.setProperty(
                        "--carousel-scale",
                        "1"
                    );

                    card.style.setProperty(
                        "--carousel-opacity",
                        "1"
                    );

                    card.style.zIndex = "10";

                    card.style.pointerEvents = "auto";

                }


                /*
                 * Carte immédiatement à gauche
                 */
                else if (offset === -1) {

                    card.classList.remove(
                        "is-active",
                        "is-next",
                        "is-hidden"
                    );

                    card.classList.add("is-prev");

                    card.style.setProperty(
                        "--carousel-x",
                        "-54%"
                    );

                    card.style.setProperty(
                        "--carousel-z",
                        "-70px"
                    );

                    card.style.setProperty(
                        "--carousel-scale",
                        ".78"
                    );

                    card.style.setProperty(
                        "--carousel-opacity",
                        ".62"
                    );

                    card.style.zIndex = "6";

                    card.style.pointerEvents = "auto";

                }


                /*
                 * Carte immédiatement à droite
                 */
                else if (offset === 1) {

                    card.classList.remove(
                        "is-active",
                        "is-prev",
                        "is-hidden"
                    );

                    card.classList.add("is-next");

                    card.style.setProperty(
                        "--carousel-x",
                        "54%"
                    );

                    card.style.setProperty(
                        "--carousel-z",
                        "-70px"
                    );

                    card.style.setProperty(
                        "--carousel-scale",
                        ".78"
                    );

                    card.style.setProperty(
                        "--carousel-opacity",
                        ".62"
                    );

                    card.style.zIndex = "6";

                    card.style.pointerEvents = "auto";

                }


                /*
                 * Cartes éloignées
                 */
                else if (
                    Math.abs(offset) <= visibleRange
                ) {

                    card.classList.remove(
                        "is-active",
                        "is-prev",
                        "is-next"
                    );

                    card.classList.add("is-hidden");

                    const direction =
                        offset < 0 ? -1 : 1;

                    card.style.setProperty(
                        "--carousel-x",
                        `${direction * 88}%`
                    );

                    card.style.setProperty(
                        "--carousel-z",
                        "-150px"
                    );

                    card.style.setProperty(
                        "--carousel-scale",
                        ".58"
                    );

                    card.style.setProperty(
                        "--carousel-opacity",
                        ".18"
                    );

                    card.style.zIndex = "2";

                    card.style.pointerEvents = "none";

                }


                /*
                 * Cartes complètement masquées
                 */
                else {

                    card.classList.remove(
                        "is-active",
                        "is-prev",
                        "is-next"
                    );

                    card.classList.add("is-hidden");

                    card.style.setProperty(
                        "--carousel-x",
                        "0px"
                    );

                    card.style.setProperty(
                        "--carousel-z",
                        "-250px"
                    );

                    card.style.setProperty(
                        "--carousel-scale",
                        ".45"
                    );

                    card.style.setProperty(
                        "--carousel-opacity",
                        "0"
                    );

                    card.style.zIndex = "0";

                    card.style.pointerEvents = "none";

                }

            });

        }


        function requestCarouselUpdate() {

            if (!animationFrame) {

                animationFrame =
                    requestAnimationFrame(
                        updateCarousel
                    );

            }

        }


        function nextCard() {

            activeIndex =
                (activeIndex + 1) % cards.length;

            requestCarouselUpdate();

        }


        function previousCard() {

            activeIndex =
                (activeIndex - 1 + cards.length) %
                cards.length;

            requestCarouselUpdate();

        }


        /*
         * Clic sur les cartes voisines :
         * elles deviennent centrales au lieu d'ouvrir
         * directement leur contenu.
         */
        cards.forEach((card, index) => {

            card.addEventListener("click", event => {

                if (index === activeIndex) {
                    return;
                }

                event.preventDefault();

                let difference =
                    index - activeIndex;


                if (difference > cards.length / 2) {
                    difference -= cards.length;
                }

                if (difference < -cards.length / 2) {
                    difference += cards.length;
                }


                if (difference > 0) {
                    nextCard();
                } else {
                    previousCard();
                }

            });

        });


        /*
         * Souris / trackpad :
         * glissement horizontal fluide.
         */
        carousel.addEventListener(
            "pointerdown",
            event => {

                if (event.pointerType === "mouse") {
                    pointerStartX = event.clientX;
                    pointerCurrentX = event.clientX;
                }

                else {
                    pointerStartX = event.clientX;
                    pointerCurrentX = event.clientX;
                }

                isDragging = true;

                carousel.setPointerCapture?.(
                    event.pointerId
                );

            }
        );


        carousel.addEventListener(
            "pointermove",
            event => {

                if (!isDragging) return;

                pointerCurrentX = event.clientX;

                const delta =
                    pointerCurrentX - pointerStartX;

                /*
                 * Translation temporaire pendant le geste.
                 * Le mouvement reste volontairement faible.
                 */
                const percentage =
                    Math.max(
                        -18,
                        Math.min(
                            18,
                            delta / 10
                        )
                    );

                track.style.setProperty(
                    "--drag-x",
                    `${percentage}%`
                );

            }
        );


        function finishDrag() {

            if (!isDragging) return;

            const delta =
                pointerCurrentX - pointerStartX;


            isDragging = false;

            pointerStartX = null;
            pointerCurrentX = null;

            track.style.setProperty(
                "--drag-x",
                "0%"
            );


            /*
             * Seuil volontairement raisonnable :
             * il faut réellement glisser.
             */
            if (Math.abs(delta) > 55) {

                if (delta < 0) {
                    nextCard();
                } else {
                    previousCard();
                }

            }

        }


        carousel.addEventListener(
            "pointerup",
            finishDrag
        );

        carousel.addEventListener(
            "pointercancel",
            finishDrag
        );

        carousel.addEventListener(
            "pointerleave",
            event => {

                if (
                    isDragging &&
                    event.pointerType === "mouse"
                ) {
                    finishDrag();
                }

            }
        );


        /*
         * Clavier :
         * flèches gauche / droite lorsque le carrousel
         * est ciblé.
         */
        carousel.setAttribute(
            "tabindex",
            "0"
        );


        carousel.addEventListener(
            "keydown",
            event => {

                if (event.key === "ArrowRight") {

                    event.preventDefault();

                    nextCard();

                }

                if (event.key === "ArrowLeft") {

                    event.preventDefault();

                    previousCard();

                }

            }
        );


        /*
         * Initialisation.
         */
        updateCarousel();

    }

});

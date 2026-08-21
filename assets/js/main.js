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
    const modalTitle = document.querySelector("#videoModalTitle");

    const videoTriggers = document.querySelectorAll(
        ".youtube-preview, .youtube-trigger"
    );

    function openVideo(videoId, videoTitle = "Vidéo") {

        if (!modal || !frame || !videoId) return;

        if (modalTitle) {
            modalTitle.textContent = videoTitle;
        }

        frame.src =
            "https://www.youtube.com/embed/" +
            encodeURIComponent(videoId) +
            "?autoplay=1&rel=0&modestbranding=1";

        frame.title = videoTitle;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    }


    function closeVideo() {

        if (!modal || !frame) return;

        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");

        frame.src = "";
        frame.title = "";

        document.body.style.overflow = "";
    }


    videoTriggers.forEach(trigger => {

        trigger.addEventListener("click", event => {

            /*
             * Les déclencheurs YouTube restent fonctionnels
             * même lorsqu'ils sont placés dans le carrousel.
             */

            if (trigger.tagName === "A") {
                event.preventDefault();
            }

            openVideo(
                trigger.dataset.youtube,
                trigger.dataset.title || "Vidéo"
            );

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
    ========================================================= */

    document.querySelectorAll(".youtube-preview").forEach(preview => {

        const id = preview.dataset.youtube;

        if (!id) return;

        preview.style.backgroundImage =
            "linear-gradient(135deg, rgba(7,26,45,.12), rgba(7,26,45,.68)), " +
            "url(\"https://img.youtube.com/vi/" +
            encodeURIComponent(id) +
            "/hqdefault.jpg\")";

        preview.style.backgroundSize = "cover";
        preview.style.backgroundPosition = "center";

    });


    /* =========================================================
       CARROUSEL 3D
       VERSION CORRIGÉE
    ========================================================= */

    const carousel = document.querySelector(".projects-carousel");
    const track = document.querySelector(".carousel-track");

    if (!carousel || !track) {
        return;
    }

    const cards = Array.from(
        track.querySelectorAll(".carousel-card")
    );

    if (!cards.length) {
        return;
    }


    /* =========================================================
       PARAMÈTRES
    ========================================================= */

    let currentIndex = 0;

    let startX = 0;
    let currentX = 0;
    let dragDistance = 0;

    let isDragging = false;
    let movedDuringDrag = false;

    const DRAG_THRESHOLD = 55;

    /*
     * Espace entre les cartes.
     * Le CSS peut modifier la largeur sans casser le calcul.
     */
    const CARD_GAP = 28;


    /* =========================================================
       CALCUL DE LA POSITION
    ========================================================= */

    function getCardWidth() {

        if (!cards[0]) return 0;

        return cards[0].getBoundingClientRect().width;
    }


    function getStep() {

        return getCardWidth() + CARD_GAP;
    }


    function getBasePosition() {

        const cardWidth = getCardWidth();

        const centerOffset =
            (carousel.clientWidth - cardWidth) / 2;

        return centerOffset - currentIndex * getStep();
    }


    /* =========================================================
       POSITION DES CARTES
    ========================================================= */

    function updateCards() {

        const total = cards.length;

        cards.forEach((card, index) => {

            let distance = index - currentIndex;

            /*
             * Carrousel circulaire.
             */

            if (distance > total / 2) {
                distance -= total;
            }

            if (distance < -total / 2) {
                distance += total;
            }

            const absDistance = Math.abs(distance);


            let scale;
            let opacity;
            let rotateY;
            let translateZ;
            let blur;
            let zIndex;


            /* CARTE CENTRALE */

            if (absDistance === 0) {

                scale = 1.10;
                opacity = 1;
                rotateY = 0;
                translateZ = 55;
                blur = 0;
                zIndex = 30;

            }

            /* CARTES ADJACENTES */

            else if (absDistance === 1) {

                scale = 0.84;
                opacity = 0.70;
                rotateY = distance > 0 ? -13 : 13;
                translateZ = 0;
                blur = 0;
                zIndex = 20;

            }

            /* CARTES ÉLOIGNÉES */

            else if (absDistance === 2) {

                scale = 0.70;
                opacity = 0.40;
                rotateY = distance > 0 ? -21 : 21;
                translateZ = -45;
                blur = 0.3;
                zIndex = 10;

            }

            /* CARTES TRÈS ÉLOIGNÉES */

            else {

                scale = 0.60;
                opacity = 0.18;
                rotateY = distance > 0 ? -27 : 27;
                translateZ = -80;
                blur = 0.8;
                zIndex = 1;

            }


            card.style.transform =
                "translateZ(" + translateZ + "px) " +
                "rotateY(" + rotateY + "deg) " +
                "scale(" + scale + ")";

            card.style.opacity = String(opacity);
            card.style.zIndex = String(zIndex);

            card.style.filter =
                blur > 0
                    ? "blur(" + blur + "px)"
                    : "none";

            /*
             * IMPORTANT :
             * On ne désactive PAS pointer-events.
             *
             * Les liens restent donc fonctionnels.
             */

            card.style.pointerEvents = "auto";

        });
    }


    /* =========================================================
       RENDU
    ========================================================= */

    function render(animate = true, offset = 0) {

        const baseX = getBasePosition();

        if (animate) {

            track.style.transition =
                "transform .55s cubic-bezier(.22,.61,.36,1)";

            cards.forEach(card => {

                card.style.transition =
                    "transform .55s cubic-bezier(.22,.61,.36,1), " +
                    "opacity .45s ease, " +
                    "filter .45s ease";

            });

        } else {

            track.style.transition = "none";

            cards.forEach(card => {
                card.style.transition = "none";
            });
        }


        track.style.transform =
            "translate3d(" +
            (baseX + offset) +
            "px, 0, 0)";


        updateCards();
    }


    /* =========================================================
       NAVIGATION
    ========================================================= */

    function goTo(index) {

        const total = cards.length;

        currentIndex =
            ((index % total) + total) % total;

        render(true);
    }


    function next() {
        goTo(currentIndex + 1);
    }


    function previous() {
        goTo(currentIndex - 1);
    }


    /* =========================================================
       DRAG SOURIS / TOUCH
    ========================================================= */

    carousel.addEventListener("pointerdown", event => {

        /*
         * Bouton gauche uniquement pour la souris.
         */

        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return;
        }

        startX = event.clientX;
        currentX = event.clientX;
        dragDistance = 0;

        isDragging = true;
        movedDuringDrag = false;

        carousel.setPointerCapture?.(event.pointerId);

        track.style.transition = "none";

        cards.forEach(card => {
            card.style.transition = "none";
        });

    });


    carousel.addEventListener("pointermove", event => {

        if (!isDragging) return;

        currentX = event.clientX;

        dragDistance = currentX - startX;

        if (Math.abs(dragDistance) > 5) {
            movedDuringDrag = true;
        }

        /*
         * Déplacement réel du carrousel pendant le drag.
         */

        render(false, dragDistance);

    });


    function finishDrag(event) {

        if (!isDragging) return;

        /*
         * Empêche un clic accidentel après un vrai drag.
         */

        if (movedDuringDrag) {
            event.preventDefault();
        }

        const delta = dragDistance;

        isDragging = false;

        startX = 0;
        currentX = 0;
        dragDistance = 0;


        if (Math.abs(delta) >= DRAG_THRESHOLD) {

            if (delta < 0) {
                next();
            } else {
                previous();
            }

        } else {

            render(true);

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


    /* =========================================================
       EMPÊCHER LE CLIC APRÈS UN GLISSEMENT
       MAIS CONSERVER LES VRAIS LIENS
    ========================================================= */

    carousel.addEventListener(
        "click",
        event => {

            if (!movedDuringDrag) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            movedDuringDrag = false;

        },
        true
    );


    /* =========================================================
       MOLETTE
    ========================================================= */

    carousel.addEventListener(
        "wheel",
        event => {

            if (
                Math.abs(event.deltaY) <
                Math.abs(event.deltaX)
            ) {
                return;
            }

            if (Math.abs(event.deltaY) < 20) {
                return;
            }

            event.preventDefault();

            if (event.deltaY > 0) {
                next();
            } else {
                previous();
            }

        },
        { passive: false }
    );


    /* =========================================================
       CLAVIER
    ========================================================= */

    carousel.setAttribute("tabindex", "0");

    carousel.addEventListener("keydown", event => {

        if (event.key === "ArrowRight") {

            event.preventDefault();
            next();

        }

        if (event.key === "ArrowLeft") {

            event.preventDefault();
            previous();

        }

    });


    /* =========================================================
       REDIMENSIONNEMENT
    ========================================================= */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {
                render(false);
            }, 100);

        },
        { passive: true }
    );


    /* =========================================================
       INITIALISATION
    ========================================================= */

    /*
     * Première carte au centre.
     */

    currentIndex = 0;

    /*
     * Petite temporisation pour laisser le navigateur
     * calculer correctement les dimensions après chargement.
     */

    requestAnimationFrame(() => {
        render(false);
    });

});

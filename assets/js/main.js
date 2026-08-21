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
             * Si le déclencheur se trouve dans un lien,
             * on évite la navigation.
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
       VERSION STABLE
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


    /* ---------------------------------------------------------
       PARAMÈTRES
    --------------------------------------------------------- */

    let currentIndex = 0;

    let pointerStartX = null;
    let pointerCurrentX = null;

    let isDragging = false;

    const DRAG_THRESHOLD = 70;


    /* ---------------------------------------------------------
       POSITIONNEMENT
    --------------------------------------------------------- */

    function updateCarousel(animate = true) {

        const cardWidth =
            cards[0].getBoundingClientRect().width;

        const gap = 28;

        const step = cardWidth + gap;

        const centerOffset =
            (carousel.clientWidth - cardWidth) / 2;

        const targetX =
            centerOffset -
            currentIndex * step;


        if (!animate) {
            track.style.transition = "none";
        } else {
            track.style.transition =
                "transform .55s cubic-bezier(.22,.61,.36,1)";
        }


        track.style.transform =
            `translate3d(${targetX}px, 0, 0)`;


        /* -----------------------------------------------------
           PROFONDEUR DES CARTES
        ----------------------------------------------------- */

        cards.forEach((card, index) => {

            let distance = index - currentIndex;

            /*
             * Gestion du carrousel circulaire.
             */

            const total = cards.length;

            if (distance > total / 2) {
                distance -= total;
            }

            if (distance < -total / 2) {
                distance += total;
            }


            const absDistance = Math.abs(distance);

            let scale = 1;
            let opacity = 1;
            let rotateY = 0;
            let translateZ = 0;
            let blur = 0;


            if (absDistance === 0) {

                /* CARTE CENTRALE */

                scale = 1.12;
                opacity = 1;
                rotateY = 0;
                translateZ = 80;
                blur = 0;

                card.style.zIndex = "20";

            }

            else if (absDistance === 1) {

                /* CARTES ADJACENTES */

                scale = 0.82;
                opacity = 0.65;
                rotateY = distance > 0 ? -14 : 14;
                translateZ = 10;
                blur = 0;

                card.style.zIndex = "10";

            }

            else if (absDistance === 2) {

                /* CARTES PLUS ÉLOIGNÉES */

                scale = 0.68;
                opacity = 0.38;
                rotateY = distance > 0 ? -22 : 22;
                translateZ = -50;
                blur = 0.3;

                card.style.zIndex = "5";

            }

            else {

                /* CARTES TRÈS ÉLOIGNÉES */

                scale = 0.58;
                opacity = 0.18;
                rotateY = distance > 0 ? -28 : 28;
                translateZ = -100;
                blur = 1;

                card.style.zIndex = "1";
            }


            card.style.transform =
                `translateZ(${translateZ}px) ` +
                `rotateY(${rotateY}deg) ` +
                `scale(${scale})`;

            card.style.opacity = opacity;

            card.style.filter =
                blur > 0
                    ? `blur(${blur}px)`
                    : "none";


            /*
             * Les cartes qui ne sont pas centrales
             * ne capturent pas le clic.
             */

            if (absDistance !== 0) {
                card.style.pointerEvents = "none";
            } else {
                card.style.pointerEvents = "";
            }

        });
    }


    /* ---------------------------------------------------------
       NAVIGATION
    --------------------------------------------------------- */

    function goTo(index) {

        const total = cards.length;

        currentIndex =
            ((index % total) + total) % total;

        updateCarousel(true);
    }


    function next() {
        goTo(currentIndex + 1);
    }


    function previous() {
        goTo(currentIndex - 1);
    }


    /* ---------------------------------------------------------
       SOURIS — DRAG FLUIDE
    --------------------------------------------------------- */

    carousel.addEventListener("pointerdown", event => {

        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        pointerStartX = event.clientX;
        pointerCurrentX = event.clientX;

        isDragging = true;

        carousel.setPointerCapture?.(event.pointerId);

        track.style.transition = "none";

    });


    carousel.addEventListener("pointermove", event => {

        if (!isDragging || pointerStartX === null) {
            return;
        }

        pointerCurrentX = event.clientX;

        const delta =
            pointerCurrentX - pointerStartX;

        const cardWidth =
            cards[0].getBoundingClientRect().width;

        const gap = 28;

        const step = cardWidth + gap;

        const centerOffset =
            (carousel.clientWidth - cardWidth) / 2;

        const baseX =
            centerOffset -
            currentIndex * step;

        /*
         * Translation temporaire pendant le drag.
         */

        track.style.transform =
            `translate3d(${baseX + delta}px, 0, 0)`;

    });


    function finishDrag() {

        if (!isDragging) return;

        const delta =
            pointerCurrentX - pointerStartX;

        isDragging = false;

        pointerStartX = null;
        pointerCurrentX = null;


        if (Math.abs(delta) >= DRAG_THRESHOLD) {

            if (delta < 0) {
                next();
            } else {
                previous();
            }

        } else {

            updateCarousel(true);
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


    /* ---------------------------------------------------------
       MOLETTE
    --------------------------------------------------------- */

    carousel.addEventListener(
        "wheel",
        event => {

            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
                return;
            }

            if (Math.abs(event.deltaY) < 25) {
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


    /* ---------------------------------------------------------
       CLAVIER
    --------------------------------------------------------- */

    carousel.setAttribute(
        "tabindex",
        "0"
    );

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


    /* ---------------------------------------------------------
       REDIMENSIONNEMENT
    --------------------------------------------------------- */

    window.addEventListener(
        "resize",
        () => {
            updateCarousel(false);
        },
        { passive: true }
    );


    /* ---------------------------------------------------------
       INITIALISATION
    --------------------------------------------------------- */

    /*
     * On place d'abord la première carte au centre.
     *
     * Si tu souhaites que la 4e carte soit centrale au
     * chargement, remplace simplement 0 par 3.
     */

    currentIndex = 0;

    updateCarousel(false);

});

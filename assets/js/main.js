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

    function openVideo(videoId, videoTitle = "Vidéo") {
        if (!modal || !frame || !videoId) return;

        if (modalTitle) modalTitle.textContent = videoTitle;

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

    document.querySelectorAll(".youtube-preview, .youtube-trigger").forEach(trigger => {
        trigger.addEventListener("click", event => {
            if (trigger.tagName === "A") event.preventDefault();

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
        if (event.key === "Escape" && modal?.classList.contains("is-open")) {
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
       CARROUSEL 3D — VERSION SANS GLISSÉ
       Navigation UNIQUEMENT par les flèches.
    ========================================================= */

    const carousel = document.querySelector(".projects-carousel");
    const track = document.querySelector(".carousel-track");

    if (!carousel || !track) return;

    const cards = Array.from(track.querySelectorAll(".carousel-card"));
    if (!cards.length) return;

    const prevButton = document.querySelector(".carousel-arrow.prev");
    const nextButton = document.querySelector(".carousel-arrow.next");

    let currentIndex = 0;
    const CARD_GAP = 28;

    function getCardWidth() {
        return cards[0]?.getBoundingClientRect().width || 0;
    }

    function getStep() {
        return getCardWidth() + CARD_GAP;
    }

    function getBasePosition() {
        const cardWidth = getCardWidth();
        const centerOffset = (carousel.clientWidth - cardWidth) / 2;
        return centerOffset - currentIndex * getStep();
    }

    function updateCards() {
        const total = cards.length;

        cards.forEach((card, index) => {
            let distance = index - currentIndex;

            if (distance > total / 2) distance -= total;
            if (distance < -total / 2) distance += total;

            const absDistance = Math.abs(distance);

            let scale;
            let opacity;
            let rotateY;
            let translateZ;
            let blur;
            let zIndex;

            if (absDistance === 0) {
                scale = 1.10;
                opacity = 1;
                rotateY = 0;
                translateZ = 55;
                blur = 0;
                zIndex = 30;
            } else if (absDistance === 1) {
                scale = 0.84;
                opacity = 0.70;
                rotateY = distance > 0 ? -13 : 13;
                translateZ = 0;
                blur = 0;
                zIndex = 20;
            } else if (absDistance === 2) {
                scale = 0.70;
                opacity = 0.40;
                rotateY = distance > 0 ? -21 : 21;
                translateZ = -45;
                blur = 0.3;
                zIndex = 10;
            } else {
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
            card.style.filter = blur > 0 ? "blur(" + blur + "px)" : "none";

            /*
             * Les cartes restent de vrais éléments cliquables.
             * Aucune désactivation de pointer-events.
             */
            card.style.pointerEvents = "auto";
        });
    }

    function render(animate = true) {
        const baseX = getBasePosition();

        track.style.transition = animate
            ? "transform .55s cubic-bezier(.22,.61,.36,1)"
            : "none";

        cards.forEach(card => {
            card.style.transition = animate
                ? "transform .55s cubic-bezier(.22,.61,.36,1), opacity .45s ease, filter .45s ease"
                : "none";
        });

        track.style.transform =
            "translate3d(" + baseX + "px, 0, 0)";

        updateCards();
    }

    function goTo(index) {
        const total = cards.length;
        currentIndex = ((index % total) + total) % total;
        render(true);
    }

    function next() {
        goTo(currentIndex + 1);
    }

    function previous() {
        goTo(currentIndex - 1);
    }


    /* =========================================================
       FLÈCHES
       Seule méthode de navigation du carrousel.
    ========================================================= */

    if (prevButton) {
        prevButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            previous();
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            next();
        });
    }


    /* =========================================================
       CLAVIER
       Optionnel mais pratique et accessible.
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

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            render(false);
        }, 100);
    }, { passive: true });


    /* =========================================================
       INITIALISATION
    ========================================================= */

    requestAnimationFrame(() => {
        render(false);
    });

});

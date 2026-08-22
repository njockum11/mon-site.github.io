document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       MENU MOBILE
    ========================================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("is-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                mainNav.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* =========================================================
       YOUTUBE — LIGHTBOX
    ========================================================= */

    const modal = document.getElementById("videoModal");
    const frame = document.getElementById("youtubeFrame");
    const modalTitle = document.getElementById("videoModalTitle");

    function openVideo(videoId, videoTitle) {
        if (!modal || !frame || !videoId) return;

        if (modalTitle) {
            modalTitle.textContent = videoTitle || "Vidéo";
        }

        frame.src =
            "https://www.youtube.com/embed/" +
            encodeURIComponent(videoId) +
            "?autoplay=1&rel=0&modestbranding=1";

        frame.title = videoTitle || "Vidéo";

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

    document.querySelectorAll(".youtube-preview, .youtube-trigger").forEach(function (trigger) {
        trigger.addEventListener("click", function (event) {

            /*
             * Un lien YouTube destiné au lightbox est intercepté.
             * Les vrais liens de pages HTML restent normaux.
             */
            if (trigger.dataset.youtube) {
                event.preventDefault();

                openVideo(
                    trigger.dataset.youtube,
                    trigger.dataset.title || "Vidéo"
                );
            }
        });
    });

    document.querySelectorAll("[data-close-video]").forEach(function (element) {
        element.addEventListener("click", closeVideo);
    });

    document.addEventListener("keydown", function (event) {
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

    document.querySelectorAll(".youtube-preview").forEach(function (preview) {
        const id = preview.dataset.youtube;

        if (!id) return;

        preview.style.backgroundImage =
            'linear-gradient(135deg, rgba(7,26,45,.12), rgba(7,26,45,.68)), ' +
            'url("https://img.youtube.com/vi/' +
            encodeURIComponent(id) +
            '/hqdefault.jpg")';

        preview.style.backgroundSize = "cover";
        preview.style.backgroundPosition = "center";
    });


    /* =========================================================
       CARROUSEL 3D — VERSION STABLE

       Navigation UNIQUEMENT par les flèches.
       Aucun pointerdown / pointermove / pointerup.
       Aucun drag souris ou tactile.

       IMPORTANT :
       Le CSS fourni positionne les .carousel-card en absolute.
       Le JS doit donc appliquer leur transform/opacity.
       C'est ce qui manquait dans certaines versions précédentes
       et provoquait le carrousel figé.
    ========================================================= */

    const carousel = document.querySelector(".projects-carousel");
    const track = document.querySelector(".carousel-track");

    if (!carousel || !track) return;

    const cards = Array.from(
        track.querySelectorAll(".carousel-card")
    );

    if (!cards.length) return;

    const prevButton = document.querySelector(".carousel-prev");
    const nextButton = document.querySelector(".carousel-next");

    let currentIndex = 0;
    let resizeTimer = null;


    /* =========================================================
       POSITIONNEMENT VISUEL
    ========================================================= */

    function updateCarousel(animate) {

        const total = cards.length;

        /*
         * Le carrousel CSS utilise des cartes positionnées
         * en absolute à 50% / 50%.
         *
         * On calcule ici la position horizontale de chaque carte.
         */

        cards.forEach(function (card, index) {

            let distance = index - currentIndex;

            /*
             * Rotation circulaire.
             */
            if (distance > total / 2) {
                distance -= total;
            }

            if (distance < -total / 2) {
                distance += total;
            }

            const absDistance = Math.abs(distance);

            let translateX = 0;
            let translateZ = 0;
            let rotateY = 0;
            let scale = 1;
            let opacity = 1;
            let blur = 0;
            let zIndex = 1;

            /*
             * Carte centrale
             */
            if (absDistance === 0) {

                translateX = 0;
                translateZ = 80;
                rotateY = 0;
                scale = 1.12;
                opacity = 1;
                blur = 0;
                zIndex = 30;

            }

            /*
             * Carte immédiatement à gauche
             */
            else if (distance === -1) {

                translateX = -285;
                translateZ = 10;
                rotateY = 14;
                scale = 0.82;
                opacity = 0.65;
                blur = 0;
                zIndex = 20;

            }

            /*
             * Carte immédiatement à droite
             */
            else if (distance === 1) {

                translateX = 285;
                translateZ = 10;
                rotateY = -14;
                scale = 0.82;
                opacity = 0.65;
                blur = 0;
                zIndex = 20;

            }

            /*
             * Cartes plus éloignées.
             */
            else if (distance === -2) {

                translateX = -500;
                translateZ = -50;
                rotateY = 22;
                scale = 0.68;
                opacity = 0.38;
                blur = 0.3;
                zIndex = 10;

            }

            else if (distance === 2) {

                translateX = 500;
                translateZ = -50;
                rotateY = -22;
                scale = 0.68;
                opacity = 0.38;
                blur = 0.3;
                zIndex = 10;

            }

            /*
             * Toutes les autres cartes restent derrière.
             */
            else {

                translateX = distance < 0 ? -650 : 650;
                translateZ = -100;
                rotateY = distance < 0 ? 28 : -28;
                scale = 0.58;
                opacity = 0.18;
                blur = 1;
                zIndex = 1;
            }


            /*
             * Les cartes sont centrées avec left:50% et top:50%.
             * translate(-50%,-50%) conserve ce centrage.
             */
            card.style.transform =
                "translate(-50%, -50%) " +
                "translate3d(" + translateX + "px, 0, " + translateZ + "px) " +
                "rotateY(" + rotateY + "deg) " +
                "scale(" + scale + ")";

            card.style.opacity = String(opacity);
            card.style.zIndex = String(zIndex);

            card.style.filter =
                blur > 0
                    ? "blur(" + blur + "px)"
                    : "none";

            /*
             * Toutes les cartes restent accessibles aux liens.
             * On ne met surtout pas pointer-events:none.
             */
            card.style.pointerEvents = "auto";
        });


        /*
         * Classes conservées pour compatibilité avec d'autres
         * règles éventuelles du site.
         */
        cards.forEach(function (card, index) {

            let distance = index - currentIndex;

            if (distance > total / 2) {
                distance -= total;
            }

            if (distance < -total / 2) {
                distance += total;
            }

            card.classList.remove(
                "is-center",
                "is-left",
                "is-right",
                "is-hidden",
                "is-active",
                "is-prev",
                "is-next"
            );

            if (distance === 0) {
                card.classList.add("is-center", "is-active");
            } else if (distance === -1) {
                card.classList.add("is-left", "is-prev");
            } else if (distance === 1) {
                card.classList.add("is-right", "is-next");
            } else {
                card.classList.add("is-hidden");
            }
        });
    }


    /* =========================================================
       NAVIGATION
    ========================================================= */

    function nextCard() {
        currentIndex =
            (currentIndex + 1) % cards.length;

        updateCarousel(true);
    }

    function previousCard() {
        currentIndex =
            (currentIndex - 1 + cards.length) % cards.length;

        updateCarousel(true);
    }


    /* =========================================================
       FLÈCHES
    ========================================================= */

    if (prevButton) {
        prevButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            previousCard();
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            nextCard();
        });
    }


    /* =========================================================
       CLAVIER
    ========================================================= */

    carousel.setAttribute("tabindex", "0");

    carousel.addEventListener("keydown", function (event) {

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            previousCard();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            nextCard();
        }
    });


    /* =========================================================
       REDIMENSIONNEMENT
    ========================================================= */

    window.addEventListener("resize", function () {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            updateCarousel(false);
        }, 100);

    }, { passive: true });


    /* =========================================================
       INITIALISATION
    ========================================================= */

    requestAnimationFrame(function () {
        updateCarousel(false);
    });

});

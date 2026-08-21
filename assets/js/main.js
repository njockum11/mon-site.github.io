document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       MENU MOBILE
    ========================================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen = mainNav.classList.toggle("is-open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("is-open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

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

        if (modalTitle) {
            modalTitle.textContent = videoTitle;
        }

        frame.src =
            "https://www.youtube.com/embed/" +
            encodeURIComponent(videoId) +
            "?autoplay=1&rel=0&modestbranding=1";

        frame.title = videoTitle;

        modal.classList.add("is-open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    function closeVideo() {

        if (!modal || !frame) return;

        modal.classList.remove("is-open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        frame.src = "";
        frame.title = "";

        document.body.style.overflow = "";
    }


    document
        .querySelectorAll(".youtube-preview, .youtube-trigger")
        .forEach(trigger => {

            trigger.addEventListener("click", event => {

                if (trigger.tagName === "A") {
                    event.preventDefault();
                }

                openVideo(
                    trigger.dataset.youtube,
                    trigger.dataset.title || "Vidéo"
                );

            });

        });


    document
        .querySelectorAll("[data-close-video]")
        .forEach(element => {

            element.addEventListener(
                "click",
                closeVideo
            );

        });


    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            modal?.classList.contains("is-open")
        ) {
            closeVideo();
        }

    });


    /* =========================================================
       MINIATURES YOUTUBE
    ========================================================= */

    document
        .querySelectorAll(".youtube-preview")
        .forEach(preview => {

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
       
       NAVIGATION UNIQUEMENT PAR LES FLÈCHES
       
       PAS DE GLISSÉ SOURIS
       PAS DE DRAG
       PAS DE DÉPLACEMENT DU TRACK
       
       Le CSS contrôle la position des cartes avec :
       
       .is-center
       .is-left
       .is-right
       .is-hidden
    ========================================================= */


    const carousel =
        document.querySelector(".projects-carousel");

    const track =
        document.querySelector(".carousel-track");


    if (!carousel || !track) {
        return;
    }


    const cards =
        Array.from(
            track.querySelectorAll(".carousel-card")
        );


    if (!cards.length) {
        return;
    }


    /* =========================================================
       IMPORTANT
       
       L'INDEX HTML utilise :
       
       .carousel-arrow.carousel-prev
       .carousel-arrow.carousel-next
       
       et non :
       
       .carousel-arrow.prev
       .carousel-arrow.next
    ========================================================= */


    const prevButton =
        document.querySelector(
            ".carousel-arrow.carousel-prev"
        );


    const nextButton =
        document.querySelector(
            ".carousel-arrow.carousel-next"
        );


    let currentIndex = 0;


    /* =========================================================
       MISE À JOUR DU CARROUSEL
    ========================================================= */

    function updateCarousel() {

        const total = cards.length;


        cards.forEach((card, index) => {

            let offset =
                index - currentIndex;


            /*
             * Rotation circulaire.
             *
             * Exemple avec 7 cartes :
             *
             * 0 1 2 3 4 5 6
             *
             * Lorsque 0 est au centre :
             *
             * 6 = gauche
             * 0 = centre
             * 1 = droite
             */

            if (offset > total / 2) {
                offset -= total;
            }


            if (offset < -total / 2) {
                offset += total;
            }


            card.classList.remove(
                "is-center",
                "is-left",
                "is-right",
                "is-hidden"
            );


            /* CENTRE */

            if (offset === 0) {

                card.classList.add(
                    "is-center"
                );

            }


            /* GAUCHE */

            else if (offset === -1) {

                card.classList.add(
                    "is-left"
                );

            }


            /* DROITE */

            else if (offset === 1) {

                card.classList.add(
                    "is-right"
                );

            }


            /* AUTRES CARTES */

            else {

                card.classList.add(
                    "is-hidden"
                );

            }

        });

    }


    /* =========================================================
       CARTE SUIVANTE
    ========================================================= */

    function next() {

        currentIndex =
            (currentIndex + 1) %
            cards.length;

        updateCarousel();

    }


    /* =========================================================
       CARTE PRÉCÉDENTE
    ========================================================= */

    function previous() {

        currentIndex =
            (currentIndex - 1 + cards.length) %
            cards.length;

        updateCarousel();

    }


    /* =========================================================
       FLÈCHE PRÉCÉDENTE
    ========================================================= */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                previous();

            }
        );

    }


    /* =========================================================
       FLÈCHE SUIVANTE
    ========================================================= */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                next();

            }
        );

    }


    /* =========================================================
       NAVIGATION CLAVIER
       
       ← précédente
       → suivante
    ========================================================= */

    carousel.setAttribute(
        "tabindex",
        "0"
    );


    carousel.addEventListener(
        "keydown",
        event => {

            if (event.key === "ArrowRight") {

                event.preventDefault();

                next();

            }


            if (event.key === "ArrowLeft") {

                event.preventDefault();

                previous();

            }

        }
    );


    /* =========================================================
       REDIMENSIONNEMENT
    ========================================================= */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);


            resizeTimer = setTimeout(
                () => {

                    updateCarousel();

                },
                100
            );

        },
        { passive: true }
    );


    /* =========================================================
       INITIALISATION
    ========================================================= */

    updateCarousel();

});

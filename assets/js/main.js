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

        if (!modal || !frame || !videoId) {
            return;
        }

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

        if (!modal || !frame) {
            return;
        }

        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");

        frame.src = "";
        frame.title = "";

        document.body.style.overflow = "";
    }


    /* Déclencheurs YouTube */

    document
        .querySelectorAll(".youtube-preview, .youtube-trigger")
        .forEach(trigger => {

            trigger.addEventListener("click", event => {

                event.preventDefault();
                event.stopPropagation();

                openVideo(
                    trigger.dataset.youtube,
                    trigger.dataset.title || "Vidéo"
                );
            });
        });


    /* Fermeture */

    document
        .querySelectorAll("[data-close-video]")
        .forEach(element => {

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

    document
        .querySelectorAll(".youtube-preview")
        .forEach(preview => {

            const id = preview.dataset.youtube;

            if (!id) {
                return;
            }

            preview.style.backgroundImage =
                "linear-gradient(135deg, rgba(7,26,45,.12), rgba(7,26,45,.68)), " +
                "url(\"https://img.youtube.com/vi/" +
                encodeURIComponent(id) +
                "/hqdefault.jpg\")";

            preview.style.backgroundSize = "cover";
            preview.style.backgroundPosition = "center";
        });


    /* =========================================================
       CARROUSEL
       Navigation uniquement avec les flèches.
       
       IMPORTANT :
       - pas de drag
       - pas de swipe
       - carte centrale dominante
       - cartes latérales atténuées
       - cartes non centrales non cliquables
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
       BON SÉLECTEURS DES FLÈCHES
       
       Le HTML utilise :
       .carousel-arrow.carousel-prev
       .carousel-arrow.carousel-next
       ========================================================= */

    const prevButton =
        document.querySelector(".carousel-arrow.carousel-prev");

    const nextButton =
        document.querySelector(".carousel-arrow.carousel-next");


    let currentIndex = 0;
    let isAnimating = false;


    /* =========================================================
       POSITIONNEMENT DES CARTES
    ========================================================= */

    function updateCarousel(animate = true) {

        const total = cards.length;

        cards.forEach((card, index) => {

            /*
             * Distance circulaire par rapport à la carte centrale.
             */

            let distance = index - currentIndex;

            if (distance > total / 2) {
                distance -= total;
            }

            if (distance < -total / 2) {
                distance += total;
            }


            /*
             * Réinitialisation des classes.
             */

            card.classList.remove(
                "is-active",
                "is-prev",
                "is-next",
                "is-hidden"
            );


            /*
             * Carte centrale
             */

            if (distance === 0) {

                card.classList.add("is-active");

                card.style.pointerEvents = "auto";

                card.setAttribute(
                    "aria-hidden",
                    "false"
                );

                return;
            }


            /*
             * Carte précédente
             */

            if (distance === -1) {

                card.classList.add("is-prev");

                card.style.pointerEvents = "none";

                card.setAttribute(
                    "aria-hidden",
                    "true"
                );

                return;
            }


            /*
             * Carte suivante
             */

            if (distance === 1) {

                card.classList.add("is-next");

                card.style.pointerEvents = "none";

                card.setAttribute(
                    "aria-hidden",
                    "true"
                );

                return;
            }


            /*
             * Toutes les autres cartes
             */

            card.classList.add("is-hidden");

            card.style.pointerEvents = "none";

            card.setAttribute(
                "aria-hidden",
                "true"
            );
        });


        /*
         * Permet de bloquer brièvement les clics pendant
         * l'animation afin d'éviter les doubles changements.
         */

        if (animate) {

            isAnimating = true;

            window.setTimeout(() => {
                isAnimating = false;
            }, 480);

        }
    }


    /* =========================================================
       NAVIGATION
    ========================================================= */

    function goTo(index) {

        if (isAnimating) {
            return;
        }

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


    /* =========================================================
       FLÈCHE PRÉCÉDENTE
    ========================================================= */

    if (prevButton) {

        prevButton.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            previous();
        });
    }


    /* =========================================================
       FLÈCHE SUIVANTE
    ========================================================= */

    if (nextButton) {

        nextButton.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            next();
        });
    }


    /* =========================================================
       CLAVIER
       Flèches gauche / droite.
    ========================================================= */

    carousel.setAttribute(
        "tabindex",
        "0"
    );

    carousel.addEventListener("keydown", event => {

        if (event.key === "ArrowLeft") {

            event.preventDefault();

            previous();
        }

        if (event.key === "ArrowRight") {

            event.preventDefault();

            next();
        }
    });


    /* =========================================================
       PROTECTION CONTRE LE DRAG
       
       Aucun glisser-déposer ne doit être utilisé pour naviguer.
    ========================================================= */

    carousel.addEventListener(
        "dragstart",
        event => {
            event.preventDefault();
        }
    );


    /* =========================================================
       INITIALISATION
    ========================================================= */

    updateCarousel(false);


    /* =========================================================
       REDIMENSIONNEMENT
    ========================================================= */

    let resizeTimer = null;

    window.addEventListener(
        "resize",
        () => {

            window.clearTimeout(resizeTimer);

            resizeTimer = window.setTimeout(() => {

                updateCarousel(false);

            }, 150);
        },
        { passive: true }
    );

});

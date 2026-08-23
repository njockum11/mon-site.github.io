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
       YOUTUBE — LIGHTBOX EXISTANTE
       Cannes / Projet Calypso / autres teasers
       NE PAS MODIFIER LEUR FONCTIONNEMENT
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
function openVimeo(videoId, videoTitle) {

    if (!modal || !frame || !videoId) return;

    if (modalTitle) {
        modalTitle.textContent =
            videoTitle || "Vidéo";
    }

    frame.src =
        "https://player.vimeo.com/video/" +
        encodeURIComponent(videoId) +
        "?autoplay=1";

    frame.title =
        videoTitle || "Vidéo";

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
/* =========================================================
   RÉCUPÉRATION AUTOMATIQUE DES VIGNETTES VIDÉO
   YouTube + Vimeo
========================================================= */

function loadVideoThumbnails() {

    document
        .querySelectorAll(".youtube-preview, .video-preview")
        .forEach(function (button) {

            let thumbnailUrl = "";

            /* YouTube */
            if (button.dataset.youtube) {

                thumbnailUrl =
                    "https://img.youtube.com/vi/" +
                    encodeURIComponent(button.dataset.youtube) +
                    "/hqdefault.jpg";
            }

            /* Vimeo */
            else if (button.dataset.vimeo) {

                thumbnailUrl =
                    "https://vumbnail.com/" +
                    encodeURIComponent(button.dataset.vimeo) +
                    ".jpg";
            }

            if (!thumbnailUrl) return;


            /* Évite de créer deux images */
            if (button.querySelector(".video-thumbnail")) return;


            const image =
                document.createElement("img");

            image.className = "video-thumbnail";

            image.src = thumbnailUrl;

            image.alt =
                button.dataset.title || "Aperçu vidéo";

            image.loading = "lazy";


            /*
             * L'image est placée en premier
             * pour rester derrière le bouton lecture.
             */
            button.insertBefore(
                image,
                button.firstChild
            );

        });
}


/* Lancement après chargement du DOM */
loadVideoThumbnails();

    /*
     * TEASERS EXISTANTS
     *
     * Cette partie reste volontairement inchangée.
     */
document
    .querySelectorAll(".youtube-preview, .youtube-trigger, .video-preview")
    .forEach(function (trigger) {

        trigger.addEventListener("click", function (event) {

            event.preventDefault();

            const title =
                trigger.dataset.title || "Vidéo";

            /* Vimeo */
            if (trigger.dataset.vimeo) {

                openVimeo(
                    trigger.dataset.vimeo,
                    title
                );

                return;
            }

            /* YouTube */
            if (trigger.dataset.youtube) {

                openVideo(
                    trigger.dataset.youtube,
                    title
                );

            }

        });

    });


    /* =========================================================
       VILLE DU CANNET
       
       AJOUT UNIQUEMENT POUR :
       .video-trigger
       data-video-id="aDXrQOPYqX0"
    ========================================================= */

    document
        .querySelectorAll(".video-trigger")
        .forEach(function (trigger) {

            trigger.addEventListener("click", function (event) {

                event.preventDefault();

                openVideo(
                    trigger.dataset.videoId,
                    trigger.dataset.title || "Ville du Cannet — film"
                );

            });

        });


    /* =========================================================
       FERMETURE DE LA FENÊTRE VIDÉO
    ========================================================= */

    document
        .querySelectorAll("[data-close-video]")
        .forEach(function (element) {

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
       CARROUSEL
       
       FLÈCHES UNIQUEMENT
       PAS DE DRAG
    ========================================================= */

    const carousel = document.querySelector(".projects-carousel");
    const track = document.querySelector(".carousel-track");

    /*
     * Si la page ne possède pas de carrousel,
     * on arrête uniquement la partie carrousel.
     * Le système vidéo ci-dessus reste fonctionnel.
     */
    if (!carousel || !track) return;

    const cards = Array.from(
        track.querySelectorAll(".carousel-card")
    );

    if (!cards.length) return;

    const prevButton =
        document.querySelector(".carousel-prev");

    const nextButton =
        document.querySelector(".carousel-next");

    let currentIndex = 0;
    let resizeTimer = null;


    /* =========================================================
       POSITIONNEMENT
    ========================================================= */

    function updateCarousel() {

        const total = cards.length;

        cards.forEach(function (card, index) {

            let distance = index - currentIndex;

            if (distance > total / 2) {
                distance -= total;
            }

            if (distance < -total / 2) {
                distance += total;
            }

            let translateX = 0;
            let translateZ = 0;
            let rotateY = 0;
            let scale = 1;
            let opacity = 1;
            let blur = 0;
            let zIndex = 1;


            /* CENTRE */

            if (distance === 0) {

                translateX = 0;
                translateZ = 80;
                rotateY = 0;
                scale = 1.12;
                opacity = 1;
                zIndex = 30;

            }


            /* GAUCHE */

            else if (distance === -1) {

                translateX = -285;
                translateZ = 10;
                rotateY = 14;
                scale = .82;
                opacity = .65;
                zIndex = 20;

            }


            /* DROITE */

            else if (distance === 1) {

                translateX = 285;
                translateZ = 10;
                rotateY = -14;
                scale = .82;
                opacity = .65;
                zIndex = 20;

            }


            /* GAUCHE ÉLOIGNÉE */

            else if (distance === -2) {

                translateX = -500;
                translateZ = -50;
                rotateY = 22;
                scale = .68;
                opacity = .38;
                blur = .3;
                zIndex = 10;

            }


            /* DROITE ÉLOIGNÉE */

            else if (distance === 2) {

                translateX = 500;
                translateZ = -50;
                rotateY = -22;
                scale = .68;
                opacity = .38;
                blur = .3;
                zIndex = 10;

            }


            /* AUTRES */

            else {

                translateX = distance < 0 ? -650 : 650;
                translateZ = -100;
                rotateY = distance < 0 ? 28 : -28;
                scale = .58;
                opacity = .18;
                blur = 1;
                zIndex = 1;

            }


            card.style.transform =
                "translate(-50%, -50%) " +
                "translate3d(" +
                translateX +
                "px,0," +
                translateZ +
                "px) " +
                "rotateY(" +
                rotateY +
                "deg) " +
                "scale(" +
                scale +
                ")";

            card.style.opacity = String(opacity);
            card.style.zIndex = String(zIndex);

            card.style.filter =
                blur > 0
                    ? "blur(" + blur + "px)"
                    : "none";

            card.style.pointerEvents = "auto";


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

                card.classList.add(
                    "is-center",
                    "is-active"
                );

            } else if (distance === -1) {

                card.classList.add(
                    "is-left",
                    "is-prev"
                );

            } else if (distance === 1) {

                card.classList.add(
                    "is-right",
                    "is-next"
                );

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

        updateCarousel();
    }


    function previousCard() {

        currentIndex =
            (currentIndex - 1 + cards.length) %
            cards.length;

        updateCarousel();
    }


    /* =========================================================
       FLÈCHES
    ========================================================= */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                previousCard();

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                nextCard();

            }
        );

    }


    /* =========================================================
       CLAVIER
    ========================================================= */

    carousel.setAttribute(
        "tabindex",
        "0"
    );


    carousel.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "ArrowLeft") {

                event.preventDefault();
                previousCard();

            }

            if (event.key === "ArrowRight") {

                event.preventDefault();
                nextCard();

            }

        }
    );


    /* =========================================================
       REDIMENSIONNEMENT
    ========================================================= */

    window.addEventListener(
        "resize",
        function () {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(
                function () {
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

    requestAnimationFrame(function () {
        updateCarousel();
    });

});

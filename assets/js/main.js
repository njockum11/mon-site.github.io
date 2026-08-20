document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MENU MOBILE
    ========================= */

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


    /* =========================
       YOUTUBE — LIGHTBOX
       L'iframe n'existe qu'après clic.
    ========================= */

    const modal = document.querySelector("#videoModal");
    const frame = document.querySelector("#youtubeFrame");
    const title = document.querySelector("#videoModalTitle");
    const videoTriggers = document.querySelectorAll(
        ".youtube-preview, .youtube-trigger"
    );

    function openVideo(videoId, videoTitle = "Vidéo") {
        if (!modal || !frame) return;

        title.textContent = videoTitle;

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

        // Détruit l'iframe à la fermeture : arrêt immédiat de la vidéo.
        frame.src = "";
        frame.title = "";

        document.body.style.overflow = "";
    }

    videoTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
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


    /* =========================
       PREVIEWS YOUTUBE
       Les miniatures sont chargées comme images,
       mais aucun lecteur n'est chargé.
    ========================= */

    document.querySelectorAll(".youtube-preview").forEach(preview => {
        const id = preview.dataset.youtube;

        if (!id) return;

        preview.style.backgroundImage =
            `linear-gradient(135deg, rgba(7,26,45,.16), rgba(7,26,45,.72)), ` +
            `url("https://img.youtube.com/vi/${encodeURIComponent(id)}/hqdefault.jpg")`;

        preview.style.backgroundSize = "cover";
        preview.style.backgroundPosition = "center";
    });

});
/* =========================================================
   PARALLAX SOURIS — HERO + SAVOIR-FAIRE
========================================================= */

(() => {
    const hero = document.querySelector(".hero");
    const heroBg = document.querySelector(".hero-bg");
    const skillCards = document.querySelectorAll(".skill-card");

    if (!hero && !skillCards.length) return;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5);
        mouseY = (event.clientY / window.innerHeight - 0.5);

        /* Bannière */
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

        /* Cartes savoir-faire */
        skillCards.forEach((card, index) => {
            const intensity = index % 2 === 0 ? 5 : 3;

            card.style.setProperty(
                "--card-x",
                `${mouseX * intensity}px`
            );

            card.style.setProperty(
                "--card-y",
                `${mouseY * intensity}px`
            );
        });
    });

    /* Retour à la position neutre lorsque la souris quitte la fenêtre */
    document.addEventListener("mouseleave", () => {
        if (heroBg) {
            heroBg.style.setProperty("--parallax-x", "0px");
            heroBg.style.setProperty("--parallax-y", "0px");
        }

        skillCards.forEach((card) => {
            card.style.setProperty("--card-x", "0px");
            card.style.setProperty("--card-y", "0px");
        });
    });
})();

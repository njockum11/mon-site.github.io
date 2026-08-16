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

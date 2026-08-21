document.addEventListener("DOMContentLoaded", () => {
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

    const modal = document.querySelector("#videoModal");
    const frame = document.querySelector("#youtubeFrame");
    const title = document.querySelector("#videoModalTitle");
    const videoTriggers = document.querySelectorAll(".youtube-preview, .youtube-trigger");

    function openVideo(videoId, videoTitle = "Vidéo") {
        if (!modal || !frame) return;
        title.textContent = videoTitle;
        frame.src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1`;
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
        trigger.addEventListener("click", () => openVideo(trigger.dataset.youtube, trigger.dataset.title || "Vidéo"));
    });
    document.querySelectorAll("[data-close-video]").forEach(element => element.addEventListener("click", closeVideo));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal?.classList.contains("is-open")) closeVideo();
    });

    document.querySelectorAll(".youtube-preview").forEach(preview => {
        const id = preview.dataset.youtube;
        if (!id) return;
        preview.style.backgroundImage =
            `linear-gradient(135deg, rgba(7,26,45,.16), rgba(7,26,45,.72)), url("https://img.youtube.com/vi/${encodeURIComponent(id)}/hqdefault.jpg")`;
        preview.style.backgroundSize = "cover";
        preview.style.backgroundPosition = "center";
    });

    /* =====================================================
       CARROUSEL 3D — ordinateur
       Sur mobile : une carte à la fois + balayage tactile.
    ===================================================== */
    const track = document.querySelector(".projects-track");
    const cards = Array.from(document.querySelectorAll(".project-card"));
    const prev = document.querySelector(".carousel-prev");
    const next = document.querySelector(".carousel-next");

    if (track && cards.length) {
        let current = 0;

        function renderCarousel() {
            const mobile = window.matchMedia("(max-width:760px)").matches;

            cards.forEach((card, index) => {
                card.classList.remove("is-active", "is-side-left", "is-side-right", "is-hidden");
                if (mobile) {
                    if (index === current) card.classList.add("is-active");
                    else card.classList.add("is-hidden");
                } else {
                    const offset = (index - current + cards.length) % cards.length;
                    if (offset === 0) card.classList.add("is-active");
                    else if (offset === 1 || offset === cards.length - 1) {
                        card.classList.add(offset === 1 ? "is-side-right" : "is-side-left");
                    } else card.classList.add("is-hidden");
                }
            });
        }

        function go(step) {
            current = (current + step + cards.length) % cards.length;
            renderCarousel();
        }

        prev?.addEventListener("click", () => go(-1));
        next?.addEventListener("click", () => go(1));

        let startX = null;
        track.addEventListener("pointerdown", e => {
            if (e.pointerType === "mouse") return;
            startX = e.clientX;
        });
        track.addEventListener("pointerup", e => {
            if (startX === null) return;
            const delta = e.clientX - startX;
            if (Math.abs(delta) > 45) go(delta < 0 ? 1 : -1);
            startX = null;
        });

        window.addEventListener("resize", renderCarousel);
        renderCarousel();
    }

    /* =====================================================
       PARALLAX — bannière + savoir-faire uniquement
    ===================================================== */
    const hero = document.querySelector(".hero");
    const heroBg = document.querySelector(".hero-bg");
    const skillCards = document.querySelectorAll(".skill-card");

    if (!hero && !skillCards.length) return;

    let mouseX = 0, mouseY = 0;
    document.addEventListener("mousemove", event => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;

        if (heroBg) {
            heroBg.style.setProperty("--parallax-x", `${mouseX * 10}px`);
            heroBg.style.setProperty("--parallax-y", `${mouseY * 7}px`);
        }

        skillCards.forEach((card, index) => {
            const intensity = index % 2 === 0 ? 5 : 3;
            card.style.setProperty("--card-x", `${mouseX * intensity}px`);
            card.style.setProperty("--card-y", `${mouseY * intensity}px`);
        });
    });

    document.addEventListener("mouseleave", () => {
        if (heroBg) {
            heroBg.style.setProperty("--parallax-x", "0px");
            heroBg.style.setProperty("--parallax-y", "0px");
        }
        skillCards.forEach(card => {
            card.style.setProperty("--card-x", "0px");
            card.style.setProperty("--card-y", "0px");
        });
    });
});
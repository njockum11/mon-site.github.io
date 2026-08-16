document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MENU MOBILE
    ========================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                mainNav.classList.toggle("is-open");

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


    /* =========================
       FILTRES DES RÉALISATIONS
    ========================= */

    const filterButtons =
        document.querySelectorAll(".filter-button");

    const projectCards =
        document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter = button.dataset.filter;

            filterButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            projectCards.forEach(card => {

                const category = card.dataset.category;

                if (
                    filter === "all" ||
                    category === filter
                ) {
                    card.classList.remove("is-hidden");
                } else {
                    card.classList.add("is-hidden");
                }

            });

        });

    });


    /* =========================
       LIENS PROVISOIRES
    ========================= */

    document.querySelectorAll(
        '.project-link[href="#"]'
    ).forEach(link => {

        link.addEventListener("click", event => {
            event.preventDefault();
        });

    });

});

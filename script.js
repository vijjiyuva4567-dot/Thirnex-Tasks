/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        const isOpen = navLinks.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    const navigationItems = navLinks.querySelectorAll("a");

    navigationItems.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.textContent = "☰";
        });

    });
}


/* =========================================
   DARK / LIGHT THEME
========================================= */

const themeButton = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-theme");

    if (themeButton) {
        themeButton.textContent = "☀️";
    }
}

if (themeButton) {

    themeButton.addEventListener("click", function () {

        document.body.classList.toggle("dark-theme");

        const isDark =
            document.body.classList.contains("dark-theme");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        themeButton.textContent =
            isDark ? "☀️" : "🌙";
    });
}


/* =========================================
   CONTACT FORM
========================================= */

const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const nameElement = document.getElementById("name");
        const emailElement = document.getElementById("email");
        const messageElement = document.getElementById("message");

        const name = nameElement
            ? nameElement.value.trim()
            : "";

        const email = emailElement
            ? emailElement.value.trim()
            : "";

        const message = messageElement
            ? messageElement.value.trim()
            : "";

        if (
            name === "" ||
            email === "" ||
            message === ""
        ) {

            if (formMessage) {
                formMessage.textContent =
                    "Please fill in all fields.";

                formMessage.classList.add("show");
            }

            return;
        }

        if (formMessage) {

            formMessage.textContent =
                "Your message has been submitted successfully!";

            formMessage.classList.add("show");
        }

        contactForm.reset();
    });
}


/* =========================================
   CURRENT YEAR
========================================= */

const footerText =
    document.querySelector(".footer-content p");

if (footerText) {

    footerText.textContent =
        `© ${new Date().getFullYear()} Vijayalakshmi. All Rights Reserved.`;
}
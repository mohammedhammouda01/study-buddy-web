const navLinks = document.querySelectorAll(".nav-link");
const menuIcon = document.querySelector(".menu-icon");
const navMenu = document.querySelector(".nav-links");

// active state
navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove("active"));
        this.classList.add("active");

        navMenu.classList.remove("show");
        menuIcon.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

// toggle menu
menuIcon.addEventListener("click", () => {
    navMenu.classList.toggle("show");

    if (navMenu.classList.contains("show")) {
        menuIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
        menuIcon.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
});

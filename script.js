function toggleMenu() {
    var navElement = document.querySelector('.nav');
    var verticalLineElement = document.querySelector('.vertical-line');
    var contactElement = document.querySelector('.contact');

    navElement.classList.toggle('show-menu');
    verticalLineElement.classList.toggle('hide-element');
    contactElement.classList.toggle('hide-element');
}

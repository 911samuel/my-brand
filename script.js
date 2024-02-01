function save(event) {
    event.preventDefault();
    localStorage.setItem("my-email", document.getElementById('email').value);
    localStorage.setItem("my-password", document.getElementById('password').value);
    localStorage.setItem("my-first-name", document.getElementById('fname').value);
    localStorage.setItem("my-last-name", document.getElementById('lname').value);
    localStorage.setItem("sender-name", document.getElementById('senderName').value);
    localStorage.setItem("sender-email", document.getElementById('senderEmail').value);
    localStorage.setItem("sender-subject", document.getElementById('subject').value);
    localStorage.setItem("sender-message", document.getElementById('message').value);
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('load', () => {
        document.getElementById('signupForm').addEventListener('submit', (event) => {
            const signupEmail = document.getElementById('signupEmail').value;
            const signupPassword = document.getElementById('signupPassword').value;

            if (signupEmail === "" || signupPassword === "") {
                alert("Please fill out all fields");
            } else if (signupPassword.length < 8) {
                alert("Password must be at least 8 characters long");
            } else if (!(/[A-Z]/.test(signupPassword))) {
                alert("Password must contain at least one uppercase letter.");
            } else if (!/[a-z]/.test(signupPassword)) {
                alert("Password must contain at least one lowercase letter.");
            } else if (!isNaN(signupPassword.charAt(0))) {
                alert("Password cannot start with a number.");
                return; 
            } else {
                save(event);
                alert("Account created successfully!");
                return true;
            }

            event.preventDefault();
        });

        document.getElementById('signinForm').addEventListener('submit', function login(event) {
            event.preventDefault();

            const signinEmail = document.getElementById('signinEmail').value;
            const signinPassword = document.getElementById('signinPassword').value;

            let loginEmail = localStorage.getItem('my-email');
            let loginPassword = localStorage.getItem('my-password');

            if (signinEmail === loginEmail) {
                if (signinPassword === loginPassword) {
                    alert(`Welcome back, ${localStorage.getItem('my-first-name')}`);
                } else {
                    alert('Wrong Password');
                }
            } else {
                alert('User not found! Please create an account first.');
            }
        });

        document.getElementById('contactForm').addEventListener('submit', (event) => {
            const form = document.getElementById('contactForm');

            if (form && form.checkValidity()) {
                save(event);
                alert("Thank you for filling out the form!");
            } else {
                alert("Please fill out the form before submitting.");
            }

            event.preventDefault();
        });
    });
});

function toggleMenu() {
    const navElement = document.querySelector('.nav');
    const verticalLineElement = document.querySelector('.vertical-line');
    const contactElement = document.querySelector('.contact');

    navElement.classList.toggle('show-menu');
    verticalLineElement.classList.toggle('hide-element');
    contactElement.classList.toggle('hide-element');
}
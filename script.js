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


document.getElementById('signupForm').addEventListener('submit', (event) => {
    const myEmail = document.getElementById('email').value;
    const myPassword = document.getElementById('password').value;

    if (myEmail === "" || myPassword === "") {
        alert("Please fill out all fields");
    } else if (myPassword.length < 8) {
        alert("Password must be at least 8 characters long");
    } else if (!(/[A-Z]/.test(myPassword))) {
        alert("Password must contain at least one uppercase letter.");
    } else if (!/[a-z]/.test(myPassword)) {
        alert("Password must contain at least one lowercase letter.");
    } else if (!isNaN(myPassword.charAt(0))) {
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

    const myEmail = document.getElementById('email').value;
    const myPassword = document.getElementById('password').value;

    let loginEmail = localStorage.getItem('my-email');
    let loginPassword = localStorage.getItem('my-password');

    if (myEmail === loginEmail) {
        if (myPassword === loginPassword) {
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


function toggleMenu() {
    const navElement = document.querySelector('.nav');
    const verticalLineElement = document.querySelector('.vertical-line');
    const contactElement = document.querySelector('.contact');
    
    navElement.classList.toggle('show-menu');
    verticalLineElement.classList.toggle('hide-element');
    contactElement.classList.toggle('hide-element');
}
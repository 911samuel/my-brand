let myEmail = document.getElementById('email').value;
let myPassword = document.getElementById('password').value;
let myFirstName = document.getElementById('fname').value;
let myLastName = document.getElementById('lname').value;
let senderName = document.getElementById('senderName').value;
let senderEmail = document.getElementById('senderEmail').value;
let subject = document.getElementById('subject').value;
let message = document.getElementById('message').value;
let form = document.getElementById('contactForm');
    
function save(event) {
    event.preventDefault();
    localStorage.setItem("my-email", myEmail);
    localStorage.setItem("my-password", myPassword);
    localStorage.setItem("my-first-name", myFirstName);
    localStorage.setItem("my-last-name", myLastName);
    localStorage.setItem("sender-name", senderName);
    localStorage.setItem("sender-email", senderEmail);
    localStorage.setItem("sender-subject", subject);
    localStorage.setItem("sender-message", message);
}

function login(event) {
    event.preventDefault();

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
}

addEventListener('submit', (event) => {
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
    } else {
        save(event);
        return true;
    }

    event.preventDefault();
});

document.getElementById('contactForm').addEventListener('submit', function(event){
    var form = document.getElementById('contactForm');

    if (form && form.checkValidity()) {
        save(event);
        alert("Thank you for filling out the form!");
    } else {
        alert("Please fill out the form before submitting.");
    }

    event.preventDefault();
});


function toggleMenu() {
    var navElement = document.querySelector('.nav');
    var verticalLineElement = document.querySelector('.vertical-line');
    var contactElement = document.querySelector('.contact');

    navElement.classList.toggle('show-menu');
    verticalLineElement.classList.toggle('hide-element');
    contactElement.classList.toggle('hide-element');
}
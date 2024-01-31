const username = document.getElementById('email');
const  password = document.getElementById('password');

function save(event) {
    event.preventDefault();

    let myEmail = document.getElementById('email').value;
    let myPassword = document.getElementById('password').value;
    let myFirstName = document.getElementById('fname').value;
    let myLatsName = document.getElementById('lname').value;

    localStorage.setItem("my-email", myEmail);
    localStorage.setItem("my password", myPassword);
    localStorage.setItem("my first name", myFirstName);
    localStorage.setItem("my last name", myLatsName);   
}

addEventListener('submit', (event) => {
    if(username.value == "" || password.value == ""){
        alert("Please fill out all fields");
        }else if(password.value .length < 8) {
            alert("Password must be at least 8 characters long")
        } else if(!(/[A-Z]/.test(password.value))) {
            alert("Password must contain at least one uppercase letter.")
        } else if (!/[a-z]/.test(password.value)) {
            alert("Password must contain at least one lowercase letter.")
        } else if (!isNaN(password.value.charAt(0))) {
            alert("Password cannot start with a number.");
        } else {
          return true;
      }
      event.preventDefault();
      save(event);
});



document.getElementById('contactForm').addEventListener('submit', (Event) =>{
    alert("Thank you for filling out the form!");
    Event.preventDefault();
});

function toggleMenu() {
    var navElement = document.querySelector('.nav');
    var verticalLineElement = document.querySelector('.vertical-line');
    var contactElement = document.querySelector('.contact');

    navElement.classList.toggle('show-menu');
    verticalLineElement.classList.toggle('hide-element');
    contactElement.classList.toggle('hide-element');
}



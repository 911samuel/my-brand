function showToast(message) {

  const toast = document.createElement("div");

  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = "transparent";
  toast.style.color = "red";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "5px";
  toast.style.zIndex = "1000";
  toast.style.fontSize = "16px";
  toast.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";

  document.body.appendChild(toast);

  setTimeout(function () {
    document.body.removeChild(toast);
  }, 3000);
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@(gmail\.com|outlook\.com)$/;
  return regex.test(email);
}

function signUp(event) {
  event.preventDefault();
  const signupFirstName = document.getElementById("fname").value;
  const signupLastName = document.getElementById("lname").value;
  const signupEmail = document.getElementById("email").value;
  const signupPassword = document.getElementById("password").value;

  if(!signupFirstName){
    showToast('First name cannot be empty');
  } else if(!signupLastName){
    showToast('Last name cannot be empty')
  } else if (!isValidEmail(signupEmail)) {
    showToast("Please enter a valid email address from Gmail or Outlook");
  } else if (signupPassword.length < 8) {
    showToast("Password must be at least 8 characters long");
  } else if (!/[A-Z]/.test(signupPassword)) {
    showToast("Password must contain at least one uppercase letter.");
  } else if (!/[a-z]/.test(signupPassword)) {
    showToast("Password must contain at least one lowercase letter.");
  } else if (!isNaN(signupPassword.charAt(0))) {
    showToast("Password cannot start with a number.");
    return;
  }
  showToast("Account created successfully!")
  save(document.getElementById("signupForm"));
  setTimeout(function () {
    window.location.href = "signin.html"; 
  }, 2000);
}

function signIn(event) {
  event.preventDefault();
  const signinEmail = document.getElementById("email").value;
  const signinPassword = document.getElementById("password").value;

  const loginEmail = localStorage.getItem("email");
  const loginPassword = localStorage.getItem("password");

  if (signinEmail === loginEmail) {
    if (signinPassword === loginPassword) {
      showToast(`Welcome back, ${localStorage.getItem("lname")}`);
    } else {
      alert("Wrong Password");
    }
  } else {
    showToast("User not found! Please create an account first.");
  }
};

function contact(event) {
  if (contactForm && contactForm.checkValidity()) {
    save(document.getElementById("contactForm"));
    showToast("Thank you for filling out the form!");
  } else {
    showToast("Please fill out the form before submitting.");
  }

  event.preventDefault();
};

function save(form) {
  const formData = new FormData(form);

  for (const [key, value] of formData.entries()) {
    localStorage.setItem(key, value);
  }
}

function toggleMenu() {
  const navElement = document.querySelector(".nav");
  const verticalLineElement = document.querySelector(".vertical-line");
  const contactElement = document.querySelector(".contact");

  navElement.classList.toggle("show-menu");
  verticalLineElement.classList.toggle("hide-element");
  contactElement.classList.toggle("hide-element");
}

function save(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  for (const [key, value] of formData.entries()) {
    localStorage.setItem(key, value);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const signinForm = document.getElementById("signinForm");
  const contactForm = document.getElementById("contactForm");
  const commonAncestor = document.body; 

  signupForm.addEventListener("submit", (event) => {
    const signupEmail = document.getElementById("signupEmail").value;
    const signupPassword = document.getElementById("signupPassword").value;

    if (signupEmail === "" || signupPassword === "") {
      alert("Please fill out all fields");
    } else if (signupPassword.length < 8) {
      alert("Password must be at least 8 characters long");
    } else if (!/[A-Z]/.test(signupPassword)) {
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

  signinForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const signinEmail = document.getElementById("signinEmail").value;
    const signinPassword = document.getElementById("signinPassword").value;

    const loginEmail = localStorage.getItem("my-email");
    const loginPassword = localStorage.getItem("my-password");

    if (signinEmail === loginEmail) {
      if (signinPassword === loginPassword) {
        alert(`Welcome back, ${localStorage.getItem("my-first-name")}`);
      } else {
        alert("Wrong Password");
      }
    } else {
      alert("User not found! Please create an account first.");
    }
  });

  contactForm.addEventListener("submit", (event) => {
    if (contactForm && contactForm.checkValidity()) {
      save(event);
      alert("Thank you for filling out the form!");
    } else {
      alert("Please fill out the form before submitting.");
    }

    event.preventDefault();
  });

  commonAncestor.addEventListener("click", (event) => {
    if (event.target.id === "menu-toggle") {
      toggleMenu();
    }
  });
});

function toggleMenu() {
  const navElement = document.querySelector(".nav");
  const verticalLineElement = document.querySelector(".vertical-line");
  const contactElement = document.querySelector(".contact");

  navElement.classList.toggle("show-menu");
  verticalLineElement.classList.toggle("hide-element");
  contactElement.classList.toggle("hide-element");
}

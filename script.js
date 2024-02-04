function showToast(message, inputId) {
  const toast = document.createElement("div");

  toast.textContent = message;
  toast.classList.add("toast", "error");

  const inputElement = document.getElementById(inputId);
  if (!inputElement) {
    console.error(`Input element with id '${inputId}' not found.`);
    return;
  }

  toast.style.position = "absolute";
  toast.style.top = `${inputElement.offsetTop + inputElement.offsetHeight}px`;
  toast.style.left = `${inputElement.offsetLeft}px`;

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

  if (!signupFirstName) {
    showToast("First name cannot be empty", "fname");
  } else if (!signupLastName) {
    showToast("Last name cannot be empty", "lname");
  } else if (!isValidEmail(signupEmail)) {
    showToast(
      "Please enter a valid email address from Gmail or Outlook",
      "email"
    );
  } else if (signupPassword.length < 8) {
    showToast("Password must be at least 8 characters long", "password");
  } else if (!/[A-Z]/.test(signupPassword)) {
    showToast(
      "Password must contain at least one uppercase letter.",
      "password"
    );
  } else if (!/[a-z]/.test(signupPassword)) {
    showToast(
      "Password must contain at least one lowercase letter.",
      "password"
    );
  } else if (!isNaN(signupPassword.charAt(0))) {
    showToast("Password cannot start with a number.", "password");
  } else {
    showToast("Account created successfully!");
    save(document.getElementById("signupForm"));
    setTimeout(function () {
      window.location.href = "signin.html";
    }, 2000);
  }
}

function signIn(event) {
  event.preventDefault();

  const signinEmail = document.getElementById("email").value;
  const signinPassword = document.getElementById("password").value;

  const loginEmail = localStorage.getItem("email");
  const loginPassword = localStorage.getItem("password");

  if (signinEmail === loginEmail && signinPassword === loginPassword) {
    showToast(`Welcome back, ${localStorage.getItem("lname")}`, "in");
    setTimeout(function () {
      window.location.href = "admin-dashboard-blogs.html";
    }, 2000);
  } else {
    showToast("Wrong Email or Password", "password");
  }
}

function contact(event) {
  event.preventDefault();

  if (contactForm && contactForm.checkValidity()) {
    save(document.getElementById("contactForm"));
    showToast("Thank you for filling out the form!");
  } else {
    showToast("Please fill out the form before submitting.");
  }
}

function imageUpload() {
  const fileInput = document.getElementById("myFile");
  const displayFile = document.querySelector(".displayFile");

  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const previewImage = document.createElement("img");
      previewImage.src = e.target.result;

      previewImage.style.width = "100%";
      previewImage.style.height = "400px";
      displayFile.innerHTML = "";
      displayFile.appendChild(previewImage);
    };

    reader.readAsDataURL(file);
  } else {
    displayFile.innerHTML = "";
  }
}

function fetchAndDisplayBlogs() {
  fetch("http://localhost:3000/blogs")
    .then((response) => response.json())
    .then((data) => {
      const blogsContainer = document.querySelector(".blogs");

      data.forEach((blog) => {
        const blogElement = createBlogElement(blog);
        blogsContainer.appendChild(blogElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching blogs:", error);
    });
}

function createBlogElement(blog) {
  const gdElement = document.createElement("div");
  gdElement.classList.add("gd");

  return gdElement;
}

function uploadBlog() {

  const form = document.getElementById("uploadForm"); 
  const formData = new FormData(form);

  const uploadEndpoint = 'http://localhost:3000/upload';

  fetch(uploadEndpoint, {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to upload blog');
      }
    })
    .then((data) => {
      fetchAndDisplayBlogs();
    })
    .catch((error) => {
      console.error('Error:', error.message);
      showToast(`Error ${error.message}`);
    });
}

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

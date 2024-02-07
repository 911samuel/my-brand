"use strict";
function showToast(message, inputId) {
    var _a;
    const toast = document.createElement("div");
    const inputElement = document.getElementById(inputId);
    toast.textContent = message;
    toast.classList.add("toast", "error");
    if (!inputElement) {
        console.error(`Input element with id '${inputId}' not found.`);
        return;
    }
    toast.style.position = "absolute";
    toast.style.top = `${inputElement.offsetTop + inputElement.offsetHeight}px`;
    toast.style.left = `${inputElement.offsetLeft}px`;
    (_a = inputElement.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(toast);
    setTimeout(function () {
        var _a;
        (_a = toast.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(toast);
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
    }
    else if (!signupLastName) {
        showToast("Last name cannot be empty", "lname");
    }
    else if (!isValidEmail(signupEmail)) {
        showToast("Please enter a valid email address from Gmail or Outlook", "email");
    }
    else if (signupPassword.length < 8) {
        showToast("Password must be at least 8 characters long", "password");
    }
    else if (!/[A-Z]/.test(signupPassword)) {
        showToast("Password must contain at least one uppercase letter.", "password");
    }
    else if (!/[a-z]/.test(signupPassword)) {
        showToast("Password must contain at least one lowercase letter.", "password");
    }
    else if (!isNaN(parseInt(signupPassword.charAt(0)))) {
        showToast("Password cannot start with a number.", "password");
    }
    else {
        showToast("Account created successfully!", "success");
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
    }
    else {
        showToast("Wrong Email or Password", "password");
    }
}
function contact(event) {
    event.preventDefault();
    const contactForm = document.getElementById("contactForm");
    if (contactForm && contactForm.checkValidity()) {
        save(contactForm);
        showToast("Thank you for filling out the form!", "sent");
    }
    else {
        showToast("Please fill out the form before submitting.", "error");
    }
}
function imageUpload() {
    var _a;
    const fileInput = document.getElementById("myFile");
    const displayFile = document.querySelector(".displayFile");
    const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            const previewImage = document.createElement("img");
            previewImage.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            previewImage.style.width = "100%";
            previewImage.style.height = "400px";
            displayFile.innerHTML = "";
            displayFile.appendChild(previewImage);
            saveImg(previewImage.src);
        };
        reader.readAsDataURL(file);
    }
    else {
        displayFile.innerHTML = "";
    }
}
function gd(sentence) {
    console.log(sentence);
    if (typeof sentence !== "string") {
        console.error("The 'sentence' parameter must be a string.");
        return null;
    }
    let words = sentence.split(" ");
    if (words.length >= 2) {
        words[0] = words[0].charAt(0).toUpperCase();
        words[1] = words[1].charAt(0).toUpperCase();
        return words[0] + words[1];
    }
    else {
        console.error("The 'sentence' parameter must contain at least two words.");
        return null;
    }
}
function uploadBlog(event) {
    event.preventDefault();
    const myFile = document.getElementById("myFile").value;
    const myTitle = document.getElementById("title").value;
    const myAuthor = document.getElementById("author").value;
    const myDate = document.getElementById("date").value;
    const myDescription = document.getElementById("description").value;
    const imageUrl = localStorage.getItem("imageUrl");
    if (myFile === "") {
        showToast("Please select an Image for your Blog!", "myFile");
    }
    else if (myTitle.trim() === "") {
        showToast("The title can't be empty", "title");
    }
    else if (myAuthor.trim() === "") {
        showToast("The author can't be empty", "author");
    }
    else if (myDate.trim() === "") {
        showToast("The date can't be empty", "date");
    }
    else if (myDescription.trim() === "") {
        showToast("The description can't be empty", "description");
    }
    else {
        const blogPost = {
            title: myTitle,
            author: myAuthor,
            date: myDate,
            description: myDescription,
            imageUrl: imageUrl,
        };
        saveBlog(blogPost);
    }
    showToast("Blog uploaded successfully", "success");
    setTimeout(function () {
        window.location.href = "./admin-dashboard-blogs.html";
    }, 3000);
}
function newBlog(title, date) {
    const newGD = document.createElement("div");
    const gdContainer = document.getElementById('blogContent');
    newGD.setAttribute('class', 'gd');
    newGD.innerHTML = `
    <div class="circle">
      <p>${gd(title)}</p> 
    </div>
    <div class="gdText">
      <p class="gdText1">${title}</p>
      <p class="gdText2">${date}</p> 
    </div> 
    <div class="views">
      <img src="./img/view.png" alt="view" />
      <p>0</p>
    </div>
    <div class="gdButton">
      <button>Edit</button>
      <button>Delete</button>
    </div>
  `;
    console.log(gdContainer);
    gdContainer === null || gdContainer === void 0 ? void 0 : gdContainer.appendChild(newGD);
}
function saveBlog(blogPost) {
    localStorage.setItem("blogPost", JSON.stringify(blogPost));
}
function saveImg(imageUrl) {
    localStorage.setItem("imageUrl", imageUrl);
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
    navElement === null || navElement === void 0 ? void 0 : navElement.classList.toggle("show-menu");
    verticalLineElement === null || verticalLineElement === void 0 ? void 0 : verticalLineElement.classList.toggle("hide-element");
    contactElement === null || contactElement === void 0 ? void 0 : contactElement.classList.toggle("hide-element");
}

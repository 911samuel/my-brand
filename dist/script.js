"use strict";
let accounts = [];
let blogPosts = [];
let contactFormSubmissions = [];
function showToast(message, inputId) {
    var _a;
    const toast = document.createElement("div");
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
        console.error(`Input element with id '${inputId}' not found.`);
        return;
    }
    toast.textContent = message;
    toast.classList.add("toast", "error");
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
    if (!signupFirstName || !signupLastName || !isValidEmail(signupEmail) || signupPassword.length < 8) {
        showToast("Please fill all fields correctly", "error");
    }
    else {
        const accountData = {
            firstName: signupFirstName,
            lastName: signupLastName,
            email: signupEmail,
            password: signupPassword
        };
        accounts.push(accountData);
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
    const loggedInAccount = accounts.find(account => account.email === signinEmail && account.password === signinPassword);
    if (loggedInAccount) {
        showToast(`Welcome back, ${loggedInAccount.lastName}`, "in");
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
        saveContactFormSubmission(new FormData(contactForm));
        showToast("Thank you for filling out the form!", "sent");
    }
    else {
        showToast("Please fill out the form before submitting.", "error");
    }
}
function gd(sentence) {
    console.log(sentence);
    if (typeof sentence !== "string") {
        console.error("The 'sentence' parameter must be a string.");
        return null;
    }
    const words = sentence.split(" ");
    if (words.length >= 2) {
        return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    }
    else {
        return words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
}
let nextIndex = 1;
function uploadBlog(event) {
    var _a;
    event.preventDefault();
    const fileInput = document.getElementById("myFile");
    const displayFile = document.querySelector(".displayFile");
    const myTitle = document.getElementById("title").value;
    const myAuthor = document.getElementById("author").value;
    const myDate = document.getElementById("date").value;
    const myDescription = document.getElementById("description").value;
    const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file) {
        showToast("Please select an Image for your Blog!", "myFile");
    }
    else if (!myTitle.trim()) {
        showToast("The title can't be empty", "title");
        return;
    }
    else if (!myAuthor.trim()) {
        showToast("The author can't be empty", "author");
        return;
    }
    else if (!myDate.trim()) {
        showToast("The date can't be empty", "date");
        return;
    }
    else if (!myDescription.trim()) {
        showToast("The description can't be empty", "description");
        return;
    }
    else {
        const reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            const previewImage = document.createElement("img");
            previewImage.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            previewImage.style.width = "100%";
            previewImage.style.height = "400px";
            displayFile.innerHTML = "";
            displayFile.appendChild(previewImage);
            const blogPost = {
                title: myTitle,
                author: myAuthor,
                date: myDate,
                description: myDescription,
                imageUrl: previewImage.src,
                index: nextIndex,
            };
            saveBlogPost(blogPost);
            showToast("Blog uploaded successfully", "success");
            setTimeout(function () {
                window.location.href = "./admin-dashboard-blogs.html";
            }, 3000);
            nextIndex++;
        };
        reader.onerror = function () {
            showToast("Failed to upload the blog. Please try again.", "success");
        };
        reader.readAsDataURL(file);
    }
}
function createBlogPost(blogPost) {
    const newGD = document.createElement("div");
    newGD.classList.add("gd");
    newGD.innerHTML = `
      <div class="circle">
          <p>${gd(blogPost.title)}</p>  
      </div>
      <div class="gdText">
          <p class="gdText1">${blogPost.title}</p>
          <p class="gdText2">${blogPost.date}</p>  
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
    return newGD;
}
function newBlog() {
    const savedBlogPostString = localStorage.getItem("blogPost");
    if (savedBlogPostString) {
        const savedBlogPost = JSON.parse(savedBlogPostString);
        const gdContainer = document.getElementById("blogContent");
        if (gdContainer) {
            const newBlogPost = createBlogPost(savedBlogPost);
            gdContainer.appendChild(newBlogPost);
        }
        else {
            console.error("Blog content container not found.");
        }
    }
    else {
        console.error("No blog post found in local storage.");
    }
}
function saveBlogPost(blogPost) {
    let blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    blogPosts.push(blogPost);
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
}
function saveContactFormSubmission(formData) {
    let submissionData = {};
    for (const [key, value] of formData.entries()) {
        submissionData[key] = String(value);
    }
    contactFormSubmissions.push(submissionData);
}
function save(form) {
    const formData = new FormData(form);
    for (const [key, value] of formData.entries()) {
        localStorage.setItem(key, String(value));
    }
}
function toggleMenu() {
    const navElement = document.querySelector(".nav");
    const verticalLineElement = document.querySelector(".vertical-line");
    const contactElement = document.querySelector(".contact");
    if (navElement && verticalLineElement && contactElement) {
        navElement.classList.toggle("show-menu");
        verticalLineElement.classList.toggle("hide-element");
        contactElement.classList.toggle("hide-element");
    }
    else {
        console.error("Menu elements not found.");
    }
}
//# sourceMappingURL=script.js.map
let accounts = [];
let blogPosts = [];
let contactFormSubmissions = [];

function showToast(message, inputId) {
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
  inputElement.parentNode?.appendChild(toast);
  setTimeout(function () {
    toast.parentNode?.removeChild(toast);
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
  
  // Check if all fields are filled correctly
  if (
    !signupFirstName ||
    !signupLastName ||
    !isValidEmail(signupEmail) ||
    signupPassword.length < 8
  ) {
    showToast("Please fill all fields correctly", "error");
  } else {
    // Create an object with account data
    const accountData = {
      firstName: signupFirstName,
      lastName: signupLastName,
      email: signupEmail,
      password: signupPassword,
    };

    // Retrieve existing accounts from local storage
    let storedAccounts = JSON.parse(localStorage.getItem("accounts") || "[]");

    // Add the new account to the array
    storedAccounts.push(accountData);

    // Save the updated accounts array back to local storage
    localStorage.setItem("accounts", JSON.stringify(storedAccounts));

    showToast("Account created successfully!", "success");

    // Redirect the user after successful signup
    setTimeout(function () {
      window.location.href = "signin.html";
    }, 2000);
  }
}


function signIn(event) {
  event.preventDefault();
  const signinEmail = document.getElementById("email").value;
  const signinPassword = document.getElementById("password").value;

  // Retrieve stored accounts from local storage
  const storedAccounts = JSON.parse(localStorage.getItem("accounts") || "[]");

  // Find the account with the entered email
  const loggedInAccount = storedAccounts.find((account) => account.email === signinEmail);

  // Check if the account exists and the password matches
  if (loggedInAccount && loggedInAccount.password === signinPassword) {
    // Authentication successful
    showToast(`Welcome back, ${loggedInAccount.lastName}`, "in");
    setTimeout(function () {
      window.location.href = "admin-dashboard-blogs.html";
    }, 2000);
  } else {
    // Authentication failed
    showToast("Wrong Email or Password", "password");
  }
}


function contact(event) {
  event.preventDefault();
  const contactForm = document.getElementById("contactForm");
  if (contactForm && contactForm.checkValidity()) {
    saveContactFormSubmission(new FormData(contactForm));
    showToast("Thank you for filling out the form!", "sent");
  } else {
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
  } else {
    return words[0].charAt(0).toUpperCase() + words[0].charAt(1).toLowerCase();
  }
}

let nextIndex = 1;

function uploadBlog(event) {
  event.preventDefault();
  const fileInput = document.getElementById("myFile");
  const displayFile = document.querySelector(".displayFile");
  const myTitle = document.getElementById("title").value;
  const myAuthor = document.getElementById("author").value;
  const myDate = document.getElementById("date").value;
  const myDescription = document.getElementById("description").value;
  const file = fileInput.files?.[0];
  if (!file) {
    showToast("Please select an Image for your Blog!", "myFile");
  } else if (!myTitle.trim()) {
    showToast("The title can't be empty", "title");
    return;
  } else if (!myAuthor.trim()) {
    showToast("The author can't be empty", "author");
    return;
  } else if (!myDate.trim()) {
    showToast("The date can't be empty", "date");
    return;
  } else if (!myDescription.trim()) {
    showToast("The description can't be empty", "description");
    return;
  } else {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImage = document.createElement("img");
      previewImage.src = e.target?.result;
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
      renderBlogPosts();
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
        <button onclick="editBlog(${blogPost.index})">Edit</button>
        <button onclick="deleteBlog(${blogPost.index})">Delete</button>
      </div>
    `;
  return newGD;
}

function renderBlogPosts() {
  const gdContainer = document.getElementById("blogContent");
  if (!gdContainer) {
    console.error("Blog content container not found.");
    return;
  }

  gdContainer.innerHTML = "";

  const savedBlogPostsString = localStorage.getItem("blogPosts");
  if (!savedBlogPostsString) {
    console.error("No blog posts found in local storage.");
    return;
  }

  const savedBlogPosts = JSON.parse(savedBlogPostsString);
  savedBlogPosts.forEach((blogPost) => {
    const newBlogPostElement = createBlogPost(blogPost);
    gdContainer.appendChild(newBlogPostElement);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("admin-dashboard-blogs.html")) {
    renderBlogPosts();
  }
});

function deleteBlog(index) {
    const confirmationModal = document.getElementById("confirmationModal");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const cancelDeleteBtn = document.getElementById("cancelDelete");
 
    confirmationModal.style.display = "block";
  
    confirmDeleteBtn.onclick = function() {
      let blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
      const indexToDelete = blogPosts.findIndex((post) => post.index === index);
      
      if (indexToDelete !== -1) {
        blogPosts.splice(indexToDelete, 1);
        localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
        renderBlogPosts();
        showToast("Blog deleted successfully", "success");
      }
      confirmationModal.style.display = "none";
    };
  
    cancelDeleteBtn.onclick = function() {
      confirmationModal.style.display = "none";
    };
}

function deleteAllBlogs() {
    const confirmationModal = document.getElementById("confirmationModal");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const cancelDeleteBtn = document.getElementById("cancelDelete");
 
    confirmationModal.style.display = "block";
  
    confirmDeleteBtn.onclick = function() {
      localStorage.removeItem("blogPosts");
      blogPosts = []; // Clear the blogPosts array
      renderBlogPosts(); // Update the UI to reflect the changes
      showToast("All blogs deleted successfully", "success");
      confirmationModal.style.display = "none";
    };
  
    cancelDeleteBtn.onclick = function() {
      confirmationModal.style.display = "none";
    };
}


  

function editBlog(index) {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const editIndex = urlParams.get("index");

  const blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
  const blogPost = blogPosts.find((post) => post.index === parseInt(editIndex));

  if (blogPost) {
    document.getElementById("title").value = blogPost.title;
    document.getElementById("author").value = blogPost.author;
    document.getElementById("date").value = blogPost.date;
    document.getElementById("description").value = blogPost.description;
    document.getElementById("existingImage").src = blogPost.imageUrl;
    document.getElementById("uploadButton").textContent = "Update";
  } else {
    console.error(`Blog post with index ${editIndex} not found.`);
  }

  document
    .getElementById("uploadForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const updatedBlogPost = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value,
        imageUrl: document.getElementById("existingImage").src,
        index: parseInt(editIndex),
      };

      const indexToUpdate = blogPosts.findIndex(
        (post) => post.index === parseInt(editIndex)
      );
      if (indexToUpdate !== -1) {
        blogPosts[indexToUpdate] = updatedBlogPost;
        localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
        window.location.href = "admin-dashboard-blogs.html";
      } else {
        console.error(`Blog post with index ${editIndex} not found.`);
      }
    });
}

function saveBlogPost(blogPost) {
  let blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
  blogPosts.push(blogPost);
  localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
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
  } else {
    console.error("Menu elements not found.");
  }
}

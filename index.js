let accounts = [];
let blogPosts = [];
let contactFormSubmissions = [];
let nextIndex = 1;
let blogIndex = 0;
let views = 0;

function showToast(message, messageType, inputId) {
  const toast = document.createElement("div");
  const inputElement = document.getElementById(inputId);
  if (!inputElement) {
    console.error(`Input element with id '${inputId}' not found.`);
    return;
  }
  toast.textContent = message;

  switch (messageType) {
    case "success":
      toast.classList.add("toast", "success");
      break;
    case "error":
      toast.classList.add("toast", "error");
      break;
    default:
      toast.classList.add("toast");
  }

  toast.style.position = "absolute";
  toast.style.top = `${inputElement.offsetTop + inputElement.offsetHeight}px`;
  toast.style.left = `${inputElement.offsetLeft}px`;
  inputElement.parentNode?.appendChild(toast);
  setTimeout(() => {
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

  if (
    !signupFirstName ||
    !signupLastName ||
    !isValidEmail(signupEmail) ||
    signupPassword.length < 8
  ) {
    showToast("All fields are required", "error", "success");
  } else {
    const accountData = {
      firstName: signupFirstName,
      lastName: signupLastName,
      email: signupEmail,
      password: signupPassword,
    };
    let storedAccounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    storedAccounts.push(accountData);
    localStorage.setItem("accounts", JSON.stringify(storedAccounts));
    showToast("Account created successfully!", "success", "success");
    setTimeout(() => {
      window.location.href = "signin.html";
    }, 2000);
  }
}

function signIn(event) {
  event.preventDefault();
  const signinEmail = document.getElementById("email").value;
  const signinPassword = document.getElementById("password").value;
  const storedAccounts = JSON.parse(localStorage.getItem("accounts") || "[]");
  const loggedInAccount = storedAccounts.find(
    (account) => account.email === signinEmail
  );

  if (loggedInAccount && loggedInAccount.password === signinPassword) {
    showToast(`Welcome back, ${loggedInAccount.lastName}`, "success", "success");
    setTimeout(() => {
      window.location.href = "admin-dashboard-blogs.html";
    }, 2000);
  } else {
    showToast("Wrong Email or Password", "error", "password");
  }
}

function contact(event) {
  event.preventDefault();
  const contactForm = document.getElementById("contactForm");
  if (contactForm && contactForm.checkValidity()) {
    saveContactFormSubmission(new FormData(contactForm));
    showToast("Thank you for filling out the form!", "success", "success");
  } else {
    showToast("Please fill out the form before submitting.", "error", "success");
  }
}

function gd(sentence) {
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
    showToast("Please select an Image for your Blog!", "error", "myFile");
  } else if (!myTitle.trim() || !myAuthor.trim() || !myDate.trim() || !myDescription.trim()) {
    showToast("All fields are required", "error");
  } else {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImage = document.createElement("img");
      previewImage.src = e.target?.result;
      previewImage.style.width = "100%";
      previewImage.style.height = "400px";
      displayFile.innerHTML = "";
      displayFile.onchange = () => {
        displayFile.appendChild(previewImage);
      };
      const blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
      const lastIndex = blogPosts.length > 0 ? blogPosts[blogPosts.length - 1].index : 0;
      const blogPost = {
        title: myTitle,
        author: myAuthor,
        date: myDate,
        description: myDescription,
        imageUrl: previewImage.src,
        index: lastIndex + 1, 
        views: views,
      };
      saveBlogPost(blogPost);
      showToast("Blog uploaded successfully", "success", "success");
      setTimeout(() => {
        window.location.href = "./admin-dashboard-blogs.html";
      }, 3000);
      renderBlogPosts();
    };
    reader.onerror = function () {
      showToast("Failed to upload the blog. Please try again.", "error", "success");
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
          <p>${blogPost.views}</p>  
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

  confirmDeleteBtn.onclick = function () {
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

  cancelDeleteBtn.onclick = function () {
    confirmationModal.style.display = "none";
  };
}

function deleteAllBlogs() {
  const confirmationModal = document.getElementById("confirmationModal");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const cancelDeleteBtn = document.getElementById("cancelDelete");

  confirmationModal.style.display = "block";

  confirmDeleteBtn.onclick = function () {
    localStorage.removeItem("blogPosts");
    blogPosts = [];
    renderBlogPosts();
    showToast("All blogs deleted successfully", "success");
    confirmationModal.style.display = "none";
  };

  cancelDeleteBtn.onclick = function () {
    confirmationModal.style.display = "none";
  };
}

function editBlog(index) {
  const blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
  const blogPost = blogPosts.find((post) => post.index === parseInt(index));

  if (blogPost) {
    window.location.href = `updateBlog.html?index=${index}`;
  } else {
    console.error(`Blog post with index ${index} not found.`);
  }
}

function updateBlog(event) {
  event.preventDefault();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const updatedTitle = document.getElementById("title").value;
  const updatedAuthor = document.getElementById("author").value;
  const updatedDate = document.getElementById("date").value;
  const updatedDescription = document.getElementById("description").value;

  const fileInput = document.getElementById("myFile");
  const file = fileInput.files[0];

  if (!file) {
    showToast("Please select an Image for your Blog!", "error", "myFile");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const updatedImage = e.target.result;

    const blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const indexToUpdate = blogPosts.findIndex(
      (post) => post.index === parseInt(editIndex)
    );
    if (indexToUpdate !== -1) {
      blogPosts[indexToUpdate] = {
        index: parseInt(editIndex),
        title: updatedTitle,
        author: updatedAuthor,
        date: updatedDate,
        description: updatedDescription,
        imageUrl: updatedImage,
        views: views,
      };
      localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
      showToast("Blog uploaded successfully", "success", "success");
    } else {
      showToast("Failed to upload the blog. Please try again.", "error", "success");
    }

    setTimeout(() => {
      window.location.href = "./admin-dashboard-blogs.html";
    }, 3000);
  };

  reader.readAsDataURL(file);
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

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("blog.html")) {
    renderBlogUpdatePosts(blogIndex);
  }
});

function renderBlogUpdatePosts(startIndex) {
  const blogsContainer = document.querySelector(".blogsPage");
  if (!blogsContainer) {
    console.error("Blogs container not found.");
    return;
  }

  const blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");

  if (startIndex === 0) {
    blogsContainer.innerHTML = "";
  }

  for (let i = startIndex; i < startIndex + 3 && i < blogPosts.length; i++) {
    const blogElement = createBlogElement(blogPosts[i]);
    blogsContainer.appendChild(blogElement);
  };

  blogIndex = startIndex + 3;

  if (blogIndex < blogPosts.length) {
    document.querySelector(".more").style.display = "flex";
  } else {
    document.querySelector(".more").style.display = "none"; 
  }
}

function loadMoreBlogs() {
  renderBlogUpdatePosts(blogIndex); 
}

function createBlogElement(blogPost) {
  const blogDiv = document.createElement("div");
  blogDiv.classList.add("blog1");

  const blogImage = document.createElement("img");
  blogImage.src = blogPost.imageUrl;
  blogImage.alt = "blog image";

  const adminInfo = document.createElement("div");
  adminInfo.classList.add("admin");
  const adminBy = document.createElement("p");
  adminBy.textContent = `By: ${blogPost.author}`;
  const blogDate = document.createElement("p");
  blogDate.textContent = blogPost.date;

  const blogTitle = document.createElement("p");
  blogTitle.textContent = blogPost.title;

  const readMoreButton = document.createElement("button");
  readMoreButton.textContent = "Read More";
  readMoreButton.classList.add("read-more");
  readMoreButton.addEventListener("click", () => {
    increaseViews(blogPost.index)
    window.location.href = `singlepost.html?index=${blogPost.index}`;
  });

  adminInfo.appendChild(adminBy);
  adminInfo.appendChild(blogDate);

  blogDiv.appendChild(blogImage);
  blogDiv.appendChild(adminInfo);
  blogDiv.appendChild(blogTitle);
  blogDiv.appendChild(readMoreButton);

  return blogDiv;
}

function increaseViews(index) {
  let blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
  const blogIndex = blogPosts.findIndex(post => post.index === index);
  if (blogIndex !== -1) {
    blogPosts[blogIndex].views = (blogPosts[blogIndex].views || 0) + 1;
    localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
  }
}

function showPosts() {
  console.log("showing posts...");
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('index');

  const blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");

  const blogPost = blogPosts.find(post => post.index === parseInt(postId));

  if (blogPost) {
    const postImage = document.getElementById("post-image");
    const postAuthor = document.getElementById("post-author");
    const postDate = document.getElementById("post-date");
    const postTitle = document.getElementById("post-title");
    const postDescription = document.getElementById("post-description");

    postImage.src = blogPost.imageUrl;
    postAuthor.textContent = `By: ${blogPost.author}`;
    postDate.textContent = blogPost.date;
    postTitle.textContent = blogPost.title;
    postDescription.textContent = blogPost.description;
  } else {
    console.error(`Blog post with index ${postId} not found.`);
  }
}

document.addEventListener( 'DOMContentLoaded', function () {
  if(window.location.href.includes("singlepost.html")){
    showPosts();
  }
});

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

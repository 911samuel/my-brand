function showToast(message, messageType, inputId) {
  const toast = document.createElement("div");
  const inputElement = document.getElementById(inputId);
  if (!inputElement) {
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
  toast.style.animation = "fadeIn 0.5s ease-in-out";
  toast.style.top = `${inputElement.offsetTop + inputElement.offsetHeight}px`;
  toast.style.left = `${inputElement.offsetLeft}px`;
  inputElement.parentNode?.appendChild(toast);
  setTimeout(() => {
    toast.parentNode?.removeChild(toast);
  }, 3000);
}

function signUp(event) {
  event.preventDefault();

  const signupFirstName = document.getElementById("fname").value;
  const signupLastName = document.getElementById("lname").value;
  const signupEmail = document.getElementById("email").value;
  const signupPassword = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  const register = {
    firstname: signupFirstName,
    lastname: signupLastName,
    username: username,
    email: signupEmail,
    password: signupPassword,
  };

  fetch("https://my-express-app-yzv8.onrender.com/users/signUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(register),
  })
    .then(async (response) => {
      const data = await response.json();

      if (data.message === "Registration successful") {
        showToast(data.message, "success", "success");
        setTimeout(() => {
          window.location.href = "signin.html";
        }, 2000);
      } else if (data.message === "Username is already taken") {
        showToast(data.message, "error", "username");
      } else if (data.message === "Email is already registered") {
        showToast(data.message, "error", "email");
      } else if (data.errorMessage) {
        if (data.errorMessage === "First name is required") {
          showToast(data.errorMessage, "error", "fname");
        } else if (data.errorMessage === "Last name is required") {
          showToast(data.errorMessage, "error", "lname");
        } else if (data.errorMessage === "Username is required") {
          showToast(data.errorMessage, "error", "username");
        } else if (
          data.errorMessage === "Invalid email format" ||
          data.errorMessage === "Email is required"
        ) {
          showToast(data.errorMessage, "error", "email");
        } else if (
          data.errorMessage === "Password is required" ||
          data.errorMessage === "Password cannot exceed 20 characters" ||
          data.errorMessage === "Password must be at least 6 characters long"
        ) {
          showToast(data.errorMessage, "error", "password");
        }
      }
    })
    .catch((error) => {
      showToast(error.message, "error", "success");
    });
}

function signIn(event) {
  event.preventDefault();
  const signinEmail = document.getElementById("email").value;
  const signinPassword = document.getElementById("password").value;

  const login = {
    email: signinEmail,
    password: signinPassword,
  };

  fetch("https://my-express-app-yzv8.onrender.com/users/signIn", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login),
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        showToast(data.message, "error", "success");
      }

      if (data.message === "Login successful") {
        showToast(
          `Welcome back, ${data.userWithoutPassword.username}`,
          "success",
          "success"
        );

        if (data.userWithoutPassword.role === "admin") {
          localStorage.setItem("adminToken", data.token);
          setTimeout(() => {
            window.location.href = "admin-dashboard-blogs.html";
          }, 1500);
        } else {
          localStorage.setItem("userToken", data.token);
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1500);
        }
      } else {
        showToast(data.message, "error", "success");
      }
    })
    .catch((error) => {
      showToast(error.message, "error", "success");
    });
}

function gd(sentence) {
  if (typeof sentence !== "string") {
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

  const fileInput = document.getElementById("myFile").files[0];
  const myTitle = document.getElementById("title").value;
  const myAuthor = document.getElementById("author").value;
  const myCategory = document.getElementById("category").value;
  const myDescription = document.getElementById("description").value;

  if (!fileInput) {
    showToast("Please select an Image for your Blog!", "error", "myFile");
    return;
  }

  const article = new FormData();
  article.append("imgUrl", fileInput);
  article.append("title", myTitle);
  article.append("author", myAuthor);
  article.append("category", myCategory);
  article.append("description", myDescription);

  const token = localStorage.getItem("adminToken");

  fetch("https://my-express-app-yzv8.onrender.com/blogs/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: article,
  })
    .then(async (response) => {
      const data = await response.json();

      if (data.message === "The blog was added successfully") {
        showToast(data.message, "success", "success");
        setTimeout(() => {
          window.location.href = "./admin-dashboard-blogs.html";
        }, 2000);
      } else if (data.errorMessage) {
        if (data.errorMessage === "Title is required") {
          showToast(data.errorMessage, "error", "title");
        } else if (data.errorMessage === "Author is required") {
          showToast(data.errorMessage, "error", "author");
        } else if (data.errorMessage === "Category is required") {
          showToast(data.errorMessage, "error", "category");
        } else {
          showToast(data.errorMessage, "error", "description");
        }
      }
    })
    .catch((error) => {
      showToast("Error uploading blog", "error", "myFile");
    });
}

function gd(sentence) {
  if (typeof sentence !== "string") {
    return null;
  }
  const words = sentence.split(" ");
  if (words.length >= 2) {
    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  } else {
    return words[0].charAt(0).toUpperCase() + words[0].charAt(1).toLowerCase();
  }
}

function createBlogPost() {
  fetch("https://my-express-app-yzv8.onrender.com/blogs/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const blogContent = document.getElementById("blogContent");
      if (!blogContent) {
        return;
      }

      if (!data.blogs || !Array.isArray(data.blogs)) {
        return;
      }

      data.blogs.forEach((blog) => {
        const newGD = document.createElement("div");
        newGD.classList.add("gd");
        newGD.innerHTML = `
          <div class="circle">
              <p>${gd(blog.title)}</p>  
          </div>
          <div class="gdText">
              <p class="gdText1">${blog.title}</p>
              <p class="gdText2">${blog.createdAt}</p>  
          </div>  
          <div class="views">
              <img src="./img/view.png" alt="view" />
              <p>${blog.views}</p>  
          </div>
          <div class="gdButton">
            <button onclick="editBlog('${blog._id}')">Edit</button>
            <button onclick="deleteBlog('${blog._id}')">Delete</button>
          </div>
        `;
        blogContent.appendChild(newGD);
      });
    })
    .catch((error) => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("admin-dashboard-blogs.html")) {
    createBlogPost();
  }
});

function deleteBlog(blogId) {
  const confirmationModal = document.getElementById("confirmationModal");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const cancelDeleteBtn = document.getElementById("cancelDelete");

  confirmationModal.style.display = "block";
  const token = localStorage.getItem("adminToken");

  confirmDeleteBtn.onclick = function () {
    fetch(`https://my-express-app-yzv8.onrender.com/blogs/delete/${blogId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete blog");
        }

        return response.json();
      })
      .then((data) => {
        showToast(data.message, "success", "success");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
        showToast("Failed to delete blog", "error");
      })
      .finally(() => {
        confirmationModal.style.display = "none";
      });
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
  const token = localStorage.getItem("adminToken");

  confirmDeleteBtn.onclick = function () {
    fetch("https://my-express-app-yzv8.onrender.com/blogs/deleteAll", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete blog");
        }

        return response.json();
      })
      .then((data) => {
        showToast(data.message, "success", "success");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
        showToast("Failed to delete blog", "error");
      })
      .finally(() => {
        confirmationModal.style.display = "none";
      });
  };

  cancelDeleteBtn.onclick = function () {
    confirmationModal.style.display = "none";
  };
}

function editBlog(blogId) {
  window.location.href = `updateBlog.html?blogId=${blogId}`;
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("updateBlog.html")) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const blogId = urlParams.get("blogId");
    getBlog(blogId);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("updateBlog.html")) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const blogId = urlParams.get("blogId");
    updateBlog(blogId);
  }
});

function updateBlog(event) {
  event.preventDefault();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const blogId = urlParams.get("blogId");

  const token = localStorage.getItem("adminToken");

  const updatedTitle = document.getElementById("title").value;
  const updatedAuthor = document.getElementById("author").value;
  const updatedCategory = document.getElementById("category").value;
  const updatedDescription = document.getElementById("description").value;
  const updatedImageUrl = document.getElementById("myFile").files[0];

  if (!updatedImageUrl) {
    showToast("Please select an Image for your Blog!", "error", "myFile");
    return;
  }

  const update = new FormData();
  update.append("imgUrl", updatedImageUrl);
  update.append("title", updatedTitle);
  update.append("author", updatedAuthor);
  update.append("category", updatedCategory);
  update.append("description", updatedDescription);

  fetch(`https://my-express-app-yzv8.onrender.com/blogs/update/${blogId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: update,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update blog");
      }
      return response.json();
    })
    .then((data) => {
      showToast("Blog updated successfully", "success", "success");
      setTimeout(() => {
        window.location.href = "./admin-dashboard-blogs.html";
      }, 3000);
    })
    .catch((error) => {
      console.error("Error updating blog:", error);
      showToast("Failed to update blog. Please try again.", "error", "error");
    });
}

function getBlog(blogId) {
  fetch(`https://my-express-app-yzv8.onrender.com/blogs/single/${blogId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      const data = await response.json();

      document.getElementById("title").value = data.blog.title;
      document.getElementById("author").value = data.blog.author;
      document.getElementById("category").value = data.blog.category;
      document.getElementById("description").value = data.blog.description;
    })
    .catch((err) => {
      console.log(err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("blog.html")) {
    renderBlogUpdatePosts(0);
  }
});

function renderBlogUpdatePosts(startIndex) {
  let loadedBlogIds = [];

  fetch(
    `https://my-express-app-yzv8.onrender.com/blogs/all?startIndex=${startIndex}&limit=3`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const blogsContainer = document.querySelector(".blogsPage");
      if (!blogsContainer) {
        console.error("Blogs container not found.");
        return;
      }

      if (!data || !data.blogs || !Array.isArray(data.blogs)) {
        console.error("Invalid data format: blogs not found or not an array.");
        return;
      }

      if (startIndex === 0) {
        blogsContainer.innerHTML = "";
      }

      data.blogs.forEach((blog) => {
        if (!loadedBlogIds.includes(blog._id)) {
          const blogElement = createBlogElement(blog);
          blogsContainer.appendChild(blogElement);
          loadedBlogIds.push(blog._id);
        }
      });

      startIndex += data.blogs.length;

      const loadMoreButton = document.querySelector(".more");
      if (startIndex >= data.totalCount) {
        loadMoreButton.style.display = "none";
      } else {
        loadMoreButton.style.display = "block";
      }

      loadMoreButton.dataset.startIndex = startIndex;
    })
    .catch((error) => {
      console.error("Error fetching blogs:", error);
    });
}

function loadMoreBlogs() {
  const loadMoreButton = document.querySelector(".more");
  const startIndex = parseInt(loadMoreButton.dataset.startIndex) || 0;
  renderBlogUpdatePosts(startIndex);
}

function createBlogElement(blogPost) {
  const blogDiv = document.createElement("div");
  blogDiv.classList.add("blog1");

  const blogImage = document.createElement("img");
  blogImage.src = `https://my-express-app-yzv8.onrender.com${blogPost.imgUrl}`;
  blogImage.alt = "blog image";

  const adminInfo = document.createElement("div");
  adminInfo.classList.add("admin");
  const adminBy = document.createElement("p");
  adminBy.textContent = `By: ${blogPost.author}`;
  const blogDate = document.createElement("p");
  blogDate.textContent = blogPost.createdAt;

  const blogTitle = document.createElement("p");
  blogTitle.textContent = blogPost.title;

  const readMoreButton = document.createElement("button");
  readMoreButton.textContent = "Read More";
  readMoreButton.classList.add("read-more");
  readMoreButton.addEventListener("click", () => {
    const blogId = blogPost._id;
    window.location.href = `singlepost.html?id=${blogId}`;
  });

  adminInfo.appendChild(adminBy);
  adminInfo.appendChild(blogDate);

  blogDiv.appendChild(blogImage);
  blogDiv.appendChild(adminInfo);
  blogDiv.appendChild(blogTitle);
  blogDiv.appendChild(readMoreButton);

  return blogDiv;
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("singlepost.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    showPost(postId);
  }
});

function showPost(postId) {
  fetch(`https://my-express-app-yzv8.onrender.com/blogs/single/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      const data = await response.json();
      console.log(data)
      document.getElementById(
        "post-image"
      ).src = `https://my-express-app-yzv8.onrender.com/uploads${data.blog.imgUrl}`;
      console.log(`https://my-express-app-yzv8.onrender.com/uploads${data.blog.imgUrl}`)
      document.getElementById(
        "post-author"
      ).textContent = `By: ${data.blog.author}`;
      document.getElementById("post-date").textContent = data.blog.date;
      document.getElementById("post-title").textContent = data.blog.title;
      document.getElementById("post-description").textContent =
        data.blog.description;

      fetch(`https://my-express-app-yzv8.onrender.com/comments/add/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (commentResponse) => {
          const comments = await commentResponse.json();
          renderComments(comments);
          console.log(comments);
        })
        .catch((error) => {
          console.log("Error fetching comments:", error);
        });
    })
    .catch((error) => {
      console.log("Error fetching blog post:", error);
    });
}

function renderComments(comments) {
  const commentsContainer = document.getElementById("comments-container");
  commentsContainer.innerHTML = "";

  comments.forEach((comment) => {
    const commentElement = document.createElement("div");
    commentElement.classList.add("comment");

    const commentAuthor = document.createElement("span");
    commentAuthor.textContent = comment.author;
    commentElement.appendChild(commentAuthor);

    const commentText = document.createElement("p");
    commentText.textContent = comment.text;
    commentElement.appendChild(commentText);

    commentsContainer.appendChild(commentElement);
  });
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

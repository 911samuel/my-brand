function showToast(message: string, inputId: string): void {
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
  
    inputElement.parentNode?.appendChild(toast);
  
    setTimeout(function () {
      toast.parentNode?.removeChild(toast);
    }, 3000);
  }
  
  function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@(gmail\.com|outlook\.com)$/;
    return regex.test(email);
  }
  
  function signUp(event: Event): void {
    event.preventDefault();
  
    const signupFirstName = (document.getElementById("fname") as HTMLInputElement).value;
    const signupLastName = (document.getElementById("lname") as HTMLInputElement).value;
    const signupEmail = (document.getElementById("email") as HTMLInputElement).value;
    const signupPassword = (document.getElementById("password") as HTMLInputElement).value;
  
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
    } else if (!isNaN(parseInt(signupPassword.charAt(0)))) {
      showToast("Password cannot start with a number.", "password");
    } else {
      showToast("Account created successfully!", "success");
      save(document.getElementById("signupForm") as HTMLFormElement);
      setTimeout(function () {
        window.location.href = "signin.html";
      }, 2000);
    }
  }
  
  function signIn(event: Event): void {
    event.preventDefault();
  
    const signinEmail = (document.getElementById("email") as HTMLInputElement).value;
    const signinPassword = (document.getElementById("password") as HTMLInputElement).value;
  
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
  
  function contact(event: Event): void {
    event.preventDefault();
  
    const contactForm = document.getElementById("contactForm") as HTMLFormElement;
  
    if (contactForm && contactForm.checkValidity()) {
      save(contactForm);
      showToast("Thank you for filling out the form!", "sent");
    } else {
      showToast("Please fill out the form before submitting.", "error");
    }
  }
  
  function imageUpload(): void {
    const fileInput = document.getElementById("myFile") as HTMLInputElement;
    const displayFile = document.querySelector(".displayFile") as  HTMLElement;
  
    const file = fileInput.files?.[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const previewImage = document.createElement("img");
        previewImage.src = e.target?.result as string;
  
        previewImage.style.width = "100%";
        previewImage.style.height = "400px";
        displayFile.innerHTML = "";
        displayFile.appendChild(previewImage);
  
        saveImg(previewImage.src);
      };
  
      reader.readAsDataURL(file);
    } else {
      displayFile.innerHTML = "";
    }
  }
  
  function gd(sentence: string): string | null {
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
    } else {
      console.error("The 'sentence' parameter must contain at least two words.");
      return null;
    }
  }
  
  function uploadBlog(event: Event): void {
    event.preventDefault();
  
    const myFile = (document.getElementById("myFile") as HTMLInputElement).value;
    const myTitle = (document.getElementById("title") as HTMLInputElement).value;
    const myAuthor = (document.getElementById("author") as HTMLInputElement).value;
    const myDate = (document.getElementById("date") as HTMLInputElement).value;
    const myDescription = (document.getElementById("description") as HTMLInputElement).value;
    const imageUrl = localStorage.getItem("imageUrl");
  
    if (myFile === "") {
      showToast("Please select an Image for your Blog!", "myFile");
    } else if (myTitle.trim() === "") {
      showToast("The title can't be empty", "title");
    } else if (myAuthor.trim() === "") {
      showToast("The author can't be empty", "author");
    } else if (myDate.trim() === "") {
      showToast("The date can't be empty", "date");
    } else if (myDescription.trim() === "") {
      showToast("The description can't be empty", "description");
    } else {
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
  
  function newBlog(title: string, date: string): void {
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
  console.log(gdContainer)
    gdContainer?.appendChild(newGD);
  }
  
  function saveBlog(blogPost: { title: string, author: string, date: string, description: string, imageUrl: string | null }): void {
    localStorage.setItem("blogPost", JSON.stringify(blogPost));
  }
  
  function saveImg(imageUrl: string): void {
    localStorage.setItem("imageUrl", imageUrl);
  }
  
  function save(form: HTMLFormElement): void {
    const formData = new FormData(form);
  
    for (const [key, value] of formData.entries()) {
      localStorage.setItem(key, value as string);
    }
  }
  
  function toggleMenu(): void {
    const navElement = document.querySelector(".nav");
    const verticalLineElement = document.querySelector(".vertical-line");
    const contactElement = document.querySelector(".contact");
  
    navElement?.classList.toggle("show-menu");
    verticalLineElement?.classList.toggle("hide-element");
    contactElement?.classList.toggle("hide-element");
  }
  
document.addEventListener('DOMContentLoaded', () => {

    // --- Page Controller ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    // Add the new page to the array of pages that require a login
    const protectedPages = ['home.html', 'clean-water.html', 'waste-disposal.html', 'medical-services.html', 'about.html', 'contact.html', 'help.html'];

    if (currentPage === 'index.html') {
        initSplashAndLogin();
    } else if (currentPage === 'signup.html') {
        initSignup();
    } else if (protectedPages.includes(currentPage)) {
        initProtectedPage();
    }
    
    // --- Initializer Functions ---

    function initSplashAndLogin() {
        const splashScreen = document.getElementById('splash-screen');
        const loginPage = document.getElementById('login-page');
        
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            loginPage.classList.remove('hidden');
        }, 3000);

        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', handleLogin);
    }

    function initSignup() {
        const signupForm = document.getElementById('signup-form');
        signupForm.addEventListener('submit', handleSignup);
    }

    function initProtectedPage() {
        if (!sessionStorage.getItem('loggedInUser')) {
            window.location.href = 'index.html';
            return;
        }

        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', handleLogout);

        initializeAccordions();
        initializeForms();
        
        if (currentPage === 'home.html') {
            const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
            const welcomeMessage = document.getElementById('welcome-message');
            if (welcomeMessage) {
                 welcomeMessage.textContent = `Welcome, ${user.name}!`;
            }
        }
    }

    // --- Core Logic Functions ---

    function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const errorElement = document.getElementById('login-error');

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = 'home.html';
        } else {
            errorElement.textContent = 'Invalid username or password.';
        }
    }

    function handleSignup(event) {
        event.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const errorElement = document.getElementById('signup-error');

        if (password !== confirmPassword) {
            errorElement.textContent = 'Passwords do not match.';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.username === username)) {
            errorElement.textContent = 'Username is already taken.';
            return;
        }

        const newUser = { name, email, username, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful! Please proceed to log in.');
        window.location.href = 'index.html';
    }
    
    function handleLogout() {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    }

    // --- Reusable Component Initializers ---
    
    function initializeAccordions() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                header.classList.toggle('active');
                const accordionContent = header.nextElementSibling;
                if (accordionContent.style.maxHeight) {
                    accordionContent.style.maxHeight = null;
                } else {
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                }
            });
        });
    }

    function initializeForms() {
        const forms = document.querySelectorAll('form:not(#login-form):not(#signup-form)');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for your submission!');
                form.reset();
            });
        });
    }
});
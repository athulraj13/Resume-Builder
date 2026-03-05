document.addEventListener('DOMContentLoaded', function() {
    // Handle password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.querySelector('.eye-icon').style.opacity = '0.6';
            } else {
                input.type = 'password';
                this.querySelector('.eye-icon').style.opacity = '1';
            }
        });
    });

    // Form validation
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(password);
    }

    function showError(input, message) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }

    function clearErrors() {
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearErrors();

            const email = this.email.value;
            const password = this.password.value;
            let isValid = true;

            if (!validateEmail(email)) {
                showError(this.email, 'Please enter a valid email address');
                isValid = false;
            }

            if (password.length < 8) {
                showError(this.password, 'Password must be at least 8 characters long');
                isValid = false;
            }

            if (!isValid) return;

            try {
                const resp = await fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await resp.json();
                if (!resp.ok) {
                    showError(this.password, data.error || 'Login failed');
                    return;
                }
                // Save basic user info locally (demo purposes)
                localStorage.setItem('authUser', JSON.stringify(data));
                window.location.href = 'index.html';
            } catch (err) {
                showError(this.password, 'Network error during login');
                console.error('Login error:', err);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearErrors();

            const fullname = this.fullname.value;
            const email = this.email.value;
            const password = this.password.value;
            const confirmPassword = this['confirm-password'].value;
            let isValid = true;

            if (fullname.length < 2) {
                showError(this.fullname, 'Please enter your full name');
                isValid = false;
            }

            if (!validateEmail(email)) {
                showError(this.email, 'Please enter a valid email address');
                isValid = false;
            }

            if (!validatePassword(password)) {
                showError(this.password, 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers');
                isValid = false;
            }

            if (password !== confirmPassword) {
                showError(this['confirm-password'], 'Passwords do not match');
                isValid = false;
            }

            if (!this.terms.checked) {
                showError(this.terms, 'You must accept the terms and conditions');
                isValid = false;
            }

            if (!isValid) return;

            try {
                const resp = await fetch('http://localhost:3000/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullname, email, password })
                });
                const data = await resp.json();
                if (!resp.ok) {
                    showError(this.email, data.error || 'Registration failed');
                    return;
                }
                // Optionally store user and direct to login
                localStorage.setItem('registeredUser', JSON.stringify(data));
                window.location.href = 'login.html';
            } catch (err) {
                showError(this.email, 'Network error during registration');
                console.error('Registration error:', err);
            }
        });
    }

    // Clear error when input changes
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorMessage = this.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
});
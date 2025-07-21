document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form-wrap form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea');
    const formWrap = document.querySelector('.contact-form-wrap');
    const csrfInput = form.querySelector('input[name="csrf_token"]');

    function validateInput(input) {
        if (input.hasAttribute('required') && !input.value.trim()) {
            showFieldError(input, 'This field is required');
            return false;
        }
        if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            showFieldError(input, 'Invalid email format');
            return false;
        }
        if (input.type === 'tel' && !/^\+?\d{10,15}$/.test(input.value)) {
            showFieldError(input, 'Invalid phone number');
            return false;
        }
        clearFieldError(input);
        return true;
    }

    function showFieldError(input, message) {
        const formInner = input.closest('.form-inner');
        if (!formInner) return; // Skip if no .form-inner parent
        let error = formInner.querySelector('.error-message');
        if (!error) {
            error = document.createElement('div');
            error.className = 'error-message';
            formInner.appendChild(error);
        }
        error.textContent = message;
        input.classList.add('error');
        input.classList.remove('valid');
    }

    function clearFieldError(input) {
        const formInner = input.closest('.form-inner');
        if (!formInner) return; // Skip if no .form-inner parent
        const error = formInner.querySelector('.error-message');
        if (error) error.remove();
        input.classList.remove('error');
        input.classList.add('valid');
    }

    function showFormMessage(message, isSuccess) {
        let msgDiv = formWrap.querySelector('.form-message');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.className = 'form-message';
            formWrap.appendChild(msgDiv);
        }
        msgDiv.textContent = message;
        msgDiv.className = `form-message ${isSuccess ? 'success' : 'error'}`;
        setTimeout(() => msgDiv.remove(), 5000); // 5 seconds
    }

    function clearForm() {
        inputs.forEach(input => {
            if (input.name !== 'csrf_token') { // Preserve CSRF token
                input.value = '';
                clearFieldError(input);
                input.classList.remove('valid');
            }
        });
    }

    inputs.forEach(input => {
        if (input.hasAttribute('required') || input.type === 'email' || input.type === 'tel') {
            input.addEventListener('input', () => validateInput(input));
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute('required') || input.type === 'email' || input.type === 'tel') {
                if (!validateInput(input)) isValid = false;
            }
        });

        // Check honeypot fields
        const website = form.querySelector('input[name="website"]').value;
        const url = form.querySelector('input[name="url"]').value;
        if (website || url) {
            showFormMessage('Bot detected. Form not submitted.', false);
            return;
        }

        if (!isValid) {
            showFormMessage('Please correct the errors in the form.', false);
            return;
        }

        if (!csrfInput.value) {
            showFormMessage('CSRF token missing. Please refresh the page.', false);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        const formData = new FormData(form);

        try {
            const response = await fetch('/new/form.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                showFormMessage(result.message, true);
                clearForm();
                if (result.csrf_token) {
                    csrfInput.value = result.csrf_token; // Update CSRF token
                }
            } else {
                showFormMessage(result.message || 'Submission failed. Please try again.', false);
                clearForm(); // Clear form on error
            }
        } catch (error) {
            let message = 'Network error occurred. Please try again.';
            if (error.message.includes('404')) {
                message = 'Form submission endpoint not found. Please contact support.';
            }
            showFormMessage(message, false);
            clearForm(); // Clear form on network error
            console.error('Form submission error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
});
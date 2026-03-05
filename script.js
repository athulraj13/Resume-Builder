document.addEventListener('DOMContentLoaded', function() {
    console.log('Resume Builder JavaScript loaded');

    // Show logged-in user's profile info in navbar
    try {
        const navButtons = document.querySelector('.nav-buttons');
        const navProfile = document.getElementById('nav-profile');
        const authRaw = localStorage.getItem('authUser');
        const user = authRaw ? JSON.parse(authRaw) : null;
        if (user && navProfile) {
            const displayName = sanitizeHTML(user.fullname || user.email || 'User');
            navProfile.innerHTML = `
                <span class="nav-user">Hello, <strong>${displayName}</strong></span>
                <button type="button" class="nav-button" id="logout-btn">Logout</button>
            `;
            navProfile.style.display = 'flex';
            if (navButtons) navButtons.style.display = 'none';

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('authUser');
                    window.location.href = 'login.html';
                });
            }
        }
    } catch (e) {
        console.warn('Unable to render profile info:', e);
    }

    // Utility function to sanitize HTML input
    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    // Load saved form data from localStorage
    function loadFormData() {
        try {
            const savedData = localStorage.getItem('resumeFormData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Populate basic fields
                if (data.name) document.getElementById('name').value = data.name;
                if (data.email) document.getElementById('email').value = data.email;
                if (data.phone) document.getElementById('phone').value = data.phone;
                if (data.summary) document.getElementById('summary').value = data.summary;
                if (data.skills) document.getElementById('skills').value = data.skills;
                if (data.linkedin) document.getElementById('linkedin').value = data.linkedin;
                
                console.log('Form data loaded successfully');
                showNotification('Previous data restored!', 'success');
            }
        } catch (error) {
            console.error('Error loading form data:', error);
        }
    }

    // Save form data to localStorage
    function saveFormData() {
        try {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                summary: document.getElementById('summary').value,
                skills: document.getElementById('skills').value,
                linkedin: document.getElementById('linkedin').value,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('resumeFormData', JSON.stringify(formData));
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    }

    // Auto-save every 30 seconds
    setInterval(saveFormData, 30000);

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Load saved data on page load
    loadFormData();

    // Handle marks type selection
    const marksTypeSelect = document.getElementById('marks-type');
    const marksInput = document.getElementById('marks');

    if (marksTypeSelect && marksInput) {
        marksTypeSelect.addEventListener('change', function() {
            if (this.value === 'cgpa') {
                marksInput.placeholder = 'Enter CGPA (e.g., 8.5)';
                marksInput.setAttribute('max', '10');
                marksInput.setAttribute('step', '0.01');
            } else {
                marksInput.placeholder = 'Enter Percentage (e.g., 85)';
                marksInput.setAttribute('max', '100');
                marksInput.setAttribute('step', '0.1');
            }
        });
    }

    // Function to create a new entry based on the first entry in a container
    function createNewEntry(container) {
        const firstEntry = container.children[0];
        const newEntry = firstEntry.cloneNode(true);
        
        // Clear all input values
        newEntry.querySelectorAll('input, textarea, select').forEach(input => {
            input.value = '';
            if (input.type === 'checkbox') {
                input.checked = false;
            }
            // Generate a new unique ID
            if (input.id) {
                input.id = input.id + '-' + Date.now();
            }
        });

        // Add delete button if it's not the first entry
        if (!newEntry.querySelector('.delete-entry')) {
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete-entry';
            deleteBtn.innerHTML = '×';
            deleteBtn.setAttribute('aria-label', 'Delete entry');
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this entry?')) {
                    newEntry.style.animation = 'slideUp 0.3s ease-out';
                    setTimeout(() => newEntry.remove(), 300);
                }
            });
            newEntry.appendChild(deleteBtn);
        }

        return newEntry;
    }

    // Add handlers for all "Add More" buttons
    const addMoreButtons = {
        'add-experience': 'experience-container',
        'add-education': 'education-container',
        'add-project': 'projects-container',
        'add-certification': 'certifications-container',
        'add-language': 'languages-container'
    };

    Object.entries(addMoreButtons).forEach(([buttonId, containerId]) => {
        const button = document.getElementById(buttonId);
        const container = document.getElementById(containerId);

        if (button && container) {
            button.addEventListener('click', () => {
                const newEntry = createNewEntry(container);
                container.appendChild(newEntry);
                showNotification('Entry added successfully!', 'success');
            });
        }
    });

    // Add initial delete buttons to any pre-existing entries beyond the first one
    Object.values(addMoreButtons).forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            const entries = Array.from(container.children);
            entries.forEach((entry, index) => {
                if (index > 0 && !entry.querySelector('.delete-entry')) {
                    const deleteBtn = document.createElement('button');
                    deleteBtn.type = 'button';
                    deleteBtn.className = 'delete-entry';
                    deleteBtn.innerHTML = '×';
                    deleteBtn.setAttribute('aria-label', 'Delete entry');
                    deleteBtn.addEventListener('click', function() {
                        if (confirm('Are you sure you want to delete this entry?')) {
                            entry.style.animation = 'slideUp 0.3s ease-out';
                            setTimeout(() => entry.remove(), 300);
                        }
                    });
                    entry.appendChild(deleteBtn);
                }
            });
        }
    });

    // Get form elements
    const resumeForm = document.getElementById('resume-form');
    const generateButton = document.querySelector('.generate-button');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const skillsInput = document.getElementById('skills');

    // Enhanced form validation function
    function validateForm() {
        let isValid = true;
        const errors = [];

        // Name validation
        if (!nameInput.value.trim()) {
            isValid = false;
            nameInput.classList.add('error');
            errors.push('Name is required');
        } else if (nameInput.value.trim().length < 2) {
            isValid = false;
            nameInput.classList.add('error');
            errors.push('Name must be at least 2 characters');
        } else {
            nameInput.classList.remove('error');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            isValid = false;
            emailInput.classList.add('error');
            errors.push('Email is required');
        } else if (!emailRegex.test(emailInput.value.trim())) {
            isValid = false;
            emailInput.classList.add('error');
            errors.push('Please enter a valid email address');
        } else {
            emailInput.classList.remove('error');
        }

        // Phone validation
        if (!phoneInput.value.trim()) {
            isValid = false;
            phoneInput.classList.add('error');
            errors.push('Phone number is required');
        } else {
            phoneInput.classList.remove('error');
        }

        // Skills validation
        if (!skillsInput.value.trim()) {
            isValid = false;
            skillsInput.classList.add('error');
            errors.push('Skills are required');
        } else {
            skillsInput.classList.remove('error');
        }

        if (!isValid) {
            showNotification(errors[0], 'error');
        }

        return isValid;
    }

    // Handle form input events
    [nameInput, emailInput, phoneInput, skillsInput].forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                saveFormData(); // Auto-save on input
            });
        }
    });

    // Generate resume function with enhanced security
    function generateResume() {
        if (!validateForm()) {
            return;
        }

        // Get form data with sanitization
        const formData = {
            name: sanitizeHTML(nameInput.value.trim()),
            email: sanitizeHTML(emailInput.value.trim()),
            phone: sanitizeHTML(phoneInput.value.trim()),
            summary: sanitizeHTML(document.getElementById('summary').value.trim()),
            skills: skillsInput.value.trim().split(',').map(skill => sanitizeHTML(skill.trim())),
            experiences: Array.from(document.querySelectorAll('.experience-entry')).map(entry => ({
                title: sanitizeHTML(entry.querySelector('[name="job-title"]').value.trim()),
                company: sanitizeHTML(entry.querySelector('[name="company"]').value.trim()),
                startDate: entry.querySelector('[name="start-date"]').value,
                endDate: entry.querySelector('[name="current-job"]').checked ? 'Present' : entry.querySelector('[name="end-date"]').value,
                description: sanitizeHTML(entry.querySelector('[name="job-description"]').value.trim())
            })).filter(exp => exp.title || exp.company),
            education: Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
                degree: sanitizeHTML(entry.querySelector('[name="degree"]').value.trim()),
                institution: sanitizeHTML(entry.querySelector('[name="institution"]').value.trim()),
                graduationYear: entry.querySelector('[name="graduation-year"]').value,
                marks: {
                    type: entry.querySelector('[name="marks-type"]').value,
                    value: sanitizeHTML(entry.querySelector('[name="marks"]').value.trim())
                }
            })).filter(edu => edu.degree || edu.institution),
            projects: Array.from(document.querySelectorAll('.project-entry')).map(entry => ({
                name: sanitizeHTML(entry.querySelector('[name="project-name"]').value.trim()),
                description: sanitizeHTML(entry.querySelector('[name="project-description"]').value.trim()),
                link: sanitizeHTML(entry.querySelector('[name="project-link"]').value.trim())
            })).filter(proj => proj.name),
            certifications: Array.from(document.querySelectorAll('.certification-entry')).map(entry => ({
                name: sanitizeHTML(entry.querySelector('[name="cert-name"]').value.trim()),
                issuer: sanitizeHTML(entry.querySelector('[name="issuing-org"]').value.trim()),
                date: entry.querySelector('[name="cert-date"]').value
            })).filter(cert => cert.name),
            languages: Array.from(document.querySelectorAll('.language-entry')).map(entry => ({
                language: sanitizeHTML(entry.querySelector('[name="language"]').value.trim()),
                proficiency: entry.querySelector('[name="proficiency"]').value
            })).filter(lang => lang.language),
            linkedin: sanitizeHTML(document.getElementById('linkedin').value.trim())
        };

        // Create resume preview
        const resumePreview = document.createElement('div');
        resumePreview.className = 'resume-preview';
        resumePreview.innerHTML = `
            <div class="preview-header">
                <h2>${formData.name}</h2>
                <p>${formData.email} | ${formData.phone}</p>
                ${formData.linkedin ? `<p><a href="${formData.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></p>` : ''}
            </div>

            ${formData.summary ? `
            <div class="preview-summary">
                <h3>Professional Summary</h3>
                <p>${formData.summary}</p>
            </div>` : ''}

            ${formData.experiences.length > 0 ? `
            <div class="preview-experience">
                <h3>Work Experience</h3>
                ${formData.experiences.map(exp => `
                    <div class="preview-item">
                        <h4>${exp.title}${exp.company ? ` at ${exp.company}` : ''}</h4>
                        ${exp.startDate ? `<p class="date">${exp.startDate} - ${exp.endDate}</p>` : ''}
                        ${exp.description ? `<div class="description">
                            ${exp.description.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('')}
                        </div>` : ''}
                    </div>
                `).join('')}
            </div>` : ''}

            ${formData.education.length > 0 ? `
            <div class="preview-education">
                <h3>Education</h3>
                ${formData.education.map(edu => `
                    <div class="preview-item">
                        <h4>${edu.degree}</h4>
                        <p>${edu.institution}</p>
                        <p>${edu.graduationYear ? edu.graduationYear : ''}${edu.marks.value ? (edu.graduationYear ? ' | ' : '') + `${edu.marks.type.toUpperCase()}: ${edu.marks.value}` : ''}</p>
                    </div>
                `).join('')}
            </div>` : ''}

            ${formData.skills.length > 0 && formData.skills[0] ? `
            <div class="preview-skills">
                <h3>Skills</h3>
                <ul>
                    ${formData.skills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>` : ''}

            ${formData.projects.length > 0 ? `
            <div class="preview-projects">
                <h3>Projects</h3>
                ${formData.projects.map(project => `
                    <div class="preview-item">
                        <h4>${project.name}</h4>
                        ${project.description ? `<div class="description">
                            ${project.description.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('')}
                        </div>` : ''}
                        ${project.link ? `<p><a href="${project.link}" target="_blank" rel="noopener noreferrer">Project Link</a></p>` : ''}
                    </div>
                `).join('')}
            </div>` : ''}

            ${formData.certifications.length > 0 ? `
            <div class="preview-certifications">
                <h3>Certifications</h3>
                ${formData.certifications.map(cert => `
                    <div class="preview-item">
                        <h4>${cert.name}</h4>
                        <p>${cert.issuer}${cert.date ? ` | ${cert.date}` : ''}</p>
                    </div>
                `).join('')}
            </div>` : ''}

            ${formData.languages.length > 0 ? `
            <div class="preview-languages">
                <h3>Languages</h3>
                <ul>
                    ${formData.languages.map(lang => `
                        <li>${lang.language} - ${lang.proficiency.charAt(0).toUpperCase() + lang.proficiency.slice(1)}</li>
                    `).join('')}
                </ul>
            </div>` : ''}
        `;

        // Check if there's an existing preview
        const existingPreview = document.querySelector('.resume-preview');
        if (existingPreview) {
            existingPreview.innerHTML = resumePreview.innerHTML;
        } else {
            // Add the new preview
            document.querySelector('.resume-form-container').appendChild(resumePreview);
        }

        // Save the complete resume data
        try {
            localStorage.setItem('generatedResume', JSON.stringify(formData));
        } catch (error) {
            console.error('Error saving resume:', error);
        }

        showNotification('Resume generated successfully!', 'success');
        
        // Show download button
        const downloadButton = document.getElementById('download-resume');
        if (downloadButton) {
            downloadButton.style.display = 'inline-block';
        }

        // Automatically save to database after generation
        (async () => {
            try {
                const response = await fetch('http://localhost:3000/api/resumes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                const data = await response.json().catch(() => ({}));
                if (!response.ok) {
                    throw new Error(data.error || `Failed to save (status ${response.status})`);
                }
                showNotification('Resume saved to database!', 'success');
                console.log('Saved resume id:', data.id);
            } catch (err) {
                console.error('Auto-save error:', err);
                showNotification(`Failed to save to database: ${err.message}`, 'error');
            }
        })();
    }

    // Add click event listener to generate button
    if (generateButton) {
        generateButton.addEventListener('click', generateResume);
    }

    // Download resume function
    function downloadResume() {
        const resumePreview = document.querySelector('.resume-preview');
        if (!resumePreview) {
            showNotification('Please generate a resume first!', 'error');
            return;
        }

        // Create a new window with the resume content
        const resumeContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${document.getElementById('name').value || 'Professional Resume'}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 2rem;
            background: white;
            color: #000;
        }
        .resume-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #1d4ed8;
        }
        .resume-header h1 {
            margin: 0;
            color: #1d4ed8;
            font-size: 2rem;
        }
        .resume-header p {
            margin: 0.5rem 0;
            color: #666;
        }
        .resume-section {
            margin-bottom: 2rem;
        }
        .resume-section h2 {
            color: #111827;
            font-size: 1.25rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e5e7eb;
        }
        .resume-item {
            margin-bottom: 1.25rem;
            padding-bottom: 1.25rem;
            border-bottom: 1px dashed #e5e7eb;
        }
        .resume-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .resume-item h3 {
            margin: 0 0 0.5rem 0;
            color: #000;
            font-size: 1.1rem;
            font-weight: normal;
        }
        .resume-item .date {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
        }
        .resume-item p {
            margin-bottom: 0.5rem;
            color: #333;
        }
        .skills-list, .languages-list {
            list-style: none;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .skills-list li {
            background-color: #e0e7ff;
            color: #1d4ed8;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.875rem;
        }
        .languages-list li {
            background-color: #f3f4f6;
            padding: 0.25rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.9rem;
            color: #374151;
        }
        a {
            color: #2563eb;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        @media print {
            body { padding: 1rem; }
            .resume-section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    ${resumePreview.innerHTML}
</body>
</html>`;

        // Create a blob with the content
        const blob = new Blob([resumeContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link element
        const a = document.createElement('a');
        a.href = url;
        a.download = `${document.getElementById('name').value || 'resume'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        showNotification('Resume downloaded successfully!', 'success');
    }

    // Add click event listener to download button
    const downloadButton = document.getElementById('download-resume');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadResume);
    }

    // Removed manual Save to DB flow; Generate now auto-saves to database

    // Add form submit handler
    if (resumeForm) {
        resumeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateResume();
        });
    }

    // Add CSS animations and resume preview styling
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
        
        /* Resume Preview Text Styling */
        .resume-preview h2,
        .resume-preview h3 {
            font-weight: 700 !important;
            color: #000000 !important;
        }
        
        .resume-preview h2 {
            font-size: 1.75rem !important;
        }
        
        .resume-preview h3 {
            font-size: 1.25rem !important;
        }
        
        .resume-preview h4 {
            font-size: 1.1rem !important;
            font-weight: 400 !important;
        }
        
        .resume-preview p,
        .resume-preview li,
        .resume-preview .description,
        .resume-preview .date {
            color: #000000 !important;
            font-weight: 400 !important;
        }
        
        .resume-preview ul li {
            font-weight: 400 !important;
        }
        
        .resume-preview a {
            color: #2563eb !important;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
});
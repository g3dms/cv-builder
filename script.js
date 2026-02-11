// Data storage
let cvData = {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    experiences: [],
    skills: []
};

function updatePreview() {
    const preview = document.getElementById('cvPreview');
    preview.innerHTML = '';
    
    // Name
    if (cvData.name) {
        const name = document.getElementById('name').value;
        preview.innerHTML += `<h1>${cvData.name}</h1>`;
        cvData.name.push(name);
    }
    
    // Contact info
    let contactHTML = '<div>';
    if (cvData.email) contactHTML += `<p>Email: ${cvData.email}</p>`;
    if (cvData.phone) contactHTML += `<p>Phone: ${cvData.phone}</p>`;
    if (cvData.linkedin) contactHTML += `<p>LinkedIn: ${cvData.linkedin}</p>`;
    if (cvData.github) contactHTML += `<p>GitHub: ${cvData.github}</p>`;
    contactHTML += '</div>';
    preview.innerHTML += contactHTML;
    
    // Experiences
    if (cvData.experiences.length > 0) {
        preview.innerHTML += '<h2>Experience</h2>';
        cvData.experiences.forEach(exp => {
            preview.innerHTML += `
                <div class="experience-item">
                    <h3>${exp.jobTitle} at ${exp.company}</h3>
                    <p>${exp.startDate} - ${exp.currentJob ? 'Present' : exp.endDate}</p>
                    <p>${exp.description}</p>
                </div>
            `;
        });
    }
    
    // Skills
    if (cvData.skills.length > 0) {
        preview.innerHTML += '<h2>Skills</h2><div>';
        cvData.skills.forEach(skill => {
            preview.innerHTML += `<span class="skill-tag">${skill}</span>`;
        });
        preview.innerHTML += '</div>';
    }
}

function addExperience() {
    const jobTitle = document.getElementById('jobTitle').value;
    const company = document.getElementById('company').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const currentJob = document.getElementById('currentJob').checked;
    const description = document.getElementById('description').value;
    
    if (!jobTitle || !company) {
        alert('Please fill in job title and company');
        return;
    }
    
    const experience = {
        jobTitle,
        company,
        startDate,
        endDate: currentJob ? 'Present' : endDate,
        currentJob,
        description
    };
    
    cvData.experiences.push(experience);
    
    // Add to experience list display
    const expList = document.getElementById('experienceList');
    expList.innerHTML += `
        <div class="experience-item">
            <strong>${jobTitle}</strong> at ${company}<br>
            <small>${startDate} - ${currentJob ? 'Present' : endDate}</small>
            <button onclick="removeExperience(${cvData.experiences.length - 1})">Remove</button>
        </div>
    `;
    
    // Clear
    document.getElementById('jobTitle').value = '';
    document.getElementById('company').value = '';
    document.getElementById('description').value = '';
    
    updatePreview();
}

function addSkill() {
    const skillInput = document.getElementById('newSkill');
    const skill = skillInput.value.trim();
    
    if (skill && !cvData.skills.includes(skill)) {
        cvData.skills.push(skill);
        
        const skillsDisplay = document.getElementById('skillsDisplay');
        skillsDisplay.innerHTML += `<span class="skill-tag">${skill} <button onclick="removeSkill('${skill}')">x</button></span> `;
        
        skillInput.value = '';
        updatePreview();
    }
}

function removeExperience(index) {
    cvData.experiences.splice(index, 1);
    updateExperienceList();
    updatePreview();
}

function removeSkill(skill) {
    cvData.skills = cvData.skills.filter(s => s !== skill);
    updateSkillsDisplay();
    updatePreview();
}

// Save to localStorage
function saveCV() {
    // Update cvData from form
    cvData.name = document.getElementById('name').value;
    cvData.email = document.getElementById('email').value;
    cvData.phone = document.getElementById('phone').value;
    cvData.linkedin = document.getElementById('linkedin').value;
    cvData.github = document.getElementById('github').value;
    
    localStorage.setItem('cvData', JSON.stringify(cvData));
    alert('CV saved to browser storage!');
}

// Clear everything
function resetAll() {
    if (confirm('Are you sure? This will clear everything.')) {
        cvData = { name: "", email: "", phone: "", linkedin: "", github: "", experiences: [], skills: [] };
        localStorage.removeItem('cvData');
        
        document.querySelectorAll('input, textarea').forEach(input => {
            input.value = '';
        });
        
        document.getElementById('experienceList').innerHTML = '<h4>Your Experiences:</h4>';
        document.getElementById('skillsDisplay').innerHTML = '';
        document.getElementById('cvPreview').innerHTML = '';
    }
}

// Load saved data
window.onload = function() {
    const saved = localStorage.getItem('cvData');
    if (saved) {
        cvData = JSON.parse(saved);
        
        // Fill form
        document.getElementById('name').value = cvData.name || '';
        document.getElementById('email').value = cvData.email || '';
        document.getElementById('phone').value = cvData.phone || '';
        document.getElementById('linkedin').value = cvData.linkedin || '';
        document.getElementById('github').value = cvData.github || '';
        
        // Update displays
        updateExperienceList();
        updateSkillsDisplay();
        updatePreview();
    }
};

// Helper functions
function updateExperienceList() {
    const expList = document.getElementById('experienceList');
    expList.innerHTML = '<h4>Your Experiences:</h4>';
    cvData.experiences.forEach((exp, index) => {
        expList.innerHTML += `
            <div class="experience-item">
                <strong>${exp.jobTitle}</strong> at ${exp.company}<br>
                <small>${exp.startDate} - ${exp.currentJob ? 'Present' : exp.endDate}</small>
                <button onclick="removeExperience(${index})">Remove</button>
            </div>
        `;
    });
}

function updateSkillsDisplay() {
    const skillsDisplay = document.getElementById('skillsDisplay');
    skillsDisplay.innerHTML = '';
    cvData.skills.forEach(skill => {
        skillsDisplay.innerHTML += `<span class="skill-tag">${skill} <button onclick="removeSkill('${skill}')">x</button></span> `;
    });
}
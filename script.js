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

// Update preview
function updatePreview() {
    const preview = document.getElementById('cvPreview');
    preview.innerHTML = '';
    
    if (cvData.name) {
        const nameLength = cvData.name.length;
        let fontSize = '36px'; 
        
        if (nameLength > 30) {
            fontSize = '24px';
        } else if (nameLength > 20) {
            fontSize = '28px';
        } else if (nameLength > 15) {
            fontSize = '32px';
        }
        
        preview.innerHTML += `
            <h1 style="
                text-align: center;
                font-size: ${fontSize};
                margin: 20px 0 10px 0;
                color: #333;
                font-weight: bold;
                word-wrap: break-word;
            ">${cvData.name}</h1>
        `;
    } else {
        preview.innerHTML += `
            <h1 style="
                text-align: center;
                font-size: 36px;
                margin: 20px 0 10px 0;
                color: #999;
                font-weight: normal;
            ">Your Name</h1>
        `;
    }
    
    let contactItems = [];
    
    if (cvData.email) {
        contactItems.push(`Email: ${cvData.email}`);
    }
    
    if (cvData.linkedin) {
        let linkedinText = cvData.linkedin;
        if (cvData.linkedin.includes('linkedin.com/in/')) {
            linkedinText = cvData.linkedin.split('linkedin.com/in/')[1].replace('/', '');
        }
        contactItems.push(`LinkedIn: <a href="${cvData.linkedin.startsWith('http') ? cvData.linkedin : 'https://' + cvData.linkedin}" target="_blank" style="color: #0066cc; text-decoration: none;">${linkedinText}</a>`);
    }
    
    if (cvData.github) {
        let githubText = cvData.github;
        if (cvData.github.includes('github.com/')) {
            githubText = cvData.github.split('github.com/')[1].replace('/', '');
        }
        contactItems.push(`GitHub: <a href="${cvData.github.startsWith('http') ? cvData.github : 'https://' + cvData.github}" target="_blank" style="color: #0066cc; text-decoration: none;">${githubText}</a>`);
    }
    
    if (cvData.phone) {
        contactItems.push(`Phone: ${cvData.phone}`);
    }
    
    let contactHTML = '<div style="margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #eee; text-align: center;">';
    if (contactItems.length > 0) {
        contactHTML += contactItems.join(' || ');
    } else {
        contactHTML += '<span style="color: #999;">Email · LinkedIn · GitHub · Phone</span>';
    }
    contactHTML += '</div>';
    
    preview.innerHTML += contactHTML;
    
    if (cvData.experiences.length > 0) {
        preview.innerHTML += '<h2 style="margin-top: 25px;">Experience</h2>';
        cvData.experiences.forEach(exp => {
            preview.innerHTML += `
                <div class="experience-item" style="margin-bottom: 20px;">
                    <div><strong>${exp.jobTitle}</strong> at <span style="color: #0066cc;">${exp.company}</span></div>
                    <div style="color: #666; font-size: 0.9em;">${exp.startDate} - ${exp.currentJob ? 'Present' : exp.endDate}</div>
                    <p style="margin-top: 5px;">${exp.description || 'No description provided'}</p>
                </div>
            `;
        });
    } else {
        preview.innerHTML += '<p style="color: #999; text-align: center;">Add your experience using the form.</p>';
    }
    
    if (cvData.skills.length > 0) {
        preview.innerHTML += '<h2 style="margin-top: 25px;">Skills</h2><div style="margin-top: 10px; text-align: center;">';
        cvData.skills.forEach(skill => {
            preview.innerHTML += `<span style="display: inline-block; background: #e0e0e0; padding: 5px 12px; margin: 5px; border-radius: 15px; font-size: 14px;">${skill}</span>`;
        });
        preview.innerHTML += '</div>';
    } else {
        preview.innerHTML += '<p style="color: #999; text-align: center;">Add your skills.</p>';
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
    
    updateExperienceList();
    
    document.getElementById('jobTitle').value = '';
    document.getElementById('company').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('currentJob').checked = false;
    document.getElementById('description').value = '';
    
    updatePreview();
    saveToLocalStorage(); 
}

function addSkill() {
    const skillInput = document.getElementById('newSkill');
    const skill = skillInput.value.trim();
    
    if (skill && !cvData.skills.includes(skill)) {
        cvData.skills.push(skill);
        
        updateSkillsDisplay();
        
        skillInput.value = '';
        updatePreview();
        saveToLocalStorage(); 
    }
}

function removeExperience(index) {
    cvData.experiences.splice(index, 1);
    updateExperienceList();
    updatePreview();
    saveToLocalStorage();
}

function removeSkill(skill) {
    cvData.skills = cvData.skills.filter(s => s !== skill);
    updateSkillsDisplay();
    updatePreview();
    saveToLocalStorage();
}

function saveToLocalStorage() {
    cvData.name = document.getElementById('name').value;
    cvData.email = document.getElementById('email').value;
    cvData.phone = document.getElementById('phone').value;
    cvData.linkedin = document.getElementById('linkedin').value;
    cvData.github = document.getElementById('github').value;
    
    localStorage.setItem('cvData', JSON.stringify(cvData));
    showMessage('Auto-saved!');
}

function exportPDF() {
    const preview = document.getElementById('cvPreview');
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>${cvData.name || 'My CV'}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 40px auto;
                    padding: 20px;
                    line-height: 1.6;
                }
                h1 { 
                    color: #333; 
                    border-bottom: 2px solid #333; 
                    padding-bottom: 10px;
                    font-size: 28px;
                }
                h2 { 
                    color: #444; 
                    margin-top: 25px; 
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 5px;
                }
                .contact-info { 
                    margin: 15px 0;
                    background: #f9f9f9;
                    padding: 10px;
                    border-radius: 5px;
                }
                .contact-info p {
                    margin: 5px 0;
                }
                .experience-item { 
                    margin: 20px 0;
                    padding: 10px;
                    background: white;
                }
                .job-title { 
                    font-weight: bold;
                    font-size: 16px;
                }
                .company { 
                    color: #0066cc;
                }
                .dates { 
                    color: #666; 
                    font-size: 0.9em;
                    margin: 5px 0;
                }
                .skill-tag { 
                    display: inline-block; 
                    background: #e0e0e0; 
                    padding: 5px 12px; 
                    margin: 5px;
                    border-radius: 15px;
                    font-size: 14px;
                }
                @media print {
                    body { 
                        margin: 0; 
                        padding: 0.5in;
                    }
                    .contact-info {
                        background: none;
                        border: 1px solid #ddd;
                    }
                }
            </style>
        </head>
        <body>
            ${preview.innerHTML}
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 40px;">
                Generated by CV Builder - ${new Date().toLocaleDateString()}
            </p>
        </body>
        </html>
    `);
    printWindow.document.close();
    
    printWindow.onload = function() {
        printWindow.print();
        showMessage('Print dialog opened. Choose "Save as PDF" to export.');
    };
}

function resetAll() {
    if (confirm('Are you sure? This will clear everything.')) {
        cvData = {
            name: "",
            email: "",
            phone: "",
            linkedin: "",
            github: "",
            experiences: [],
            skills: []
        };
        localStorage.removeItem('cvData');
        
        document.querySelectorAll('input, textarea').forEach(input => {
            input.value = '';
        });
        document.getElementById('currentJob').checked = false;
        
        updateExperienceList();
        updateSkillsDisplay();
        updatePreview();
        showMessage('All data cleared!');
    }
}

function updateExperienceList() {
    const expList = document.getElementById('experienceList');
    expList.innerHTML = '<h4>Your Experiences:</h4>';
    
    if (cvData.experiences.length === 0) {
        expList.innerHTML += '<p style="color: #999;">No experiences added yet.</p>';
        return;
    }
    
    cvData.experiences.forEach((exp, index) => {
        expList.innerHTML += `
            <div class="experience-item" style="border: 1px solid #eee; padding: 10px; margin: 10px 0;">
                <strong>${exp.jobTitle}</strong> at ${exp.company}<br>
                <small>${exp.startDate} - ${exp.currentJob ? 'Present' : exp.endDate}</small>
                <p style="margin: 5px 0;">${exp.description}</p>
                <button onclick="removeExperience(${index})" style="background: #ff4444;">Remove</button>
            </div>
        `;
    });
}

function updateSkillsDisplay() {
    const skillsDisplay = document.getElementById('skillsDisplay');
    skillsDisplay.innerHTML = '';
    
    if (cvData.skills.length === 0) {
        skillsDisplay.innerHTML = '<p style="color: #999;">No skills added yet.</p>';
        return;
    }
    
    cvData.skills.forEach(skill => {
        skillsDisplay.innerHTML += `
            <span style="
                display: inline-block; 
                background: #e0e0e0; 
                padding: 5px 10px; 
                margin: 5px;
                border-radius: 3px;
            ">
                ${skill} 
                <button onclick="removeSkill('${skill}')" style="
                    background: none; 
                    border: none; 
                    color: #999; 
                    cursor: pointer;
                    margin-left: 5px;
                ">×</button>
            </span>
        `;
    });
}

function showMessage(text) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

// Note: Export, import does not work yet
function exportToFile() {
    const dataStr = JSON.stringify(cvData, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Data exported to file!');
}

function importFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            cvData = JSON.parse(e.target.result);
            updateAllDisplays();
            saveToLocalStorage();
            showMessage('Data loaded from file!');
        } catch (err) {
            alert('Invalid file format');
        }
    };
    reader.readAsText(file);
    
    event.target.value = '';
}

function generateShareLink() {
    const dataStr = btoa(JSON.stringify(cvData));
    const url = `${window.location.origin}${window.location.pathname}?data=${dataStr}`;
    
    navigator.clipboard.writeText(url).then(() => {
        showMessage('Share link copied!');
    }).catch(() => {
        prompt('Copy this link:', url);
    });
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('cvData');
    if (saved) {
        try {
            cvData = JSON.parse(saved);
            updateAllDisplays();
            showMessage('Loaded saved data!');
        } catch (e) {
            console.log('Error loading saved data');
        }
    }
}

function updateAllDisplays() {
    document.getElementById('name').value = cvData.name || '';
    document.getElementById('email').value = cvData.email || '';
    document.getElementById('phone').value = cvData.phone || '';
    document.getElementById('linkedin').value = cvData.linkedin || '';
    document.getElementById('github').value = cvData.github || '';
    
    updateExperienceList();
    updateSkillsDisplay();
    updatePreview();
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    
    if (sharedData) {
        try {
            cvData = JSON.parse(atob(sharedData));
            updateAllDisplays();
            showMessage('Loaded shared CV! Save to your browser for later use.');
        } catch (e) {
            loadFromLocalStorage();
        }
    } else {
        loadFromLocalStorage();
    }
    
    window.addEventListener('beforeunload', function() {
        saveToLocalStorage();
    });
};
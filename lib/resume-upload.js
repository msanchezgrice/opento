// Resume upload and parsing - Handles file upload and form pre-fill

// Global function for resume upload
window.handleResumeUpload = async function(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file type
  const validTypes = ['.pdf', '.docx'];
  const filename = file.name.toLowerCase();
  const isValid = validTypes.some(type => filename.endsWith(type));
  
  if (!isValid) {
    alert('Please upload a PDF or DOCX file.');
    event.target.value = ''; // Reset input
    return;
  }
  
  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('File too large. Maximum size is 5MB.');
    event.target.value = '';
    return;
  }
  
  // Show loading state
  document.getElementById('resumeLoading').style.display = 'block';
  document.getElementById('resumeSuccess').style.display = 'none';
  document.getElementById('linkedInSuccess').style.display = 'none';
  
  try {
    // Convert file to base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // Send to API for parsing
    const response = await fetch('/api/resume/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        data: base64Data
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to parse resume');
    }
    
    const result = await response.json();
    const parsed = result.parsed;
    
    console.log('✓ Resume parsed:', parsed);
    
    // Store parsed data in localStorage
    localStorage.setItem('resume_data', JSON.stringify(parsed));
    
    // Pre-fill form with parsed data
    prefillFromResume(parsed);
    
    // Hide loading, show success
    document.getElementById('resumeLoading').style.display = 'none';
    document.getElementById('resumeSuccess').style.display = 'block';
    
    // Track event
    if (window.track) {
      window.track('Resume Uploaded', {
        filename: file.name,
        hasName: !!parsed.name,
        skillsCount: parsed.skills?.length || 0,
        experienceYears: parsed.yearsExperience || 0
      });
    }
    
  } catch (error) {
    console.error('Resume upload error:', error);
    document.getElementById('resumeLoading').style.display = 'none';
    alert(error.message || 'Failed to parse resume. Please try again or enter your information manually.');
  }
  
  // Reset input
  event.target.value = '';
};

// Function to pre-fill form from resume data
function prefillFromResume(data) {
  console.log('Pre-filling form from resume data:', data);
  
  // Years of experience
  if (data.yearsExperience) {
    const yearsSelect = document.getElementById('years');
    if (yearsSelect) {
      const years = Math.min(parseInt(data.yearsExperience) || 0, 20);
      yearsSelect.value = years;
      console.log(`✓ Set years: ${years}`);
    }
  }
  
  // Location
  if (data.location) {
    const locationInput = document.getElementById('location');
    if (locationInput) {
      locationInput.value = data.location;
      console.log(`✓ Set location: ${data.location}`);
    }
  }
  
  // Skills - add to the skills selector
  if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
    console.log(`Adding ${data.skills.length} skills...`);
    
    // Wait a bit for skills selector to be initialized
    setTimeout(() => {
      // Use the addSkill function from skills-selector.js if available
      if (window.addSkillToForm) {
        data.skills.forEach(skill => {
          window.addSkillToForm(skill);
        });
      } else {
        // Fallback: try to trigger the skills input
        const skillsInput = document.getElementById('skillsInput');
        if (skillsInput) {
          data.skills.forEach((skill, index) => {
            setTimeout(() => {
              skillsInput.value = skill;
              skillsInput.dispatchEvent(new Event('input', { bubbles: true }));
              // Try to click the first dropdown item
              const firstItem = document.querySelector('#skillsDropdown .skill-item');
              if (firstItem) firstItem.click();
            }, index * 100);
          });
        }
      }
    }, 500);
  }
  
  // Name (pre-fill for later steps)
  if (data.name) {
    localStorage.setItem('onboarding_name', data.name);
    console.log(`✓ Stored name: ${data.name}`);
  }
  
  // Email (pre-fill for later steps)
  if (data.email) {
    localStorage.setItem('onboarding_email', data.email);
    console.log(`✓ Stored email: ${data.email}`);
  }
  
  // Current role and company
  if (data.currentRole) {
    localStorage.setItem('onboarding_role', data.currentRole);
    console.log(`✓ Stored role: ${data.currentRole}`);
  }
  if (data.currentCompany) {
    localStorage.setItem('onboarding_company', data.currentCompany);
    console.log(`✓ Stored company: ${data.currentCompany}`);
  }
  
  // Summary/bio
  if (data.summary) {
    localStorage.setItem('onboarding_summary', data.summary);
    console.log(`✓ Stored summary`);
  }
  
  console.log('✓ Form pre-filled from resume');
}

// Make prefillFromResume available globally for testing
window.prefillFromResume = prefillFromResume;

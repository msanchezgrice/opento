// Enhanced Skills Selector with autocomplete dropdown
// Fetches skills from API and shows categorized dropdown

(function() {
  let allSkills = [];
  let groupedSkills = {};
  let selectedSkills = [];
  let highlightedIndex = -1;
  let visibleOptions = [];

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

  // Initialize skills selector
  window.initializeSkillsSelector = async function() {
    const input = document.getElementById('skillsInput');
    const dropdown = document.getElementById('skillsDropdown');
    const chipsContainer = document.getElementById('skillsChips');
    const hiddenInput = document.getElementById('skills');

    if (!input || !dropdown || !chipsContainer) {
      console.error('Skills selector elements not found');
      return;
    }

    // Fetch skills from API
    await fetchSkills();

    // Event listeners
    input.addEventListener('focus', () => showDropdown());
    input.addEventListener('input', () => filterSkills(input.value));
    input.addEventListener('keydown', (e) => handleKeyDown(e));

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        hideDropdown();
      }
    });

    console.log('✓ Skills selector initialized with', allSkills.length, 'skills');
  };

  async function fetchSkills() {
    try {
      const response = await fetch(`${API_BASE}/skills`);
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }

      const data = await response.json();
      allSkills = data.skills || [];
      groupedSkills = data.grouped || {};

      console.log('✓ Loaded', allSkills.length, 'skills in', Object.keys(groupedSkills).length, 'categories');
    } catch (error) {
      console.error('Error fetching skills:', error);
      allSkills = [];
      groupedSkills = {};
      showError('Could not load skills. Please refresh the page.');
    }
  }

  function showDropdown() {
    const dropdown = document.getElementById('skillsDropdown');
    if (!dropdown || allSkills.length === 0) return;

    renderDropdown();
    dropdown.style.display = 'block';
    highlightedIndex = -1;
  }

  function hideDropdown() {
    const dropdown = document.getElementById('skillsDropdown');
    if (dropdown) dropdown.style.display = 'none';
    highlightedIndex = -1;
  }

  function renderDropdown(filter = '') {
    const dropdown = document.getElementById('skillsDropdown');
    if (!dropdown) return;

    const filterLower = filter.toLowerCase().trim();
    visibleOptions = [];

    let html = '';

    // If no filter, show all grouped
    if (!filterLower) {
      Object.keys(groupedSkills).forEach(category => {
        const categorySkills = groupedSkills[category];
        if (categorySkills.length === 0) return;

        html += `<div class="skills-category">`;
        html += `<div class="skills-category-name">${category}</div>`;

        categorySkills.forEach(skill => {
          const isSelected = selectedSkills.some(s => s.id === skill.id);
          const disabled = isSelected ? 'disabled' : '';
          html += `
            <div class="skills-option ${disabled}" data-skill-id="${skill.id}" data-skill-name="${skill.name}">
              ${skill.name}
            </div>
          `;
          if (!isSelected) {
            visibleOptions.push(skill);
          }
        });

        html += `</div>`;
      });
    } else {
      // Filter mode - show matching skills
      const matchingSkills = allSkills.filter(skill => 
        skill.name.toLowerCase().includes(filterLower) &&
        !selectedSkills.some(s => s.id === skill.id)
      );

      if (matchingSkills.length === 0) {
        html = '<div class="skills-dropdown-loading">No matching skills found</div>';
      } else {
        // Group filtered results by category
        const filteredGrouped = {};
        matchingSkills.forEach(skill => {
          const category = skill.category || 'Other';
          if (!filteredGrouped[category]) {
            filteredGrouped[category] = [];
          }
          filteredGrouped[category].push(skill);
        });

        Object.keys(filteredGrouped).forEach(category => {
          html += `<div class="skills-category">`;
          html += `<div class="skills-category-name">${category}</div>`;

          filteredGrouped[category].forEach(skill => {
            html += `
              <div class="skills-option" data-skill-id="${skill.id}" data-skill-name="${skill.name}">
                ${skill.name}
              </div>
            `;
            visibleOptions.push(skill);
          });

          html += `</div>`;
        });
      }
    }

    dropdown.innerHTML = html;

    // Add click handlers to options
    dropdown.querySelectorAll('.skills-option:not(.disabled)').forEach((el, index) => {
      el.addEventListener('click', () => {
        const skillId = el.dataset.skillId;
        const skillName = el.dataset.skillName;
        addSkill({ id: skillId, name: skillName });
      });

      // Update visible options index for keyboard navigation
      el.setAttribute('data-option-index', index);
    });
  }

  function filterSkills(query) {
    renderDropdown(query);
  }

  function handleKeyDown(e) {
    const dropdown = document.getElementById('skillsDropdown');
    const input = document.getElementById('skillsInput');

    if (dropdown.style.display === 'none') return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, visibleOptions.length - 1);
        updateHighlight();
        break;

      case 'ArrowUp':
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, -1);
        updateHighlight();
        break;

      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < visibleOptions.length) {
          addSkill(visibleOptions[highlightedIndex]);
          input.value = '';
          renderDropdown();
        }
        break;

      case 'Escape':
        e.preventDefault();
        hideDropdown();
        break;

      case 'Tab':
        hideDropdown();
        break;
    }
  }

  function updateHighlight() {
    const options = document.querySelectorAll('.skills-option:not(.disabled)');
    options.forEach((el, index) => {
      if (index === highlightedIndex) {
        el.classList.add('highlighted');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('highlighted');
      }
    });
  }

  function addSkill(skill) {
    // Check if already added
    if (selectedSkills.some(s => s.id === skill.id)) {
      return;
    }

    selectedSkills.push(skill);
    renderChips();
    updateHiddenInput();

    const input = document.getElementById('skillsInput');
    input.value = '';
    
    // Close dropdown after adding
    hideDropdown();

    console.log('✓ Skill added:', skill.name);
  }

  function removeSkill(skillId) {
    selectedSkills = selectedSkills.filter(s => s.id !== skillId);
    renderChips();
    updateHiddenInput();
    renderDropdown(); // Re-render to show removed skill in dropdown
  }

  function renderChips() {
    const chipsContainer = document.getElementById('skillsChips');
    if (!chipsContainer) return;

    if (selectedSkills.length === 0) {
      chipsContainer.innerHTML = '<div class="small muted" style="padding: 8px 0;">No skills added yet</div>';
      return;
    }

    chipsContainer.innerHTML = selectedSkills.map(skill => `
      <div class="skill-chip">
        <span>${skill.name}</span>
        <button type="button" class="skill-chip-remove" onclick="removeSkillById('${skill.id}')">×</button>
      </div>
    `).join('');
  }

  function updateHiddenInput() {
    const hiddenInput = document.getElementById('skills');
    if (!hiddenInput) return;

    // Store as JSON string
    hiddenInput.value = JSON.stringify(selectedSkills.map(s => s.name));

    // Form validation
    if (selectedSkills.length > 0) {
      hiddenInput.setCustomValidity('');
    } else {
      hiddenInput.setCustomValidity('Please add at least one skill');
    }
  }

  function showError(message) {
    const dropdown = document.getElementById('skillsDropdown');
    if (dropdown) {
      dropdown.innerHTML = `<div class="skills-dropdown-loading" style="color: var(--danger);">${message}</div>`;
      dropdown.style.display = 'block';
    }
  }

  // Global function to remove skill (called from chip button)
  window.removeSkillById = function(skillId) {
    removeSkill(skillId);
  };

  // Global function to get selected skills (for onboarding integration)
  window.getSelectedSkills = function() {
    return selectedSkills.map(s => s.name);
  };

})();

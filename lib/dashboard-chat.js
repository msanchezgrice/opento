// Dashboard chat integration - Simplified chat for Agent Settings tab

(function() {
  
  window.openDashboardChat = function(initialMessage) {
    const userData = window.currentUserData || {};
    
    // Set agent data for chat
    window.currentAgentData = {
      displayName: userData.displayName || 'Your Agent',
      display_name: userData.displayName || 'Your Agent',
      handle: userData.handle || 'agent',
      avatar_url: userData.avatar_url,
      avatar_initials: userData.avatarInitials,
      role: userData.role || 'Agent',
      summary: userData.summary || '',
      settings: userData.settings || {},
      skills: userData.skills || [],
      onboarding: {
        floor: userData.settings?.consult_floor_30m || 75,
        microFloor: userData.settings?.async_floor_5m || 12,
        hours: userData.settings?.weekly_hours || 6,
        window: userData.settings?.availability_window || 'Mon–Thu 11a–4p CT'
      },
      availability: userData.settings?.availability_window || 'By appointment',
      rulesSummary: userData.settings ? 
        `${userData.settings.anonymous_first ? 'Anonymous first' : 'Public'} • $${userData.settings.consult_floor_30m || 75}/30m floor` :
        'Standard consulting rates'
    };
    
    const chatModal = document.getElementById('chatModal');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    
    if (!chatModal || !chatMessages || !chatInput || !chatSend) {
      console.error('Chat elements not found');
      return;
    }
    
    // Setup chat if not already done
    if (!chatModal._dashboardChatInitialized) {
      initializeDashboardChat(chatModal, chatMessages, chatInput, chatSend);
      chatModal._dashboardChatInitialized = true;
    }
    
    // Open modal
    chatModal.style.display = 'flex';
    chatInput.focus();
    
    // Send initial message if provided
    if (initialMessage) {
      setTimeout(() => {
        chatInput.value = initialMessage;
        chatSend.click();
      }, 400);
    }
  };
  
  function initializeDashboardChat(chatModal, chatMessages, chatInput, chatSend) {
    const agent = window.currentAgentData || {};
    const chatState = { history: [], awaitingResponse: false };
    
    // Close handlers
    chatModal.addEventListener('click', (e) => {
      if (e.target === chatModal) chatModal.style.display = 'none';
    });
    
    document.querySelectorAll('[data-close="chat"]').forEach(btn => {
      btn.addEventListener('click', () => chatModal.style.display = 'none');
    });
    
    // Add message to chat
    function addMessage(text, isBot) {
      const msg = document.createElement('div');
      msg.className = `chat-message ${isBot ? 'bot' : 'user'}`;
      
      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      
      if (isBot && agent.avatar_url) {
        avatar.innerHTML = `<img src="${agent.avatar_url}" alt="Agent" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
      } else {
        avatar.textContent = isBot ? (agent.avatar_initials || 'AG') : 'Y';
      }
      
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = text;
      
      msg.appendChild(avatar);
      msg.appendChild(bubble);
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      chatState.history.push({ text, isBot });
    }
    
    function addBotMessage(text) {
      const typing = document.createElement('div');
      typing.className = 'chat-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      chatMessages.appendChild(typing);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      setTimeout(() => {
        typing.remove();
        addMessage(text, true);
      }, 800 + Math.random() * 400);
    }
    
    // Send message
    async function sendMessage(text) {
      if (!text || text.trim() === '') return;
      if (chatState.awaitingResponse) return;
      
      addMessage(text, false);
      chatInput.value = '';
      chatState.awaitingResponse = true;
      
      if (window.track) window.track('Dashboard Chat Message Sent');
      
      try {
        const messages = chatState.history
          .slice(-10)
          .map(msg => ({
            role: msg.isBot ? 'assistant' : 'user',
            content: msg.text
          }))
          .concat([{ role: 'user', content: text }]);
        
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages,
            agentData: agent
          })
        });
        
        if (!response.ok) {
          throw new Error('Chat API error');
        }
        
        const data = await response.json();
        chatState.awaitingResponse = false;
        addBotMessage(data.reply || 'Sorry, I had trouble with that. Can you try rephrasing?');
        
      } catch (error) {
        console.error('Chat error:', error);
        chatState.awaitingResponse = false;
        addBotMessage('Sorry, I\'m having connection issues. Please try again in a moment.');
      }
    }
    
    // Event listeners
    chatSend.addEventListener('click', () => sendMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage(chatInput.value);
      }
    });
    
    // Welcome message
    if (chatState.history.length === 0) {
      const firstName = (agent.displayName || 'Agent').split(' ')[0];
      setTimeout(() => {
        addBotMessage(`Hi! I'm your agent rep. I can help you optimize your profile, set the right rates, and get more matches. What would you like to know?`);
      }, 300);
    }
  }
  
})();

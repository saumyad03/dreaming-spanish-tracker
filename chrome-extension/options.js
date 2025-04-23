document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveBtn');
    const tokenInput = document.getElementById('tokenInput');
    const status = document.getElementById('status');
  
    chrome.storage.local.get('authToken', (result) => {
      if (result.authToken) {
        tokenInput.value = result.authToken;
      }
    });
  
    saveBtn.addEventListener('click', () => {
      const token = tokenInput.value.trim();
      if (!token) {
        status.textContent = 'Please enter a valid token.';
        return;
      }
      chrome.storage.local.set({ authToken: token }, () => {
        status.textContent = 'Token saved successfully.';
        setTimeout(() => status.textContent = '', 3000);
      });
    });
  });
  
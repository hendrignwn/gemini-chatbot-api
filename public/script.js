document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInputField = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const userMessage = userInputField.value.trim();
    if (!userMessage) {
      return; // Don't send empty messages
    }

    // Display user's message
    appendMessage(userMessage, 'user');

    // Clear the input field
    userInputField.value = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = data.reply; // Assuming your backend sends { "reply": "..." }

      // Display bot's message
      appendMessage(botMessage, 'bot');

    } catch (error) {
      console.error('Error sending message to backend:', error);
      appendMessage(`Error: ${error.message}`, 'error-message');
    }
  });

  function appendMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
  }
});
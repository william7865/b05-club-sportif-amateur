const form = document.querySelector('#chat-form');
const status = document.querySelector('#status');
const messageInput = document.querySelector('#message');
const suggestions = document.querySelector('ul#suggestions');

suggestions.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  messageInput.value = button.textContent.trim();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  status.textContent = 'Interface prête.';
});

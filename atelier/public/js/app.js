import { validateMessage, replyTo } from './brain.js';
import { renderMessages } from './view.js';

const form = document.querySelector('#chat-form');
const status = document.querySelector('#status');
const messageInput = document.querySelector('#message');
const messages = document.querySelector('#messages');
const suggestions = document.querySelector('ul#suggestions');

const historique = [];

suggestions.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  messageInput.value = button.textContent.trim();
  messageInput.focus();
  status.textContent = 'Question copiée : modifiez-la ou envoyez-la.';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const validation = validateMessage(messageInput.value);
  if (!validation.ok) {
    status.textContent = validation.error;
    messageInput.focus();
    return;
  }
  historique.push({ role: 'user', text: validation.value });
  historique.push({ role: 'assistant', text: replyTo(validation.value) });
  renderMessages(historique, messages);
  messageInput.value = '';
  status.textContent = '';
});

import { validateMessage, replyTo } from './brain.js';

const form = document.querySelector('#chat-form');
const status = document.querySelector('#status');
const messageInput = document.querySelector('#message');
const messages = document.querySelector('#messages');
const suggestions = document.querySelector('ul#suggestions');

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
  const item = document.createElement('li');
  item.textContent = `Vous : ${validation.value}`;
  messages.append(item);
  const answer = document.createElement('li');
  answer.textContent = `Cap Web : ${replyTo(validation.value)}`;
  messages.append(answer);
  messageInput.value = '';
  status.textContent = '';
});

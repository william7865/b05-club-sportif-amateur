import { validateMessage, replyTo } from './brain.js';
import { renderMessages } from './view.js';

const form = document.querySelector('#chat-form');
const status = document.querySelector('#status');
const messageInput = document.querySelector('#message');
const messages = document.querySelector('#messages');
const suggestions = document.querySelector('ul#suggestions');
const effacer = document.querySelector('#effacer');

const CLE_MEMOIRE = 'capweb.historique';

const historique = [];

try {
  const brut = localStorage.getItem(CLE_MEMOIRE);
  if (brut !== null) {
    const relu = JSON.parse(brut);
    if (Array.isArray(relu)) {
      historique.push(...relu);
    } else {
      status.textContent = 'Historique illisible : la conversation repart vide.';
    }
  }
} catch {
  status.textContent = 'Historique illisible : la conversation repart vide.';
}
renderMessages(historique, messages);

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
  localStorage.setItem(CLE_MEMOIRE, JSON.stringify(historique));
  renderMessages(historique, messages);
  messageInput.value = '';
  status.textContent = '';
});

effacer.addEventListener('click', () => {
  if (!confirm('Effacer la conversation ?')) {
    return;
  }
  historique.length = 0;
  localStorage.removeItem(CLE_MEMOIRE);
  renderMessages(historique, messages);
  status.textContent = '';
});

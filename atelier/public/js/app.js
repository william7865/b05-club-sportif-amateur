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
  const message = messageInput.value.trim();
  if (message === '') {
    status.textContent = 'Veuillez saisir un message avant d\u2019envoyer.';
    messageInput.focus();
    return;
  }
  const item = document.createElement('li');
  item.textContent = `Vous : ${message}`;
  messages.append(item);
  messageInput.value = '';
  status.textContent = '';
});

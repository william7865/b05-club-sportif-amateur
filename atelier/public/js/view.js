export function renderMessages(messages, container) {
  container.textContent = '';
  for (const message of messages) {
    const item = document.createElement('li');
    if (message.role === 'assistant') {
      item.textContent = `Cap Web : ${message.text}`;
    } else {
      item.textContent = `Vous : ${message.text}`;
    }
    container.append(item);
  }
}

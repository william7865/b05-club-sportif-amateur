export function validateMessage(raw) {
  if (typeof raw !== 'string') {
    return { ok: false, error: 'Veuillez saisir un message.' };
  }
  const value = raw.trim();
  if (value === '') {
    return { ok: false, error: "Veuillez saisir un message avant d'envoyer." };
  }
  return { ok: true, value };
}

export function replyTo(message) {
  const texte = typeof message === 'string' ? message.trim().toLowerCase() : '';
  if (texte === 'salut' || texte === 'bonjour') {
    return 'Salut ! Bienvenue au club : dis-moi ton niveau et je te recommande une séance adaptée cette semaine.';
  }
  if (texte === 'aide') {
    return 'Je peux te recommander une séance : dis « salut », demande une séance douce ou intense, ou lance un « test ».';
  }
  if (texte === 'test') {
    return 'Test bien reçu : les réponses du club sont prêtes. Essaie « aide » pour voir les séances proposées.';
  }
  return 'Bien noté ! Pour te recommander une séance, précise ton envie : douce, cardio ou collective ?';
}

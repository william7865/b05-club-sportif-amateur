import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateMessage, replyTo } from '../public/js/brain.js';

describe('brain', () => {
  it('une chaîne vide ou faite d’espaces est refusée', () => {
    assert.equal(validateMessage('').ok, false);
    assert.equal(validateMessage('   ').ok, false);
  });

  it('« salut » entouré d’espaces est accepté et rogné', () => {
    assert.deepEqual(validateMessage('  salut  '), { ok: true, value: 'salut' });
  });

  it('la limite accepte N caractères et refuse N + 1', () => {
    const N = 320;
    assert.equal(validateMessage('a'.repeat(N)).ok, true);
    assert.equal(validateMessage('a'.repeat(N + 1)).ok, false);
  });

  it('la casse ne change pas la réponse', () => {
    assert.equal(replyTo('SALUT'), replyTo('salut'));
  });

  it('« prairie » répond différemment d’une phrase inconnue', () => {
    assert.notEqual(replyTo('prairie'), replyTo('blabla inconnu xyz'));
  });
});

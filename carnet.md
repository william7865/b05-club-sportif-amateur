# Carnet de bord J1 · Appareillage


Un carnet par binôme, rempli au fil de l'eau avec vos propres mots. Une phrase honnête (« j'ai essayé X, j'ai vu Y, je ne comprends pas pourquoi ») vaut mieux qu'une phrase parfaite recopiée. Aucune donnée personnelle, aucune clé ni jeton, ni l'adresse complète que `dsh web` affiche (elle contient un jeton). C'est aussi votre journal de décisions (astuce 13) : ce que vous avez demandé, ce qui a cassé, ce que vous avez refusé, et pourquoi.

Binôme : William et Nicolas (groupe b05)

Thème provisoire et public visé : Club sportif amateur. L'assistant sert aux adhérents du club : il leur recommande des séances en fonction de chaque personne (niveau, objectif, disponibilités).

Trois questions auxquelles l'assistant pourrait répondre :
1. Quelle séance me conseilles-tu pour mon niveau ?
2. Quelles séances sont prévues cette semaine ?
3. Comment m'échauffer avant une séance ?

Rôles de départ et moments d'échange : William manipule, Nicolas vérifie. Échange des rôles environ toutes les 20 minutes.

## Cahier personnel (remis par le formateur en J1-01)

Recopiez les valeurs telles que le formateur vous les a remises. Ne les changez pas, ne les échangez pas avec un autre binôme.

- Limite de caractères d'un message (le nombre N) :
- Premier mot reconnu, en plus de « salut », « aide » et « test » :
- Second mot reconnu :

## Commandes essayées

Notez le dossier de lancement, la commande et sa sortie exacte, surtout quand un outil a bloqué.

- Dossier : `atelier`
- Commande et résultat : `node --version` → `v26.0.0` ; `npm start` → le serveur démarre, la page répond à `http://127.0.0.1:3000`.

Pour chaque checkpoint : cochez la case quand toute la preuve de la fiche est réunie, collez la preuve (texte, commande ou phrase), puis notez ce que vous avez prédit, essayé, observé, et une difficulté qui reste.

## Le chat web (N0 Subir)

### J1-01 · 🧭 Équipage — [fiche](checkpoints/J1-01-equipage.md)

- [ ] Validé
- Preuve (page de départ affichée sur votre poste, cahier personnel recopié ci-dessus) :
- Le `p#status` est-il vide dans le HTML ? Qui écrit sa phrase ? Oui, il est vide dans `index.html` (`<p id="status" role="status"></p>`). C'est `public/js/app.js` qui écrit « Votre point de départ est prêt. » avec `textContent`, une fois la page chargée par le navigateur.
- Décision prise ensemble :
- Difficulté qui reste :

### J1-02 · 💬 Premier prompt — [fiche](checkpoints/J1-02-premier-prompt.md)

- [ ] Validé
- Preuve : `essais-n0/chatbot-v1.html` s'ouvre ; le prompt et la première réponse sont collés ci-dessous, en entier, sans donnée personnelle.
- Mon prompt, tel quel :

  > Fais-moi un chatbot pour un club sportif amateur qui recommande des séances selon chaque personne, dans une seule page HTML que j'ouvre dans mon navigateur.

- La première réponse du chat (texte et code), telle quelle :

  > Voici un chatbot pour ton club : il demande le niveau, l'objectif et le temps disponible, puis recommande une séance adaptée. Copie ce code dans un fichier `.html` et ouvre-le dans ton navigateur.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coach du club - Chatbot</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: #eef2f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .chat {
      width: 420px;
      max-width: 100%;
      height: 600px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .chat-header {
      background: #1b7a4b;
      color: #fff;
      padding: 16px;
      font-size: 18px;
      font-weight: bold;
    }
    .chat-header small { display: block; font-weight: normal; font-size: 13px; opacity: 0.9; }
    .messages {
      flex: 1;
      padding: 12px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .msg {
      max-width: 80%;
      padding: 10px 12px;
      border-radius: 12px;
      line-height: 1.4;
      font-size: 15px;
      white-space: pre-line;
    }
    .bot { background: #e6f4ec; align-self: flex-start; }
    .user { background: #1b7a4b; color: #fff; align-self: flex-end; }
    .chat-form { display: flex; border-top: 1px solid #ddd; }
    .chat-form input {
      flex: 1;
      border: none;
      padding: 14px;
      font-size: 15px;
      outline: none;
    }
    .chat-form button {
      border: none;
      background: #1b7a4b;
      color: #fff;
      padding: 0 18px;
      font-size: 15px;
      cursor: pointer;
    }
    .chat-form button:hover { background: #15613b; }
  </style>
</head>
<body>
  <div class="chat">
    <div class="chat-header">
      Coach du club
      <small>Je te recommande une séance adaptée à ton profil</small>
    </div>
    <div class="messages" id="messages"></div>
    <form class="chat-form" id="form">
      <input type="text" id="input" placeholder="Écris ton message..." autocomplete="off">
      <button type="submit">Envoyer</button>
    </form>
  </div>

  <script>
    const messages = document.getElementById('messages');
    const form = document.getElementById('form');
    const input = document.getElementById('input');

    const profil = { niveau: null, objectif: null, temps: null };

    function ajouterMessage(texte, auteur) {
      const div = document.createElement('div');
      div.className = 'msg ' + auteur;
      div.textContent = texte;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function recommander() {
      const seances = {
        debutant: {
          endurance: 'Footing léger : 5 min de marche, puis 6 x (2 min de course / 1 min de marche).',
          force: 'Circuit au poids du corps : 3 tours de 10 squats, 8 pompes sur les genoux, 20 s de gainage.',
          souplesse: 'Étirements doux : 8 postures tenues 30 secondes, sans forcer.'
        },
        intermediaire: {
          endurance: 'Fractionné : 15 min de footing, puis 8 x (1 min rapide / 1 min lente).',
          force: 'Circuit : 4 tours de 15 squats, 12 pompes, 12 fentes par jambe, 40 s de gainage.',
          souplesse: 'Mobilité active : 10 exercices enchaînés, 2 passages.'
        },
        confirme: {
          endurance: 'Séance au seuil : 20 min de footing, puis 3 x 8 min à allure soutenue.',
          force: 'Circuit intense : 5 tours de 20 squats sautés, 15 pompes, 10 tractions, 1 min de gainage.',
          souplesse: 'Mobilité avancée : 12 exercices avec maintien long, 2 passages.'
        }
      };
      const seance = seances[profil.niveau][profil.objectif];
      return 'Voici ta séance (' + profil.temps + ' min) :\n' + seance +
        '\nPense à t\'échauffer 10 minutes avant. Tape "recommencer" pour un autre profil.';
    }

    function repondre(texte) {
      const t = texte.toLowerCase();

      if (t.includes('recommencer')) {
        profil.niveau = null;
        profil.objectif = null;
        profil.temps = null;
        return 'On repart de zéro. Quel est ton niveau : débutant, intermédiaire ou confirmé ?';
      }
      if (t.includes('bonjour') || t.includes('salut')) {
        return 'Salut ! Dis-moi ton niveau : débutant, intermédiaire ou confirmé ?';
      }
      if (t.includes('horaire') || t.includes('semaine')) {
        return 'Le club propose des séances le mardi et le jeudi à 19 h, et le samedi à 10 h.';
      }
      if (t.includes('échauff') || t.includes('echauff')) {
        return 'Échauffement type : 5 min de course lente, rotations des articulations, puis 3 accélérations progressives.';
      }

      if (!profil.niveau) {
        if (t.includes('débutant') || t.includes('debutant')) profil.niveau = 'debutant';
        else if (t.includes('intermédiaire') || t.includes('intermediaire')) profil.niveau = 'intermediaire';
        else if (t.includes('confirmé') || t.includes('confirme')) profil.niveau = 'confirme';
        else return 'Je n\'ai pas compris. Ton niveau : débutant, intermédiaire ou confirmé ?';
        return 'Noté. Quel est ton objectif : endurance, force ou souplesse ?';
      }

      if (!profil.objectif) {
        if (t.includes('endurance')) profil.objectif = 'endurance';
        else if (t.includes('force')) profil.objectif = 'force';
        else if (t.includes('souplesse')) profil.objectif = 'souplesse';
        else return 'Je n\'ai pas compris. Ton objectif : endurance, force ou souplesse ?';
        return 'Super. Combien de minutes as-tu pour ta séance ?';
      }

      if (!profil.temps) {
        const minutes = parseInt(t);
        if (isNaN(minutes)) return 'Donne-moi un nombre de minutes, par exemple 45.';
        profil.temps = minutes;
        return recommander();
      }

      return 'Je peux te recommander une séance. Tape "recommencer" pour un nouveau profil.';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const texte = input.value.trim();
      if (!texte) return;
      ajouterMessage(texte, 'user');
      input.value = '';
      setTimeout(function () {
        ajouterMessage(repondre(texte), 'bot');
      }, 400);
    });

    ajouterMessage('Bonjour ! Je suis le coach du club. Quel est ton niveau : débutant, intermédiaire ou confirmé ?', 'bot');
  </script>
</body>
</html>
```

- Trois lignes d'observation (ce que j'ai vu en utilisant la page) :
- Difficulté qui reste :

### J1-03 · 💥 Ça marche… jusqu'à quand — [fiche](checkpoints/J1-03-jusqua-quand.md)

- [ ] Validé
- Liste de contrôle de la version 1 (cinq à huit comportements essayés) :
- Journal des régressions, une entrée par modification : ce que j'ai demandé · ce qui marche maintenant · ce qui marchait et ne marche plus · ce que je n'avais pas vu, et comment je l'ai trouvé.
  - Modification 1 (`chatbot-v2.html`) :
    - Ce que j'ai demandé : « Ajoute un bouton Effacer qui vide la conversation. »
    - Ce qui marche maintenant :
    - Ce qui marchait et ne marche plus :
    - Ce que je n'avais pas vu, et comment je l'ai trouvé :
  - Modification 2 (`chatbot-v3.html`) :
    - Ce que j'ai demandé : « Garde les messages quand je recharge la page. »
    - Ce qui marche maintenant :
    - Ce qui marchait et ne marche plus :
    - Ce que je n'avais pas vu, et comment je l'ai trouvé :
  - Modification 3 (`chatbot-v4.html`) :
    - Ce que j'ai demandé : « Affiche un message d'erreur quand j'envoie un message vide. »
    - Ce qui marche maintenant :
    - Ce qui marchait et ne marche plus :
    - Ce que je n'avais pas vu, et comment je l'ai trouvé :
- Chasse à l'angle mort (ce qui a été trouvé, et par qui) :
- Deux phrases de conclusion :
- Difficulté qui reste :

### J1-04 · 🎲 Même prompt, autre réponse — [fiche](checkpoints/J1-04-meme-prompt.md)

- [ ] Validé
- Le prompt de référence (identique aux trois essais) :

  > Fais-moi un chatbot pour un club sportif amateur qui recommande des séances selon chaque personne, dans une seule page HTML que j'ouvre dans mon navigateur.

- Le tableau des écarts (trois colonnes A, B, C ; au moins quatre critères ; des faits, pas des impressions) :

  | Critère | A | B | C |
  |---|---|---|---|
  | Structure du code (fichiers, longueur, place du script) | 1 fichier, 971 lignes, un seul script en bas de page (ligne 323) | 1 fichier, 844 lignes, un seul script en bas de page (ligne 235) | 1 fichier, 1116 lignes, un seul script en bas de page (ligne 344) |
  | Comportement à l'envoi (que répond le bot, sur quel thème) | | | |
  | Ce qui manque (message vide, mémoire, bouton effacer…) | | | |
  | Ce qui diffère (noms, textes, réponses, ton) | Titre « Coach du club » ; `innerHTML` utilisé 0 fois | Titre « Conseiller de séances » ; `innerHTML` utilisé 10 fois | Titre « Assistant séances du club » ; `innerHTML` utilisé 3 fois |

  Pour comparaison, `chatbot-v1.html` (J1-02, même prompt) fait 184 lignes.

- Une phrase de conclusion (ce que ces écarts autorisent, ce qu'ils interdisent de supposer) :
- Difficulté qui reste :

## L'agent (N1 Demander)

### J1-05 · 🛠 dsh en main — [fiche](checkpoints/J1-05-dsh-en-main.md)

- [ ] Validé
- Preuve (`dsh --version`, mode Read Only, modèle `capweb-ia`, `git status -- atelier` propre ; **jamais la clé**) :
- La consigne exacte envoyée à l'agent et sa réponse :
- Pour chaque fichier cité : existe ou non, description juste ou fausse, pourquoi ; et un fichier qu'il n'a pas cité :
- Difficulté qui reste :

### J1-06 · 🧱 Anatomie d'un prompt — [fiche](checkpoints/J1-06-anatomie-dun-prompt.md)

- [ ] Validé
- Preuve (deux prompts, deux résultats, grille remplie, commit du squelette) :
- Prompt vague et ce que montre la page (trois lignes, fichiers touchés) :
- Prompt structuré, en six parties, tel qu'envoyé :
- Les hypothèses de l'agent, et ma réponse :
- La grille (✔ ou ✘ et un mot, pour « vague » puis « structuré ») :
- Une phrase : entre les deux résultats, ce qui a le plus changé, c'est… parce que la partie… de mon prompt disait…
- Difficulté qui reste :

### J1-07 · 👣 Petits pas — [fiche](checkpoints/J1-07-petits-pas.md)

- [ ] Validé
- Preuve (découpage écrit avant la première demande, trois diffs relus, un refus écrit, un commit par étape acceptée, trois boutons de questions qui fonctionnent) :
- La tâche, mes trois questions et mon découpage en trois étapes (écrit avant la première demande d'écriture) :
- Ce que l'agent a proposé comme découpage, ce que j'ai gardé, pourquoi :
- Mon refus écrit : ce que l'agent avait fait, pourquoi je le refuse, ce que j'ai demandé à la place :
- Difficulté qui reste :

**Journal des décisions.** Une ligne par demande faite à l'agent, de J1-07 à J1-09 (les trois étapes de J1-07, puis la correction de J1-08, puis les six demandes de J1-09) : la demande copiée, le diff relu (fichiers, nombre de lignes, une chose que je n'avais pas demandée ?), le verdict et pourquoi.

| N° | Demande | Diff relu | Verdict et pourquoi |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
| 9 | | | |
| 10 | | | |

### J1-08 · 🔎 Revue de la page — [fiche](checkpoints/J1-08-revue-de-la-page.md)

- [ ] Validé
- Preuve (trois défauts, un corrigé avec son avant et son après, diff relu, revue adverse vérifiée) :
- Mes défauts, un par ligne :

  | Lentille (structure, clavier, écrans) | Où (élément ou fichier) | Comment je l'ai vu |
  |---|---|---|
  | | | |
  | | | |
  | | | |

- La revue adverse : trois affirmations de l'agent, la référence qu'il a donnée (fichier, ligne), mon verdict (vrai, faux, rejeté sans référence) et comment j'ai vérifié :
- Le défaut corrigé : l'avant (capture ou valeur), ma demande ciblée (copiée), le diff relu (fichiers, lignes, changement non demandé ?), l'après (même geste, même mesure) :
- Difficulté qui reste :

### J1-09 · 🧠 Un cerveau à règles, par prompts — [fiche](checkpoints/J1-09-cerveau-a-regles.md)

- [ ] Validé
- Preuve (comportements vérifiés : « Vous : … », message vide, `<b>gras</b>`, mes deux mots, ma limite ; `/js/brain.js` et `/js/view.js` affichés ; F5 ; « Effacer ») :
- Mes six demandes et leurs verdicts : dans le journal des décisions ci-dessus.
- Le rôle de chaque fichier, en une phrase chacun :
  - `app.js` :
  - `brain.js` :
  - `view.js` :
- Ce que j'ai vu quand j'ai mis `{pas du json` dans la mémoire :
- Difficulté qui reste :

### J1-10 · 🧪 Épreuve de l'explication — [fiche](checkpoints/J1-10-epreuve-explication.md)

- [ ] Validé
- Preuve (`npm test` vert avec cinq tests dont ma limite, commit de sauvegarde, remise faite) :
- Le test rouge : son nom, son message exact, et ce qu'il m'a appris :
- Épreuve de l'explication, éditeur fermé :
  - Ce que je n'ai pas su expliquer :
  - Ce que mon binôme n'a pas su expliquer :
- Difficulté qui reste :

## Quatre questions pour finir

1. Pourquoi `textContent` et pas `innerHTML` ?
2. Pourquoi trois fichiers plutôt qu'un seul ?
3. L'agent a écrit le code : comment savez-vous qu'il est juste, et qu'est-ce qui l'a vu échouer ?
4. Quelle astuce avez-vous le plus utilisée aujourd'hui, et laquelle avez-vous oubliée ?

## Aides utilisées

- Indices, aide-mémoire, voisins :
- Ce que j'ai demandé à une IA, et comment j'ai vérifié sa réponse :

## Notes personnelles (chacun)

Pour préparer l'explication de votre part du code. Chacun écrit avec ses mots.

- Nom :
- Ce que j'ai compris :
- Ce que je n'ai pas encore compris :

- Nom :
- Ce que j'ai compris :
- Ce que je n'ai pas encore compris :

Git sert à sauvegarder chaque étape acceptée : lisez les différences et nommez les fichiers à enregistrer, jamais `git add -A`. Attendez la consigne du formateur avant tout envoi vers un dépôt commun.

[README du jour](README.md) · [Aide-mémoire HTML/CSS](ressources/aide-memoire.md) · [Aide-mémoire JavaScript](ressources/aide-memoire-js.md) · [Notice dsh](ressources/dsh.md)

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

- Limite de caractères d'un message (le nombre N) : 320
- Premier mot reconnu, en plus de « salut », « aide » et « test » : prairie
- Second mot reconnu : mission

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
- Preuve (`dsh --version`, mode Read Only, modèle `capweb-ia`, `git status -- atelier` propre ; **jamais la clé**) : `dsh --version` → `0.1.5-rc.2`. Premier essai depuis `atelier` : `dsh --profile headless "Reponds uniquement OK"` → `OK`. Avant ça, une erreur `"refs" in .credentials.yaml must be a mapping` : un espace supprimé par erreur dans `.credentials.yaml`, corrigé à la main.
- La consigne exacte envoyée à l'agent et sa réponse :

  Consigne (envoyée depuis `atelier` avec `dsh --profile headless "…"`, modèle `capweb-ia`, réglage `defaultPreset: read-only`) :

  > Liste les fichiers de ce dossier et dis ce que fait chacun. Donne le chemin de chaque fichier. Si tu ne sais pas ce que fait un fichier, écris « je ne sais pas ». N'écris rien et ne modifie rien.

  Réponse de l'agent (le début des chemins, propre au poste, est raccourci) :

  > Voici les fichiers trouvés dans ce dossier `atelier` — 13 fichiers :
  >
  > **1. Chemin : `atelier/README.md`**
  > Documentation de l'atelier J1. Explique comment démarrer (`npm start` sur `http://127.0.0.1:3000`), comment vérifier (`npm test`, `npm run verify`), et renvoie aux checkpoints.
  >
  > **2. Chemin : `atelier/package.json`**
  > Manifeste npm du projet. Définit `type: module`, Node `>=24.20.0`, les scripts `start` (`node server/start.js`), `test`, `lint`, `test:browser`, `verify`, et les `devDependencies` (playwright, axe-core, eslint).
  >
  > **3. Chemin : `atelier/package-lock.json`**
  > Fichier de verrouillage npm. Fige les versions exactes et les URL/intégrités de toutes les dépendances installées (1044 lignes).
  >
  > **4. Chemin : `atelier/.gitignore`**
  > Liste des dossiers ignorés par Git : `node_modules/`, `dist/`, `preuves/`, `test-results/`, `playwright-report/`, `coverage/`.
  >
  > **5. Chemin : `atelier/eslint.config.js`**
  > Configuration ESLint (flat config). Définit des règles pédagogiques (`no-unused-vars`, `eqeqeq`, `no-var`, `prefer-const`) et les variables globales autorisées pour le navigateur (`public/js/`) et pour Node (serveur, tests, configs).
  >
  > **6. Chemin : `atelier/playwright.config.js`**
  > Configuration Playwright pour le test navigateur. Lance Chromium headless, `baseURL http://127.0.0.1:4173`, dossier de tests `./browser`, et démarre automatiquement le serveur avec `node server/start.js`.
  >
  > **7. Chemin : `atelier/server/app.js`**
  > Cœur du serveur HTTP Node (sans framework). Exporte `createApp()` : ne sert qu'une liste explicite (`/`, `/index.html`, `/styles.css`, `/js/app.js` + `/version.json`), n'accepte que GET/HEAD (405 sinon), renvoie 404 neutre pour tout le reste, avec bons types MIME.
  >
  > **8. Chemin : `atelier/server/start.js`**
  > Point d'entrée qui démarre le serveur. Calcule le dossier `public/`, lit le port `PORT` (défaut 3000, validé 1-65535) sur `127.0.0.1`, affiche `Cap Web prêt sur...`, et gère l'arrêt propre sur SIGINT/SIGTERM.
  >
  > **9. Chemin : `atelier/public/index.html`**
  > Page d'accueil HTML. Titre `Cap Web — départ`, lie `styles.css` et `js/app.js`, contient un `<main>` avec `<h1>Cap Web</h1>` et un `<p id="status" role="status">`.
  >
  > **10. Chemin : `atelier/public/styles.css`**
  > Feuille de style minimale de départ : police système, marge, couleur texte, fond blanc, et centrage du `main` à 48rem max.
  >
  > **11. Chemin : `atelier/public/js/app.js`**
  > Script navigateur de départ (1 ligne). Remplit `#status` avec le texte `Votre point de départ est prêt.`.
  >
  > **12. Chemin : `atelier/tests/server.test.js`**
  > 9 tests serveur avec `node:test`. Vérifient que `/`, `/styles.css`, `/js/app.js`, `HEAD /`, `/version.json` fonctionnent, que les URL inconnues font 404, que POST fait 405, et que les fichiers privés (`server/`, `.env`, `package.json`) et les tentatives `../` ou encodées ne fuient rien.
  >
  > **13. Chemin : `atelier/browser/depart.spec.js`**
  > Test navigateur Playwright. Ouvre `/`, vérifie que le titre `Cap Web` est visible, que l'élément `status` est présent, et qu'il n'y a aucune erreur JavaScript.

  Après la réponse : `git status --short -- atelier` n'affiche rien, aucun fichier modifié ni nouveau.

  La barrière tient : à la demande « Crée le fichier public/essai-dsh.txt contenant ok », l'agent répond que la politique est en lecture seule et que l'écriture est refusée (`requires approval, but no approval channel is available`). `git status --short -- atelier` reste vide et `public/` ne contient que `index.html`, `styles.css` et `js`.

- Pour chaque fichier cité : existe ou non, description juste ou fausse, pourquoi ; et un fichier qu'il n'a pas cité :

  | Fichier cité | Existe ? | Description | Pourquoi (vérifié dans le fichier) |
  |---|---|---|---|
  | `README.md` | existe | juste | parle bien de `npm start`, `npm test`, `npm run verify` |
  | `package.json` | existe | juste | `type: module`, Node `>=24.20.0`, les cinq scripts et les trois dépendances de développement |
  | `package-lock.json` | existe | juste | 1044 lignes, compté avec `wc -l` |
  | `.gitignore` | existe | juste | les six dossiers cités sont ceux du fichier |
  | `eslint.config.js` | existe | juste | les quatre règles citées sont aux lignes 6 à 10 |
  | `playwright.config.js` | existe | juste | port 4173, dossier `./browser`, commande `node server/start.js` |
  | `server/app.js` | existe | juste | liste de quatre adresses (lignes 7 à 10), `/version.json` ligne 50, 405 ligne 35, 404 pour le reste |
  | `server/start.js` | existe | juste | port 3000 par défaut, validé de 1 à 65535, `127.0.0.1`, SIGINT et SIGTERM |
  | `public/index.html` | existe | juste | `main`, `h1`, `p#status` avec `role="status"` |
  | `public/styles.css` | existe | juste | `max-width: 48rem` sur `main`, fond blanc |
  | `public/js/app.js` | existe | juste | une seule ligne, qui écrit « Votre point de départ est prêt. » |
  | `tests/server.test.js` | existe | juste | 9 tests comptés |
  | `browser/depart.spec.js` | existe | juste | vérifie le titre, le statut et l'absence d'erreur |

  Fichier non cité : aucun trouvé. `find` liste 13 fichiers dans `atelier` (hors `node_modules`) et l'agent a cité les 13. Il n'a écrit « je ne sais pas » pour aucun.

- Difficulté qui reste :

### J1-06 · 🧱 Anatomie d'un prompt — [fiche](checkpoints/J1-06-anatomie-dun-prompt.md)

- [ ] Validé
- Preuve (deux prompts, deux résultats, grille remplie, commit du squelette) : Les deux prompts ont été envoyés à `dsh` depuis `atelier` avec `dsh --profile headless`. Pour laisser l'agent écrire, le réglage `defaultPreset` de `settings.yaml` est passé de `read-only` à `workspace-write` (écriture limitée au dossier `atelier`).
- Prompt vague et ce que montre la page (trois lignes, fichiers touchés) :

  > Écris la page de Cap Web : un formulaire, une liste de messages et un statut.

  - Fichiers touchés : `public/index.html` (37 lignes), `public/js/app.js` (39 lignes), `public/styles.css` (15 lignes) ; 74 lignes ajoutées, 3 retirées. Aucun fichier nouveau.
  - La page contient un formulaire `form#form-message` avec un champ `#champ-message` limité à 280 caractères, un titre « Messages », une liste `ul#messages` et le `p#status`.
  - L'agent a ajouté ce que personne n'avait demandé : l'envoi ajoute déjà le message à la liste, le statut compte les messages, un message vide est refusé. Les identifiants et la limite sont ceux qu'il a choisis, pas les nôtres.
  - Dossier remis à zéro ensuite avec `git restore` sur les trois fichiers.

- Prompt structuré, en six parties, tel qu'envoyé :

```text
RÔLE : Tu es développeur web. Tu écris du HTML, du CSS et du JavaScript sans bibliothèque, pour des débutants.
TÂCHE : Écris le squelette de la page de « Cap Web », un assistant pour les adhérents d'un club sportif amateur, qui recommande des séances selon chaque personne : un formulaire, une liste de messages, une ligne de statut.
CONTRAINTES :
- Modifie uniquement public/index.html, public/styles.css et public/js/app.js. Le serveur ne sert que ces trois fichiers : n'en crée aucun autre.
- Garde ces identifiants : form#chat-form, textarea#message, ul#messages, p#status.
- Le champ #message est limité à 320 caractères (maxlength).
- Le contenu de la page est dans un main. Un seul h1 (« Cap Web »), un label lié au champ, un bouton « Envoyer », p#status avec role="status", html lang="fr". Aucune bibliothèque, aucune adresse https://.
FORMAT DE SORTIE : d'abord la liste de tes hypothèses (cinq au plus), puis tu t'arrêtes. Après mon « ok », tu écris les trois fichiers, puis tu réponds par la liste des fichiers écrits.
EXEMPLES ET CONTRE-EXEMPLES : voulu : <button type="submit">Envoyer</button>. Refusé : <div onclick="envoyer()">Envoyer</div> (ce n'est pas un bouton) ; un fichier script.js à côté de app.js (le serveur répondrait 404).
CRITÈRE D'ARRÊT : app.js empêche seulement le rechargement de la page à l'envoi et écrit alors « Interface prête. » dans le statut ; il n'ajoute aucun message à la liste. Quand les trois fichiers sont écrits, tu t'arrêtes.
```

- Les hypothèses de l'agent, et ma réponse :

  > Hypothèses :
  > 1. Le serveur sert `public/` comme racine statique et `public/index.html` comme page d'accueil.
  > 2. Les trois fichiers existent déjà ou peuvent être écrasés sans perdre de contenu à préserver.
  > 3. Aucun style ou comportement n'est attendu au-delà du squelette décrit (formulaire, liste, statut).
  > 4. Le statut initial de `p#status` peut être vide avant l'envoi du formulaire.

  Après cette liste, `git status -- atelier` ne montrait aucun changement : l'agent n'a rien écrit avant le « ok ».

  Ma réponse :

  > ok. Une correction sur l'hypothèse 1 : le serveur ne sert pas tout le dossier public/, seulement une liste de quatre adresses (/, /index.html, /styles.css, /js/app.js). Un autre fichier donnerait un 404. Les hypothèses 2, 3 et 4 sont justes. Écris maintenant les trois fichiers.

  Le mode `headless` ne garde pas la conversation : la réponse a été envoyée dans une seconde commande qui reprenait le prompt et la liste d'hypothèses. L'agent a alors écrit les trois fichiers et répondu par leur liste.

- La grille (✔ ou ✘ et un mot, pour « vague » puis « structuré ») :

  | Critère | Prompt vague | Prompt structuré |
  |---|---|---|
  | La page s'affiche sans erreur (F12, onglet Console) | non vérifié dans le navigateur ; `node --check` ne trouve pas d'erreur de syntaxe | ✔ aucune erreur, vérifié dans un navigateur de test (Chromium) ; après « Envoyer », le statut affiche « Interface prête. » et la liste reste vide |
  | Formulaire, liste et statut sont là, avec les quatre identifiants | ✘ deux sur quatre : `form-message` et `champ-message` au lieu de `chat-form` et `message` | ✔ `chat-form`, `message`, `messages`, `status` |
  | Seuls les trois fichiers autorisés ont changé (`git status -- atelier`) | ✔ trois fichiers modifiés, aucun nouveau | ✔ trois fichiers modifiés, aucun nouveau |
  | `npm test` reste vert | ✔ 9 sur 9 | ✔ 9 sur 9 |
  | Aucune bibliothèque, aucune adresse `https://` | ✔ aucune | ✔ aucune |
  | Vous savez expliquer chaque partie de la page en une phrase | | |

  Changement non demandé dans le résultat structuré : la balise `<script type="module">` est devenue `<script>` sans `type`, et le titre de l'onglet « Cap Web — départ » est devenu « Cap Web ».

- Une phrase : entre les deux résultats, ce qui a le plus changé, c'est… parce que la partie… de mon prompt disait… Entre les deux résultats, ce qui a le plus changé, c'est la taille et le périmètre du code (`app.js` passe de 39 lignes à 7, sans ajout de messages ni compteur) et les identifiants, parce que la partie CONTRAINTES de mon prompt donnait les quatre identifiants et la limite de 320, et que la partie CRITÈRE D'ARRÊT disait que `app.js` ne fait qu'empêcher le rechargement et écrire « Interface prête. ».
- Difficulté qui reste :

### J1-07 · 👣 Petits pas — [fiche](checkpoints/J1-07-petits-pas.md)

- [ ] Validé
- Preuve (découpage écrit avant la première demande, trois diffs relus, un refus écrit, un commit par étape acceptée, trois boutons de questions qui fonctionnent) :
- La tâche, mes trois questions et mon découpage en trois étapes (écrit avant la première demande d'écriture) :

  - Tâche : afficher sous le formulaire nos trois questions en boutons ; un clic copie la question dans le champ, sans l'envoyer.
  - Questions : « Quelle séance me conseilles-tu pour mon niveau ? », « Quelles séances sont prévues cette semaine ? », « Comment m'échauffer avant une séance ? ».
  - Étape 1 : dans `index.html` seulement, une liste `ul#suggestions` de trois boutons `type="button"`, écrits dans le HTML.
  - Étape 2 : dans `app.js` seulement, un clic copie le texte du bouton dans le champ.
  - Étape 3 : après le clic, le curseur est dans le champ et le statut dit « Question copiée : modifiez-la ou envoyez-la. »

- Ce que l'agent a proposé comme découpage, ce que j'ai gardé, pourquoi : L'agent a listé 11 hypothèses sans rien écrire (`git status -- atelier` vide) et a proposé de fusionner les étapes 2 et 3, « car ce sont 3-4 lignes dans le même écouteur ». Découpage en trois gardé : chaque étape se teste seule en trente secondes, et l'étape 2 sans statut permet de vérifier que rien n'est envoyé.
- Mon refus écrit : ce que l'agent avait fait, pourquoi je le refuse, ce que j'ai demandé à la place :
  - Ce que l'agent avait fait (étape 2) : en plus de la copie, trois protections non demandées dans `app.js` : `suggestions?.addEventListener`, `!suggestions.contains(button)` et `if (messageInput)`.
  - Pourquoi refusé : `ul#suggestions` et `#message` sont écrits dans `index.html`. Avec ces protections, un identifiant faux donnerait un clic qui ne fait rien, sans erreur dans la console. Et ce sont trois morceaux de code de plus à savoir expliquer.
  - Demandé à la place : « Je refuse une partie de ton changement de l'étape 2 dans public/js/app.js. Tu as ajouté trois protections que je n'ai pas demandées : « suggestions?. », « !suggestions.contains(button) » et « if (messageInput) ». Les éléments ul#suggestions et #message sont écrits dans index.html : si un identifiant est faux, je veux une erreur visible dans la console, pas un clic qui ne fait rien en silence. Retire seulement ces trois protections. Garde le reste tel quel : un seul écouteur de clic sur ul#suggestions, qui copie le texte du bouton cliqué dans #message. Aucun autre fichier, aucun autre changement. »
  - Résultat : nouveau diff relu, les trois protections ont disparu, le reste est identique, le clic copie toujours la question.

- Difficulté qui reste :

**Journal des décisions.** Une ligne par demande faite à l'agent, de J1-07 à J1-09 (les trois étapes de J1-07, puis la correction de J1-08, puis les six demandes de J1-09) : la demande copiée, le diff relu (fichiers, nombre de lignes, une chose que je n'avais pas demandée ?), le verdict et pourquoi.

| N° | Demande | Diff relu | Verdict et pourquoi |
|---|---|---|---|
| 1 | « Étape 1 seulement : dans public/index.html, sous le formulaire, ajoute une liste ul#suggestions de trois boutons type="button", un par question : « Quelle séance me conseilles-tu pour mon niveau ? », « Quelles séances sont prévues cette semaine ? », « Comment m'échauffer avant une séance ? ». Aucun JavaScript, aucun autre fichier, aucun autre changement. » | `index.html` seul, 5 lignes ajoutées : `ul#suggestions` avec trois `li > button type="button"`. Rien de non demandé. | Accepté. Les trois boutons s'affichent avec le bon texte ; un clic ne fait rien (champ vide, statut vide). Commit « J1 : étape 1, boutons de questions ». |
| 2 | « Étape 2 seulement : dans public/js/app.js, un clic sur un bouton de ul#suggestions copie le texte de ce bouton dans le champ #message. Rien n'est envoyé. Aucun autre fichier, aucun autre changement. » | `app.js` seul, 8 lignes ajoutées. Non demandé : trois protections (`?.`, `contains`, `if (messageInput)`). | Refusé en partie (voir « Mon refus écrit »), puis accepté après correction : 7 lignes ajoutées. Le clic copie la question, le statut ne change pas, rien n'est envoyé. Commit « J1 : étape 2, un clic copie la question dans le champ ». |
| 3 | « Étape 3 seulement : dans public/js/app.js, après le clic sur un bouton de ul#suggestions, mets le curseur dans le champ #message et écris dans p#status « Question copiée : modifiez-la ou envoyez-la. ». Aucun autre fichier, aucun autre changement, aucune protection en plus. » | `app.js` seul, 2 lignes ajoutées : `messageInput.focus()` et le texte du statut. Rien de non demandé. | Accepté. Après le clic, le curseur est dans `#message` et le statut dit « Question copiée : modifiez-la ou envoyez-la. ». `npm test` 9 sur 9. Commit « J1 : étape 3, curseur dans le champ et statut ». |
| 4 | Demande ciblée de J1-08 en six parties : corriger le dépassement de 183 px à 360 px, dans `styles.css` seulement | `styles.css` seul, 4 lignes ajoutées (`overflow-wrap: break-word` sur `#messages li`). Rien de non demandé. | Accepté. Dépassement mesuré : 183 px avant, 0 px après. |
| 5 | L'envoi, dans `app.js` : ligne « Vous : … », refus du message vide avec statut et focus, champ et statut vidés après envoi ; contre-exemple `<b>gras</b>` | `app.js` seul, 12 lignes ajoutées, 1 retirée. `createElement('li')` et `textContent`. Rien de non demandé. | Accepté. « salut » donne « Vous : salut » ; trois espaces donnent le statut d'erreur, aucune ligne, focus dans le champ ; `<b>gras</b>` s'affiche avec ses chevrons (0 balise `b` dans la page). |
| 6 | Le cerveau : nouveau `brain.js` (`validateMessage`, `replyTo`), et `js/brain.js` ajouté à `FICHIERS` et `TYPES` dans `server/app.js` ; contre-exemple « tester » | `brain.js` nouveau (24 lignes, lu en entier) ; `server/app.js` : 2 lignes ajoutées, 2 virgules. Aucun `document`, `window` ni `localStorage`. Une faute dans un message : « avant de envoyer ». | Accepté, faute à corriger à la demande suivante. ` SALUT ` et « Bonjour » ont la même réponse, « tester » reçoit le repli, `/js/brain.js` répond 200, `npm test` 9 sur 9. |
| 7 | Brancher, dans `app.js` : import de `validateMessage` et `replyTo`, ligne « Cap Web : … » ; `type="module"` remis dans `index.html` ; faute corrigée dans `brain.js` | Trois fichiers : `index.html` 1 ligne, `app.js` 8 lignes ajoutées et 5 retirées, `brain.js` 1 ligne. Dans `brain.js`, la correction a cassé le fichier : `'… avant d'envoyer.'`, l'apostrophe ferme la chaîne. | Refusé pour `brain.js` : `node --check` répond `SyntaxError: Unexpected identifier 'envoyer'`, la page ne chargerait plus aucun module. Demandé à la place : corriger cette seule ligne et vérifier avec `node --check`. Nouveau diff relu (guillemets doubles), puis accepté : « salut », « BONJOUR », « aide », « test », une phrase inconnue, trois espaces et `<b>gras</b>` donnent le résultat attendu. |
| 8 | Notre cahier, dans `brain.js` : mots « prairie » et « mission », limite de 320 avec une seule constante ; contre-exemples « prairies » et « ma mission » | `brain.js` seul, 11 lignes ajoutées : constante `LIMITE_MESSAGE = 320`, un test de longueur, deux `if`. Le nombre 320 n'apparaît qu'une fois. | Accepté. ` PRAIRIE ` et « Mission » ont chacun leur réponse ; « prairies » et « ma mission » reçoivent le repli ; 320 caractères passent, 321 sont refusés avec « Message trop long : 320 caractères maximum. ». |
| 9 | Ranger : plan demandé d'abord (cinq lignes, rien d'écrit), puis `view.js` nouveau (`renderMessages`), `app.js` avec un tableau `historique`, `js/view.js` ajouté au serveur | Plan accepté tel quel. `view.js` nouveau (12 lignes, lu en entier) ; `app.js` 5 lignes ajoutées, 6 retirées ; `server/app.js` 2 lignes ajoutées. Plus de `createElement` dans `app.js`. | Accepté. Même comportement dans la page, `/js/view.js` répond 200, aucun `innerHTML`, `npm test` 9 sur 9. |
| 10 | La mémoire, dans `app.js` et `index.html` : `capweb.historique` en JSON, relu dans un `try/catch`, bouton `#effacer` avec `confirm` ; contre-exemple `{pas du json` | `index.html` 1 ligne (le bouton) ; `app.js` 29 lignes ajoutées : constante `CLE_MEMOIRE`, lecture dans `try/catch` avec `Array.isArray`, `setItem` à l'envoi, écouteur du bouton. Rien de non demandé. | Accepté. F5 garde les 2 lignes ; « Effacer » annulé garde tout, accepté vide tout, y compris après F5 ; `{pas du json` et `{"a":1}` donnent une conversation vide et le statut « Historique illisible : la conversation repart vide. ». |

### J1-08 · 🔎 Revue de la page — [fiche](checkpoints/J1-08-revue-de-la-page.md)

- [ ] Validé
- Preuve (trois défauts, un corrigé avec son avant et son après, diff relu, revue adverse vérifiée) :
- Mes défauts, un par ligne :

  | Lentille (structure, clavier, écrans) | Où (élément ou fichier) | Comment je l'ai vu |
  |---|---|---|
  | Structure | `ul#messages`, `index.html` ligne 13 : la liste des messages n'a pas de nom (ni `aria-label`, ni titre) | Lecture du HTML ; `getAttribute('aria-label')` renvoie `null` |
  | Structure | `index.html` lignes 10 à 25 : un seul titre (`h1`), aucun `h2`, et pas de repère `header`, `section` ni `footer` (seul `main` existe) | Compté dans la page : `h1` = 1, `h2` = 0, `header` = 0, `section` = 0, `footer` = 0 |
  | Écrans | `ul#messages` dans `styles.css` : à 360 px, un message avec un mot de 60 lettres fait dépasser la page de 183 px (223 px à 320 px) | `<li>` ajouté à la main dans la liste, puis `scrollWidth - clientWidth` mesuré dans un navigateur de test |
  | Écrans | Bouton « Envoyer » : 21 px de haut à toutes les largeurs, et 768 px de large à 1280 px | Taille mesurée avec `getBoundingClientRect()` à 360, 768 et 1280 px |

  Lentille clavier : aucun défaut trouvé. Tab passe par le champ, « Envoyer », puis les trois questions ; le focus se voit sur chacun (contour par défaut du navigateur) ; Entrée dans le champ ajoute une ligne sans envoyer ; Entrée sur « Envoyer » affiche « Interface prête. » sans changer l'adresse ; Espace sur une question la copie sans l'envoyer. Le clic sur l'étiquette met bien le curseur dans le champ.

  Ces mesures ont été faites dans un navigateur de test piloté par script (Chromium), pas à la main avec F12.

- La revue adverse : trois affirmations de l'agent, la référence qu'il a donnée (fichier, ligne), mon verdict (vrai, faux, rejeté sans référence) et comment j'ai vérifié :

  Demande : « Tu relis public/index.html et public/styles.css sans rien modifier. Trouve trois façons dont la page casse (structure, clavier, écrans de 360 à 1280 px). Pour chacune : fichier et ligne, comment le voir, ce qu'on verra. Si tu n'es pas sûr, écris "je ne sais pas". » Après la réponse, `git status` ne montrait aucun changement.

  | Affirmation de l'agent | Référence donnée | Verdict | Comment vérifié |
  |---|---|---|---|
  | Structure : un seul titre, aucun `h2`, les deux listes et le statut ne sont pas nommés | `index.html` lignes 10 à 24 | Vrai | Titres comptés dans la page : un `h1`, zéro `h2` ; `aria-label` absent sur les deux listes |
  | Clavier : « focus invisible », aucune règle `:focus` dans le CSS | `styles.css` lignes 1 à 21, `index.html` lignes 16-17 et 20-22 | Faux | Il n'y a bien aucune règle `:focus`, mais le contour par défaut du navigateur s'affiche sur le champ et les quatre boutons (`outline-style: auto` mesuré sur chacun) |
  | Écrans : à 360 px les boutons de questions « débordent » ; à 1280 px le bouton « Envoyer » fait 768 px de large | `styles.css` lignes 1-6, 8-11, 18-21 | Faux pour 360 px, vrai pour 1280 px | À 360 px, dépassement mesuré = 0 : les boutons passent sur deux lignes (256 × 36 px). À 1280 px, « Envoyer » mesure bien 768 px de large |

- Le défaut corrigé : l'avant (capture ou valeur), ma demande ciblée (copiée), le diff relu (fichiers, lignes, changement non demandé ?), l'après (même geste, même mesure) :
  - Avant : à 360 px, avec un `<li>` contenant un mot de 60 lettres, `scrollWidth - clientWidth` = 183.
  - Demande ciblée :

```text
RÔLE : Tu es développeur web, tu corriges du CSS sans bibliothèque.
TÂCHE : À 360 px de large, un message contenant un mot de 60 lettres dans ul#messages fait dépasser la page de 183 px sur le côté. Corrige ce seul défaut.
CONTRAINTES : ne modifie que public/styles.css. Pas d'overflow: hidden sur html ou body. Ne touche à aucune autre règle.
FORMAT DE SORTIE : le diff, puis une phrase sur la façon de vérifier.
CONTRE-EXEMPLE : le défaut lui-même : <li>Vous : aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</li> dans ul#messages, à 360 px, donne document.documentElement.scrollWidth - document.documentElement.clientWidth = 183 au lieu de 0.
CRITÈRE D'ARRÊT : quand ce seul défaut est corrigé, tu t'arrêtes.
```

  - Diff relu : un seul fichier, `styles.css`, 4 lignes ajoutées (une règle `#messages li { overflow-wrap: break-word; }`). Aucun changement non demandé, pas d'`overflow: hidden`.
  - Après, même geste : 0 à 360 px (et 0 à 320, 768 et 1280 px). Commit « J1 : correction, mot très long qui dépasse à 360 px ».
- Difficulté qui reste :

### J1-09 · 🧠 Un cerveau à règles, par prompts — [fiche](checkpoints/J1-09-cerveau-a-regles.md)

- [ ] Validé
- Preuve (comportements vérifiés : « Vous : … », message vide, `<b>gras</b>`, mes deux mots, ma limite ; `/js/brain.js` et `/js/view.js` affichés ; F5 ; « Effacer ») : tout est vérifié, détail dans les lignes 5 à 10 du journal. `/js/app.js`, `/js/brain.js` et `/js/view.js` répondent 200. Dans la page, `validateMessage('a'.repeat(320)).ok` vaut `true` et avec 321 `false`. Aucune erreur dans la console, aucun défilement horizontal à 360, 768 et 1280 px. Vérifications faites dans un navigateur de test piloté par script (Chromium), pas à la main. Un commit par demande acceptée.
- Mes six demandes et leurs verdicts : dans le journal des décisions ci-dessus.
- Le rôle de chaque fichier, en une phrase chacun :
  - `app.js` : il relie la page au reste : il écoute le formulaire et les boutons, tient le tableau `historique`, l'enregistre dans la mémoire et demande l'affichage.
  - `brain.js` : les règles, sans toucher à la page : `validateMessage` dit si un message est acceptable (non vide, 320 caractères au plus) et `replyTo` choisit la réponse selon le mot.
  - `view.js` : l'affichage : `renderMessages` vide la liste et y remet un `li` par message, en `textContent`.
- Ce que j'ai vu quand j'ai mis `{pas du json` dans la mémoire : après rechargement, la liste est vide, le statut affiche « Historique illisible : la conversation repart vide. », la page ne plante pas et un nouvel envoi fonctionne (2 lignes).
- Difficulté qui reste :

### J1-10 · 🧪 Épreuve de l'explication — [fiche](checkpoints/J1-10-epreuve-explication.md)

- [ ] Validé
- Preuve (`npm test` vert avec cinq tests dont ma limite, commit de sauvegarde, remise faite) : `npm test` → 14 tests, 14 réussis (9 du serveur, 5 de `tests/brain.test.js`, dont la limite de 320). `npm run lint` sans erreur. Les cinq tests ont été écrits par `dsh` dans une session neuve, à partir d'une demande qui interdisait de recopier le texte des réponses. Commit « J1 : Cap Web répond », poussé sur le dépôt du binôme.
- Le test rouge : son nom, son message exact, et ce qu'il m'a appris : dans `brain.js`, `LIMITE_MESSAGE` passé de 320 à 330. Test devenu rouge : « la limite accepte N caractères et refuse N + 1 », message exact `AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: true !== false`, à `tests/brain.test.js:18` (13 réussis, 1 échoué). Avec 330, un message de 321 caractères passe alors que le test attend un refus. Après `git restore atelier/public/js/brain.js` : 14 sur 14. Ce test vérifie donc bien la limite du cahier.
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

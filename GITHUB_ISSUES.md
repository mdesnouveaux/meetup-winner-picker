# Issues GitHub à Créer

Copiez-collez ces issues dans GitHub pour organiser le projet.

---

## 🎯 Issue #1 : [Phase 1] Setup Initial du Projet MVP CLI

**Labels** : `enhancement`, `phase-1`, `priority-high`

### Description
Initialiser le projet Node.js avec TypeScript et configurer l'environnement de développement pour le MVP CLI.

### Tâches
- [ ] Initialiser projet Node.js avec `npm init`
- [ ] Installer TypeScript et configurer `tsconfig.json`
- [ ] Installer et configurer ESLint + Prettier
- [ ] Setup Jest pour les tests
- [ ] Créer `.gitignore` complet (node_modules, dist, .env, etc.)
- [ ] Créer structure de dossiers (`src/`, `tests/`, `examples/`)
- [ ] Créer fichier `.env.example` pour documentation
- [ ] Mettre à jour README.md avec instructions de setup

### Critères d'Acceptation
- [ ] `npm install` fonctionne sans erreur
- [ ] `npm run build` compile le TypeScript
- [ ] `npm test` exécute les tests
- [ ] Linting et formatting configurés

### Fichiers à Créer
```
package.json
tsconfig.json
.eslintrc.json
.prettierrc
jest.config.js
.gitignore
.env.example
src/index.ts
```

---

## 📋 Issue #2 : [Phase 1] Implémentation du Parser CSV

**Labels** : `enhancement`, `phase-1`, `priority-high`

### Description
Créer une fonction pour parser les fichiers CSV contenant la liste des participants.

### Tâches
- [ ] Installer library CSV (ex: `csv-parse` ou `papaparse`)
- [ ] Créer fonction `parseParticipants(filePath: string)`
- [ ] Validation format CSV (colonnes requises)
- [ ] Détection et gestion des doublons
- [ ] Support différents encodages (UTF-8, Latin1)
- [ ] Gestion erreurs (fichier inexistant, format invalide)
- [ ] Tests unitaires avec fixtures CSV

### Format CSV Attendu
```csv
nom,email
Jean Dupont,jean@example.com
Marie Martin,marie@example.com
```

### Critères d'Acceptation
- [ ] Parse correctement un CSV valide
- [ ] Détecte les doublons (option de les garder ou supprimer)
- [ ] Rejette les CSV mal formatés avec message clair
- [ ] Tests couvrent edge cases (fichier vide, 1 participant, caractères spéciaux)

### Fichiers
- `src/parser/csv-parser.ts`
- `src/types/participant.ts`
- `tests/parser/csv-parser.test.ts`
- `examples/participants-example.csv`

---

## 🎲 Issue #3 : [Phase 1] Algorithme de Sélection Aléatoire Cryptographiquement Sécurisé

**Labels** : `enhancement`, `phase-1`, `priority-high`, `security`

### Description
Implémenter l'algorithme de sélection aléatoire équitable et auditable avec `crypto.randomInt()`.

### Tâches
- [ ] Créer fonction `selectWinners(participants, count, options)`
- [ ] Utiliser `crypto.randomInt()` (pas `Math.random()`)
- [ ] Support sélection multiple sans doublons (Fisher-Yates shuffle)
- [ ] Option `seed` pour reproductibilité (avec `seedrandom`)
- [ ] Option `exclude` pour exclure des participants
- [ ] Générer hash de vérification (timestamp + seed + participants)
- [ ] Logger le processus (pour audit)
- [ ] Tests de fairness (distribution statistique)
- [ ] Tests edge cases (0 participant, 1 participant, plus de winners que participants)

### Interface Fonction
```typescript
interface PickOptions {
  count?: number;        // Nombre de gagnants (défaut: 1)
  seed?: string;         // Seed pour reproductibilité
  exclude?: string[];    // Noms à exclure
}

interface PickResult {
  winners: Participant[];
  timestamp: Date;
  seed?: string;
  totalParticipants: number;
  hash: string;          // Pour vérification
}

function selectWinners(
  participants: Participant[],
  options: PickOptions
): PickResult
```

### Critères d'Acceptation
- [ ] Distribution équitable (test statistique sur 10000 tirages)
- [ ] Pas de duplicata dans les gagnants
- [ ] Même seed = même résultat
- [ ] Fonctionne avec 1 à 10000 participants
- [ ] Gestion erreurs (liste vide, count négatif)

### Documentation
- [ ] Documenter l'algorithme utilisé (Fisher-Yates)
- [ ] Expliquer pourquoi crypto.randomInt() vs Math.random()
- [ ] Guide de vérification du hash

### Fichiers
- `src/picker/random-selector.ts`
- `src/picker/hash-generator.ts`
- `tests/picker/random-selector.test.ts`
- `tests/picker/fairness.test.ts`

---

## 💻 Issue #4 : [Phase 1] Interface CLI avec Commander.js

**Labels** : `enhancement`, `phase-1`, `priority-high`

### Description
Créer l'interface en ligne de commande avec toutes les options nécessaires.

### Tâches
- [ ] Installer `commander` et `chalk` (pour couleurs)
- [ ] Commande `pick <file.csv>`
- [ ] Option `-n, --number <count>` (nombre de gagnants)
- [ ] Option `-s, --seed <value>` (seed reproductible)
- [ ] Option `--exclude <names>` (exclusions, séparées par virgule)
- [ ] Option `-o, --output <file>` (export JSON ou texte)
- [ ] Option `--format <json|text>` (format de sortie)
- [ ] Option `-v, --verbose` (mode verbeux)
- [ ] Affichage formaté et coloré avec chalk
- [ ] Barre de progression (optionnel, avec `ora`)
- [ ] Gestion erreurs avec messages clairs

### Exemple d'Utilisation
```bash
# Simple
meetup-picker pick participants.csv

# Multiple winners
meetup-picker pick participants.csv -n 3

# Avec seed pour reproductibilité
meetup-picker pick participants.csv -s "meetup-2025-01-15"

# Exclure des personnes
meetup-picker pick participants.csv --exclude "Jean Dupont,Marie Martin"

# Export résultats
meetup-picker pick participants.csv -n 3 -o results.json --format json
```

### Affichage Attendu
```
🎲 Meetup Winner Picker v1.0.0

📋 Chargement des participants...
   ✓ 42 participants chargés

🎯 Configuration du tirage :
   • Nombre de gagnants : 1
   • Participants éligibles : 42
   • Seed : [random]

🎊 Et le gagnant est...

   🏆 Jean Dupont

📊 Détails :
   • Hash de vérification : a3f5d8e9...
   • Timestamp : 2025-11-14 15:30:45
```

### Critères d'Acceptation
- [ ] Toutes les options fonctionnent
- [ ] Messages d'erreur clairs et en français
- [ ] Affichage formaté et lisible
- [ ] Aide (`--help`) complète
- [ ] Code retour approprié (0 = succès, 1 = erreur)

### Fichiers
- `src/cli/index.ts`
- `src/cli/formatter.ts`
- `src/cli/output.ts`

---

## 📚 Issue #5 : [Phase 1] Documentation et Exemples MVP CLI

**Labels** : `documentation`, `phase-1`, `priority-medium`

### Description
Documenter l'utilisation du CLI et fournir des exemples.

### Tâches
- [ ] Mettre à jour README.md avec guide complet
- [ ] Créer exemples de CSV (`examples/`)
- [ ] Documenter l'algorithme de sélection
- [ ] Guide de vérification du tirage
- [ ] Troubleshooting courant
- [ ] Ajouter badges (build status, version, license)
- [ ] Ajouter CHANGELOG.md

### Contenu README
- [ ] Installation
- [ ] Quick start
- [ ] Options disponibles
- [ ] Exemples d'utilisation
- [ ] Format CSV attendu
- [ ] Vérification des résultats
- [ ] FAQ
- [ ] Contribution
- [ ] License

### Fichiers
- `README.md` (mise à jour)
- `CHANGELOG.md`
- `examples/participants-small.csv`
- `examples/participants-large.csv`
- `docs/ALGORITHM.md`
- `docs/VERIFICATION.md`

---

## 🔧 Issue #6 : [Phase 2] Setup Backend API Express

**Labels** : `enhancement`, `phase-2`, `priority-medium`

### Description
Initialiser le backend API REST avec Express et TypeScript.

### Tâches
- [ ] Créer dossier `backend/` ou `api/`
- [ ] Setup Express + TypeScript
- [ ] Structure projet (routes, controllers, services, middleware)
- [ ] Middleware CORS
- [ ] Middleware rate limiting (express-rate-limit)
- [ ] Logger (Winston ou Pino)
- [ ] Validation avec Zod
- [ ] Gestion erreurs centralisée
- [ ] Configuration environnement (.env)
- [ ] Health check endpoint (`GET /health`)

### Structure
```
backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   └── index.ts
├── tests/
├── package.json
└── tsconfig.json
```

### Critères d'Acceptation
- [ ] Serveur démarre sur port configuré
- [ ] Health check répond
- [ ] CORS configuré
- [ ] Rate limiting actif
- [ ] Logs structurés

---

## 🌐 Issue #7 : [Phase 2] Endpoints REST API

**Labels** : `enhancement`, `phase-2`, `priority-medium`

### Description
Implémenter les endpoints REST pour l'application web.

### Tâches
- [ ] `POST /api/upload` - Upload CSV participants
- [ ] `POST /api/pick` - Lancer tirage
- [ ] `GET /api/picks/:id` - Récupérer résultat
- [ ] `GET /api/picks/:id/verify` - Vérifier intégrité
- [ ] Validation Zod pour tous les inputs
- [ ] Tests d'intégration

### API Spec
```typescript
// POST /api/upload
Request: multipart/form-data { file: CSV }
Response: { sessionId: string, participants: Participant[] }

// POST /api/pick
Request: { sessionId: string, count: number, exclude?: string[] }
Response: PickResult

// GET /api/picks/:id
Response: PickResult

// GET /api/picks/:id/verify
Response: { valid: boolean, hash: string }
```

### Critères d'Acceptation
- [ ] Tous les endpoints fonctionnent
- [ ] Validation des inputs
- [ ] Tests E2E
- [ ] Documentation OpenAPI/Swagger (optionnel)

---

## 💾 Issue #8 : [Phase 2] Stockage Session Temporaire

**Labels** : `enhancement`, `phase-2`, `priority-medium`

### Description
Implémenter le stockage temporaire des sessions (participants et résultats).

### Tâches
- [ ] Choisir solution : Redis ou in-memory (node-cache)
- [ ] Générer session ID unique
- [ ] Stocker participants uploadés (TTL: 1h)
- [ ] Stocker résultats tirages (TTL: 24h)
- [ ] Cleanup automatique des sessions expirées
- [ ] Pas de stockage permanent (RGPD)

### Critères d'Acceptation
- [ ] Sessions expirent automatiquement
- [ ] Aucune donnée perso en base permanente
- [ ] Gestion erreurs si session expirée

---

## ⚡ Issue #9 : [Phase 2 Alternative] Netlify Serverless Functions

**Labels** : `enhancement`, `phase-2`, `priority-medium`, `alternative`

### Description
Alternative au backend Express : implémenter avec Netlify Functions.

### Tâches
- [ ] Créer dossier `netlify/functions/`
- [ ] Function `upload.ts` (upload CSV)
- [ ] Function `pick.ts` (lancer tirage)
- [ ] Stockage session côté client (localStorage + sessionStorage)
- [ ] Tests des functions localement

### Avantages
- ✅ Pas de serveur à gérer
- ✅ Hébergement gratuit illimité
- ✅ Deploy automatique

### Structure
```
netlify/
└── functions/
    ├── upload.ts
    └── pick.ts
```

---

## ⚛️ Issue #10 : [Phase 3] Setup Frontend React + Vite

**Labels** : `enhancement`, `phase-3`, `priority-high`

### Description
Initialiser l'application React avec Vite et TypeScript.

### Tâches
- [ ] `npm create vite@latest frontend -- --template react-ts`
- [ ] Installer Tailwind CSS
- [ ] Setup React Router v6
- [ ] Installer TanStack Query (react-query)
- [ ] Installer react-dropzone (upload)
- [ ] Configuration path aliases (@/)
- [ ] Setup Vitest pour tests

### Structure
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
└── vite.config.ts
```

### Critères d'Acceptation
- [ ] `npm run dev` démarre le serveur
- [ ] Routing fonctionne
- [ ] Tailwind CSS appliqué

---

## 🎨 Issue #11 : [Phase 3] Design System AFUP

**Labels** : `enhancement`, `phase-3`, `design`, `priority-medium`

### Description
Créer le design system basé sur les couleurs de l'AFUP.

### Tâches
- [ ] Confirmer les couleurs AFUP exactes
- [ ] Configurer thème Tailwind avec couleurs AFUP
- [ ] Créer composants UI de base :
  - [ ] Button (primary, secondary, outline)
  - [ ] Card
  - [ ] Input / FileInput
  - [ ] Badge
  - [ ] Modal
  - [ ] Toast notifications
- [ ] Typographie (fonts)
- [ ] Mode sombre/clair (optionnel)
- [ ] Storybook (optionnel)

### Palette AFUP (à confirmer)
```css
--afup-blue: #3A5BA0;
--afup-blue-dark: #2A4470;
--afup-gray: #333333;
--afup-white: #FFFFFF;
```

### Fichiers
- `src/styles/theme.ts`
- `tailwind.config.js`
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- etc.

---

## 📄 Issue #12 : [Phase 3] Pages Principales de l'Application

**Labels** : `enhancement`, `phase-3`, `priority-high`

### Description
Créer toutes les pages de l'application web.

### Pages à Créer

#### HomePage (`/`)
- [ ] Hero section avec CTA
- [ ] Explication rapide du fonctionnement
- [ ] Bouton "Commencer le tirage"
- [ ] Footer avec lien GitHub

#### UploadPage (`/upload`)
- [ ] Drag & drop zone pour CSV
- [ ] Bouton file picker alternatif
- [ ] Preview du CSV uploadé
- [ ] Validation et affichage erreurs
- [ ] Bouton "Continuer"

#### PreviewPage (`/preview`)
- [ ] Liste des participants
- [ ] Nombre total affiché
- [ ] Barre de recherche/filtre
- [ ] Option exclusion manuelle
- [ ] Bouton "Lancer le tirage"

#### PickerPage (`/picker`)
- [ ] Settings (nombre de gagnants)
- [ ] Option seed
- [ ] Gros bouton "LANCER LE TIRAGE"
- [ ] Animation pendant tirage

#### ResultsPage (`/results`)
- [ ] Affichage gagnant(s)
- [ ] Détails (hash, timestamp)
- [ ] Boutons export (PDF, image, copier)
- [ ] Bouton "Nouveau tirage"

### Critères d'Acceptation
- [ ] Navigation fluide entre pages
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Loading states
- [ ] Error handling

---

## 🧩 Issue #13 : [Phase 3] Composants Métier Clés

**Labels** : `enhancement`, `phase-3`, `priority-high`

### Description
Développer les composants métier spécifiques.

### Composants

#### FileUpload
- [ ] Drag & drop zone
- [ ] Validation format CSV
- [ ] Preview des données
- [ ] Gestion erreurs upload

#### ParticipantList
- [ ] Liste virtualisée (si > 100)
- [ ] Recherche/filtre en temps réel
- [ ] Checkbox pour exclure
- [ ] Stats (total, exclus)

#### PickerSettings
- [ ] Input nombre de gagnants
- [ ] Input seed (optionnel)
- [ ] Liste exclusions avec suppression
- [ ] Validation en temps réel

#### WinnerDisplay
- [ ] Card pour chaque gagnant
- [ ] Animation d'apparition
- [ ] Confettis (canvas-confetti)

#### VerificationPanel
- [ ] Affichage hash
- [ ] Timestamp
- [ ] Seed utilisé
- [ ] Bouton copier

### Fichiers
- `src/components/FileUpload.tsx`
- `src/components/ParticipantList.tsx`
- `src/components/PickerSettings.tsx`
- `src/components/WinnerDisplay.tsx`
- `src/components/VerificationPanel.tsx`

---

## 🎬 Issue #14 : [Phase 4] Animation du Tirage Type Roulette

**Labels** : `enhancement`, `phase-4`, `priority-high`, `animation`

### Description
Créer une animation spectaculaire pour le tirage en direct.

### Tâches
- [ ] Installer Framer Motion ou GSAP
- [ ] Animation "roulette" avec défilement noms
- [ ] Démarrage rapide, ralentissement progressif
- [ ] Durée configurable (3-5 secondes)
- [ ] Révélation finale du gagnant
- [ ] Animation confettis (canvas-confetti)
- [ ] Son optionnel (drum roll + tada)
- [ ] Possibilité de passer l'animation

### Types d'Animation (choisir)
1. **Slot Machine** : 3 colonnes qui s'arrêtent une par une
2. **Roue** : Roue qui tourne et s'arrête
3. **Défilement** : Liste qui défile verticalement

### Critères d'Acceptation
- [ ] Animation fluide 60fps
- [ ] Suspense créé (ralentissement progressif)
- [ ] Effet "wow" pour l'audience
- [ ] Possibilité de désactiver (accessibilité)

---

## 🖥️ Issue #15 : [Phase 4] Mode Plein Écran et Présentation

**Labels** : `enhancement`, `phase-4`, `priority-high`

### Description
Optimiser l'interface pour projection en direct pendant meetup.

### Tâches
- [ ] Bouton fullscreen (Fullscreen API)
- [ ] Layout optimisé projection (fond sombre, contraste élevé)
- [ ] Textes XXL lisibles de loin
- [ ] Thème "présentation" distinct du thème normal
- [ ] Raccourcis clavier :
  - [ ] `Space` : Lancer le tirage
  - [ ] `F` : Toggle fullscreen
  - [ ] `Esc` : Quitter
  - [ ] `R` : Relancer
- [ ] Masquer éléments non-essentiels (navbar, footer)
- [ ] Logo AFUP en filigrane

### Design Présentation
```
┌─────────────────────────────────────┐
│                                     │
│         🎲 TIRAGE AU SORT          │
│                                     │
│         42 participants             │
│                                     │
│     [APPUYEZ SUR ESPACE POUR       │
│         LANCER LE TIRAGE]          │
│                                     │
│                            [logo]   │
└─────────────────────────────────────┘
```

### Critères d'Acceptation
- [ ] Lisible sur projecteur 1080p à 5 mètres
- [ ] Raccourcis clavier fonctionnent
- [ ] Transition fluide mode normal ↔ présentation

---

## 🔍 Issue #16 : [Phase 4] Transparence et Vérification

**Labels** : `enhancement`, `phase-4`, `priority-medium`, `security`

### Description
Assurer la transparence totale du processus de tirage.

### Tâches
- [ ] Afficher nombre total de participants avant tirage
- [ ] Option "Voir tous les participants" (liste complète)
- [ ] Génération hash de vérification
- [ ] Affichage hash après tirage
- [ ] Affichage seed si utilisé
- [ ] Timestamp précis
- [ ] Page `/verify/:hash` pour vérification externe
- [ ] Export rapport complet (PDF)

### Rapport de Tirage
```
═══════════════════════════════════════
  RAPPORT DE TIRAGE AU SORT
═══════════════════════════════════════

Date: 2025-11-14 15:30:45 UTC
Événement: Meetup AFUP Paris
Participants: 42
Gagnants: 3

Gagnants sélectionnés:
  1. Jean Dupont
  2. Marie Martin
  3. Pierre Durant

Hash de vérification:
  a3f5d8e9c2b1f4a7d6e3c8b5a2f1d9e6

Seed utilisé: meetup-2025-11-14

Algorithme: Sélection cryptographiquement
sécurisée avec crypto.randomInt() et
Fisher-Yates shuffle.

Ce tirage peut être vérifié à l'adresse:
https://meetup-picker.netlify.app/verify/a3f5...
═══════════════════════════════════════
```

---

## 📤 Issue #17 : [Phase 4] Export Résultats (PDF, Image, Copier)

**Labels** : `enhancement`, `phase-4`, `priority-medium`

### Description
Permettre l'export des résultats sous différents formats.

### Tâches
- [ ] Export PDF (jsPDF ou react-pdf)
- [ ] Export Image/Screenshot (html2canvas)
- [ ] Copier dans clipboard (navigator.clipboard)
- [ ] Export JSON pour audit
- [ ] Partage URL (avec résultat encodé)
- [ ] Template PDF avec logo AFUP

### Formats
1. **PDF** : Rapport complet avec logo
2. **Image** : Screenshot de la page résultat
3. **Texte** : Liste gagnants (copier/coller)
4. **JSON** : Données brutes pour audit

---

## 🚀 Issue #18 : [Phase 5] Préparation Production et Optimisation

**Labels** : `enhancement`, `phase-5`, `priority-high`, `performance`

### Description
Optimiser l'application pour la production.

### Tâches
- [ ] Variables d'environnement (.env.example)
- [ ] Build optimization Vite
- [ ] Code splitting et lazy loading
- [ ] Compression assets (gzip, brotli)
- [ ] Optimisation images
- [ ] Tree shaking
- [ ] Bundle size analysis
- [ ] Lighthouse score > 90
- [ ] Tests E2E avec Playwright

### Optimisations
- [ ] Lazy load pages avec React.lazy()
- [ ] Optimiser bundle size (< 200KB initial)
- [ ] Preload fonts
- [ ] Service Worker (optionnel PWA)

---

## 🔄 Issue #19 : [Phase 5] CI/CD avec GitHub Actions

**Labels** : `enhancement`, `phase-5`, `priority-medium`, `devops`

### Description
Automatiser les tests et le déploiement.

### Workflows

#### `.github/workflows/test.yml`
- [ ] Trigger sur PR et push main
- [ ] Lint (ESLint)
- [ ] Tests unitaires (Jest/Vitest)
- [ ] Tests E2E (Playwright)
- [ ] Build check

#### `.github/workflows/deploy.yml`
- [ ] Deploy frontend Netlify
- [ ] Deploy backend si nécessaire
- [ ] Notifications Discord/Slack (optionnel)

### Critères d'Acceptation
- [ ] Tests auto sur chaque PR
- [ ] Deploy auto sur merge main
- [ ] Status badges dans README

---

## 🌍 Issue #20 : [Phase 5] Déploiement Netlify

**Labels** : `enhancement`, `phase-5`, `priority-high`, `deployment`

### Description
Déployer l'application sur Netlify.

### Tâches
- [ ] Créer compte Netlify
- [ ] Connecter repository GitHub
- [ ] Configurer build settings
- [ ] Configurer environnement variables
- [ ] Setup redirects (`_redirects` pour SPA)
- [ ] Configurer domaine custom (optionnel)
- [ ] HTTPS automatique
- [ ] Test deploy preview sur PR

### Configuration Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📖 Issue #21 : [Phase 5] Documentation Utilisateur Complète

**Labels** : `documentation`, `phase-5`, `priority-medium`

### Description
Créer la documentation complète pour les utilisateurs.

### Documents
- [ ] README.md (mise à jour finale)
- [ ] Guide utilisateur (`docs/USER_GUIDE.md`)
- [ ] Guide de contribution (`CONTRIBUTING.md`)
- [ ] FAQ (`docs/FAQ.md`)
- [ ] Changelog (`CHANGELOG.md`)
- [ ] Architecture Decision Records (`docs/adr/`)

### Contenu Guide Utilisateur
1. Introduction
2. Prérequis (format CSV)
3. Étapes d'utilisation (screenshots)
4. Mode présentation
5. Vérification des résultats
6. Troubleshooting
7. Contact support

---

## 🎁 Issue #22 : [BONUS] Support Multi-langue (FR/EN)

**Labels** : `enhancement`, `bonus`, `i18n`, `priority-low`

### Description
Internationaliser l'application (français et anglais).

### Tâches
- [ ] Installer react-i18next
- [ ] Extraire tous les textes
- [ ] Créer fichiers de traduction `fr.json` et `en.json`
- [ ] Sélecteur de langue dans UI
- [ ] Détection langue navigateur
- [ ] Persistence choix langue

---

## 🎁 Issue #23 : [BONUS] Web Scraping Meetup (si pas d'API)

**Labels** : `enhancement`, `bonus`, `scraping`, `priority-low`

### Description
Implémenter le scraping de Meetup.com comme alternative à l'API.

### Tâches
- [ ] Installer Puppeteer ou Playwright
- [ ] Scraper liste participants depuis URL événement
- [ ] Gestion authentification (cookies)
- [ ] Rate limiting pour éviter ban
- [ ] Fallback si structure HTML change
- [ ] Documentation légale (ToS Meetup)

⚠️ **Attention** : Vérifier ToS Meetup avant implémentation

---

## 🎁 Issue #24 : [BONUS] Mode Multiple Rounds (Demi-finale, Finale)

**Labels** : `enhancement`, `bonus`, `priority-low`

### Description
Permettre des tirages successifs avec élimination progressive.

### Tâches
- [ ] Configuration "tournoi" (ex: 16 → 8 → 4 → 2 → 1)
- [ ] Sauvegarde état entre rounds
- [ ] Affichage bracket/arbre tournoi
- [ ] Export historique complet

---

## 🎁 Issue #25 : [BONUS] PWA - Progressive Web App

**Labels** : `enhancement`, `bonus`, `pwa`, `priority-low`

### Description
Transformer en PWA pour utilisation offline.

### Tâches
- [ ] Configurer Vite PWA plugin
- [ ] Créer manifest.json
- [ ] Service Worker pour cache
- [ ] Icons pour mobile (192x192, 512x512)
- [ ] Splash screens
- [ ] "Add to Home Screen" prompt

---

# Script de Création Automatique

Pour créer toutes ces issues automatiquement, utilisez ce script :

```bash
#!/bin/bash

# Vous devrez avoir gh CLI installé et authentifié
# gh auth login

# Créer les issues
gh issue create --title "[Phase 1] Setup Initial du Projet MVP CLI" --body-file issue-01.md --label "enhancement,phase-1,priority-high"
gh issue create --title "[Phase 1] Implémentation du Parser CSV" --body-file issue-02.md --label "enhancement,phase-1,priority-high"
# ... etc pour toutes les issues
```

Ou créez-les manuellement une par une sur GitHub !

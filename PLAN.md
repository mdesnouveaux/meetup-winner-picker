# Plan d'Implémentation - Meetup Winner Picker

## Contexte

Application de tirage au sort pour événements Meetup avec interface web pour présentation en direct.

### Décisions Techniques

- **Stack** : Node.js + TypeScript (backend + CLI), React + TypeScript (frontend)
- **Hébergement** : Netlify (frontend + serverless functions)
- **API Meetup** : Import CSV (MVP) puis scraping web (si nécessaire)
- **Design** : Couleurs AFUP (bleu `#3A5BA0`)
- **Approche** : MVP CLI d'abord, puis interface web

---

## Phase 1 : MVP CLI (Prioritaire)

### 1.1 Setup Initial
- [x] Initialiser le projet Node.js + TypeScript
- [ ] Configuration ESLint + Prettier
- [ ] Setup Jest pour les tests
- [ ] Créer .gitignore complet
- [ ] Ajouter README avec instructions

### 1.2 Parser CSV
- [ ] Fonction pour lire fichier CSV
- [ ] Validation du format (nom, email optionnel)
- [ ] Gestion des doublons
- [ ] Tests unitaires du parser

### 1.3 Algorithme de Sélection Aléatoire
- [ ] Implémentation avec crypto.randomInt()
- [ ] Support sélection multiple (n winners)
- [ ] Option seed pour reproductibilité
- [ ] Option exclude pour exclure des participants
- [ ] Tests exhaustifs (fairness, edge cases)
- [ ] Documentation de l'algorithme

### 1.4 CLI avec Commander.js
- [ ] Commande `pick <file.csv>` (sélection simple)
- [ ] Option `-n, --number <count>` (multiple winners)
- [ ] Option `-s, --seed <value>` (seed reproductible)
- [ ] Option `--exclude <names>` (exclusions)
- [ ] Option `-o, --output <file>` (export résultats)
- [ ] Option `--format <json|text>` (format sortie)
- [ ] Affichage formaté et coloré (chalk)

### 1.5 Documentation CLI
- [ ] README avec exemples d'utilisation
- [ ] Exemples de fichiers CSV
- [ ] Guide de vérification du tirage

---

## Phase 2 : Backend API (Optionnel si Serverless)

### 2.1 Setup Express API
- [ ] Initialiser Express + TypeScript
- [ ] Structure projet (routes, controllers, services)
- [ ] Middleware CORS, rate limiting
- [ ] Logger (Winston ou Pino)
- [ ] Variables d'environnement

### 2.2 Endpoints REST
- [ ] `POST /api/upload` - Upload CSV participants
- [ ] `POST /api/pick` - Lancer tirage
- [ ] `GET /api/picks/:id` - Récupérer résultat
- [ ] `GET /api/picks/:id/verify` - Vérifier intégrité
- [ ] Validation avec Zod

### 2.3 Stockage Session
- [ ] Stockage en mémoire ou Redis
- [ ] Expiration automatique (1h)
- [ ] Pas de stockage permanent (RGPD)

### 2.4 Alternative : Netlify Functions
- [ ] Implémenter comme serverless functions
- [ ] Upload et tirage en une fonction
- [ ] Stockage temporaire (session browser)

---

## Phase 3 : Interface Web

### 3.1 Setup React + Vite
- [ ] Initialiser Vite + React + TypeScript
- [ ] Configuration Tailwind CSS
- [ ] React Router pour navigation
- [ ] TanStack Query pour API calls

### 3.2 Design System
- [ ] Créer thème AFUP (couleurs, typographie)
- [ ] Composants UI de base (Button, Card, Input)
- [ ] Layout responsive
- [ ] Mode sombre/clair

### 3.3 Pages Principales
- [ ] **Home** : Landing page avec CTA
- [ ] **Upload** : Drag & drop CSV
- [ ] **Preview** : Liste participants avec stats
- [ ] **Picker** : Interface de tirage
- [ ] **Results** : Affichage gagnants

### 3.4 Composants Clés
- [ ] FileUpload (CSV drag & drop)
- [ ] ParticipantList (avec recherche/filtre)
- [ ] PickerSettings (nombre, exclusions)
- [ ] WinnerDisplay
- [ ] LoadingStates et ErrorBoundaries

---

## Phase 4 : Mode Présentation Live

### 4.1 Animation du Tirage
- [ ] Effet roulette avec défilement noms
- [ ] Ralentissement progressif
- [ ] Animation confettis (canvas-confetti)
- [ ] Son optionnel (drum roll)
- [ ] Transition révélation gagnant

### 4.2 Mode Plein Écran
- [ ] Bouton fullscreen
- [ ] Design optimisé projection
- [ ] Gros textes lisibles de loin
- [ ] Raccourcis clavier (Space = lancer)

### 4.3 Transparence
- [ ] Affichage nombre total participants
- [ ] Hash de vérification
- [ ] Affichage seed si utilisé
- [ ] Bouton "voir tous les participants"

### 4.4 Export Résultats
- [ ] Export PDF avec logo AFUP
- [ ] Export image (screenshot)
- [ ] Copier résultat dans clipboard

---

## Phase 5 : Déploiement

### 5.1 Préparation Production
- [ ] Variables d'environnement (.env.example)
- [ ] Build optimization (lazy loading)
- [ ] Compression assets
- [ ] Tests E2E (Playwright)

### 5.2 CI/CD GitHub Actions
- [ ] Workflow tests automatiques
- [ ] Workflow déploiement Netlify
- [ ] Linting sur PR

### 5.3 Déploiement
- [ ] Deploy frontend sur Netlify
- [ ] Configuration domaine custom (optionnel)
- [ ] HTTPS automatique
- [ ] Monitoring basique

### 5.4 Documentation
- [ ] Guide utilisateur (FR)
- [ ] Guide de contribution
- [ ] Architecture Decision Records (ADR)

---

## Fonctionnalités Bonus (Post-MVP)

- [ ] Support multi-langue (FR/EN)
- [ ] Import depuis Eventbrite
- [ ] Scraping Meetup (si pas d'API)
- [ ] Sélection pondérée (favoriser réguliers)
- [ ] Historique des tirages
- [ ] Mode "multiple rounds" (demi-finale, finale)
- [ ] QR code vérification
- [ ] PWA (offline ready)

---

## Estimation Temps

- **Phase 1 (MVP CLI)** : 2-3 jours ⭐ PRIORITÉ
- **Phase 2 (API)** : 2 jours (ou serverless 1 jour)
- **Phase 3 (Interface)** : 4-5 jours
- **Phase 4 (Live Mode)** : 3 jours
- **Phase 5 (Déploiement)** : 1 jour

**Total** : ~2 semaines

---

## Notes Importantes

### API Meetup
⚠️ **L'API Meetup n'est plus gratuite** (Meetup Pro requis, $$$)

**Solutions** :
1. **CSV Import** (recommandé pour MVP)
2. **Web Scraping** (Puppeteer, plus fragile)
3. **Saisie manuelle** (backup)

### Couleurs AFUP
À confirmer :
- Bleu principal : `#3A5BA0`
- Bleu foncé : `#2A4470`
- Gris : `#333333`

### Hébergement Choisi
- **Frontend** : Netlify (gratuit, illimité)
- **Backend** : Netlify Functions (serverless)
- **Alternative** : Render (si API séparée nécessaire)

---

**Dernière mise à jour** : 2025-11-14

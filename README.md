# Meetup Winner Picker 🎲

Outil de tirage au sort équitable et transparent pour sélectionner aléatoirement des gagnants parmi les participants d'un événement Meetup.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-20%2F20-brightgreen)](.)

## ✨ Fonctionnalités

- 🎯 **Sélection cryptographiquement sécurisée** avec `crypto.randomInt()`
- 📊 **Algorithme équitable** (Fisher-Yates shuffle)
- 🔄 **Reproductibilité** avec seeds personnalisés
- 🚫 **Exclusion de participants** facilement
- 📁 **Import CSV** simple
- 🎨 **Affichage formaté et coloré** dans le terminal
- ✅ **Tests exhaustifs** (20 tests, 100% de couverture sur le core)
- 🔍 **Hash de vérification** pour l'audit
- 📤 **Export** en texte ou JSON

## 📦 Installation

### Prérequis

- Node.js >= 18
- npm ou yarn

### Installation globale

```bash
npm install -g meetup-winner-picker
```

### Installation locale (développement)

```bash
git clone https://github.com/mdesnouveaux/meetup-winner-picker.git
cd meetup-winner-picker
npm install
npm run build
```

## 🚀 Utilisation

### Format CSV

Créez un fichier CSV avec au minimum une colonne `nom` :

```csv
nom,email
Jean Dupont,jean.dupont@example.com
Marie Martin,marie.martin@example.com
Pierre Durant,pierre.durant@example.com
```

La colonne `email` est optionnelle.

### Commandes CLI

#### Tirage simple

```bash
meetup-picker pick participants.csv
```

#### Tirage multiple (3 gagnants)

```bash
meetup-picker pick participants.csv -n 3
```

#### Tirage avec seed (reproductible)

```bash
meetup-picker pick participants.csv -s "meetup-afup-2025"
```

#### Exclure des participants

```bash
meetup-picker pick participants.csv --exclude "Jean Dupont,Marie Martin"
```

#### Mode verbeux (afficher les détails)

```bash
meetup-picker pick participants.csv -v
```

#### Export en JSON

```bash
meetup-picker pick participants.csv --format json -o results.json
```

### Toutes les options

```bash
meetup-picker pick <file.csv> [options]

Options:
  -n, --number <count>    Nombre de gagnants à sélectionner (défaut: 1)
  -s, --seed <value>      Seed pour reproductibilité du tirage
  --exclude <names>       Noms à exclure (séparés par des virgules)
  -o, --output <file>     Fichier de sortie pour sauvegarder les résultats
  --format <type>         Format de sortie: text ou json (défaut: text)
  -v, --verbose           Afficher les détails du tirage
  -h, --help              Afficher l'aide
```

## 📖 Exemples

### Exemple 1 : Tirage simple pour un meetup

```bash
$ meetup-picker pick meetup-paris-2025.csv

⏳ Chargement des participants...
✓ 42 participants chargés

⏳ Tirage au sort en cours...

🎊 Tirage au sort terminé !

🏆 Le gagnant est :

   Sophie Bernard
   sophie.bernard@example.com
```

### Exemple 2 : Sélection de 3 gagnants avec détails

```bash
$ meetup-picker pick meetup-paris-2025.csv -n 3 -v

🎊 Tirage au sort terminé !

🏆 Les 3 gagnants sont :

   1. Thomas Roux
      thomas.roux@example.com
   2. Marie Martin
      marie.martin@example.com
   3. Nicolas Blanc
      nicolas.blanc@example.com

📊 Détails du tirage :
   • Participants éligibles : 42
   • Date : 14/11/2025 22:45:12
   • Hash de vérification : 138ccd106c54830c...
```

### Exemple 3 : Tirage reproductible avec seed

```bash
# Premier tirage
$ meetup-picker pick participants.csv -s "meetup-2025" -n 2

🏆 Les 2 gagnants sont :
   1. Julie Lambert
   2. Camille Dubois

# Deuxième tirage avec le même seed = même résultat
$ meetup-picker pick participants.csv -s "meetup-2025" -n 2

🏆 Les 2 gagnants sont :
   1. Julie Lambert  # ✅ Identique
   2. Camille Dubois # ✅ Identique
```

### Exemple 4 : Export JSON pour audit

```bash
$ meetup-picker pick participants.csv --format json -o audit.json

{
  "winners": [
    {
      "nom": "Jean Dupont",
      "email": "jean.dupont@example.com"
    }
  ],
  "timestamp": "2025-11-14T22:53:12.477Z",
  "totalParticipants": 10,
  "hash": "093e8b1cc3807b403e8d337284d28eb29617943e108cd69bbe832a72656d0eab"
}
```

## 🔒 Sécurité et Équité

### Algorithme cryptographiquement sécurisé

Le tirage utilise **`crypto.randomInt()`** de Node.js au lieu de `Math.random()`, garantissant une sélection cryptographiquement sécurisée et imprévisible.

### Algorithme Fisher-Yates

Pour la sélection de multiples gagnants, l'algorithme **Fisher-Yates shuffle** est utilisé, assurant que :
- Chaque participant a exactement la même probabilité d'être sélectionné
- Aucun doublon n'est possible
- La distribution est statistiquement équitable

### Tests de fairness

Les tests incluent une vérification statistique sur 10 000 tirages pour garantir que chaque participant a une probabilité égale (± 2%) d'être sélectionné.

### Hash de vérification

Chaque tirage génère un hash SHA-256 incluant :
- La liste des participants éligibles
- Le timestamp du tirage
- Le seed utilisé (si applicable)

Ce hash permet de vérifier l'intégrité du tirage a posteriori.

## 🧪 Tests

Lancer les tests :

```bash
npm test
```

Avec couverture :

```bash
npm run test:coverage
```

Résultats actuels : **20/20 tests passent** ✅

Les tests couvrent :
- Parsing CSV (8 tests)
- Sélection aléatoire (12 tests)
- Edge cases (liste vide, doublons, exclusions, etc.)
- Fairness statistique

## 🛠️ Développement

### Installation

```bash
git clone https://github.com/mdesnouveaux/meetup-winner-picker.git
cd meetup-winner-picker
npm install
```

### Scripts disponibles

```bash
npm run build          # Compiler TypeScript
npm run dev            # Lancer en mode développement
npm test               # Lancer les tests
npm run test:watch     # Tests en mode watch
npm run test:coverage  # Tests avec couverture
npm run lint           # Linter le code
npm run lint:fix       # Fixer automatiquement les erreurs de lint
npm run format         # Formater le code avec Prettier
```

### Structure du projet

```
meetup-winner-picker/
├── src/
│   ├── cli/              # Interface ligne de commande
│   │   ├── index.ts      # Point d'entrée CLI
│   │   └── formatter.ts  # Formatage de l'affichage
│   ├── parser/           # Parser CSV
│   │   └── csv-parser.ts
│   ├── picker/           # Algorithme de sélection
│   │   └── random-selector.ts
│   ├── utils/            # Utilitaires
│   │   └── hash.ts       # Génération de hash
│   └── types/            # Types TypeScript
│       └── participant.ts
├── tests/                # Tests unitaires
│   ├── parser/
│   └── picker/
├── examples/             # Exemples de CSV
└── dist/                 # Build (généré)
```

## 📋 Roadmap

### Phase 1 : MVP CLI ✅ (Terminé)
- [x] Setup projet TypeScript
- [x] Parser CSV
- [x] Algorithme de sélection sécurisé
- [x] Interface CLI
- [x] Tests complets
- [x] Documentation

### Phase 2 : Backend API (À venir)
- [ ] API REST avec Express
- [ ] Endpoints pour upload et tirage
- [ ] Stockage session temporaire
- [ ] Alternative : Netlify Functions

### Phase 3 : Interface Web (À venir)
- [ ] Application React + Vite
- [ ] Design aux couleurs AFUP
- [ ] Upload CSV drag & drop
- [ ] Prévisualisation des participants

### Phase 4 : Mode Présentation Live (À venir)
- [ ] Animation type "roulette"
- [ ] Mode plein écran pour projection
- [ ] Export PDF/Image des résultats
- [ ] Confettis et effets visuels

### Phase 5 : Déploiement (À venir)
- [ ] Déploiement Netlify
- [ ] CI/CD GitHub Actions
- [ ] Documentation utilisateur complète

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez le fichier [CLAUDE.md](CLAUDE.md) pour les guidelines de développement.

### Comment contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commit les changements (`git commit -m 'feat: ajout de ma fonctionnalité'`)
4. Push vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est distribué sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**mdesnouveaux**

## 🙏 Remerciements

- Communauté [AFUP](https://afup.org) pour l'inspiration
- Tous les organisateurs de meetups qui ont besoin d'un tirage équitable

---

**Made with ❤️ for the PHP & Meetup community**

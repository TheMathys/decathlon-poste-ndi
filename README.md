# 🏋️ CTO de Votre Santé Posturale - Application Decathlon

Une application web moderne qui aide les utilisateurs à prévenir les blessures sportives en guidant la réalisation correcte de mouvements sportifs de base grâce à des recommandations personnalisées et un programme d'entraînement structuré.

## ✨ Fonctionnalités

### 🎯 Profilage et Recommandations

- **Questionnaire Interactif** : Évaluation complète en plusieurs étapes couvrant le niveau sportif, les activités pratiquées, les objectifs et les contraintes de santé
- **Recommandations Personnalisées** : Algorithme intelligent de scoring qui suggère des exercices adaptés au profil utilisateur
- **Instructions Détaillées** : Guide pas-à-pas avec descriptions visuelles, adaptations selon le niveau, et avertissements de sécurité
- **Validation en Temps Réel** : Vérification des réponses avec indicateur de progression

### 📅 Programme Structuré Hebdomadaire

- **Planning Automatique** : Répartition intelligente des exercices sur la semaine selon la fréquence d'entraînement
- **Séries et Répétitions** : Calcul automatique des séries, répétitions et temps de repos adaptés au niveau
- **Gestion des Exercices Isométriques** : Support des exercices de maintien (plank, wall sit) avec temps de maintien
- **Adaptation par Âge** : Ajustements automatiques pour les utilisateurs de plus de 50 ans

### 🎮 Session d'Entraînement Guidée

- **Timer Intégré** : Compte à rebours pour chaque phase (échauffement, exercice, repos)
- **Coach Virtuel** : Messages d'encouragement contextuels et feedback personnalisé
- **Sélection par Jour** : Choisir un jour spécifique pour démarrer sa séance
- **Suivi en Temps Réel** : Barre de progression, compteur de séries, et indicateurs visuels
- **Contrôles Flexibles** : Pause, reprise, et possibilité de passer un exercice

### 📊 Statistiques et Analyses

- **Dashboard Visuel** : Graphiques de répartition par catégorie d'exercices
- **Métriques Clés** : Nombre d'exercices, durée totale, jours par semaine, niveau moyen
- **Vue Comparaison** : Comparer différents programmes (fonctionnalité disponible)

### 🛒 Intégration Decathlon

- **Produits Recommandés** : Suggestions de matériel et accessoires adaptés à chaque exercice
- **Ajout au Panier** : Intégration directe avec l'API externe Decathlon
- **Liens Produits** : Accès direct aux pages produits sur le site Decathlon

### 💾 Export et Partage

- **Export JSON** : Télécharger son programme au format JSON
- **Export Texte** : Générer un fichier texte formaté avec toutes les informations
- **Lien de Partage** : Générer un lien unique pour retrouver son programme plus tard
- **Sauvegarde Automatique** : Persistance du profil dans le localStorage

### 🎨 Interface Moderne

- **Design Responsive** : Interface adaptée mobile, tablette et desktop
- **Vues Multiples** : Basculement entre vue liste et vue programme hebdomadaire
- **Animations Fluides** : Transitions et effets visuels soignés
- **Accessibilité** : Support des lecteurs d'écran et navigation au clavier

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** : Version 18 ou supérieure
- **npm** ou **yarn** : Gestionnaire de paquets

### Installation

1. **Cloner le dépôt** :

```bash
git clone https://github.com/TheMathys/decathlon-poste-ndi
cd decathlon
```

2. **Installer les dépendances** :

```bash
npm install
```

3. **Lancer le serveur de développement** :

```bash
npm run dev
```

4. **Ouvrir dans le navigateur** :

L'application sera accessible à l'adresse [http://localhost:5173](http://localhost:5173) (ou un autre port si celui-ci est occupé).

### Scripts Disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la version de production
npm run preview

# Vérifier le code avec ESLint
npm run lint

# Formater le code avec Prettier
npm run format

# Vérifier le formatage
npm run format:check
```

## 📦 Stack Technologique

### Framework et Langage

- **[React 19](https://react.dev/)** - Bibliothèque UI moderne
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript avec typage statique
- **[Vite](https://vitejs.dev/)** - Outil de build ultra-rapide

### Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **CSS Personnalisé** - Styles spécifiques pour l'identité visuelle Decathlon

### Architecture

- **Composants Réutilisables** - Architecture modulaire avec séparation des responsabilités
- **Hooks Personnalisés** - Logique métier réutilisable
- **Services Dédiés** - Algorithme de recommandation et scoring
- **Types Stricts** - Interfaces TypeScript complètes

## 📁 Structure du Projet

```
decathlon/
├── src/
│   ├── assets/                  # Ressources statiques
│   │   └── json/
│   │       ├── qcm.json         # Configuration du questionnaire
│   │       └── sample_person.json # Profil par défaut
│   │
│   ├── components/              # Composants React
│   │   ├── exercises/          # Composants d'exercices
│   │   │   ├── ExerciseCard.tsx
│   │   │   ├── DecathlonProducts.tsx
│   │   │   └── PersonalizedInstructions.tsx
│   │   │
│   │   ├── forms/              # Composants de formulaire
│   │   │   ├── Formulaire.tsx  # Formulaire principal
│   │   │   ├── ExerciseSuggestions.tsx # Page de résultats
│   │   │   ├── FormHeader.tsx
│   │   │   └── ExportButtons.tsx
│   │   │
│   │   ├── program/            # Composants de programme
│   │   │   ├── WeeklyProgramView.tsx
│   │   │   ├── ProgrammedExerciseCard.tsx
│   │   │   ├── ProgramStatsCard.tsx
│   │   │   └── ProgramComparison.tsx
│   │   │
│   │   ├── training/           # Composants d'entraînement
│   │   │   ├── TrainingSession.tsx # Session guidée
│   │   │   └── DaySelector.tsx # Sélecteur de jour
│   │   │
│   │   └── shared/             # Composants partagés
│   │       ├── ui/             # Composants UI réutilisables
│   │       │   ├── Button.tsx
│   │       │   ├── Badge.tsx
│   │       │   └── ProgressBar.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── config/                 # Configuration
│   │   └── constants.ts        # Constantes de l'application
│   │
│   ├── data/                   # Données de l'application
│   │   ├── exercices.json      # Base de données des exercices
│   │   ├── decathlonProducts.json # Catalogue produits
│   │   └── weights.ts          # Pondérations pour le scoring
│   │
│   ├── hooks/                  # Hooks personnalisés
│   │   ├── useProfileForm.ts
│   │   ├── useFormValidation.ts
│   │   └── useProfilePersistence.ts
│   │
│   ├── services/                # Logique métier
│   │   ├── recommendations/    # Système de recommandation
│   │   │   ├── extractNeeds.ts
│   │   │   ├── filters.ts
│   │   │   ├── recommend.ts
│   │   │   └── scoring.ts
│   │   └── programming/        # Création de programme
│   │       ├── createProgram.ts
│   │       └── calculateStats.ts
│   │
│   ├── types/                   # Définitions TypeScript
│   │   └── index.ts
│   │
│   ├── utils/                   # Utilitaires
│   │   ├── exportProgram.ts    # Export et partage
│   │   └── localStorage.ts     # Gestion du stockage
│   │
│   ├── App.tsx                  # Composant racine
│   ├── main.tsx                 # Point d'entrée
│   └── index.css                # Styles globaux
│
├── public/                      # Fichiers statiques publics
├── dist/                        # Build de production (généré)
│
├── package.json                 # Dépendances et scripts
├── tsconfig.json               # Configuration TypeScript
├── vite.config.ts              # Configuration Vite
├── tailwind.config.js          # Configuration Tailwind
└── README.md                    # Ce fichier
```

## 🎯 Comment Ça Marche

### Parcours Utilisateur

1. **Phase d'Évaluation** : L'utilisateur répond à un questionnaire complet couvrant :
   - Niveau sportif (Débutant, Intermédiaire, Avancé)
   - Âge et fréquence d'entraînement
   - Sports pratiqués
   - Objectifs principaux (Posture, Renforcement, Mobilité, etc.)
   - Douleurs et limitations actuelles
   - Matériel disponible
   - Préférences de type d'exercice

2. **Phase d'Analyse** : L'application analyse les réponses avec un algorithme de scoring qui prend en compte :
   - Correspondance avec les objectifs (poids 5)
   - Adéquation du niveau (poids 4)
   - Disponibilité du matériel (poids 3)
   - Préférences utilisateur (poids 2)
   - Sports pratiqués (bonus 1.5 par correspondance)
   - Exclusion automatique des exercices avec contre-indications

3. **Phase de Résultats** : L'utilisateur reçoit :
   - **Vue Liste** : Liste des exercices recommandés avec descriptions détaillées
   - **Vue Programme** : Planning hebdomadaire structuré avec séries et répétitions
   - **Statistiques** : Dashboard visuel avec métriques et graphiques
   - **Session d'Entraînement** : Mode guidé avec timer et coach virtuel
   - **Produits Decathlon** : Suggestions de matériel adapté
   - **Export** : Téléchargement en JSON ou texte, génération de lien de partage

### Fonctionnalités Clés

#### Algorithme de Scoring

L'algorithme utilise un système de pondération pour évaluer chaque exercice :

- **Objectifs** : Poids 5 (critère le plus important)
- **Niveau** : Poids 4 (correspondance exacte importante)
- **Matériel** : Poids 3 (faisabilité de l'exercice)
- **Préférences** : Poids 2
- **Sports pratiqués** : Bonus de 1.5 par correspondance
- **Fréquence d'entraînement** : Ajustement du niveau de difficulté
- **Âge** : Adaptations pour les utilisateurs de plus de 50 ans

Les exercices avec contre-indications sont automatiquement exclus (score de -9999).

#### Programme Structuré

Le système génère automatiquement un programme hebdomadaire avec :

- **Répartition par Jour** : Exercices distribués selon la fréquence d'entraînement
- **Calcul de Séries/Répétitions** : Adaptation selon le niveau et l'âge
- **Gestion Isométrique** : Support des exercices de maintien (temps en secondes)
- **Durée Estimée** : Calcul automatique du temps total par séance

#### Session d'Entraînement Guidée

Fonctionnalité phare permettant de :

- **Sélectionner un Jour** : Choisir le jour de la semaine pour l'entraînement
- **Timer Intelligent** : Compte à rebours pour échauffement, exercice et repos
- **Coach Virtuel** : Messages d'encouragement contextuels
- **Suivi de Progression** : Barre de progression et compteurs visuels
- **Contrôles** : Pause, reprise, et possibilité de passer

## 🔧 Configuration et Personnalisation

### Modifier les Exercices

Les exercices sont stockés dans `src/data/exercices.json`. Chaque exercice contient :

```json
{
  "id": "squat_base",
  "name": "Squat au poids du corps",
  "categories": ["renforcement_musculaire", "poids_du_corps"],
  "objectifs_cibles": ["renforcement_musculaire", "posture"],
  "materiel": [],
  "niveau": "debutant",
  "contre_indications": ["douleurs_genou_severe"],
  "description": "Description détaillée..."
}
```

### Modifier les Produits Decathlon

Les produits sont dans `src/data/decathlonProducts.json`. Chaque produit peut être associé à des exercices via `exerciseIds` ou `exerciseCategories`.

### Ajuster l'Algorithme de Scoring

Les pondérations sont définies dans `src/data/weights.ts`. Modifiez les valeurs pour ajuster l'importance des critères.

### Personnaliser les Styles

- **Styles globaux** : `src/index.css`
- **Styles Decathlon** : `src/components/forms/decathlon-styles.css`
- **Configuration Tailwind** : `tailwind.config.js`

## 📝 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement avec rechargement automatique |
| `npm run build` | Construit l'application pour la production |
| `npm run preview` | Prévisualise la version de production localement |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run format` | Formate le code avec Prettier |
| `npm run format:check` | Vérifie le formatage sans modifier les fichiers |

## 🌐 Déploiement

### Build de Production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

### Prévisualisation Locale

```bash
npm run preview
```

### Déploiement sur Vercel/Netlify

1. Connectez votre dépôt Git
2. Configurez la commande de build : `npm run build`
3. Définissez le dossier de sortie : `dist`
4. Déployez !

## 🎨 Personnalisation

### Modifier les Couleurs

Les couleurs principales sont définies dans Tailwind. Modifiez `tailwind.config.js` ou utilisez les classes Tailwind directement.

### Ajouter des Exercices

1. Ajoutez l'exercice dans `src/data/exercices.json`
2. Assurez-vous que les catégories, objectifs et contre-indications correspondent aux valeurs du questionnaire
3. Testez avec différents profils utilisateurs

### Modifier le Questionnaire

Le questionnaire est configuré dans `src/assets/json/qcm.json`. Vous pouvez :
- Ajouter/modifier des questions
- Changer les types de champs
- Ajouter des conditions d'affichage avec `show_if`

## 🐛 Dépannage

### Problèmes Courants

**L'application ne démarre pas :**
- Vérifiez que Node.js 18+ est installé : `node --version`
- Supprimez `node_modules` et `package-lock.json`, puis réinstallez : `npm install`

**Erreurs de build :**
- Vérifiez les erreurs TypeScript : `npm run build`
- Vérifiez les erreurs ESLint : `npm run lint`

**Le localStorage ne fonctionne pas :**
- Vérifiez que les cookies ne sont pas désactivés
- Testez en mode navigation privée

## 📚 Ressources

- [Documentation React](https://react.dev/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)

## 🤝 Contribution

Ce projet a été développé dans le cadre de la Nuit de l'Info pour Decathlon.

---

**Développé avec ❤️ en utilisant React par @TheMathys, TypeScript, Vite et Tailwind CSS**

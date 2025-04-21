# ✈️ SkyCoach – Application de révision PPL

**SkyCoach** est une application web qui permet aux élèves pilotes de réviser efficacement leur licence de pilote privé (PPL). Elle propose des fiches synthétiques, des quiz interactifs, un suivi de progression visuel et un chatbot IA pour t'accompagner dans ta formation.

---

## 🚀 Objectifs du projet

- Créer un outil intuitif et rapide pour s'entraîner au PPL
- Proposer des contenus pédagogiques clairs, interactifs et utiles
- Utiliser des technologies modernes (Next.js, Firebase, GPT)
- Rendre l’expérience motivante grâce au suivi des progrès

---

## 🔧 Stack technique

- **Next.js (App Router)** – Frontend + rendering serveur (RSC)
- **Tailwind CSS** – UI rapide et responsive
- **Firebase** – Auth, Firestore, hébergement
- **Vercel Edge Functions** – Fonctions ultra rapides (auth, GPT, etc.)
- **Serverless Node Functions** – Accès Firebase admin, Firestore
- **OpenAI API** – Coach IA personnalisé

---

## 📁 Structure de navigation

```
/app
  /dashboard       → Accueil (résumé, stats)
  /revision        → Fiches synthèse par thème
  /quiz            → Lancer un quiz
  /progression     → Graphe d’évolution
  /coach           → Chat IA
  /history         → Historique de quiz
  /login           → Connexion/inscription
```

---

## 🧩 Fonctionnalités principales

### 📚 Révision

- Fiches de synthèse organisées par thème (météo, nav, etc.)
- Composants React Server (RSC) pour charger rapidement les contenus

### ❓ Quiz

- QCM générés aléatoirement ou par thème
- Mode "Examen blanc" avec chrono
- Résultats avec explications et sauvegarde dans l'historique

### 📊 Progression

- Visualisation des scores par thème
- Graphiques d’évolution (par jour/semaine)
- Comparaison entre sessions

### 🧠 Coach IA

- Chat IA personnalisé basé sur GPT
- Poser des questions ou simuler des cas pratiques

### 🕓 Historique

- Accès aux quiz passés, scores, corrections
- Option de rejouer un quiz passé

### 🔐 Auth utilisateur

- Authentification avec Firebase (email/mot de passe)
- Gestion des tokens avec cookies HttpOnly
- Vérification d’authentification via Edge Functions

---

## 🛠️ Roadmap (MVP)

### 🔹 Phase 1 : Setup de base
- Créer une app Next.js avec App Router et TypeScript
- Ajouter Tailwind CSS et config de base
- Implémenter `layout.tsx` avec sidebar/menu
- Ajouter `loading.tsx` et une page dashboard par défaut

### 🔹 Phase 2 : Auth utilisateur (Firebase)
- Installer Firebase SDK (client)
- Créer `firebaseConfig.ts` pour initialiser Firebase
- Implémenter le login/signup avec `firebase/auth`
- Récupérer l'ID token après connexion
- Vérifier ce token via une Edge Function (`/api/check-auth`)

### 🔹 Phase 3 : Révision (fiches)
- Afficher la liste des thèmes (météo, nav, mécanique du vol...)
- Charger une fiche via RSC depuis un fichier JSON ou markdown
- Navigation entre les fiches (précédent/suivant)

### 🔹 Phase 4 : Quiz interactif
- Formulaire de lancement (mode, thème, nombre de questions)
- Génération de quiz (exemple local ou via API)
- Interface d’enchaînement des questions
- Affichage du score final et explication des erreurs
- Enregistrement du résultat dans Firestore

### 🔹 Phase 5 : Progression
- Récupérer les résultats utilisateur
- Afficher l’historique sous forme de liste
- Graphe d’évolution avec Chart.js ou équivalent

### 🔹 Phase 6 : Coach IA
- API route Edge (`runtime = 'edge'`) pour appeler OpenAI
- Composant de chat avec historique local
- Stockage optionnel des prompts/réponses dans Firestore

---

## ✨ À venir

- Création de fiches via interface admin
- Gestion des erreurs typiques PPL et explications
- Ajout de badges, récompenses, niveaux

---

**Let’s fly.** 🛫


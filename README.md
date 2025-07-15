# LOCAPIC 📍

Une application mobile permettant aux utilisateurs de sauvegarder et gérer leurs lieux favoris sur une carte.

## 🎯 Fonctionnalités

* **Authentification Utilisateur**
  * Authentification simple basée sur un pseudo
* **Carte Interactive**
  * Visualisation des lieux sauvegardés et de la position actuelle
* **Gestion des Lieux**
  * Ajout de lieux par recherche de ville
  * Ajout de lieux par appui long sur la carte
  * Suppression des lieux sauvegardés
* **Localisation en Temps Réel**
  * Suivi de la position de l'utilisateur sur la carte

## 🛠️ Stack Technique

### Frontend
* React Native avec Expo
* Redux pour la gestion d'état
* React Navigation pour le routage
* React Native Maps pour l'intégration de la carte
* Expo Location pour les services de géolocalisation

### Backend
* Node.js avec Express
* MongoDB avec Mongoose
* Architecture API RESTful
* Support de déploiement Vercel

## 📁 Structure du Projet

### Frontend
```
locapicfrontend/
├── screens/
│   ├── HomeScreen.js    # Écran de connexion
│   ├── MapScreen.js     # Vue carte avec marqueurs
│   └── PlacesScreen.js  # Liste des lieux sauvegardés
├── reducers/
│   └── user.js          # Gestion d'état Redux
└── App.js               # Composant principal
```

### Backend
```
locapicbackend/
├── routes/
│   └── places.js        # Points d'accès API
├── models/
│   ├── connection.js    # Connexion base de données
│   └── places.js        # Schéma des lieux
└── app.js              # Configuration Express
```

## 🔌 Points d'Accès API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/places` | Ajouter un nouveau lieu |
| GET | `/places/:nickname` | Récupérer tous les lieux d'un utilisateur |
| DELETE | `/places` | Supprimer un lieu |

## 🚀 Installation et Configuration

1. Cloner le dépôt
```bash
git clone [URL_DU_REPO]
```

2. Installer les dépendances
```bash
# Frontend
cd locapicfrontend
npm install

# Backend
cd locapicbackend
npm install
```

3. Créer les fichiers `.env`
```env
# Frontend .env
API_URL=votre_url_api

# Backend .env
CONNECTION_STRING=votre_connexion_mongodb
PORT=3000
```

4. Démarrer les serveurs
```bash
# Frontend
npm start

# Backend
npm start
```

## 📱 Lancement de l'Application

* Utiliser l'application Expo Go sur votre appareil mobile
  * Scanner le QR code généré
* Ou utiliser un simulateur Android/iOS
  * Presser 'a' pour Android
  * Presser 'i' pour iOS

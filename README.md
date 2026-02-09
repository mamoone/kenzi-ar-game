# 🎮 Chasse au Trésor en Réalité Augmentée

Un jeu éducatif de chasse au trésor en réalité augmentée (AR) pour les étudiants, utilisant des markers imprimés. 100% client-side, sans backend ni base de données.

## 📋 Fonctionnalités

### Pour les étudiants
- ✅ Saisie du prénom avec prononciation vocale (Text-to-Speech)
- ✅ Détection de markers AR imprimés via la caméra
- ✅ Questions interactives (QCM, équations, texte libre)
- ✅ Feedback immédiat avec sons
- ✅ Système de score et progression
- ✅ Interface ludique et adaptée aux enfants

### Pour les enseignants (Mode Admin)
- ✅ Ajouter/Modifier/Supprimer des questions
- ✅ Associer chaque question à un marker spécifique
- ✅ Choisir le type de question (QCM, équation, texte)
- ✅ Exporter/Importer les données
- ✅ Stockage local (localStorage)

## 🚀 Installation et Lancement

### Prérequis
- Un serveur web local (les fichiers doivent être servis via HTTP/HTTPS)
- Un navigateur moderne (Chrome, Firefox, Safari)
- Une caméra (smartphone ou webcam)
- Markers AR imprimés

### Méthode 1: Serveur Python (Recommandé)
```bash
# Dans le dossier du projet
python3 -m http.server 8000
```
Puis ouvrez: `http://localhost:8000`

### Méthode 2: Live Server (VS Code)
1. Installez l'extension "Live Server" dans VS Code
2. Clic droit sur `index.html` → "Open with Live Server"

### Méthode 3: Node.js
```bash
npx http-server -p 8000
```

## 📱 Utilisation en Classe

### Étape 1: Préparer les Markers
1. Visitez: https://au.gmented.com/app/marker/marker.php
2. Sélectionnez "Barcode"
3. Générez les markers avec les numéros 0, 1, 2, 3, etc.
4. Imprimez les markers sur papier (format A5 ou A4)
5. Plastifiez-les si possible pour plus de durabilité

### Étape 2: Configurer les Questions (Mode Admin)
1. Ouvrez le jeu dans un navigateur
2. Cliquez sur "Mode Admin"
3. Ajoutez vos questions:
   - Choisissez un numéro de marker (0-63)
   - Sélectionnez le type de question
   - Entrez la question et la réponse correcte
   - Pour les QCM, ajoutez plusieurs choix
   - Définissez les points
4. Cliquez sur "Sauvegarder"

### Étape 3: Lancer le Jeu avec les Étudiants
1. Distribuez les markers dans la classe ou créez un parcours
2. Les étudiants ouvrent le jeu sur leur smartphone/tablette
3. Ils entrent leur prénom
4. Ils scannent les markers avec la caméra
5. Ils répondent aux questions qui apparaissent
6. Le score s'affiche en temps réel

## 🎯 Exemples de Scénarios Pédagogiques

### Mathématiques
- Marker 0: Addition simple (5 + 3 = ?)
- Marker 1: Soustraction (12 - 7 = ?)
- Marker 2: Multiplication (4 × 6 = ?)
- Marker 3: Division (20 ÷ 5 = ?)

### Géographie
- Marker 0: Capitale de la France
- Marker 1: Plus grand océan
- Marker 2: Continent le plus peuplé
- Marker 3: Plus haute montagne

### Sciences
- Marker 0: Planète la plus proche du Soleil
- Marker 1: Nombre de pattes d'une araignée
- Marker 2: État de l'eau à 100°C
- Marker 3: Organe qui pompe le sang

## 🛠️ Structure du Projet

```
KENZI/
├── index.html          # Page principale du jeu
├── admin.html          # Interface d'administration
├── game.js            # Logique du jeu étudiant
├── admin.js           # Logique du panneau admin
├── styles.css         # Styles CSS
├── README.md          # Ce fichier
└── markers/           # Dossier pour vos markers imprimés (à créer)
```

## 💾 Gestion des Données

### Stockage
Toutes les données sont stockées dans le **localStorage** du navigateur:
- Questions et réponses
- Configuration des markers
- Pas de serveur nécessaire

### Export/Import
- **Exporter**: Sauvegarde toutes les questions dans un fichier JSON
- **Importer**: Charge des questions depuis un fichier JSON
- Utile pour partager des questions entre enseignants

### Réinitialisation
Le bouton "Réinitialiser tout" supprime toutes les données (avec confirmation).

## 📝 Types de Questions

### 1. QCM (Choix Multiples)
- Affiche plusieurs boutons avec les choix
- L'étudiant clique sur sa réponse
- Idéal pour: géographie, sciences, culture générale

### 2. Équation Mathématique
- Affiche un champ de saisie
- L'étudiant tape sa réponse numérique
- Idéal pour: calculs, mathématiques

### 3. Texte Libre
- Affiche un champ de saisie
- L'étudiant tape sa réponse en texte
- Idéal pour: orthographe, vocabulaire

## 🎨 Personnalisation

### Modifier les Couleurs
Éditez `styles.css` et changez les couleurs principales:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modifier les Points
Dans le mode Admin, vous pouvez attribuer différents points par question (1-100).

### Ajouter des Sons
Le jeu utilise le Text-to-Speech du navigateur. Les messages sont automatiquement prononcés en français.

## 🔧 Dépannage

### La caméra ne s'active pas
- Vérifiez que vous utilisez HTTPS ou localhost
- Autorisez l'accès à la caméra dans les paramètres du navigateur
- Sur iOS: utilisez Safari (Chrome iOS ne supporte pas WebRTC)

### Les markers ne sont pas détectés
- Assurez-vous que les markers sont bien imprimés (bonne qualité)
- Éclairage suffisant
- Tenez le marker à 20-30 cm de la caméra
- Le marker doit être bien visible et à plat

### Les questions ne s'affichent pas
- Vérifiez que vous avez bien créé des questions dans le mode Admin
- Vérifiez que le numéro du marker correspond à une question
- Ouvrez la console du navigateur (F12) pour voir les erreurs

### Le son ne fonctionne pas
- Vérifiez le volume de l'appareil
- Sur mobile: désactivez le mode silencieux
- Certains navigateurs nécessitent une interaction utilisateur avant de jouer des sons

## 🌐 Compatibilité

### Navigateurs Desktop
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ⚠️ Safari 14+ (support limité)

### Navigateurs Mobile
- ✅ Chrome Android 90+
- ✅ Safari iOS 14+
- ⚠️ Chrome iOS (utiliser Safari à la place)

## 📚 Technologies Utilisées

- **A-Frame 1.4.2**: Framework WebXR
- **AR.js**: Bibliothèque de réalité augmentée
- **Web Speech API**: Text-to-Speech
- **localStorage**: Stockage des données
- **Vanilla JavaScript**: Pas de framework lourd
- **CSS3**: Animations et design moderne

## 🎓 Conseils Pédagogiques

### Préparation
1. Testez le jeu avant la classe
2. Préparez 5-10 questions adaptées au niveau
3. Imprimez et plastifiez les markers
4. Prévoyez des appareils de secours

### Pendant la Classe
1. Expliquez les règles (5 min)
2. Faites une démonstration (5 min)
3. Laissez les étudiants jouer (20-30 min)
4. Débriefing et correction (10 min)

### Variantes
- **Mode Compétition**: Qui a le meilleur score?
- **Mode Équipe**: Groupes de 2-3 étudiants
- **Mode Parcours**: Markers cachés dans la classe
- **Mode Progressif**: Débloquer les markers dans l'ordre

## 🔒 Sécurité et Confidentialité

- ✅ Aucune donnée n'est envoyée sur Internet
- ✅ Tout fonctionne en local
- ✅ Pas de collecte de données personnelles
- ✅ Les prénoms ne sont pas sauvegardés
- ✅ Conforme RGPD

## 📞 Support

Pour toute question ou problème:
1. Consultez la section Dépannage ci-dessus
2. Vérifiez la console du navigateur (F12)
3. Testez avec un autre navigateur/appareil

## 📄 Licence

Ce projet est libre d'utilisation pour un usage éducatif.

## 🎉 Améliorations Futures Possibles

- [ ] Mode multijoueur en temps réel
- [ ] Statistiques détaillées par étudiant
- [ ] Thèmes visuels personnalisables
- [ ] Support de vidéos et images dans les questions
- [ ] Mode hors-ligne complet (PWA)
- [ ] Classement et badges
- [ ] Timer par question
- [ ] Indices progressifs

---

**Bon jeu et bon apprentissage! 🎮📚**

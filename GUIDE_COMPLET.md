# 🦊 KENZI - Guide Complet

## 📖 Table des Matières

1. [Démarrage Rapide](#démarrage-rapide)
2. [Comment Fonctionne l'Animation AR](#comment-fonctionne-lanimation-ar)
3. [Créer des Questions](#créer-des-questions)
4. [Générer les Marqueurs](#générer-les-marqueurs)
5. [Organiser un Trajet en Classe](#organiser-un-trajet-en-classe)
6. [Jouer](#jouer)

---

## 🚀 Démarrage Rapide

### Lancer le Jeu

```bash
cd /Users/mamoune/Desktop/KENZI
python3 -m http.server 8000
```

Ouvrir: **http://localhost:8000**

---

## 🎯 Comment Fonctionne l'Animation AR

### L'Animation 3D sur le Marqueur

Quand vous scannez un marqueur, **une animation 3D apparaît DESSUS** :

```
┌─────────────────────────────────────┐
│                                     │
│  📱 VUE DE LA CAMÉRA                │
│                                     │
│     ┌─────────────────┐             │
│     │  MARQUEUR       │             │
│     │  IMPRIMÉ        │             │
│     │  (sur table)    │             │
│     │                 │             │
│     │  ┌───────────┐  │ ← Animation 3D
│     │  │  ⭐ السؤال│  │   flotte AU-DESSUS
│     │  │  Question│  │   du marqueur
│     │  │     1    │  │             │
│     │  └───────────┘  │             │
│     └─────────────────┘             │
│                                     │
└─────────────────────────────────────┘
```

### Ce Qui Se Passe Techniquement

#### Étape 1: Création de l'Animation (lignes 226-251)

```javascript
// Un carré bleu qui flotte
const plane = document.createElement('a-plane');
plane.setAttribute('color', '#667eea');  // Bleu
plane.setAttribute('width', '1');        // 1 mètre virtuel
plane.setAttribute('opacity', '0.8');    // Semi-transparent

// Texte "السؤال 1" dessus
const text = document.createElement('a-text');
text.setAttribute('value', `السؤال ${question.markerId + 1}`);
text.setAttribute('color', '#ffffff');   // Blanc

// Une étoile ⭐ au-dessus
const icon = document.createElement('a-image');
icon.setAttribute('src', '#star-img');

// Tout ça est attaché au marqueur
marker.appendChild(plane);
marker.appendChild(text);
marker.appendChild(icon);
```

#### Étape 2: Détection (ligne 256)

```javascript
marker.addEventListener('markerFound', () => {
    // Quand le marqueur est détecté:
    // 1. L'animation 3D apparaît sur le marqueur
    // 2. La question s'affiche en bas de l'écran
    this.onMarkerFound(question);
});
```

### Visualisation Complète

```
AVANT LE SCAN:
┌──────────────────┐
│ 📱 Caméra        │
│                  │
│  [Table vide]    │
│                  │
└──────────────────┘

PENDANT LE SCAN:
┌──────────────────┐
│ 📱 Caméra        │
│                  │
│  ┌────────────┐  │
│  │ Marqueur 0 │  │ ← Papier imprimé
│  │            │  │
│  │  ┌──────┐  │  │
│  │  │ ⭐   │  │  │ ← Animation 3D flotte
│  │  │السؤال│  │  │   au-dessus du papier
│  │  │  1   │  │  │
│  │  └──────┘  │  │
│  └────────────┘  │
│                  │
│ ┌──────────────┐ │
│ │ Question:    │ │ ← Panel en bas
│ │ 5 + 3 = ?    │ │
│ └──────────────┘ │
└──────────────────┘
```

**Important:** L'animation 3D est **virtuelle** - elle n'existe que dans la caméra, pas dans la réalité !

---

## 📝 Créer des Questions

### Dans l'Admin

1. Cliquez "⚙️ لوحة التحكم"
2. Remplissez:

```
🎯 Numéro: 0
❓ Question: كم يساوي 5 + 3 ؟
📋 Réponses: 6, 7, 8, 9
✅ Correcte: 8
⭐ Points: 10
```

3. Cliquez "💾 حفظ"

### Créez 3-5 Questions pour Commencer

```
Question 0 → Facile (pour démarrer)
Question 1 → Moyenne
Question 2 → Moyenne
Question 3 → Plus difficile
```

---

## 🎯 Générer les Marqueurs

### Méthode Simple (Barcode)

1. **Allez sur:** https://au.gmented.com/app/marker/marker.php
2. **Type:** Barcode
3. **Value:** 0 (puis 1, 2, 3...)
4. **Téléchargez** chaque marqueur
5. **Imprimez** en A5

Vous aurez:
```
marker-0.png → Pour question 0
marker-1.png → Pour question 1
marker-2.png → Pour question 2
```

---

## 🗺️ Organiser un Trajet en Classe

### Option 1: Trajet Linéaire Simple

**Disposition:**
```
ENTRÉE DE LA CLASSE
    ↓
    📍 Marqueur 0 (sur le bureau de l'enseignant)
    ↓ (flèche au sol ou panneau)
    📍 Marqueur 1 (sur le mur gauche)
    ↓ (flèche au sol)
    📍 Marqueur 2 (sur le tableau)
    ↓ (flèche au sol)
    📍 Marqueur 3 (sur le mur droit)
    ↓
SORTIE
```

**Matériel nécessaire:**
- 4 marqueurs imprimés et plastifiés
- Flèches au sol (scotch coloré)
- Panneaux "Question suivante →"

### Option 2: Chasse au Trésor avec Indices

**Disposition:**
```
START: Marqueur 0 visible à l'entrée
       ↓
       Indice: "Cherche près de la fenêtre"
       ↓
       Marqueur 1 (caché près de la fenêtre)
       ↓
       Indice: "Le prochain est sur quelque chose de vert"
       ↓
       Marqueur 2 (sur plante ou tableau vert)
       ↓
       Indice: "Regarde en haut!"
       ↓
       Marqueur 3 (sur le mur en hauteur)
```

### Option 3: Stations par Tables

**Disposition:**
```
┌─────────────────────────────────┐
│  CLASSE                         │
│                                 │
│  Table 1      Table 2           │
│  📍 M0        📍 M1             │
│                                 │
│  Table 3      Table 4           │
│  📍 M2        📍 M3             │
│                                 │
│  [Tableau]                      │
└─────────────────────────────────┘
```

Les élèves tournent entre les tables.

### Guide Visuel pour les Élèves

**Créez des panneaux:**

```
┌─────────────────────────┐
│  🦊 KENZI DIT:          │
│                         │
│  1️⃣ Commence ici! →    │
│     (Marqueur 0)        │
│                         │
│  2️⃣ Puis va là →       │
│     (Marqueur 1)        │
│                         │
│  3️⃣ Ensuite ici →      │
│     (Marqueur 2)        │
│                         │
│  4️⃣ Finis là! →        │
│     (Marqueur 3)        │
└─────────────────────────┘
```

### Matériel à Préparer

**Pour un trajet clair:**
- [ ] Marqueurs imprimés et numérotés au dos
- [ ] Flèches directionnelles (scotch coloré ou papier)
- [ ] Panneaux "Question 1 →", "Question 2 →"
- [ ] Carte du trajet affichée au tableau
- [ ] (Optionnel) Indices écrits pour chasse au trésor

---

## 🎮 Jouer

### Pour l'Élève

#### 1. Ouvrir le Jeu
```
http://[IP-serveur]:8000
```

#### 2. Entrer le Nom
```
┌─────────────────┐
│ 🦊 KENZI        │
│ مرحباً!         │
│                 │
│ [Ahmed____]     │
│                 │
│ [🚀 ابدأ]      │
└─────────────────┘
```

#### 3. Lire les Instructions
```
┌─────────────────────┐
│ كيف تلعب؟          │
│                     │
│ 1️⃣ وجّه الكاميرا   │
│ 2️⃣ ابحث عن M0     │
│ 3️⃣ أجب على السؤال │
│ 4️⃣ اجمع النقاط    │
│                     │
│ [✨ ابدأ المسح]    │
└─────────────────────┘
```

#### 4. Suivre le Trajet

**L'indicateur montre:**
```
┌─────────────────────┐
│ 🎯 ابحث عن        │
│    العلامة رقم 0   │
│        👇          │
└─────────────────────┘
```

**L'élève:**
1. Suit les flèches/panneaux
2. Trouve le Marqueur 0
3. Scanne avec la caméra
4. Voit l'animation 3D sur le marqueur
5. Répond à la question
6. L'indicateur change: "ابحث عن العلامة رقم 1"
7. Continue le trajet!

#### 5. Scanner

**Distance:** 20-30 cm
**Position:** Marqueur bien à plat
**Éclairage:** Bon éclairage
**Stabilité:** Tenir le téléphone stable

```
     📱 Caméra
      ↓ 20-30cm
    ┌─────┐
    │ M0  │ ← Marqueur sur table
    └─────┘
```

#### 6. Voir l'Animation

```
┌──────────────────┐
│ 📱 VUE           │
│                  │
│   ┌─────────┐    │
│   │ Marqueur│    │
│   │         │    │
│   │  ⭐     │ ← Animation 3D
│   │ السؤال  │    apparaît!
│   │   1     │    │
│   └─────────┘    │
│                  │
│ ┌────────────┐   │
│ │ Question:  │   │ ← Panel
│ │ 5+3=?      │   │
│ └────────────┘   │
└──────────────────┘
```

#### 7. Répondre

```
┌──────────────────┐
│ كم يساوي 5+3 ؟  │
│                  │
│ ┌──┐  ┌──┐      │
│ │6 │  │7 │      │
│ └──┘  └──┘      │
│ ┌──┐  ┌──┐      │
│ │8 │  │9 │      │
│ └──┘  └──┘      │
└──────────────────┘
```

Cliquez sur **8**

#### 8. Célébration!

```
┌──────────────────┐
│   🎉🎉🎉        │
│                  │
│    🦊 (géant)    │
│                  │
│ رائع Ahmed!      │
│ +10 نقطة        │
│                  │
│ ✨ Confettis ✨  │
└──────────────────┘
```

#### 9. Prochain Marqueur

```
┌──────────────────┐
│ 🎯 ابحث عن      │
│   العلامة رقم 1  │
│       👇         │
└──────────────────┘
```

**Suivez les flèches vers le Marqueur 1!**

---

## 🔑 Points Clés à Retenir

### 1. L'Animation AR

- ✅ Apparaît **sur le marqueur** quand vous le scannez
- ✅ C'est une **image 3D virtuelle** (pas réelle)
- ✅ Visible uniquement **dans la caméra**
- ✅ Contient: carré bleu + texte + étoile

### 2. Le Lien Question-Marqueur

```
Numéro dans Admin = Numéro sur Marqueur Imprimé
        ↓                      ↓
    Question 0          Barcode Value: 0
        ↓                      ↓
        └──────── LIÉS ────────┘
```

### 3. Le Trajet

- ✅ Créez un **chemin clair** avec flèches
- ✅ Numérotez dans l'**ordre** (0, 1, 2, 3)
- ✅ Ajoutez des **panneaux** indicateurs
- ✅ L'indicateur du jeu **guide** l'élève

### 4. L'Expérience Complète

```
Élève → Suit trajet → Trouve marqueur → Scanne
   ↓
Animation 3D apparaît sur marqueur
   ↓
Question s'affiche en bas
   ↓
Élève répond
   ↓
Célébration + Indicateur du prochain marqueur
   ↓
Élève continue le trajet!
```

---

## 🛠️ Exemple Complet: Cours de Math

### Préparation (20 min)

**1. Créer 4 questions dans l'admin:**
```
Q0: 2+2=? → Marqueur 0
Q1: 5+3=? → Marqueur 1
Q2: 10-4=? → Marqueur 2
Q3: 7+8=? → Marqueur 3
```

**2. Générer et imprimer 4 marqueurs**

**3. Créer le trajet:**
```
ENTRÉE
  ↓ (flèche bleue au sol)
📍 M0 sur bureau prof
  ↓ (flèche verte)
📍 M1 sur mur gauche
  ↓ (flèche jaune)
📍 M2 sur tableau
  ↓ (flèche rouge)
📍 M3 sur mur droit
  ↓
SORTIE
```

**4. Afficher la carte au tableau:**
```
┌─────────────────────┐
│ TRAJET DE KENZI     │
│                     │
│ START → M0 (bleu)   │
│    ↓                │
│    M1 (vert)        │
│    ↓                │
│    M2 (jaune)       │
│    ↓                │
│    M3 (rouge)       │
│    ↓                │
│  FINISH! 🏆        │
└─────────────────────┘
```

### Pendant le Cours (30 min)

**1. Introduction (5 min)**
- Expliquer le jeu
- Montrer le trajet
- Démonstration avec un élève

**2. Jeu (20 min)**
- Élèves jouent individuellement ou en binômes
- Suivent le trajet coloré
- Scannent les marqueurs dans l'ordre
- Répondent aux questions

**3. Débriefing (5 min)**
- Qui a le meilleur score?
- Quelles questions étaient difficiles?
- Célébration collective!

---

## 🆘 Dépannage

### "L'animation n'apparaît pas"

**Vérifiez:**
- [ ] Bon éclairage
- [ ] Distance 20-30 cm
- [ ] Marqueur bien à plat
- [ ] Caméra autorisée
- [ ] Marqueur imprimé en bonne qualité

### "Je ne sais pas où aller"

**Solutions:**
- Ajoutez plus de flèches au sol
- Créez une carte visible
- Numérotez les marqueurs au dos
- Ajoutez des panneaux indicateurs

### "Mauvaise question s'affiche"

**Cause:** Mauvais numéro de marqueur

**Solution:** Vérifiez que le numéro dans l'admin correspond au marqueur scanné

---

## ✅ Checklist Complète

### Avant la Classe:
- [ ] Questions créées (0, 1, 2, 3...)
- [ ] Marqueurs générés et imprimés
- [ ] Trajet créé avec flèches/panneaux
- [ ] Carte du trajet affichée
- [ ] Serveur lancé et testé
- [ ] Un appareil de test fonctionnel

### Pendant la Classe:
- [ ] Élèves accèdent au jeu
- [ ] Élèves entrent leur nom
- [ ] Élèves lisent les instructions
- [ ] Élèves suivent le trajet
- [ ] Élèves scannent dans l'ordre
- [ ] Animations apparaissent
- [ ] Questions s'affichent
- [ ] Célébrations fonctionnent

### Après la Classe:
- [ ] Récupérer les marqueurs
- [ ] Ranger le matériel
- [ ] Noter les améliorations possibles

---

## 🎉 Résumé Simple

### En 3 Points:

1. **L'Animation AR** = Image 3D virtuelle qui flotte sur le marqueur imprimé (visible dans la caméra)

2. **Le Trajet** = Chemin avec flèches/panneaux que les élèves suivent pour trouver les marqueurs dans l'ordre

3. **Le Jeu** = Scanner marqueur → Voir animation → Répondre question → Suivre indicateur vers prochain marqueur

**C'est tout! Simple et amusant! 🦊✨**

---

**Version:** 3.2 - Guide Unique Complet
**Date:** Février 2026
**Statut:** ✅ Prêt à l'emploi

# The Long Orbit — First Playable Loop (v1)

Ce document définit la première boucle de gameplay **jouable** de The Long Orbit.
Il constitue un contrat de conception pour la v1 et a pour objectif unique :
**rendre le jeu jouable rapidement**, sans bloquer les évolutions futures.

---

## 🎯 Objectif de la v1

- Permettre à un joueur de prendre des décisions à chaque tour
- Observer des conséquences claires et mesurables
- Terminer une partie avec une condition de victoire simple
- Valider le moteur et la boucle de jeu, pas l’équilibrage

---

## ⏱️ Structure d’une partie

- Jeu au tour par tour asynchrone
- 1 tour = 24h (configurable)
- Durée d’une partie : 30 tours
- Une galaxie par partie
- Une faction par joueur
- IA utilisée pour compléter si nécessaire

---

## 🔁 Boucle de jeu par tour

À chaque tour, le joueur :

1. Consulte son état (systèmes, ressources, flottes)
2. Choisit **UNE action majeure**
3. Valide ses intentions
4. Attend la résolution du tour
5. Observe les résultats au tour suivant

---

## 🎮 Actions majeures disponibles (1 par tour)

### A — Développer (Économie)
- Construire une structure
- Effet différé (structure active au tour suivant)

### B — Explorer
- Déplacer une flotte vers un système neutre
- Prise de contrôle automatique (v1)

### C — Attaquer
- Envoyer une flotte vers un système ennemi
- Combat automatique déterministe
- Le vainqueur contrôle le système

---

## 💰 Ressources (v1)

### 🔩 Metal
- Production :
  - +1 metal par système contrôlé
  - +1 metal par mine construite
- Usage :
  - constructions
  - flottes
  - actions majeures

### ⚡ Energy
- Production :
  - +1 energy par système contrôlé
- Rôle :
  - contrainte passive
  - limite le nombre d’éléments actifs
- Pas de structure dédiée en v1

---

## 🏭 Structures (v1)

### Mine
- Coût : 5 metal
- Effet : +1 metal / tour
- Temps de construction : 1 tour
- Une seule structure disponible en v1

---

## 🛸 Flottes & combats (v1)

- Flottes abstraites (force entière)
- Combat déterministe :
  - force la plus élevée gagne
  - égalité = défense gagnante
- Pas de RNG en v1

---

## 🏁 Condition de victoire (v1)

- Fin automatique au tour 30
- Le joueur contrôlant le plus de systèmes remporte la partie

---

## 🔒 Portée de ce document

- Ces règles sont **figées pour la v1 jouable**
- Elles ne constituent pas le design final du jeu
- Toute évolution future devra :
  - respecter le moteur existant
  - étendre ces règles sans refonte

Ce document sert de référence unique pour l’implémentation gameplay de la v1.

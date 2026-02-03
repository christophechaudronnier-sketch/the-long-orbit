# The Long Orbit — Turn Engine v0.1

## Principe fondamental
Le Turn Engine est le chef d’orchestre du moteur de jeu.

- Il est le seul composant autorisé à écrire dans le GameState
- Il ne contient aucune règle métier spécifique (combat, économie, recherche…)
- Il applique strictement les effets calculés par les modules

Le Turn Engine garantit la cohérence, le déterminisme et la rejouabilité du jeu.

---

## Rôle du Turn Engine

- Orchestrer le déroulement complet d’un tour
- Geler et valider les intentions
- Appeler les modules dans un ordre immuable
- Appliquer les deltas retournés par les modules
- Gérer la RNG déterministe (seed)
- Écrire les logs
- Clôturer le tour

---

## Règle d’écriture

> Un seul composant écrit dans le GameState : le Turn Engine

Tous les autres modules :
- lisent le GameState
- calculent des effets
- retournent des deltas

Le Turn Engine est responsable de leur application.

---

## Ordre immuable des phases (MVP)

L’ordre des phases est intangible et ne doit jamais être modifié, même lors de l’ajout de fonctionnalités.

1. Pré-contrôles
2. Collecte & validation des intentions
3. Économie
4. Recherche
5. Déplacements
6. Combats
7. Événements
8. Scoring & conditions de fin
9. Logs & historique
10. Clôture du tour

---

## Description des phases

### 1. Pré-contrôles
**Objectif** : vérifier que le tour peut s’exécuter.

- Vérification de l’état de l’instance
- Vérification de la cohérence minimale du GameState
- Toute faction sans intention est considérée comme ayant une intention vide

**Écriture GameState** : ❌ interdite

---

### 2. Collecte & validation des intentions
**Objectif** : figer les intentions du tour.

- Récupération des intentions joueurs et IA
- Validation structurelle et contextuelle
- Refus explicite des intentions invalides (loggées)
- Gel définitif des intentions pour le tour

**Écriture GameState** : ✅ intentions uniquement

---

### 3. Économie
**Objectif** : appliquer la production et la consommation.

- Appel du module Économie
- Réception des ResourceDelta
- Application centralisée des deltas

**Écriture GameState** : ✅ ressources uniquement

---

### 4. Recherche
**Objectif** : faire progresser les technologies.

- Appel du module Recherche
- Réception des ResearchDelta
- Mise à jour des états technologiques

**Écriture GameState** : ✅ technologies uniquement

---

### 5. Déplacements
**Objectif** : résoudre les mouvements de flottes.

- Appel du module Déplacements
- Réception des MovementDelta
- Mise à jour des localisations

Aucun combat n’est résolu à cette phase.

**Écriture GameState** : ✅ flottes uniquement

---

### 6. Combats
**Objectif** : résoudre les affrontements.

- Appel du module Combat
- Utilisation d’une RNG déterministe (seed du tour)
- Réception des CombatDelta
- Application des pertes et destructions

**Écriture GameState** : ✅ flottes / contrôle territorial

---

### 7. Événements
**Objectif** : appliquer les événements galactiques.

- Appel du module Événements
- Événements dépendants du contexte et du seed

**Écriture GameState** : variable selon l’événement

---

### 8. Scoring & conditions de fin
**Objectif** : vérifier les conditions de victoire et d’élimination.

- Vérification des factions éliminées
- Vérification des conditions de fin de partie
- Mise à jour du statut de l’instance si nécessaire

**Écriture GameState** : ✅ instance / factions

---

### 9. Logs & historique
**Objectif** : écrire les traces lisibles du tour.

- Logs détaillés (techniques)
- Résumés lisibles (joueurs)
- Aucune influence gameplay

**Écriture GameState** : ✅ logs uniquement

---

### 10. Clôture du tour
**Objectif** : finaliser le tour.

- Incrémentation du compteur de tours
- Mise à jour du timestamp
- Préparation du seed du prochain tour

**Écriture GameState** : ✅ instance uniquement

---

## Gestion de la RNG

- Une seed par tour
- Seed stockée dans le GameState
- Toutes les RNG des modules dérivent de cette seed
- Garantit rejouabilité et débogage

---

## Garanties offertes

Le Turn Engine garantit :

- Un moteur déterministe et serveur-autoritaire
- Une architecture extensible sans refonte
- Une séparation stricte entre état, règles et orchestration

Ce document constitue un contrat d’architecture pour le moteur de The Long Orbit.

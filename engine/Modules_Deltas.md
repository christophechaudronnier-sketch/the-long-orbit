# The Long Orbit — Modules & Deltas v0.1

## Principe fondamental
Les modules ne modifient jamais directement le GameState.

- Ils lisent le GameState
- Ils calculent des effets selon leurs règles propres
- Ils retournent des deltas

Le Turn Engine est le seul composant autorisé à appliquer ces deltas.

---

## Règle globale d’architecture

> Modules calculent, moteur applique.

Cette règle est non négociable et garantit :
- une architecture serveur-autoritaire
- une extensibilité sans refonte
- un débogage ciblé et lisible

---

## Qu’est-ce qu’un Delta ?

Un delta est une proposition de modification du GameState.

Un delta :
- est déterministe (à seed égale)
- ne contient aucun calcul
- décrit uniquement quoi modifier, jamais comment

Le Turn Engine décide :
- d’appliquer
- d’ordonner
- de refuser

---

## Cycle de vie d’un delta

1. Lecture du GameState par un module  
2. Calcul interne du module  
3. Génération d’un ou plusieurs deltas  
4. Retour des deltas au Turn Engine  
5. Validation structurelle  
6. Application au GameState  
7. Écriture des logs  

---

## Deltas du MVP

### ResourceDelta
**Rôle** : modifier les ressources d’une faction.

Contenu typique :
- factionId
- resourceKey
- amount (+/-)
- source (économie, événement, combat)

---

### ResearchDelta
**Rôle** : faire progresser une technologie.

Contenu typique :
- factionId
- techId
- progressDelta
- levelUp (bool)

---

### MovementDelta
**Rôle** : déplacer une flotte.

Contenu typique :
- fleetId
- fromSystemId
- toSystemId

---

### CombatDelta
**Rôle** : appliquer les résultats d’un combat.

Contenu typique :
- fleetId
- strengthDelta
- destroyed (bool)
- controlChange (optionnel)

---

### ControlDelta
**Rôle** : modifier le contrôle territorial.

Contenu typique :
- systemId
- previousOwnerFactionId
- newOwnerFactionId

---

## Responsabilités par module (MVP)

### Module Économie
- Génère des ResourceDelta
- Ne connaît pas les autres modules

---

### Module Recherche
- Génère des ResearchDelta
- Ne déclenche aucun bonus direct

---

### Module Déplacements
- Génère des MovementDelta
- Ne résout aucun combat

---

### Module Combat
- Génère des CombatDelta et ControlDelta
- Utilise une RNG déterministe

---

### Module IA
- Génère des Intentions
- N’écrit aucun delta directement

---

## Règles strictes

- Un module ne peut générer que ses propres deltas
- Aucun module ne peut lire les deltas d’un autre
- Aucun delta ne peut modifier plusieurs blocs du GameState

---

## Garanties offertes

Cette architecture garantit :
- Ajout de fonctionnalités par nouveaux deltas
- Débogage précis par phase et par module
- Séparation claire entre état, règles et orchestration

Ce document constitue un contrat d’architecture pour les modules du moteur de The Long Orbit.

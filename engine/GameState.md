# The Long Orbit — GameState v0.1

## Principe fondamental
Le GameState représente exclusivement l’état du jeu à un instant donné.

- Il ne contient aucune logique métier
- Il ne contient aucun calcul
- Il ne contient aucune règle

Toute logique est externalisée dans le Turn Engine et les modules.

---

## Objectifs du GameState

- Être serveur-autoritaire
- Être extensible sans refonte
- Être lisible, testable et sérialisable
- Supporter plusieurs instances indépendantes

---

## Structure globale

Le GameState est composé des blocs suivants :

1. Instance
2. Factions
3. Systems
4. Resources
5. Technologies
6. Fleets
7. Intentions
8. Logs

Chaque bloc est indépendant, faiblement couplé et strictement limité dans ses responsabilités.

---

## 1. Instance

### Rôle
Décrire l’état global d’une instance de jeu.

### Contenu
- instanceId
- status (active | paused | finished)
- currentTurn
- maxTurns
- seed
- createdAt
- lastTurnAt

### Interdictions
- Aucune règle de victoire
- Aucune logique de passage de tour
- Aucun calcul temporel

### Notes
- Le seed est mis à jour uniquement par le Turn Engine
- Une instance est totalement indépendante des autres

---

## 2. Factions

### Rôle
Représenter les factions de la partie (humaines ou IA).

### Contenu
- factionId
- type (human | ai)
- status (active | inactive | eliminated)
- playerId (nullable)
- controlledSystems[]
- createdAt

### Interdictions
- Aucune logique d’inactivité
- Aucun score calculé
- Aucun bonus ou règle implicite

### Notes
- Une faction n’est pas strictement équivalente à un joueur
- L’élimination est un état, jamais une action

---

## 3. Systems

### Rôle
Représenter la carte galactique et le contrôle territorial.

### Contenu
- systemId
- ownerFactionId (nullable)
- position
- structures[]
- connectedSystems[]

### Interdictions
- Aucun calcul de distance
- Aucune règle de conquête
- Aucun combat

---

## 4. Resources

### Rôle
Stocker les ressources brutes par faction.

### Contenu
- factionId
- resources (clé / valeur)
  - exemples : metal, energy, science

### Interdictions
- Aucune production
- Aucune consommation
- Aucun plafond ou règle économique

---

## 5. Technologies

### Rôle
Décrire l’état de progression technologique d’une faction.

### Contenu
- factionId
- technologies[]
  - techId
  - level
  - progress

### Interdictions
- Aucun bonus appliqué
- Aucune règle de déblocage

---

## 6. Fleets

### Rôle
Représenter les forces militaires mobiles.

### Contenu
- fleetId
- ownerFactionId
- locationSystemId
- strength (abstraite)
- status (idle | moving | destroyed)

### Interdictions
- Aucun calcul de combat
- Aucune notion de vitesse ou de timing

---

## 7. Intentions

### Rôle
Stocker les intentions figées pour un tour donné.

### Contenu
- turn
- factionId
- type
- payload minimal

### Interdictions
- Aucun effet direct
- Aucun résultat attendu

---

## 8. Logs

### Rôle
Tracer l’historique des événements de jeu.

### Contenu
- turn
- entries[]
- visibility (public | faction)

### Interdictions
- Aucun impact gameplay
- Aucune donnée servant de source de vérité

---

## Garantie d’évolution

Toute évolution future du jeu doit respecter les règles suivantes :

- Le GameState ne reçoit que de nouveaux champs, jamais de logique
- Toute règle ou calcul appartient à un module ou au Turn Engine
- Aucune fonctionnalité ne doit nécessiter une refonte du GameState

Ce document constitue un contrat d’architecture pour le moteur de The Long Orbit.

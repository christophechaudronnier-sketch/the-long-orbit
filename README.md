# The Long Orbit (TLO)

The Long Orbit is a turn-based space strategy game,
playable in solo and asynchronous multiplayer.

## Vision
- Server-authoritative game engine
- Honest Free-to-Play (no pay-to-win)
- Multilingual (FR / EN)
- Single game logic, extensible without refactoring

## MVP Scope
- Solo & async multiplayer
- One galaxy per game
- Seasons of fixed length
- Economy, research, fleets, automated combat
- AI factions and events

## Architecture Principles
- GameState contains state only, never logic
- One single Turn Engine writes to the GameState
- Players and AI send intentions, never direct actions
- Game rules isolated in independent modules

## Status
🚧 MVP under active development

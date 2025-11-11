# Eco-Warriors

An educational mobile game about water conservation with African cultural elements, built with Three.js.

## Overview

Eco-Warriors is a fast-paced arcade game where players control a traditional African basket to collect clean water drops while avoiding pollutants. The game teaches environmental awareness through engaging gameplay and celebrates African heritage through authentic visual and audio design.

## Features

- **Three.js WebGL Rendering**: Hardware-accelerated 3D graphics in 2D perspective
- **Mobile-First Design**: Optimized for touch controls and mobile devices
- **Progressive Web App**: Installable with offline support
- **Educational Content**: African proverbs and water conservation facts
- **Cultural Authenticity**: African-inspired patterns, colors, and music
- **Progressive Difficulty**: 10 levels of increasing challenge

## Tech Stack

- **Three.js**: 3D rendering engine
- **Vite**: Fast build tool and dev server
- **Vanilla JavaScript**: No framework dependencies
- **PWA**: Service worker for offline functionality

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
eco-warriors/
├── src/
│   ├── main.js              # Entry point
│   ├── game/                # Core game logic
│   ├── entities/            # Game entities (Basket, WaterDrop, Pollutant)
│   ├── systems/             # Game systems (Collision, Spawner, Score, etc.)
│   ├── rendering/           # Three.js rendering components
│   ├── mobile/              # Mobile optimization (Performance, Battery, Touch)
│   ├── ui/                  # UI management
│   └── utils/               # Utilities (AssetLoader, ObjectPool, etc.)
├── assets/
│   ├── textures/            # Sprite textures
│   ├── audio/               # Music and sound effects
│   └── data/                # Educational content (JSON)
├── styles/
│   └── game.css             # UI styles
└── index.html               # Main HTML file
```

## Development Roadmap

See `tasks.md` for the complete implementation plan.

## Requirements

See `requirements.md` for detailed game requirements.

## Design

See `design.md` for technical architecture and design decisions.

## License

MIT License - Educational project

## Credits

Inspired by African culture and environmental conservation efforts.

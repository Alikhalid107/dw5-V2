# DW5-V2 — Full Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Core Systems](#core-systems)
6. [Game Object System](#game-object-system)
7. [Sections & Composition](#sections--composition)
8. [Factory System](#factory-system)
9. [Flak System](#flak-system)
10. [Wall System](#wall-system)
11. [Garage System](#garage-system)
12. [UI Systems](#ui-systems)
13. [Event System](#event-system)
14. [Configuration](#configuration)
15. [Utilities](#utilities)
16. [Data Flow](#data-flow)

---

## Project Overview

DW5-V2 is a **2D canvas-based strategy/base-building game** built with vanilla JavaScript and Vite. Players manage military bases containing factories, flak cannons, garages, and walls. Each base is composed of modular sections that can be upgraded and managed through an interactive UI system.

**Key gameplay features:**
- Multiple base management on a large scrollable world map
- Factory buildings with production timers and upgrade levels (up to level 15)
- Flak cannon placement with build queues
- Garage structures with animated doors
- Wall defenses
- Zoom-aware camera system with smooth scrolling
- Sprite-based animations and visual effects

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vanilla JavaScript (ES Modules)** | Core language, no framework |
| **HTML5 Canvas API** | All rendering |
| **Vite 7.1** | Dev server & bundler |
| **dependency-cruiser** | Dependency analysis (dev tool) |

No runtime dependencies — the entire game is built from scratch.

---

## Getting Started

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

The entry point is `index.html` → `src/index.js` → creates a `Game` instance on the `#gameCanvas` element.

---

## Project Structure

```
src/
├── index.js                          # Entry point
├── style.css                         # Global styles (full-screen canvas)
│
├── config/                           # All configuration constants
│   ├── worldConfig.js                # World dimensions, base count
│   ├── FactoryConfig.js              # Factory types, positions, sprites
│   ├── FlakConfig.js                 # Flak row layouts, positioning
│   ├── WallConfig.js                 # Wall offsets and dimensions
│   ├── GarageUIConfig.js             # Garage UI layout settings
│   ├── ProductionButtonConfig.js     # Production menu button configs
│   ├── UIIconsConfig.js              # Icon paths for UI elements
│   ├── UniversalPanelConfig.js       # Universal panel positioning
│   └── UpgradeButtonConfig.js        # Upgrade button visual settings
│
├── core/                             # Engine-level systems
│   ├── Game/                         # Main game orchestrator
│   │   ├── Game.js                   # Root game class
│   │   ├── GameInitializer.js        # Spawns grass tiles and bases
│   │   ├── GameLoopManager.js        # requestAnimationFrame loop
│   │   ├── ObjectManager.js          # Sorts and manages all game objects
│   │   ├── MouseInputHandler.js      # Mouse → world coordinate translation
│   │   ├── UIHandler.js              # Delegates UI drawing to bases
│   │   └── ZoomMonitor.js            # Polls camera zoom for changes
│   │
│   ├── CameraController/            # Camera & viewport
│   │   ├── CameraController.js       # Pan, zoom, clamp logic
│   │   ├── CameraEventHandlers.js    # Mouse/wheel/touch input
│   │   ├── RenderingInfoCalculator.js # Black bars & DPR calculations
│   │   └── ZoomDetector.js           # Browser zoom level detection
│   │
│   ├── canvasSetup/                  # Canvas initialization
│   │   ├── canvasSetup.js            # Creates and configures canvas
│   │   ├── CanvasResizer.js          # Handles DPR-aware resizing
│   │   ├── ResizeHandler.js          # Window resize listener
│   │   └── ZoomAwareRenderer.js      # Wraps draw calls with camera transform
│   │
│   └── GameObjectSystem/            # Base entity system
│       ├── GameObject.js             # Base class for all game objects
│       ├── GameObjectRenderer.js     # Handles sprite/image drawing
│       ├── ImageLoader.js            # Async image loading
│       ├── SpriteAnimator.js         # Frame-based sprite animation
│       ├── RenderProperties.js       # Opacity, blend mode, visibility
│       └── VisibilityChecker.js      # Frustum culling
│
├── gameObjects/                      # Concrete game object classes
│   ├── Base.js                       # Wrapper around CompositeBase
│   ├── BaseImage.js                  # Base platform sprite
│   ├── CroppedGameObject.js          # GameObject with source cropping
│   ├── FactoryBuilding.js            # Level-based factory sprite
│   ├── FactoryEffect.js              # Visual effects on factories
│   ├── Flak.js                       # Individual flak cannon
│   ├── GarageDoors.js                # Animated garage doors
│   ├── GarageStructure.js            # Garage building frame
│   ├── Grass.js                      # Tiled grass background
│   ├── TreeExtension.js              # Tree decoration above base
│   └── Wall.js                       # Defense wall segment
│
├── sections/                         # Base composition modules
│   ├── CompositeBase.js              # Assembles all sections into a base
│   ├── BaseSection.js                # Ground platform + trees
│   ├── GarageSection.js              # Garage structure + doors
│   ├── WallSection.js                # Left + right walls
│   ├── FlakBuildSystem.js            # Flak build timer/queue
│   ├── FlakManager.js                # Flak row management
│   └── Factory/                      # Factory subsystem
│       ├── Factory.js                # Individual factory entity
│       ├── FactoryEffects.js         # Single effect instance
│       ├── FactoryEffectsManager.js  # Manages all effects per factory
│       ├── FactoryProductionSystem.js# Production timer logic
│       └── FactoryUI.js              # Factory-specific UI helpers
│
├── managers/                         # High-level coordination
│   ├── FactoryManager.js             # Creates & manages all factories
│   ├── FactoryUICoordinator.js       # Coordinates factory UI panels
│   └── FlagManager.js                # Animated flag decorations
│
├── ui/                               # User interface components
│   ├── FactoryPanel/                 # Factory info panels
│   │   ├── CorePanelComponents.js    # Draws panel background/text
│   │   ├── IndividualFactoryPanel.js # Per-factory panel logic
│   │   └── OverlayComponents.js      # Hover/selection overlays
│   │
│   ├── GarageUI/
│   │   └── GarageUI.js              # Garage interaction UI
│   │
│   ├── ProductionMenu/               # Production control panels
│   │   ├── PanelBase.js              # Base panel rendering
│   │   ├── CancelBadges.js           # Cancel production badges
│   │   ├── ConfirmationDialog.js     # "Are you sure?" dialogs
│   │   ├── MessageDisplay.js         # Status messages
│   │   └── ProductionTimerOverlay.js # Timer progress display
│   │
│   ├── universalSystem/              # Reusable UI box system
│   │   ├── UniversalBox.js           # Single UI box entity
│   │   ├── UniversalBoxController.js # Box interaction controller
│   │   ├── UniversalBoxsesFactory.js # Creates box instances from config
│   │   ├── UniversalBoxState.js      # Box hover/selection state
│   │   └── UniversalPositionCalculator.js # Positions boxes in grid
│   │
│   ├── UpgradeMenu/
│   │   ├── UpgradeButton.js          # Upgrade button rendering
│   │   └── FactorySpriteManager.js   # Manages factory preview sprites
│   │
│   └── UpgradeAllButton.js           # "Upgrade All" master button
│
├── universal/                        # Shared rendering utilities
│   ├── ConfigurationMerger.js        # Deep-merges config objects
│   └── UniversalPanelRenderer.js     # Shared panel drawing routines
│
├── utils/                            # Utility modules
│   ├── animationUtils.js             # Easing functions & animation helpers
│   ├── BaseInputHandler.js           # Delegates input to sections
│   ├── BaseObjectUpdater.js          # Updates object lists dynamically
│   ├── clampCamera.js                # Camera boundary clamping
│   ├── FactoryUtils.js               # Factory positioning calculations
│   ├── FlakPositioning.js            # Flak row/column layout math
│   ├── IconManager.js                # Loads and caches UI icons
│   ├── MessageBus.js                 # Alternative pub/sub system
│   ├── SpriteFrameUtility.js         # Sprite sheet frame calculations
│   ├── WallPositioning.js            # Wall offset calculations
│   └── ZoomDetector.js               # Browser zoom detection utility
│
└── events/                           # Event system
    ├── EventBus.js                   # Global static pub/sub bus
    └── EventTypes.js                 # Event name constants
```

---

## Core Systems

### Game (`src/core/Game/Game.js`)

The root orchestrator. On construction it:

1. Sets up the HTML5 canvas via `setupCanvas()`
2. Creates a `CameraController` for viewport management
3. Uses `GameInitializer` to spawn grass tiles and base objects
4. Initializes `ObjectManager`, `MouseInputHandler`, `UIHandler`, `ZoomMonitor`, and `GameLoopManager`
5. Starts the game loop

**Public API:**
```js
game.getBase(index)           // Get a specific base
game.getAllBases()             // Get all bases
game.getFactoryLevel(baseIdx, type)  // Query factory level
game.upgradeFactory(baseIdx, type)   // Upgrade a factory
game.getCurrentZoom()         // Current camera zoom
game.getRenderInfo()          // Viewport rendering info
```

### GameLoopManager (`src/core/Game/GameLoopManager.js`)

Runs `requestAnimationFrame` loop:
1. Calculates `deltaTime` between frames
2. Updates all game objects via `ObjectManager`
3. Draws the world using `ZoomAwareRenderer` (applies camera transform)
4. Draws UI overlays

### CameraController (`src/core/CameraController/CameraController.js`)

Manages a virtual camera over the world:
- **Panning**: Click-and-drag to scroll
- **Zooming**: Mouse wheel with min/max limits (0.3x–3.0x)
- **Touch support**: Pinch-to-zoom on mobile
- **Black bars**: When zoomed out beyond world bounds
- **Clamping**: Camera stays within world boundaries
- Uses `RenderingInfoCalculator` for DPR-aware viewport math
- Emits events via `EventBus` for zoom/drag changes

### Canvas Setup (`src/core/canvasSetup/`)

- `canvasSetup.js`: Exports `setupCanvas()` and `drawWithZoomAware()` functions
- `CanvasResizer`: Handles high-DPI (devicePixelRatio) canvas sizing
- `ResizeHandler`: Listens for window resize events
- `ZoomAwareRenderer`: Wraps all draw calls with camera offset and scale transforms

---

## Game Object System

### GameObject (`src/core/GameObjectSystem/GameObject.js`)

The **base class** for everything rendered on screen. Uses a **composition pattern** with:

| Component | Purpose |
|-----------|---------|
| `ImageLoader` | Loads an image from a URL asynchronously |
| `SpriteAnimator` | Handles frame-based sprite sheet animation |
| `RenderProperties` | Manages opacity, blend mode, visibility |

**Key properties:** `x`, `y`, `width`, `height`, `zIndex`, `visible`, `opacity`

**Rendering:** `GameObjectRenderer.draw()` handles:
- Frustum culling via `VisibilityChecker`
- Static image rendering
- Animated sprite sheet rendering (frame slicing)
- Opacity and blend mode application

### Concrete Game Objects

| Class | Extends | Description |
|-------|---------|-------------|
| `BaseImage` | `GameObject` | The base platform sprite |
| `Grass` | — | Creates tiled grass `GameObject` instances |
| `TreeExtension` | `CroppedGameObject` | Tree decorations with source cropping |
| `CroppedGameObject` | `GameObject` | Supports `sx, sy, sw, sh` source cropping |
| `FactoryBuilding` | `GameObject` | Level-based sprite sheet (shows different frame per level) |
| `FactoryEffect` | `GameObject` | Animated visual effects (smoke, sparks) |
| `Flak` | `GameObject` | Individual flak cannon unit |
| `GarageDoors` | `GameObject` | Animated opening/closing garage doors |
| `GarageStructure` | `GameObject` | Static garage frame |
| `Wall` | `CroppedGameObject` | Left/right defense walls |

---

## Sections & Composition

### CompositeBase (`src/sections/CompositeBase.js`)

The **central composition class** that assembles an entire base from modular sections:

```
CompositeBase
├── BaseSection         → Ground platform + tree decorations
├── GarageSection       → Garage structure + animated doors
├── FlakManager         → Flak cannon rows + build system
├── WallSection         → Left + right walls
├── FlagManager         → Animated flags
├── FactoryManager      → All factory buildings + UI
├── BaseInputHandler    → Delegates mouse input
└── BaseObjectUpdater   → Dynamic object list updates
```

**Lifecycle:**
1. `initializeSections()` — Creates all sections at a random position
2. `createCompositeBase()` — Collects all `GameObject` instances into a flat array
3. `update(deltaTime)` — Ticks all managers
4. `handleMouseMove/Click()` — Routes input to sections
5. `drawUI()` — Draws UI overlays for factories and garage

### Base (`src/gameObjects/Base.js`)

Thin wrapper around `CompositeBase`. The `Game` class creates `Base` instances, which delegate everything to their inner `CompositeBase`.

---

## Factory System

### Factory (`src/sections/Factory/Factory.js`)

Represents a single factory building. Each factory has:
- **Type**: e.g., "Missile", "Ammo", "Tank", etc.
- **Level**: 1–15 (levels 1–10 use main building, 11–15 add an additional building)
- **Production System**: Timer-based production with formatted countdown
- **Effects Manager**: Visual effects like smoke and sparks
- **Hit Testing**: `isPointInside()` for mouse interaction

### FactoryProductionSystem (`src/sections/Factory/FactoryProductionSystem.js`)

Manages production timers:
- `startProduction(hours)` — Begins a timed production
- `cancelProduction()` — Cancels active production
- `getFormattedProductionTime()` — Returns "HH:MM:SS" countdown string
- `update(deltaMs)` — Ticks the timer

### FactoryEffectsManager (`src/sections/Factory/FactoryEffectsManager.js`)

Creates and manages `FactoryEffect` instances (smoke, fire, sparks) that animate on active factories.

### FactoryManager (`src/managers/FactoryManager.js`)

High-level coordinator that:
- Creates all `Factory` instances from `FactoryConfig`
- Manages hover states and click handling
- Creates `ProductionTimerOverlay` for each factory
- Coordinates with `FactoryUICoordinator` for panel rendering
- Handles confirmation dialogs for production actions

### FactoryUICoordinator (`src/managers/FactoryUICoordinator.js`)

Manages the visual UI for all factories:
- Creates `IndividualFactoryPanel` for each factory type
- Creates `UpgradeAllButton` for bulk upgrades
- Routes clicks to the correct panel
- Handles upgrade and production actions

---

## Flak System

### FlakManager (`src/sections/FlakManager.js`)

Manages rows of flak cannons around the garage:
- Configurable rows (top, bottom, left, right) via `FlakConfig`
- Each row has a max capacity
- Uses `FlakBuildSystem` for build queue
- `FlakPositioning` utility calculates exact positions

### FlakBuildSystem (`src/sections/FlakBuildSystem.js`)

Build queue for flak cannons:
- `startBuilding()` — Begins a 30-second build timer
- `update(deltaTime)` — Ticks the build timer
- `getBuildProgress()` — Returns 0.0–1.0 progress
- On completion, adds a new `Flak` object to the appropriate row

---

## Wall System

### WallSection (`src/sections/WallSection.js`)

Creates left and right `Wall` game objects positioned relative to the base. Uses `WallConfig` for dimensions and `WallPositioning` for offset calculations.

---

## Garage System

### GarageSection (`src/sections/GarageSection.js`)

Creates the garage structure and animated doors:
- `GarageStructure` — The static building frame
- `GarageDoors` — Animated sprite sheet doors

### GarageUI (`src/ui/GarageUI/GarageUI.js`)

Handles garage interaction UI using the **Universal Box System**:
- Shows clickable boxes around the garage
- Integrates with `FlakManager` for flak building
- Uses `UniversalBoxController` for state management

---

## UI Systems

### Universal Box System (`src/ui/universalSystem/`)

A **reusable UI component system** for creating interactive box grids:

| Class | Purpose |
|-------|---------|
| `UniversalBox` | Single interactive box with icon, label, and state |
| `UniversalBoxController` | Manages hover/click logic for a group of boxes |
| `UniversalBoxsesFactory` | Creates boxes from configuration |
| `UniversalBoxState` | Tracks hover, selected, disabled states |
| `UniversalPositionCalculator` | Calculates grid layout positions |

### Factory Panels (`src/ui/FactoryPanel/`)

Per-factory UI panels that appear on hover:
- `IndividualFactoryPanel` — Main panel with upgrade button, production buttons
- `CorePanelComponents` — Draws panel backgrounds, headers, text
- `OverlayComponents` — Hover highlights and selection overlays

### Production Menu (`src/ui/ProductionMenu/`)

Production interaction UI:
- `PanelBase` — Base panel drawing (background, borders)
- `CancelBadges` — Cancel button badges on active productions
- `ConfirmationDialog` — "Are you sure?" before actions
- `MessageDisplay` — Status/error message rendering
- `ProductionTimerOverlay` — Visual countdown timer

### Upgrade System (`src/ui/UpgradeMenu/`)

- `UpgradeButton` — Individual upgrade button with icon and level display
- `FactorySpriteManager` — Manages factory preview sprites in upgrade menu
- `UpgradeAllButton` — Master button to upgrade all factories

### Universal Panel Renderer (`src/universal/UniversalPanelRenderer.js`)

Shared rendering routines used by multiple UI components:
- Rounded rectangles
- Text with shadows
- Progress bars
- Panel backgrounds

---

## Event System

### EventBus (`src/events/EventBus.js`)

A **static global pub/sub** system:

```js
EventBus.on('camera-zoom-change', (data) => { ... });
EventBus.emit('camera-zoom-change', { zoom: 1.5 });
```

### MessageBus (`src/utils/MessageBus.js`)

A **second pub/sub** system (instance-based rather than static). Used in some UI components.

### Event Types (`src/events/EventTypes.js`)

```js
CAMERA_EVENTS = {
  DRAG_START, DRAG, DRAG_END, ZOOM_CHANGE, RESIZE
}
CANVAS_EVENTS = {
  RESIZED, ZOOM_CHANGED, DPR_CHANGED
}
```

---

## Configuration

All configuration is centralized in `src/config/`:

| File | Contents |
|------|----------|
| `worldConfig.js` | World size (4000×3000), grass tile size, base count |
| `FactoryConfig.js` | Factory types, positions, sprites, dimensions, effects |
| `FlakConfig.js` | Flak row layouts, spacing, build times |
| `WallConfig.js` | Wall dimensions and positioning offsets |
| `GarageUIConfig.js` | Garage UI box layout settings |
| `ProductionButtonConfig.js` | Production menu button definitions |
| `UIIconsConfig.js` | Icon asset paths |
| `UniversalPanelConfig.js` | Universal panel positioning/sizing |
| `UpgradeButtonConfig.js` | Upgrade button visual configuration |

---

## Utilities

| Module | Purpose |
|--------|---------|
| `animationUtils.js` | Easing functions (ease-in-out, linear), animation helpers |
| `BaseInputHandler.js` | Routes mouse events to FactoryManager and GarageUI |
| `BaseObjectUpdater.js` | Dynamically updates object arrays when flaks/factories change |
| `clampCamera.js` | Clamps camera position within world bounds |
| `FactoryUtils.js` | Factory-specific positioning calculations |
| `FlakPositioning.js` | Row/column layout math for flak placement |
| `IconManager.js` | Loads and caches icon images |
| `MessageBus.js` | Instance-based pub/sub event system |
| `SpriteFrameUtility.js` | Sprite sheet frame size and index calculations |
| `WallPositioning.js` | Wall offset and position calculations |
| `ZoomDetector.js` | Detects browser zoom level changes |

---

## Data Flow

```
User Input (mouse/touch)
    │
    ▼
CameraController ──────► EventBus (zoom/drag events)
    │
    ▼
MouseInputHandler ──────► Base.handleMouseMove/Click()
    │                         │
    │                         ▼
    │                    CompositeBase
    │                         │
    │              ┌──────────┼──────────┐
    │              ▼          ▼          ▼
    │        FactoryManager  GarageUI  FlakManager
    │              │          │          │
    │              ▼          ▼          ▼
    │        Factory panels  Boxes     Build queue
    │
    ▼
GameLoopManager (every frame)
    │
    ├── ObjectManager.update() ──► all GameObjects.update()
    │
    ├── ZoomAwareRenderer.draw()
    │       │
    │       ├── Apply camera transform
    │       ├── Sort objects by zIndex
    │       └── Draw each visible GameObject
    │
    └── UIHandler.drawUI() ──► Base.drawUI() ──► panels, overlays, timers
```

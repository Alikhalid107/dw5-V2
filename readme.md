# Game Architecture Overview

## 📁 Folder Structure & Purpose

### 1. **core/** - Engine Systems (NO Game Logic)
**Purpose**: Low-level engine functionality that powers the entire game
- **GameObjectSystem/GameObject.js**: Base class for all visual entities
  - Handles position, dimensions, z-index, image loading
  - Extended by all visual objects (Flak, Wall, Grass, etc.)
- **Rendering systems, Camera, Game Loop**: Frame rendering, viewport management, timing

---

### 2. **gameObjects/** - Visual Entities
**Purpose**: Things you can see and interact with visually (sprites, animations)

#### **Flak.js** 
- **What it does**: Animated anti-aircraft gun with 72 rotation frames
- **Responsibilities**: Sprite animation, random rotation behavior, visual rendering
- **Extends**: GameObject
- **Used by**: FlakManager

#### **Wall.js**
- **What it does**: Static wall segments (left/right pairs)
- **Responsibilities**: Simple visual representation, stores side information
- **Extends**: GameObject
- **Used by**: WallSection

---

### 3. **sections/** - Gameplay Controllers
**Purpose**: Business logic that controls how game features work

#### **FlakManager.js** (Main Orchestrator)
- **What it does**: Controls entire flak system for a base/garage
- **Responsibilities**: Manages flak collection, coordinates building/positioning
- **Uses**: FlakBuildSystem, FlakPositioning, creates Flak objects
- **Used by**: Main game systems (CompositeBase, etc.)

#### **FlakBuildSystem.js**
- **What it does**: Handles building/construction timers
- **Responsibilities**: Build timer management, progress calculations, build state
- **Used by**: FlakManager

#### **WallSection.js**
- **What it does**: Manages left and right wall pairs for bases
- **Responsibilities**: Creates/positions wall pairs, handles customization
- **Uses**: WallPositioning, creates Wall objects
- **Used by**: Base/garage systems

#### **CompositeBase.js** (Main Base Controller)
- **What it does**: Orchestrates entire base system (walls, flaks, factories, garage)
- **Responsibilities**: Coordinates all base components, handles updates and events
- **Uses**: All section managers, utility classes
- **Used by**: Main game loop

---

### 4. **ui/** - Interface Elements
**Purpose**: User interface components and panels

#### **ProductionButtons.js**
- **What it does**: Clickable production buttons (1hr, 15hr)
- **Responsibilities**: Button rendering, hover effects, click detection
- **Uses**: FactoryProductionSystem
- **Used by**: UI panels and coordinators

#### **FactoryPanel/** - Factory UI System
##### **IndividualFactoryPanel.js** (Main UI Controller)
- **What it does**: Complete factory panel interface
- **Responsibilities**: Orchestrates all factory UI components
- **Uses**: All factory UI components, positioning, event handling

##### **FactoryPanelEventHandler.js**
- **What it does**: Handles all factory panel interactions
- **Responsibilities**: Click delegation, hover management, event priority
- **Uses**: All UI components through delegation

##### **FactoryPanelRenderer.js**
- **What it does**: Coordinates factory panel rendering
- **Responsibilities**: Draw order management, layered rendering
- **Uses**: All UI components for drawing

---

### 5. **config/** - Constants & Settings
**Purpose**: All configuration data and magic numbers

#### **FlakConfig.js**
- **What it stores**: Flak capacity, build timers, row configurations (positioning, spacing, z-index)
- **Used by**: All flak-related systems

#### **WallConfig.js**
- **What it stores**: Wall dimensions, positioning offsets, image paths, z-index
- **Used by**: WallSection and WallPositioning

#### **FactoryPanelConfig.js**
- **What it stores**: Panel layout, component positions, spacing, UI constants
- **Used by**: Factory UI system

---

### 6. **utils/** - Helper Functions
**Purpose**: Reusable utility functions and calculations

#### **FlakPositioning.js**
- **What it does**: Complex flak positioning mathematics
- **Responsibilities**: Row capacity calculations, left/right distribution, async positioning
- **Used by**: FlakManager

#### **WallPositioning.js**
- **What it does**: Wall position calculations
- **Responsibilities**: Position calculation based on base dimensions, custom offsets
- **Used by**: WallSection

#### **FactoryPanelPositioning.js**
- **What it does**: Factory panel coordinate calculations
- **Responsibilities**: Panel positioning, component layout, bounds checking
- **Used by**: Factory UI system

#### **BaseInputHandler.js**
- **What it does**: Input delegation for base systems
- **Responsibilities**: Mouse event routing, click priority management
- **Used by**: CompositeBase

#### **BaseObjectUpdater.js**
- **What it does**: Object array synchronization
- **Responsibilities**: Keeps object arrays in sync when components change
- **Used by**: CompositeBase

---

### 7. **managers/** - Global Systems
**Purpose**: System-wide coordination

#### **FactoryProductionSystem.js**
- **What it does**: Production timer system
- **Responsibilities**: 15-hour production cycles, completion states, time management
- **Used by**: ProductionButtons and factory UI

---

## 🔄 System Interaction Flow

### **Flak System Flow:**
```
FlakManager (orchestrates everything)
    ├── FlakBuildSystem (manages build timers)
    ├── FlakPositioning (calculates complex positions)
    ├── FlakConfig (provides all settings)
    └── Creates → Flak objects (visual entities)
```

### **Wall System Flow:**
```
WallSection (manages wall pairs)
    ├── WallPositioning (calculates positions)
    ├── WallConfig (provides settings)
    └── Creates → Wall objects (visual entities)
```

### **Factory UI System Flow:**
```
IndividualFactoryPanel (main controller)
    ├── FactoryPanelEventHandler (handles interactions)
    ├── FactoryPanelRenderer (handles drawing)
    ├── FactoryPanelPositioning (handles layout)
    ├── FactoryPanelConfig (provides settings)
    └── UI Components (buttons, dialogs, etc.)
```

### **Base System Flow:**
```
CompositeBase (main orchestrator)
    ├── BaseInputHandler (routes input)
    ├── BaseObjectUpdater (syncs objects)
    ├── FlakManager (manages flaks)
    ├── WallSection (manages walls)
    ├── FactoryManager (manages factories)
    └── All other base components
```

## 🏗️ Architecture Principles

### **1. Single Responsibility Principle**
- Each file has ONE clear purpose
- Components don't mix concerns
- Easy to understand and modify

### **2. Separation of Concerns**
- **Configuration** separate from **Logic**
- **Positioning** separate from **Rendering**
- **Event Handling** separate from **Business Logic**

### **3. Composition Over Inheritance**
- Systems use composition to combine functionality
- Managers orchestrate but don't implement everything
- Easy to swap components

### **4. Clear Data Flow**
```
Config → Utils → Sections → UI
  ↓        ↓        ↓      ↓
Settings → Math → Logic → Display
```

## 🎯 Benefits of This Architecture

### **Maintainability**
- **Changing one component** doesn't break others
- **Clear boundaries** between systems
- **Standard patterns** used throughout

### **Testing**
- **Each system** can be tested independently
- **Mock objects** easy to create
- **Isolated failures** don't cascade

### **Performance**
- **No unnecessary coupling** between components
- **Efficient object management**
- **Clear update cycles**

### **Scalability**
- **New features** easy to add
- **Existing systems** don't need modification
- **Plugin-like architecture**

## 🔧 Common Usage Patterns

### **Adding a New UI Component:**
1. Create component in appropriate `ui/` subfolder
2. Add configuration to relevant config file
3. Register in main controller (like IndividualFactoryPanel)
4. Add to renderer and event handler

### **Modifying Positioning:**
1. Update config values in `config/` files
2. Math changes go in `utils/` positioning files
3. No code changes needed in main systems

### **Adding New Game Objects:**
1. Create class extending GameObject in `gameObjects/`
2. Add manager in `sections/` to control it
3. Add configuration in `config/`
4. Add positioning utilities in `utils/` if needed

## 🐛 Common Debugging Points

### **Object Not Appearing:**
- Check if added to objects array
- Verify positioning calculations
- Ensure proper z-index

### **Click Not Working:**
- Check event handler registration
- Verify bounds calculations
- Confirm click priority order

### **Configuration Not Loading:**
- Verify import paths
- Check config file exports
- Ensure proper destructuring

This architecture follows industry best practices and makes the codebase highly maintainable, testable, and scalable.
/**
 * PositioningTool - In-game sprite positioning system
 * 
 * Press 'P' to toggle positioning mode
 * - Select sprites from dropdown
 * - Drag them with mouse or use manual controls
 * - Save directly to config files
 */

import { FactoryConfig } from '../config/FactoryConfig.js';
import { FLAK_CONFIG } from '../config/FlakConfig.js';
import { WALL_CONFIG } from '../config/WallConfig.js';
import { BASE_TYPE1_CONFIG } from '../config/BASE_TYPE1_CONFIG.js';
import { BASE_TYPE2_CONFIG } from '../config/BASE_TYPE2_CONFIG.js';
import { Base } from '../gameObjects/Base.js';

export class PositioningTool {
  constructor(game) {
    this.game = game;
    this.enabled = false;
    this.mode = 'automatic'; // 'automatic' or 'manual'
    this.selectedBaseType = 2; // Default to base type 2
    this.selectedItem = null;
    this.dragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.hoveredItem = null;
    
    this.setupUI();
    this.setupKeyboardShortcuts();
    this.setupMouseHandlers();
  }

  // Helper method to get the composite base for the selected base type
  getSelectedCompositeBase() {
    const base = this.game.getBase(0);
    if (!base || !base.compositeBases) return null;
    
    // Find the composite base that matches the selected base type
    return base.compositeBases.find(cb => cb.baseType === this.selectedBaseType) || null;
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'p' || e.key === 'P') {
        this.toggle();
      }
      if (this.enabled && e.key === 'Escape') {
        this.selectedItem = null;
        this.updateUI();
      }
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    const panel = document.getElementById('positioning-tool-panel');
    if (panel) {
      panel.style.display = this.enabled ? 'block' : 'none';
    }
    if (this.enabled) {
      this.refreshItemList();
    } else {
      // Reset cursor when disabling
      if (this.game.canvas) {
        this.game.canvas.style.cursor = '';
      }
    }
  }

  setupUI() {
    const panel = document.createElement('div');
    panel.id = 'positioning-tool-panel';
    panel.innerHTML = `
      <style>
        #positioning-tool-panel {
          position: fixed;
          top: 10px;
          right: 10px;
          width: 320px;
          background: rgba(20, 20, 30, 0.95);
          border: 2px solid #378ADD;
          border-radius: 8px;
          padding: 15px;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 13px;
          z-index: 10000;
          display: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          max-height: 90vh;
          overflow-y: auto;
        }
        #positioning-tool-panel h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          color: #378ADD;
          border-bottom: 1px solid #378ADD;
          padding-bottom: 8px;
        }
        .pt-section {
          margin-bottom: 15px;
        }
        .pt-label {
          display: block;
          margin-bottom: 5px;
          color: #aaa;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pt-select, .pt-input {
          width: 100%;
          padding: 8px;
          background: rgba(40, 40, 50, 0.8);
          border: 1px solid #555;
          border-radius: 4px;
          color: #fff;
          font-size: 13px;
        }
        .pt-select:focus, .pt-input:focus {
          outline: none;
          border-color: #378ADD;
        }
        .pt-mode-toggle {
          display: flex;
          gap: 8px;
          margin-bottom: 15px;
        }
        .pt-mode-btn {
          flex: 1;
          padding: 8px;
          background: rgba(40, 40, 50, 0.8);
          border: 1px solid #555;
          border-radius: 4px;
          color: #aaa;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pt-mode-btn.active {
          background: #378ADD;
          color: #fff;
          border-color: #378ADD;
        }
        .pt-controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .pt-control-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .pt-input-row {
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .pt-input-row input {
          flex: 1;
        }
        .pt-btn-small {
          width: 32px;
          height: 32px;
          padding: 0;
          background: rgba(40, 40, 50, 0.8);
          border: 1px solid #555;
          border-radius: 4px;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pt-btn-small:hover {
          background: #378ADD;
          border-color: #378ADD;
        }
        .pt-btn {
          width: 100%;
          padding: 10px;
          background: #1D9E75;
          border: none;
          border-radius: 4px;
          color: #fff;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          margin-top: 10px;
          transition: all 0.2s;
        }
        .pt-btn:hover {
          background: #25b589;
        }
        .pt-btn:disabled {
          background: #555;
          cursor: not-allowed;
        }
        .pt-info {
          background: rgba(55, 138, 221, 0.1);
          border: 1px solid #378ADD;
          border-radius: 4px;
          padding: 8px;
          font-size: 11px;
          color: #aaa;
          margin-top: 10px;
        }
        .pt-selected-info {
          background: rgba(29, 158, 117, 0.1);
          border: 1px solid #1D9E75;
          border-radius: 4px;
          padding: 8px;
          font-size: 12px;
          margin-bottom: 10px;
        }
        .pt-close {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          background: rgba(216, 90, 48, 0.8);
          border: none;
          border-radius: 4px;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
        }
        .pt-close:hover {
          background: #D85A30;
        }
      </style>
      
      <button class="pt-close" onclick="window.positioningTool?.toggle()">×</button>
      <h3>🎯 Positioning Tool</h3>
      
      <div class="pt-info">
        Press <strong>P</strong> to toggle • <strong>ESC</strong> to deselect
      </div>
      
      <div class="pt-section">
        <label class="pt-label">Base Type</label>
        <div class="pt-mode-toggle">
          <button class="pt-mode-btn" data-basetype="1">
            Base Type 1
          </button>
          <button class="pt-mode-btn active" data-basetype="2">
            Base Type 2
          </button>
        </div>
      </div>
      
      <div class="pt-section">
        <label class="pt-label">Mode</label>
        <div class="pt-mode-toggle">
          <button class="pt-mode-btn active" data-mode="automatic">
            🖱️ Automatic (Drag)
          </button>
          <button class="pt-mode-btn" data-mode="manual">
            ⌨️ Manual (Input)
          </button>
        </div>
      </div>
      
      <div class="pt-section">
        <label class="pt-label">Select Sprite/Building</label>
        <select class="pt-select" id="pt-item-select">
          <option value="">-- Choose an item --</option>
        </select>
      </div>
      
      <div id="pt-selected-section" style="display: none;">
        <div class="pt-selected-info">
          <strong id="pt-selected-name">Nothing selected</strong>
          <div id="pt-selected-details" style="margin-top: 5px; font-size: 11px; color: #aaa;"></div>
        </div>
        
        <div class="pt-section" id="pt-manual-controls" style="display: none;">
          <div class="pt-controls">
            <div class="pt-control-group">
              <label class="pt-label">X Position</label>
              <div class="pt-input-row">
                <button class="pt-btn-small" onclick="window.positioningTool?.adjustValue('x', -1)">−</button>
                <input type="number" class="pt-input" id="pt-x-input" value="0">
                <button class="pt-btn-small" onclick="window.positioningTool?.adjustValue('x', 1)">+</button>
              </div>
            </div>
            
            <div class="pt-control-group">
              <label class="pt-label">Y Position</label>
              <div class="pt-input-row">
                <button class="pt-btn-small" onclick="window.positioningTool?.adjustValue('y', -1)">−</button>
                <input type="number" class="pt-input" id="pt-y-input" value="0">
                <button class="pt-btn-small" onclick="window.positioningTool?.adjustValue('y', 1)">+</button>
              </div>
            </div>
          </div>
        </div>
        
        <button class="pt-btn" onclick="window.positioningTool?.saveConfig()">
          💾 Save to Config
        </button>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Base type toggle handlers
    panel.querySelectorAll('[data-basetype]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedBaseType = parseInt(btn.dataset.basetype);
        panel.querySelectorAll('[data-basetype]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Refresh item list for the selected base type
        this.refreshItemList();
        this.selectedItem = null;
        document.getElementById('pt-selected-section').style.display = 'none';
      });
    });
    
    // Mode toggle handlers
    panel.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.mode = btn.dataset.mode;
        panel.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const manualControls = document.getElementById('pt-manual-controls');
        manualControls.style.display = this.mode === 'manual' ? 'block' : 'none';
      });
    });
    
    // Item selection handler
    const select = document.getElementById('pt-item-select');
    select.addEventListener('change', (e) => {
      this.selectItem(e.target.value);
    });
    
    // Manual input handlers
    ['x', 'y'].forEach(axis => {
      const input = document.getElementById(`pt-${axis}-input`);
      input.addEventListener('input', () => {
        if (this.selectedItem) {
          this.updateItemPosition(axis, parseInt(input.value) || 0);
        }
      });
    });
    
    // Make it globally accessible for onclick handlers
    window.positioningTool = this;
  }

  refreshItemList() {
    const select = document.getElementById('pt-item-select');
    const items = this.getAllPositionableItems();
    
    select.innerHTML = '<option value="">-- Choose an item --</option>';
    
    Object.entries(items).forEach(([category, categoryItems]) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = category;
      
      categoryItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        optgroup.appendChild(option);
      });
      
      select.appendChild(optgroup);
    });
  }

  getAllPositionableItems() {
    // Use the selected base type from the tool instead of from the game
    const baseType = this.selectedBaseType;
    const items = {};
    
    // Factories - Main buildings
    items['Factories (Main)'] = Object.keys(FactoryConfig).map(type => ({
      id: `factory:${type}`,
      name: `${FactoryConfig[type].name}`,
      type: 'factory',
      factoryType: type
    }));
    
    // Factories - Additional buildings (level 11-15)
    items['Factories (Additional)'] = Object.keys(FactoryConfig).map(type => ({
      id: `factory-additional:${type}`,
      name: `${FactoryConfig[type].name} (Additional)`,
      type: 'factory-additional',
      factoryType: type
    }));
    
    // Factory Effects
    const effectItems = [];
    Object.entries(FactoryConfig).forEach(([type, config]) => {
      if (config.effects) {
        Object.keys(config.effects).forEach(effectKey => {
          // Handle array effects (like oilPumps)
          const effect = config.effects[effectKey];
          if (Array.isArray(effect)) {
            effect.forEach((e, index) => {
              effectItems.push({
                id: `effect:${type}:${effectKey}:${index}`,
                name: `${config.name} - ${effectKey} ${index + 1}`,
                type: 'effect',
                factoryType: type,
                effectKey: effectKey,
                effectIndex: index
              });
            });
          } else {
            effectItems.push({
              id: `effect:${type}:${effectKey}`,
              name: `${config.name} - ${effectKey}`,
              type: 'effect',
              factoryType: type,
              effectKey: effectKey
            });
          }
        });
      }
    });
    if (effectItems.length > 0) {
      items['Factory Effects'] = effectItems;
    }
    
    // Walls
    items['Walls'] = [
      { id: 'wall:left', name: 'Left Wall', type: 'wall', side: 'left' },
      { id: 'wall:right', name: 'Right Wall', type: 'wall', side: 'right' }
    ];
    
    // Flak Rows
    if (baseType === 2 && BASE_TYPE2_CONFIG.flak?.positioningMode === 'curved') {
      // Curved mode: show left and right sides separately
      const flakItems = [];
      BASE_TYPE2_CONFIG.flak.rows.forEach((row, index) => {
        flakItems.push({
          id: `flak:row:${index}`,
          name: `Flak Row ${index + 1} (${row.count} units, curved)`,
          type: 'flak',
          rowIndex: index
        });
      });
      items['Flak Rows'] = flakItems;
    } else {
      // Straight mode: show rows normally
      items['Flak Rows'] = FLAK_CONFIG.ROWS.map((row, index) => ({
        id: `flak:row:${index}`,
        name: `Flak Row ${index + 1} (${row.count} units)`,
        type: 'flak',
        rowIndex: index
      }));
    }
    
    // Tower Buildings
    items['Tower Buildings'] = [
      { id: 'tower:left', name: 'Military Building (Left)', type: 'tower', building: 'left' },
      { id: 'tower:right', name: 'Military Building (Right)', type: 'tower', building: 'right' },
      { id: 'tower:radar', name: 'Radar Building', type: 'tower', building: 'radar' },
      { id: 'tower:jammer', name: 'Jammer Building', type: 'tower', building: 'jammer' },
      { id: 'tower:detector', name: 'Detector Building', type: 'tower', building: 'detector' }
    ];
    
    // Extension Buildings
    items['Extension Buildings'] = [
      { id: 'extension:ministry', name: 'Ministry Building', type: 'extension', building: 'ministry' },
      { id: 'extension:militaryOffice', name: 'Military Office', type: 'extension', building: 'militaryOffice' },
      { id: 'extension:groupLimit', name: 'Group Limit Building', type: 'extension', building: 'groupLimit' }
    ];
    
    // Command Building
    items['Command Buildings'] = [
      { id: 'command:commandCenter', name: 'Command Center', type: 'command', building: 'commandCenter' }
    ];
    
    // Long Range Building
    items['Special Buildings'] = [
      { id: 'longrange:building', name: 'Long Range Building', type: 'longrange' }
    ];
    
    // Aircraft Carrier (only for base type 2)
    if (baseType === 2) {
      items['Aircraft Carrier'] = [
        { id: 'aircraftcarrier:main', name: 'Aircraft Carrier', type: 'aircraftcarrier' }
      ];
    }
    
    // Garage Position - Now unified for both base types
    items['Garage'] = [
      { id: 'garage:main', name: 'Garage Position', type: 'garage' }
    ];
    
    return items;
  }

  selectItem(itemId) {
    if (!itemId) {
      this.selectedItem = null;
      document.getElementById('pt-selected-section').style.display = 'none';
      return;
    }
    
    const parts = itemId.split(':');
    const type = parts[0];
    const rest = parts.slice(1);
    
    this.selectedItem = { id: itemId, type, data: rest };
    
    document.getElementById('pt-selected-section').style.display = 'block';
    this.updateUI();
  }

  updateUI() {
    if (!this.selectedItem) return;
    
    const nameEl = document.getElementById('pt-selected-name');
    const detailsEl = document.getElementById('pt-selected-details');
    const xInput = document.getElementById('pt-x-input');
    const yInput = document.getElementById('pt-y-input');
    
    const position = this.getItemPosition(this.selectedItem);
    
    if (position) {
      nameEl.textContent = position.name;
      detailsEl.textContent = `Current: X=${position.x}, Y=${position.y}`;
      xInput.value = position.x;
      yInput.value = position.y;
    }
  }

  getItemPosition(item) {
    if (!item) return null;
    
    const compositeBase = this.getSelectedCompositeBase();
    if (!compositeBase) return null;
    
    switch (item.type) {
      case 'factory': {
        const factoryType = item.data[0];
        const config = FactoryConfig[factoryType];
        if (!config) return null;
        return {
          name: config.name,
          x: config.offsetX,
          y: config.offsetY,
          configPath: `FactoryConfig.${factoryType}`
        };
      }
      
      case 'factory-additional': {
        const factoryType = item.data[0];
        const config = FactoryConfig[factoryType];
        return {
          name: `${config.name} (Additional)`,
          x: config.additionalOffsetX,
          y: config.additionalOffsetY,
          configPath: `FactoryConfig.${factoryType}.additional`
        };
      }
      
      case 'effect': {
        const factoryType = item.data[0];
        const effectKey = item.data[1];
        const effectIndex = item.data[2] !== undefined ? parseInt(item.data[2]) : undefined;
        
        let config;
        if (effectIndex !== undefined) {
          config = FactoryConfig[factoryType]?.effects?.[effectKey]?.[effectIndex];
        } else {
          config = FactoryConfig[factoryType]?.effects?.[effectKey];
        }
        
        if (!config) return null;
        
        return {
          name: effectIndex !== undefined ? 
            `${FactoryConfig[factoryType].name} - ${effectKey} ${effectIndex + 1}` :
            `${FactoryConfig[factoryType].name} - ${effectKey}`,
          x: config.offsetX,
          y: config.offsetY,
          configPath: effectIndex !== undefined ?
            `FactoryConfig.${factoryType}.effects.${effectKey}[${effectIndex}]` :
            `FactoryConfig.${factoryType}.effects.${effectKey}`
        };
      }
      
      case 'wall': {
        const side = item.data[0];
        const config = WALL_CONFIG.OFFSETS[side];
        return {
          name: `${side} Wall`,
          x: config.x,
          y: config.y,
          configPath: `WALL_CONFIG.OFFSETS.${side}`
        };
      }
      
      case 'flak': {
        const rowIndex = parseInt(item.data[1]);
        const baseType = this.selectedBaseType;
        
        // Check if using curved mode (base type 2)
        if (baseType === 2 && BASE_TYPE2_CONFIG.flak?.positioningMode === 'curved') {
          const config = BASE_TYPE2_CONFIG.flak.rows[rowIndex];
          if (!config) return null;
          return {
            name: `Flak Row ${rowIndex + 1} (Left)`,
            x: config.leftStartX,
            y: config.leftStartY,
            configPath: `BASE_TYPE2_CONFIG.flak.rows[${rowIndex}]`
          };
        } else {
          // Straight mode (base type 1 or default)
          const config = FLAK_CONFIG.ROWS[rowIndex];
          if (!config) return null;
          return {
            name: `Flak Row ${rowIndex + 1}`,
            x: config.rowOffsetX,
            y: config.rowOffsetY,
            configPath: `FLAK_CONFIG.ROWS[${rowIndex}]`
          };
        }
      }
      
      case 'tower': {
        const building = item.data[0];
        const config = BASE_TYPE2_CONFIG.tower.buildings[building];
        return {
          name: building === 'left' ? 'Military Building (Left)' :
                building === 'right' ? 'Military Building (Right)' :
                building === 'radar' ? 'Radar Building' :
                building === 'jammer' ? 'Jammer Building' : 'Detector Building',
          x: config.spawnOffsetX,
          y: config.spawnOffsetY,
          configPath: `BASE_TYPE2_CONFIG.tower.buildings.${building}`
        };
      }
      
      case 'extension': {
        const building = item.data[0];
        const config = BASE_TYPE2_CONFIG.extension.buildings[building];
        return {
          name: building === 'ministry' ? 'Ministry Building' :
                building === 'militaryOffice' ? 'Military Office' : 'Group Limit Building',
          x: config.spawnOffsetX,
          y: config.spawnOffsetY,
          configPath: `BASE_TYPE2_CONFIG.extension.buildings.${building}`
        };
      }
      
      case 'command': {
        const building = item.data[0];
        const config = BASE_TYPE2_CONFIG.command.buildings[building];
        return {
          name: 'Command Center',
          x: config.spawnOffsetX,
          y: config.spawnOffsetY,
          configPath: `BASE_TYPE2_CONFIG.command.buildings.${building}`
        };
      }
      
      case 'longrange': {
        const config = BASE_TYPE2_CONFIG.longRange;
        return {
          name: 'Long Range Building',
          x: config.spawnOffsetX,
          y: config.spawnOffsetY,
          configPath: `BASE_TYPE2_CONFIG.longRange`
        };
      }
      
      case 'wall': {
        const side = this.selectedItem.data[0];
        const baseType = compositeBase?.baseType || 1;
        if (baseType === 2) {
          const config = BASE_TYPE2_CONFIG.walls[`offset${side.charAt(0).toUpperCase() + side.slice(1)}`];
          return {
            name: `${side.charAt(0).toUpperCase() + side.slice(1)} Wall`,
            x: config.x,
            y: config.y,
            configPath: `BASE_TYPE2_CONFIG.walls.offset${side.charAt(0).toUpperCase() + side.slice(1)}`
          };
        } else {
          const config = WALL_CONFIG.OFFSETS[side];
          return {
            name: `${side.charAt(0).toUpperCase() + side.slice(1)} Wall`,
            x: config.x,
            y: config.y,
            configPath: `WALL_CONFIG.OFFSETS.${side}`
          };
        }
      }
      
      case 'garage': {
        const baseType = this.selectedBaseType;
        const config = baseType === 2 ? BASE_TYPE2_CONFIG.garage : BASE_TYPE1_CONFIG.garage;
        return {
          name: `Garage Position (Base Type ${baseType})`,
          x: config?.offsetX || 0,
          y: config?.offsetY || -250,
          configPath: baseType === 2 ? `BASE_TYPE2_CONFIG.garage` : `BASE_TYPE1_CONFIG.garage`
        };
      }
      
      case 'aircraftcarrier': {
        const baseType = compositeBase?.baseType || 1;
        if (baseType === 2) {
          const config = BASE_TYPE2_CONFIG.aircraftCarrier;
          return {
            name: 'Aircraft Carrier',
            x: config?.offsetX || 0,
            y: config?.offsetY || 0,
            configPath: `BASE_TYPE2_CONFIG.aircraftCarrier`
          };
        }
        return null;
      }
    }
    
    return null;
  }

  updateItemPosition(axis, value) {
    if (!this.selectedItem) return;
    
    const position = this.getItemPosition(this.selectedItem);
    if (!position) return;
    
    const compositeBase = this.getSelectedCompositeBase();
    if (!compositeBase) return;
    
    const garageX = compositeBase?.garageSection?.getGarageX() || 0;
    const garageY = compositeBase?.garageSection?.getGarageY() || 0;
    
    // Update the actual config in memory
    switch (this.selectedItem.type) {
      case 'factory': {
        const factoryType = this.selectedItem.data[0];
        const factory = compositeBase?.factoryManager?.factories[factoryType];
        
        if (axis === 'x') {
          FactoryConfig[factoryType].offsetX = value;
          if (factory) {
            factory.x = garageX + value;
            // Update main building position
            if (factory.mainBuilding) {
              factory.mainBuilding.x = garageX + value;
            }
            // Don't call updateVisuals() as it will reposition everything
          }
        }
        if (axis === 'y') {
          FactoryConfig[factoryType].offsetY = value;
          if (factory) {
            factory.y = garageY + value;
            // Update main building position
            if (factory.mainBuilding) {
              factory.mainBuilding.y = garageY + value;
            }
            // Don't call updateVisuals() as it will reposition everything
          }
        }
        break;
      }
      
      case 'factory-additional': {
        const factoryType = this.selectedItem.data[0];
        const factory = compositeBase?.factoryManager?.factories[factoryType];
        
        if (axis === 'x') {
          FactoryConfig[factoryType].additionalOffsetX = value;
          if (factory?.additionalBuilding) {
            factory.additionalOffsetX = value;
            factory.additionalBuilding.x = factory.x + value;
          }
        }
        if (axis === 'y') {
          FactoryConfig[factoryType].additionalOffsetY = value;
          if (factory?.additionalBuilding) {
            factory.additionalOffsetY = value;
            factory.additionalBuilding.y = factory.y + value;
          }
        }
        break;
      }
      
      case 'effect': {
        const factoryType = this.selectedItem.data[0];
        const effectKey = this.selectedItem.data[1];
        const effectIndex = this.selectedItem.data[2] !== undefined ? parseInt(this.selectedItem.data[2]) : undefined;
        
        if (effectIndex !== undefined) {
          if (axis === 'x') FactoryConfig[factoryType].effects[effectKey][effectIndex].offsetX = value;
          if (axis === 'y') FactoryConfig[factoryType].effects[effectKey][effectIndex].offsetY = value;
        } else {
          if (axis === 'x') FactoryConfig[factoryType].effects[effectKey].offsetX = value;
          if (axis === 'y') FactoryConfig[factoryType].effects[effectKey].offsetY = value;
        }
        
        // Update the effect directly
        const factory = compositeBase?.factoryManager?.factories[factoryType];
        if (factory?.effectsManager) {
          // Get the effect object and update its position
          const effects = factory.effectsManager.effects; // Use .effects instead of getObjects()
          if (effects && effects.length > 0) {
            // Find the specific effect
            let targetEffect = null;
            if (effectIndex !== undefined) {
              // For array effects, find by effectType and index
              const effectsOfType = effects.filter(e => e.effectType === effectKey);
              targetEffect = effectsOfType[effectIndex];
            } else {
              // For single effects, find by effectType
              targetEffect = effects.find(e => e.effectType === effectKey);
            }
            
            if (targetEffect) {
              // Update the original offset so updatePosition() uses the new value
              if (axis === 'x') {
                targetEffect.originalOffsetX = value;
                targetEffect.x = factory.x + value;
              }
              if (axis === 'y') {
                targetEffect.originalOffsetY = value;
                targetEffect.y = factory.y + value;
              }
            }
          }
        }
        break;
      }
      
      case 'wall': {
        const side = this.selectedItem.data[0];
        const wallSection = compositeBase?.wallSection;
        
        if (axis === 'x') {
          WALL_CONFIG.OFFSETS[side].x = value;
          if (wallSection) {
            if (side === 'left') {
              wallSection.setWallOffsets(value, undefined, undefined, undefined);
            } else {
              wallSection.setWallOffsets(undefined, undefined, value, undefined);
            }
          }
        }
        if (axis === 'y') {
          WALL_CONFIG.OFFSETS[side].y = value;
          if (wallSection) {
            if (side === 'left') {
              wallSection.setWallOffsets(undefined, value, undefined, undefined);
            } else {
              wallSection.setWallOffsets(undefined, undefined, undefined, value);
            }
          }
        }
        break;
      }
      
      case 'flak': {
        const rowIndex = parseInt(this.selectedItem.data[1]);
        const baseType = compositeBase?.baseType || 1;
        
        // Check if using curved mode (base type 2)
        if (baseType === 2 && BASE_TYPE2_CONFIG.flak?.positioningMode === 'curved') {
          const config = BASE_TYPE2_CONFIG.flak.rows[rowIndex];
          if (axis === 'x') {
            config.leftStartX = value;
            config.rightStartX = value; // Update both sides together
          }
          if (axis === 'y') {
            config.leftStartY = value;
            config.rightStartY = value; // Update both sides together
          }
          
          // Immediately recreate flaks with new positions for real-time feedback
          if (compositeBase?.flakManager) {
            const currentCount = compositeBase.flakManager.currentFlakCount;
            const garageX = compositeBase.garageSection.getGarageX();
            const garageY = compositeBase.garageSection.getGarageY();
            const garageWidth = compositeBase.garageSection.getGarageWidth();
            const garageHeight = compositeBase.garageSection.getGarageHeight();
            
            // Recreate positioning with updated config
            compositeBase.flakManager.cleanup();
            compositeBase.flakManager.positioning.rows = BASE_TYPE2_CONFIG.flak.rows;
            compositeBase.flakManager.currentFlakCount = 0;
            compositeBase.flakManager.objects = [];
            compositeBase.flakManager.initializeFirstFlaks();
            
            // Rebuild to original count
            while (compositeBase.flakManager.currentFlakCount < currentCount) {
              if (!compositeBase.flakManager.addNewFlak()) break;
            }
            
            // Update objects array
            if (compositeBase.objectUpdater) {
              compositeBase.objectUpdater.updateFlakObjects(compositeBase.objects);
            }
          }
        } else {
          // Straight mode (base type 1 or default)
          if (axis === 'x') FLAK_CONFIG.ROWS[rowIndex].rowOffsetX = value;
          if (axis === 'y') FLAK_CONFIG.ROWS[rowIndex].rowOffsetY = value;
          
          // Update flak positions directly
          if (compositeBase?.flakManager) {
            compositeBase.flakManager.updateFlakRowConfig(rowIndex, FLAK_CONFIG.ROWS[rowIndex]);
          }
        }
        break;
      }
      
      case 'tower': {
        const building = this.selectedItem.data[0];
        if (axis === 'x') BASE_TYPE2_CONFIG.tower.buildings[building].spawnOffsetX = value;
        if (axis === 'y') BASE_TYPE2_CONFIG.tower.buildings[building].spawnOffsetY = value;
        
        // Update building position directly
        const towerManager = compositeBase?.towerManager;
        if (towerManager) {
          let buildingObj = null;
          if (building === 'left') buildingObj = towerManager.militaryBuilding;
          else if (building === 'right') buildingObj = towerManager.militaryBuildingRight;
          else if (building === 'radar') buildingObj = towerManager.radarBuilding;
          else if (building === 'jammer') buildingObj = towerManager.jammerBuilding;
          else if (building === 'detector') buildingObj = towerManager.detectorBuilding;
          
          if (buildingObj) {
            buildingObj.x = garageX + BASE_TYPE2_CONFIG.tower.buildings[building].spawnOffsetX;
            buildingObj.y = garageY + BASE_TYPE2_CONFIG.tower.buildings[building].spawnOffsetY;
          }
        }
        break;
      }
      
      case 'extension': {
        const building = this.selectedItem.data[0];
        if (axis === 'x') BASE_TYPE2_CONFIG.extension.buildings[building].spawnOffsetX = value;
        if (axis === 'y') BASE_TYPE2_CONFIG.extension.buildings[building].spawnOffsetY = value;
        
        // Update building position directly
        const extensionManager = compositeBase?.extensionManager;
        if (extensionManager) {
          let buildingObj = null;
          if (building === 'ministry') buildingObj = extensionManager.ministryBuilding;
          else if (building === 'militaryOffice') buildingObj = extensionManager.officeBuilding;
          else if (building === 'groupLimit') buildingObj = extensionManager.groupBuilding;
          
          if (buildingObj) {
            buildingObj.x = garageX + BASE_TYPE2_CONFIG.extension.buildings[building].spawnOffsetX;
            buildingObj.y = garageY + BASE_TYPE2_CONFIG.extension.buildings[building].spawnOffsetY;
          }
        }
        break;
      }
      
      case 'command': {
        const building = this.selectedItem.data[0];
        if (axis === 'x') BASE_TYPE2_CONFIG.command.buildings[building].spawnOffsetX = value;
        if (axis === 'y') BASE_TYPE2_CONFIG.command.buildings[building].spawnOffsetY = value;
        
        // Update building position directly
        const commandManager = compositeBase?.commandManager;
        if (commandManager?.commandBuilding) {
          commandManager.commandBuilding.x = garageX + BASE_TYPE2_CONFIG.command.buildings[building].spawnOffsetX;
          commandManager.commandBuilding.y = garageY + BASE_TYPE2_CONFIG.command.buildings[building].spawnOffsetY;
        }
        break;
      }
      
      case 'longrange': {
        if (axis === 'x') BASE_TYPE2_CONFIG.longRange.spawnOffsetX = value;
        if (axis === 'y') BASE_TYPE2_CONFIG.longRange.spawnOffsetY = value;
        
        // Update building position directly
        const garageUI = compositeBase?.garageUI;
        if (garageUI?.longRangeBuilding) {
          garageUI.longRangeBuilding.x = garageX + BASE_TYPE2_CONFIG.longRange.spawnOffsetX;
          garageUI.longRangeBuilding.y = garageY + BASE_TYPE2_CONFIG.longRange.spawnOffsetY;
        }
        break;
      }
      
      case 'wall': {
        const side = this.selectedItem.data[0];
        const baseType = compositeBase?.baseType || 1;
        
        if (baseType === 2) {
          // Base type 2: Update garage-relative wall positions
          const config = BASE_TYPE2_CONFIG.walls[`offset${side.charAt(0).toUpperCase() + side.slice(1)}`];
          if (axis === 'x') config.x = value;
          if (axis === 'y') config.y = value;
          
          // Update wall position directly
          const wallSection = compositeBase?.wallSection;
          if (wallSection) {
            if (side === 'left') {
              wallSection.setWallOffsets(value, undefined, undefined, undefined);
            } else {
              wallSection.setWallOffsets(undefined, undefined, value, undefined);
            }
          }
        } else {
          // Base type 1: Update base-relative wall positions
          if (axis === 'x') WALL_CONFIG.OFFSETS[side].x = value;
          if (axis === 'y') WALL_CONFIG.OFFSETS[side].y = value;
          
          const wallSection = compositeBase?.wallSection;
          if (wallSection) {
            if (side === 'left') {
              wallSection.setWallOffsets(value, undefined, undefined, undefined);
            } else {
              wallSection.setWallOffsets(undefined, undefined, value, undefined);
            }
          }
        }
        break;
      }
      
      case 'garage': {
        const baseType = this.selectedBaseType;
        const config = baseType === 2 ? BASE_TYPE2_CONFIG.garage : BASE_TYPE1_CONFIG.garage;
        
        // Update the config
        if (axis === 'x') config.offsetX = value;
        if (axis === 'y') config.offsetY = value;
        
        // Update the actual garage position in the game (find the matching base type)
        const base = this.game.getBase(0);
        if (base) {
          const compositeBase = base.compositeBases.find(cb => cb.baseType === baseType);
          if (compositeBase) {
            const garageSection = compositeBase.garageSection;
            if (garageSection?.garageImageObj) {
              const baseX = garageSection.baseX || 0;
              const baseY = garageSection.baseY || 0;
              const baseCenterX = baseX + (garageSection.baseWidth || 0) / 2;
              const baseCenterY = baseY + (garageSection.baseHeight || 0) / 2;
              
              if (axis === 'x') {
                garageSection.garageOffsetX = value;
                garageSection.garageImageObj.x = baseCenterX + value;
                garageSection.garageX = baseCenterX + value;
              }
              if (axis === 'y') {
                garageSection.garageOffsetY = value;
                garageSection.garageImageObj.y = baseCenterY + value;
                garageSection.garageY = baseCenterY + value;
              }
              
              // Update doors if they exist
              if (garageSection.doorsImageObj) {
                if (axis === 'x') garageSection.doorsImageObj.x = baseCenterX + value;
                if (axis === 'y') garageSection.doorsImageObj.y = baseCenterY + value;
              }
            }
          }
        }
        break;
      }
      
      case 'aircraftcarrier': {
        if (axis === 'x') BASE_TYPE2_CONFIG.aircraftCarrier.offsetX = value;
        if (axis === 'y') BASE_TYPE2_CONFIG.aircraftCarrier.offsetY = value;
        
        // Update aircraft carrier position directly
        const aircraftCarrierSection = compositeBase?.aircraftCarrierSection;
        if (aircraftCarrierSection) {
          aircraftCarrierSection.updatePosition(
            BASE_TYPE2_CONFIG.aircraftCarrier.offsetX,
            BASE_TYPE2_CONFIG.aircraftCarrier.offsetY
          );
        }
        break;
      }
    }
    
    this.updateUI();
  }

  adjustValue(axis, delta) {
    const input = document.getElementById(`pt-${axis}-input`);
    const currentValue = parseInt(input.value) || 0;
    const newValue = currentValue + delta;
    input.value = newValue;
    this.updateItemPosition(axis, newValue);
  }

  isBlockingCameraMovement() {
    return this.enabled && this.dragging;
  }

  setupMouseHandlers() {
    const canvas = this.game.canvas;
    
    // Track hover state for cursor changes
    canvas.addEventListener('mousemove', (e) => {
      if (!this.enabled || this.mode !== 'automatic' || !this.selectedItem) {
        if (canvas.style.cursor === 'move' || canvas.style.cursor === 'grabbing') {
          canvas.style.cursor = '';
        }
        return;
      }
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / this.game.camera.currentZoom + this.game.camera.offsetX;
      const mouseY = (e.clientY - rect.top) / this.game.camera.currentZoom + this.game.camera.offsetY;
      
      if (this.dragging) {
        canvas.style.cursor = 'grabbing';
        
        const compositeBase = this.getSelectedCompositeBase();
        if (!compositeBase) return;
        
        const garageX = compositeBase?.garageSection?.getGarageX() || 0;
        const garageY = compositeBase?.garageSection?.getGarageY() || 0;
        
        const newX = Math.round(mouseX - garageX - this.dragOffset.x);
        const newY = Math.round(mouseY - garageY - this.dragOffset.y);
        
        this.updateItemPosition('x', newX);
        this.updateItemPosition('y', newY);
        
        // Stop event from reaching camera controller
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      } else if (this.isPointInSelectedItem(mouseX, mouseY)) {
        canvas.style.cursor = 'move';
      } else {
        canvas.style.cursor = '';
      }
    }, true); // Use capture phase
    
    // Use capture phase to intercept events before camera controller
    canvas.addEventListener('mousedown', (e) => {
      if (!this.enabled || this.mode !== 'automatic' || !this.selectedItem) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / this.game.camera.currentZoom + this.game.camera.offsetX;
      const mouseY = (e.clientY - rect.top) / this.game.camera.currentZoom + this.game.camera.offsetY;
      
      // Check if clicking on the selected item
      if (this.isPointInSelectedItem(mouseX, mouseY)) {
        this.dragging = true;
        const position = this.getItemPosition(this.selectedItem);
        const compositeBase = this.getSelectedCompositeBase();
        if (!compositeBase) return;
        
        const garageX = compositeBase?.garageSection?.getGarageX() || 0;
        const garageY = compositeBase?.garageSection?.getGarageY() || 0;
        
        this.dragOffset = {
          x: mouseX - (garageX + position.x),
          y: mouseY - (garageY + position.y)
        };
        
        canvas.style.cursor = 'grabbing';
        
        // Stop event from reaching camera controller
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }, true); // Use capture phase
    
    canvas.addEventListener('mouseup', (e) => {
      if (this.dragging) {
        this.dragging = false;
        canvas.style.cursor = 'move';
        // Stop event from reaching camera controller
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }, true); // Use capture phase
    
    canvas.addEventListener('mouseleave', () => {
      this.dragging = false;
      canvas.style.cursor = '';
    });
  }

  isPointInSelectedItem(mouseX, mouseY) {
    if (!this.selectedItem) return false;
    
    const compositeBase = this.getSelectedCompositeBase();
    if (!compositeBase) return false;
    
    const position = this.getItemPosition(this.selectedItem);
    if (!position) return false;
    
    // Get the actual game object bounds
    switch (this.selectedItem.type) {
      case 'factory': {
        const factoryType = this.selectedItem.data[0];
        const factory = compositeBase.factoryManager?.factories[factoryType];
        if (factory?.mainBuilding) {
          const mb = factory.mainBuilding;
          return mouseX >= mb.x && mouseX <= mb.x + mb.width &&
                 mouseY >= mb.y && mouseY <= mb.y + mb.height;
        }
        break;
      }
      
      case 'factory-additional': {
        const factoryType = this.selectedItem.data[0];
        const factory = compositeBase.factoryManager?.factories[factoryType];
        if (factory?.additionalBuilding) {
          const ab = factory.additionalBuilding;
          return mouseX >= ab.x && mouseX <= ab.x + ab.width &&
                 mouseY >= ab.y && mouseY <= ab.y + ab.height;
        }
        break;
      }
      
      case 'effect': {
        const factoryType = this.selectedItem.data[0];
        const effectKey = this.selectedItem.data[1];
        const effectIndex = this.selectedItem.data[2] !== undefined ? parseInt(this.selectedItem.data[2]) : undefined;
        const factory = compositeBase.factoryManager?.factories[factoryType];
        
        if (factory?.effectsManager) {
          const effects = factory.effectsManager.effects;
          if (effects && effects.length > 0) {
            let targetEffect = null;
            if (effectIndex !== undefined) {
              const effectsOfType = effects.filter(e => e.effectType === effectKey);
              targetEffect = effectsOfType[effectIndex];
            } else {
              targetEffect = effects.find(e => e.effectType === effectKey);
            }
            
            if (targetEffect) {
              return mouseX >= targetEffect.x && mouseX <= targetEffect.x + targetEffect.width &&
                     mouseY >= targetEffect.y && mouseY <= targetEffect.y + targetEffect.height;
            }
          }
        }
        break;
      }
      
      case 'wall': {
        const side = this.selectedItem.data[0];
        const wall = side === 'left' ? 
          compositeBase.wallSection?.getLeftWall() : 
          compositeBase.wallSection?.getRightWall();
        if (wall) {
          return mouseX >= wall.x && mouseX <= wall.x + wall.width &&
                 mouseY >= wall.y && mouseY <= wall.y + wall.height;
        }
        break;
      }
      
      case 'tower': {
        const building = this.selectedItem.data[0];
        const towerManager = compositeBase.towerManager;
        let buildingObj = null;
        if (building === 'left') buildingObj = towerManager?.militaryBuilding;
        else if (building === 'right') buildingObj = towerManager?.militaryBuildingRight;
        else if (building === 'radar') buildingObj = towerManager?.radarBuilding;
        else if (building === 'jammer') buildingObj = towerManager?.jammerBuilding;
        else if (building === 'detector') buildingObj = towerManager?.detectorBuilding;
        
        if (buildingObj) {
          return mouseX >= buildingObj.x && mouseX <= buildingObj.x + buildingObj.width &&
                 mouseY >= buildingObj.y && mouseY <= buildingObj.y + buildingObj.height;
        }
        break;
      }
      
      case 'extension': {
        const building = this.selectedItem.data[0];
        const extensionManager = compositeBase.extensionManager;
        let buildingObj = null;
        if (building === 'ministry') buildingObj = extensionManager?.ministryBuilding;
        else if (building === 'militaryOffice') buildingObj = extensionManager?.officeBuilding;
        else if (building === 'groupLimit') buildingObj = extensionManager?.groupBuilding;
        
        if (buildingObj) {
          return mouseX >= buildingObj.x && mouseX <= buildingObj.x + buildingObj.width &&
                 mouseY >= buildingObj.y && mouseY <= buildingObj.y + buildingObj.height;
        }
        break;
      }
      
      case 'command': {
        const commandBuilding = compositeBase.commandManager?.commandBuilding;
        if (commandBuilding) {
          return mouseX >= commandBuilding.x && mouseX <= commandBuilding.x + commandBuilding.width &&
                 mouseY >= commandBuilding.y && mouseY <= commandBuilding.y + commandBuilding.height;
        }
        break;
      }
      
      case 'longrange': {
        const longRangeBuilding = compositeBase.garageUI?.longRangeBuilding;
        if (longRangeBuilding) {
          return mouseX >= longRangeBuilding.x && mouseX <= longRangeBuilding.x + longRangeBuilding.width &&
                 mouseY >= longRangeBuilding.y && mouseY <= longRangeBuilding.y + longRangeBuilding.height;
        }
        break;
      }
      
      case 'wall': {
        const side = this.selectedItem.data[0];
        const wall = side === 'left' ? 
          compositeBase.wallSection?.getLeftWall() : 
          compositeBase.wallSection?.getRightWall();
        if (wall) {
          return mouseX >= wall.x && mouseX <= wall.x + wall.width &&
                 mouseY >= wall.y && mouseY <= wall.y + wall.height;
        }
        break;
      }
      
      case 'garage': {
        const garageSection = compositeBase.garageSection;
        if (garageSection?.garageImageObj) {
          const garage = garageSection.garageImageObj;
          return mouseX >= garage.x && mouseX <= garage.x + garage.width &&
                 mouseY >= garage.y && mouseY <= garage.y + garage.height;
        }
        break;
      }
      
      case 'aircraftcarrier': {
        const aircraftCarrierSection = compositeBase.aircraftCarrierSection;
        if (aircraftCarrierSection?.structureObj) {
          const carrier = aircraftCarrierSection.structureObj;
          return mouseX >= carrier.x && mouseX <= carrier.x + carrier.width &&
                 mouseY >= carrier.y && mouseY <= carrier.y + carrier.height;
        }
        break;
      }
    }
    
    // Fallback: simple bounds check
    const garageX = compositeBase.garageSection?.getGarageX() || 0;
    const garageY = compositeBase.garageSection?.getGarageY() || 0;
    const size = 100; // Default size for hit testing
    return mouseX >= garageX + position.x && mouseX <= garageX + position.x + size &&
           mouseY >= garageY + position.y && mouseY <= garageY + position.y + size;
  }

  draw(ctx, offsetX, offsetY) {
    if (!this.enabled || !this.selectedItem) return;
    
    const position = this.getItemPosition(this.selectedItem);
    if (!position) return;
    
    const compositeBase = this.getSelectedCompositeBase();
    if (!compositeBase) return;
    
    const garageX = compositeBase.garageSection?.getGarageX() || 0;
    const garageY = compositeBase.garageSection?.getGarageY() || 0;
    
    ctx.save();
    
    // Draw bounding box around selected item
    ctx.strokeStyle = '#378ADD';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    
    let bounds = null;
    
    switch (this.selectedItem.type) {
      case 'factory': {
        const factoryType = this.selectedItem.data[0];
        const factory = compositeBase.factoryManager?.factories[factoryType];
        if (factory?.mainBuilding) {
          // Only show main building bounds
          bounds = { 
            x: factory.mainBuilding.x, 
            y: factory.mainBuilding.y, 
            width: factory.mainBuilding.width, 
            height: factory.mainBuilding.height 
          };
        }
        break;
      }
      
      case 'factory-additional': {
        const factoryType = this.selectedItem.data[0];
        const factory = compositeBase.factoryManager?.factories[factoryType];
        if (factory?.additionalBuilding) {
          // Only show additional building bounds
          bounds = { 
            x: factory.additionalBuilding.x, 
            y: factory.additionalBuilding.y, 
            width: factory.additionalBuilding.width, 
            height: factory.additionalBuilding.height 
          };
        }
        break;
      }
      
      case 'effect': {
        const factoryType = this.selectedItem.data[0];
        const effectKey = this.selectedItem.data[1];
        const effectIndex = this.selectedItem.data[2] !== undefined ? parseInt(this.selectedItem.data[2]) : undefined;
        const factory = compositeBase.factoryManager?.factories[factoryType];
        
        if (factory?.effectsManager) {
          const effects = factory.effectsManager.effects;
          if (effects && effects.length > 0) {
            let targetEffect = null;
            if (effectIndex !== undefined) {
              const effectsOfType = effects.filter(e => e.effectType === effectKey);
              targetEffect = effectsOfType[effectIndex];
            } else {
              targetEffect = effects.find(e => e.effectType === effectKey);
            }
            
            if (targetEffect) {
              bounds = { 
                x: targetEffect.x, 
                y: targetEffect.y, 
                width: targetEffect.width, 
                height: targetEffect.height 
              };
            }
          }
        }
        break;
      }
      
      case 'wall': {
        const side = this.selectedItem.data[0];
        const wall = side === 'left' ? 
          compositeBase.wallSection?.getLeftWall() : 
          compositeBase.wallSection?.getRightWall();
        if (wall) {
          bounds = { x: wall.x, y: wall.y, width: wall.width, height: wall.height };
        }
        break;
      }
      
      case 'flak': {
        const rowIndex = parseInt(this.selectedItem.data[1]);
        const flaks = compositeBase.flakManager?.getAllFlaks() || [];
        
        // Calculate which flaks belong to this row
        let startIndex = 0;
        for (let r = 0; r < rowIndex; r++) {
          startIndex += FLAK_CONFIG.ROWS[r].count;
        }
        const endIndex = startIndex + FLAK_CONFIG.ROWS[rowIndex].count;
        const rowFlaks = flaks.slice(startIndex, endIndex);
        
        if (rowFlaks.length > 0) {
          const minX = Math.min(...rowFlaks.map(f => f.x));
          const maxX = Math.max(...rowFlaks.map(f => f.x + f.width));
          const minY = Math.min(...rowFlaks.map(f => f.y));
          const maxY = Math.max(...rowFlaks.map(f => f.y + f.height));
          bounds = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
        }
        break;
      }
      
      case 'tower': {
        const building = this.selectedItem.data[0];
        const towerManager = compositeBase.towerManager;
        let buildingObj = null;
        if (building === 'left') buildingObj = towerManager?.militaryBuilding;
        else if (building === 'right') buildingObj = towerManager?.militaryBuildingRight;
        else if (building === 'radar') buildingObj = towerManager?.radarBuilding;
        else if (building === 'jammer') buildingObj = towerManager?.jammerBuilding;
        else if (building === 'detector') buildingObj = towerManager?.detectorBuilding;
        
        if (buildingObj) {
          bounds = { x: buildingObj.x, y: buildingObj.y, width: buildingObj.width, height: buildingObj.height };
        }
        break;
      }
      
      case 'extension': {
        const building = this.selectedItem.data[0];
        const extensionManager = compositeBase.extensionManager;
        let buildingObj = null;
        if (building === 'ministry') buildingObj = extensionManager?.ministryBuilding;
        else if (building === 'militaryOffice') buildingObj = extensionManager?.officeBuilding;
        else if (building === 'groupLimit') buildingObj = extensionManager?.groupBuilding;
        
        if (buildingObj) {
          bounds = { x: buildingObj.x, y: buildingObj.y, width: buildingObj.width, height: buildingObj.height };
        }
        break;
      }
      
      case 'command': {
        const commandBuilding = compositeBase.commandManager?.commandBuilding;
        if (commandBuilding) {
          bounds = { x: commandBuilding.x, y: commandBuilding.y, width: commandBuilding.width, height: commandBuilding.height };
        }
        break;
      }
      
      case 'longrange': {
        const longRangeBuilding = compositeBase.garageUI?.longRangeBuilding;
        if (longRangeBuilding) {
          bounds = { x: longRangeBuilding.x, y: longRangeBuilding.y, width: longRangeBuilding.width, height: longRangeBuilding.height };
        }
        break;
      }
      
      case 'garage': {
        const garageSection = compositeBase.garageSection;
        if (garageSection?.garageImageObj) {
          const garage = garageSection.garageImageObj;
          bounds = { x: garage.x, y: garage.y, width: garage.width, height: garage.height };
        }
        break;
      }
      
      case 'aircraftcarrier': {
        const aircraftCarrierSection = compositeBase.aircraftCarrierSection;
        if (aircraftCarrierSection?.structureObj) {
          const carrier = aircraftCarrierSection.structureObj;
          bounds = { x: carrier.x, y: carrier.y, width: carrier.width, height: carrier.height };
        }
        break;
      }
    }
    
    if (bounds) {
      ctx.strokeRect(
        bounds.x - offsetX,
        bounds.y - offsetY,
        bounds.width,
        bounds.height
      );
      
      // Draw anchor point
      ctx.fillStyle = '#378ADD';
      ctx.beginPath();
      
      // For garage, anchor point is at base center + offset
      // For other items, anchor point is at garage + offset
      let anchorX, anchorY;
      if (this.selectedItem.type === 'garage') {
        // Garage: anchor at base center + offset (where garage is positioned from)
        const garageSection = compositeBase.garageSection;
        if (garageSection) {
          const baseCenterX = garageSection.baseX + garageSection.baseWidth / 2;
          const baseCenterY = garageSection.baseY + garageSection.baseHeight / 2;
          anchorX = baseCenterX + position.x;
          anchorY = baseCenterY + position.y;
        } else {
          anchorX = bounds.x;
          anchorY = bounds.y;
        }
      } else {
        // Other items: anchor at garage + offset
        anchorX = garageX + position.x;
        anchorY = garageY + position.y;
      }
      
      ctx.arc(
        anchorX - offsetX,
        anchorY - offsetY,
        6,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Draw label
      ctx.fillStyle = 'rgba(55, 138, 221, 0.9)';
      ctx.fillRect(
        bounds.x - offsetX,
        bounds.y - offsetY - 25,
        ctx.measureText(position.name).width + 16,
        20
      );
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(position.name, bounds.x - offsetX + 8, bounds.y - offsetY - 10);
    }
    
    ctx.restore();
  }

  saveConfig() {
    if (!this.selectedItem) return;
    
    const position = this.getItemPosition(this.selectedItem);
    if (!position) return;
    
    // Generate the config file content
    let configContent = '';
    let fileName = '';
    
    switch (this.selectedItem.type) {
      case 'factory':
      case 'effect':
        fileName = 'FactoryConfig.js';
        configContent = this.generateFactoryConfig();
        break;
      case 'wall':
        fileName = 'WallConfig.js';
        configContent = this.generateWallConfig();
        break;
      case 'flak':
        fileName = 'FlakConfig.js';
        configContent = this.generateFlakConfig();
        break;
    }
    
    // Show success message
    alert(`✅ Config updated!\n\nFile: ${fileName}\nPath: ${position.configPath}\nX: ${position.x}, Y: ${position.y}\n\nNote: Changes are in memory. To persist, copy the config from console.`);
    
    console.log(`%c📝 Updated Config for ${fileName}`, 'color: #1D9E75; font-weight: bold; font-size: 14px;');
    console.log(configContent);
  }

  generateFactoryConfig() {
    return `// Updated FactoryConfig\nexport const FactoryConfig = ${JSON.stringify(FactoryConfig, null, 2)};`;
  }

  generateWallConfig() {
    return `// Updated WallConfig\nexport const WALL_CONFIG = ${JSON.stringify(WALL_CONFIG, null, 2)};`;
  }

  generateFlakConfig() {
    return `// Updated FlakConfig\nexport const FLAK_CONFIG = ${JSON.stringify(FLAK_CONFIG, null, 2)};`;
  }
}

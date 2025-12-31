import { getStoredImage, storeImage, removeStoredImage } from './imageStorage';
import defaultConfig from '../config/defaults.json';

// Keys for localStorage
const KEYS = {
  WIDGETS: 'widgets',
  BACKGROUND: 'background',
  BACKGROUND_TYPE: 'backgroundType',
  CUSTOM_SOLID_COLOR: 'customSolidColor',
  CUSTOM_GRADIENT_COLORS: 'customGradientColors',
  BACKGROUND_BLUR: 'backgroundBlur',
  BACKGROUND_OVERLAY: 'backgroundOverlay',
  GRID_COLUMNS_SMALL: 'gridColumnsSmall',
  GRID_COLUMNS_MEDIUM: 'gridColumnsMedium',
  GRID_COLUMNS_LARGE: 'gridColumnsLarge',
  WIDGET_ALIGNMENT_HORIZONTAL: 'widgetAlignmentHorizontal',
  WIDGET_ALIGNMENT_VERTICAL: 'widgetAlignmentVertical',
  SEARCH_PROVIDER: 'searchProvider',
};

export default class SettingsManager {
  // Getters
  static getWidgets() {
    const saved = localStorage.getItem(KEYS.WIDGETS);
    return saved ? JSON.parse(saved) : defaultConfig.widgets;
  }

  static getBackground() {
    const saved = localStorage.getItem(KEYS.BACKGROUND);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Legacy format - convert to new format
        if (saved.startsWith('solid-') || saved.startsWith('gradient-')) {
          return saved;
        }
        return defaultConfig.background;
      }
    }
    return defaultConfig.background;
  }

  static getBackgroundType() {
    return localStorage.getItem(KEYS.BACKGROUND_TYPE) || defaultConfig.backgroundType;
  }

  static getCustomSolidColor() {
    return localStorage.getItem(KEYS.CUSTOM_SOLID_COLOR) || defaultConfig.customSolidColor;
  }

  static getCustomGradientColors() {
    const saved = localStorage.getItem(KEYS.CUSTOM_GRADIENT_COLORS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultConfig.customGradientColors;
      }
    }
    return defaultConfig.customGradientColors;
  }

  static getCustomBackgroundImage() {
    return getStoredImage('customBackgroundImage');
  }

  static getBackgroundBlur() {
    const saved = localStorage.getItem(KEYS.BACKGROUND_BLUR);
    return saved ? parseFloat(saved) : defaultConfig.backgroundBlur;
  }

  static getBackgroundOverlay() {
    const saved = localStorage.getItem(KEYS.BACKGROUND_OVERLAY);
    return saved ? parseFloat(saved) : defaultConfig.backgroundOverlay;
  }

  static getGridColumnsSmall() {
    const saved = localStorage.getItem(KEYS.GRID_COLUMNS_SMALL);
    return saved ? parseInt(saved) : (defaultConfig.gridColumnsSmall ?? 1);
  }

  static getGridColumnsMedium() {
    const saved = localStorage.getItem(KEYS.GRID_COLUMNS_MEDIUM);
    return saved ? parseInt(saved) : (defaultConfig.gridColumnsMedium ?? 2);
  }

  static getGridColumnsLarge() {
    const saved = localStorage.getItem(KEYS.GRID_COLUMNS_LARGE);
    return saved ? parseInt(saved) : (defaultConfig.gridColumnsLarge ?? defaultConfig.gridColumns ?? 6);
  }

  static getWidgetAlignmentHorizontal() {
    const saved = localStorage.getItem(KEYS.WIDGET_ALIGNMENT_HORIZONTAL);
    return saved || defaultConfig.widgetAlignmentHorizontal || 'left';
  }

  static getWidgetAlignmentVertical() {
    const saved = localStorage.getItem(KEYS.WIDGET_ALIGNMENT_VERTICAL);
    return saved || defaultConfig.widgetAlignmentVertical || 'center';
  }

  static getSearchProvider() {
    return localStorage.getItem(KEYS.SEARCH_PROVIDER) || null;
  }

  // Setters
  static saveWidgets(widgets) {
    localStorage.setItem(KEYS.WIDGETS, JSON.stringify(widgets));
  }

  static saveBackground(background) {
    if (typeof background === 'object' && background !== null) {
      localStorage.setItem(KEYS.BACKGROUND, JSON.stringify(background));
    } else {
      localStorage.setItem(KEYS.BACKGROUND, background);
    }
  }

  static saveBackgroundType(backgroundType) {
    localStorage.setItem(KEYS.BACKGROUND_TYPE, backgroundType);
  }

  static saveCustomSolidColor(color) {
    localStorage.setItem(KEYS.CUSTOM_SOLID_COLOR, color);
  }

  static saveCustomGradientColors(colors) {
    localStorage.setItem(KEYS.CUSTOM_GRADIENT_COLORS, JSON.stringify(colors));
  }

  static async saveCustomBackgroundImage(image) {
    if (image) {
      await storeImage('customBackgroundImage', image);
    } else {
      removeStoredImage('customBackgroundImage');
    }
  }

  static saveBackgroundBlur(blur) {
    localStorage.setItem(KEYS.BACKGROUND_BLUR, blur.toString());
  }

  static saveBackgroundOverlay(overlay) {
    localStorage.setItem(KEYS.BACKGROUND_OVERLAY, overlay.toString());
  }

  static saveGridColumnsSmall(columns) {
    localStorage.setItem(KEYS.GRID_COLUMNS_SMALL, columns.toString());
  }

  static saveGridColumnsMedium(columns) {
    localStorage.setItem(KEYS.GRID_COLUMNS_MEDIUM, columns.toString());
  }

  static saveGridColumnsLarge(columns) {
    localStorage.setItem(KEYS.GRID_COLUMNS_LARGE, columns.toString());
  }

  static saveWidgetAlignmentHorizontal(alignment) {
    localStorage.setItem(KEYS.WIDGET_ALIGNMENT_HORIZONTAL, alignment);
  }

  static saveWidgetAlignmentVertical(alignment) {
    localStorage.setItem(KEYS.WIDGET_ALIGNMENT_VERTICAL, alignment);
  }

  static saveSearchProvider(provider) {
    if (provider) {
      localStorage.setItem(KEYS.SEARCH_PROVIDER, provider);
    }
  }

  // Clear functions
  static clearWidgets() {
    localStorage.removeItem(KEYS.WIDGETS);
  }

  static clearBackground() {
    localStorage.removeItem(KEYS.BACKGROUND);
  }

  static clearBackgroundType() {
    localStorage.removeItem(KEYS.BACKGROUND_TYPE);
  }

  static clearCustomSolidColor() {
    localStorage.removeItem(KEYS.CUSTOM_SOLID_COLOR);
  }

  static clearCustomGradientColors() {
    localStorage.removeItem(KEYS.CUSTOM_GRADIENT_COLORS);
  }

  static clearBackgroundBlur() {
    localStorage.removeItem(KEYS.BACKGROUND_BLUR);
  }

  static clearBackgroundOverlay() {
    localStorage.removeItem(KEYS.BACKGROUND_OVERLAY);
  }

  static clearGridColumns() {
    localStorage.removeItem('gridColumns'); // Legacy key
  }

  static clearWidgetAlignments() {
    localStorage.removeItem(KEYS.WIDGET_ALIGNMENT_HORIZONTAL);
    localStorage.removeItem(KEYS.WIDGET_ALIGNMENT_VERTICAL);
  }

  // Bulk operations
  static getAll() {
    return {
      version: '1.0',
      widgets: this.getWidgets(),
      background: this.getBackground(),
      backgroundType: this.getBackgroundType(),
      customSolidColor: this.getCustomSolidColor(),
      customGradientColors: this.getCustomGradientColors(),
      customBackgroundImage: this.getCustomBackgroundImage(),
      backgroundBlur: this.getBackgroundBlur(),
      backgroundOverlay: this.getBackgroundOverlay(),
      gridColumnsSmall: this.getGridColumnsSmall(),
      gridColumnsMedium: this.getGridColumnsMedium(),
      gridColumnsLarge: this.getGridColumnsLarge(),
      widgetAlignmentHorizontal: this.getWidgetAlignmentHorizontal(),
      widgetAlignmentVertical: this.getWidgetAlignmentVertical(),
      searchProvider: this.getSearchProvider(),
    };
  }

  static async import(importData) {
    // Validate version
    if (!importData.version) {
      throw new Error('Invalid settings file format');
    }

    const settings = {};

    // Import widgets
    if (importData.widgets) {
      settings.widgets = importData.widgets;
      this.saveWidgets(importData.widgets);
    }

    // Import background settings
    if (importData.background) {
      settings.background = importData.background;
      this.saveBackground(importData.background);
    }
    if (importData.backgroundType) {
      settings.backgroundType = importData.backgroundType;
      this.saveBackgroundType(importData.backgroundType);
    }
    if (importData.customSolidColor) {
      settings.customSolidColor = importData.customSolidColor;
      this.saveCustomSolidColor(importData.customSolidColor);
    }
    if (importData.customGradientColors) {
      settings.customGradientColors = importData.customGradientColors;
      this.saveCustomGradientColors(importData.customGradientColors);
    }
    if (importData.customBackgroundImage) {
      settings.customBackgroundImage = importData.customBackgroundImage;
      await storeImage('customBackgroundImage', importData.customBackgroundImage);
    } else {
      settings.customBackgroundImage = null;
      removeStoredImage('customBackgroundImage');
    }
    if (importData.backgroundBlur !== undefined) {
      settings.backgroundBlur = importData.backgroundBlur;
      this.saveBackgroundBlur(importData.backgroundBlur);
    }
    if (importData.backgroundOverlay !== undefined) {
      settings.backgroundOverlay = importData.backgroundOverlay;
      this.saveBackgroundOverlay(importData.backgroundOverlay);
    }
    if (importData.gridColumnsSmall !== undefined) {
      settings.gridColumnsSmall = importData.gridColumnsSmall;
      this.saveGridColumnsSmall(importData.gridColumnsSmall);
    }
    if (importData.gridColumnsMedium !== undefined) {
      settings.gridColumnsMedium = importData.gridColumnsMedium;
      this.saveGridColumnsMedium(importData.gridColumnsMedium);
    }
    if (importData.gridColumnsLarge !== undefined) {
      settings.gridColumnsLarge = importData.gridColumnsLarge;
      this.saveGridColumnsLarge(importData.gridColumnsLarge);
    }
    // Legacy support: if old gridColumns exists, use it for large
    if (importData.gridColumns !== undefined && importData.gridColumnsLarge === undefined) {
      settings.gridColumnsLarge = importData.gridColumns;
      this.saveGridColumnsLarge(importData.gridColumns);
    }

    // Import search provider
    if (importData.searchProvider) {
      this.saveSearchProvider(importData.searchProvider);
    }

    return settings;
  }

  static clearAll() {
    this.clearWidgets();
    this.clearBackground();
    this.clearBackgroundType();
    this.clearCustomSolidColor();
    this.clearCustomGradientColors();
    this.clearBackgroundBlur();
    this.clearBackgroundOverlay();
    this.clearGridColumns();
    this.clearWidgetAlignments();
    removeStoredImage('customBackgroundImage');
  }
}


import { LitElement, css, PropertyValues } from 'lit';
import { query } from 'lit/decorators.js';
import { adwaitaTheme } from './theme';
import { RendererManager } from './renderer-manager';

/**
 * GtkElement is the base class for all widgets in the toolkit.
 * It provides common infrastructure for rendering, resizing, and theme access.
 * Components inheriting from GtkElement rendered their visual representation
 * to an OffscreenCanvas via a RendererManager.
 */
export class GtkElement extends LitElement {
  static styles = [
    adwaitaTheme,
    css`
      :host {
        position: relative;
        display: inline-block;
      }
      canvas {
        display: block;
        pointer-events: none;
      }
      .semantic-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 1;
      }
    `
  ];

  /**
   * Reference to the canvas element used for rendering.
   */
  @query('canvas') canvasElement!: HTMLCanvasElement;

  /**
   * Unique identifier for the element, used for communication with the renderer worker.
   */
  protected elementId = Math.random().toString(36).substring(2, 11);
  
  /**
   * Instance of the RendererManager used for scheduling draw calls.
   */
  protected renderer = RendererManager.getInstance();
  
  /**
   * Observer tracking size changes of the host element.
   */
  protected observer?: ResizeObserver;

  /**
   * Initializes the offscreen canvas and sets up the ResizeObserver.
   */
  firstUpdated() {
    if (this.canvasElement) {
      // Transfer control to offscreen if not already done
      try {
        const offscreen = this.canvasElement.transferControlToOffscreen();
        this.renderer.registerCanvas(this.elementId, offscreen);
      } catch (e) {
        // Fallback for browsers without transferControlToOffscreen or if already transferred
        console.warn('Canvas control already transferred or not supported', e);
      }

      this._setupObserver();
    }
    this.requestRender();
  }

  private _setupObserver() {
    this.observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const dpr = window.devicePixelRatio || 1;
      this.renderer.resize(this.elementId, width * dpr, height * dpr);
      this.requestRender();
    });
    this.observer.observe(this);
  }

  /**
   * Cleans up the ResizeObserver when the element is removed from the DOM.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  /**
   * Triggers a re-render when properties change.
   * @param changedProperties Map of changed properties.
   */
  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    this.requestRender();
  }

  /**
   * Retrieves current theme properties from computed styles.
   * @returns Object containing theme-related CSS variable values.
   */
  protected getThemeProps() {
    const styles = getComputedStyle(this);
    return {
      windowBg: styles.getPropertyValue('--gtk-window-bg'),
      buttonBg: styles.getPropertyValue('--gtk-button-bg'),
      buttonActiveBg: styles.getPropertyValue('--gtk-button-active-bg'),
      buttonFg: styles.getPropertyValue('--gtk-button-fg'),
      accentBg: styles.getPropertyValue('--gtk-accent-bg'),
      borderColor: styles.getPropertyValue('--gtk-border-color'),
      switchBg: styles.getPropertyValue('--gtk-switch-bg'),
      switchActiveBg: styles.getPropertyValue('--gtk-switch-active-bg'),
    };
  }

  protected requestRender() {
    // To be implemented by subclasses
  }
}

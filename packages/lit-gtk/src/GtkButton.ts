import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { GtkElement } from './base-element';

/**
 * GtkButton is a standard button component with support for multiple variants
 * and semantic styling (suggested, destructive). It mimics AdwButton.
 * 
 * @element gtk-button
 */
@customElement('gtk-button')
export class GtkButton extends GtkElement {
  /**
   * Text label to display inside the button.
   */
  @property({ type: String }) label = '';

  /**
   * Icon (URL or emoji) to display before the label.
   */
  @property({ type: String }) icon = '';

  /**
   * Tooltip text shown when hovering over the button.
   */
  @property({ type: String }) tooltip = '';

  /**
   * Visual style variant of the button.
   */
  @property({ type: String }) variant: 'normal' | 'suggested' | 'destructive' | 'flat' | 'outline' = 'normal';

  /**
   * Semantic shortcut for variant="suggested".
   */
  @property({ type: Boolean }) suggested = false;

  /**
   * Semantic shortcut for variant="destructive".
   */
  @property({ type: Boolean }) destructive = false;

  /**
   * If true, the button is non-interactive.
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Reflects the current pressed state of the button.
   */
  @property({ type: Boolean }) active = false;

  /**
   * Internal state tracking tooltip visibility.
   */
  @property({ type: Boolean, state: true }) showTooltip = false;

  static styles = [
    ...GtkElement.styles,
    css`
      :host {
        min-width: 34px;
        min-height: 34px;
        cursor: pointer;
        display: inline-block;
        position: relative;
      }
      :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .tooltip {
        position: absolute;
        bottom: 110%;
        left: 50%;
        transform: translateX(-50%);
        background: #2e3436;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        white-space: nowrap;
        pointer-events: none;
        z-index: 100;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      :host(:hover) .tooltip.visible {
        opacity: 1;
      }
    `
  ];

  protected requestRender() {
    const rect = this.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.renderer.render({
      id: this.elementId,
      type: 'button',
      props: { 
        label: this.label, 
        icon: this.icon,
        variant: this.variant,
        suggested: this.suggested, 
        destructive: this.destructive,
        active: this.active 
      },
      theme: this.getThemeProps(),
      width: rect.width * dpr || 80,
      height: rect.height * dpr || 34
    });
  }

  private _onMouseDown() { if (!this.disabled) this.active = true; }
  private _onMouseUp() { this.active = false; }
  private _onMouseEnter() { if (this.tooltip) this.showTooltip = true; }
  private _onMouseLeave() { this.showTooltip = false; this.active = false; }

  render() {
    return html`
      <canvas width="80" height="34"></canvas>
      <button 
        class="semantic-layer text-[0px]"
        ?disabled=${this.disabled}
        @mousedown=${this._onMouseDown}
        @mouseup=${this._onMouseUp}
        @mouseenter=${this._onMouseEnter}
        @mouseleave=${this._onMouseLeave}
        aria-label=${this.label}
      >
        ${this.label}
      </button>
      ${this.tooltip ? html`<div class="tooltip ${this.showTooltip ? 'visible' : ''}">${this.tooltip}</div>` : ''}
    `;
  }
}
